import type { TechnologyCategory } from './technologies'

export const technologyContent: TechnologyCategory[] = [
  {
    name: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'HTML & CSS'],
  },
  {
    name: 'Frontend',
    items: ['React', 'Next.js', 'Tailwind CSS', 'Three.js', 'GSAP', 'Framer Motion'],
  },
  {
    name: 'Backend',
    items: ['Node.js', 'Express', 'GraphQL', 'REST APIs', 'WebSockets'],
  },
  {
    name: 'Databases',
    items: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'TimescaleDB'],
  },
  {
    name: 'Cloud & DevOps',
    items: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions', 'Vercel', 'Terraform'],
  },
  {
    name: 'AI & ML',
    items: ['OpenAI API', 'LangChain', 'RAG Pipelines', 'Vector Databases', 'Prompt Engineering'],
  },
  {
    name: 'Security',
    items: ['OAuth 2.0', 'WebAuthn', 'JWT', 'Encryption', 'OWASP Standards'],
  },
  {
    name: 'Tools',
    items: ['Git', 'Figma', 'Linear', 'Postman', 'Datadog', 'Sentry'],
  },
]
