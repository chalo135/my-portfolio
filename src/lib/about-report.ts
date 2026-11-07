// The "Chalo in data" measures, modelled the way the .pbix models them so the
// answers match the DAX: a bridge table with one row per project and
// technology, a filter context, and measures that count rows in the bridge
// that pass it. No React here — the About page runs it on the server at build
// time and the report component runs it again in the browser.
//
// Imports are type-only on purpose: this file has no runtime dependencies.

import type { Area, TimelineRow } from '@/content/about-report'
import type { ProjectStatus } from '@/content/projects'

export interface ReportProject {
  /** ProjectKey: the project's slug. */
  key: string
  status: ProjectStatus
  stack: string[]
}

/** FactProjectTech: one row per project and technology. */
export interface BridgeRow {
  projectKey: string
  techKey: string
  area: Area
}

export interface Model {
  projects: ReportProject[]
  bridge: BridgeRow[]
}

/** What the slicer, the bar chart and the table have selected. */
export interface FilterContext {
  status?: ProjectStatus
  area?: Area
  project?: string
}

/**
 * Builds the bridge. Every technology in every stack must have an area in
 * DimTech; one that does not is a modelling error, so this throws, which fails
 * the build when the About page prerenders.
 */
export function buildBridge(
  projects: ReportProject[],
  techAreas: Record<string, Area>
): BridgeRow[] {
  const rows: BridgeRow[] = []
  const seen = new Set<string>()
  for (const project of projects) {
    for (const techKey of project.stack) {
      const area = techAreas[techKey]
      if (!area) {
        throw new Error(
          `About report: "${techKey}" (in the stack of project "${project.key}") has no technology area. ` +
            'Add it to techAreas in src/content/about-report.ts.'
        )
      }
      // Table.Distinct in the Power Query: a project lists a technology once.
      const id = `${project.key}\u0000${techKey}`
      if (seen.has(id)) continue
      seen.add(id)
      rows.push({ projectKey: project.key, techKey, area })
    }
  }
  return rows
}

export function buildModel(projects: ReportProject[], techAreas: Record<string, Area>): Model {
  return { projects, bridge: buildBridge(projects, techAreas) }
}

function statusOf(model: Model, projectKey: string): ProjectStatus | undefined {
  return model.projects.find((p) => p.key === projectKey)?.status
}

/** Bridge rows that pass every filter in the context. Status reaches the
 *  bridge through DimProject, area through DimTech: one-way filters. */
export function contextRows(model: Model, ctx: FilterContext): BridgeRow[] {
  return model.bridge.filter(
    (row) =>
      (ctx.status === undefined || statusOf(model, row.projectKey) === ctx.status) &&
      (ctx.area === undefined || row.area === ctx.area) &&
      (ctx.project === undefined || row.projectKey === ctx.project)
  )
}

const distinct = (values: string[]) => new Set(values).size

/** Projects = COALESCE ( DISTINCTCOUNT ( FactProjectTech[ProjectKey] ), 0 ) */
export function projectsMeasure(model: Model, ctx: FilterContext): number {
  return distinct(contextRows(model, ctx).map((r) => r.projectKey))
}

/** CALCULATE ( [Projects], KEEPFILTERS ( Status IN statuses ) ): the status
 *  restriction intersects with the slicer, it never replaces it. */
function projectsKeepingStatuses(model: Model, ctx: FilterContext, statuses: ProjectStatus[]) {
  return distinct(
    contextRows(model, ctx)
      .filter((r) => statuses.includes(statusOf(model, r.projectKey) as ProjectStatus))
      .map((r) => r.projectKey)
  )
}

export function shippedMeasure(model: Model, ctx: FilterContext): number {
  return projectsKeepingStatuses(model, ctx, ['live', 'finished'])
}

export function buildingNowMeasure(model: Model, ctx: FilterContext): number {
  return projectsKeepingStatuses(model, ctx, ['building'])
}

/** Technologies = COALESCE ( DISTINCTCOUNT ( FactProjectTech[TechKey] ), 0 ) */
export function technologiesMeasure(model: Model, ctx: FilterContext): number {
  return distinct(contextRows(model, ctx).map((r) => r.techKey))
}

/** DIVIDE ( [Projects], CALCULATE ( [Projects], REMOVEFILTERS ( DimTech ) ) ).
 *  null stands for DAX's BLANK when the bottom is 0. */
export function shareOfProjectsMeasure(model: Model, ctx: FilterContext): number | null {
  const bottom = projectsMeasure(model, { ...ctx, area: undefined })
  return bottom === 0 ? null : projectsMeasure(model, ctx) / bottom
}

/** Parses an ISO date (YYYY-MM-DD) as a calendar date, no time zone. */
export function parseDate(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m, d }
}

/** DATEDIFF ( from, to, MONTH ): month boundaries crossed, ignoring the day. */
export function monthsBetween(from: string, to: string): number {
  const a = parseDate(from)
  const b = parseDate(to)
  return (b.y - a.y) * 12 + (b.m - a.m)
}

export const FREELANCE_START = '2025-04-01'

/** Months freelancing = DATEDIFF ( DATE ( 2025, 4, 1 ), TODAY (), MONTH ) */
export function monthsFreelancingMeasure(today: string): number {
  return monthsBetween(FREELANCE_START, today)
}

/** Roles running now: Work rows on the timeline with no end date. A row with
 *  no start is not on the timeline at all, so it is not counted. */
export function rolesRunningNowMeasure(timeline: TimelineRow[]): number {
  return timeline.filter((r) => r.type === 'Work' && r.start && !r.end).length
}

/** Rows in DimDate: 1 Jan of the first Start year to 31 Dec of this year. */
export function dimDateRows(timeline: TimelineRow[], today: string): number {
  const starts = timeline.flatMap((r) => (r.start ? [r.start] : [])).sort()
  if (starts.length === 0) return 0
  const firstYear = parseDate(starts[0]).y
  const lastYear = parseDate(today).y
  const from = Date.UTC(firstYear, 0, 1)
  const to = Date.UTC(lastYear, 11, 31)
  return Math.round((to - from) / 86_400_000) + 1
}

export interface BarPoint {
  area: Area
  /** Projects in this area under the status filter. Ignores the chart's own
   *  area selection and the table's project selection. */
  total: number
  /** The cross-highlighted part, drawn in full ink over the faded total. */
  highlighted: number
}

/**
 * The bar chart. Filtered by the slicer only; its own selection and the
 * table's selection highlight it, they never filter it — Power BI's default
 * interactions.
 */
export function barSeries(model: Model, ctx: FilterContext, order: Area[]): BarPoint[] {
  return order.map((area) => {
    const total = projectsMeasure(model, { status: ctx.status, area })
    let highlighted = total
    if (ctx.project !== undefined) {
      highlighted = projectsMeasure(model, { status: ctx.status, area, project: ctx.project })
    } else if (ctx.area !== undefined) {
      highlighted = area === ctx.area ? total : 0
    }
    return { area, total, highlighted }
  })
}

/** Top of the bar chart's axis: every project in the status filter. */
export function barAxisMax(model: Model, ctx: FilterContext): number {
  return projectsMeasure(model, { status: ctx.status })
}

/** The table's rows: filtered by the slicer and the bar chart, not by its own
 *  selection. Keeps data order. */
export function tableProjects(model: Model, ctx: FilterContext): ReportProject[] {
  const keys = new Set(
    contextRows(model, { status: ctx.status, area: ctx.area }).map((r) => r.projectKey)
  )
  return model.projects.filter((p) => keys.has(p.key))
}

/** What FactProjectTech looks like after each applied step, for one project.
 *  `stackCell` is the Stack text exactly as it sits in the workbook. */
export function powerQueryPreview(
  stepIndex: number,
  row: { key: string; title: string; status: string; kind: string; stackCell: string }
): { columns: string[]; rows: string[][] } {
  const header = ['ProjectKey', 'Project', 'Status', 'Kind', 'Stack']
  const full = [row.key, row.title, row.status, row.kind, row.stackCell]
  // Splitter.SplitTextByDelimiter(",") keeps the space after each comma.
  const split = row.stackCell.split(',')
  switch (stepIndex) {
    case 0:
      return {
        columns: ['Name', 'Data', 'Item', 'Kind', 'Hidden'],
        rows: [['Projects', 'Table', 'Projects', 'Sheet', 'FALSE']],
      }
    case 1:
      return { columns: ['Column1', 'Column2', 'Column3', 'Column4', 'Column5'], rows: [header, full] }
    case 2:
    case 3:
      return { columns: header, rows: [full] }
    case 4:
      return { columns: ['ProjectKey', 'Stack'], rows: [[row.key, row.stackCell]] }
    case 5:
      return { columns: ['ProjectKey', 'Stack'], rows: split.map((t) => [row.key, t]) }
    case 6:
      return { columns: ['ProjectKey', 'Stack'], rows: split.map((t) => [row.key, t.trim()]) }
    default: {
      const unique = [...new Set(split.map((t) => t.trim()))]
      return { columns: ['ProjectKey', 'TechKey'], rows: unique.map((t) => [row.key, t]) }
    }
  }
}
