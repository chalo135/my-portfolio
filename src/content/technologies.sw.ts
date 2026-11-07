import type { TechnologyCategory } from './technologies'

// Only the category names are translated. The items are product names.

export const technologyContent: TechnologyCategory[] = [
  {
    name: 'Lugha',
    items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'HTML & CSS'],
  },
  {
    name: 'Upande wa Mbele',
    items: ['React', 'Next.js', 'Tailwind CSS', 'Three.js', 'GSAP', 'Framer Motion'],
  },
  {
    name: 'Upande wa Nyuma',
    items: ['Node.js', 'Express', 'GraphQL', 'REST APIs', 'WebSockets'],
  },
  {
    name: 'Data',
    items: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'TimescaleDB'],
  },
  {
    name: 'Wingu & DevOps',
    items: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions', 'Vercel', 'Terraform'],
  },
  {
    name: 'AI & ML',
    items: ['OpenAI API', 'LangChain', 'RAG Pipelines', 'Vector Databases', 'Prompt Engineering'],
  },
  {
    name: 'Usalama',
    items: ['OAuth 2.0', 'WebAuthn', 'JWT', 'Encryption', 'OWASP Standards'],
  },
  {
    name: 'Zana',
    items: ['Git', 'Figma', 'Linear', 'Postman', 'Datadog', 'Sentry'],
  },
]
