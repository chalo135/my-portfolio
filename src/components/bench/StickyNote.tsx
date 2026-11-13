import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type StickyColor = 'yellow' | 'green' | 'sand' | 'pink'

const colors: Record<StickyColor, string> = {
  yellow: 'bg-sticky-yellow',
  green: 'bg-sticky-green',
  // Sand is the pill colour, fixed to its light value so it stays light on
  // the night desk like the other notes.
  sand: 'bg-[#E9DFC8]',
  pink: 'bg-sticky-pink',
}

/** A coloured square note with the sticky shadow and a tilt. Text is
 *  `paper-ink` in both themes. */
export default function StickyNote({
  as: Tag = 'div',
  color = 'yellow',
  tilt = 0,
  className,
  style,
  children,
  ...rest
}: {
  as?: ElementType
  color?: StickyColor
  tilt?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
} & Record<string, unknown>) {
  return (
    <Tag
      className={cn('relative text-paper-ink shadow-sticky', colors[color], className)}
      style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
