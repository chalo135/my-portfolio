'use client'

import { useExperience } from '@/providers/ExperienceProvider'

export default function BackToTop({ label }: { label: string }) {
  const { scrollTo } = useExperience()
  return (
    <button
      type="button"
      onClick={() => scrollTo(0)}
      className="group inline-flex items-center gap-2 font-sans text-[0.8rem] tracking-label text-fg transition-colors duration-150 ease-out hover:text-accent"
    >
      <span
        aria-hidden
        className="transition-transform duration-150 ease-out group-hover:-translate-y-1"
      >
        ↑
      </span>
      {label}
    </button>
  )
}
