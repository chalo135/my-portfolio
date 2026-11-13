import { notFound } from 'next/navigation'
import PageShell from '@/components/layout/PageShell'
import Desk from '@/components/home/Desk'
import { getHome } from '@/content/home'
import { getSite } from '@/content/site'
import { pageMetadata } from '@/lib/page-meta'
import { publicFileExists } from '@/lib/public-file'
import { isLocale } from '@/i18n/config'

export const generateMetadata = pageMetadata('home', '/')

const PHOTO = '/me/chalo.jpg'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const copy = getHome(locale)
  const { site } = getSite(locale)
  // Checked at build time; until the photo exists the card shows the monogram.
  const photo = publicFileExists(PHOTO) ? PHOTO : undefined

  return (
    <PageShell locale={locale}>
      <Desk locale={locale} copy={copy} status={site.status} photo={photo} />
    </PageShell>
  )
}
