import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import { localeTags, type Locale } from '@/i18n/config'

/**
 * tailwind-merge has to be told about the custom font sizes in
 * tailwind.config.ts. Without this it has no idea `text-display-xl` is a size,
 * classifies it as a text *colour*, and silently drops it whenever a real
 * colour follows in the same string — so `text-display-xl … text-fg` collapsed
 * to just `text-fg` and every display heading on the site rendered at the
 * default 16px. Any new key added to `theme.extend.fontSize` belongs here too.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display-xl', 'display-lg', 'display-md', 'editorial'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Long-form date for article listings. Unlike the StatusStrip clock, this one
 * DOES follow the locale: it spells the month out, so under sw-KE it needs to
 * read "15 Novemba 2025" rather than "November 15, 2025".
 */
export function formatDate(date: string, locale: Locale = 'en') {
  return new Intl.DateTimeFormat(localeTags[locale], {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}
