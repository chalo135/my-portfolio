import type { MetadataRoute } from 'next'
import { routePaths } from '@/content/site'
import { locales } from '@/i18n/config'
import { pageUrl, languagesFor } from '@/lib/alternates'

// Generated once at build time and served as a static file.
export const dynamic = 'force-static'

/** The four pages, in every locale. Stays at src/app/ so it serves /sitemap.xml. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return locales.flatMap((locale) =>
    routePaths.map((path) => ({
      url: pageUrl(locale, path),
      alternates: { languages: languagesFor(path) },
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : 0.7,
    }))
  )
}
