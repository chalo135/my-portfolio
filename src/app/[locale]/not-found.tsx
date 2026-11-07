import Link from 'next/link'
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
    <section className="min-h-screen flex items-center justify-center section-padding text-center">
      <div>
        <span className="font-sans text-xs tracking-label text-fg-muted block mb-6">404</span>
        <h1 className="font-display text-display-lg text-fg mb-6">{copy.title}</h1>
        <p className="text-fg/90 mb-10">{copy.body}</p>
        <Link
          href={localeHref('/', defaultLocale)}
          className="text-sm text-fg hover:text-accent transition-colors duration-150 ease-out underline decoration-fg/30 underline-offset-4 hover:decoration-current"
        >
          {copy.back}
        </Link>
      </div>
    </section>
  )
}
