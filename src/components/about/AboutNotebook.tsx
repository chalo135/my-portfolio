import Paper from '@/components/bench/Paper'
import { Paperclip } from '@/components/bench/drawings'
import { aboutFacts, ageOn, daxLine, type FactRow } from '@/content/about'
import AgeValue from './AgeValue'

/**
 * Server component. A notebook page of facts. Only rows with a value render;
 * with no date of birth there is no Age row and no DAX line.
 */
export default function AboutNotebook({
  title,
  updated,
  rows,
  buildDate,
}: {
  title: string
  /** Already formatted, e.g. "Updated November 2026". */
  updated: string
  rows: FactRow[]
  buildDate: Date
}) {
  const born = aboutFacts.born
  return (
    <Paper
      as="section"
      tilt={1}
      aria-labelledby="about-data-title"
      className="mt-1 px-[18px] pb-[22px] pt-[26px] sm:px-[30px]"
    >
      {/* The red margin line. */}
      <span aria-hidden className="absolute bottom-0 left-[36px] top-0 w-[2px] bg-accent/45 sm:left-[48px]" />
      <Paperclip width={26} height={62} className="absolute -top-[22px] right-[28px] z-10" />

      <div className="relative flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pl-[44px] sm:pl-[64px]">
        <h2 id="about-data-title" className="font-hand text-[36px] font-bold leading-tight text-accent">
          {title}
        </h2>
        <p className="text-[12px] text-fg-muted">{updated}</p>
      </div>

      {rows.length > 0 && (
        <dl className="relative mt-2">
          {rows.map((row) => (
            <div
              key={row.key}
              className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-fg/[0.18] pb-1.5 pl-[44px] pt-2.5 sm:pl-[64px]"
            >
              <dt className="text-[13px] uppercase tracking-[0.08em] text-fg-muted">{row.label}</dt>
              <dd className="ml-auto text-right font-hand text-[32px] font-bold leading-[1.1] text-paper-ink">
                {row.key === 'age' && born ? (
                  <AgeValue born={born} initial={ageOn(born, buildDate)} />
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {born && (
        <p
          tabIndex={0}
          className="relative ml-[44px] mt-3.5 overflow-x-auto whitespace-nowrap font-mono text-[12px] text-fg-muted sm:ml-[64px]"
        >
          {daxLine}
        </p>
      )}
    </Paper>
  )
}
