import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { publicFileExists } from '@/lib/public-file'
import { drawings, type BenchName } from './drawings'

/**
 * Server component. One real thing on the desk.
 *
 * If public/bench/<name>.webp exists at build time it renders that cut-out
 * photo; otherwise the drawing. Always decorative. Applies the object shadow
 * and the tilt; on fine pointers it lifts 6px on hover (see `.bench-lift` in
 * globals.css, off under reduced motion).
 *
 * Position it with `style` (left/top/right/bottom) or `className`. It is
 * `absolute` by default; pass `position="static"` (or a class) to change that.
 */
export default function BenchObject({
  name,
  width,
  height,
  tilt = 0,
  label,
  position = 'absolute',
  className,
  style,
}: {
  name: BenchName
  width: number
  height: number
  /** Degrees. */
  tilt?: number
  /** Notebook cover text. */
  label?: string
  position?: 'absolute' | 'relative' | 'static'
  className?: string
  style?: CSSProperties
}) {
  const photo = `/bench/${name}.webp`
  const hasPhoto = publicFileExists(photo)
  const Drawing = drawings[name]

  return (
    <div
      aria-hidden
      className={cn('bench-lift drop-object', position, className)}
      style={{ width, height, transform: tilt ? `rotate(${tilt}deg)` : undefined, ...style }}
    >
      {hasPhoto ? (
        // A plain <img>: a cut-out at its natural aspect, no optimisation
        // needed.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" width={width} height={height} className="block h-full w-full object-contain" />
      ) : name === 'notebook' ? (
        <drawings.notebook width={width} height={height} label={label} className="block" />
      ) : (
        <Drawing width={width} height={height} className="block" />
      )}
    </div>
  )
}

/** Which bench objects have a photo, for reporting. Server-only. */
export function benchPhotoStatus(): Record<BenchName, 'photo' | 'drawing'> {
  return Object.fromEntries(
    (Object.keys(drawings) as BenchName[]).map((n) => [n, publicFileExists(`/bench/${n}.webp`) ? 'photo' : 'drawing'])
  ) as Record<BenchName, 'photo' | 'drawing'>
}
