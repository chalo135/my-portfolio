import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { areas, type Area, type TimelineRow } from '@/content/about-report'
import type { ProjectStatus } from '@/content/projects'
import {
  barAxisMax,
  barSeries,
  buildingNowMeasure,
  monthsFreelancingMeasure,
  parseDate,
  projectsMeasure,
  shareOfProjectsMeasure,
  shippedMeasure,
  tableProjects,
  technologiesMeasure,
  type FilterContext,
  type Model,
} from '@/lib/about-report'
import {
  StatusSwatch,
  fill,
  filterPhrases,
  formatMonth,
  formatPercent,
  statusOrder,
  tileClass,
  tileTitleClass,
  useChangedSinceMount,
  type ReportData,
} from './shared'

interface OverviewProps {
  data: ReportData
  model: Model
  ctx: FilterContext
  /** Bumped on every filter change; keys the KPI pop so it replays. */
  changes: number
  today: string
  onStatus: (status: ProjectStatus | undefined) => void
  onArea: (area: Area) => void
  onProject: (key: string) => void
  onClear: () => void
}

const pct = (part: number, whole: number) => `${whole > 0 ? (part / whole) * 100 : 0}%`
const stagger = (i: number) => ({ '--i': i }) as CSSProperties

export default function OverviewPage({
  data,
  model,
  ctx,
  changes,
  today,
  onStatus,
  onArea,
  onProject,
  onClear,
}: OverviewProps) {
  const { ui } = data.report
  const pop = useChangedSinceMount(changes)
  const phrases = filterPhrases(ctx, data)
  const usedStatuses = statusOrder.filter((s) => data.projects.some((p) => p.status === s))

  return (
    <div className="grid grid-cols-1 gap-3 min-[980px]:grid-cols-12">
      {/* 1. Status slicer */}
      <div className={cn(tileClass, 'min-[980px]:col-span-12')}>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={ui.slicerLabel}>
          <span className="mr-2 text-sm text-fg-muted">{ui.slicerLabel}</span>
          {[undefined, ...usedStatuses].map((status) => {
            const pressed = ctx.status === status
            return (
              <button
                key={status ?? 'all'}
                type="button"
                aria-pressed={pressed}
                onClick={() => onStatus(status)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-[3px] border px-3 py-1.5 text-sm transition-colors duration-150',
                  pressed ? 'border-fg bg-fg text-bg' : 'border-line bg-bg text-fg hover:border-fg'
                )}
              >
                {status ? <StatusSwatch status={status} /> : null}
                {status ? data.statusLabels[status] : ui.all}
              </button>
            )
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <p aria-live="polite" className="text-fg">
            {phrases.length > 0 ? fill(ui.filtersSentence, { filters: phrases.join(', ') }) : ui.noFilters}
          </p>
          {phrases.length > 0 ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-[3px] border border-line px-2 py-1 text-sm text-fg hover:border-fg"
            >
              {ui.clearFilters}
            </button>
          ) : null}
        </div>
      </div>

      {/* 2. KPI cards */}
      <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))] min-[980px]:col-span-12">
        {[
          { copy: ui.kpis.projects, value: projectsMeasure(model, ctx) },
          { copy: ui.kpis.shipped, value: shippedMeasure(model, ctx) },
          { copy: ui.kpis.building, value: buildingNowMeasure(model, ctx) },
          { copy: ui.kpis.technologies, value: technologiesMeasure(model, ctx) },
          { copy: ui.kpis.months, value: monthsFreelancingMeasure(today) },
        ].map(({ copy, value }) => (
          <div key={copy.label} className={tileClass}>
            <span
              key={changes}
              className={cn(
                'inline-block font-sans text-4xl font-bold tabular-nums text-fg',
                pop && 'report-pop'
              )}
            >
              {value}
            </span>
            <p className="mt-1 text-sm font-semibold text-fg">{copy.label}</p>
            <p className="text-xs text-fg-muted">{copy.sub}</p>
          </div>
        ))}
      </div>

      {/* 3. Projects by technology area */}
      <BarChart data={data} model={model} ctx={ctx} onArea={onArea} />

      {/* 4. Projects table */}
      <ProjectTable data={data} model={model} ctx={ctx} onProject={onProject} />

      {/* 5. Career timeline */}
      <Timeline data={data} today={today} />

      {/* 6. Spec sheet */}
      <SpecSheet data={data} />
    </div>
  )
}

function BarChart({
  data,
  model,
  ctx,
  onArea,
}: {
  data: ReportData
  model: Model
  ctx: FilterContext
  onArea: (area: Area) => void
}) {
  const { ui, areaLabels } = data.report
  const bars = barSeries(model, ctx, areas)
  const max = barAxisMax(model, ctx)
  const ticks = Array.from({ length: max + 1 }, (_, i) => i)
  const columns = 'grid grid-cols-[minmax(0,8rem)_minmax(0,1fr)_1.5rem] items-center gap-3'

  return (
    <div className={cn(tileClass, 'min-[980px]:col-span-5')}>
      <h3 className={tileTitleClass}>{ui.barsTitle}</h3>
      <ul className="mt-4 space-y-1.5">
        {bars.map((bar, i) => {
          const share = shareOfProjectsMeasure(model, { status: ctx.status, area: bar.area })
          const values = { area: areaLabels[bar.area], n: bar.total, total: max }
          return (
            <li key={bar.area}>
              <button
                type="button"
                aria-pressed={ctx.area === bar.area}
                aria-label={fill(ui.barAria, values)}
                onClick={() => onArea(bar.area)}
                className={cn(columns, 'group w-full rounded-[3px] px-1 py-1 text-left')}
              >
                <span className="text-sm leading-tight text-fg">{areaLabels[bar.area]}</span>
                <span className="relative h-5">
                  <span
                    className="report-grow report-bar absolute inset-y-0 left-0 bg-fg/[0.22]"
                    style={{ ...stagger(i), width: pct(bar.total, max) }}
                  />
                  <span
                    className="report-grow report-bar absolute inset-y-0 left-0 bg-fg"
                    style={{ ...stagger(i), width: pct(bar.highlighted, max) }}
                  />
                  <span
                    aria-hidden
                    className="report-tip pointer-events-none absolute bottom-full left-0 z-10 mb-1 hidden whitespace-nowrap rounded-[3px] bg-fg px-2 py-1 text-xs text-bg group-hover:block group-focus-visible:block"
                  >
                    {fill(ui.barTip, {
                      n: bar.total,
                      total: max,
                      pct: share === null ? ui.blank : formatPercent(share),
                    })}
                  </span>
                </span>
                <span className="text-right text-sm tabular-nums text-fg">{bar.total}</span>
              </button>
            </li>
          )
        })}
      </ul>
      {/* Axis: 0 to the projects in the status filter. */}
      <div aria-hidden className={cn(columns, 'mt-1 px-1')}>
        <span />
        <span className="relative h-4 border-t border-line">
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute top-0.5 -translate-x-1/2 text-xs tabular-nums text-fg-muted"
              style={{ left: pct(t, max) }}
            >
              {t}
            </span>
          ))}
        </span>
        <span />
      </div>
    </div>
  )
}

function ProjectTable({
  data,
  model,
  ctx,
  onProject,
}: {
  data: ReportData
  model: Model
  ctx: FilterContext
  onProject: (key: string) => void
}) {
  const { ui } = data.report
  const keys = new Set(tableProjects(model, ctx).map((p) => p.key))
  const rows = data.projects.filter((p) => keys.has(p.key))

  return (
    <div className={cn(tileClass, 'min-w-0 min-[980px]:col-span-7')}>
      <h3 className={tileTitleClass}>{ui.tableTitle}</h3>
      {/* Scrolls inside its own tile under 560px; the page never does. */}
      {/* The padding keeps the focus ring of a project button inside the scroller, which clips. */}
      <div className="-mx-1 mt-3 overflow-x-auto px-1 pb-1">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-fg-muted">
              <th scope="col" className="py-2 pr-4 font-normal">{ui.columns.project}</th>
              <th scope="col" className="py-2 pr-4 font-normal">{ui.columns.status}</th>
              <th scope="col" className="py-2 pr-4 font-normal">{ui.columns.kind}</th>
              <th scope="col" className="py-2 font-normal">{ui.columns.stack}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((project) => (
              <tr
                key={project.key}
                className={cn(
                  'border-b border-line align-top transition-opacity duration-200',
                  ctx.project && ctx.project !== project.key && 'opacity-[0.35]'
                )}
              >
                <td className="py-2.5 pr-4">
                  <button
                    type="button"
                    aria-pressed={ctx.project === project.key}
                    onClick={() => onProject(project.key)}
                    className="rounded-[3px] text-left font-semibold text-fg underline decoration-fg/30 underline-offset-4 hover:decoration-current"
                  >
                    {project.title}
                  </button>
                </td>
                <td className="py-2.5 pr-4">
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    <StatusSwatch status={project.status} />
                    {project.statusLabel}
                  </span>
                </td>
                <td className="py-2.5 pr-4">{project.kind}</td>
                <td className="py-2.5 text-fg-muted">{project.stack.join(', ')}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold text-fg">
              <td className="pt-2.5 pr-4">{ui.total}</td>
              <td className="pt-2.5" colSpan={3}>
                {fill(ui.totalProjects, { n: rows.length })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

const AXIS_START = '2023-01-01'
const DAY = 86_400_000
const toTime = (iso: string) => {
  const { y, m, d } = parseDate(iso)
  return Date.UTC(y, m - 1, d)
}

/** Arrow-tipped right end for a role that is still running. */
const ARROW_RIGHT = 'polygon(0 0, calc(100% - 7px) 0, 100% 50%, calc(100% - 7px) 100%, 0 100%)'
/** Notched left end for a lane that starts before the axis. */
const NOTCH_LEFT = 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 7px 50%)'
const BOTH_ENDS =
  'polygon(0 0, calc(100% - 7px) 0, 100% 50%, calc(100% - 7px) 100%, 0 100%, 7px 50%)'

function Timeline({ data, today }: { data: ReportData; today: string }) {
  const { ui, timeline } = data.report
  const months = ui.monthsShort
  const lastYear = parseDate(today).y
  const start = toTime(AXIS_START)
  const end = Date.UTC(lastYear, 11, 31) + DAY
  const pos = (iso: string) => Math.min(Math.max(((toTime(iso) - start) / (end - start)) * 100, 0), 100)
  const years = Array.from({ length: lastYear - 2023 + 1 }, (_, i) => 2023 + i)

  // Lanes need a start date; a row without one is left out, never guessed.
  const lanes = timeline.filter(
    (r): r is TimelineRow & { start: string } => r.type !== 'Certificate' && Boolean(r.start)
  )
  // Certificates sit at the date they were (or will be) completed.
  const certificates = timeline.filter(
    (r): r is TimelineRow & { end: string } => r.type === 'Certificate' && Boolean(r.end)
  )

  return (
    <div className={cn(tileClass, 'min-w-0 min-[980px]:col-span-8')}>
      <h3 className={tileTitleClass}>{ui.timelineTitle}</h3>
      <div className="relative mt-3 pt-6">
        {/* Year gridlines and the today line, behind the lanes. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {years.map((y) => (
            <span
              key={y}
              className="absolute bottom-6 top-6 border-l border-line"
              style={{ left: `${pos(`${y}-01-01`)}%` }}
            />
          ))}
          <span
            className="absolute bottom-6 top-6 border-l-2 border-dashed border-accent"
            style={{ left: `${pos(today)}%` }}
          />
          <span
            className="absolute top-0 -translate-x-full pr-1.5 text-xs font-semibold text-accent"
            style={{ left: `${pos(today)}%` }}
          >
            {ui.today}
          </span>
        </div>

        <ul className="relative space-y-3">
          {lanes.map((lane, i) => {
            const left = pos(lane.start)
            const right = lane.end ? pos(lane.end) : pos(today)
            const ongoing = !lane.end
            const before = toTime(lane.start) < start
            const clipPath = ongoing && before ? BOTH_ENDS : ongoing ? ARROW_RIGHT : before ? NOTCH_LEFT : undefined
            return (
              <li key={lane.lane}>
                <p className="text-sm font-semibold leading-tight text-fg">{lane.lane}</p>
                {lane.sub ? <p className="text-xs text-fg-muted">{lane.sub}</p> : null}
                <div className="relative mt-1.5 h-3">
                  <span
                    className="report-grow absolute inset-y-0 bg-fg"
                    style={{ ...stagger(i), left: `${left}%`, width: `${Math.max(right - left, 0.5)}%`, clipPath }}
                  />
                  <span className="sr-only">
                    {formatMonth(lane.start, months)}
                    {' – '}
                    {lane.end ? formatMonth(lane.end, months) : ui.now}
                  </span>
                </div>
              </li>
            )
          })}

          {certificates.length > 0 ? (
            <li>
              <p className="text-sm font-semibold leading-tight text-fg">{ui.certificates}</p>
              <div aria-hidden className="relative mt-1.5 h-4">
                {certificates.map((c) => {
                  const done = !c.expected && c.end <= today
                  return (
                    <span
                      key={c.lane}
                      className={cn(
                        'absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-fg',
                        done ? 'bg-fg' : 'bg-bg'
                      )}
                      style={{ left: `${pos(c.end)}%` }}
                    />
                  )
                })}
              </div>
            </li>
          ) : null}
        </ul>

        {/* Year ticks */}
        <div aria-hidden className="relative mt-2 h-4 text-xs tabular-nums text-fg-muted">
          {years.map((y) => (
            <span key={y} className="absolute top-0 pl-1" style={{ left: `${pos(`${y}-01-01`)}%` }}>
              {y}
            </span>
          ))}
        </div>
      </div>

      {certificates.length > 0 ? (
        <ul className="mt-4 space-y-1 text-xs text-fg">
          {certificates.map((c) => {
            const done = !c.expected && c.end <= today
            return (
              <li key={c.lane} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn('inline-block h-2 w-2 rotate-45 border-2 border-fg', done ? 'bg-fg' : 'bg-bg')}
                />
                <span>
                  {c.lane}, <span className="font-mono">{formatMonth(c.end, months)}</span>
                  {c.expected ? `, ${ui.expected}` : null}
                </span>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

function SpecSheet({ data }: { data: ReportData }) {
  const { ui, profile } = data.report
  const rows = profile.filter((row): row is { field: string; value: string } => Boolean(row.value))
  if (rows.length === 0) return null
  return (
    <div className={cn(tileClass, 'min-[980px]:col-span-4')}>
      <h3 className={tileTitleClass}>{ui.specTitle}</h3>
      <div className="mt-3">
        {rows.map((row) => (
          <dl key={row.field} className="border-t border-line py-2 first:border-t-0">
            <dt className="text-xs text-fg-muted">{row.field}</dt>
            <dd className="text-sm text-fg">{row.value}</dd>
          </dl>
        ))}
      </div>
    </div>
  )
}
