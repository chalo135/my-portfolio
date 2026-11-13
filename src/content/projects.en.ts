import type { Project, ProjectStatus } from './projects'

export const statusLabels: Record<ProjectStatus, string> = {
  building: 'Building now',
  live: 'Live',
  client: 'Client project',
  finished: 'Finished',
}

// Order here is the order on the site. Everything below is something that
// exists today; nothing is a promise, and there are no invented numbers.
export const projectContent: Project[] = [
  {
    slug: 'salio',
    title: 'Salio',
    status: 'building',
    oneLiner:
      'A point-of-sale system for Kenyan shops with double-entry accounting underneath.',
    problem:
      'Small shops run a till and a separate set of books, and the two drift apart. Month-end reconciliation is where the errors and the hours go.',
    context: "I'm building it around a family spare-parts shop, for owners who aren't accountants.",
    built: [
      'Every sale is one database transaction that writes the receipt, the stock movement and a balanced journal entry together. There is no sync, because there is only one set of books.',
      'Money is stored in whole cents, never as floating-point numbers.',
      "Stock movements are append-only, and reports are calculated when they're read, never stored.",
      'Every table is scoped to a business, so one install can serve many shops.',
    ],
    hardPart: {
      title: 'One door into the ledger',
      body: "Only one function, PostJournal, is allowed to write journal lines, and it refuses any entry whose debits and credits don't balance. I wrote it by hand and covered it with unit tests.",
    },
    technology: ['.NET 10', 'C#', 'ASP.NET Core', 'EF Core', 'PostgreSQL 16', 'Docker', 'xUnit'],
  },
  {
    slug: 'pharimz',
    title: 'Pharimz Creatives',
    status: 'live',
    oneLiner:
      'An online shop for a Kenyan streetwear and branding business that sells hoodies, football jerseys and design services.',
    problem:
      'The business needed to take orders and payment online in shillings, including M-Pesa, which is how most customers pay.',
    built: [
      'Storefront, accounts and checkout with M-Pesa STK Push, PayPal and card payments, priced in KES.',
    ],
    hardPart: {
      title: 'Locking it down after launch',
      body: 'I closed a hole where changing an ID in a request could expose another customer’s order, verified M-Pesa payment callbacks so a confirmation can’t be faked, and tightened Supabase row-level security.',
    },
    technology: ['React', 'Vite', 'Node.js', 'Express', 'Supabase', 'M-Pesa Daraja'],
  },
  {
    slug: 'kahawa-smart',
    title: 'Kahawa Smart',
    status: 'finished',
    oneLiner: 'Coffee leaf rust detection from a photo, for Kenyan smallholder farmers.',
    problem:
      'Coffee leaf rust spreads fast, and a smallholder often can’t get an expert to look at a leaf in time.',
    context: 'Built as my university demonstration project.',
    built: [
      'A TensorFlow model that flags coffee leaf rust from a photo of a leaf.',
      'A chatbot that answers follow-up questions, grounded in a retrieval (RAG) pipeline.',
    ],
    technology: ['TensorFlow', 'Python', 'FastAPI', 'JavaScript', 'GSAP', 'Groq'],
  },
]
