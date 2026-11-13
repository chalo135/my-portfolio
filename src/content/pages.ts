// Per-page metadata, page headings and the 404 / error copy.

import type { Locale } from '@/i18n/config'
import { pagesContent as en } from './pages.en'
import { pagesContent as sw } from './pages.sw'

export interface MetaCopy {
  title: string
  description: string
}

export interface PagesContent {
  meta: {
    home: MetaCopy
    work: MetaCopy
    about: MetaCopy
    contact: MetaCopy
  }
  notFound: {
    title: string
    body: string
    back: string
  }
  error: {
    title: string
    body: string
    retry: string
    home: string
  }
}

const dictionaries: Record<Locale, PagesContent> = { en, sw }

export function getPages(locale: Locale): PagesContent {
  return dictionaries[locale]
}
