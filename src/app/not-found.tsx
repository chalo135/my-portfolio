import Link from 'next/link'
import { getPages } from '@/content/pages'
import { defaultLocale } from '@/i18n/config'
import { localeHref } from '@/lib/locale-href'

/**
 * Root 404, for paths that match no locale segment at all (/nope, /de/about).
 * It sits above [locale] and so has no locale to read — it renders in the
 * default locale and points at that locale's home.
 *
 * Next requires a root layout for this route, which the [locale] layout cannot
 * provide, so the markup here is self-contained and inline-styled the same way
 * global-error.tsx is.
 */
export default function RootNotFound() {
  const { notFound: copy } = getPages(defaultLocale)

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
          background: '#FFFFFF', // --bg-rgb (light)
          color: '#13274A', // --fg-rgb (light)
          // Outside the layout, so no Cinzel: its fallback stack instead.
          fontFamily: '"Trajan Pro", "Palatino Linotype", Palatino, Georgia, serif',
        }}
      >
        <p style={{ fontSize: '0.8rem', color: '#4A5874' /* --fg-muted-rgb (light) */ }}>404</p>
        <h1 style={{ fontSize: '2rem', fontWeight: 400, margin: 0 }}>{copy.title}</h1>
        <p style={{ color: '#4A5874' /* --fg-muted-rgb (light) */, maxWidth: '38ch', lineHeight: 1.6 }}>{copy.body}</p>
        <Link href={localeHref('/', defaultLocale)} style={{ color: '#13274A' /* --fg-rgb (light) */ }}>
          {copy.back}
        </Link>
      </body>
    </html>
  )
}
