import type { PagesContent } from './pages'

// Kiswahili page chrome. Longer strings are listed in SWAHILI_COPY_REVIEW.md.
// Technology names and the personal name are proper nouns and stay as-is.

export const pagesContent: PagesContent = {
  meta: {
    about: {
      title: 'Kuhusu',
      description:
        'Mimi ni Charles Ndirangu. Ninafanya kazi katika safu zote, hasa kwenye mifumo ambayo biashara ndogo na za kati za Kenya hutegemea kila siku.',
    },
    capabilities: {
      title: 'Uwezo',
      description: 'Uwezo wa uhandisi wa kiwango cha kampuni katika safu nzima ya programu.',
    },
    contact: {
      title: 'Mawasiliano',
      description: 'Wasiliana nami kuhusu malipo, ERP, na kazi ya uhandisi wa full-stack.',
    },
    experience: {
      title: 'Uzoefu',
      description: 'Uzoefu wa kitaaluma wa kujenga mifumo ya programu ya kampuni.',
    },
    philosophy: {
      title: 'Falsafa',
      description: 'Kanuni zinazoongoza kila mfumo ninaoujenga.',
    },
    projects: {
      title: 'Miradi',
      description: 'Bidhaa za programu za kampuni zilizoundwa kwa usahihi na ufundi.',
    },
    resume: {
      title: 'Wasifu',
      description: 'Wasifu wa kitaaluma na sifa.',
    },
    technologies: {
      title: 'Teknolojia',
      description: 'Zana na teknolojia zinazotumika kujenga programu za kiwango cha kampuni.',
    },
    writing: {
      title: 'Maandishi',
      description: 'Mawazo kuhusu uhandisi wa programu, usanifu, AI, na kujenga bidhaa.',
    },
    projectNotFound: 'Mradi Haukupatikana',
    articleNotFound: 'Makala Haikupatikana',
  },

  projects: {
    hero: {
      label: 'Miradi',
      title: 'Bidhaa zilizoundwa kudumu.',
      description:
        'Kila mradi hushughulikiwa kama uzinduzi wa bidhaa — umebuniwa, umeundwa, na umewasilishwa kwa viwango vya kampuni.',
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
      title: 'Maarifa ya uhandisi.',
      description:
        'Kuchunguza ufundi wa uhandisi wa programu — usanifu, utendaji, usalama, uunganishaji wa AI, na kujenga bidhaa zenye maana.',
    },
    backToWriting: '← Maandishi',
    read: 'kusoma',
  },

  capabilities: {
    hero: {
      label: 'Uwezo',
      title: 'Uhandisi katika safu nzima.',
      description:
        'Utaalamu wa kina unaojumuisha upande wa mbele, upande wa nyuma, wingu, AI, usalama, na ubunifu wa mifumo — kwa viwango vya kampuni.',
    },
  },

  technologies: {
    hero: {
      label: 'Teknolojia',
      title: 'Zana zilizochaguliwa kwa makusudi.',
      description:
        'Teknolojia ni njia, si lengo. Kila zana katika safu hii imechaguliwa kwa uaminifu, utendaji, na uwezo wa kudumishwa kwa muda mrefu.',
    },
  },

  experience: {
    hero: {
      label: 'Uzoefu',
      title: 'Rekodi ya kuwasilisha.',
      description:
        'Kujenga mifumo ya programu katika mazingira ya kampuni, biashara changa, na serikali — kwa mkazo wa kudumu kwenye ubora na athari.',
    },
  },

  resume: {
    hero: {
      label: 'Wasifu',
      title: 'Charles Ndirangu',
      description:
        'Mhandisi wa Programu aliyebobea katika mifumo ya kiwango cha kampuni, utengenezaji wa full-stack, na usanifu wa programu wenye akili.',
    },
    experienceHeading: 'Uzoefu',
    capabilitiesHeading: 'Uwezo Msingi',
    technologiesHeading: 'Teknolojia',
  },

  about: {
    whatIWorkOn: 'Ninachofanyia kazi',
    getInTouch: 'Wasiliana nami',
  },

  contact: {
    label: 'Mawasiliano',
    title: 'Tujenge programu yenye maana.',
    lead: 'Niko wazi kwa kazi za kampuni, nafasi za mbali, na ushirikiano wa bidhaa zenye malengo makubwa.',
    ctaLabel: 'Anzisha Mazungumzo',
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
