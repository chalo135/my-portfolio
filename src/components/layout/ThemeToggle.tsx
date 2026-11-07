'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useExperience } from '@/providers/ExperienceProvider'

/**
 * Sunny ⇄ rainy toggle. The glyph swap is CSS, not React state: the pre-paint
 * script has already stamped data-theme, so CSS is correct on the first frame
 * and server and client render identically. Only the ARIA state is JS-driven.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useExperience()
  const ref = useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => {
        // Hand the button's own centre to the shader so the theme change can
        // ripple outward from the thing that was just clicked.
        const r = ref.current?.getBoundingClientRect()
        toggleTheme(
          r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined
        )
      }}
      aria-label={
        mounted
          ? theme === 'dark'
            ? 'Switch to the sunny (light) theme'
            : 'Switch to the rainy (dark) theme'
          : 'Switch theme'
      }
      aria-pressed={mounted ? theme === 'dark' : undefined}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center text-fg transition-colors duration-150 ease-out hover:text-accent',
        className
      )}
    >
      {/* Sun — shown on the sunny (light) theme, which is the default. */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="theme-glyph-sun"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
      </svg>

      {/* Rain — cloud with three falling strokes. */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="theme-glyph-rain"
      >
        <path d="M7 15.5a3.75 3.75 0 0 1 .3-7.48 5 5 0 0 1 9.53 1.24A3.25 3.25 0 0 1 16.5 15.5H7Z" />
        <path d="M8.5 18.2l-.9 2.3M12 18.2l-.9 2.3M15.5 18.2l-.9 2.3" />
      </svg>
    </button>
  )
}
