import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageShell from '@/components/layout/PageShell'
import { PageHero } from '@/components/ui/TextReveal'
import { getWritingPosts } from '@/content/writing'
import { getPages } from '@/content/pages'
import { localeHref } from '@/lib/locale-href'
import { alternatesFor } from '@/lib/alternates'
import { formatDate } from '@/lib/utils'
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
    title: meta.writing.title,
    description: meta.writing.description,
    alternates: alternatesFor('/writing', locale),
  }
}

export default async function WritingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const writingPosts = getWritingPosts(locale)
  const { hero, read } = getPages(locale).writing

  return (
    <PageShell locale={locale}>
      <PageHero label={hero.label} title={hero.title} description={hero.description} />

      <section className="section-padding pt-0">
        <div className="max-w-[1400px] mx-auto">
          {writingPosts.map((post) => (
            <Link
              key={post.slug}
              href={localeHref(`/writing/${post.slug}`, locale)}
              className="group block py-12 border-t border-line"
            >
              <article className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-2">
                  <span className="font-mono text-xs text-fg-muted">
                    {formatDate(post.date, locale)}
                  </span>
                </div>
                <div className="lg:col-span-7">
                  <span className="font-sans text-xs text-fg-muted mb-3 block">
                    {post.category}
                  </span>
                  <h2 className="font-display text-2xl text-fg group-hover:text-accent transition-colors duration-150 ease-out mb-3">
                    {post.title}
                  </h2>
                  <p className="text-sm text-fg/90 leading-relaxed">{post.excerpt}</p>
                </div>
                <div className="lg:col-span-3 lg:text-right">
                  <span className="font-sans text-xs text-fg-muted">
                    {post.readTime} {read}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
