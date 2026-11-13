import type { Capability } from './capabilities'

export const capabilityContent: Capability[] = [
  {
    id: 'frontend',
    title: 'Frontend Engineering',
    description:
      'React and Vite for the Pharimz Creatives storefront, accounts and checkout. This site is Next.js and TypeScript.',
    areas: ['React & Next.js', 'TypeScript', 'Vite', 'JavaScript'],
  },
  {
    id: 'backend',
    title: 'Backend Engineering',
    description:
      "Node.js and Express behind Pharimz Creatives, with M-Pesa Daraja payments. ASP.NET Core and EF Core behind Salio, where I'm learning C# by building it.",
    areas: [
      'Node.js',
      'Express',
      'ASP.NET Core',
      'Authentication',
      'EF Core',
      'M-Pesa Daraja',
    ],
  },
  {
    id: 'cloud',
    title: 'Servers & Deployment',
    description:
      'I run my own Linux VPS, deploy with GitHub Actions, and host client sites on Ubuntu servers.',
    areas: [
      'Ubuntu',
      'Docker',
      'Nginx',
      'Caddy',
      'GitHub Actions',
    ],
  },
  {
    id: 'ai',
    title: 'Artificial Intelligence',
    description:
      'For Kahawa Smart, my university project: a TensorFlow model that flags coffee leaf rust, and a chatbot grounded in a RAG pipeline.',
    areas: [
      'LLM Integration',
      'RAG Pipeline',
      'TensorFlow',
      'Groq',
      'Image Classification',
      'Python',
    ],
  },
  {
    id: 'security',
    title: 'Application Security',
    description:
      "On Pharimz Creatives, after launch, I closed an ID-swap hole that could expose other customers' orders, verified M-Pesa callbacks and tightened Supabase row-level security.",
    areas: [
      'Application Security',
      'Row-Level Security',
      'Supabase',
      'Payment Callback Verification',
      'Access Control',
    ],
  },
  {
    id: 'system-design',
    title: 'System Design',
    description:
      "I haven't built a large-scale system yet. Salio's design is under Databases.",
    areas: [],
  },
  {
    id: 'databases',
    title: 'Databases',
    description:
      'Salio runs on PostgreSQL 16: one transaction per sale, money in whole cents, every table scoped to a business. Pharimz Creatives runs on Supabase.',
    areas: [
      'PostgreSQL',
      'Supabase',
      'EF Core',
      'Data Modeling',
      'Transactions',
      'Double-Entry Accounting',
    ],
  },
  {
    id: 'performance',
    title: 'Performance Optimization',
    description:
      "I don't have measured performance work to show yet.",
    areas: [],
  },
  {
    id: 'ui-engineering',
    title: 'UI Engineering',
    description:
      'GSAP animation on Kahawa Smart, and responsive layouts on this site.',
    areas: ['GSAP', 'Responsive Design'],
  },
]
