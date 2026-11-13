import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type PillVariant = 'default' | 'active' | 'primary'

/** Class string for anything that should look like a Pill (e.g. a label
 *  wrapping a hidden radio, or the locale toggle's container). */
export function pillClasses(variant: PillVariant = 'default', className?: string) {
  return cn(
    'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-[18px] text-[15px] font-medium leading-none no-underline',
    'transition-colors duration-150 ease-out',
    variant === 'default' && 'bg-pill text-fg hover:bg-pill-hover',
    variant === 'active' && 'bg-fg text-bg',
    variant === 'primary' && 'min-h-[50px] bg-accent px-6 font-bold text-on-accent hover:bg-accent/90',
    className
  )
}

interface Common {
  variant?: PillVariant
  icon?: ReactNode
  children?: ReactNode
  className?: string
}

type LinkPill = Common &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
    href: string
    /** Plain <a> rather than next/link: external URLs, mailto:, files. */
    external?: boolean
  }

type ButtonPill = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined }

/**
 * A rounded pill: an <a> when given `href`, otherwise a <button>.
 * Min-height 44px (50px for `primary`). Icons are decorative; pass them
 * already `aria-hidden`.
 */
export default function Pill(props: LinkPill | ButtonPill) {
  if (props.href !== undefined) {
    const { variant, icon, children, className, href, external, ...rest } = props
    const cls = pillClasses(variant, className)
    const isPlain = external || !href.startsWith('/')
    return isPlain ? (
      <a href={href} className={cls} {...rest}>
        {icon}
        {children}
      </a>
    ) : (
      <Link href={href} className={cls} {...rest}>
        {icon}
        {children}
      </Link>
    )
  }
  const { variant, icon, children, className, type = 'button', ...rest } = props
  return (
    <button type={type} className={pillClasses(variant, className)} {...rest}>
      {icon}
      {children}
    </button>
  )
}
