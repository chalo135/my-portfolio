// Server component. Only Hero (and the AmbientVideo inside it), Reveal and
// RuleLine ship as client code; everything else here is rendered on the server and never
// hydrates. `locale` is prop-drilled from the page for exactly that reason —
// a locale context would force this whole tree to 'use client'.
import Link from 'next/link'
import Hero from '@/components/home/Hero'
import Reveal from '@/components/ui/Reveal'
import SectionLabel from '@/components/ui/SectionLabel'
import ActionLink from '@/components/ui/ActionLink'
import RuleLine from '@/components/ui/RuleLine'
import { getSite, type Teaser, type ContactTeaser } from '@/content/site'
import { getProjects, statusLabel } from '@/content/projects'
import { getCapabilities } from '@/content/capabilities'
import { localeHref } from '@/lib/locale-href'
import type { Locale } from '@/i18n/config'

function TeaserBlock({ teaser, locale }: { teaser: Teaser; locale: Locale }) {
  const { label, lead, ctaLabel, href } = teaser
  return (
    <section
      data-section={label}
      className="border-t border-line px-[var(--section-padding)] py-section"
    >
      <div className="mx-auto grid max-w-content gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Reveal>
            <SectionLabel>{label}</SectionLabel>
          </Reveal>
          <RuleLine className="mt-6 max-w-[10rem]" delay={0.1} />
        </div>
        <div className="md:col-span-8 md:max-w-3xl">
          <Reveal
            as="p"
            className="text-balance font-sans text-[clamp(1.375rem,2.4vw,2rem)] font-semibold leading-tight text-fg"
          >
            {lead}
          </Reveal>
          <Reveal delay={0.12} className="mt-10">
            <ActionLink href={href} locale={locale}>
              {ctaLabel}
            </ActionLink>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function SelectedWork({ teaser, locale }: { teaser: Teaser; locale: Locale }) {
  // Salio first, then the next two in data order.
  const projects = getProjects(locale)
  const salio = projects.find((project) => project.slug === 'salio')
  const featured = salio
    ? [salio, ...projects.filter((project) => project !== salio).slice(0, 2)]
    : projects.slice(0, 3)
  const { label, ctaLabel, href } = teaser

  return (
    <section
      data-section={label}
      className="border-t border-line px-[var(--section-padding)] py-section"
    >
      <div className="mx-auto max-w-content">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <SectionLabel>{label}</SectionLabel>
          </Reveal>
          <Reveal delay={0.1}>
            <ActionLink href={href} locale={locale}>
              {ctaLabel}
            </ActionLink>
          </Reveal>
        </div>

        <RuleLine className="mt-6" delay={0.1} />

        <ul className="mt-14">
          {featured.map((project) => (
            <li key={project.slug}>
              <Reveal>
                <Link
                  href={localeHref(`/projects/${project.slug}`, locale)}
                  className="group grid grid-cols-1 gap-4 border-t border-line py-10 md:grid-cols-12 md:items-baseline md:gap-8"
                >
                  <div className="md:col-span-2">
                    <span className="block font-sans text-[0.8rem] text-fg-muted">
                      {statusLabel(project.status, locale)}
                    </span>
                  </div>
                  <h2 className="font-display text-display-md font-semibold text-fg transition-colors duration-150 ease-out group-hover:text-accent md:col-span-6">
                    {project.title}
                  </h2>
                  <div className="md:col-span-4">
                    <p className="text-sm leading-relaxed text-fg/90">{project.oneLiner}</p>
                    {project.year ? (
                      <span className="mt-3 block font-mono text-[0.7rem] tabular-nums text-fg-muted">
                        {project.year}
                      </span>
                    ) : null}
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function CapabilitiesStrip({ teaser, locale }: { teaser: Teaser; locale: Locale }) {
  const { label, lead, ctaLabel, href } = teaser
  const capabilities = getCapabilities(locale)

  return (
    <section
      data-section={label}
      className="border-t border-line px-[var(--section-padding)] py-section"
    >
      <div className="mx-auto grid max-w-content gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Reveal>
            <SectionLabel>{label}</SectionLabel>
          </Reveal>
          <RuleLine className="mt-6 max-w-[10rem]" delay={0.1} />
        </div>
        <div className="md:col-span-8">
          <Reveal
            as="p"
            className="max-w-3xl text-balance font-sans text-[clamp(1.375rem,2.4vw,2rem)] font-semibold leading-tight text-fg"
          >
            {lead}
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
              {capabilities.map((capability) => (
                <li
                  key={capability.id}
                  className="font-sans text-[0.8rem] tracking-label text-fg/85"
                >
                  {capability.title}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15} className="mt-12">
            <ActionLink href={href} locale={locale}>
              {ctaLabel}
            </ActionLink>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ContactCta({ teaser, locale }: { teaser: ContactTeaser; locale: Locale }) {
  const { label, headline, lead, ctaLabel, href } = teaser

  return (
    <section
      data-section={label}
      className="border-t border-line px-[var(--section-padding)] py-section"
    >
      <div className="mx-auto max-w-content text-center">
        <Reveal className="flex justify-center">
          <SectionLabel>{label}</SectionLabel>
        </Reveal>
        <Reveal
          as="h2"
          delay={0.08}
          className="mx-auto mt-8 max-w-3xl text-balance font-display text-display-lg font-semibold text-fg"
        >
          {headline}
        </Reveal>
        <Reveal
          as="p"
          delay={0.16}
          className="mx-auto mt-8 max-w-measure text-editorial leading-relaxed text-fg/90"
        >
          {lead}
        </Reveal>
        <Reveal delay={0.24} className="mt-12 flex justify-center">
          <ActionLink href={href} locale={locale}>
            {ctaLabel}
          </ActionLink>
        </Reveal>
      </div>
    </section>
  )
}

export default function HomeContent({ locale }: { locale: Locale }) {
  const { homeTeasers } = getSite(locale)

  return (
    <>
      <Hero locale={locale} />
      <TeaserBlock teaser={homeTeasers.philosophy} locale={locale} />
      <SelectedWork teaser={homeTeasers.work} locale={locale} />
      <CapabilitiesStrip teaser={homeTeasers.capabilities} locale={locale} />
      <ContactCta teaser={homeTeasers.contact} locale={locale} />
    </>
  )
}
