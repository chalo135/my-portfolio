// The Work page: projects, in order, and the tech list.
// Locale-independent data lives here; titles, descriptors, image alt text and
// the page copy live in work.en.ts / work.sw.ts.

import type { Locale } from '@/i18n/config'
import { workContent as en } from './work.en'
import { workContent as sw } from './work.sw'

export interface WorkProject {
  slug: string
  title: string
  descriptor: string
  /** Live site. Only set for sites that load today. Never '#'. */
  url?: string
  /**
   * Screenshot at public/work/<slug>.webp (or .jpg), 1600×800. The page
   * checks for the file at build time; with none, the print shows the panel.
   */
  image?: { src: string; alt: string }
  /** The flat panel shown when there is no screenshot. */
  panel: { bg: string; fg: string }
  /** Degrees. */
  tilt: number
}

export interface WorkCopy {
  heading: string
  /** Handwritten, lower case. */
  note: string
  /** Sticky note; `{count}` becomes the two-digit project count. */
  sticky: string
  visitSite: string
  opensNewTab: string
  techHeading: string
  techIntro: string
  /** Per slug: title, descriptor and screenshot alt text. */
  projects: Record<string, { title: string; descriptor: string; imageAlt: string }>
}

interface ProjectBase {
  slug: string
  url?: string
  panel: { bg: string; fg: string }
  tilt: number
}

/**
 * In this order. Pharimz Creatives has no `url`: the brief allowed the link
 * only if pharimzcreatives.co.ke works, and on 13 Nov 2026 it refused
 * the connection. Add it back here when the site is up.
 */
const projectBases: ProjectBase[] = [
  { slug: 'salio', panel: { bg: '#2A2622', fg: '#F4D87A' }, tilt: -1.6 },
  { slug: 'pharimz', panel: { bg: '#A8141C', fg: '#FFFFFF' }, tilt: 1.4 },
  { slug: 'jade-wears', panel: { bg: '#E9DFC8', fg: '#2A2622' }, tilt: -1.2 },
  { slug: 'kahawa-smart', panel: { bg: '#4F8A5B', fg: '#FBF7EE' }, tilt: 1.8 },
  { slug: 'car-moto', panel: { bg: '#9AA3B5', fg: '#2A2622' }, tilt: -1.4 },
  { slug: 'agrofert', panel: { bg: '#E3A92B', fg: '#2A2622' }, tilt: 1.2 },
]

export const projectSlugs = projectBases.map((p) => p.slug)

const dictionaries: Record<Locale, WorkCopy> = { en, sw }

export function getWorkCopy(locale: Locale): WorkCopy {
  return dictionaries[locale]
}

/**
 * Projects for one locale. `imageFor` resolves a slug to a screenshot path
 * when one exists; the Work page passes a build-time file check, so this
 * module stays free of node:fs.
 */
export function getWork(
  locale: Locale,
  imageFor: (slug: string) => string | undefined = () => undefined
): WorkProject[] {
  const copy = dictionaries[locale]
  return projectBases.map((base) => {
    const text = copy.projects[base.slug]
    const src = imageFor(base.slug)
    return {
      ...base,
      title: text.title,
      descriptor: text.descriptor,
      image: src ? { src, alt: text.imageAlt } : undefined,
    }
  })
}

/** Two digits: 6 → '06'. */
export function projectCount(): string {
  return String(projectBases.length).padStart(2, '0')
}

/* --- tech stickers ---------------------------------------------------------- */

export interface TechItem {
  name: string
  /** Devicon folder; the icon is public/icons/tech/<icon>.svg. Absent → text badge. */
  icon?: string
  /** Shown in the disc when there is no icon. */
  badge?: string
}

export const techList: TechItem[] = [
  { name: 'React', icon: 'react' },
  { name: 'Next.js', icon: 'nextjs' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'JavaScript', icon: 'javascript' },
  { name: 'Tailwind CSS', icon: 'tailwindcss' },
  { name: 'Node.js', icon: 'nodejs' },
  { name: 'Express', icon: 'express' },
  { name: 'Python', icon: 'python' },
  { name: 'FastAPI', icon: 'fastapi' },
  { name: 'C#', icon: 'csharp' },
  { name: '.NET', icon: 'dotnetcore' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'Supabase', icon: 'supabase' },
  { name: 'Redis', icon: 'redis' },
  { name: 'Docker', icon: 'docker' },
  { name: 'Linux', icon: 'linux' },
  { name: 'Nginx', icon: 'nginx' },
  { name: 'Git', icon: 'git' },
  { name: 'GitHub Actions', icon: 'githubactions' },
  { name: 'TensorFlow', icon: 'tensorflow' },
  { name: 'Power BI', badge: 'BI' },
]

/** Sticker tilts, cycled. */
export const stickerTilts = [-6, 4, -3, 7, -5, 3, -7, 5, -2, 6, -4, 2]
