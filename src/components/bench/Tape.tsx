import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/**
 * A strip of gold tape over the top edge of whatever it sits on. Put it inside
 * a `relative` parent. Centred by default; pass `left` (e.g. '40%') to move it.
 */
export default function Tape({
  width = 120,
  rotate = -2,
  left = '50%',
  className,
  style,
}: {
  /** 110–130px. */
  width?: number
  rotate?: number
  left?: string
  className?: string
  style?: CSSProperties
}) {
  return (
    <span
      aria-hidden
      className={cn('pointer-events-none absolute -top-[13px] z-10 block h-[26px] bg-highlight/55', className)}
      style={{
        width,
        left,
        transform: `translateX(-50%) rotate(${rotate}deg)`,
        ...style,
      }}
    />
  )
}
