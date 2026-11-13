import { notFound } from 'next/navigation'
import PageShell from '@/components/layout/PageShell'
import Pill from '@/components/bench/Pill'
import { DownloadIcon } from '@/components/bench/Icons'
import AboutPhoto from '@/components/about/AboutPhoto'
import AboutNotebook from '@/components/about/AboutNotebook'
import { cvHref, getAboutCopy, getFactRows } from '@/content/about'
import { publicFileExists } from '@/lib/public-file'
import { pageMetadata } from '@/lib/page-meta'
import { isLocale, localeTags } from '@/i18n/config'

export const generateMetadata = pageMetadata('about', '/about')

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const copy = getAboutCopy(locale)
  // Static export: this is the build date.
  const buildDate = new Date()
  const month = new Intl.DateTimeFormat(localeTags[locale], {
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Nairobi',
  }).format(buildDate)
  const rows = getFactRows(locale, buildDate)
  const hasCv = publicFileExists(cvHref)

  return (
    <PageShell locale={locale}>
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-start gap-x-20 gap-y-16 px-4 pb-[110px] pt-[50px] sm:px-10">
        <AboutPhoto alt={copy.photoAlt} caption={copy.photoCaption} />

        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-[22px]">
          <h1 className="text-[clamp(56px,7vw,96px)] font-bold leading-[0.95] tracking-[-0.03em]">
            {copy.heading}
          </h1>
          <p className="text-[28px] font-medium leading-[1.3]">
            {copy.statement}{' '}
            <span className="font-hand text-[36px] font-bold text-accent">{copy.statementName}</span>
          </p>
          {copy.paragraphs.map((text) => (
            <p key={text} className="max-w-[56ch] text-[19px] leading-[1.6]">
              {text}
            </p>
          ))}
          {hasCv && (
            <Pill
              href={cvHref}
              external
              download
              icon={<DownloadIcon />}
              className="min-h-[50px] self-start font-bold"
            >
              {copy.cvButton}
            </Pill>
          )}

          <AboutNotebook
            title={copy.notebookTitle}
            updated={copy.updated.replace('{date}', month)}
            rows={rows}
            buildDate={buildDate}
          />
        </div>
      </div>
    </PageShell>
  )
}
