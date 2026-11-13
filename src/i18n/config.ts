export const locales = ['en', 'sw'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/** Endonyms. Never render "Swahili" in the UI — the language calls itself
 *  Kiswahili, and endonyms are the one thing every language-selector
 *  guideline agrees on. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  sw: 'Kiswahili',
}

/** Short label for the compact header control. */
export const localeCodes: Record<Locale, string> = {
  en: 'EN',
  sw: 'SW',
}

/** BCP 47 tags for `hreflang` and the `lang` attribute. */
export const localeTags: Record<Locale, string> = {
  en: 'en',
  sw: 'sw-KE',
}

/** OpenGraph locale identifiers. */
export const localeOgTags: Record<Locale, string> = {
  en: 'en_US',
  sw: 'sw_KE',
}

