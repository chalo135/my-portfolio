import type { Locale } from '@/i18n/config'
import { aboutContent as en } from './about.en'
import { aboutContent as sw } from './about.sw'

export interface AboutFact {
  label: string
  value: string
}

export interface AboutContent {
  label: string
  headline: string
  intro: string
  story: string[]
  facts: AboutFact[]
}

const dictionaries: Record<Locale, AboutContent> = { en, sw }

export function getAbout(locale: Locale): AboutContent {
  return dictionaries[locale]
}

/** Locale-independent: the portrait is the same image in both languages.
 *  Add a photo at /public/images/portrait.jpg and set `src` to
 *  '/images/portrait.jpg'. While `src` is empty the portrait slot is not
 *  rendered at all, rather than showing a placeholder box. */
export const portrait = {
  src: '/images/net.jpg',
  alt: 'Charles Ndirangu',
}
