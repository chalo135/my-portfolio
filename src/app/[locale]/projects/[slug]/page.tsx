import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageShell from '@/components/layout/PageShell'
import ActionLink from '@/components/ui/ActionLink'
import { getProject, projectSlugs, statusLabel, type Project } from '@/content/projects'
import { getPages } from '@/content/pages'
import { getSite } from '@/content/site'
import { localeHref } from '@/lib/locale-href'
import { alternatesFor } from '@/lib/alternates'
import { locales, isLocale } from '@/i18n/config'

/** Cross product of locales × slugs, or these routes stop prerendering. */
export function generateStaticParams() {
  return locales.flatMap((locale) => projectSlugs.map((slug) => ({ locale, slug })))
}

/** Static export: unknown slugs 404. */
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const { meta } = getPages(locale)
  const project = getProject(slug, locale)
  if (!project) return { title: meta.projectNotFound }
  return {
    title: project.title,
    description: project.oneLiner,
    alternates: alternatesFor(`/projects/${slug}`, locale),
  }
}

/** One section of the detail page: a plain sentence-case heading, no eyebrow,
 *  no number. Callers only render it when they have something to put in it. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-12 md:py-16">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-16">
        <h2 className="font-display text-2xl font-semibold text-fg lg:col-span-4">{title}</h2>
        <div className="text-editorial leading-relaxed text-fg lg:col-span-8">{children}</div>
      </div>
    </section>
  )
}

function ProjectImage({ image }: { image: NonNullable<Project['images']>[number] }) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes="(min-width: 1400px) 1400px, 100vw"
      className="h-auto w-full rounded-sm border border-line"
    />
  )
}

/** Stand-in when there is no real screenshot: a flat panel with the name set
 *  large. Decorative, since the name is already the page's <h1>. */
function NamePanel({ title }: { title: string }) {
  return (
    <div
      aria-hidden
      className="flex aspect-[21/9] items-center justify-center overflow-hidden rounded-sm bg-surface px-6"
    >
      <span className="text-balance text-center font-display text-display-lg font-semibold text-fg">
        {title}
      </span>
    </div>
  )
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const project = getProject(slug, locale)
  if (!project) notFound()

  const p = getPages(locale).projects
  const s = p.sections
  const { site } = getSite(locale)

  const [firstImage, ...moreImages] = project.images ?? []

  // Progress is computed from the stage list, never typed in. "Stage n" is the
  // stage being worked on; once everything is done it is the last one.
  const stages = project.stages ?? []
  const currentIndex = stages.findIndex((stage) => stage.state === 'current')
  const stageNumber =
    currentIndex >= 0 ? currentIndex + 1 : stages.filter((stage) => stage.state === 'done').length
  const stageLine = p.stageOf
    .replace('{current}', String(stageNumber))
    .replace('{total}', String(stages.length))

  const links = [
    project.links?.live ? { href: project.links.live, label: p.liveLink } : null,
    project.links?.repo ? { href: project.links.repo, label: p.repoLink } : null,
  ].filter((link): link is { href: string; label: string } => link !== null)

  const walkthroughHref = `mailto:${site.email}?subject=${encodeURIComponent(
    p.walkthroughSubject + project.title
  )}`

  return (
    <PageShell locale={locale}>
      <article className="px-[var(--section-padding)] pb-section pt-32 md:pt-40">
        <div className="mx-auto max-w-[1400px]">
          <header>
            <Link
              href={localeHref('/projects', locale)}
              className="mb-12 inline-block font-sans text-[0.9rem] text-fg transition-colors duration-150 ease-out hover:text-accent underline decoration-fg/30 underline-offset-4 hover:decoration-current"
            >
              {p.backToWork}
            </Link>

            <h1 className="max-w-4xl text-balance font-display text-display-xl text-fg">
              {project.title}
            </h1>
            <p className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-sans text-sm text-fg-muted">
              <span>{statusLabel(project.status, locale)}</span>
              {project.year ? <span className="font-mono tabular-nums">{project.year}</span> : null}
            </p>
            <p className="mt-6 max-w-3xl text-editorial text-fg">{project.oneLiner}</p>

            <div className="mt-12 mb-4">
              {firstImage ? <ProjectImage image={firstImage} /> : <NamePanel title={project.title} />}
            </div>
          </header>

          <Section title={s.problem}>
            <p>{project.problem}</p>
            {project.context ? <p className="mt-4 text-fg-muted">{project.context}</p> : null}
          </Section>

          {project.built.length > 0 ? (
            <Section title={s.built}>
              <ul className="space-y-4">
                {project.built.map((item) => (
                  <li key={item} className="flex gap-4">
                    <span aria-hidden className="shrink-0 text-accent">
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {moreImages.length > 0 ? (
                <div className="mt-10 space-y-6">
                  {moreImages.map((image) => (
                    <ProjectImage key={image.src} image={image} />
                  ))}
                </div>
              ) : null}
            </Section>
          ) : null}

          {project.hardPart ? (
            <Section title={s.hardPart}>
              <h3 className="mb-3 font-display text-xl font-semibold text-fg">
                {project.hardPart.title}
              </h3>
              <p>{project.hardPart.body}</p>
            </Section>
          ) : null}

          {stages.length > 0 ? (
            <Section title={s.progress}>
              <p className="mb-6 font-sans text-sm text-fg-muted">{stageLine}</p>
              <ol className="space-y-3">
                {stages.map((stage) => (
                  <li key={stage.label} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className={stage.state === 'todo' ? 'text-fg-muted' : 'text-fg'}>
                      {stage.label}
                    </span>
                    {stage.state === 'done' ? (
                      <span className="font-sans text-sm text-fg-muted">{p.stageDone}</span>
                    ) : null}
                    {stage.state === 'current' ? (
                      <span className="font-sans text-sm font-semibold text-accent">
                        {p.stageCurrent}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </Section>
          ) : null}

          {project.status === 'building' && project.next && project.next.length > 0 ? (
            <Section title={s.next}>
              <ul className="space-y-3">
                {project.next.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>
          ) : null}

          {project.technology.length > 0 ? (
            <Section title={s.stack}>
              <p>{project.technology.join(', ')}</p>
            </Section>
          ) : null}

          {/* Every project has one working action. Links appear only when the
              data has them; otherwise the walkthrough line and a mailto,
              which always works. Never a disabled button or href="#". */}
          <Section title={s.seeIt}>
            {links.length > 0 ? (
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {links.map((link) => (
                  <ActionLink key={link.href} href={link.href} locale={locale}>
                    {link.label}
                  </ActionLink>
                ))}
              </div>
            ) : (
              <>
                <p>{p.walkthrough}</p>
                <ActionLink href={walkthroughHref} locale={locale} className="mt-6">
                  {p.walkthroughLink}
                </ActionLink>
              </>
            )}
          </Section>
        </div>
      </article>
    </PageShell>
  )
}
