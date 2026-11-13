import type { WritingPost } from './writing'

export const writingContent: WritingPost[] = [
  {
    slug: 'building-scalable-systems',
    title: "How I keep Salio's books in balance",
    excerpt:
      'The design rules in Salio, my point-of-sale system, that keep the till and the accounts from drifting apart.',
    category: 'System Design',
    date: '2025-11-15',
    readTime: '1 min',
    content: `Salio is a point-of-sale system I'm building for Kenyan shops, with double-entry accounting underneath. I'm building it around a family spare-parts shop, for owners who aren't accountants. It's still in progress. These are its rules. Rules like these are hard to add once data exists.

## The stack

C# on .NET 10, with ASP.NET Core and EF Core, over PostgreSQL 16. I'm learning C# by building it.

## One transaction per sale

Every sale is one database transaction. It writes the receipt, the stock movement and a balanced journal entry together, or it writes nothing. There's no sync between the till and the books, because there is only one set of books.

## One door into the ledger

Only one function, PostJournal, is allowed to write journal lines. It refuses any entry whose debits and credits don't balance. I wrote it by hand and covered it with unit tests.

## Money in whole cents

Money is stored in whole cents, never as floating-point numbers. A floating-point number can't hold most decimal fractions of a shilling exactly, so a long column of them stops adding up to the right total. Whole cents always do.

## Nothing stored that can go stale

Stock movements are append-only, so a correction is a new movement, not an edit to an old one. Reports are calculated when they're read, never stored.

## One install, many shops

Every table is scoped to a business, so one install can serve many shops.`,
  },
  {
    slug: 'ai-integration-patterns',
    title: 'Building Kahawa Smart',
    excerpt:
      'A model that flags coffee leaf rust from a photo, and a chatbot grounded in a RAG pipeline. My university demonstration project.',
    category: 'AI',
    date: '2025-10-02',
    readTime: '1 min',
    content: `Kahawa Smart was my university demonstration project. Coffee leaf rust spreads fast, and a smallholder farmer often can't get an expert to look at a leaf in time.

## The model

I built the model in TensorFlow. Give it a photo of a coffee leaf and it flags leaf rust. It looks for that one disease, not every disease a coffee plant can get.

## The chatbot

The chatbot answers follow-up questions. I grounded it in a retrieval (RAG) pipeline, so its answers draw on retrieved material instead of the language model alone.

## The stack

TensorFlow, Python, FastAPI, Groq, JavaScript and GSAP.`,
  },
  {
    slug: 'security-first-architecture',
    title: 'Locking down a live shop',
    excerpt:
      "What I fixed in the Pharimz Creatives shop after launch, starting with a request that could show one customer another customer's order.",
    category: 'Security',
    date: '2025-08-20',
    readTime: '1 min',
    content: `Pharimz Creatives is an online shop for a Kenyan streetwear and branding business. It takes orders and payment in shillings, including M-Pesa. After it went live, I went back and locked it down.

## Another customer's order

I found a hole where changing an ID in a request could expose another customer's order. Being logged in isn't enough. The server has to check that the order belongs to the person asking. I closed it.

## M-Pesa callbacks

Checkout uses M-Pesa STK Push, and M-Pesa confirms each payment with a callback. I verified those callbacks so a confirmation can't be faked.

## Row-level security

The shop's data sits in Supabase. I tightened its row-level security, the rules in the database that decide which rows each user can reach.

## What I'd change

All of this came after launch. On the next shop, I'll check who owns each record before the first customer arrives.`,
  },
  {
    slug: 'nextjs-performance-guide',
    title: 'Notes on Next.js performance',
    excerpt: 'General notes on where a Next.js page can lose speed.',
    category: 'Next.js',
    date: '2025-07-10',
    readTime: '1 min',
    content: `These are general notes, not results from a project of mine.

## Rendering

A page that rarely changes can be generated once at build time. A page that differs for each user has to be rendered on each request.

## JavaScript sent to the browser

@next/bundle-analyzer shows what ends up in the bundle. Dynamic imports keep code that isn't needed on first load out of it.

## Images

next/image serves an image sized for the screen. The priority prop loads the main image at the top of the page first.`,
  },
  {
    slug: 'remote-engineering-excellence',
    title: 'Notes on remote work',
    excerpt: 'General notes on writing things down when a team works apart.',
    category: 'Remote work',
    date: '2025-05-28',
    readTime: '1 min',
    content: `These are general notes, not lessons from a team I've worked on.

## Write it down

A written proposal can be read whenever someone comes online. A meeting can't. Meetings are worth keeping for decisions that need a back-and-forth.

## Say why

A teammate who wasn't there needs the reason for a decision as well as the decision itself.`,
  },
]
