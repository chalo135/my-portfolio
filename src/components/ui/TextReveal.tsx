'use client'

import { cn } from '@/lib/utils'
import Reveal from '@/components/ui/Reveal'

export default function TextReveal({
  children,
  className,
  as = 'div',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'span'
  delay?: number
}) {
  return (
    <Reveal as={as} on="load" delay={delay} y={48} className={className}>
      {children}
    </Reveal>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-6 block font-sans text-[0.78rem] tracking-label text-fg-muted">
      {children}
    </span>
  )
}

export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2 className={cn('font-display text-display-lg text-fg text-balance', className)}>
      {children}
    </h2>
  )
}

export function PageHero({
  label,
  title,
  description,
}: {
  label: string
  title: string
  description?: string
}) {
  return (
    <header className="section-padding pt-32 md:pt-40 pb-section-sm">
      <div className="max-w-[1400px] mx-auto">
        <SectionLabel>{label}</SectionLabel>
        <TextReveal as="h1" className="font-display text-display-xl text-fg text-balance max-w-5xl">
          {title}
        </TextReveal>
        {description && (
          <TextReveal as="p" delay={0.2} className="text-editorial text-fg/90 max-w-2xl mt-8">
            {description}
          </TextReveal>
        )}
      </div>
    </header>
  )
}
