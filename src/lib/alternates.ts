import type { Metadata } from 'next'
import { locales, localeTags, defaultLocale, type Locale } from '@/i18n/config'
import { siteUrl } from '@/lib/site-url'

/**
 * Absolute URL of one page in one locale, always ending in `/` to match the
 * static export's `trailingSlash: true` (a slash-less URL would point at a
 * redirect). `path` is the route WITHOUT a locale prefix, leading-slashed:
 * '/' for home, '/work' for the Work page. A trailing slash on
 * `path` is tolerated.
 */
export function pageUrl(locale: Locale, path: string): string {
  const trimmed = path.replace(/\/+$/, '')
  return `${siteUrl}/${locale}${trimmed}/`
}

/** hreflang map for one path: every locale plus x-default. */
export function languagesFor(path: string): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const l of locales) languages[localeTags[l]] = pageUrl(l, path)
  // x-default points at the locale a visitor with no preference should get.
  languages['x-default'] = pageUrl(defaultLocale, path)
  return languages
}

/**
 * Canonical + hreflang for one page, in every locale. Every page goes through
 * this so no page hand-rolls its own alternates and they cannot drift apart.
 */
export function alternatesFor(path: string, locale: Locale): Metadata['alternates'] {
  return { canonical: pageUrl(locale, path), languages: languagesFor(path) }
}
