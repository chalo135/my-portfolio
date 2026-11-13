// Checks the static export in out/ before it ships.
//
//   npm run build && npm run check:export
//
// No dependencies: Node 18+ built-ins only. Exits 1 on any failure.
//
//   1. The server files exist: .htaccess, 404.html, robots.txt, sitemap.xml.
//   2. Every route in routePaths exported, in every locale.
//   3. Every internal href / src / srcset / og:image / twitter:image in every
//      HTML file resolves to a file in out/.
//   4. Every canonical and hreflang URL is on the live origin, ends in `/`,
//      and resolves the same way.
//
// Routes, locales and the origin are read from the source files, so
// this script has no list of its own to keep in sync.

import { existsSync, statSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { join, posix, relative, sep } from 'node:path'

const ROOT = process.cwd()
const OUT = join(ROOT, 'out')

const read = (...parts) => readFile(join(ROOT, ...parts), 'utf8')
const allMatches = (text, re) => [...text.matchAll(re)].map((m) => m[1])

/* --- what the site should contain, from source ---------------------------- */

const origin = (await read('src', 'lib', 'site-url.ts')).match(/siteUrl\s*=\s*'([^']+)'/)?.[1]
if (!origin) fail('Could not read siteUrl from src/lib/site-url.ts')

const i18n = await read('src', 'i18n', 'config.ts')
const localeList = i18n.match(/locales\s*=\s*\[([^\]]*)\]/)?.[1]
const locales = localeList ? allMatches(localeList, /'([^']+)'/g) : []

const siteTs = await read('src', 'content', 'site.ts')
const routeList = siteTs.match(/routePaths\s*=\s*\[([^\]]*)\]/)?.[1] ?? ''
const routes = new Set(allMatches(routeList, /'([^']+)'/g))

const failures = []
function fail(message) {
  console.error(`check-export: ${message}`)
  process.exit(1)
}

if (!existsSync(OUT)) fail('out/ does not exist. Run `npm run build` first.')
if (routes.size === 0) {
  fail('Read no routes from src/content/site.ts. Has the source layout changed?')
}

/* --- 1. server files ------------------------------------------------------ */

for (const file of ['.htaccess', '404.html', 'robots.txt', 'sitemap.xml']) {
  if (!existsSync(join(OUT, file))) failures.push({ where: 'out/', what: `missing ${file}` })
}

/* --- 2. every page exported ----------------------------------------------- */

const pagePaths = [...routes]
const prefixes = locales.length > 0 ? locales.map((l) => `/${l}`) : ['']
let expectedPages = 0
for (const prefix of prefixes) {
  for (const path of pagePaths) {
    expectedPages++
    const rel = `${prefix}${path === '/' ? '' : path}/index.html`
    if (!existsSync(join(OUT, ...rel.split('/')))) {
      failures.push({ where: 'out/', what: `missing page ${rel}` })
    }
  }
}

/* --- 3 + 4. links in every HTML file -------------------------------------- */

/** Paths the .htaccess redirects, so a link to them still lands somewhere. */
const redirected = new Set(locales.length > 0 ? ['/'] : [])

async function htmlFiles(dir) {
  const found = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) found.push(...(await htmlFiles(full)))
    else if (entry.name.endsWith('.html')) found.push(full)
  }
  return found
}

const decodeEntities = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")

/** Turns a URL found in `fromFile` into an out/-relative path, or null when it
 *  is not internal (external origin, mailto:, data:, a bare #hash …). */
function internalPath(raw, fromFile) {
  let url = decodeEntities(raw.trim())
  if (url === '' || url.startsWith('#')) return null
  if (url.startsWith(origin)) url = url.slice(origin.length) || '/'
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//')) return null
  url = url.split('#')[0].split('?')[0]
  if (url === '') return null
  if (!url.startsWith('/')) {
    // Relative URL: resolve against the page's own directory.
    const dir = '/' + relative(OUT, fromFile).split(sep).slice(0, -1).join('/')
    url = posix.join(dir, url) + (url.endsWith('/') ? '/' : '')
  }
  try {
    return decodeURI(url)
  } catch {
    return url
  }
}

/** Whether an out/-relative URL path is served as a file, without a redirect. */
function resolves(urlPath) {
  if (redirected.has(urlPath)) return true
  const target = urlPath.endsWith('/') ? `${urlPath}index.html` : urlPath
  const full = join(OUT, ...target.split('/').filter(Boolean))
  return existsSync(full) && statSync(full).isFile()
}

const attrRe = /\s(href|src|srcset|imagesrcset)\s*=\s*"([^"]*)"/gi
const metaImageRe = /<meta\b[^>]*\b(?:property|name)="(?:og:image|twitter:image)(?::url)?"[^>]*>/gi
const linkRelRe = /<link\b[^>]*\brel="(canonical|alternate)"[^>]*>/gi

const files = await htmlFiles(OUT)
let linksChecked = 0

for (const file of files) {
  const html = await readFile(file, 'utf8')
  const where = relative(ROOT, file).split(sep).join('/')
  const urls = []

  for (const [, attr, value] of html.matchAll(attrRe)) {
    if (/srcset/i.test(attr)) {
      for (const candidate of value.split(',')) urls.push(candidate.trim().split(/\s+/)[0])
    } else {
      urls.push(value)
    }
  }
  for (const [tag] of html.matchAll(metaImageRe)) {
    const content = tag.match(/\bcontent="([^"]*)"/)?.[1]
    if (content) urls.push(content)
  }

  for (const url of urls) {
    const path = internalPath(url, file)
    if (path === null) continue
    linksChecked++
    if (!resolves(path)) failures.push({ where, what: `broken link ${url}` })
  }

  // Canonical + hreflang: absolute, on the live origin, trailing slash, resolves.
  for (const [tag, rel] of html.matchAll(linkRelRe)) {
    if (rel === 'alternate' && !/\bhreflang=/i.test(tag)) continue
    const href = decodeEntities(tag.match(/\bhref="([^"]*)"/)?.[1] ?? '')
    linksChecked++
    if (!href.startsWith(`${origin}/`)) {
      failures.push({ where, what: `${rel} not on ${origin}: ${href}` })
    } else if (!href.endsWith('/')) {
      failures.push({ where, what: `${rel} has no trailing slash: ${href}` })
    } else if (!resolves(href.slice(origin.length))) {
      failures.push({ where, what: `${rel} does not resolve: ${href}` })
    }
  }
}

/* --- summary -------------------------------------------------------------- */

console.log(`Origin:         ${origin}`)
console.log(`Locales:        ${locales.join(', ') || '(none)'}`)
console.log(`Pages expected: ${expectedPages}`)
console.log(`HTML checked:   ${files.length}`)
console.log(`Links checked:  ${linksChecked}`)

if (failures.length > 0) {
  console.log(`\n${failures.length} failure(s):`)
  for (const f of failures) console.log(`  ${f.where}: ${f.what}`)
  process.exit(1)
}
console.log('\nAll checks passed.')
