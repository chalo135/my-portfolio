// Checks every page and every internal link of a running copy of the site.
//
//   npm run build && npm start        (in one terminal)
//   npm run check:links               (in another; checks http://localhost:3000)
//   npm run check:links -- https://charlesndirangu.com
//
// No dependencies: Node 18+ built-ins only. Exits 1 on any failure.
//
//   1. Reads /sitemap.xml and fetches every page in it. Each must be 200.
//   2. In each page: every internal href, src, srcset entry and og:image /
//      twitter:image URL is fetched once. 200 passes. A 307 or 308 passes
//      only if its target is 200 in one more hop.
//   3. Every canonical and hreflang URL is on the live domain and ends in /.
//   4. /does-not-exist/ answers 404.

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const base = (process.argv[2] ?? 'http://localhost:3000').replace(/\/+$/, '')
const TIMEOUT_MS = 20_000

// The live origin, read from the one place the site defines it.
const siteUrlSource = await readFile(join(process.cwd(), 'src', 'lib', 'site-url.ts'), 'utf8')
const live = siteUrlSource.match(/siteUrl\s*=\s*'([^']+)'/)?.[1]
if (!live) {
  console.error('check-links: could not read siteUrl from src/lib/site-url.ts')
  process.exit(1)
}

const failures = []
const fail = (where, what) => failures.push({ where, what })

async function get(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { redirect: 'manual', signal: controller.signal })
    return {
      status: res.status,
      location: res.headers.get('location'),
      type: res.headers.get('content-type') ?? '',
      text: () => res.text(),
      done: () => res.body?.cancel().catch(() => {}),
    }
  } catch (error) {
    const reason = error.name === 'AbortError' ? 'timeout' : (error.cause?.code ?? error.message)
    return { status: reason, location: null, type: '', text: async () => '', done: async () => {} }
  } finally {
    clearTimeout(timer)
  }
}

const decodeEntities = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")

/** A URL found on `pageUrl`, as a URL on the base, or null if it is not ours
 *  (another site, mailto:, data:, a bare #hash). Live-domain URLs are
 *  rewritten to the base. */
function internal(raw, pageUrl) {
  let url = decodeEntities(raw.trim())
  if (url === '' || url.startsWith('#')) return null
  if (url === live || url.startsWith(`${live}/`)) url = base + url.slice(live.length)
  let resolved
  try {
    resolved = new URL(url, pageUrl)
  } catch {
    return null
  }
  if (!/^https?:$/.test(resolved.protocol) || resolved.origin !== new URL(base).origin) return null
  resolved.hash = ''
  return resolved.href
}

/* --- 1. the sitemap and its pages ------------------------------------------ */

const sitemap = await get(`${base}/sitemap.xml`)
if (sitemap.status !== 200) {
  console.error(`check-links: ${base}/sitemap.xml answered ${sitemap.status}. Is the site running?`)
  process.exit(1)
}
const pages = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  decodeEntities(m[1].trim())
)
if (pages.length === 0) fail('/sitemap.xml', 'lists no pages')

/** link URL -> the page it was first found on */
const links = new Map()
let pagesOk = 0

for (const page of pages) {
  if (!page.startsWith(`${live}/`) || !page.endsWith('/')) {
    fail('/sitemap.xml', `not on ${live} with a trailing slash: ${page}`)
    continue
  }
  const pageUrl = base + page.slice(live.length)
  const where = page.slice(live.length)
  const res = await get(pageUrl)
  if (res.status !== 200) {
    fail(where, `page answered ${res.status}`)
    await res.done()
    continue
  }
  pagesOk++
  const html = await res.text()

  const found = []
  for (const [, attr, value] of html.matchAll(/\s(href|src|srcset|imagesrcset)\s*=\s*"([^"]*)"/gi)) {
    if (/srcset/i.test(attr)) {
      for (const candidate of value.split(',')) found.push(candidate.trim().split(/\s+/)[0])
    } else {
      found.push(value)
    }
  }
  for (const [tag] of html.matchAll(
    /<meta\b[^>]*\b(?:property|name)="(?:og:image|twitter:image)(?::url)?"[^>]*>/gi
  )) {
    const content = tag.match(/\bcontent="([^"]*)"/)?.[1]
    if (content) found.push(content)
  }
  for (const raw of found) {
    const url = internal(raw, pageUrl)
    if (url && !links.has(url)) links.set(url, where)
  }

  /* --- 3. canonical and hreflang ------------------------------------------ */
  for (const [tag, rel] of html.matchAll(/<link\b[^>]*\brel="(canonical|alternate)"[^>]*>/gi)) {
    if (rel === 'alternate' && !/\bhreflang=/i.test(tag)) continue
    const href = decodeEntities(tag.match(/\bhref="([^"]*)"/)?.[1] ?? '')
    if (!href.startsWith(`${live}/`)) fail(where, `${rel} not on ${live}: ${href}`)
    else if (!href.endsWith('/')) fail(where, `${rel} has no trailing slash: ${href}`)
  }
}

/* --- 2. every link, once --------------------------------------------------- */

async function checkLink(url, where) {
  const res = await get(url)
  await res.done()
  if (res.status === 200) return
  if (res.status === 307 || res.status === 308) {
    const target = res.location ? new URL(res.location, url).href : null
    if (!target) return fail(where, `${url} redirects (${res.status}) with no location`)
    const next = await get(target)
    await next.done()
    if (next.status !== 200) {
      fail(where, `${url} redirects (${res.status}) to ${target}, which answered ${next.status}`)
    }
    return
  }
  fail(where, `${url} answered ${res.status}`)
}

// A few at a time, so a small server is not flooded.
const queue = [...links]
await Promise.all(
  Array.from({ length: 6 }, async () => {
    for (let item = queue.shift(); item; item = queue.shift()) await checkLink(item[0], item[1])
  })
)

/* --- 4. a missing page is a 404 -------------------------------------------- */

const missing = await get(`${base}/does-not-exist/`)
await missing.done()
if (missing.status !== 404) fail('/does-not-exist/', `answered ${missing.status}, expected 404`)

/* --- summary ---------------------------------------------------------------- */

console.log(`Base URL:      ${base}`)
console.log(`Live domain:   ${live}`)
console.log(`Pages checked: ${pagesOk} of ${pages.length}`)
console.log(`Links checked: ${links.size}`)
console.log(`Missing page:  ${missing.status}`)

if (failures.length > 0) {
  console.log(`\n${failures.length} failure(s):`)
  for (const f of failures) console.log(`  ${f.where}: ${f.what}`)
  process.exit(1)
}
console.log('\nAll checks passed.')
