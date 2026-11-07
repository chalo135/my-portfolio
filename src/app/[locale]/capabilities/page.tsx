import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageShell from '@/components/layout/PageShell'
import { PageHero } from '@/components/ui/TextReveal'
import { getCapabilities } from '@/content/capabilities'
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
    title: meta.capabilities.title,
    description: meta.capabilities.description,
    alternates: alternatesFor('/capabilities', locale),
  }
}

export default async function CapabilitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const capabilities = getCapabilities(locale)
  const { hero } = getPages(locale).capabilities

  return (
    <PageShell locale={locale}>
      <PageHero label={hero.label} title={hero.title} description={hero.description} />

      <section className="section-padding pt-0">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-line">
          {capabilities.map((cap) => (
            <article
              key={cap.id}
              className="bg-bg p-10 md:p-12 group hover:bg-surface/50 transition-colors duration-150 ease-out"
            >
              <h2 className="font-display text-2xl text-fg group-hover:text-accent transition-colors duration-150 ease-out mb-4">
                {cap.title}
              </h2>
              <p className="text-sm text-fg/90 leading-relaxed mb-8">{cap.description}</p>
              <ul className="space-y-2">
                {cap.areas.map((area) => (
                  <li key={area} className="text-xs font-sans text-fg-muted">
                    {area}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
