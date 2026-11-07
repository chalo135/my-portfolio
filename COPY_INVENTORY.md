# Copy inventory

Baseline commit: `5164ca5`. Audited by six copy-auditor agents (groups A to F)
against `.claude/copy-voice.md`. English only; Kiswahili follows in Phase 5.

## Counts

| Group | Files | Keep | Rewrite |
|---|---|---|---|
| A: home and site-wide | site.en.ts, pages.en.ts, Hero, HomeContent, Footer, Navigation, StatusStrip, ThemeToggle, LocaleToggle, BackToTop, [locale]/page.tsx, [locale]/layout.tsx, contact/page.tsx | 78 | 38 |
| B: projects | projects.en.ts, projects/page.tsx, projects/[slug]/page.tsx | 20 | 3 |
| C: about, experience, résumé | about-report.en.ts, about.en.ts, experience.en.ts, about/experience/resume pages, components/about/* | 87 | 39 |
| D: philosophy, capabilities, technologies | philosophy.en.ts, capabilities.en.ts, technologies.en.ts, their three pages | 30 | 77 |
| E: writing | writing.en.ts, writing pages | 4 | 51 |
| F: leftovers | opengraph-image.tsx, global-error.tsx, root not-found.tsx, [locale]/error.tsx, [locale]/not-found.tsx, sitemap, robots, components/ui | 5 | 2 |
| **Total** | | **224** | **210** |

`pages.en.ts` holds the hero and metadata for every page, so it can't be split
by page. It sits in group A.

## Decisions every writer follows

These resolve conflicts the audit found. They override an auditor's verdict.

1. **Truth beats entry counts.** The brief says don't change the number of
   entries. Where keeping a list item would mean inventing something (a fake
   job highlight, a capability area with no evidence), the item is replaced
   with something true from the facts or projects. If nothing true is left,
   the item is cut, and the writer reports it. Never fill a slot with a guess.
2. **Experience gets the three real roles, in this order.** exp-1 is freelance
   software developer (April 2025 to now). exp-2 is operations in the family
   business (May 2023 to now). exp-3 is the network support attachment at
   Fiberlink. Fiberlink has no dates in the facts, so its period says only what
   is known. Highlights come only from the facts, the projects, and lines
   already on the site (for example "Plumbing and bio-digesters, about 12 large
   clients", which is already in the About report).
3. **Already-on-site facts stay.** The KCSE grade, the KCSE maths ranking and
   "about 12 large clients" were given by Charles for the About report. They
   are kept, not cut.
4. **`about.en.ts` is not rendered anywhere.** It is not rewritten. Deleting it
   is listed under outside scope.
5. **ERP.** The old copy says "multi-tenant ERP", and Charles's own style
   example says he builds "ERPs", but no ERP project is on the site. A writer
   may say he builds ERP software in one plain word. Never "multi-tenant ERP
   for small and mid-sized businesses", never "mid-sized".
6. **Decorative marks in JSX.** The `—` bullets (projects detail, experience,
   résumé) are decoration, not copy, and stay. Em dashes in text a visitor
   reads (page titles, the OG card, copy strings) go.
7. **The About profile rows Age, Sex, Height and Weight** have no value, so the
   page already doesn't render them. Nothing to do.

---

## Group A: home and site-wide

**Rewrite (38)**

| file | key or line | current text | rules broken |
|---|---|---|---|
| site.en.ts | site.tagline | I build the software Kenyan businesses run on. | Overclaims scale (one live shop, one POS in progress, one university project); doesn't say what he builds |
| site.en.ts | site.description | Full-stack engineer in Nairobi. I build multi-tenant ERP for small and mid-sized Kenyan businesses, M-Pesa Daraja payment integrations, and point-of-sale systems with real double-entry accounting underneath. | No ERP project; "mid-sized" unsupported; list of three; "systems" overclaims one POS |
| site.en.ts | meta.keywords | Software Engineer, Full-Stack Developer, System Design, Cloud Infrastructure, AI Engineering, Nairobi, Kenya, M-Pesa Daraja, ERP, Charles Ndirangu | System Design, Cloud Infrastructure, AI Engineering, ERP unbacked; misses POS, Power BI, Linux VPS |
| site.en.ts | hero.eyebrow | Full-stack engineer — Nairobi, Kenya | Em dash |
| site.en.ts | hero.headline | I build the software Kenyan businesses run on. | Same as tagline |
| site.en.ts | hero.subhead | Multi-tenant ERP for small and mid-sized businesses, M-Pesa Daraja payments, and a point of sale with double-entry accounting underneath it. Currently in Nairobi, open to remote. | ERP/mid-sized unsupported; list of three; misses "available now"; doesn't say what's live vs in progress |
| site.en.ts | homeTeasers.philosophy.lead | Business software fails on the boring parts — a refund that never reconciles, a tenant that can read another tenant's invoices. That is where I spend my time. | Em dash; examples not tied to real work (real: Pharimz order IDOR, Salio PostJournal) |
| site.en.ts | homeTeasers.work.lead | Systems I have designed and shipped. | Swap test; Salio isn't shipped |
| site.en.ts | homeTeasers.capabilities.lead | TypeScript and Next.js on the front, Postgres and Supabase behind it… closing IDOR holes and writing row-level security policies on a live e-commerce platform. | List of three; Salio's accounting is C#/.NET; "IDOR holes" plural overstates; "platform" inflates one shop |
| site.en.ts | homeTeasers.contact.headline | Tell me what you are trying to build. | Swap test; speaks to clients only, not recruiters |
| site.en.ts | homeTeasers.contact.lead | Open to full-time roles and to contract work on payments, ERP, and anything that has to reconcile at the end of the month. Nairobi, or remote. | List of three; ERP; misses "available now" and onsite IT roles |
| pages.en.ts | meta.about.description | I'm Charles Ndirangu. I work across the stack, mostly on the systems small and mid-sized Kenyan businesses actually run their day on. | mid-sized; swap test; overclaim |
| pages.en.ts | meta.capabilities.description | Enterprise engineering capabilities across the full software stack. | "Enterprise" unsupported; swap test |
| pages.en.ts | meta.contact.description | Get in touch about payments, ERP, and full-stack engineering work. | List of three; ERP; no "available now" |
| pages.en.ts | meta.experience.description | Professional experience building enterprise software systems. | "enterprise" unsupported |
| pages.en.ts | meta.philosophy.description | The principles that guide every system I build. | Swap test |
| pages.en.ts | meta.projects.description | Enterprise software products engineered with precision and craftsmanship. | Enterprise; craft family |
| pages.en.ts | meta.resume.description | Professional resume and qualifications. | Swap test |
| pages.en.ts | meta.technologies.description | The tools and technologies used to build enterprise-grade software. | enterprise-grade |
| pages.en.ts | meta.writing.description | Thoughts on software engineering, architecture, AI, and building products. | Generic list |
| pages.en.ts | projects.hero.title | Products engineered to endure. | Slogan; swap test |
| pages.en.ts | projects.hero.description | Every project is treated as a product launch—designed, architected, and delivered with enterprise-grade standards. | Em dash; list of three; enterprise-grade |
| pages.en.ts | writing.hero.title | Engineering insights. | Swap test |
| pages.en.ts | writing.hero.description | Exploring the craft of software engineering—architecture, performance, security, AI integration, and building products that matter. | Em dash; craft; list; -ing opener |
| pages.en.ts | capabilities.hero.title | Engineering across the entire stack. | Swap test; not modest |
| pages.en.ts | capabilities.hero.description | Deep expertise spanning frontend, backend, cloud, AI, security, and system design—delivered with enterprise standards. | Em dash; "deep expertise" overclaims; enterprise |
| pages.en.ts | technologies.hero.title | Tools chosen with intention. | Slogan |
| pages.en.ts | technologies.hero.description | Technology is a means, not an end. Every tool in this stack is selected for reliability, performance, and long-term maintainability. | "Not X"; list of three; no example |
| pages.en.ts | experience.hero.title | A track record of delivery. | Swap test; overclaims |
| pages.en.ts | experience.hero.description | Building software systems across enterprise, startup, and government contexts—with consistent focus on quality and impact. | Fabricated; list of three; em dash |
| pages.en.ts | resume.hero.description | Software Engineer specializing in enterprise-grade systems, full-stack development, and intelligent software architecture. | enterprise-grade; meaningless; list of three |
| pages.en.ts | contact.title | Let's build software that matters. | Banned pattern variant |
| pages.en.ts | contact.lead | Open to enterprise engagements, remote positions, and ambitious product collaborations. | List of three; doesn't match facts; no "available now" |
| pages.en.ts | contact.ctaLabel | Start a Conversation | Salesy; Title Case |
| [locale]/page.tsx | L18 title | `${site.name} — ${site.role}` | Em dash in page title |
| [locale]/layout.tsx | L56 title.default | `${site.name} — ${site.role}` | Em dash |
| [locale]/layout.tsx | L57 title.template | `%s — ${site.name}` | Em dash in every page title |
| [locale]/layout.tsx | L64 openGraph.title | `${site.name} — ${site.role}` | Em dash |

**Keep (78):** site name, role, location, ethos, email; every `ui.*` label; nav,
footer and social labels; hero.ctaLabel; every teaser label and ctaLabel; every
page `meta.*.title`; projectNotFound, articleNotFound; projects backToWork,
groups, sections, stageOf, stageDone, stageCurrent, liveLink, repoLink,
walkthrough, walkthroughLink, walkthroughSubject; every hero `label`;
resume.hero.title and the three résumé headings; about.whatIWorkOn,
about.getInTouch; contact.label; notFound.*; error.*; ThemeToggle labels;
StatusStrip "©2026" and "EAT, Nairobi KE"; Footer "© {year} {site.name}".
Notes: "Résumé" (nav) vs "Resume" (pages) spelling differs; projectNotFound
and articleNotFound are Title Case.

---

## Group B: projects

| file | key or line | current text | rules broken | keep/rewrite |
|---|---|---|---|---|
| src/content/projects.en.ts | statusLabels.building / live / client / finished | Building now / Live / Client project / Finished | none | keep |
| src/content/projects.en.ts | [0].oneLiner | A point-of-sale system for Kenyan shops with real double-entry accounting underneath. | none | keep |
| src/content/projects.en.ts | [0].problem | Small shops run a till and a separate set of books, and the two drift apart. Month-end reconciliation is where the errors and the hours go. | none | keep |
| src/content/projects.en.ts | [0].context | Shaped around a family spare-parts shop, for owners who aren't accountants. | Passive; his part ("I built it…") is missing | rewrite |
| src/content/projects.en.ts | [0].built[0] | Every sale is one database transaction that writes the receipt, the stock movement and a balanced journal entry together. There is no sync, because there is only one set of books. | none (three real writes) | keep |
| src/content/projects.en.ts | [0].built[1] | Money is stored in whole cents, never as floating-point numbers. | none | keep |
| src/content/projects.en.ts | [0].built[2] | Stock movements are append-only, and reports are calculated when they're read, never stored. | none | keep |
| src/content/projects.en.ts | [0].built[3] | Every table is scoped to a business, so one install can serve many shops. | none | keep |
| src/content/projects.en.ts | [0].hardPart.title | One door into the ledger | none | keep |
| src/content/projects.en.ts | [0].hardPart.body | Only one function, PostJournal, is allowed to write journal lines… covered it with unit tests. | none | keep |
| src/content/projects.en.ts | [1].oneLiner | An online shop for a Kenyan streetwear and branding business — hoodies, football jerseys and design services. | Em dash; tacked-on list of three; his part missing | rewrite |
| src/content/projects.en.ts | [1].problem | The business needed to take orders and payment online in shillings, including M-Pesa, which is how most customers pay. | none | keep |
| src/content/projects.en.ts | [1].built[0] | Storefront, accounts and checkout with M-Pesa STK Push, PayPal and card payments, priced in KES. | Borderline: two lists of three, no first person; true and specific | keep |
| src/content/projects.en.ts | [1].hardPart.title | Locking it down after launch | none | keep |
| src/content/projects.en.ts | [1].hardPart.body | I closed a hole where changing an ID in a request could expose another customer's order, verified M-Pesa payment callbacks… and tightened Supabase row-level security. | Borderline list of three; "tightened" vague | keep |
| src/content/projects.en.ts | [1].context | (not present) | His part missing | outside scope (adding a key) |
| src/content/projects.en.ts | [2].oneLiner | Coffee leaf disease detection for Kenyan smallholder farmers. | Overstates: the model flags coffee leaf rust only | rewrite |
| src/content/projects.en.ts | [2].problem | Coffee leaf rust spreads fast, and a smallholder often can't get an expert to look at a leaf in time. | none | keep |
| src/content/projects.en.ts | [2].context | Built as my university demonstration project. | none | keep |
| src/content/projects.en.ts | [2].built[0] | A TensorFlow model that flags coffee leaf rust from a photo of a leaf. | none | keep |
| src/content/projects.en.ts | [2].built[1] | A chatbot that answers follow-up questions, grounded in a retrieval (RAG) pipeline. | none | keep |
| src/content/projects.en.ts | [2].hardPart | (not present) | No hard problem for this project | outside scope (adding a key, and no fact to fill it) |
| src/app/[locale]/projects/page.tsx | all | no literal user-facing strings | n/a | no copy |
| src/app/[locale]/projects/[slug]/page.tsx | L153 | — (aria-hidden bullet marker) | Decorative em dash glyph; not copy | outside scope (markup) |

---

## Group C: about, experience, résumé

**Rewrite (39)**

| file | key or line | current text | rules broken |
|---|---|---|---|
| about-report.en.ts | introOpening | I'm Charles Ndirangu, Chalo to most people. I'm a software engineer in Nairobi, and I build the point-of-sale, M-Pesa and accounting software Kenyan businesses run on. | Overclaims ("businesses run on"); list of three |
| about-report.en.ts | kinds.salio | Product | Vague; "Point of sale" says what it is |
| about-report.en.ts | timeline[4].lane | Customer service support certificate | Facts: "Customer service certificate, Griffin Global Bootcamp, September 2026" |
| about-report.en.ts | timeline[5] | ALX Data and AI Literacy (expected, 2026-11-30) | Facts: finished in 2026 (a data change, not words: see the report) |
| about-report.en.ts | profile Degree | BSc Computer Technology, Multimedia University of Kenya | Leaves out the 2026 graduation |
| about.en.ts | headline, intro, story[0..2], facts[0..2] (8) | (unrendered) A Passionate Software Developer/Data Analyst … | Not rendered anywhere; banned words, typos, claims not in facts. Not rewritten (decision 4) |
| experience.en.ts | exp-1.* (7) | Senior Software Engineer / [Your Organization] / 2024 — Present / Leading development of enterprise-grade software solutions… / Architected and delivered production systems serving thousands of users / … | Invented title, placeholder org, invented numbers, em dash, solutions |
| experience.en.ts | exp-2.* (7) | Full-Stack Engineer / [Previous Organization] / 2022 — 2024 / … GraphQL APIs … reducing deployment time significantly | Invented role and years, placeholder, em dash, unbacked claims |
| experience.en.ts | exp-3.* (7) | Software Developer / [Earlier Organization] / 2020 — 2022 / … Participated in agile development processes | Invented role and years, placeholder, em dash, corporate filler |
| experience/page.tsx, resume/page.tsx | L59, L65 | — bullets | Decorative (decision 6) |

The auditor also flagged "about 12 large clients", the KCSE grade, the KCSE
maths ranking and the empty profile rows; decisions 3 and 7 keep them.

**Keep (87):** introReport and the .pbix clause; kinds pharimz and
kahawa-smart; area labels; every other timeline lane and sub; profile Name,
Goes by, Based in; all 8 measure notes; all 9 step captions; every `ui.*`
string (tabs, KPI labels, report labels, model notes, figure caption and alt);
the About page, AboutReport and the other report components (no hard-coded
copy).

---

## Group D: philosophy, capabilities, technologies

### philosophy.en.ts

| key | current text | rules broken / real example | keep/rewrite |
|---|---|---|---|
| intro.headline | Engineering Philosophy | label | keep |
| intro.subheadline | The principles that guide every system I build. | Swap test; says what he values, not what he builds | rewrite |
| intro.description | Software engineering is more than writing code—it is the disciplined art of solving complex problems with elegant, durable solutions. These principles define how I approach every project, from initial architecture to final deployment. | Em dash; "more than X, it is Y"; elegant; solutions; "from X to Y"; swap test | rewrite |
| quality.title | Quality | Example: Salio PostJournal + unit tests | keep |
| quality.headline | Excellence is non-negotiable. | Slogan; swap test | rewrite |
| quality.description | Every line of code, every interaction, every architectural decision reflects a commitment… Quality is not a phase—it is the foundation. | List of three; em dash; "not X, it is Y"; closing one-liner; cliché; real example unused | rewrite |
| craftsmanship.title / headline / description | Craftsmanship / Software is a craft. / Like any master craft… discipline of an artisan… | "craft"; list of three; overblown; no example separate from Quality | rewrite ×3 (candidate to merge or cut) |
| scalability.title | Scalability | Example: Salio tables scoped per business | keep |
| scalability.headline | Built to grow. | Swap test | rewrite |
| scalability.description | Systems must evolve… scale horizontally—in users, data, and complexity—without requiring complete rewrites. | Two em dashes; list of three; "scale horizontally" unbacked; real example unused | rewrite |
| user-centered.title | User-Centered Design | Example: Salio for non-accountants; M-Pesa at Pharimz | keep |
| user-centered.headline | Technology serves people. | Slogan | rewrite |
| user-centered.description | The most elegant architecture means nothing… clarity, accessibility, and intuitive design… | elegant; list of three; accessibility unbacked | rewrite |
| performance.title / headline / description | Performance / Speed is a feature. / …I optimize at every layer—from database queries to render cycles—to deliver experiences that feel instantaneous. | Em dashes; "from X to Y"; overclaim; no real example | rewrite ×3 (candidate to cut) |
| security.title | Security | Example: Pharimz ID-swap fix, M-Pesa callbacks, Supabase RLS | keep |
| security.headline | Trust by design. | Slogan | rewrite |
| security.description | Security is woven into architecture from day one, not bolted on before launch… protect data, preserve privacy, and withstand evolving threats. | "Not X" contrast; list of three; contradicted by Pharimz (fixed after launch) | rewrite |
| maintainability.title | Maintainability | Example: Salio PostJournal, append-only stock, reports on read | keep |
| maintainability.headline | Code for the next engineer. | Human; acceptable if description gets specific | keep |
| maintainability.description | Readable, well-documented, and thoughtfully structured code… clarity, not confusion. | List of three; closing one-liner; "well-documented" unbacked | rewrite |
| innovation.title / headline / description | Innovation / Progress with purpose. / Innovation is not novelty… or unlock capabilities that were previously impossible. | Banned family (innovative, unlock); "X is not Y"; list of three; overclaim; Kahawa example unused | rewrite ×3 |

### capabilities.en.ts (9 capabilities × title, description, 6 areas)

Keep (16): frontend.title, areas "React & Next.js", "TypeScript"; backend.title, "Node.js", "Authentication"; cloud "CI/CD Pipelines"; ai.title, "LLM Integration", "RAG Systems"; security "Application Security"; databases.title, "PostgreSQL", "Data Modeling", "Migrations"; ui-engineering "Responsive Design".

Rewrite (56):
- Every description: frontend (Crafting… meticulous), backend (robust; list of three), cloud (IaC/scalable cloud unbacked), ai ("production systems", "measurable outcomes" unbacked), security (encryption/compliance unbacked), system-design (distributed at scale unbacked), databases (list of three; Salio specifics unused), performance (no example), ui-engineering (pixel-perfect; overstated). All start with an -ing word.
- Titles: cloud ("Cloud Infrastructure" overstates a self-run VPS), security ("Cybersecurity" overstated), system-design (no example: candidate to cut), performance (no example: candidate to cut), ui-engineering (thin; candidate to merge into Frontend).
- Areas with no evidence in facts or projects: State Management, Design Systems, Accessibility, Performance Optimization; REST & GraphQL APIs (GraphQL), Microservices, Business Logic (vague), Integration Patterns (vague); AWS & Azure, Docker & Kubernetes (Kubernetes), Serverless, Infrastructure as Code, Monitoring; AI Agents, Prompt Engineering, ML Pipelines, AI Safety; Encryption, OAuth & WebAuthn, Security Audits, Compliance, Threat Modeling; Distributed Systems, Event-Driven Architecture, Database Design (duplicate), Caching Strategies, Load Balancing, Fault Tolerance; MongoDB, Redis, Query Optimization; all six performance areas; Component Libraries, Animation Systems, Three.js & WebGL, Typography, Micro-interactions.

### technologies.en.ts

| key | current text | rules broken | keep/rewrite |
|---|---|---|---|
| [0..3],[5..7].name | Languages, Frontend, Backend, Data, AI & ML, Security, Tools | plain labels | keep ×7 |
| [4].name | Cloud & DevOps | "Cloud" overstates a self-run Linux VPS | rewrite |

### Page files

philosophy/page.tsx, capabilities/page.tsx, technologies/page.tsx: no hard-coded copy.

---

## Group E: writing

**All five posts read as generic articles. None is personal**: none mentions a single thing Charles built, fixed or learned.

- `building-scalable-systems`: generic. Claims experience not in the facts ("After building and maintaining production systems at scale"; microservices, circuit breakers, distributed tracing).
- `ai-integration-patterns`: generic. Leans on production LLM work he hasn't done; fine-tuning and batching appear nowhere. His only related work (Kahawa Smart's RAG chatbot, a university demo) isn't mentioned.
- `security-first-architecture`: generic. No false claim, but ignores his real story: the Pharimz ID-swap order leak, M-Pesa callback verification and Supabase row-level security. "Zero trust" and "encryption everywhere" are unbacked.
- `nextjs-performance-guide`: generic. No project in projects.en.ts uses Next.js (only this site does).
- `remote-engineering-excellence`: generic. Implies remote/distributed-team experience he doesn't have (he's open to remote jobs).
- Post dates (May–Nov 2025) present these as articles he wrote then, which the content doesn't support. Read times (6–10 min) overstate bodies of ~100 words.

| file | key or line | current text | rules broken | keep/rewrite |
|---|---|---|---|---|
| writing.en.ts | building-scalable-systems.title | Building Scalable Systems: Lessons from Production | Colon subtitle; implies production-at-scale experience not in facts | rewrite |
| writing.en.ts | .excerpt | Architectural patterns and practical strategies for designing systems that grow with your organization. | True of any developer; no specifics | rewrite |
| writing.en.ts | .category | System Design | plain label | keep |
| writing.en.ts | .content intro | Scalability is not a feature you add—it is a property you design into your system from the beginning. After building and maintaining production systems at scale… | Em dash; "not X, it's Y"; unbacked experience claim | rewrite |
| writing.en.ts | .content ## Start with Boundaries / paragraph | Clear service boundaries prevent the monolith trap… | Generic; no first-hand detail | rewrite |
| writing.en.ts | .content ## Design for Failure / paragraph | Every external dependency will fail. Circuit breakers, retries… are not optional—they are foundational. | Em dash; "not X, they are Y"; list of three; unbacked | rewrite |
| writing.en.ts | .content ## Measure Everything / paragraph | You cannot optimize what you cannot measure… structured logging, distributed tracing, and meaningful metrics dashboards. | Stock aphorism; list of three; unbacked | rewrite |
| writing.en.ts | ai-integration-patterns.title | AI Integration Patterns for Production Applications | Implies production AI experience | rewrite |
| writing.en.ts | .excerpt | How to integrate large language models into production systems responsibly and effectively. | Empty adverbs; generic | rewrite |
| writing.en.ts | .category | AI | plain label | keep |
| writing.en.ts | .content intro | Integrating AI into production applications requires more than calling an API. It demands thoughtful architecture around reliability, cost management, and user trust. | "Not just X"; list of three; generic | rewrite |
| writing.en.ts | .content ## RAG vs Fine-Tuning / paragraph | Retrieval-Augmented Generation offers flexibility and transparency… Most production systems benefit from RAG… | Generic; unbacked generalization; Kahawa RAG not used | rewrite |
| writing.en.ts | .content ## Guardrails Matter / paragraph | Implement input validation, output filtering, and fallback behaviors… raw model failures—they should experience graceful degradation. | Em dash; list of three; generic | rewrite |
| writing.en.ts | .content ## Cost Awareness / paragraph | Token usage scales with users. Cache responses, batch requests, and use smaller models… | List of three; unbacked practices | rewrite |
| writing.en.ts | security-first-architecture.title | Security-First Architecture for Modern Applications | Filler; generic | rewrite |
| writing.en.ts | .excerpt | Embedding security into your architecture rather than treating it as a final checklist item. | "Not X but Y"; generic | rewrite |
| writing.en.ts | .category | Cybersecurity | plain label | keep |
| writing.en.ts | .content intro | Security cannot be bolted onto an application before launch. It must be woven into every architectural decision from day one. | "Woven into every layer" cliché; contradicts his real Pharimz post-launch fix | rewrite |
| writing.en.ts | .content ## Authentication vs Authorization / paragraph | Authentication verifies identity. Authorization determines access… | Generic; misses the Pharimz example | rewrite |
| writing.en.ts | .content ## Zero Trust Principles / paragraph | Never trust, always verify. Every request—internal or external—should be authenticated… | Two em dashes; slogan; generic | rewrite |
| writing.en.ts | .content ## Encryption Everywhere / paragraph | Data at rest, data in transit, and data in use (where feasible)… | List of three; generic | rewrite |
| writing.en.ts | nextjs-performance-guide.title | Next.js Performance: A Practical Engineering Guide | Colon subtitle; generic | rewrite |
| writing.en.ts | .excerpt | Concrete techniques for achieving exceptional performance in Next.js applications. | Puffery; generic | rewrite |
| writing.en.ts | .category | Next.js | plain label | keep |
| writing.en.ts | .content intro | Performance is a competitive advantage… rendering strategy, bundle size, and runtime behavior. | Business-speak; list of three | rewrite |
| writing.en.ts | .content ## Choose Your Rendering Wisely / paragraph | Static generation for content that rarely changes… deliver the best results. | List of three; near "drive results"; generic | rewrite |
| writing.en.ts | .content ## Bundle Analysis / paragraph | Regularly audit your bundle with @next/bundle-analyzer… | Generic; no first-hand result | rewrite |
| writing.en.ts | .content ## Image Optimization / paragraph | Use next/image with proper sizing, modern formats, and priority loading… | List of three; closing one-liner | rewrite |
| writing.en.ts | remote-engineering-excellence.title | Remote Engineering Excellence | Puffery; implies remote-team experience | rewrite |
| writing.en.ts | .excerpt | Building high-performing engineering practices in distributed teams. | Buzzwords; unbacked | rewrite |
| writing.en.ts | .category | Remote Engineering | Implies unbacked practice | rewrite |
| writing.en.ts | .content intro | Remote engineering demands intentional communication, async-first workflows, and documentation culture… | List of three; buzzwords | rewrite |
| writing.en.ts | .content ## Async by Default / paragraph | Not every conversation needs a meeting… | List of three; generic | rewrite |
| writing.en.ts | .content ## Documentation as Infrastructure / paragraph | If it is not documented, it does not exist for remote team members… | Slogan; generic | rewrite |
| writing.en.ts | .content ## Over-Communicate Context / paragraph | Remote engineers lack hallway context. Share the "why"… not just the "what." | "Not just X"; closing one-liner | rewrite |
| writing.en.ts | readTime ×5 | 8 min / 10 min / 7 min / 9 min / 6 min | Overstates ~100-word bodies | rewrite |
| writing/page.tsx, writing/[slug]/page.tsx | n/a | no English literals (from pages.en.ts or post fields) | n/a | no copy |

---

## Group F: leftovers

| file | key or line | current text | rules broken | keep/rewrite |
|---|---|---|---|---|
| src/app/[locale]/opengraph-image.tsx | L67 | `{site.role} — {site.location}` (only the separator " — " is literal) | Em dash in rendered OG card text | rewrite |
| src/app/[locale]/opengraph-image.tsx | L36 alt, L72, L85 | `site.name`, `site.tagline` (from site.en.ts, group A) | n/a | other group |
| src/app/global-error.tsx | L38 h1 | The site failed to load. | none | keep |
| src/app/global-error.tsx | L41 fallback | An unexpected error occurred. | Generic boilerplate, true of any site; says nothing about what to do next | rewrite |
| src/app/global-error.tsx | L56 button | Reload | none | keep |
| src/app/not-found.tsx | L37 | 404 | none | keep |
| src/app/not-found.tsx | L38–41 | copy.title / body / back (pages.en.ts, group A) | n/a | other group |
| src/app/[locale]/error.tsx | whole file | no literal user-facing text (copy from pages.en.ts) | n/a | no copy |
| src/app/[locale]/not-found.tsx | L17 | 404 | none | keep |
| src/app/[locale]/not-found.tsx | L18–24 | copy.title / body / back (pages.en.ts, group A) | n/a | other group |
| src/app/sitemap.ts, src/app/robots.ts | whole files | no user-facing text | n/a | no copy |
| src/components/ui/AmbientVideo.tsx | L110 alt | "" (decorative background) | none, empty alt is correct | keep |
| src/components/ui/*.tsx (others) | n/a | no alt or sentence-style aria-label text | n/a | no copy |

Note from auditor: global-error shows `error.message` first, so raw developer error text can reach visitors (a structure/behaviour issue, outside a words-only scope).
