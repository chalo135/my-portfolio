import type { PhilosophyContent } from './philosophy'

export const philosophyContent: PhilosophyContent = {
  pillars: [
    {
      id: 'quality',
      title: 'Quality',
      headline: 'The books have to balance.',
      description:
        "In Salio, only one function, PostJournal, can write journal lines. It refuses any entry whose debits and credits don't match, and I covered it with unit tests.",
      mark: 'Ubora',
    },
    {
      id: 'craftsmanship',
      title: 'Finishing',
      headline: 'I finish things properly.',
      description:
        'I care about the work and see it through. The examples are in the other principles on this page.',
      mark: 'Ufundi',
    },
    {
      id: 'scalability',
      title: 'Scalability',
      headline: 'One install, many shops.',
      description:
        'Every table in Salio is scoped to a business, so one install can serve many shops.',
      mark: 'Upanuzi',
    },
    {
      id: 'user-centered',
      title: 'User-Centered Design',
      headline: 'Built for the person at the till.',
      description:
        "I'm building Salio for shop owners who aren't accountants. On Pharimz Creatives, checkout takes M-Pesa STK Push, because that's how most customers pay.",
      mark: 'Mtumiaji',
    },
    {
      id: 'performance',
      title: 'Performance',
      headline: 'Keep it fast.',
      description:
        "I don't have measured performance work to show yet.",
      mark: 'Kasi',
    },
    {
      id: 'security',
      title: 'Security',
      headline: 'Fixed after launch.',
      description:
        "On Pharimz Creatives I closed a hole where changing an ID in a request could expose another customer's order. I verified M-Pesa callbacks so a payment can't be faked, and tightened Supabase row-level security.",
      mark: 'Usalama',
    },
    {
      id: 'maintainability',
      title: 'Maintainability',
      headline: 'Code for the next engineer.',
      description:
        "In Salio, stock movements are append-only and reports are calculated when they're read, never stored. Money is kept in whole cents, never floating-point numbers.",
      mark: 'Udumishaji',
    },
    {
      id: 'innovation',
      title: 'New tools',
      headline: 'I keep up with current tools.',
      description:
        'For Kahawa Smart, my university project, I built a TensorFlow model that flags coffee leaf rust from a photo of a leaf, and a chatbot grounded in a RAG pipeline.',
      mark: 'Ubunifu',
    },
  ],

  intro: {
    headline: 'Engineering Philosophy',
    subheadline: 'Each principle points to something I built.',
    description:
      "The examples come from Salio, the point of sale I'm building in C#; Pharimz Creatives, an online shop that's live; and Kahawa Smart, my university project.",
    /** "Njia" — the way, the path: the discipline behind the principles. */
    mark: 'Njia',
  },
}
