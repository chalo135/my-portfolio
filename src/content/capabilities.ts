import type { Locale } from '@/i18n/config'
import { capabilityContent as en } from './capabilities.en'
import { capabilityContent as sw } from './capabilities.sw'

export interface Capability {
  id: string
  title: string
  description: string
  /** Technology names — proper nouns, identical in every locale. */
  areas: string[]
}

const dictionaries: Record<Locale, Capability[]> = { en, sw }

export function getCapabilities(locale: Locale): Capability[] {
  return dictionaries[locale]
}
