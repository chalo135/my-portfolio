// Home page copy. The interface and resolver live here; the words live in
// home.en.ts / home.sw.ts.

import type { Locale } from '@/i18n/config'
import { homeContent as en } from './home.en'
import { homeContent as sw } from './home.sw'

export interface HomeCard {
  /** Upper case, on the card's top band. Not translated. */
  name: string
  role: string
  location: string
  /** Screen-reader text for the whole card. */
  alt: string
}

export interface HomeContent {
  heading: string
  intro: string
  ctaWork: string
  ctaContact: string
  /** The yellow sticky note, one string per line. */
  sticky: [string, string]
  /** Handwritten notes, lower case. */
  noteLaptop: string
  noteMe: string
  noteTug: string
  notebookLabel: string
  /** Accessible name of the laptop link. */
  laptopLabel: string
  card: HomeCard
}

const dictionaries: Record<Locale, HomeContent> = { en, sw }

export function getHome(locale: Locale): HomeContent {
  return dictionaries[locale]
}
