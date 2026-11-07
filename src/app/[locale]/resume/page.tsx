import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageShell from '@/components/layout/PageShell'
import { PageHero } from '@/components/ui/TextReveal'
import { getExperience } from '@/content/experience'
import { getCapabilities } from '@/content/capabilities'
import { getTechnologies } from '@/content/technologies'
import { getPages } from '@/content/pages'
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
    title: meta.resume.title,
    description: meta.resume.description,
    alternates: alternatesFor('/resume', locale),
  }
}

export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const experienceEntries = getExperience(locale)
  const capabilities = getCapabilities(locale)
  const technologyCategories = getTechnologies(locale)
  const resume = getPages(locale).resume

  return (
    <PageShell locale={locale}>
      <PageHero
        label={resume.hero.label}
        title={resume.hero.title}
        description={resume.hero.description}
      />

      <section className="section-padding pt-0">
        <div className="max-w-3xl mx-auto px-[var(--section-padding)]">
          <div className="mb-16">
            <h2 className="font-sans text-xs tracking-label text-fg-muted mb-8">
              {resume.experienceHeading}
            </h2>
            {experienceEntries.map((entry) => (
              <div key={entry.id} className="mb-10 pb-10 border-b border-line last:border-0">
                <div className="flex flex-col md:flex-row md:justify-between mb-2">
                  <h3 className="font-display text-xl text-fg">{entry.role}</h3>
                  <span className="font-mono text-xs text-fg-muted">{entry.period}</span>
                </div>
                <p className="text-sm text-fg-muted mb-3">{entry.organization}</p>
                <p className="text-sm text-fg/90 mb-4">{entry.description}</p>
                <ul className="space-y-1">
                  {entry.highlights.map((h) => (
                    <li key={h} className="text-sm text-fg/85">
                      — {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mb-16">
            <h2 className="font-sans text-xs tracking-label text-fg-muted mb-8">
              {resume.capabilitiesHeading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {capabilities.slice(0, 6).map((cap) => (
                <div key={cap.id}>
                  <h3 className="text-fg text-sm font-medium mb-2">{cap.title}</h3>
                  <p className="text-xs text-fg/80">{cap.areas.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-sans text-xs tracking-label text-fg-muted mb-8">
              {resume.technologiesHeading}
            </h2>
            <div className="flex flex-wrap gap-2">
              {technologyCategories
                .flatMap((c) => c.items)
                .map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-xs border border-line text-fg/85 rounded-sm"
                  >
                    {tech}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
