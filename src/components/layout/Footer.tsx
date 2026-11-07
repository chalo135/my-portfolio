import Link from 'next/link'
import { getSite } from '@/content/site'
import { localeHref } from '@/lib/locale-href'
import type { Locale } from '@/i18n/config'
import BackToTop from '@/components/layout/BackToTop'

export default function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear()
  const { site, footerGroups, socialItems, ui } = getSite(locale)

  return (
    <footer className="border-t border-line px-[var(--section-padding)] pb-16 pt-section-sm">
      <div className="mx-auto max-w-content">
        <div className="max-w-measure">
          <p className="font-sans text-[0.85rem] tracking-label text-fg/80">{site.ethos}</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-6 inline-block text-balance [overflow-wrap:anywhere] font-sans text-[clamp(1.25rem,3vw,2rem)] font-semibold text-fg transition-colors duration-150 ease-out hover:text-accent"
          >
            {site.email}
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-display text-lg text-fg">{site.name}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg/80">
              <span className="block">{site.role}</span>
              <span className="block">{site.location}</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6">
              {socialItems
                .filter((social) => social.href !== '#')
                .map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="block py-1.5 font-sans text-[0.9rem] text-fg transition-colors duration-150 ease-out hover:text-accent"
                  >
                    {social.label}
                  </a>
                ))}
            </div>
          </div>

          <nav
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7 md:col-start-6"
            aria-label={ui.footerNavLabel}
          >
            {footerGroups.map((group) => (
              <div key={group.heading}>
                <h2 className="font-sans text-[0.75rem] tracking-label text-fg-muted">
                  {group.heading}
                </h2>
                <ul className="mt-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={localeHref(item.href, locale)}
                        className="block py-1.5 text-[0.95rem] text-fg transition-colors duration-150 ease-out hover:text-accent"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[0.8rem] text-fg-muted">
            © {year} {site.name}
          </p>
          <BackToTop label={ui.backToTop} />
        </div>
      </div>
    </footer>
  )
}
