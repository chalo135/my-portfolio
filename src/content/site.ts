// Identity and chrome copy: navigation, footer and the small UI strings that
// sit inside components. Interfaces and the resolver live here; the copy lives
// in site.en.ts / site.sw.ts.
//
// Both locale files are annotated `: SiteContent`, so a missing key fails
// `tsc` at the definition site rather than showing as a blank on the page.

import type { Locale } from '@/i18n/config'
import { siteContent as en } from './site.en'
import { siteContent as sw } from './site.sw'

export type NavIcon = 'briefcase' | 'smiley' | 'envelope'

export interface NavItem {
  label: string
  href: string
  icon?: NavIcon
}

export interface SiteIdentity {
  name: string
  role: string
  location: string
  description: string
  /** The OG card's second line. */
  ogLine: string
  /** Shown by StatusLine on Home and Contact. */
  status: string
}

/** Small strings that live in chrome rather than in page content. */
export interface UiCopy {
  skipToContent: string
  primaryNavLabel: string
  footerNavLabel: string
  homeLabel: string
  openMenu: string
  siteMenu: string
  close: string
  themeToLight: string
  themeToDark: string
  themeSwitch: string
  switchTo: Record<Locale, string>
}

export interface SiteContent {
  site: SiteIdentity
  meta: { keywords: string[] }
  ui: UiCopy
  /** Header pills. The logo is the link home. */
  navItems: NavItem[]
  /** Footer links: Home, Work, About, Contact. */
  footerItems: NavItem[]
}

const dictionaries: Record<Locale, SiteContent> = { en, sw }

export function getSite(locale: Locale): SiteContent {
  return dictionaries[locale]
}

/* --- locale-independent ---------------------------------------------------- */

/** Contact details. Same in every language. An optional one that is left
 *  empty simply does not render anywhere. */
export const contact = {
  email: 'charlesndirangu10447@gmail.com',
  /** International format, digits only, for https://wa.me/{number}. */
  whatsapp: '254759260271' as string | undefined,
  github: 'https://github.com/chalo135' as string | undefined,
  linkedin: 'https://www.linkedin.com/in/charles-mwangi-ndirangu' as string | undefined,
}

/** The logo text, in Caveat. Not translated. */
export const logo = 'chalo'

/**
 * Every static route, without a locale prefix. The single source of truth for
 * the sitemap and scripts/check-export.mjs. Paths are not localized, so the
 * locale toggle can swap the prefix and land on the same page.
 */
export const routePaths = ['/', '/work', '/about', '/contact'] as const
