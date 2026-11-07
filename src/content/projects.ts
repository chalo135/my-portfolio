import type { Locale } from '@/i18n/config'
import { projectContent as en, statusLabels as enStatus } from './projects.en'
import { projectContent as sw, statusLabels as swStatus } from './projects.sw'

/** Where a project stands, in plain words. There is deliberately no
 *  "coming soon": everything listed exists in some form today. */
export type ProjectStatus = 'building' | 'live' | 'client' | 'finished'

export interface Project {
  /** Shared across locales. A stable URL is what lets the locale toggle swap
   *  the prefix and land the visitor on the same project. */
  slug: string
  /** Project names stay in English in every locale. */
  title: string
  status: ProjectStatus
  /** One sentence: what it is. */
  oneLiner: string
  /** The problem it solves, one or two sentences. */
  problem: string
  /** Rendered under the problem, e.g. who it was shaped around. */
  context?: string
  /** What exists today, as short sentences. Never what is promised. */
  built: string[]
  /** One real engineering problem and how it was solved. */
  hardPart?: { title: string; body: string }
  /** What comes next. Only for work that is still being built. */
  next?: string[]
  /** Real build stages, for the one project that has them. Progress is
   *  computed from these; never typed in as a number. */
  stages?: { label: string; state: 'done' | 'current' | 'todo' }[]
  /** Technology names — the stack. Proper nouns, identical in every locale. */
  technology: string[]
  /** Only URLs that work. No entry means no link is rendered at all. */
  links?: { live?: string; repo?: string }
  /** Real screenshots under public/projects/<slug>/. No entry means the
   *  flat name panel, never a stand-in image. */
  images?: { src: string; alt: string; width: number; height: number }[]

  // Fields from the earlier case-study layout. Kept on the interface so
  // nothing that set them breaks, but the current pages do not render them.
  /** Digits only — identical in every locale. Shown when present. */
  year?: string
  tagline?: string
  category?: string
  overview?: string
  research?: string
  architecture?: string
  solution?: string
  impact?: string[]
  lessons?: string[]
  featured?: boolean
}

const dictionaries: Record<Locale, Project[]> = { en, sw }
const statusDictionaries: Record<Locale, Record<ProjectStatus, string>> = {
  en: enStatus,
  sw: swStatus,
}

export function getProjects(locale: Locale): Project[] {
  return dictionaries[locale]
}

export function getProject(slug: string, locale: Locale): Project | undefined {
  return dictionaries[locale].find((p) => p.slug === slug)
}

/** The label for a status, e.g. 'Building now' / 'Ninaijenga sasa'. */
export function statusLabel(status: ProjectStatus, locale: Locale): string {
  return statusDictionaries[locale][status]
}

/** Slugs are locale-independent, so `generateStaticParams` and the sitemap can
 *  read them without picking a locale. */
export const projectSlugs: string[] = en.map((p) => p.slug)
