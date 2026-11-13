import type { ContactCopy } from './contact'

export const contactContent: ContactCopy = {
  heading: "Let's talk",
  intro: 'Hiring, or need something built? Send me a note.',
  form: {
    nameLabel: 'Your name',
    namePlaceholder: 'Wanjiru Kamau',
    topicLegend: "What's it about?",
    topics: { job: 'A job', project: 'A project', other: 'Something else' },
    messageLabel: 'Message',
    messagePlaceholder: 'Tell me about the role or project.',
    submit: 'Open in your email app',
    helper: 'This opens your email app with your note filled in.',
    nameError: 'Add your name.',
    messageError: 'Write a message.',
    subjects: {
      job: 'Job opportunity from {name}',
      project: 'Project enquiry from {name}',
      other: 'Hello from {name}',
    },
  },
  address: {
    to: 'To',
    location: 'Nairobi, Kenya',
  },
  stamp: {
    city: 'Nairobi',
    zone: 'EAT',
    label: 'Time in Nairobi: {time}',
    labelPending: 'Time in Nairobi',
  },
  direct: {
    heading: 'Or reach me directly',
    email: 'Email',
    whatsapp: 'WhatsApp',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    copy: 'Copy email',
    copied: 'Copied',
  },
}
