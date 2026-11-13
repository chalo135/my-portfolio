import type { ContactCopy } from './contact'

export const contactContent: ContactCopy = {
  heading: 'Tuzungumze',
  intro: 'Unaajiri, au unahitaji kitu kitengenezwe? Nitumie ujumbe.',
  form: {
    nameLabel: 'Jina lako',
    namePlaceholder: 'Wanjiru Kamau',
    topicLegend: 'Ni kuhusu nini?',
    topics: { job: 'Kazi', project: 'Mradi', other: 'Kitu kingine' },
    messageLabel: 'Ujumbe',
    messagePlaceholder: 'Niambie kuhusu kazi au mradi.',
    submit: 'Fungua kwenye programu ya barua pepe',
    helper: 'Hii inafungua programu yako ya barua pepe ikiwa na ujumbe wako tayari.',
    nameError: 'Weka jina lako.',
    messageError: 'Andika ujumbe.',
    subjects: {
      job: 'Nafasi ya kazi kutoka kwa {name}',
      project: 'Ombi la mradi kutoka kwa {name}',
      other: 'Salamu kutoka kwa {name}',
    },
  },
  address: {
    to: 'Kwa',
    location: 'Nairobi, Kenya',
  },
  stamp: {
    city: 'Nairobi',
    zone: 'EAT',
    label: 'Saa za Nairobi: {time}',
    labelPending: 'Saa za Nairobi',
  },
  direct: {
    heading: 'Au wasiliana nami moja kwa moja',
    email: 'Barua pepe',
    whatsapp: 'WhatsApp',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    copy: 'Nakili barua pepe',
    copied: 'Imenakiliwa',
  },
}
