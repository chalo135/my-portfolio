import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageShell from '@/components/layout/PageShell'
import Reveal from '@/components/ui/Reveal'
import SectionLabel from '@/components/ui/SectionLabel'
import { getPhilosophy } from '@/content/philosophy'
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
    title: meta.philosophy.title,
    description: meta.philosophy.description,
    alternates: alternatesFor('/philosophy', locale),
  }
}

export default async function PhilosophyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const { pillars, intro } = getPhilosophy(locale)

  return (
    <PageShell locale={locale}>
      <header className="relative isolate overflow-hidden px-[var(--section-padding)] pb-section-sm pt-40 md:pt-48">
        {/* Decoration only. Not wrapped in Reveal — decoration does not
            animate in — and aria-hidden so it is never announced. */}
        <span aria-hidden className="pillar-mark pillar-mark-intro">
          {intro.mark}
        </span>
        <div className="mx-auto max-w-content">
          <Reveal on="load">
            <SectionLabel>{intro.headline}</SectionLabel>
          </Reveal>
          <Reveal
            as="h1"
            on="load"
            mask
            delay={0.12}
            className="mt-8 max-w-4xl text-balance font-display text-display-xl font-bold text-fg"
          >
            {intro.subheadline}
          </Reveal>
          <Reveal
            as="p"
            on="load"
            delay={0.28}
            className="mt-10 max-w-measure text-editorial leading-relaxed text-fg/90"
          >
            {intro.description}
          </Reveal>
        </div>
      </header>

      <section className="px-[var(--section-padding)] pb-section">
        <div className="mx-auto max-w-content">
          {pillars.map((pillar) => (
            <Reveal key={pillar.id}>
              <article className="relative isolate grid grid-cols-1 gap-6 overflow-hidden border-t border-line py-14 md:grid-cols-12 md:gap-8">
                <span aria-hidden className="pillar-mark">
                  {pillar.mark}
                </span>
                <div className="md:col-span-5">
                  <h2 className="font-display text-display-md font-semibold text-fg">
                    {pillar.title}
                  </h2>
                </div>
                <div className="md:col-span-7">
                  <p className="mb-5 text-balance font-sans text-xl font-semibold text-fg/80">
                    {pillar.headline}
                  </p>
                  <p className="text-measure text-editorial leading-relaxed text-fg/90">
                    {pillar.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
