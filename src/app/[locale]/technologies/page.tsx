import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageShell from '@/components/layout/PageShell'
import { PageHero } from '@/components/ui/TextReveal'
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
    title: meta.technologies.title,
    description: meta.technologies.description,
    alternates: alternatesFor('/technologies', locale),
  }
}

export default async function TechnologiesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const technologyCategories = getTechnologies(locale)
  const { hero } = getPages(locale).technologies

  return (
    <PageShell locale={locale}>
      <PageHero label={hero.label} title={hero.title} description={hero.description} />

      <section className="section-padding pt-0">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {technologyCategories.map((category) => (
              <div key={category.name}>
                <h2 className="font-sans text-xs tracking-label text-fg-muted mb-6">
                  {category.name}
                </h2>
                <ul className="space-y-3">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="text-fg/85 text-sm hover:text-accent transition-colors duration-150 ease-out"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}
