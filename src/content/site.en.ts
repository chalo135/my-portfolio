import type { SiteContent } from './site'

export const siteContent: SiteContent = {
  site: {
    name: 'Charles Ndirangu',
    monogram: 'CN',
    role: 'Software Engineer',
    location: 'Nairobi, Kenya',
    tagline: 'I build online shops and point-of-sale software for small Kenyan businesses.',
    description:
      'Software engineer in Nairobi. I build software for small Kenyan businesses: a live online shop with M-Pesa checkout, and a point of sale with double-entry accounting underneath, still in progress. Available now.',
    ethos: 'Software that has to balance at the end of the month.',
    email: 'charlesndirangu10447@gmail.com',
  },

  meta: {
    keywords: [
      'Software Engineer',
      'Full-Stack Developer',
      'Point of Sale',
      'Double-Entry Accounting',
      'M-Pesa Daraja',
      'Power BI',
      'Linux VPS',
      'Nairobi',
      'Kenya',
      'Charles Ndirangu',
    ],
  },

  ui: {
    skipToContent: 'Skip to main content',
    primaryNavLabel: 'Primary',
    footerNavLabel: 'Footer',
    openMenu: 'Open menu',
    siteMenu: 'Site menu',
    close: 'Close',
    top: 'Top',
    backToTop: 'Back to top',
    switchTo: {
      en: 'Switch to English',
      sw: 'Switch to Kiswahili',
    },
  },

  navItems: [
    { label: 'Work', href: '/projects' },
    { label: 'Philosophy', href: '/philosophy' },
    { label: 'About', href: '/about' },
    { label: 'Writing', href: '/writing' },
    { label: 'Contact', href: '/contact' },
  ],

  footerItems: [
    { label: 'Work', href: '/projects' },
    { label: 'Philosophy', href: '/philosophy' },
    { label: 'About', href: '/about' },
    { label: 'Capabilities', href: '/capabilities' },
    { label: 'Technologies', href: '/technologies' },
    { label: 'Experience', href: '/experience' },
    { label: 'Writing', href: '/writing' },
    { label: 'Résumé', href: '/resume' },
    { label: 'Contact', href: '/contact' },
  ],

  footerGroups: [
    {
      heading: 'Work',
      items: [
        { label: 'Projects', href: '/projects' },
        { label: 'Capabilities', href: '/capabilities' },
        { label: 'Technologies', href: '/technologies' },
      ],
    },
    {
      heading: 'About',
      items: [
        { label: 'About me', href: '/about' },
        { label: 'Experience', href: '/experience' },
        { label: 'Philosophy', href: '/philosophy' },
        { label: 'Writing', href: '/writing' },
      ],
    },
    {
      heading: 'Contact',
      items: [
        { label: 'Get in touch', href: '/contact' },
        { label: 'Résumé', href: '/resume' },
      ],
    },
  ],

  // An entry whose href is still '#' is skipped by the footer rather than
  // rendered as a dead link, so a slot can wait here for a real URL.
  socialItems: [
    { label: 'GitHub', href: 'https://github.com/chalo135' },
    { label: 'LinkedIn', href: '#' },
  ],

  hero: {
    eyebrow: 'Full-stack engineer in Nairobi, Kenya',
    headline: 'I build online shops and point-of-sale software for small Kenyan businesses.',
    subhead:
      'Right now that’s Pharimz Creatives, a live shop that takes M-Pesa, and Salio, a point of sale with double-entry accounting that I’m still building. Available now for remote or onsite roles.',
    ctaLabel: 'See the work',
    ctaHref: '/projects',
  },

  homeTeasers: {
    philosophy: {
      index: '01',
      label: 'How I work',
      lead: 'Business software fails on the boring parts. On Pharimz Creatives, changing an ID in a request could show another customer’s order, so I closed it. In Salio, a journal entry that doesn’t balance is refused.',
      ctaLabel: 'How I think about it',
      href: '/philosophy',
    },
    work: {
      index: '02',
      label: 'Work',
      lead: 'What I’ve shipped, and the point of sale I’m building now.',
      ctaLabel: 'All work',
      href: '/projects',
    },
    capabilities: {
      index: '03',
      label: 'What I work with',
      lead: 'React and Supabase on the shop, C# and .NET with PostgreSQL under the point of sale. I run my own Linux VPS with Docker and deploy with GitHub Actions. On the live shop I also tightened Supabase row-level security.',
      ctaLabel: 'The full list',
      href: '/capabilities',
    },
    contact: {
      index: '04',
      label: 'Contact',
      headline: 'Hiring, or have a project in mind?',
      lead: 'I’m available now for remote full-stack roles and onsite IT roles.',
      ctaLabel: 'Email me',
      href: '/contact',
    },
  },
}
