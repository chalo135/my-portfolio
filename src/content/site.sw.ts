import type { SiteContent } from './site'

// Kiswahili chrome copy. Every string longer than roughly eight words is also
// listed in SWAHILI_COPY_REVIEW.md at the repo root, pending Charles's sign-off.
// Proper nouns stay as they are: personal name, monogram, email, and product
// names like M-Pesa Daraja, Next.js, PostgreSQL.

export const siteContent: SiteContent = {
  site: {
    name: 'Charles Ndirangu',
    monogram: 'CN',
    role: 'Mhandisi wa Programu',
    location: 'Nairobi, Kenya',
    tagline: 'Ninaunda programu kwa biashara ndogo za Kenya.',
    description:
      'Mhandisi wa programu jijini Nairobi. Ninaunda programu kwa biashara ndogo za Kenya: duka la mtandaoni lililo hewani lenye malipo ya M-Pesa, na mfumo wa mauzo wenye uhasibu wa kuingiza mara mbili chini yake, ambao bado ninaujenga. Ninapatikana sasa.',
    ethos: 'Katika Salio, vitabu vya hesabu lazima vilingane mwishoni mwa mwezi.',
    email: 'charlesndirangu10447@gmail.com',
  },

  meta: {
    keywords: [
      'Mhandisi wa Programu',
      'Utengenezaji wa Full-Stack',
      'Mfumo wa Mauzo',
      'Uhasibu wa Kuingiza Mara Mbili',
      'M-Pesa Daraja',
      'Power BI',
      'Linux VPS',
      'Nairobi',
      'Kenya',
      'Charles Ndirangu',
    ],
  },

  ui: {
    skipToContent: 'Rukia hadi maudhui makuu',
    primaryNavLabel: 'Urambazaji mkuu',
    footerNavLabel: 'Urambazaji wa chini',
    openMenu: 'Fungua menyu',
    siteMenu: 'Menyu ya tovuti',
    close: 'Funga',
    top: 'Juu',
    backToTop: 'Rudi juu',
    switchTo: {
      en: 'Badilisha kwa Kiingereza',
      sw: 'Badilisha kwa Kiswahili',
    },
  },

  navItems: [
    { label: 'Kazi', href: '/projects' },
    { label: 'Falsafa', href: '/philosophy' },
    { label: 'Kuhusu', href: '/about' },
    { label: 'Maandishi', href: '/writing' },
    { label: 'Mawasiliano', href: '/contact' },
  ],

  footerItems: [
    { label: 'Kazi', href: '/projects' },
    { label: 'Falsafa', href: '/philosophy' },
    { label: 'Kuhusu', href: '/about' },
    { label: 'Uwezo', href: '/capabilities' },
    { label: 'Teknolojia', href: '/technologies' },
    { label: 'Uzoefu', href: '/experience' },
    { label: 'Maandishi', href: '/writing' },
    { label: 'Wasifu', href: '/resume' },
    { label: 'Mawasiliano', href: '/contact' },
  ],

  footerGroups: [
    {
      heading: 'Kazi',
      items: [
        { label: 'Miradi', href: '/projects' },
        { label: 'Uwezo', href: '/capabilities' },
        { label: 'Teknolojia', href: '/technologies' },
      ],
    },
    {
      heading: 'Kuhusu',
      items: [
        { label: 'Kuhusu mimi', href: '/about' },
        { label: 'Uzoefu', href: '/experience' },
        { label: 'Falsafa', href: '/philosophy' },
        { label: 'Maandishi', href: '/writing' },
      ],
    },
    {
      heading: 'Mawasiliano',
      items: [
        { label: 'Wasiliana nami', href: '/contact' },
        { label: 'Wasifu', href: '/resume' },
      ],
    },
  ],

  socialItems: [
    { label: 'GitHub', href: 'https://github.com/chalo135' },
    { label: 'LinkedIn', href: '#' },
  ],

  hero: {
    eyebrow: 'Mhandisi wa programu jijini Nairobi, Kenya',
    headline: 'Ninaunda programu kwa biashara ndogo za Kenya.',
    subhead:
      'Kwa sasa ni Pharimz Creatives, duka lililo hewani linalopokea M-Pesa, na Salio, mfumo wa mauzo wenye uhasibu wa kuingiza mara mbili ambao bado ninaujenga. Ninapatikana sasa kwa nafasi za kazi ya mbali au ya ofisini.',
    ctaLabel: 'Tazama kazi',
    ctaHref: '/projects',
  },

  homeTeasers: {
    philosophy: {
      index: '01',
      label: 'Jinsi ninavyofanya kazi',
      lead: 'Kwenye Pharimz Creatives, kubadilisha ID katika ombi kungeweza kuonyesha oda ya mteja mwingine, kwa hiyo niliziba mwanya huo. Katika Salio, ingizo la jarida lisilolingana hukataliwa.',
      ctaLabel: 'Jinsi ninavyoliona',
      href: '/philosophy',
    },
    work: {
      index: '02',
      label: 'Kazi',
      lead: 'Nilichokamilisha na kuzindua, na mfumo wa mauzo ninaoujenga sasa.',
      ctaLabel: 'Kazi zote',
      href: '/projects',
    },
    capabilities: {
      index: '03',
      label: 'Ninachotumia',
      lead: 'React na Supabase kwenye duka, ambako niliimarisha row-level security. C# na .NET pamoja na PostgreSQL chini ya mfumo wa mauzo. Ninaendesha Linux VPS yangu mwenyewe yenye Docker, na ninazindua masasisho kupitia GitHub Actions.',
      ctaLabel: 'Orodha kamili',
      href: '/capabilities',
    },
    contact: {
      index: '04',
      label: 'Mawasiliano',
      headline: 'Niambie kuhusu nafasi ya kazi au mradi.',
      lead: 'Ninapatikana sasa kwa nafasi za full-stack za kazi ya mbali, nafasi za IT za ofisini, na miradi ya kujitegemea (freelance).',
      ctaLabel: 'Nitumie barua pepe',
      href: '/contact',
    },
  },
}
