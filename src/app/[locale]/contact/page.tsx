import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageShell from '@/components/layout/PageShell'
import TextReveal from '@/components/ui/TextReveal'
import ActionLink from '@/components/ui/ActionLink'
import { getSite } from '@/content/site'
import { getPages } from '@/content/pages'
import { alternatesFor } from '@/lib/alternates'
import { isLocale } from '@/i18n/config'

// This page was 'use client' before the locale work. It held no client state
// of its own — TextReveal is already a client component — and a client
// component cannot export generateMetadata, which is what the brief asked for.
// So it is a server component now.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const { meta } = getPages(locale)
  return {
    title: meta.contact.title,
    description: meta.contact.description,
    alternates: alternatesFor('/contact', locale),
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const { site, socialItems } = getSite(locale)
  const { contact } = getPages(locale)

  return (
    <PageShell locale={locale}>
      <section className="min-h-screen flex items-center justify-center section-padding">
        <div className="max-w-[1400px] mx-auto w-full text-center">
          <TextReveal as="p" className="font-sans text-xs tracking-label text-fg-muted mb-8">
            {contact.label}
          </TextReveal>

          <TextReveal
            as="h1"
            delay={0.1}
            className="font-display text-display-xl text-fg text-balance mb-8"
          >
            {contact.title}
          </TextReveal>

          <TextReveal as="p" delay={0.2} className="text-editorial text-fg/90 max-w-lg mx-auto mb-16">
            {contact.lead}
          </TextReveal>

          <TextReveal delay={0.35}>
            <ActionLink
              href={`mailto:${site.email}`}
              locale={locale}
              className="border border-fg/25 px-12 py-5 text-base no-underline hover:border-accent"
            >
              {contact.ctaLabel}
            </ActionLink>
          </TextReveal>

          <TextReveal delay={0.5} className="mt-20">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              <a
                href={`mailto:${site.email}`}
                className="font-sans text-sm text-fg hover:text-accent transition-colors duration-150 ease-out underline decoration-fg/30 underline-offset-4 hover:decoration-current"
              >
                {site.email}
              </a>
              {socialItems
                .filter((social) => social.href.startsWith('http'))
                .map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-fg hover:text-accent transition-colors duration-150 ease-out underline decoration-fg/30 underline-offset-4 hover:decoration-current"
                  >
                    {social.label}
                  </a>
                ))}
            </div>
          </TextReveal>
        </div>
      </section>
    </PageShell>
  )
}
