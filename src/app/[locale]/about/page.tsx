import type { Metadata } from 'next'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import PageShell from '@/components/layout/PageShell'
import Reveal from '@/components/ui/Reveal'
import AboutReport from '@/components/about/AboutReport'
import type { ReportData, ReportProjectView } from '@/components/about/shared'
import { getAboutReport, projectKinds, statusData } from '@/content/about-report'
import { getProjects, statusLabel, type ProjectStatus } from '@/content/projects'
import { getPages } from '@/content/pages'
import { buildModel } from '@/lib/about-report'
import { alternatesFor } from '@/lib/alternates'
import { isLocale } from '@/i18n/config'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const { meta } = getPages(locale)
  return {
    title: meta.about.title,
    description: meta.about.description,
    alternates: alternatesFor('/about', locale),
  }
}

const PBIX_HREF = '/about/chalo-about.pbix'
const SCREENSHOT_SRC = '/about/pbix-overview.png'

const publicFile = (href: string) => join(process.cwd(), 'public', ...href.split('/').filter(Boolean))

/** Width and height from a PNG's IHDR chunk, so next/image gets real numbers
 *  without a dependency. null when the file is missing or not a PNG. */
function pngSize(path: string): { width: number; height: number } | null {
  if (!existsSync(path)) return null
  const header = readFileSync(path).subarray(0, 24)
  if (header.length < 24 || header.toString('ascii', 12, 16) !== 'IHDR') return null
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const report = getAboutReport(locale)
  const projects: ReportProjectView[] = getProjects(locale).map((p) => ({
    key: p.slug,
    title: p.title,
    status: p.status,
    statusLabel: statusLabel(p.status, locale),
    statusData: statusData[p.status],
    kind: report.kinds[p.slug] ?? '',
    kindData: projectKinds[p.slug] ?? '',
    stack: p.technology,
  }))

  // Runs at build time. A technology with no area in DimTech throws here,
  // which fails the build with a message naming it.
  buildModel(
    projects.map((p) => ({ key: p.key, status: p.status, stack: p.stack })),
    report.techAreas
  )

  const statuses: ProjectStatus[] = ['building', 'live', 'client', 'finished']
  const data: ReportData = {
    report,
    projects,
    statusLabels: Object.fromEntries(statuses.map((s) => [s, statusLabel(s, locale)])) as Record<
      ProjectStatus,
      string
    >,
  }

  // Checked at build time. No file, no link and no mention of one.
  const hasPbix = existsSync(publicFile(PBIX_HREF))
  const screenshot = pngSize(publicFile(SCREENSHOT_SRC))
  const builtAt = new Date().toISOString().slice(0, 10)
  const intro = hasPbix ? report.introWithPbix : report.intro

  return (
    <PageShell locale={locale}>
      <header className="px-[var(--section-padding)] pb-12 pt-40 md:pt-48">
        <div className="mx-auto max-w-content">
          <Reveal
            as="h1"
            on="load"
            className="max-w-4xl text-balance font-display text-display-xl font-bold text-fg"
          >
            {report.ui.heading}
          </Reveal>
          <div className="mt-8 max-w-measure space-y-5">
            {intro.map((paragraph, i) => (
              <Reveal
                key={i}
                as="p"
                on="load"
                delay={0.12 + i * 0.08}
                className="text-editorial leading-relaxed text-fg"
              >
                {paragraph}
              </Reveal>
            ))}
          </div>
        </div>
      </header>

      <section className="px-[var(--section-padding)] pb-section">
        <div className="mx-auto max-w-content">
          <AboutReport data={data} hasPbix={hasPbix} pbixHref={PBIX_HREF} builtAt={builtAt} />

          {screenshot ? (
            <figure className="mt-10">
              <Image
                src={SCREENSHOT_SRC}
                alt={report.ui.figureAlt}
                width={screenshot.width}
                height={screenshot.height}
                sizes="(min-width: 1400px) 1400px, 100vw"
                className="h-auto w-full rounded border border-line"
              />
              <figcaption className="mt-3 text-sm text-fg-muted">{report.ui.figureCaption}</figcaption>
            </figure>
          ) : null}
        </div>
      </section>
    </PageShell>
  )
}
