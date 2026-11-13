'use client'

import { useEffect, useState } from 'react'
import { fill } from '@/content/contact'

const nairobiTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Nairobi',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

/**
 * The stamp with the time in Nairobi. The server renders `--:--`; the client
 * fills the time after mount and every 30 seconds.
 */
export default function NairobiStamp({
  city,
  zone,
  label,
  labelPending,
}: {
  city: string
  zone: string
  /** `{time}` becomes HH:mm. */
  label: string
  labelPending: string
}) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setTime(nairobiTime.format(new Date()))
    tick()
    const timer = window.setInterval(tick, 30_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div
      role="img"
      aria-label={time ? fill(label, { time }) : labelPending}
      className="surface-light absolute right-[30px] top-[30px] flex h-[124px] w-[108px] flex-col items-center justify-center bg-highlight text-paper-ink"
      style={{ transform: 'rotate(3deg)' }}
    >
      <span aria-hidden className="pointer-events-none absolute inset-[7px] border-2 border-dashed border-paper" />
      <span aria-hidden className="font-hand text-[22px] font-bold leading-none">
        {city}
      </span>
      <span aria-hidden className="mt-1 text-[28px] font-bold leading-none tabular-nums">
        {time ?? '--:--'}
      </span>
      <span aria-hidden className="mt-2 text-[11px] leading-none tracking-[0.1em]">
        {zone}
      </span>
    </div>
  )
}
