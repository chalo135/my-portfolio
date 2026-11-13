'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import styles from './work.module.css'

/**
 * The project list. On mount, when motion is allowed, it arms the rows
 * (hiding them) and places each one on the desk as it scrolls into view.
 * One IntersectionObserver for all rows, once per row.
 */
export default function DeskReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLOListElement>(null)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    const list = ref.current
    if (!list || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rows = Array.from(list.querySelectorAll<HTMLElement>('[data-desk-row]'))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add(styles.placed)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    )
    rows.forEach((row) => observer.observe(row))
    setArmed(true)

    return () => observer.disconnect()
  }, [])

  return (
    <ol ref={ref} className={cn(armed && styles.armed, className)}>
      {children}
    </ol>
  )
}
