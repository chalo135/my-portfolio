import Link from 'next/link'
import './globals.css'
import { getPages } from '@/content/pages'
import { defaultLocale } from '@/i18n/config'

/**
 * Root 404, for paths that match no locale segment at all (/nope, /de/about).
 * It sits above [locale], whose layout renders the real <html> and <body>; the
 * root layout above this file is a pass-through, so this page renders its own.
 * It has no locale to read, so it renders in the default locale and points at
 * that locale's home.
 */

/** Stamps data-theme on <html> before first paint. A copy of the script in
 *  src/app/[locale]/layout.tsx (a layout file can't export it to share it);
 *  keep the two in sync. Stored choice, otherwise light. */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light'){t='light'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}try{document.documentElement.classList.add('js-ready')}catch(e){}})()`

export default function RootNotFound() {
  const { notFound: copy } = getPages(defaultLocale)

  return (
    // The script mutates data-theme before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-bg text-fg antialiased">
        <main className="min-h-screen flex items-center justify-center section-padding text-center">
          <div>
            <span className="font-sans text-xs tracking-label text-fg-muted block mb-6">404</span>
            <h1 className="font-display text-display-lg text-fg mb-6">{copy.title}</h1>
            <p className="text-fg/90 mb-10">{copy.body}</p>
            <Link
              href="/en/"
              className="text-sm text-fg hover:text-accent transition-colors duration-150 ease-out underline decoration-fg/30 underline-offset-4 hover:decoration-current"
            >
              {copy.back}
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
