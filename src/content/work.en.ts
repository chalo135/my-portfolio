import type { WorkCopy } from './work'

export const workContent: WorkCopy = {
  heading: 'Work',
  note: "some of the things I've built",
  sticky: 'projects ({count})',
  visitSite: 'Visit site',
  opensNewTab: '(opens in a new tab)',
  techHeading: 'What I work with',
  techIntro: 'The languages and tools I use most.',
  projects: {
    salio: {
      title: 'Salio',
      descriptor: 'A point-of-sale system for small Kenyan businesses',
      imageAlt: 'A screenshot of Salio',
    },
    pharimz: {
      title: 'Pharimz Creatives',
      descriptor: 'An e-commerce website for Kenyan streetwear and design',
      imageAlt: 'A screenshot of the Pharimz Creatives website',
    },
    'jade-wears': {
      title: 'Jade Wears',
      descriptor: 'An e-commerce website for a lifestyle brand',
      imageAlt: 'A screenshot of the Jade Wears website',
    },
    'kahawa-smart': {
      title: 'Kahawa Smart',
      descriptor: 'An app that spots coffee leaf disease from a photo',
      imageAlt: 'A screenshot of Kahawa Smart',
    },
    'car-moto': {
      title: 'Car Moto',
      descriptor: 'A website for a car dealership',
      imageAlt: 'A screenshot of the Car Moto website',
    },
    agrofert: {
      title: 'AgroFert',
      descriptor: 'A website for a fertiliser company',
      imageAlt: 'A screenshot of the AgroFert website',
    },
  },
}
