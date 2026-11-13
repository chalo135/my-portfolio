'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { pillClasses } from '@/components/bench/Pill'
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
 * Locale switcher, styled as one Pill reading `EN / SW`. Links, not buttons:
 * switching locale is a navigation. The current locale is full `fg`, the
 * other is muted. Each link fills the pill's height, so it is a 44px target.
 *
 * `variant="names"` is the mobile overlay, with full endonyms.
 */
export default function LocaleToggle({
  labels,
  variant = 'codes',
  tabIndex,
  className,
}: {
  labels: Record<Locale, string>
  variant?: 'codes' | 'names'
  tabIndex?: number
  className?: string
}) {
  const pathname = usePathname()
  const active = localeFromPathname(pathname) ?? defaultLocale
  const text = variant === 'codes' ? localeCodes : localeNames

  return (
    <div className={cn(pillClasses('default'), 'gap-0 px-[10px] hover:bg-pill', className)}>
      {locales.map((locale, i) => {
        const isActive = locale === active
        return (
          <span key={locale} className="flex items-center">
            {i > 0 ? (
              <span aria-hidden className="select-none px-0.5 text-fg/40">
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
                'flex min-h-[44px] min-w-[32px] items-center justify-center px-1 transition-colors duration-150 ease-out hover:underline',
                isActive ? 'text-fg' : 'text-fg-muted hover:text-fg'
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
