import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageShell from '@/components/layout/PageShell'
import { getPost, writingSlugs } from '@/content/writing'
import { getPages } from '@/content/pages'
import { localeHref } from '@/lib/locale-href'
import { alternatesFor } from '@/lib/alternates'
import { formatDate } from '@/lib/utils'
import { locales, isLocale } from '@/i18n/config'

/** Cross product of locales × slugs, or these routes stop prerendering. */
export function generateStaticParams() {
  return locales.flatMap((locale) => writingSlugs.map((slug) => ({ locale, slug })))
}

/** Static export: unknown slugs 404. */
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const { meta } = getPages(locale)
  const post = getPost(slug, locale)
  if (!post) return { title: meta.articleNotFound }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: alternatesFor(`/writing/${slug}`, locale),
  }
}

export default async function WritingArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const post = getPost(slug, locale)
  if (!post) notFound()

  const { backToWriting, read } = getPages(locale).writing
  // Blocks are separated by a blank line; one starting with '## ' is a heading.
  const paragraphs = post.content.split('\n\n')

  return (
    <PageShell locale={locale}>
      <article className="section-padding pt-32 md:pt-40">
        <div className="max-w-3xl mx-auto px-[var(--section-padding)]">
          <Link
            href={localeHref('/writing', locale)}
            className="mb-12 inline-block font-sans text-[0.9rem] text-fg transition-colors duration-150 ease-out hover:text-accent underline decoration-fg/30 underline-offset-4 hover:decoration-current"
          >
            {backToWriting}
          </Link>

          <span className="font-sans text-xs text-fg-muted block mb-4">{post.category}</span>
          <h1 className="font-display text-display-lg text-fg mb-6">{post.title}</h1>

          <div className="flex items-baseline gap-6 font-sans text-xs text-fg-muted mb-16 pb-8 border-b border-line">
            <time dateTime={post.date} className="font-mono tabular-nums">
              {formatDate(post.date, locale)}
            </time>
            <span>
              {post.readTime} {read}
            </span>
          </div>

          <div className="prose-custom space-y-6">
            {paragraphs.map((block, i) => {
              if (block.startsWith('## ')) {
                return (
                  <h2 key={i} className="font-display text-2xl text-fg mt-12 mb-4">
                    {block.replace('## ', '')}
                  </h2>
                )
              }
              return (
                <p key={i} className="text-editorial text-fg/90 leading-relaxed">
                  {block}
                </p>
              )
            })}
          </div>
        </div>
      </article>
    </PageShell>
  )
}
