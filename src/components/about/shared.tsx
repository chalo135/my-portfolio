import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { AboutReport, Area } from '@/content/about-report'
import type { ProjectStatus } from '@/content/projects'
import type { FilterContext } from '@/lib/about-report'

/** One project as the report sees it. Built by the About page from
 *  projects.ts, so there is no second copy of the project data. */
export interface ReportProjectView {
  key: string
  title: string
  status: ProjectStatus
  statusLabel: string
  /** DimProject[Status] as stored in the workbook (English). */
  statusData: string
  /** Kind, in this locale. Empty when unknown — then nothing is shown. */
  kind: string
  /** DimProject[Kind] as stored in the workbook (English). */
  kindData: string
  stack: string[]
}

export interface ReportData {
  report: AboutReport
  projects: ReportProjectView[]
  statusLabels: Record<ProjectStatus, string>
}

/** Slicer order. Client project only appears when a project uses it. */
export const statusOrder: ProjectStatus[] = ['building', 'live', 'finished', 'client']

/** Building now gold, Live crimson, Finished ink. In night crimson turns
 *  gold too, so .swatch-live draws Live hollow there to keep it apart. */
const swatchClass: Record<ProjectStatus, string> = {
  building: 'bg-highlight',
  live: 'swatch-live bg-accent',
  finished: 'bg-fg',
  client: 'bg-fg-muted',
}

export function StatusSwatch({ status, className }: { status: ProjectStatus; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        // The 1px ink border is what keeps a gold swatch visible on white.
        'inline-block h-2.5 w-2.5 shrink-0 rounded-[2px] border border-fg/55',
        swatchClass[status],
        className
      )}
    />
  )
}

/** Fills `{name}` placeholders. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''))
}

/** Today as an ISO date in the visitor's own calendar. */
export function localIsoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** "Nov 2026". Hand-formatted from the copy's month names so the server and
 *  the browser always agree (see AboutReportUi.monthsShort). */
export function formatMonth(iso: string, months: string[]): string {
  const [y, m] = iso.split('-').map(Number)
  return `${months[m - 1]} ${y}`
}

/** "28 Oct 2026". */
export function formatDay(iso: string, months: string[]): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${months[m - 1]} ${y}`
}

/** The filters currently set, as phrases: ["status is Live", "area is Frontend"]. */
export function filterPhrases(ctx: FilterContext, data: ReportData): string[] {
  const { ui, areaLabels } = data.report
  const phrases: string[] = []
  if (ctx.status) phrases.push(fill(ui.statusIs, { v: data.statusLabels[ctx.status] }))
  if (ctx.area) phrases.push(fill(ui.areaIs, { v: areaLabels[ctx.area as Area] }))
  if (ctx.project) {
    const title = data.projects.find((p) => p.key === ctx.project)?.title ?? ctx.project
    phrases.push(fill(ui.projectIs, { v: title }))
  }
  return phrases
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

/** Whether the filter context has changed since this page mounted. Values pop
 *  on a filter change, not when a page is merely switched back to. */
export function useChangedSinceMount(changes: number): boolean {
  const [atMount] = useState(changes)
  return changes !== atMount
}

/** A report tile: white on the surface canvas, 4px radius, hairline border. */
export const tileClass = 'rounded border border-line bg-bg p-4'
export const tileTitleClass = 'font-display text-base font-semibold text-fg'
