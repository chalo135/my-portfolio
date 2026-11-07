import type { Locale } from '@/i18n/config'
import { philosophyContent as en } from './philosophy.en'
import { philosophyContent as sw } from './philosophy.sw'

export interface PhilosophyPillar {
  id: string
  title: string
  headline: string
  description: string
  /** Single Kiswahili word set as a large, faint vertical watermark behind
   *  this pillar. Decorative: aria-hidden, and never the pillar's title.
   *  Identical in every locale — it is the identity layer, not translated copy. */
  mark: string
}

export interface PhilosophyIntro {
  headline: string
  subheadline: string
  description: string
  mark: string
}

export interface PhilosophyContent {
  pillars: PhilosophyPillar[]
  intro: PhilosophyIntro
}

const dictionaries: Record<Locale, PhilosophyContent> = { en, sw }

export function getPhilosophy(locale: Locale): PhilosophyContent {
  return dictionaries[locale]
}
