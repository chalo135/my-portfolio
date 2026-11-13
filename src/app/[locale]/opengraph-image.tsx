import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { getSite } from '@/content/site'
import { locales, isLocale, defaultLocale } from '@/i18n/config'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Satori has no access to next/font, so the display face is read from the same
 * TTF the layout loads and handed to ImageResponse directly. Without this the
 * card renders in a generic font and looks nothing like the site.
 *
 * TTF rather than WOFF2 on purpose — Satori reads TTF/OTF/WOFF only. And a
 * STATIC instance, not the variable file the layout uses: Satori cannot parse
 * variable fonts and the build crashes ("reading '258'"). Cinzel-Regular.ttf
 * is the wght=400 instance, cut from Cinzel-Variable.ttf with
 *   python -m fontTools.varLib.instancer Cinzel-Variable.ttf wght=400 --static -o Cinzel-Regular.ttf
 * Cinzel, SIL Open Font License 1.1 — see src/app/fonts/cinzel/OFL.txt.
 */
const displayFont = readFile(
  join(process.cwd(), 'src', 'app', 'fonts', 'cinzel', 'Cinzel-Regular.ttf')
)

/** One OG image per locale, both generated at build time. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const dynamicParams = false

// generateImageMetadata would give a per-locale alt, but it adds a hidden
// [__metadata_id__] segment that `output: 'export'` cannot prerender. So both
// locales share one alt: the name and role from the default locale.
export const alt = `${getSite(defaultLocale).site.name}, ${getSite(defaultLocale).site.role}`

// Rendered at build time. Satori cannot read CSS variables, so the card is a
// literal copy of the hero board: white lettering on crimson.
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : defaultLocale
  const { site } = getSite(locale)
  const fontData = await displayFont

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#A8141C', // --board-rgb / --accent-rgb (light)
          color: '#FFFFFF', // --on-accent-rgb (light)
          padding: '72px 80px',
          fontFamily: 'Cinzel',
        }}
      >
        {/* Full white, not muted: --fg-muted is for white and surface only. */}
        <div style={{ display: 'flex', fontSize: 26 }}>
          {site.role}, {site.location}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 76, lineHeight: 1.1, maxWidth: 940 }}>
            {site.tagline}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 36,
              height: 3,
              width: 128,
              background: '#E3A92B', // --highlight-rgb (light); gold as a rule, never as text
            }}
          />
        </div>

        <div style={{ display: 'flex', fontSize: 30 }}>{site.name}</div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Cinzel', data: fontData, weight: 400, style: 'normal' }],
    }
  )
}
