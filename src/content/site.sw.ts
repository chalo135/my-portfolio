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
    tagline: 'Ninaunda programu zinazoendesha biashara za Kenya.',
    description:
      'Mhandisi wa programu wa full-stack jijini Nairobi. Ninaunda mifumo ya ERP ya wapangaji wengi kwa biashara ndogo na za kati za Kenya, uunganishaji wa malipo wa M-Pesa Daraja, na mifumo ya mauzo yenye uhasibu kamili wa kuingiza mara mbili.',
    ethos: 'Programu ambayo lazima ilingane mwishoni mwa mwezi.',
    email: 'charlesndirangu10447@gmail.com',
  },

  meta: {
    keywords: [
      'Mhandisi wa Programu',
      'Mtengenezaji wa Full-Stack',
      'Ubunifu wa Mifumo',
      'Miundombinu ya Wingu',
      'Uhandisi wa AI',
      'Nairobi',
      'Kenya',
      'M-Pesa Daraja',
      'ERP',
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
    eyebrow: 'Mhandisi wa programu ya full-stack — Nairobi, Kenya',
    headline: 'Ninaunda programu zinazoendesha biashara za Kenya.',
    subhead:
      'Mifumo ya ERP ya wapangaji wengi kwa biashara ndogo na za kati, malipo ya M-Pesa Daraja, na mfumo wa mauzo wenye uhasibu wa kuingiza mara mbili chini yake. Kwa sasa niko Nairobi, na niko wazi kwa kazi ya mbali.',
    ctaLabel: 'Tazama kazi',
    ctaHref: '/projects',
  },

  homeTeasers: {
    philosophy: {
      index: '01',
      label: 'Jinsi ninavyofanya kazi',
      lead: 'Programu za biashara hushindwa katika sehemu zinazochosha — marejesho ambayo hayalingani kamwe, mpangaji anayeweza kusoma ankara za mpangaji mwingine. Hapo ndipo ninapotumia muda wangu.',
      ctaLabel: 'Jinsi ninavyoliona',
      href: '/philosophy',
    },
    work: {
      index: '02',
      label: 'Kazi',
      lead: 'Mifumo niliyoibuni na kuizindua.',
      ctaLabel: 'Kazi zote',
      href: '/projects',
    },
    capabilities: {
      index: '03',
      label: 'Ninachotumia',
      lead: 'TypeScript na Next.js mbele, Postgres na Supabase nyuma yake, na mantiki ya malipo na uhasibu katikati. Pia nimetumia muda mwingi kuziba mianya ya IDOR na kuandika sera za usalama wa safu kwenye jukwaa la biashara mtandaoni lililo hewani.',
      ctaLabel: 'Orodha kamili',
      href: '/capabilities',
    },
    contact: {
      index: '04',
      label: 'Mawasiliano',
      headline: 'Niambie unachotaka kujenga.',
      lead: 'Niko wazi kwa nafasi za kudumu na kazi za mkataba kuhusu malipo, ERP, na chochote kinachopaswa kulingana mwishoni mwa mwezi. Nairobi, au kwa mbali.',
      ctaLabel: 'Nitumie barua pepe',
      href: '/contact',
    },
  },
}
