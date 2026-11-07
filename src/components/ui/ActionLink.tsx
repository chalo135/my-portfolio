import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/config'
import { localeHref } from '@/lib/locale-href'

/** Plain underlined text link. The underline is the affordance, and it
 *  thickens to full ink on hover, which still reads on the crimson hero where
 *  the colour change cannot. App-relative hrefs are prefixed with the active
 *  locale; mailto:, tel: and external URLs are not. */
export default function ActionLink({
  href,
  locale,
  children,
  className,
}: {
  href: string
  locale: Locale
  children: React.ReactNode
  className?: string
}) {
  const classes = cn(
    'inline-flex items-center font-sans text-sm text-fg underline decoration-fg/35 decoration-1 underline-offset-[6px] transition-colors duration-150 ease-out hover:text-accent hover:decoration-current',
    className
  )

  const inner = <span>{children}</span>

  if (href.startsWith('/')) {
    return (
      <Link href={localeHref(href, locale)} className={classes}>
        {inner}
      </Link>
    )
  }

  const isExternal = /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      className={classes}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {inner}
    </a>
  )
}
