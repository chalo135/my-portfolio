import type { PagesContent } from './pages'

export const pagesContent: PagesContent = {
  meta: {
    home: {
      title: 'Charles Ndirangu | Software developer in Nairobi',
      description: 'I build websites and software for small businesses. Based in Nairobi, Kenya.',
    },
    work: {
      title: 'Work | Charles Ndirangu',
      description: "Projects I've built and the tools I use.",
    },
    about: {
      title: 'About | Charles Ndirangu',
      description: 'About Charles Ndirangu, a software developer in Nairobi.',
    },
    contact: {
      title: 'Contact | Charles Ndirangu',
      description: 'Get in touch about a job or a project.',
    },
  },

  notFound: {
    title: 'Nothing here',
    body: "This page doesn't exist.",
    back: 'Back home',
  },

  error: {
    title: 'Something went wrong.',
    body: 'The page could not load. Try again.',
    retry: 'Try again',
    home: 'Back home',
  },
}
