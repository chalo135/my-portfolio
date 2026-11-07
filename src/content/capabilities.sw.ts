import type { Capability } from './capabilities'

// `areas` are product and technology names — proper nouns — and are identical
// to the English file on purpose. Only `title` and `description` are translated.

export const capabilityContent: Capability[] = [
  {
    id: 'frontend',
    title: 'Uhandisi wa Upande wa Mbele',
    description:
      'Kuunda violesura vinavyoitikia na vyenye kasi kwa kutumia mifumo ya kisasa na uangalifu mkubwa kwa matumizi ya mtumiaji.',
    areas: [
      'React & Next.js',
      'TypeScript',
      'State Management',
      'Design Systems',
      'Accessibility',
      'Performance Optimization',
    ],
  },
  {
    id: 'backend',
    title: 'Uhandisi wa Upande wa Nyuma',
    description:
      'Kujenga mifumo imara ya seva yenye usanifu safi, API zenye ufanisi, na ushughulikiaji wa data unaoaminika.',
    areas: [
      'Node.js',
      'REST & GraphQL APIs',
      'Microservices',
      'Authentication',
      'Business Logic',
      'Integration Patterns',
    ],
  },
  {
    id: 'cloud',
    title: 'Miundombinu ya Wingu',
    description:
      'Kubuni na kusambaza miundo ya wingu inayoweza kupanuka kwa kutumia miundombinu kama msimbo na uendeshaji wa kiotomatiki.',
    areas: [
      'AWS & Azure',
      'Docker & Kubernetes',
      'CI/CD Pipelines',
      'Serverless',
      'Infrastructure as Code',
      'Monitoring',
    ],
  },
  {
    id: 'ai',
    title: 'Akili Bandia',
    description:
      'Kuunganisha uwezo wa AI katika mifumo iliyo hewani kwa utekelezaji wenye uwajibikaji na matokeo yanayopimika.',
    areas: [
      'LLM Integration',
      'RAG Systems',
      'AI Agents',
      'Prompt Engineering',
      'ML Pipelines',
      'AI Safety',
    ],
  },
  {
    id: 'security',
    title: 'Usalama wa Mtandao',
    description:
      'Kutekeleza miundo inayotanguliza usalama kwa kutumia usimbaji fiche, uthibitishaji, na mifumo ya kufuata kanuni.',
    areas: [
      'Application Security',
      'Encryption',
      'OAuth & WebAuthn',
      'Security Audits',
      'Compliance',
      'Threat Modeling',
    ],
  },
  {
    id: 'system-design',
    title: 'Ubunifu wa Mifumo',
    description:
      'Kubuni mifumo iliyosambaa inayosawazisha utendaji, uaminifu, na udumishaji katika kiwango kikubwa.',
    areas: [
      'Distributed Systems',
      'Event-Driven Architecture',
      'Database Design',
      'Caching Strategies',
      'Load Balancing',
      'Fault Tolerance',
    ],
  },
  {
    id: 'databases',
    title: 'Hifadhidata',
    description:
      'Kubuni miundo ya data na mbinu za maswali zilizoboreshwa kwa utendaji, uthabiti, na ukuaji.',
    areas: [
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'Data Modeling',
      'Query Optimization',
      'Migrations',
    ],
  },
  {
    id: 'performance',
    title: 'Uboreshaji wa Utendaji',
    description:
      'Kupima na kuboresha mifumo katika safu zote ili kutoa matumizi ya haraka na yenye ufanisi.',
    areas: [
      'Core Web Vitals',
      'Bundle Optimization',
      'Database Tuning',
      'Caching',
      'CDN Strategy',
      'Profiling',
    ],
  },
  {
    id: 'ui-engineering',
    title: 'Uhandisi wa Kiolesura',
    description:
      'Kuunganisha ubunifu na uhandisi kwa utekelezaji sahihi kabisa na ubunifu wa mwendo wa hali ya juu.',
    areas: [
      'Component Libraries',
      'Animation Systems',
      'Three.js & WebGL',
      'Responsive Design',
      'Typography',
      'Micro-interactions',
    ],
  },
]
