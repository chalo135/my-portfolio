import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageShell from '@/components/layout/PageShell'
import { PageHero } from '@/components/ui/TextReveal'
import { getExperience } from '@/content/experience'
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
    title: meta.experience.title,
    description: meta.experience.description,
    alternates: alternatesFor('/experience', locale),
  }
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const experienceEntries = getExperience(locale)
  const { hero } = getPages(locale).experience

  return (
    <PageShell locale={locale}>
      <PageHero label={hero.label} title={hero.title} description={hero.description} />

      <section className="section-padding pt-0">
        <div className="max-w-[1400px] mx-auto">
          {experienceEntries.map((entry) => (
            <article
              key={entry.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-16 border-t border-line"
            >
              <div className="lg:col-span-3">
                <span className="font-mono text-xs text-fg-muted">{entry.period}</span>
              </div>
              <div className="lg:col-span-4">
                <h2 className="font-display text-2xl text-fg mb-1">{entry.role}</h2>
                <p className="text-sm text-fg-muted">{entry.organization}</p>
              </div>
              <div className="lg:col-span-5">
                <p className="text-editorial text-fg/90 mb-6">{entry.description}</p>
                <ul className="space-y-2">
                  {entry.highlights.map((highlight) => (
                    <li key={highlight} className="text-sm text-fg/85 flex gap-3">
                      <span className="text-accent shrink-0">—</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
