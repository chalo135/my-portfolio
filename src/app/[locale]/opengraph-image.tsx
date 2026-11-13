import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { getSite, logo } from '@/content/site'
import { locales, isLocale, defaultLocale } from '@/i18n/config'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Satori has no access to next/font and cannot parse variable fonts, so the
 * card reads static WOFF files: DM Sans 700 and Caveat 700, latin subset,
 * from the Fontsource packages (@fontsource/dm-sans and @fontsource/caveat
 * 5.3.0). Both SIL Open Font License 1.1; see src/app/fonts/og/OFL-*.txt.
 */
const fontDir = join(process.cwd(), 'src', 'app', 'fonts', 'og')
const dmSans = readFile(join(fontDir, 'dm-sans-latin-700-normal.woff'))
const caveat = readFile(join(fontDir, 'caveat-latin-700-normal.woff'))

/** One OG image per locale, both generated at build time. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const dynamicParams = false

// generateImageMetadata would give a per-locale alt, but it adds a hidden
// segment that `output: 'export'` cannot prerender. Both locales share one.
export const alt = `${getSite(defaultLocale).site.name}, ${getSite(defaultLocale).site.role}`

// Satori cannot read CSS variables, so the colours are literal copies of the
// light tokens.
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : defaultLocale
  const { site } = getSite(locale)
  const [dmSansData, caveatData] = await Promise.all([dmSans, caveat])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#F5F1E6', // --bg-rgb (light), the cream desk
          color: '#2A2622', // --fg-rgb (light)
          padding: '64px 80px',
          fontFamily: 'DM Sans',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: 'Caveat',
            fontSize: 96,
            lineHeight: 1,
            color: '#A8141C', // --accent-rgb (light)
          }}
        >
          {logo}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 88, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            {site.name}
          </div>
          <div style={{ display: 'flex', marginTop: 20, fontSize: 40, color: '#6B6458' /* --fg-muted-rgb (light) */ }}>
            {site.ogLine}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'DM Sans', data: dmSansData, weight: 700, style: 'normal' },
        { name: 'Caveat', data: caveatData, weight: 700, style: 'normal' },
      ],
    }
  )
}
