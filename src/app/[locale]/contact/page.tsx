import { notFound } from 'next/navigation'
import PageShell from '@/components/layout/PageShell'
import StatusLine from '@/components/bench/StatusLine'
import Postcard from '@/components/contact/Postcard'
import DirectNotes from '@/components/contact/DirectNotes'
import { getContactCopy } from '@/content/contact'
import { getSite } from '@/content/site'
import { pageMetadata } from '@/lib/page-meta'
import { isLocale } from '@/i18n/config'

export const generateMetadata = pageMetadata('contact', '/contact')

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const copy = getContactCopy(locale)
  const { site } = getSite(locale)

  return (
    <PageShell locale={locale}>
      <div className="mx-auto max-w-[1160px] px-4 pb-[100px] pt-10 sm:px-10">
        <h1 className="text-[clamp(56px,7.5vw,104px)] font-bold leading-[0.95] tracking-[-0.03em]">
          {copy.heading}
        </h1>
        <p className="mt-[18px] text-[21px] leading-normal">{copy.intro}</p>

        <div className="mt-[54px]">
          <Postcard name={site.name} copy={copy} />
        </div>

        <DirectNotes copy={copy.direct} />

        <StatusLine text={site.status} className="mt-[34px]" />
      </div>
    </PageShell>
  )
}
