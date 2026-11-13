import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import { localeTags, type Locale } from '@/i18n/config'

/**
 * tailwind-merge (v2) already treats any `text-*` / `bg-*` word as a colour,
 * so the colour tokens need nothing. It does not know the custom shadow keys
 * in tailwind.config.ts; registering them lets a later shadow class override
 * an earlier one.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [{ shadow: ['paper', 'sticky', 'postcard', 'card', 'disc'] }],
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
