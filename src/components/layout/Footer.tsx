import Link from 'next/link'
import { contact, getSite } from '@/content/site'
import { localeHref } from '@/lib/locale-href'
import type { Locale } from '@/i18n/config'

const linkClass =
  'inline-flex min-h-[44px] items-center text-fg underline-offset-4 transition-colors duration-150 ease-out hover:underline [overflow-wrap:anywhere]'

/** One wrapping row under a dashed rule: name and year, the four links,
 *  email and GitHub. */
export default function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear()
  const { site, footerItems, ui } = getSite(locale)

  return (
    <footer className="mx-4 border-t-2 border-dashed border-fg/25 pb-[30px] pt-[22px] sm:mx-10">
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-x-8 gap-y-2 text-[15px]">
        <p className="flex items-baseline gap-3">
          <span className="font-hand text-[26px] font-bold leading-none text-fg">{site.name}</span>
          <span className="text-fg-muted">© {year}</span>
        </p>

        <nav aria-label={ui.footerNavLabel}>
          <ul className="flex flex-wrap gap-x-5">
            {footerItems.map((item) => (
              <li key={item.href}>
                <Link href={localeHref(item.href, locale)} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex flex-wrap gap-x-5">
          <li>
            <a href={`mailto:${contact.email}`} className={linkClass}>
              {contact.email}
            </a>
          </li>
          {contact.github ? (
            <li>
              <a href={contact.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                GitHub
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </footer>
  )
}
