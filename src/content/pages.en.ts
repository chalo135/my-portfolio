import type { PagesContent } from './pages'

export const pagesContent: PagesContent = {
  meta: {
    about: {
      title: 'About',
      description:
        "I'm Charles Ndirangu, a software engineer in Nairobi. I build online shops and point-of-sale software for small Kenyan businesses.",
    },
    capabilities: {
      title: 'Capabilities',
      description: 'What I can do on the frontend and backend, and the projects that show it.',
    },
    contact: {
      title: 'Contact',
      description: "I'm available now for remote full-stack roles and onsite IT roles.",
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
      title: 'Resume',
      description: 'My resume: freelance software work since April 2025 and a BSc in Computer Technology.',
    },
    technologies: {
      title: 'Technologies',
      description: "The tools I've used on real projects, including my own Linux VPS.",
    },
    writing: {
      title: 'Writing',
      description: 'Short notes on security, AI and building for the web.',
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
        'Short notes on security, AI and building for the web.',
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
      title: 'What I use.',
      description:
        'The tools behind Salio, Pharimz Creatives and Kahawa Smart, and the Linux VPS I run myself.',
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
      label: 'Resume',
      title: 'Charles Ndirangu',
      description:
        'Software engineer in Nairobi. I build online shops and point-of-sale software for small Kenyan businesses. Available now.',
    },
    experienceHeading: 'Experience',
    capabilitiesHeading: 'Core Capabilities',
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
