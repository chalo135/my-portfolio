import type { SiteContent } from './site'

export const siteContent: SiteContent = {
  site: {
    name: 'Charles Ndirangu',
    role: 'TODO',
    location: 'TODO',
    description: 'TODO',
    ogLine: 'TODO',
    status: 'TODO',
  },

  meta: {
    keywords: ['Charles Ndirangu', 'TODO', 'Nairobi', 'Kenya'],
  },

  ui: {
    skipToContent: 'Ruka hadi maudhui',
    primaryNavLabel: 'Kuu',
    footerNavLabel: 'Chini',
    homeLabel: 'TODO',
    openMenu: 'Fungua menyu',
    siteMenu: 'Menyu ya tovuti',
    close: 'Funga',
    themeToLight: 'TODO',
    themeToDark: 'TODO',
    themeSwitch: 'TODO',
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
    { label: 'TODO', href: '/' },
    { label: 'Kazi', href: '/work' },
    { label: 'Kuhusu', href: '/about' },
    { label: 'Mawasiliano', href: '/contact' },
  ],
}
