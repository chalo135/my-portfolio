# Copy changes

Every English string that changed in the copy rewrite, from the baseline
commit `5164ca5` to now, grouped by page (183 in all). Generated from the files
themselves, so a string that was rewritten more than once shows only where it
started and where it ended up. The Kiswahili followed each change; those
strings are in `SWAHILI_COPY_REVIEW.md` under "Copy rewrite".

In writing-post bodies, `⏎` marks a paragraph break.

## Home and site-wide

`src/content/site.en.ts`, 19 changed

| key | before | after |
|---|---|---|
| `siteContent.site.tagline` | I build the software Kenyan businesses run on. | I build software for small Kenyan businesses. |
| `siteContent.site.description` | Full-stack engineer in Nairobi. I build multi-tenant ERP for small and mid-sized Kenyan businesses, M-Pesa Daraja payment integrations, and point-of-sale systems with real double-entry accounting underneath. | Software engineer in Nairobi. I build software for small Kenyan businesses: a live online shop with M-Pesa checkout, and a point of sale with double-entry accounting underneath, still in progress. Available now. |
| `siteContent.site.ethos` | Software that has to balance at the end of the month. | In Salio, the books have to balance at the end of the month. |
| `siteContent.meta.keywords[1]` | Full-Stack Developer | Full-Stack Development |
| `siteContent.meta.keywords[2]` | System Design | Point of Sale |
| `siteContent.meta.keywords[3]` | Cloud Infrastructure | Double-Entry Accounting |
| `siteContent.meta.keywords[4]` | AI Engineering | M-Pesa Daraja |
| `siteContent.meta.keywords[5]` | Nairobi | Power BI |
| `siteContent.meta.keywords[6]` | Kenya | Linux VPS |
| `siteContent.meta.keywords[7]` | M-Pesa Daraja | Nairobi |
| `siteContent.meta.keywords[8]` | ERP | Kenya |
| `siteContent.hero.eyebrow` | Full-stack engineer — Nairobi, Kenya | Software engineer in Nairobi, Kenya |
| `siteContent.hero.headline` | I build the software Kenyan businesses run on. | I build software for small Kenyan businesses. |
| `siteContent.hero.subhead` | Multi-tenant ERP for small and mid-sized businesses, M-Pesa Daraja payments, and a point of sale with double-entry accounting underneath it. Currently in Nairobi, open to remote. | Right now that’s Pharimz Creatives, a live shop that takes M-Pesa, and Salio, a point of sale with double-entry accounting that I’m still building. Available now for remote or onsite roles. |
| `siteContent.homeTeasers.philosophy.lead` | Business software fails on the boring parts — a refund that never reconciles, a tenant that can read another tenant’s invoices. That is where I spend my time. | On Pharimz Creatives, changing an ID in a request could show another customer’s order, so I closed that hole. In Salio, a journal entry that doesn’t balance is refused. |
| `siteContent.homeTeasers.work.lead` | Systems I have designed and shipped. | What I’ve shipped, and the point of sale I’m building now. |
| `siteContent.homeTeasers.capabilities.lead` | TypeScript and Next.js on the front, Postgres and Supabase behind it, and the payments and accounting logic in between. I have also spent a fair amount of time closing IDOR holes and writing row-level security policies on a live e-commerce platform. | React and Supabase on the shop, where I tightened row-level security. C# and .NET with PostgreSQL under the point of sale. I run my own Linux VPS with Docker and deploy with GitHub Actions. |
| `siteContent.homeTeasers.contact.headline` | Tell me what you are trying to build. | Tell me about the role or the project. |
| `siteContent.homeTeasers.contact.lead` | Open to full-time roles and to contract work on payments, ERP, and anything that has to reconcile at the end of the month. Nairobi, or remote. | I’m available now for remote full-stack roles, onsite IT roles and freelance projects. |

## Page heroes, metadata, contact, errors

`src/content/pages.en.ts`, 26 changed

| key | before | after |
|---|---|---|
| `pagesContent.meta.about.description` | I'm Charles Ndirangu. I work across the stack, mostly on the systems small and mid-sized Kenyan businesses actually run their day on. | I'm Charles Ndirangu, a software engineer in Nairobi. I build software for small Kenyan businesses, including a live online shop and a point of sale I'm still building. |
| `pagesContent.meta.capabilities.description` | Enterprise engineering capabilities across the full software stack. | M-Pesa checkout on a live shop, and my own Linux VPS with Docker and GitHub Actions deploys. |
| `pagesContent.meta.contact.description` | Get in touch about payments, ERP, and full-stack engineering work. | I'm available now for remote full-stack roles, onsite IT roles and freelance projects. |
| `pagesContent.meta.experience.description` | Professional experience building enterprise software systems. | Freelance software work since April 2025, family business operations, and a network support attachment. |
| `pagesContent.meta.philosophy.description` | The principles that guide every system I build. | How I build software, with examples from Salio and Pharimz Creatives. |
| `pagesContent.meta.projects.description` | Enterprise software products engineered with precision and craftsmanship. | A point of sale with double-entry accounting, a live M-Pesa shop, and a coffee leaf rust model. |
| `pagesContent.meta.resume.title` | Resume | Résumé |
| `pagesContent.meta.resume.description` | Professional resume and qualifications. | My résumé: freelance software work since April 2025 and a BSc in Computer Technology. |
| `pagesContent.meta.technologies.description` | The tools and technologies used to build enterprise-grade software. | A list of languages, frameworks and tools. Each project page shows its own stack. |
| `pagesContent.meta.writing.description` | Thoughts on software engineering, architecture, AI, and building products. | Notes on Salio's books, securing Pharimz Creatives and building Kahawa Smart. |
| `pagesContent.projects.hero.title` | Products engineered to endure. | What I've built. |
| `pagesContent.projects.hero.description` | Every project is treated as a product launch—designed, architected, and delivered with enterprise-grade standards. | A live online shop that takes M-Pesa, a point of sale I'm still building, and a university project that spots coffee leaf rust. |
| `pagesContent.writing.hero.title` | Engineering insights. | Notes from the work. |
| `pagesContent.writing.hero.description` | Exploring the craft of software engineering—architecture, performance, security, AI integration, and building products that matter. | Notes on Salio's books, securing Pharimz Creatives and building Kahawa Smart. |
| `pagesContent.capabilities.hero.title` | Engineering across the entire stack. | What I can do. |
| `pagesContent.capabilities.hero.description` | Deep expertise spanning frontend, backend, cloud, AI, security, and system design—delivered with enterprise standards. | Web frontends and backends with M-Pesa payments, plus my own Linux VPS with Docker and GitHub Actions deploys. |
| `pagesContent.technologies.hero.title` | Tools chosen with intention. | Tools and languages. |
| `pagesContent.technologies.hero.description` | Technology is a means, not an end. Every tool in this stack is selected for reliability, performance, and long-term maintainability. | A list of languages, frameworks and tools. Each project page shows what that project uses. |
| `pagesContent.experience.hero.title` | A track record of delivery. | Where I've worked. |
| `pagesContent.experience.hero.description` | Building software systems across enterprise, startup, and government contexts—with consistent focus on quality and impact. | Freelance software development since April 2025, operations in the family business since May 2023, and a network support attachment at Fiberlink. |
| `pagesContent.resume.hero.label` | Resume | Résumé |
| `pagesContent.resume.hero.description` | Software Engineer specializing in enterprise-grade systems, full-stack development, and intelligent software architecture. | Software engineer in Nairobi. I build software for small Kenyan businesses, including a live online shop and a point of sale I'm still building. Available now. |
| `pagesContent.resume.capabilitiesHeading` | Core Capabilities | Capabilities |
| `pagesContent.contact.title` | Let's build software that matters. | I'm available now. |
| `pagesContent.contact.lead` | Open to enterprise engagements, remote positions, and ambitious product collaborations. | I'm open to remote full-stack roles, onsite IT roles and freelance projects. |
| `pagesContent.contact.ctaLabel` | Start a Conversation | Email me |

## Projects

`src/content/projects.en.ts`, 4 changed

| key | before | after |
|---|---|---|
| `projectContent[salio].oneLiner` | A point-of-sale system for Kenyan shops with real double-entry accounting underneath. | A point-of-sale system for Kenyan shops with double-entry accounting underneath. |
| `projectContent[salio].context` | Shaped around a family spare-parts shop, for owners who aren't accountants. | I'm building it around a family spare-parts shop, for owners who aren't accountants. |
| `projectContent[pharimz].oneLiner` | An online shop for a Kenyan streetwear and branding business — hoodies, football jerseys and design services. | An online shop for a Kenyan streetwear and branding business that sells hoodies, football jerseys and design services. |
| `projectContent[kahawa-smart].oneLiner` | Coffee leaf disease detection for Kenyan smallholder farmers. | Coffee leaf rust detection from a photo, for Kenyan smallholder farmers. |

## About (the report)

`src/content/about-report.en.ts`, 8 changed

| key | before | after |
|---|---|---|
| `aboutReportCopy.intro[0]` | I'm Charles Ndirangu, Chalo to most people. I'm a software engineer in Nairobi, and I build the point-of-sale, M-Pesa and accounting software Kenyan businesses run on. | I'm Charles Ndirangu, Chalo to most people, a software engineer in Nairobi. I'm building Salio, a point-of-sale system with double-entry accounting. On Pharimz Creatives, a live online shop with M-Pesa checkout, I closed a hole that could expose another customer's order. |
| `aboutReportCopy.introWithPbix[0]` | I'm Charles Ndirangu, Chalo to most people. I'm a software engineer in Nairobi, and I build the point-of-sale, M-Pesa and accounting software Kenyan businesses run on. | I'm Charles Ndirangu, Chalo to most people, a software engineer in Nairobi. I'm building Salio, a point-of-sale system with double-entry accounting. On Pharimz Creatives, a live online shop with M-Pesa checkout, I closed a hole that could expose another customer's order. |
| `aboutReportCopy.kinds.salio` | Product | Point of sale |
| `aboutReportCopy.kinds.kahawa-smart` | AI app | Leaf rust detection |
| `aboutReportCopy.timeline[4].lane` | Customer service support certificate | Customer service certificate, Griffin Global Bootcamp |
| `aboutReportCopy.timeline[5].end` | 2026-11-30 | 2026-11-01 |
| `aboutReportCopy.profile[Degree].value` | BSc Computer Technology, Multimedia University of Kenya | BSc Computer Technology, Multimedia University of Kenya, graduated 2026 |
| `aboutReportCopy.timeline[4].end` | *(not there)* | 2026-09-30 |

## Experience and résumé

`src/content/experience.en.ts`, 21 changed

| key | before | after |
|---|---|---|
| `experienceContent[exp-1].role` | Senior Software Engineer | Freelance software developer |
| `experienceContent[exp-1].organization` | [Your Organization] | Self-employed |
| `experienceContent[exp-1].period` | 2024 — Present | Apr 2025 to now |
| `experienceContent[exp-1].description` | Leading development of enterprise-grade software solutions with focus on scalability, security, and user experience. | Software work for clients, alongside operations in the family business. |
| `experienceContent[exp-1].highlights[0]` | Architected and delivered production systems serving thousands of users | Host client sites on Ubuntu servers |
| `experienceContent[exp-1].highlights[1]` | Established engineering standards and code review practices | My own Linux VPS runs Docker, Nginx and Caddy |
| `experienceContent[exp-1].highlights[2]` | Mentored team members on modern development practices | Deploys go out through GitHub Actions |
| `experienceContent[exp-2].role` | Full-Stack Engineer | Operations |
| `experienceContent[exp-2].organization` | [Previous Organization] | Family business |
| `experienceContent[exp-2].period` | 2022 — 2024 | May 2023 to now |
| `experienceContent[exp-2].description` | Built and maintained full-stack applications across frontend, backend, and cloud infrastructure. | I work in operations for the family business, which does plumbing and bio-digesters. |
| `experienceContent[exp-2].highlights[0]` | Developed responsive web applications with React and Next.js | Plumbing and bio-digester work for about 12 large clients |
| `experienceContent[exp-2].highlights[1]` | Designed RESTful and GraphQL APIs for client integrations | *(not there)* |
| `experienceContent[exp-2].highlights[2]` | Implemented CI/CD pipelines reducing deployment time significantly | *(not there)* |
| `experienceContent[exp-3].role` | Software Developer | Network support |
| `experienceContent[exp-3].organization` | [Earlier Organization] | Fiberlink |
| `experienceContent[exp-3].period` | 2020 — 2022 | Attachment |
| `experienceContent[exp-3].description` | Contributed to product development across the software lifecycle, from requirements to deployment. | A network support attachment at Fiberlink. |
| `experienceContent[exp-3].highlights[0]` | Collaborated with cross-functional teams on feature delivery | *(not there)* |
| `experienceContent[exp-3].highlights[1]` | Optimized application performance and database queries | *(not there)* |
| `experienceContent[exp-3].highlights[2]` | Participated in agile development processes | *(not there)* |

## Philosophy

`src/content/philosophy.en.ts`, 20 changed

| key | before | after |
|---|---|---|
| `philosophyContent.pillars[quality].headline` | Excellence is non-negotiable. | The books have to balance. |
| `philosophyContent.pillars[quality].description` | Every line of code, every interaction, every architectural decision reflects a commitment to building software that stands the test of time. Quality is not a phase—it is the foundation. | In Salio, only one function, PostJournal, can write journal lines. It refuses any entry whose debits and credits don't match, and I covered it with unit tests. |
| `philosophyContent.pillars[craftsmanship].title` | Craftsmanship | Finishing |
| `philosophyContent.pillars[craftsmanship].headline` | Software is a craft. | I finish things properly. |
| `philosophyContent.pillars[craftsmanship].description` | Like any master craft, software engineering demands patience, precision, and pride in the work. I approach each project with the discipline of an artisan and the rigor of an engineer. | I care about the work and see it through. The examples are in the other principles on this page. |
| `philosophyContent.pillars[scalability].headline` | Built to grow. | One install, many shops. |
| `philosophyContent.pillars[scalability].description` | Systems must evolve with the organizations they serve. I design architectures that scale horizontally—in users, data, and complexity—without requiring complete rewrites. | Every table in Salio is scoped to a business, so one install can serve many shops. |
| `philosophyContent.pillars[user-centered].headline` | Technology serves people. | Built for shop owners and their customers. |
| `philosophyContent.pillars[user-centered].description` | The most elegant architecture means nothing if the experience fails its users. I prioritize clarity, accessibility, and intuitive design in every interface I build. | I'm building Salio for shop owners who aren't accountants. On Pharimz Creatives, checkout takes M-Pesa STK Push, because that's how most customers pay. |
| `philosophyContent.pillars[performance].headline` | Speed is a feature. | Keep it fast. |
| `philosophyContent.pillars[performance].description` | Performance is respect for the user's time and resources. I optimize at every layer—from database queries to render cycles—to deliver experiences that feel instantaneous. | I don't have measured performance work to show yet. |
| `philosophyContent.pillars[security].headline` | Trust by design. | Orders and payments locked down. |
| `philosophyContent.pillars[security].description` | Security is woven into architecture from day one, not bolted on before launch. I build systems that protect data, preserve privacy, and withstand evolving threats. | On Pharimz Creatives I closed a hole where changing an ID in a request could expose another customer's order. I verified M-Pesa callbacks so a payment can't be faked, and tightened Supabase row-level security. |
| `philosophyContent.pillars[maintainability].headline` | Code for the next engineer. | Append-only stock, money in whole cents. |
| `philosophyContent.pillars[maintainability].description` | Readable, well-documented, and thoughtfully structured code ensures that systems remain adaptable long after initial deployment. Future teams should inherit clarity, not confusion. | In Salio, stock movements are append-only and reports are calculated when they're read, never stored. Money is kept in whole cents, never floating-point numbers. |
| `philosophyContent.pillars[innovation].title` | Innovation | New tools |
| `philosophyContent.pillars[innovation].headline` | Progress with purpose. | A model that spots leaf rust. |
| `philosophyContent.pillars[innovation].description` | Innovation is not novelty for its own sake. I adopt new technologies when they solve real problems, improve outcomes, or unlock capabilities that were previously impossible. | For Kahawa Smart, my university project, I built a TensorFlow model that flags coffee leaf rust from a photo of a leaf, and a chatbot grounded in a RAG pipeline. |
| `philosophyContent.intro.subheadline` | The principles that guide every system I build. | Most of these point to something I built. |
| `philosophyContent.intro.description` | Software engineering is more than writing code—it is the disciplined art of solving complex problems with elegant, durable solutions. These principles define how I approach every project, from initial architecture to final deployment. | The examples come from Salio, the point of sale I'm building in C#; Pharimz Creatives, an online shop that's live; and Kahawa Smart, my university project. |

## Capabilities

`src/content/capabilities.en.ts`, 57 changed

| key | before | after |
|---|---|---|
| `capabilityContent[frontend].description` | Crafting responsive, performant interfaces with modern frameworks and meticulous attention to user experience. | React and Vite for the Pharimz Creatives storefront, accounts and checkout. This site is Next.js and TypeScript. |
| `capabilityContent[frontend].areas[2]` | State Management | Vite |
| `capabilityContent[frontend].areas[3]` | Design Systems | JavaScript |
| `capabilityContent[frontend].areas[4]` | Accessibility | *(not there)* |
| `capabilityContent[frontend].areas[5]` | Performance Optimization | *(not there)* |
| `capabilityContent[backend].description` | Building robust server-side systems with clean architecture, efficient APIs, and reliable data handling. | Node.js and Express behind Pharimz Creatives, with M-Pesa Daraja payments. ASP.NET Core and EF Core behind Salio, where I'm learning C# by building it. |
| `capabilityContent[backend].areas[1]` | REST & GraphQL APIs | Express |
| `capabilityContent[backend].areas[2]` | Microservices | ASP.NET Core |
| `capabilityContent[backend].areas[4]` | Business Logic | EF Core |
| `capabilityContent[backend].areas[5]` | Integration Patterns | M-Pesa Daraja |
| `capabilityContent[cloud].title` | Cloud Infrastructure | Servers & Deployment |
| `capabilityContent[cloud].description` | Designing and deploying scalable cloud architectures with infrastructure as code and automated operations. | I run my own Linux VPS, deploy with GitHub Actions, and host client sites on Ubuntu servers. |
| `capabilityContent[cloud].areas[0]` | AWS & Azure | Ubuntu |
| `capabilityContent[cloud].areas[1]` | Docker & Kubernetes | Docker |
| `capabilityContent[cloud].areas[2]` | CI/CD Pipelines | Nginx |
| `capabilityContent[cloud].areas[3]` | Serverless | Caddy |
| `capabilityContent[cloud].areas[4]` | Infrastructure as Code | GitHub Actions |
| `capabilityContent[cloud].areas[5]` | Monitoring | *(not there)* |
| `capabilityContent[ai].description` | Integrating AI capabilities into production systems with responsible implementation and measurable outcomes. | For Kahawa Smart, my university project: a TensorFlow model that flags coffee leaf rust, and a chatbot grounded in a RAG pipeline. |
| `capabilityContent[ai].areas[1]` | RAG Systems | RAG Pipeline |
| `capabilityContent[ai].areas[2]` | AI Agents | TensorFlow |
| `capabilityContent[ai].areas[3]` | Prompt Engineering | Groq |
| `capabilityContent[ai].areas[4]` | ML Pipelines | Image Classification |
| `capabilityContent[ai].areas[5]` | AI Safety | Python |
| `capabilityContent[security].title` | Cybersecurity | Application Security |
| `capabilityContent[security].description` | Implementing security-first architectures with encryption, authentication, and compliance frameworks. | On Pharimz Creatives, after launch, I closed an ID-swap hole that could expose other customers' orders, verified M-Pesa callbacks and tightened Supabase row-level security. |
| `capabilityContent[security].areas[1]` | Encryption | Row-Level Security |
| `capabilityContent[security].areas[2]` | OAuth & WebAuthn | Supabase |
| `capabilityContent[security].areas[3]` | Security Audits | Payment Callback Verification |
| `capabilityContent[security].areas[4]` | Compliance | Access Control |
| `capabilityContent[security].areas[5]` | Threat Modeling | *(not there)* |
| `capabilityContent[system-design].description` | Architecting distributed systems that balance performance, reliability, and maintainability at scale. | I haven't built a large-scale system yet. Salio's design is under Databases. |
| `capabilityContent[system-design].areas[0]` | Distributed Systems | *(not there)* |
| `capabilityContent[system-design].areas[1]` | Event-Driven Architecture | *(not there)* |
| `capabilityContent[system-design].areas[2]` | Database Design | *(not there)* |
| `capabilityContent[system-design].areas[3]` | Caching Strategies | *(not there)* |
| `capabilityContent[system-design].areas[4]` | Load Balancing | *(not there)* |
| `capabilityContent[system-design].areas[5]` | Fault Tolerance | *(not there)* |
| `capabilityContent[databases].description` | Designing data models and query strategies optimized for performance, consistency, and growth. | Salio runs on PostgreSQL 16: one transaction per sale, money in whole cents, every table scoped to a business. Pharimz Creatives runs on Supabase. |
| `capabilityContent[databases].areas[1]` | MongoDB | Supabase |
| `capabilityContent[databases].areas[2]` | Redis | EF Core |
| `capabilityContent[databases].areas[4]` | Query Optimization | Transactions |
| `capabilityContent[databases].areas[5]` | Migrations | Double-Entry Accounting |
| `capabilityContent[performance].description` | Profiling and optimizing systems across the stack to deliver fast, efficient user experiences. | I don't have measured performance work to show yet. |
| `capabilityContent[performance].areas[0]` | Core Web Vitals | *(not there)* |
| `capabilityContent[performance].areas[1]` | Bundle Optimization | *(not there)* |
| `capabilityContent[performance].areas[2]` | Database Tuning | *(not there)* |
| `capabilityContent[performance].areas[3]` | Caching | *(not there)* |
| `capabilityContent[performance].areas[4]` | CDN Strategy | *(not there)* |
| `capabilityContent[performance].areas[5]` | Profiling | *(not there)* |
| `capabilityContent[ui-engineering].description` | Bridging design and engineering with pixel-perfect implementation and sophisticated motion design. | GSAP animation on Kahawa Smart, and responsive layouts on this site. |
| `capabilityContent[ui-engineering].areas[0]` | Component Libraries | GSAP |
| `capabilityContent[ui-engineering].areas[1]` | Animation Systems | Responsive Design |
| `capabilityContent[ui-engineering].areas[2]` | Three.js & WebGL | *(not there)* |
| `capabilityContent[ui-engineering].areas[3]` | Responsive Design | *(not there)* |
| `capabilityContent[ui-engineering].areas[4]` | Typography | *(not there)* |
| `capabilityContent[ui-engineering].areas[5]` | Micro-interactions | *(not there)* |

## Technologies

`src/content/technologies.en.ts`, 1 changed

| key | before | after |
|---|---|---|
| `technologyContent[3].name` | Data | Databases |

## Writing

`src/content/writing.en.ts`, 22 changed

| key | before | after |
|---|---|---|
| `writingContent[building-scalable-systems].title` | Building Scalable Systems: Lessons from Production | How I keep Salio's books in balance |
| `writingContent[building-scalable-systems].excerpt` | Architectural patterns and practical strategies for designing systems that grow with your organization. | The design rules in Salio, my point-of-sale system, that keep the till and the accounts from drifting apart. |
| `writingContent[building-scalable-systems].readTime` | 8 min | 1 min |
| `writingContent[building-scalable-systems].content` | Scalability is not a feature you add—it is a property you design into your system from the beginning. After building and maintaining production systems at scale, several patterns consistently emerge as critical to long-term success. ⏎ ## Start with Boundaries ⏎ Clear service boundaries prevent the monolith trap while avoiding the complexity of premature microservices. Define bounded contexts based on business capabilities, not technical layers. ⏎ ## Design for Failure ⏎ Every external dependency will fail. Circuit breakers, retries with exponential backoff, and graceful degradation are not optional—they are foundational. ⏎ ## Measure Everything ⏎ You cannot optimize what you cannot measure. Invest in observability early: structured logging, distributed tracing, and meaningful metrics dashboards. | Salio is a point-of-sale system I'm building for Kenyan shops, with double-entry accounting underneath. I'm building it around a family spare-parts shop, for owners who aren't accountants. It's still in progress. These are its rules. Rules like these are hard to add once data exists. ⏎ ## The stack ⏎ C# on .NET 10, with ASP.NET Core and EF Core, over PostgreSQL 16. I'm learning C# by building it. ⏎ ## One transaction per sale ⏎ Every sale is one database transaction. It writes the receipt, the stock movement and a balanced journal entry together, or it writes nothing. There's no sync between the till and the books, because there is only one set of books. ⏎ ## One door into the ledger ⏎ Only one function, PostJournal, is allowed to write journal lines. It refuses any entry whose debits and credits don't balance. I wrote it by hand and covered it with unit tests. ⏎ ## Money in whole cents ⏎ Money is stored in whole cents, never as floating-point numbers. A floating-point number can't hold most decimal fractions of a shilling exactly, so a long column of them stops adding up to the right total. Whole cents always do. ⏎ ## Nothing stored that can go stale ⏎ Stock movements are append-only, so a correction is a new movement, not an edit to an old one. Reports are calculated when they're read, never stored. ⏎ ## One install, many shops ⏎ Every table is scoped to a business, so one install can serve many shops. |
| `writingContent[ai-integration-patterns].title` | AI Integration Patterns for Production Applications | Building Kahawa Smart |
| `writingContent[ai-integration-patterns].excerpt` | How to integrate large language models into production systems responsibly and effectively. | A model that flags coffee leaf rust from a photo, and a chatbot grounded in a RAG pipeline. My university demonstration project. |
| `writingContent[ai-integration-patterns].readTime` | 10 min | 1 min |
| `writingContent[ai-integration-patterns].content` | Integrating AI into production applications requires more than calling an API. It demands thoughtful architecture around reliability, cost management, and user trust. ⏎ ## RAG vs Fine-Tuning ⏎ Retrieval-Augmented Generation offers flexibility and transparency. Fine-tuning suits domain-specific language patterns. Most production systems benefit from RAG as a starting point. ⏎ ## Guardrails Matter ⏎ Implement input validation, output filtering, and fallback behaviors. Users should never encounter raw model failures—they should experience graceful degradation. ⏎ ## Cost Awareness ⏎ Token usage scales with users. Cache responses, batch requests, and use smaller models for classification tasks before routing to larger models for generation. | Kahawa Smart was my university demonstration project. Coffee leaf rust spreads fast, and a smallholder farmer often can't get an expert to look at a leaf in time. ⏎ ## The model ⏎ I built the model in TensorFlow. Give it a photo of a coffee leaf and it flags leaf rust. It looks for that one disease, not every disease a coffee plant can get. ⏎ ## The chatbot ⏎ The chatbot answers follow-up questions. I grounded it in a retrieval (RAG) pipeline, so its answers draw on retrieved material instead of the language model alone. ⏎ ## The stack ⏎ TensorFlow, Python, FastAPI, Groq, JavaScript and GSAP. |
| `writingContent[security-first-architecture].title` | Security-First Architecture for Modern Applications | Locking down a live shop |
| `writingContent[security-first-architecture].excerpt` | Embedding security into your architecture rather than treating it as a final checklist item. | What I fixed in the Pharimz Creatives shop after launch, starting with a request that could show one customer another customer's order. |
| `writingContent[security-first-architecture].category` | Cybersecurity | Security |
| `writingContent[security-first-architecture].readTime` | 7 min | 1 min |
| `writingContent[security-first-architecture].content` | Security cannot be bolted onto an application before launch. It must be woven into every architectural decision from day one. ⏎ ## Authentication vs Authorization ⏎ Authentication verifies identity. Authorization determines access. Confusing the two leads to over-privileged accounts and authorization bypass vulnerabilities. ⏎ ## Zero Trust Principles ⏎ Never trust, always verify. Every request—internal or external—should be authenticated and authorized regardless of network location. ⏎ ## Encryption Everywhere ⏎ Data at rest, data in transit, and data in use (where feasible) should all be encrypted with modern algorithms and proper key management. | Pharimz Creatives is an online shop for a Kenyan streetwear and branding business. It takes orders and payment in shillings, including M-Pesa. After it went live, I went back and locked it down. ⏎ ## Another customer's order ⏎ I found a hole where changing an ID in a request could expose another customer's order. Being logged in isn't enough. The server has to check that the order belongs to the person asking. I closed it. ⏎ ## M-Pesa callbacks ⏎ Checkout uses M-Pesa STK Push, and M-Pesa confirms each payment with a callback. I verified those callbacks so a confirmation can't be faked. ⏎ ## Row-level security ⏎ The shop's data sits in Supabase. I tightened its row-level security, the rules in the database that decide which rows each user can reach. ⏎ ## What I'd change ⏎ All of this came after launch. On the next shop, I'll check who owns each record before the first customer arrives. |
| `writingContent[nextjs-performance-guide].title` | Next.js Performance: A Practical Engineering Guide | Notes on Next.js performance |
| `writingContent[nextjs-performance-guide].excerpt` | Concrete techniques for achieving exceptional performance in Next.js applications. | General notes on where a Next.js page can lose speed. |
| `writingContent[nextjs-performance-guide].readTime` | 9 min | 1 min |
| `writingContent[nextjs-performance-guide].content` | Performance is a competitive advantage. In Next.js applications, performance optimization spans rendering strategy, bundle size, and runtime behavior. ⏎ ## Choose Your Rendering Wisely ⏎ Static generation for content that rarely changes. Server-side rendering for personalized pages. Client-side for highly interactive components. Hybrid approaches often deliver the best results. ⏎ ## Bundle Analysis ⏎ Regularly audit your bundle with @next/bundle-analyzer. Dynamic imports and route-based code splitting eliminate unnecessary JavaScript from initial loads. ⏎ ## Image Optimization ⏎ Use next/image with proper sizing, modern formats, and priority loading for above-the-fold content. Images are often the largest performance bottleneck. | These are general notes, not results from a project of mine. ⏎ ## Rendering ⏎ A page that rarely changes can be generated once at build time. A page that differs for each user has to be rendered on each request. ⏎ ## JavaScript sent to the browser ⏎ @next/bundle-analyzer shows what ends up in the bundle. Dynamic imports keep code that isn't needed on first load out of it. ⏎ ## Images ⏎ next/image serves an image sized for the screen. The priority prop loads the main image at the top of the page first. |
| `writingContent[remote-engineering-excellence].title` | Remote Engineering Excellence | Notes on remote work |
| `writingContent[remote-engineering-excellence].excerpt` | Building high-performing engineering practices in distributed teams. | General notes on writing things down when a team works apart. |
| `writingContent[remote-engineering-excellence].category` | Remote Engineering | Remote work |
| `writingContent[remote-engineering-excellence].readTime` | 6 min | 1 min |
| `writingContent[remote-engineering-excellence].content` | Remote engineering demands intentional communication, async-first workflows, and documentation culture that co-located teams often take for granted. ⏎ ## Async by Default ⏎ Not every conversation needs a meeting. Write clear proposals, use threaded discussions, and reserve synchronous time for complex decisions. ⏎ ## Documentation as Infrastructure ⏎ If it is not documented, it does not exist for remote team members. Treat documentation with the same rigor as code. ⏎ ## Over-Communicate Context ⏎ Remote engineers lack hallway context. Share the "why" behind decisions, not just the "what." Context enables better autonomous decisions. | These are general notes, not lessons from a team I've worked on. ⏎ ## Write it down ⏎ A written proposal can be read whenever someone comes online. A meeting can't. Meetings are worth keeping for decisions that need a back-and-forth. ⏎ ## Say why ⏎ A teammate who wasn't there needs the reason for a decision as well as the decision itself. |

## Text in page and component files

| file | what | before | after |
|---|---|---|---|
| `src/app/[locale]/layout.tsx` | page titles (default, template, Open Graph) | Charles Ndirangu — Software Engineer / %s — Charles Ndirangu | Charles Ndirangu \| Software Engineer / %s \| Charles Ndirangu |
| `src/app/[locale]/page.tsx` | home page title | Charles Ndirangu — Software Engineer | Charles Ndirangu \| Software Engineer |
| `src/app/[locale]/opengraph-image.tsx` | role and location on the share card | Software Engineer — Nairobi, Kenya | Software Engineer, Nairobi, Kenya |
| `src/app/[locale]/opengraph-image.tsx` | share card alt text | Charles Ndirangu | Charles Ndirangu, Software Engineer |
| `src/app/global-error.tsx` | fallback line when the site fails to load | An unexpected error occurred. | Reload the page to try again. |
