'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getPages } from '@/content/pages'
import { defaultLocale } from '@/i18n/config'
import { localeFromPathname, localeHref } from '@/lib/locale-href'

/**
 * Route-level error boundary.
 *
 * Without this, an uncaught client error anywhere in the tree unmounts the whole segment and leaves a blank page that
 * reads as a hang. This keeps the page usable and gives a way back.
 *
 * An error boundary receives no route params, so the locale is read off the
 * pathname — the one place in the app that has to, since there is no prop to
 * drill through a boundary React renders on its own.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname) ?? defaultLocale
  const { error: copy } = getPages(locale)

  useEffect(() => {
    console.error('Route error:', error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-[var(--section-padding)] text-center">
      <h1 className="max-w-2xl text-balance text-4xl font-bold text-fg">
        {copy.title}
      </h1>
      <p className="max-w-measure text-sm leading-relaxed text-fg/90">{copy.body}</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
        <button
          type="button"
          onClick={reset}
          className="border border-fg/20 px-6 py-3 font-sans text-xs tracking-label text-fg transition-colors duration-150 ease-out hover:border-accent hover:text-accent"
        >
          {copy.retry}
        </button>
        <Link
          href={localeHref('/', locale)}
          className="font-sans text-xs tracking-label text-fg transition-colors duration-150 ease-out hover:text-accent underline decoration-fg/30 underline-offset-4 hover:decoration-current"
        >
          {copy.home}
        </Link>
      </div>
    </main>
  )
}
