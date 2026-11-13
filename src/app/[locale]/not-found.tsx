import Link from 'next/link'
import { pillClasses } from '@/components/bench/Pill'
import { getPages } from '@/content/pages'
import { defaultLocale } from '@/i18n/config'
import { localeHref } from '@/lib/locale-href'

/**
 * In-locale 404. A not-found boundary cannot read route params, so it renders
 * in the default locale. It deliberately does not use PageShell: PageShell now
 * requires a locale, and guessing one here would be worse than plain chrome.
 */
export default function NotFound() {
  const { notFound: copy } = getPages(defaultLocale)

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-6">
        <p aria-hidden className="font-hand text-[34px] font-bold leading-none text-accent">404</p>
        <h1 className="text-[clamp(48px,7vw,88px)] font-bold leading-[0.95] tracking-[-0.03em] text-fg">
          {copy.title}
        </h1>
        <p className="text-[19px] text-fg-muted">{copy.body}</p>
        <Link href={localeHref('/', defaultLocale)} className={pillClasses('primary')}>
          {copy.back}
        </Link>
      </div>
    </section>
  )
}
