'use client'

/**
 * Last-resort boundary. Catches errors thrown in the root layout itself, where
 * `error.tsx` cannot run because the layout that renders it is the thing that
 * failed. It must supply its own <html>/<body>, and it cannot rely on the app's
 * CSS variables having loaded, so the styling here is deliberately inline.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    // Hardcoded 'en': this boundary sits above the [locale] segment and
    // replaces the root layout, so there is no locale for it to read.
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
        <h1 style={{ fontSize: '1.75rem', fontWeight: 400 }}>
          The site failed to load.
        </h1>
        <p style={{ color: '#4A5874' /* --fg-muted-rgb (light) */, maxWidth: '38ch', lineHeight: 1.6 }}>
          {error.message || 'Reload the page to try again.'}
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: '0.5rem',
            padding: '0.75rem 1.5rem',
            border: '1px solid rgba(19, 39, 74, 0.15)', // --line (light)
            background: 'transparent',
            color: 'inherit',
            font: 'inherit',
            cursor: 'pointer',
          }}
        >
          Reload
        </button>
      </body>
    </html>
  )
}
