// Page-level chrome: the PageHero copy, per-page metadata, section headings and
// the small inline strings ("read", "The problem", "What I built") that
// were hardcoded in English inside the page components.
//
// This module is not in the original eight. It exists because splitting only
// the content files would have left every page heading, every case-study
// section title and the whole contact page in English under /sw.

import type { Locale } from '@/i18n/config'
import { pagesContent as en } from './pages.en'
import { pagesContent as sw } from './pages.sw'

export interface PageHeroCopy {
  label: string
  title: string
  description: string
}

export interface MetaCopy {
  title: string
  description: string
}

export interface PagesContent {
  meta: {
    about: MetaCopy
    capabilities: MetaCopy
    contact: MetaCopy
    experience: MetaCopy
    philosophy: MetaCopy
    projects: MetaCopy
    resume: MetaCopy
    technologies: MetaCopy
    writing: MetaCopy
    projectNotFound: string
    articleNotFound: string
  }
  projects: {
    hero: PageHeroCopy
    backToWork: string
    /** Headings for the two groups on the project list. */
    groups: { building: string; shipped: string }
    /** Detail-page section headings, sentence case, unnumbered. */
    sections: {
      problem: string
      built: string
      hardPart: string
      progress: string
      next: string
      stack: string
      seeIt: string
    }
    /** "Stage {current} of {total}" — both numbers come from the data. */
    stageOf: string
    stageDone: string
    stageCurrent: string
    liveLink: string
    repoLink: string
    /** Shown in place of links when a project has none. */
    walkthrough: string
    walkthroughLink: string
    /** Email subject prefix; the project title is appended. */
    walkthroughSubject: string
  }
  writing: {
    hero: PageHeroCopy
    backToWriting: string
    /** Rendered after the duration, e.g. "8 min read". */
    read: string
  }
  capabilities: { hero: PageHeroCopy }
  technologies: { hero: PageHeroCopy }
  experience: { hero: PageHeroCopy }
  resume: {
    hero: PageHeroCopy
    experienceHeading: string
    capabilitiesHeading: string
    technologiesHeading: string
  }
  about: {
    whatIWorkOn: string
    getInTouch: string
  }
  contact: {
    label: string
    title: string
    lead: string
    ctaLabel: string
  }
  notFound: {
    title: string
    body: string
    back: string
  }
  error: {
    label: string
    title: string
    body: string
    retry: string
    home: string
  }
}

const dictionaries: Record<Locale, PagesContent> = { en, sw }

export function getPages(locale: Locale): PagesContent {
  return dictionaries[locale]
}
