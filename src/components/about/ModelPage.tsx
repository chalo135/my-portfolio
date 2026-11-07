import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { tileClass, type ReportData } from './shared'

/** The diagram is drawn on a fixed 1000×500 canvas that scrolls sideways on
 *  narrow screens, like the model view it imitates. */
const WIDTH = 1000
const HEIGHT = 500
const BOX = 200
const HEADER = 32
const ROW = 28

interface TableBox {
  name: string
  x: number
  y: number
  columns: { name: string; key?: boolean }[]
}

const tables: TableBox[] = [
  {
    name: 'DimProject',
    x: 40,
    y: 40,
    columns: [{ name: 'ProjectKey', key: true }, { name: 'Project' }, { name: 'Status' }, { name: 'Kind' }],
  },
  {
    name: 'FactProjectTech',
    x: 400,
    y: 60,
    columns: [
      { name: 'ProjectKey', key: true },
      { name: 'TechKey', key: true },
    ],
  },
  { name: 'DimTech', x: 760, y: 40, columns: [{ name: 'TechKey', key: true }, { name: 'Area' }] },
  {
    name: 'DimDate',
    x: 40,
    y: 290,
    columns: [{ name: 'Date', key: true }, { name: 'Year' }, { name: 'Month' }, { name: 'MonthNo' }],
  },
  {
    name: 'FactTimeline',
    x: 400,
    y: 290,
    columns: [{ name: 'Lane' }, { name: 'Type' }, { name: 'Start' }, { name: 'End' }],
  },
]

const MEASURES_AT = { x: 760, y: 220 }

/** Vertical centre of a column's row. */
const rowY = (table: TableBox, column: string) =>
  table.y + HEADER + table.columns.findIndex((c) => c.name === column) * ROW + ROW / 2
const byName = (name: string) => tables.find((t) => t.name === name) as TableBox

/**
 * Relationships, each drawn from the one side (the dimension) to the many side
 * (the fact), with an arrowhead pointing the way the filter flows.
 */
const relationships = (() => {
  const dimProject = byName('DimProject')
  const fact = byName('FactProjectTech')
  const dimTech = byName('DimTech')
  const dimDate = byName('DimDate')
  const timeline = byName('FactTimeline')
  const rightward = (from: TableBox, fromCol: string, to: TableBox, toCol: string) => {
    const x1 = from.x + BOX
    const y1 = rowY(from, fromCol)
    const x2 = to.x
    const y2 = rowY(to, toCol)
    const mid = (x1 + x2) / 2
    return {
      d: `M${x1} ${y1} H${mid} V${y2} H${x2}`,
      one: { x: x1 + 6, y: y1 - 6, anchor: 'start' as const },
      many: { x: x2 - 6, y: y2 - 6, anchor: 'end' as const },
      arrow: `${mid + 30},${y2 - 5} ${mid + 40},${y2} ${mid + 30},${y2 + 5}`,
    }
  }
  const leftward = (from: TableBox, fromCol: string, to: TableBox, toCol: string) => {
    const x1 = from.x
    const y1 = rowY(from, fromCol)
    const x2 = to.x + BOX
    const y2 = rowY(to, toCol)
    const mid = (x1 + x2) / 2
    return {
      d: `M${x1} ${y1} H${mid} V${y2} H${x2}`,
      one: { x: x1 - 6, y: y1 - 6, anchor: 'end' as const },
      many: { x: x2 + 6, y: y2 - 6, anchor: 'start' as const },
      arrow: `${mid - 30},${y2 - 5} ${mid - 40},${y2} ${mid - 30},${y2 + 5}`,
    }
  }
  return [
    rightward(dimProject, 'ProjectKey', fact, 'ProjectKey'),
    leftward(dimTech, 'TechKey', fact, 'TechKey'),
    rightward(dimDate, 'Date', timeline, 'Start'),
  ]
})()

export default function ModelPage({ data }: { data: ReportData }) {
  const { ui, measures } = data.report

  return (
    <div className="space-y-3">
      <div className={cn(tileClass, 'p-0')}>
        {/* Scrolls sideways inside its tile; the page itself never does. */}
        <div className="overflow-x-auto p-4">
          <div
            role="img"
            aria-label={ui.modelAria}
            className="relative"
            style={{ width: WIDTH, height: HEIGHT }}
          >
            <svg
              aria-hidden
              width={WIDTH}
              height={HEIGHT}
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              className="absolute inset-0 text-fg"
            >
              {relationships.map((r) => (
                <g key={r.d}>
                  <path
                    d={r.d}
                    pathLength={1}
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity={0.55}
                    strokeWidth={1.5}
                    className="report-line-draw"
                  />
                  <text x={r.one.x} y={r.one.y} textAnchor={r.one.anchor} className="fill-fg text-xs">
                    1
                  </text>
                  <text x={r.many.x} y={r.many.y} textAnchor={r.many.anchor} className="fill-fg text-xs">
                    *
                  </text>
                  <polygon points={r.arrow} className="fill-accent" />
                </g>
              ))}
            </svg>

            {tables.map((table, i) => (
              <div
                key={table.name}
                aria-hidden
                className="report-box-in absolute overflow-hidden rounded border border-line bg-bg"
                style={{ left: table.x, top: table.y, width: BOX, '--i': i } as CSSProperties}
              >
                <p
                  className="flex items-center bg-fg px-3 text-sm font-semibold text-bg"
                  style={{ height: HEADER }}
                >
                  {table.name}
                </p>
                {table.columns.map((column) => (
                  <p
                    key={column.name}
                    className="flex items-center justify-between border-t border-line px-3 text-sm text-fg"
                    style={{ height: ROW }}
                  >
                    <span>{column.name}</span>
                    {column.key ? <span className="text-xs text-fg-muted">{ui.keyMarker}</span> : null}
                  </p>
                ))}
              </div>
            ))}

            <div
              aria-hidden
              className="report-box-in absolute overflow-hidden rounded border border-line bg-bg"
              style={
                { left: MEASURES_AT.x, top: MEASURES_AT.y, width: BOX, '--i': tables.length } as CSSProperties
              }
            >
              <p className="flex items-center bg-highlight px-3 text-sm font-semibold text-on-highlight" style={{ height: HEADER }}>
                {ui.measuresBox}
              </p>
              {measures.map((measure) => (
                <p
                  key={measure.name}
                  className="flex items-center border-t border-line px-3 text-sm text-fg"
                  style={{ height: ROW }}
                >
                  {measure.name}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {ui.modelNotes.map((note) => (
          <div key={note.title} className={tileClass}>
            <p className="text-sm leading-relaxed text-fg">
              <strong className="font-semibold">{note.title}</strong> {note.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
