import type { Locale } from '@/i18n/config'
import { writingContent as en } from './writing.en'
import { writingContent as sw } from './writing.sw'

export interface WritingPost {
  /** Shared across locales — see the note on Project.slug. */
  slug: string
  title: string
  excerpt: string
  category: string
  /** ISO date, identical in every locale; formatted per locale at render. */
  date: string
  readTime: string
  /** Body copy. Blocks are separated by a blank line, and a block beginning
   *  with '## ' renders as a heading. Translations must keep that structure. */
  content: string
}

const dictionaries: Record<Locale, WritingPost[]> = { en, sw }

export function getWritingPosts(locale: Locale): WritingPost[] {
  return dictionaries[locale]
}

export function getPost(slug: string, locale: Locale): WritingPost | undefined {
  return dictionaries[locale].find((p) => p.slug === slug)
}

export const writingSlugs: string[] = en.map((p) => p.slug)

/** Publication dates by slug, for the sitemap's lastModified. */
export const writingDates: { slug: string; date: string }[] = en.map((p) => ({
  slug: p.slug,
  date: p.date,
}))
