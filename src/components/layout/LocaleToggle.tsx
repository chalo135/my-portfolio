'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  locales,
  localeCodes,
  localeNames,
  localeTags,
  defaultLocale,
  type Locale,
} from '@/i18n/config'
import { localeFromPathname, swapLocaleInPathname } from '@/lib/locale-href'

/**
 * Locale switcher. Renders links, not a button with an onClick: the locale is
 * in the URL, so switching it is a navigation, and a Link gets middle-click,
 * open-in-new-tab and copy-link-address for free.
 *
 * `variant="codes"` is the compact header control (EN / SW). `variant="names"`
 * is the mobile overlay, where there is room for the full endonyms.
 */
export default function LocaleToggle({
  labels,
  variant = 'codes',
  tabIndex,
  className,
}: {
  /** Accessible names per target locale, e.g. 'Badilisha kwa Kiingereza'. */
  labels: Record<Locale, string>
  variant?: 'codes' | 'names'
  tabIndex?: number
  className?: string
}) {
  const pathname = usePathname()
  const active = localeFromPathname(pathname) ?? defaultLocale
  const text = variant === 'codes' ? localeCodes : localeNames

  return (
    <div
      className={cn(
        'flex items-center',
        variant === 'codes' ? 'gap-1.5 font-mono text-[0.72rem] tracking-label' : 'gap-2 text-[0.8rem]',
        className
      )}
    >
      {locales.map((locale, i) => {
        const isActive = locale === active
        return (
          <span key={locale} className="flex items-center">
            {i > 0 ? (
              <span aria-hidden className="mr-1.5 select-none text-fg/30">
                /
              </span>
            ) : null}
            <Link
              href={swapLocaleInPathname(pathname, locale)}
              hrefLang={localeTags[locale]}
              aria-label={labels[locale]}
              aria-current={isActive ? 'true' : undefined}
              tabIndex={tabIndex}
              className={cn(
                'relative block py-1 transition-colors duration-150 ease-out',
                // Same underline affordance as the nav links, so the control
                // joins the system rather than importing a second vocabulary.
                'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-accent after:transition-opacity after:duration-150',
                isActive
                  ? 'text-fg after:opacity-100'
                  : 'text-fg-muted after:opacity-0 hover:text-accent hover:after:opacity-60'
              )}
            >
              {text[locale]}
            </Link>
          </span>
        )
      })}
    </div>
  )
}
