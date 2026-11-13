import type { ExperienceEntry } from './experience'

// Charles's three real roles. Highlights only say what the facts support, so
// some roles have fewer than three (Fiberlink has none).

export const experienceContent: ExperienceEntry[] = [
  {
    id: 'exp-1',
    role: 'Freelance software developer',
    organization: 'Self-employed',
    period: 'Apr 2025 to now',
    description:
      'Software work for clients, alongside operations in the family business.',
    highlights: [
      'Host client sites on Ubuntu servers',
      'My own Linux VPS runs Docker, Nginx and Caddy',
      'Deploys go out through GitHub Actions',
    ],
  },
  {
    id: 'exp-2',
    role: 'Operations',
    organization: 'Family business',
    period: 'May 2023 to now',
    description:
      'I work in operations for the family business, which does plumbing and bio-digesters.',
    highlights: [
      'Plumbing and bio-digester work for about 12 large clients',
    ],
  },
  {
    id: 'exp-3',
    role: 'Network support',
    organization: 'Fiberlink',
    period: 'Attachment',
    description:
      'A network support attachment at Fiberlink.',
    highlights: [],
  },
]
