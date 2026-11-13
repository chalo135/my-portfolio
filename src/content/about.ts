// The About page. Locale-independent facts live here; the copy and the
// translatable notebook values live in about.en.ts / about.sw.ts.
//
// Every notebook value is optional: leave one out and its row disappears.
// Without `born`, both the Age row and the DAX line disappear.

import type { Locale } from '@/i18n/config'
import { aboutContent as en } from './about.en'
import { aboutContent as sw } from './about.sw'

export type FactKey = 'age' | 'height' | 'weight' | 'sex' | 'livesIn'

export interface AboutCopy {
  heading: string
  /** The statement, before the name in Caveat. */
  statement: string
  /** Shown in Caveat, crimson, after `statement`. */
  statementName: string
  paragraphs: string[]
  photoAlt: string
  /** Handwritten, lower case. */
  photoCaption: string
  cvButton: string
  notebookTitle: string
  /** `{date}` becomes the build month, e.g. "November 2026". */
  updated: string
  labels: Record<FactKey, string>
  /** Values that need translating. Leave one out to drop its row. */
  values: { sex?: string; livesIn?: string }
}

/** Facts that read the same in every language. */
export const aboutFacts: {
  /** YYYY-MM-DD. */
  born?: string
  height?: string
  weight?: string
} = {
  born: '2003-09-10',
  height: '5\'2" (157 cm)',
  weight: '59 kg',
}

/** Shown under the notebook rows when there is a date of birth. Not translated. */
export const daxLine = 'Age = INT ( YEARFRAC ( Chalo[Born], TODAY (), 1 ) )'

export const photoSrc = '/me/chalo.jpg'
export const cvHref = '/cv/charles-ndirangu-cv.pdf'

const dictionaries: Record<Locale, AboutCopy> = { en, sw }

export function getAboutCopy(locale: Locale): AboutCopy {
  return dictionaries[locale]
}

/** Nairobi is UTC+3 all year (no daylight saving). */
const NAIROBI_OFFSET_MS = 3 * 60 * 60 * 1000

/**
 * Whole years between `birth` (YYYY-MM-DD) and the Nairobi calendar date of
 * `on`. Pure. The birthday counts from its own day; a 29 February birthday
 * counts from 1 March in other years. Returns NaN for a malformed date.
 */
export function ageOn(birth: string, on: Date): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birth)
  if (!m) return NaN
  const [by, bm, bd] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const local = new Date(on.getTime() + NAIROBI_OFFSET_MS)
  const y = local.getUTCFullYear()
  const mo = local.getUTCMonth() + 1
  const d = local.getUTCDate()
  const beforeBirthday = mo < bm || (mo === bm && d < bd)
  return y - by - (beforeBirthday ? 1 : 0)
}

export interface FactRow {
  key: FactKey
  label: string
  value: string
}

/**
 * The notebook rows that have a value, in order. The Age row's value is the
 * age on `on`; the page re-renders it on the client.
 */
export function getFactRows(locale: Locale, on: Date): FactRow[] {
  const copy = dictionaries[locale]
  const values: Record<FactKey, string | undefined> = {
    age: aboutFacts.born ? String(ageOn(aboutFacts.born, on)) : undefined,
    height: aboutFacts.height,
    weight: aboutFacts.weight,
    sex: copy.values.sex,
    livesIn: copy.values.livesIn,
  }
  return (Object.keys(copy.labels) as FactKey[]).flatMap((key) => {
    const value = values[key]
    return value ? [{ key, label: copy.labels[key], value }] : []
  })
}
