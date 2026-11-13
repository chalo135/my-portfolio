import type { PagesContent } from './pages'

// Kiswahili page chrome. Longer strings are listed in SWAHILI_COPY_REVIEW.md.
// Technology names and the personal name are proper nouns and stay as-is.

export const pagesContent: PagesContent = {
  meta: {
    about: {
      title: 'Kuhusu',
      description:
        'Mimi ni Charles Ndirangu, mhandisi wa programu jijini Nairobi. Ninaunda programu kwa biashara ndogo za Kenya, ikiwemo duka la mtandaoni lililo hewani na mfumo wa mauzo ambao bado ninaujenga.',
    },
    capabilities: {
      title: 'Uwezo',
      description: 'Malipo ya M-Pesa kwenye duka lililo hewani, na Linux VPS yangu mwenyewe yenye Docker na uzinduzi kupitia GitHub Actions.',
    },
    contact: {
      title: 'Mawasiliano',
      description: 'Ninapatikana sasa kwa nafasi za full-stack za kazi ya mbali, nafasi za IT za ofisini, na miradi ya kujitegemea.',
    },
    experience: {
      title: 'Uzoefu',
      description: 'Kazi ya kujitegemea ya programu tangu Aprili 2025, shughuli za biashara ya familia, na mafunzo kwa vitendo ya usaidizi wa mitandao.',
    },
    philosophy: {
      title: 'Falsafa',
      description: 'Jinsi ninavyounda programu, kwa mifano kutoka Salio na Pharimz Creatives.',
    },
    projects: {
      title: 'Miradi',
      description: 'Mfumo wa mauzo wenye uhasibu wa kuingiza mara mbili, duka la M-Pesa lililo hewani, na modeli ya kutu ya majani ya kahawa.',
    },
    resume: {
      title: 'Wasifu',
      description: 'Wasifu wangu: kazi ya kujitegemea ya programu tangu Aprili 2025 na shahada ya BSc ya Teknolojia ya Kompyuta.',
    },
    technologies: {
      title: 'Teknolojia',
      description: 'Orodha ya lugha, frameworks na zana. Kila ukurasa wa mradi unaonyesha teknolojia zake.',
    },
    writing: {
      title: 'Maandishi',
      description: 'Maelezo kuhusu vitabu vya hesabu vya Salio, kulinda Pharimz Creatives na kujenga Kahawa Smart.',
    },
    projectNotFound: 'Mradi Haukupatikana',
    articleNotFound: 'Makala Haikupatikana',
  },

  projects: {
    hero: {
      label: 'Miradi',
      title: 'Nilichokijenga.',
      description:
        'Duka la mtandaoni lililo hewani linalopokea M-Pesa, mfumo wa mauzo ambao bado ninaujenga, na mradi wa chuo kikuu unaotambua kutu ya majani ya kahawa.',
    },
    backToWork: '← Kazi',
    groups: {
      building: 'Ninaijenga sasa',
      shipped: 'Zilizokamilika',
    },
    sections: {
      problem: 'Tatizo',
      built: 'Nilichojenga',
      hardPart: 'Sehemu ngumu',
      progress: 'Ilipofikia',
      next: 'Kinachofuata',
      stack: 'Teknolojia',
      seeIt: 'Uone',
    },
    stageOf: 'Hatua ya {current} kati ya {total}',
    stageDone: 'Imekamilika',
    stageCurrent: 'Inaendelea',
    liveLink: 'Tembelea tovuti',
    repoLink: 'Soma msimbo',
    walkthrough: 'Msimbo ni wa faragha. Nitafurahi kukuonyesha jinsi ulivyojengwa kwenye simu.',
    walkthroughLink: 'Omba maelezo ya mradi huu',
    walkthroughSubject: 'Maelezo ya mradi: ',
  },

  writing: {
    hero: {
      label: 'Maandishi',
      title: 'Maelezo kutoka kazini.',
      description:
        'Maelezo kuhusu vitabu vya hesabu vya Salio, kulinda Pharimz Creatives na kujenga Kahawa Smart.',
    },
    backToWriting: '← Maandishi',
    read: 'kusoma',
  },

  capabilities: {
    hero: {
      label: 'Uwezo',
      title: 'Ninachoweza kufanya.',
      description:
        'Upande wa mbele na wa nyuma wa tovuti wenye malipo ya M-Pesa, pamoja na Linux VPS yangu mwenyewe yenye Docker na uzinduzi kupitia GitHub Actions.',
    },
  },

  technologies: {
    hero: {
      label: 'Teknolojia',
      title: 'Zana na lugha.',
      description:
        'Orodha ya lugha, frameworks na zana. Kila ukurasa wa mradi unaonyesha kile mradi huo unatumia.',
    },
  },

  experience: {
    hero: {
      label: 'Uzoefu',
      title: 'Nilipofanya kazi.',
      description:
        'Utengenezaji wa programu wa kujitegemea tangu Aprili 2025, shughuli za biashara ya familia tangu Mei 2023, na mafunzo kwa vitendo ya usaidizi wa mitandao katika Fiberlink.',
    },
  },

  resume: {
    hero: {
      label: 'Wasifu',
      title: 'Charles Ndirangu',
      description:
        'Mhandisi wa programu jijini Nairobi. Ninaunda programu kwa biashara ndogo za Kenya, ikiwemo duka la mtandaoni lililo hewani na mfumo wa mauzo ambao bado ninaujenga. Ninapatikana sasa.',
    },
    experienceHeading: 'Uzoefu',
    capabilitiesHeading: 'Uwezo',
    technologiesHeading: 'Teknolojia',
  },

  about: {
    whatIWorkOn: 'Ninachofanyia kazi',
    getInTouch: 'Wasiliana nami',
  },

  contact: {
    label: 'Mawasiliano',
    title: 'Ninapatikana sasa.',
    lead: 'Niko wazi kwa nafasi za full-stack za kazi ya mbali, nafasi za IT za ofisini, na miradi ya kujitegemea.',
    ctaLabel: 'Nitumie barua pepe',
  },

  notFound: {
    title: 'Ukurasa haukupatikana.',
    body: 'Ukurasa unaoutafuta haupo.',
    back: 'Rudi mwanzo',
  },

  error: {
    label: 'Kuna hitilafu',
    title: 'Ukurasa huu umepata hitilafu wakati wa kuonyeshwa.',
    body: 'Sehemu nyingine za tovuti bado zinafanya kazi. Jaribu tena, au rudi mwanzo.',
    retry: 'Jaribu tena',
    home: 'Rudi mwanzo',
  },
}
