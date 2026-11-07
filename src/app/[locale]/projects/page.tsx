import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageShell from '@/components/layout/PageShell'
import { PageHero } from '@/components/ui/TextReveal'
import { getProjects, statusLabel, type Project } from '@/content/projects'
import { getPages } from '@/content/pages'
import { localeHref } from '@/lib/locale-href'
import { alternatesFor } from '@/lib/alternates'
import { isLocale, type Locale } from '@/i18n/config'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const { meta } = getPages(locale)
  return {
    title: meta.projects.title,
    description: meta.projects.description,
    alternates: alternatesFor('/projects', locale),
  }
}

/** One project as a row. The whole row is the link to the detail page. */
function ProjectRow({ project, locale }: { project: Project; locale: Locale }) {
  return (
    <li>
      <Link
        href={localeHref(`/projects/${project.slug}`, locale)}
        className="group grid grid-cols-1 gap-3 border-t border-line py-10 md:grid-cols-12 md:gap-8"
      >
        <div className="md:col-span-5">
          <h3 className="font-display text-display-md font-semibold text-fg transition-colors duration-150 ease-out group-hover:text-accent">
            {project.title}
          </h3>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-sans text-sm text-fg-muted">
            <span>{statusLabel(project.status, locale)}</span>
            {project.year ? <span className="font-mono tabular-nums">{project.year}</span> : null}
          </p>
        </div>
        <div className="md:col-span-7">
          <p className="text-editorial text-fg">{project.oneLiner}</p>
          <p className="mt-4 text-sm leading-relaxed text-fg-muted">
            {project.technology.join(', ')}
          </p>
        </div>
      </Link>
    </li>
  )
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const projects = getProjects(locale)
  const { hero, groups } = getPages(locale).projects

  // Two groups, in data order within each. A group with nothing in it is not
  // rendered at all, so there is never a heading over an empty list.
  const sections = [
    { heading: groups.building, items: projects.filter((p) => p.status === 'building') },
    { heading: groups.shipped, items: projects.filter((p) => p.status !== 'building') },
  ].filter((section) => section.items.length > 0)

  return (
    <PageShell locale={locale}>
      <PageHero label={hero.label} title={hero.title} description={hero.description} />

      <div className="section-padding pt-0">
        <div className="mx-auto max-w-[1400px] space-y-section-sm">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-6 font-display text-2xl font-semibold text-fg">{section.heading}</h2>
              <ul>
                {section.items.map((project) => (
                  <ProjectRow key={project.slug} project={project} locale={locale} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
