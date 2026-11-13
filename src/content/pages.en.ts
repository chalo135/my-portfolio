import type { PagesContent } from './pages'

export const pagesContent: PagesContent = {
  meta: {
    about: {
      title: 'About',
      description:
        "I'm Charles Ndirangu, a software engineer in Nairobi. I build software for small Kenyan businesses, including a live online shop and a point of sale I'm still building.",
    },
    capabilities: {
      title: 'Capabilities',
      description: 'M-Pesa checkout on a live shop, and my own Linux VPS with Docker and GitHub Actions deploys.',
    },
    contact: {
      title: 'Contact',
      description: "I'm available now for remote full-stack roles, onsite IT roles and freelance projects.",
    },
    experience: {
      title: 'Experience',
      description: 'Freelance software work since April 2025, family business operations, and a network support attachment.',
    },
    philosophy: {
      title: 'Philosophy',
      description: 'How I build software, with examples from Salio and Pharimz Creatives.',
    },
    projects: {
      title: 'Projects',
      description: 'A point of sale with double-entry accounting, a live M-Pesa shop, and a coffee leaf rust model.',
    },
    resume: {
      title: 'Résumé',
      description: 'My résumé: freelance software work since April 2025 and a BSc in Computer Technology.',
    },
    technologies: {
      title: 'Technologies',
      description: 'A list of languages, frameworks and tools. Each project page shows its own stack.',
    },
    writing: {
      title: 'Writing',
      description: "Notes on Salio's books, securing Pharimz Creatives and building Kahawa Smart.",
    },
    projectNotFound: 'Project Not Found',
    articleNotFound: 'Article Not Found',
  },

  projects: {
    hero: {
      label: 'Projects',
      title: "What I've built.",
      description:
        "A live online shop that takes M-Pesa, a point of sale I'm still building, and a university project that spots coffee leaf rust.",
    },
    backToWork: '← Work',
    groups: {
      building: 'Building now',
      shipped: 'Shipped',
    },
    sections: {
      problem: 'The problem',
      built: 'What I built',
      hardPart: 'The hard part',
      progress: "Where it's at",
      next: "What's next",
      stack: 'Stack',
      seeIt: 'See it',
    },
    stageOf: 'Stage {current} of {total}',
    stageDone: 'Done',
    stageCurrent: 'In progress',
    liveLink: 'Visit the live site',
    repoLink: 'Read the code',
    walkthrough: "The code is private. I'm happy to walk you through it on a call.",
    walkthroughLink: 'Ask for a walkthrough',
    walkthroughSubject: 'Walkthrough: ',
  },

  writing: {
    hero: {
      label: 'Writing',
      title: 'Notes from the work.',
      description:
        "Notes on Salio's books, securing Pharimz Creatives and building Kahawa Smart.",
    },
    backToWriting: '← Writing',
    read: 'read',
  },

  capabilities: {
    hero: {
      label: 'Capabilities',
      title: 'What I can do.',
      description:
        'Web frontends and backends with M-Pesa payments, plus my own Linux VPS with Docker and GitHub Actions deploys.',
    },
  },

  technologies: {
    hero: {
      label: 'Technologies',
      title: 'Tools and languages.',
      description:
        'A list of languages, frameworks and tools. Each project page shows what that project uses.',
    },
  },

  experience: {
    hero: {
      label: 'Experience',
      title: "Where I've worked.",
      description:
        'Freelance software development since April 2025, operations in the family business since May 2023, and a network support attachment at Fiberlink.',
    },
  },

  resume: {
    hero: {
      label: 'Résumé',
      title: 'Charles Ndirangu',
      description:
        "Software engineer in Nairobi. I build software for small Kenyan businesses, including a live online shop and a point of sale I'm still building. Available now.",
    },
    experienceHeading: 'Experience',
    capabilitiesHeading: 'Capabilities',
    technologiesHeading: 'Technologies',
  },

  about: {
    whatIWorkOn: 'What I work on',
    getInTouch: 'Get in touch',
  },

  contact: {
    label: 'Contact',
    title: "I'm available now.",
    lead: "I'm open to remote full-stack roles, onsite IT roles and freelance projects.",
    ctaLabel: 'Email me',
  },

  notFound: {
    title: 'Page not found.',
    body: "The page you're looking for doesn't exist.",
    back: 'Return home',
  },

  error: {
    label: 'Something broke',
    title: 'This page hit an error while rendering.',
    body: 'The rest of the site still works. Try again, or head back to the start.',
    retry: 'Try again',
    home: 'Back home',
  },
}
