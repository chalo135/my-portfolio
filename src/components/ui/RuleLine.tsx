'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { onReveal } from '@/lib/reveal-observer'

/** Hairline divider that draws itself from the left on reveal. */
export default function RuleLine({
  className,
  delay = 0,
}: {
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    return onReveal(el, '0px 0px -10% 0px', () => setShown(true))
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn('rule-line rule-init', shown && 'rule-in', className)}
      style={{ '--reveal-delay': `${delay}s` } as CSSProperties}
    />
  )
}
