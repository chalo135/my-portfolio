import type { Locale } from '@/i18n/config'
import { isLocale } from '@/i18n/config'

/** Prefixes an app-relative href with the active locale. External URLs,
 *  mailto:, tel: and in-page anchors pass through untouched. */
export function localeHref(href: string, locale: Locale): string {
  if (!href.startsWith('/')) return href
  return `/${locale}${href === '/' ? '' : href}`
}

/** Reads the locale out of a pathname like `/sw/work`. Returns null
 *  when the path carries no locale segment, so callers can decide on a fallback
 *  rather than silently getting `en`. */
export function localeFromPathname(pathname: string): Locale | null {
  const segment = pathname.split('/')[1] ?? ''
  return isLocale(segment) ? segment : null
}

/** Swaps the leading locale segment for `target`, preserving the rest of the
 *  path. `/sw/work` → `/en/work`. A path with no locale
 *  segment falls back to the target locale's home. */
export function swapLocaleInPathname(pathname: string, target: Locale): string {
  const current = localeFromPathname(pathname)
  if (!current) return `/${target}`
  const rest = pathname.slice(`/${current}`.length)
  return `/${target}${rest}`
}
