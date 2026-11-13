// The Contact page: copy, the email templates and the sticky-note links.
// The copy lives in contact.en.ts / contact.sw.ts; the contact details come
// from `contact` in site.ts.

import type { Locale } from '@/i18n/config'
import { contact } from './site'
import { contactContent as en } from './contact.en'
import { contactContent as sw } from './contact.sw'

export type Topic = 'job' | 'project' | 'other'

/** In display order. The first is the default choice. */
export const topics: Topic[] = ['job', 'project', 'other']

export interface ContactCopy {
  heading: string
  intro: string
  form: {
    nameLabel: string
    namePlaceholder: string
    topicLegend: string
    topics: Record<Topic, string>
    messageLabel: string
    messagePlaceholder: string
    submit: string
    helper: string
    nameError: string
    messageError: string
    /** `{name}` becomes the sender's name. */
    subjects: Record<Topic, string>
  }
  address: {
    to: string
    location: string
  }
  stamp: {
    city: string
    zone: string
    /** `{time}` becomes HH:mm. */
    label: string
    /** Used before the time is known (the server render). */
    labelPending: string
  }
  direct: {
    heading: string
    email: string
    whatsapp: string
    github: string
    linkedin: string
    copy: string
    copied: string
  }
}

const dictionaries: Record<Locale, ContactCopy> = { en, sw }

export function getContactCopy(locale: Locale): ContactCopy {
  return dictionaries[locale]
}

/** `Job opportunity from {name}` with the name filled in. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
}

/** mailto: URL with the subject and body encoded. Body: message, a blank line, name. */
export function mailtoUrl(email: string, subject: string, message: string, name: string): string {
  const body = `${message}\n\n${name}`
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/* --- sticky notes ------------------------------------------------------------ */

export type DirectKind = 'email' | 'whatsapp' | 'github' | 'linkedin'

export interface DirectLink {
  kind: DirectKind
  href: string
  /** The value as shown on the note. */
  text: string
  color: 'yellow' | 'green' | 'sand' | 'pink'
  tilt: number
}

/** 254759260271 → +254 759 260 271 */
function formatPhone(digits: string): string {
  const m = digits.match(/^(\d{3})(\d{3})(\d{3})(\d{3})$/)
  return m ? `+${m[1]} ${m[2]} ${m[3]} ${m[4]}` : `+${digits}`
}

/** https://github.com/chalo135 → github.com/chalo135 */
function shortUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

/** Only the details that exist, in order: Email, WhatsApp, GitHub, LinkedIn. */
export function directLinks(): DirectLink[] {
  const links: DirectLink[] = []
  if (contact.email) {
    links.push({ kind: 'email', href: `mailto:${contact.email}`, text: contact.email, color: 'yellow', tilt: -2 })
  }
  if (contact.whatsapp) {
    links.push({
      kind: 'whatsapp',
      href: `https://wa.me/${contact.whatsapp}`,
      text: formatPhone(contact.whatsapp),
      color: 'green',
      tilt: 1.5,
    })
  }
  if (contact.github) {
    links.push({ kind: 'github', href: contact.github, text: shortUrl(contact.github), color: 'sand', tilt: -1 })
  }
  if (contact.linkedin) {
    links.push({ kind: 'linkedin', href: contact.linkedin, text: shortUrl(contact.linkedin), color: 'pink', tilt: 2 })
  }
  return links
}
