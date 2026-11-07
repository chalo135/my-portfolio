import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageShell from '@/components/layout/PageShell'
import HomeContent from '@/components/home/HomeContent'
import { getSite } from '@/content/site'
import { alternatesFor } from '@/lib/alternates'
import { isLocale } from '@/i18n/config'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const { site } = getSite(locale)
  return {
    title: `${site.name} | ${site.role}`,
    description: site.description,
    alternates: alternatesFor('/', locale),
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <PageShell locale={locale}>
      <HomeContent locale={locale} />
    </PageShell>
  )
}
