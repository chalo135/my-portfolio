// "Chalo in data": the About page as a small Power BI style report.
//
// This module holds what is the same in every language: the technology areas
// (DimTech), each project's Kind as stored in the workbook, the DAX and the M
// code. Copy lives in about-report.en.ts / about-report.sw.ts. DAX, M code,
// table names, column names and step names stay in English in both, because
// they are identifiers in the .pbix.
//
// Projects are NOT repeated here. They come from projects.ts.

import type { Locale } from '@/i18n/config'
import { aboutReportCopy as en } from './about-report.en'
import { aboutReportCopy as sw } from './about-report.sw'

export type Area =
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'AI and ML'
  | 'Payments'
  | 'DevOps and testing'

/** Bar order on the Overview page. */
export const areas: Area[] = [
  'Frontend',
  'Backend',
  'Database',
  'AI and ML',
  'Payments',
  'DevOps and testing',
]

export type TimelineType = 'Education' | 'Work' | 'Attachment' | 'Certificate'

export interface TimelineRow {
  lane: string
  sub?: string
  type: TimelineType
  /** ISO date. A lane without one is not drawn. */
  start?: string
  /** ISO date. No end on a Work row means it is still running. */
  end?: string
  /** The end date is a target, not a fact yet. */
  expected?: boolean
}

export interface AboutReport {
  /** Intro paragraphs when there is no .pbix to download. */
  intro: string[]
  /** The same, with the download clause, used only when the file exists. */
  introWithPbix: string[]
  /** DimTech: technology name -> area. Shared across locales. */
  techAreas: Record<string, Area>
  /** Project key -> Kind, as displayed in this locale. */
  kinds: Record<string, string>
  /** Area -> label in this locale. */
  areaLabels: Record<Area, string>
  timeline: TimelineRow[]
  /** Empty value = not rendered. */
  profile: { field: string; value?: string }[]
  measures: { name: string; dax: string; note: string }[]
  /** `line` is an index into `mCode`. */
  powerQuery: { mCode: string[]; steps: { name: string; line: number; caption: string }[] }
  ui: AboutReportUi
}

/** Every visible string the report needs. `{x}` placeholders are filled in by
 *  the component. */
export interface AboutReportUi {
  heading: string
  reportTitle: string
  refreshed: string
  download: string
  /** Short month names, January first. Formatted by hand rather than with
   *  Intl, whose Kiswahili output differs between Node and browsers and would
   *  break hydration. */
  monthsShort: string[]
  tabsLabel: string
  tabs: { overview: string; model: string; dax: string; powerQuery: string }
  slicerLabel: string
  all: string
  noFilters: string
  filtersSentence: string
  statusIs: string
  areaIs: string
  projectIs: string
  clearFilters: string
  kpis: {
    projects: { label: string; sub: string }
    shipped: { label: string; sub: string }
    building: { label: string; sub: string }
    technologies: { label: string; sub: string }
    months: { label: string; sub: string }
  }
  barsTitle: string
  barAria: string
  barTip: string
  tableTitle: string
  columns: { project: string; status: string; kind: string; stack: string }
  total: string
  totalProjects: string
  timelineTitle: string
  today: string
  now: string
  certificates: string
  expected: string
  specTitle: string
  blank: string
  rows: string
  modelAria: string
  measuresBox: string
  keyMarker: string
  modelNotes: { title: string; body: string }[]
  daxContext: string
  daxNoContext: string
  backToOverview: string
  stepsTitle: string
  queryName: string
  previewTitle: string
  previewNote: string
  mCodeTitle: string
  figureCaption: string
  figureAlt: string
}

/** DimTech. Names match the stacks in projects.ts exactly, versions included,
 *  because that is the TechKey the bridge table joins on. */
export const techAreas: Record<string, Area> = {
  React: 'Frontend',
  Vite: 'Frontend',
  'Next.js': 'Frontend',
  JavaScript: 'Frontend',
  GSAP: 'Frontend',
  '.NET 10': 'Backend',
  'C#': 'Backend',
  'ASP.NET Core': 'Backend',
  'EF Core': 'Backend',
  'Node.js': 'Backend',
  Express: 'Backend',
  Python: 'Backend',
  FastAPI: 'Backend',
  'PostgreSQL 16': 'Database',
  Supabase: 'Database',
  TensorFlow: 'AI and ML',
  Groq: 'AI and ML',
  'M-Pesa Daraja': 'Payments',
  Docker: 'DevOps and testing',
  xUnit: 'DevOps and testing',
}

/** DimProject[Kind] as stored in the workbook, keyed by project slug. */
export const projectKinds: Record<string, string> = {
  salio: 'Product',
  pharimz: 'Online shop',
  'kahawa-smart': 'AI app',
}

/** DimProject[Status] as stored in the workbook, which is what the DAX filters on. */
export const statusData = {
  building: 'Building now',
  live: 'Live',
  client: 'Client project',
  finished: 'Finished',
} as const

export const measureDax: { name: string; dax: string }[] = [
  {
    name: 'Projects',
    dax: `Projects =
COALESCE ( DISTINCTCOUNT ( FactProjectTech[ProjectKey] ), 0 )`,
  },
  {
    name: 'Shipped',
    dax: `Shipped =
CALCULATE (
    [Projects],
    KEEPFILTERS ( DimProject[Status] IN { "Live", "Finished" } )
)`,
  },
  {
    name: 'Building now',
    dax: `Building now =
CALCULATE (
    [Projects],
    KEEPFILTERS ( DimProject[Status] = "Building now" )
)`,
  },
  {
    name: 'Technologies',
    dax: `Technologies =
COALESCE ( DISTINCTCOUNT ( FactProjectTech[TechKey] ), 0 )`,
  },
  {
    name: 'Share of projects',
    dax: `Share of projects =
DIVIDE (
    [Projects],
    CALCULATE ( [Projects], REMOVEFILTERS ( DimTech ) )
)`,
  },
  {
    name: 'Months freelancing',
    dax: `Months freelancing =
DATEDIFF ( DATE ( 2025, 4, 1 ), TODAY (), MONTH )`,
  },
  {
    name: 'Roles running now',
    dax: `Roles running now =
CALCULATE (
    COUNTROWS ( FactTimeline ),
    FactTimeline[Type] = "Work",
    ISBLANK ( FactTimeline[End] )
)`,
  },
  {
    name: 'DimDate',
    dax: `DimDate =
ADDCOLUMNS (
    CALENDAR (
        DATE ( YEAR ( MIN ( FactTimeline[Start] ) ), 1, 1 ),
        DATE ( YEAR ( TODAY () ), 12, 31 )
    ),
    "Year", YEAR ( [Date] ),
    "Month", FORMAT ( [Date], "mmm yyyy" ),
    "MonthNo", YEAR ( [Date] ) * 100 + MONTH ( [Date] )
)`,
  },
]

export const mCode: string[] = [
  'let',
  '    Source = Excel.Workbook(File.Contents(DataFolder & "chalo-about-data.xlsx"), null, true),',
  '    Projects_Sheet = Source{[Item = "Projects", Kind = "Sheet"]}[Data],',
  '    #"Promoted Headers" = Table.PromoteHeaders(Projects_Sheet, [PromoteAllScalars = true]),',
  '    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers", {{"ProjectKey", type text}, {"Project", type text}, {"Status", type text}, {"Kind", type text}, {"Stack", type text}}),',
  '    #"Removed Other Columns" = Table.SelectColumns(#"Changed Type", {"ProjectKey", "Stack"}),',
  '    #"Split Stack into Rows" = Table.ExpandListColumn(Table.TransformColumns(#"Removed Other Columns", {{"Stack", Splitter.SplitTextByDelimiter(",", QuoteStyle.None)}}), "Stack"),',
  '    #"Trimmed Text" = Table.TransformColumns(#"Split Stack into Rows", {{"Stack", Text.Trim, type text}}),',
  '    #"Renamed Columns" = Table.RenameColumns(#"Trimmed Text", {{"Stack", "TechKey"}}),',
  '    #"Removed Duplicates" = Table.Distinct(#"Renamed Columns")',
  'in',
  '    #"Removed Duplicates"',
]

/** Applied step names (M identifiers, English everywhere) and the mCode line
 *  each one is defined on. */
export const stepLines: { name: string; line: number }[] = [
  { name: 'Source', line: 1 },
  { name: 'Navigation', line: 2 },
  { name: 'Promoted headers', line: 3 },
  { name: 'Changed type', line: 4 },
  { name: 'Removed other columns', line: 5 },
  { name: 'Split Stack into rows', line: 6 },
  { name: 'Trimmed text', line: 7 },
  { name: 'Renamed columns', line: 8 },
  { name: 'Removed duplicates', line: 9 },
]

/** The localized part of the report, supplied by each locale file. */
export interface AboutReportCopy {
  intro: string[]
  introWithPbix: string[]
  kinds: Record<string, string>
  areaLabels: Record<Area, string>
  timeline: TimelineRow[]
  profile: { field: string; value?: string }[]
  /** One per entry in measureDax, same order. */
  measureNotes: string[]
  /** One per entry in stepLines, same order. */
  stepCaptions: string[]
  ui: AboutReportUi
}

const copies: Record<Locale, AboutReportCopy> = { en, sw }

export function getAboutReport(locale: Locale): AboutReport {
  const copy = copies[locale]
  return {
    intro: copy.intro,
    introWithPbix: copy.introWithPbix,
    techAreas,
    kinds: copy.kinds,
    areaLabels: copy.areaLabels,
    timeline: copy.timeline,
    profile: copy.profile,
    measures: measureDax.map((m, i) => ({ ...m, note: copy.measureNotes[i] })),
    powerQuery: {
      mCode,
      steps: stepLines.map((s, i) => ({ ...s, caption: copy.stepCaptions[i] })),
    },
    ui: copy.ui,
  }
}
