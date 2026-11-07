// Checks every https:// URL in the project data still answers.
//
//   npm run check:links
//
// No dependencies: Node 18+ fetch only. Deliberately NOT part of `build` — a
// build should not fail because a client's server is down for a minute.
//
// A 200 does not prove the page renders. A blank React page, or a sign-up
// form whose API is dead, still returns 200. Open each live link by eye
// before every deploy; this only catches the links that are plainly gone.

import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const CONTENT_DIR = join(process.cwd(), 'src', 'content')
const TIMEOUT_MS = 10_000

const files = (await readdir(CONTENT_DIR)).filter((name) => /^projects.*\.ts$/.test(name))

// Collected across files so a URL shared by the English and Kiswahili data is
// requested once.
const urls = new Set()
for (const name of files) {
  const text = await readFile(join(CONTENT_DIR, name), 'utf8')
  for (const match of text.matchAll(/https:\/\/[^\s'"`)<>\]]+/g)) urls.add(match[0])
}

if (urls.size === 0) {
  console.log(`No https:// URLs in ${files.join(', ')}. Nothing to check.`)
  process.exit(0)
}

async function check(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    // GET rather than HEAD: plenty of hosts answer HEAD with 405 or 404.
    const res = await fetch(url, { redirect: 'follow', signal: controller.signal })
    return { url, status: String(res.status), ok: res.ok }
  } catch (error) {
    const reason = error.name === 'AbortError' ? 'timeout' : error.cause?.code ?? error.message
    return { url, status: reason, ok: false }
  } finally {
    clearTimeout(timer)
  }
}

const results = await Promise.all([...urls].map(check))

const urlWidth = Math.max(3, ...results.map((r) => r.url.length))
const statusWidth = Math.max(6, ...results.map((r) => r.status.length))
console.log(`${'URL'.padEnd(urlWidth)}  ${'STATUS'.padEnd(statusWidth)}  RESULT`)
for (const r of results) {
  console.log(`${r.url.padEnd(urlWidth)}  ${r.status.padEnd(statusWidth)}  ${r.ok ? 'OK' : 'BROKEN'}`)
}

const broken = results.filter((r) => !r.ok).length
console.log(`\n${results.length} checked, ${broken} broken.`)
process.exit(broken > 0 ? 1 : 0)
