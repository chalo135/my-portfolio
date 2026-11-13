'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { pillClasses } from '@/components/bench/Pill'
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
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="max-w-2xl text-balance text-[clamp(36px,5vw,56px)] font-bold leading-[1.05] tracking-[-0.02em] text-fg">
        {copy.title}
      </h1>
      <p className="max-w-[56ch] text-[19px] leading-[1.5] text-fg-muted">{copy.body}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={reset} className={pillClasses('primary')}>
          {copy.retry}
        </button>
        <Link href={localeHref('/', locale)} className={pillClasses('default', 'min-h-[50px]')}>
          {copy.home}
        </Link>
      </div>
    </main>
  )
}
