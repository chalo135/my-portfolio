import type { Metadata } from 'next'
import { getPages, type PagesContent } from '@/content/pages'
import { getSite } from '@/content/site'
import { alternatesFor, pageUrl } from '@/lib/alternates'
import { isLocale, localeOgTags, type Locale } from '@/i18n/config'

/** Size of the card drawn by src/app/[locale]/opengraph-image.tsx. */
export const ogImageSize = { width: 1200, height: 630 }

/**
 * Open Graph and Twitter tags for one page. A page's `openGraph` replaces the
 * layout's whole object (Next does not deep-merge it), so every page states
 * the full set here: url, site name, locale, type and the image.
 * The image path is the per-locale card, exported with no file extension.
 */
export function socialMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string
): Pick<Metadata, 'openGraph' | 'twitter'> {
  const { site } = getSite(locale)
  const image = {
    url: `/${locale}/opengraph-image`,
    ...ogImageSize,
    type: 'image/png',
    alt: `${site.name}, ${site.role}`,
  }
  return {
    openGraph: {
      title,
      description,
      url: pageUrl(locale, path),
      siteName: site.name,
      locale: localeOgTags[locale],
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

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
      ...socialMetadata(locale, path, title, description),
    }
  }
}
