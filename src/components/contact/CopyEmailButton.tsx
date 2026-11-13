'use client'

import { useEffect, useRef, useState } from 'react'
import { pillClasses } from '@/components/bench/Pill'
import { cn } from '@/lib/utils'

/** Copies the email address; the label reads `Copied` for two seconds. */
export default function CopyEmailButton({
  email,
  label,
  copiedLabel,
}: {
  email: string
  label: string
  copiedLabel: string
}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function onClick() {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      // No clipboard access: leave the label as it is.
      return
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={cn(pillClasses('default'), 'mt-2 self-start bg-[#2A2622] text-sticky-yellow hover:bg-[#2A2622]/90')}
      >
        {copied ? copiedLabel : label}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ''}
      </span>
    </>
  )
}
