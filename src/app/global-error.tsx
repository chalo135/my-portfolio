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
          background: '#F5F1E6', // --bg-rgb (light)
          color: '#2A2622', // --fg-rgb (light)
          // Outside the layout, so no DM Sans: its fallback stack instead.
          fontFamily: '"Segoe UI", Roboto, system-ui, sans-serif',
        }}
      >
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>
          Something went wrong.
        </h1>
        <p style={{ color: '#6B6458' /* --fg-muted-rgb (light) */, maxWidth: '38ch', lineHeight: 1.6 }}>
          Reload the page to try again.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: '0.5rem',
            minHeight: 44,
            padding: '0 18px',
            border: 0,
            borderRadius: 999,
            background: '#E9DFC8', // --pill-rgb (light)
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
