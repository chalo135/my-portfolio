import { notFound } from 'next/navigation'
import PageShell from '@/components/layout/PageShell'
import { pageMetadata } from '@/lib/page-meta'
import { isLocale } from '@/i18n/config'

export const generateMetadata = pageMetadata('contact', '/contact')

// Phase 1 placeholder: the heading only.
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return (
    <PageShell locale={locale}>
      <h1 className="px-10 py-10 text-5xl font-bold">{"Let's talk"}</h1>
    </PageShell>
  )
}
