import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Arrow, type ArrowName } from './drawings'

/**
 * A handwritten note: Caveat 700 in `accent`, with an optional arrow before or
 * after it. Decorative by default (aria-hidden); pass `decorative={false}`
 * when the note carries meaning a screen reader should hear.
 */
export default function HandNote({
  as: Tag = 'p',
  size = 28,
  arrow,
  arrowPosition = 'after',
  decorative = true,
  className,
  style,
  children,
}: {
  as?: ElementType
  /** px */
  size?: number
  arrow?: ArrowName
  arrowPosition?: 'before' | 'after'
  decorative?: boolean
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const arrowEl = arrow ? <Arrow name={arrow} className="shrink-0" /> : null
  return (
    <Tag
      aria-hidden={decorative || undefined}
      className={cn('inline-flex items-end gap-2 font-hand font-bold leading-none text-accent', className)}
      style={{ fontSize: size, ...style }}
    >
      {arrowPosition === 'before' ? arrowEl : null}
      <span>{children}</span>
      {arrowPosition === 'after' ? arrowEl : null}
    </Tag>
  )
}
