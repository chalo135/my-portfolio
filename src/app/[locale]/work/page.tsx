import { notFound } from 'next/navigation'
import PageShell from '@/components/layout/PageShell'
import HandNote from '@/components/bench/HandNote'
import StickyNote from '@/components/bench/StickyNote'
import DeskReveal from '@/components/work/DeskReveal'
import ProjectRow from '@/components/work/ProjectRow'
import TechStickers from '@/components/work/TechStickers'
import { pageMetadata } from '@/lib/page-meta'
import { firstPublicFile } from '@/lib/public-file'
import { isLocale } from '@/i18n/config'
import { getWork, getWorkCopy, projectCount } from '@/content/work'

export const generateMetadata = pageMetadata('work', '/work')

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const copy = getWorkCopy(locale)
  // Screenshots are checked at build time; a missing one shows the colour panel.
  const projects = getWork(locale, (slug) => firstPublicFile([`/work/${slug}.webp`, `/work/${slug}.jpg`]))

  return (
    <PageShell locale={locale}>
      <div className="mx-auto max-w-[1240px] px-4 pt-10 sm:px-10">
        <section className="relative pb-[100px] pt-[30px]">
          <h1 className="text-[clamp(64px,9vw,128px)] font-bold leading-[0.95] tracking-[-0.03em]">
            {copy.heading}
          </h1>
          <HandNote size={34} arrow="arrow-down" decorative={false} className="mt-[14px]">
            {copy.note}
          </HandNote>
          <StickyNote
            color="yellow"
            tilt={4}
            className="absolute right-0 top-10 px-[18px] py-[14px] whitespace-nowrap font-hand text-[26px] font-bold leading-none"
          >
            {copy.sticky.replace('{count}', projectCount())}
          </StickyNote>
        </section>

        <DeskReveal className="flex flex-col gap-[110px]">
          {projects.map((project, i) => (
            <ProjectRow
              key={project.slug}
              project={project}
              index={i}
              visitSite={copy.visitSite}
              opensNewTab={copy.opensNewTab}
            />
          ))}
        </DeskReveal>

        <TechStickers heading={copy.techHeading} intro={copy.techIntro} />
      </div>
    </PageShell>
  )
}
