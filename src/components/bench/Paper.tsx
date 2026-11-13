import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * A sheet of paper on the desk: the `paper` surface, the paper shadow and a
 * tilt in degrees. Square corners. Paper keeps its light colour in both
 * themes, so text on it is `paper-ink`.
 */
export default function Paper({
  as: Tag = 'div',
  tilt = 0,
  className,
  style,
  children,
  ...rest
}: {
  as?: ElementType
  tilt?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
} & Record<string, unknown>) {
  return (
    <Tag
      className={cn('relative bg-paper text-paper-ink shadow-paper', className)}
      style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
