import type { Metadata } from 'next'
import { getPages, type PagesContent } from '@/content/pages'
import { alternatesFor } from '@/lib/alternates'
import { isLocale } from '@/i18n/config'

/**
 * generateMetadata for one of the four pages. Titles are absolute: they are
 * written in full in the copy ("Work | Charles Ndirangu"), so the layout's
 * title template must not wrap them again.
 */
export function pageMetadata(key: keyof PagesContent['meta'], path: string) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>
  }): Promise<Metadata> {
    const { locale } = await params
    if (!isLocale(locale)) return {}
    const { title, description } = getPages(locale).meta[key]
    return {
      title: { absolute: title },
      description,
      alternates: alternatesFor(path, locale),
      openGraph: { title, description },
    }
  }
}
