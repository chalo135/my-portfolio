import type { ExperienceEntry } from './experience'

// Charles's three real roles, matching experience.en.ts entry for entry.
// Highlights only say what the facts support, so some roles have fewer than
// three (Fiberlink has none). Translated by Claude; check before relying on it.

export const experienceContent: ExperienceEntry[] = [
  {
    id: 'exp-1',
    role: 'Msanidi programu huru',
    organization: 'Najiajiri',
    period: 'Aprili 2025 hadi sasa',
    description:
      'Kazi za programu kwa wateja, sambamba na uendeshaji katika biashara ya familia.',
    highlights: [
      'Ninahifadhi tovuti za wateja kwenye seva za Ubuntu',
      'VPS yangu ya Linux inaendesha Docker, Nginx na Caddy',
      'Masasisho hutolewa kupitia GitHub Actions',
    ],
  },
  {
    id: 'exp-2',
    role: 'Uendeshaji',
    organization: 'Biashara ya familia',
    period: 'Mei 2023 hadi sasa',
    description:
      'Ninafanya kazi ya uendeshaji katika biashara ya familia, inayoshughulikia mabomba na mitambo ya biogesi.',
    highlights: [
      'Kazi ya mabomba na mitambo ya biogesi kwa takriban wateja wakubwa 12',
    ],
  },
  {
    id: 'exp-3',
    role: 'Usaidizi wa mtandao',
    organization: 'Fiberlink',
    period: 'Mafunzo kazini',
    description:
      'Mafunzo kazini ya usaidizi wa mtandao katika Fiberlink.',
    highlights: [],
  },
]
