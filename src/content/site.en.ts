import type { SiteContent } from './site'

export const siteContent: SiteContent = {
  site: {
    name: 'Charles Ndirangu',
    role: 'Software developer',
    location: 'Nairobi, Kenya',
    description: 'I build websites and software for small businesses. Based in Nairobi, Kenya.',
    status: 'Open to full-time roles and freelance work.',
  },

  meta: {
    keywords: ['Charles Ndirangu', 'Software developer', 'Web developer', 'Nairobi', 'Kenya'],
  },

  ui: {
    skipToContent: 'Skip to main content',
    primaryNavLabel: 'Primary',
    footerNavLabel: 'Footer',
    homeLabel: 'Home',
    openMenu: 'Open menu',
    siteMenu: 'Site menu',
    close: 'Close',
    themeToLight: 'Switch to the light theme',
    themeToDark: 'Switch to the night theme',
    themeSwitch: 'Switch theme',
    switchTo: {
      en: 'Switch to English',
      sw: 'Switch to Kiswahili',
    },
  },

  navItems: [
    { label: 'Work', href: '/work', icon: 'briefcase' },
    { label: 'About', href: '/about', icon: 'smiley' },
    { label: 'Contact', href: '/contact', icon: 'envelope' },
  ],

  footerItems: [
    { label: 'Home', href: '/' },
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
}
