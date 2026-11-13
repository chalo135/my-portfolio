import type { PagesContent } from './pages'

export const pagesContent: PagesContent = {
  meta: {
    home: {
      title: 'Charles Ndirangu | Msanidi programu jijini Nairobi',
      description: 'Ninatengeneza tovuti na programu kwa biashara ndogo. Niko Nairobi, Kenya.',
    },
    work: {
      title: 'Kazi | Charles Ndirangu',
      description: 'Miradi niliyotengeneza na zana ninazotumia.',
    },
    about: {
      title: 'Kuhusu | Charles Ndirangu',
      description: 'Kuhusu Charles Ndirangu, msanidi programu jijini Nairobi.',
    },
    contact: {
      title: 'Mawasiliano | Charles Ndirangu',
      description: 'Wasiliana nami kuhusu kazi au mradi.',
    },
  },

  notFound: {
    title: 'Hakuna kitu hapa',
    body: 'Ukurasa huu haupo.',
    back: 'Rudi nyumbani',
  },

  error: {
    title: 'Kuna hitilafu.',
    body: 'Ukurasa haukuweza kufunguka. Jaribu tena.',
    retry: 'Jaribu tena',
    home: 'Rudi nyumbani',
  },
}
