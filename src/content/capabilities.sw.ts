import type { Capability } from './capabilities'

// `areas` are product and technology names — proper nouns — and are identical
// to the English file on purpose. Only `title` and `description` are translated.

export const capabilityContent: Capability[] = [
  {
    id: 'frontend',
    title: 'Uhandisi wa Upande wa Mbele',
    description:
      'React na Vite kwa duka la Pharimz Creatives, akaunti zake na malipo. Tovuti hii imejengwa kwa Next.js na TypeScript.',
    areas: ['React & Next.js', 'TypeScript', 'Vite', 'JavaScript'],
  },
  {
    id: 'backend',
    title: 'Uhandisi wa Upande wa Nyuma',
    description:
      'Node.js na Express nyuma ya Pharimz Creatives, pamoja na malipo ya M-Pesa Daraja. ASP.NET Core na EF Core nyuma ya Salio, ambapo ninajifunza C# kwa kuujenga.',
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
    title: 'Seva na Usambazaji',
    description:
      'Ninaendesha Linux VPS yangu mwenyewe, ninasambaza kwa GitHub Actions, na ninahifadhi tovuti za wateja kwenye seva za Ubuntu.',
    areas: ['Ubuntu', 'Docker', 'Nginx', 'Caddy', 'GitHub Actions'],
  },
  {
    id: 'ai',
    title: 'Akili Bandia',
    description:
      'Kwa Kahawa Smart, mradi wangu wa chuo kikuu: modeli ya TensorFlow inayotambua kutu ya majani ya kahawa, na chatbot inayotegemea RAG pipeline.',
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
    title: 'Usalama wa Programu',
    description:
      'Kwenye Pharimz Creatives, baada ya uzinduzi, nilifunga mwanya wa kubadilisha ID ambao ungeweza kufichua oda za wateja wengine, nilithibitisha callbacks za M-Pesa na nikaimarisha row-level security ya Supabase.',
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
    title: 'Ubunifu wa Mifumo',
    description:
      'Bado sijajenga mfumo wa kiwango kikubwa. Muundo wa Salio uko chini ya Hifadhidata.',
    areas: [],
  },
  {
    id: 'databases',
    title: 'Hifadhidata',
    description:
      'Salio inaendeshwa kwa PostgreSQL 16: muamala mmoja kwa kila mauzo, pesa kwa senti kamili, kila jedwali linahusishwa na biashara moja. Pharimz Creatives inaendeshwa kwa Supabase.',
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
    title: 'Uboreshaji wa Utendaji',
    description: 'Bado sina kazi ya utendaji iliyopimwa ya kuonyesha.',
    areas: [],
  },
  {
    id: 'ui-engineering',
    title: 'Uhandisi wa Kiolesura',
    description:
      'Uhuishaji wa GSAP kwenye Kahawa Smart, na mipangilio inayoitikia (responsive) kwenye tovuti hii.',
    areas: ['GSAP', 'Responsive Design'],
  },
]
