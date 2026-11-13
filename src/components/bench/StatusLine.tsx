import { cn } from '@/lib/utils'

/** A 10px leaf-green dot, then the status text. */
export default function StatusLine({ text, className }: { text: string; className?: string }) {
  return (
    <p className={cn('flex items-center gap-[10px] text-[15px] text-fg-muted', className)}>
      <span aria-hidden className="block h-[10px] w-[10px] shrink-0 rounded-full bg-ok" />
      <span>{text}</span>
    </p>
  )
}
