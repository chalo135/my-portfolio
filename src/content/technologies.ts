import type { Locale } from '@/i18n/config'
import { technologyContent as en } from './technologies.en'
import { technologyContent as sw } from './technologies.sw'

export interface TechnologyCategory {
  /** Category name is translated; `items` are product names and are not. */
  name: string
  items: string[]
}

const dictionaries: Record<Locale, TechnologyCategory[]> = { en, sw }

export function getTechnologies(locale: Locale): TechnologyCategory[] {
  return dictionaries[locale]
}
