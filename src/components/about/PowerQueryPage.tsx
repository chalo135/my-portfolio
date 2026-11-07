import { useState, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { powerQueryPreview } from '@/lib/about-report'
import { tileClass, tileTitleClass, type ReportData } from './shared'

/** The step the page opens on: the one where the stray spaces appear. */
const DEFAULT_STEP = 'Split Stack into rows'
/** The preview follows one project through the query. */
const PREVIEW_PROJECT = 'pharimz'

/** Shows a leading space as a small gold marker, so the reason for the Trim
 *  step is visible rather than invisible whitespace. */
function Cell({ value, markSpaces }: { value: string; markSpaces: boolean }) {
  if (markSpaces && value.startsWith(' ')) {
    return (
      <>
        <span className="mr-0.5 rounded-[2px] bg-highlight px-0.5 font-mono text-on-highlight">␣</span>
        {value.slice(1)}
      </>
    )
  }
  return <>{value}</>
}

export default function PowerQueryPage({ data }: { data: ReportData }) {
  const { ui, powerQuery } = data.report
  const [step, setStep] = useState(() =>
    Math.max(
      powerQuery.steps.findIndex((s) => s.name === DEFAULT_STEP),
      0
    )
  )
  const current = powerQuery.steps[step]
  const project = data.projects.find((p) => p.key === PREVIEW_PROJECT)
  const preview = project
    ? powerQueryPreview(step, {
        key: project.key,
        title: project.title,
        status: project.statusData,
        kind: project.kindData,
        stackCell: project.stack.join(', '),
      })
    : null
  const markSpaces = current.name === 'Split Stack into rows'

  return (
    <div className="grid grid-cols-1 gap-3 min-[820px]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div className={tileClass}>
        <h3 className={tileTitleClass}>{ui.stepsTitle}</h3>
        <p className="mt-1 text-xs text-fg-muted">{ui.queryName}</p>
        <ol className="mt-3 space-y-1">
          {powerQuery.steps.map((s, i) => (
            <li key={s.name}>
              <button
                type="button"
                aria-pressed={i === step}
                onClick={() => setStep(i)}
                className={cn(
                  'w-full rounded-[3px] px-2 py-1.5 text-left text-sm transition-colors duration-150',
                  i === step ? 'bg-fg font-semibold text-bg' : 'text-fg hover:bg-surface'
                )}
              >
                {s.name}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="min-w-0 space-y-3">
        <div className={tileClass}>
          <h3 className={tileTitleClass}>{ui.previewTitle}</h3>
          <p className="mt-1 text-sm text-fg">{current.caption}</p>
          {preview ? (
            <>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-max text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-fg-muted">
                      {preview.columns.map((c) => (
                        <th key={c} scope="col" className="py-1.5 pr-4 font-normal">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.map((row, i) => (
                      <tr
                        key={`${step}-${i}`}
                        className="report-row-in border-b border-line"
                        style={{ '--i': i } as CSSProperties}
                      >
                        {row.map((cell, j) => (
                          <td key={j} className="whitespace-pre py-1.5 pr-4 text-fg">
                            <Cell value={cell} markSpaces={markSpaces} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-fg-muted">{ui.previewNote}</p>
            </>
          ) : null}
        </div>

        <div className={tileClass}>
          <h3 className={tileTitleClass}>{ui.mCodeTitle}</h3>
          <pre className="mt-3 overflow-x-auto rounded-[3px] bg-surface py-3 font-mono text-xs leading-relaxed text-fg">
            <code className="block w-max min-w-full">
              {powerQuery.mCode.map((line, i) => (
                <span
                  key={i}
                  className={cn('block px-3', i === current.line && 'bg-highlight font-semibold text-on-highlight')}
                >
                  {line || ' '}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}
