import { cn } from '@/lib/utils'
import {
  buildingNowMeasure,
  dimDateRows,
  monthsFreelancingMeasure,
  projectsMeasure,
  rolesRunningNowMeasure,
  shareOfProjectsMeasure,
  shippedMeasure,
  technologiesMeasure,
  type FilterContext,
  type Model,
} from '@/lib/about-report'
import {
  fill,
  filterPhrases,
  formatPercent,
  tileClass,
  useChangedSinceMount,
  type ReportData,
} from './shared'

/** Each measure's value in the current filter context, keyed by name. */
function measureValues(data: ReportData, model: Model, ctx: FilterContext, today: string) {
  const { ui, timeline } = data.report
  const share = shareOfProjectsMeasure(model, ctx)
  return {
    Projects: String(projectsMeasure(model, ctx)),
    Shipped: String(shippedMeasure(model, ctx)),
    'Building now': String(buildingNowMeasure(model, ctx)),
    Technologies: String(technologiesMeasure(model, ctx)),
    'Share of projects': share === null ? ui.blank : formatPercent(share),
    'Months freelancing': String(monthsFreelancingMeasure(today)),
    'Roles running now': String(rolesRunningNowMeasure(timeline)),
    DimDate: fill(ui.rows, { n: dimDateRows(timeline, today) }),
  } as Record<string, string>
}

export default function DaxPage({
  data,
  model,
  ctx,
  changes,
  today,
  onBack,
}: {
  data: ReportData
  model: Model
  ctx: FilterContext
  changes: number
  today: string
  onBack: () => void
}) {
  const { ui, measures } = data.report
  const pop = useChangedSinceMount(changes)
  const phrases = filterPhrases(ctx, data)
  const values = measureValues(data, model, ctx, today)

  return (
    <div className="space-y-3">
      <div className={cn(tileClass, 'flex flex-wrap items-center justify-between gap-3')}>
        <p aria-live="polite" className="text-sm text-fg">
          {phrases.length > 0 ? fill(ui.daxContext, { filters: phrases.join(', ') }) : ui.daxNoContext}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="rounded-[3px] border border-line px-3 py-1.5 text-sm text-fg hover:border-fg"
        >
          {ui.backToOverview}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {measures.map((measure) => (
          <article key={measure.name} className={cn(tileClass, 'min-w-0')}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-fg">{measure.name}</h3>
              <span
                key={changes}
                className={cn(
                  'inline-block rounded-[3px] bg-highlight px-2 py-0.5 text-sm font-semibold tabular-nums text-on-highlight',
                  pop && 'report-pop'
                )}
              >
                {values[measure.name]}
              </span>
            </div>
            {/* Scrolls sideways, never wraps: DAX layout is part of the point. */}
            <pre className="mt-3 overflow-x-auto whitespace-pre rounded-[3px] bg-surface p-3 font-mono text-xs leading-relaxed text-fg">
              <code>{measure.dax}</code>
            </pre>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">{measure.note}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
