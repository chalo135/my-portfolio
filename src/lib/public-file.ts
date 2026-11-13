import { existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Server-only. Whether a file exists under public/, checked at build time.
 * `href` is the public URL path, e.g. '/cv/charles-ndirangu-cv.pdf'.
 */
export function publicFileExists(href: string): boolean {
  return existsSync(join(process.cwd(), 'public', ...href.split('/').filter(Boolean)))
}

/** The first of `hrefs` that exists under public/, or undefined. */
export function firstPublicFile(hrefs: string[]): string | undefined {
  return hrefs.find(publicFileExists)
}
