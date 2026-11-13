import Link from 'next/link'
import { pillClasses } from '@/components/bench/Pill'
import './globals.css'
import { fontVariables } from './fonts'
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
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <head>
        <title>{copy.title}</title>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-bg text-fg antialiased">
        <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 text-center">
          <div className="flex flex-col items-center gap-6">
            <p aria-hidden className="font-hand text-[34px] font-bold leading-none text-accent">404</p>
            <h1 className="text-[clamp(48px,7vw,88px)] font-bold leading-[0.95] tracking-[-0.03em] text-fg">
              {copy.title}
            </h1>
            <p className="text-[19px] text-fg-muted">{copy.body}</p>
            <Link href="/en/" className={pillClasses('primary')}>
              {copy.back}
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
