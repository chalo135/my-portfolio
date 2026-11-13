import type { SiteContent } from './site'

export const siteContent: SiteContent = {
  site: {
    name: 'Charles Ndirangu',
    role: 'Msanidi programu',
    location: 'Nairobi, Kenya',
    description: 'Ninatengeneza tovuti na programu kwa biashara ndogo. Niko Nairobi, Kenya.',
    ogLine: 'Msanidi programu jijini Nairobi',
    status: 'Niko tayari kwa kazi ya kudumu na kazi huru.',
  },

  meta: {
    keywords: ['Charles Ndirangu', 'Msanidi programu', 'Nairobi', 'Kenya'],
  },

  ui: {
    skipToContent: 'Ruka hadi maudhui',
    primaryNavLabel: 'Kuu',
    footerNavLabel: 'Chini',
    homeLabel: 'Nyumbani',
    openMenu: 'Fungua menyu',
    siteMenu: 'Menyu ya tovuti',
    close: 'Funga',
    themeToLight: 'Badilisha kwa mandhari ya mchana',
    themeToDark: 'Badilisha kwa mandhari ya usiku',
    themeSwitch: 'Badilisha mandhari',
    switchTo: {
      en: 'Badilisha kwa Kiingereza',
      sw: 'Badilisha kwa Kiswahili',
    },
  },

  navItems: [
    { label: 'Kazi', href: '/work', icon: 'briefcase' },
    { label: 'Kuhusu', href: '/about', icon: 'smiley' },
    { label: 'Mawasiliano', href: '/contact', icon: 'envelope' },
  ],

  footerItems: [
    { label: 'Nyumbani', href: '/' },
    { label: 'Kazi', href: '/work' },
    { label: 'Kuhusu', href: '/about' },
    { label: 'Mawasiliano', href: '/contact' },
  ],
}
