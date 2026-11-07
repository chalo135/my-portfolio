import { cn } from '@/lib/utils'

/** Section eyebrow, e.g. `How I work`. Sentence case, unnumbered. */
export default function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={cn('inline-block font-sans text-[0.85rem] text-fg', className)}>
      {children}
    </span>
  )
}
