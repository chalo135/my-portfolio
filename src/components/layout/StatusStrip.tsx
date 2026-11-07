'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useExperience } from '@/providers/ExperienceProvider'
import { getSite } from '@/content/site'
import type { Locale } from '@/i18n/config'

/**
 * Nairobi wall clock, independent of where the visitor actually is.
 *
 * Deliberately pinned to 'en-GB' rather than following the locale: this is a
 * fixed 24-hour HH:mm:ss numeric format whose output is byte-identical under
 * sw-KE. Switching it would buy nothing and risks a hydration mismatch.
 */
const clockFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Nairobi',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

/**
 * Fixed bottom chrome: copyright, a Nairobi clock, and a to-top control past
 * the fold. The clock renders a same-width placeholder on the server; a real
 * formatted time there could not match the client and would break hydration.
 */
export default function StatusStrip({ locale }: { locale: Locale }) {
  const { scrollTo } = useExperience()
  const { ui } = getSite(locale)
  const [time, setTime] = useState<string | null>(null)
  const [pastFold, setPastFold] = useState(false)
  const [overBoard, setOverBoard] = useState(false)

  // The clock only ticks while the tab is actually being looked at. A 1 Hz
  // interval re-rendering fixed chrome in a background tab is pure waste, and
  // it keeps the tab awake for no benefit.
  useEffect(() => {
    let id = 0
    const tick = () => setTime(clockFormat.format(new Date()))

    const start = () => {
      tick()
      if (!id) id = window.setInterval(tick, 1000)
    }
    const stop = () => {
      window.clearInterval(id)
      id = 0
    }

    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setPastFold(window.scrollY > window.innerHeight * 0.9)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Whether the hero signboard is behind the strip, i.e. whether the hero
  // reaches into the bottom few percent of the viewport. An observer with the
  // top margin pulled down to that band, rather than a rect read per scroll.
  useEffect(() => {
    const board = document.querySelector('[data-signboard]')
    if (!board) return
    const io = new IntersectionObserver(
      (entries) => setOverBoard(entries.some((e) => e.isIntersecting)),
      { rootMargin: '-95% 0px 0px 0px', threshold: 0 }
    )
    io.observe(board)
    return () => io.disconnect()
  }, [])

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-0 z-40 px-[var(--section-padding)] pb-3',
        overBoard && 'signboard'
      )}
    >
      <div className="mx-auto flex max-w-content items-baseline justify-between font-sans text-[0.75rem] tracking-label text-fg-muted">
        <span>©2026</span>

        <span className="hidden items-baseline gap-3 sm:flex">
          <span>EAT, Nairobi KE</span>
          <span className="font-mono tabular-nums text-fg-muted">{time ?? '--:--:--'}</span>
        </span>

        {pastFold ? (
          <button
            type="button"
            onClick={() => scrollTo(0)}
            className="pointer-events-auto tracking-label text-fg transition-colors duration-150 ease-out hover:text-accent"
          >
            {ui.top}
          </button>
        ) : (
          <span aria-hidden />
        )}
      </div>
    </div>
  )
}
