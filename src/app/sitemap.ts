import type { MetadataRoute } from 'next'
import { routePaths } from '@/content/site'
import { projectSlugs } from '@/content/projects'
import { writingDates } from '@/content/writing'
import { locales, type Locale } from '@/i18n/config'
import { pageUrl, languagesFor } from '@/lib/alternates'

// Static export: written to out/sitemap.xml at build time.
export const dynamic = 'force-static'

/** Stays at src/app/ — under [locale] this would serve /en/sitemap.xml. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const entry = (locale: Locale, path: string, extra: Partial<MetadataRoute.Sitemap[number]>) => ({
    url: pageUrl(locale, path),
    alternates: { languages: languagesFor(path) },
    ...extra,
  })

  return locales.flatMap((locale) => [
    ...routePaths.map((path) =>
      entry(locale, path, {
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: path === '/' ? 1 : 0.7,
      })
    ),
    ...projectSlugs.map((slug) =>
      entry(locale, `/projects/${slug}`, {
        lastModified: now,
        changeFrequency: 'yearly' as const,
        priority: 0.6,
      })
    ),
    ...writingDates.map(({ slug, date }) =>
      entry(locale, `/writing/${slug}`, {
        lastModified: new Date(date),
        changeFrequency: 'yearly' as const,
        priority: 0.5,
      })
    ),
  ])
}
