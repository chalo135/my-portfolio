// Identity and chrome copy: navigation, hero, footer, contact, and the small
// UI strings that used to sit inline in components. Interfaces and the resolver
// live here; the copy itself lives in site.en.ts / site.sw.ts.
//
// Both locale files are annotated `: SiteContent`, so a missing or misspelled
// key fails `tsc` at the definition site rather than surfacing as a blank on
// the page. That is the whole guardrail — there is no runtime fallback.

import type { Locale } from '@/i18n/config'
import { siteContent as en } from './site.en'
import { siteContent as sw } from './site.sw'

export interface NavItem {
  label: string
  href: string
}

export interface SocialItem {
  label: string
  href: string
}

export interface FooterGroup {
  heading: string
  items: NavItem[]
}

export interface SiteIdentity {
  name: string
  monogram: string
  role: string
  location: string
  tagline: string
  description: string
  ethos: string
  email: string
}

export interface HeroCopy {
  eyebrow: string
  headline: string
  subhead: string
  ctaLabel: string
  ctaHref: string
}

export interface Teaser {
  index: string
  label: string
  lead: string
  ctaLabel: string
  href: string
}

export interface ContactTeaser extends Teaser {
  headline: string
}

/** Small strings that live in chrome rather than in page content: aria labels,
 *  button text, the skip link. Previously hardcoded English inside components. */
export interface UiCopy {
  skipToContent: string
  primaryNavLabel: string
  footerNavLabel: string
  openMenu: string
  siteMenu: string
  close: string
  top: string
  backToTop: string
  switchTo: Record<Locale, string>
}

export interface SiteContent {
  site: SiteIdentity
  meta: { keywords: string[] }
  ui: UiCopy
  navItems: NavItem[]
  footerItems: NavItem[]
  footerGroups: FooterGroup[]
  socialItems: SocialItem[]
  hero: HeroCopy
  homeTeasers: {
    philosophy: Teaser
    work: Teaser
    capabilities: Teaser
    contact: ContactTeaser
  }
}

const dictionaries: Record<Locale, SiteContent> = { en, sw }

export function getSite(locale: Locale): SiteContent {
  return dictionaries[locale]
}

/* --- locale-independent ---------------------------------------------------- */

// Ambient background media, one pair per theme. Graded soft and low-contrast on
// purpose: the hero displaces them, and displacement reads as liquid on soft
// gradients but as glitch on hard edges.
export const media = {
  light: { video: '/videos/sunny.mp4', poster: '/images/sunny-poster.jpg' },
  dark: { video: '/videos/rainy.mp4', poster: '/images/rainy-poster.jpg' },
} as const

/**
 * Every static route, without a locale prefix. The single source of truth for
 * the sitemap and for the redirect table in public/.htaccess. Labels are
 * localized; paths are not — a shared URL shape is what lets the locale toggle
 * swap the prefix and land the visitor on the same page.
 */
export const routePaths = [
  '/',
  '/projects',
  '/philosophy',
  '/about',
  '/capabilities',
  '/technologies',
  '/experience',
  '/writing',
  '/resume',
  '/contact',
] as const
