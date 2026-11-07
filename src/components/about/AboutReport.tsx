'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Area } from '@/content/about-report'
import type { ProjectStatus } from '@/content/projects'
import { buildModel, type FilterContext } from '@/lib/about-report'
import OverviewPage from './OverviewPage'
import ModelPage from './ModelPage'
import DaxPage from './DaxPage'
import PowerQueryPage from './PowerQueryPage'
import { formatDay, localIsoDate, type ReportData } from './shared'

type Tab = 'overview' | 'model' | 'dax' | 'powerQuery'
const tabs: Tab[] = ['overview', 'model', 'dax', 'powerQuery']

export default function AboutReport({
  data,
  hasPbix,
  pbixHref,
  builtAt,
}: {
  data: ReportData
  /** Whether public/about/chalo-about.pbix exists. No file, no link. */
  hasPbix: boolean
  pbixHref: string
  /** ISO date of the build. The server renders every date-dependent value
   *  for this day; the browser moves to its own today after mount, so the
   *  first client render matches the server and nothing mismatches. */
  builtAt: string
}) {
  const { ui } = data.report
  const [tab, setTab] = useState<Tab>('overview')
  const [ctx, setCtx] = useState<FilterContext>({})
  const [changes, setChanges] = useState(0)
  const [today, setToday] = useState(builtAt)

  useEffect(() => {
    setToday(localIsoDate(new Date()))
  }, [])

  const model = useMemo(
    () =>
      buildModel(
        data.projects.map((p) => ({ key: p.key, status: p.status, stack: p.stack })),
        data.report.techAreas
      ),
    [data]
  )

  const update = useCallback((next: (prev: FilterContext) => FilterContext) => {
    setCtx(next)
    setChanges((n) => n + 1)
  }, [])

  // Power BI's single-visual selection: picking a bar drops a project
  // selection and the other way round. Clicking the same thing again clears it.
  const onStatus = useCallback(
    (status: ProjectStatus | undefined) => update((prev) => ({ ...prev, status })),
    [update]
  )
  const onArea = useCallback(
    (area: Area) =>
      update((prev) => ({ ...prev, project: undefined, area: prev.area === area ? undefined : area })),
    [update]
  )
  const onProject = useCallback(
    (key: string) =>
      update((prev) => ({ ...prev, area: undefined, project: prev.project === key ? undefined : key })),
    [update]
  )
  const onClear = useCallback(() => update(() => ({})), [update])

  return (
    <section aria-label={ui.reportTitle} className="rounded border border-line bg-bg">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line px-4 py-3">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-display text-xl font-semibold text-fg">{ui.reportTitle}</h2>
          <p className="font-mono text-xs text-fg-muted">
            {ui.refreshed} {formatDay(builtAt, ui.monthsShort)}
          </p>
        </div>
        {hasPbix ? (
          <a
            href={pbixHref}
            download
            className="rounded-[3px] bg-highlight px-3 py-1.5 text-sm font-semibold text-on-highlight hover:bg-highlight/85"
          >
            {ui.download}
          </a>
        ) : null}
      </header>

      <div className="bg-surface p-3 md:p-4">
        <div key={tab} className="report-page-in">
          {tab === 'overview' ? (
            <OverviewPage
              data={data}
              model={model}
              ctx={ctx}
              changes={changes}
              today={today}
              onStatus={onStatus}
              onArea={onArea}
              onProject={onProject}
              onClear={onClear}
            />
          ) : null}
          {tab === 'model' ? <ModelPage data={data} /> : null}
          {tab === 'dax' ? (
            <DaxPage
              data={data}
              model={model}
              ctx={ctx}
              changes={changes}
              today={today}
              onBack={() => setTab('overview')}
            />
          ) : null}
          {tab === 'powerQuery' ? <PowerQueryPage data={data} /> : null}
        </div>
      </div>

      {/* Page tabs along the bottom, as in the Power BI report view. */}
      <nav aria-label={ui.tabsLabel} className="flex overflow-x-auto border-t border-line bg-bg">
        {tabs.map((t) => {
          const active = tab === t
          return (
            <button
              key={t}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => setTab(t)}
              className={cn(
                // Inset focus ring: the tab bar scrolls sideways, which clips anything drawn outside it.
                'relative shrink-0 whitespace-nowrap px-4 py-2.5 text-sm transition-colors duration-150 focus-visible:outline-offset-[-3px]',
                active
                  ? 'font-semibold text-fg before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-accent'
                  : 'text-fg-muted hover:text-fg'
              )}
            >
              {ui.tabs[t]}
            </button>
          )
        })}
      </nav>
    </section>
  )
}
