import type { MetadataRoute } from 'next'
import { getSite, logo } from '@/content/site'
import { defaultLocale } from '@/i18n/config'

// Static export: written to out/manifest.webmanifest at build time.
export const dynamic = 'force-static'

/** Web app manifest. Colours are the cream desk, as in the layout's themeColor. */
export default function manifest(): MetadataRoute.Manifest {
  const { site } = getSite(defaultLocale)
  return {
    name: site.name,
    short_name: logo,
    description: site.description,
    start_url: `/${defaultLocale}/`,
    display: 'browser',
    theme_color: '#F5F1E6',
    background_color: '#F5F1E6',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  }
}
