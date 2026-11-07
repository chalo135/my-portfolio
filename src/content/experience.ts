import type { Locale } from '@/i18n/config'
import { experienceContent as en } from './experience.en'
import { experienceContent as sw } from './experience.sw'

export interface ExperienceEntry {
  id: string
  role: string
  organization: string
  /** When, in plain words (e.g. "Apr 2025 to now"). Translated per locale. */
  period: string
  description: string
  highlights: string[]
}

const dictionaries: Record<Locale, ExperienceEntry[]> = { en, sw }

export function getExperience(locale: Locale): ExperienceEntry[] {
  return dictionaries[locale]
}
