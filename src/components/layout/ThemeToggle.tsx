'use client'

import { useEffect, useState } from 'react'
import { useExperience } from '@/providers/ExperienceProvider'
import { pillClasses } from '@/components/bench/Pill'
import { MoonIcon } from '@/components/bench/Icons'
import { cn } from '@/lib/utils'

/**
 * Day / night toggle, styled as a Pill with a moon icon. The theme itself was
 * stamped on <html> by the pre-paint script; only the ARIA state is JS-driven,
 * after mount, so server and client render the same markup.
 */
export default function ThemeToggle({
  labels,
  className,
}: {
  labels: { toLight: string; toDark: string; generic: string }
  className?: string
}) {
  const { theme, toggleTheme } = useExperience()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <button
      type="button"
      onClick={() => toggleTheme()}
      aria-label={mounted ? (theme === 'dark' ? labels.toLight : labels.toDark) : labels.generic}
      aria-pressed={mounted ? theme === 'dark' : undefined}
      className={cn(pillClasses('default'), 'min-w-[44px] px-[14px]', className)}
    >
      <MoonIcon />
    </button>
  )
}
