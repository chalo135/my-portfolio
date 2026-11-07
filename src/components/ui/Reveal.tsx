'use client'

import { useEffect, useRef, useState, type CSSProperties, type ElementType } from 'react'
import { cn } from '@/lib/utils'
import { onReveal } from '@/lib/reveal-observer'

type RevealProps = {
  children: React.ReactNode
  className?: string
  /** Element to render. Defaults to a div. */
  as?: ElementType
  /** Seconds of delay before the transition starts. */
  delay?: number
  /** Vertical travel distance in px. */
  y?: number
  /** Add a left-to-right clip-path wipe (best for headings). */
  mask?: boolean
  /** Trigger on scroll into view, or immediately on mount (for the hero). */
  on?: 'scroll' | 'load'
}

/** Fades content up once as it scrolls in. The hidden start state lives in CSS
 *  (.reveal-init) so a reduced-motion or no-JS visitor never sees a blank. */
export default function Reveal({
  children,
  className,
  as,
  delay = 0,
  y = 32,
  mask = false,
  on = 'scroll',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  const Tag = (as ?? 'div') as ElementType

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (on === 'load') {
      // Next frame, so the browser has painted the start state and actually
      // transitions to the end state instead of jumping straight there.
      const id = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(id)
    }
    // Matches the old ScrollTrigger start of 'top 85%'.
    return onReveal(el, '0px 0px -15% 0px', () => setShown(true))
  }, [on])

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={cn('reveal-init', mask && 'reveal-mask', shown && 'reveal-in', className)}
      style={
        {
          '--reveal-y': `${y}px`,
          '--reveal-delay': `${delay}s`,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  )
}
