# Izanami-Inspired Redesign — Implementation Brief for Claude Code

> Paste this whole file into Claude Code from inside the project, or just say:
> **"Read `IZANAMI_REDESIGN_PROMPT.md` and execute it. Start with the pruning step, work on a branch, and check in with me after each phase."**

---

## 1. Mission (the short version)

Redesign my existing Next.js portfolio into a **serene, editorial, minimalist** experience inspired by the *interaction and layout language* of **izanami-official.com** — vast negative space, huge light-weight typography, slow soft scroll reveals, and a single restrained accent.

Two hard constraints on the aesthetic:

- **Keep my dark palette.** Do the Izanami calm-minimalism *in* my existing navy + cyan tokens, not in Izanami's warm light palette. Dark is the "paper."
- **Go minimalist.** Strip out the maximalist "engineering OS" features (terminal, 3D particle field, command palette, boot sequence, glass widgets). The wow comes from restraint, typography, space, and quiet motion — not from gadgets.

Reproduce the *feeling* — calm, refined, intentional, expensive — **not** Izanami's copy, images, logo, or brand. This is inspired-by, never a clone. Write original copy in my voice.

---

## 2. Repo you're working in

This is a real, existing project. Respect what's there.

- **Framework:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3.4.
- **Motion/graphics installed:** GSAP + `@gsap/react`, `framer-motion`, `lenis` (smooth scroll), `three` + `@react-three/fiber` + `drei` (to be removed from the render tree), `lucide-react`, `openai`.
- **Content = single source of truth:** everything lives in `src/content/*.ts` — `projects.ts`, `capabilities.ts`, `experience.ts`, `technologies.ts`, `philosophy.ts`, `writing.ts`. Render *from these*; never hardcode copy inside components. If a section needs new fields, extend the interface in the content file.
- **Design tokens already exist** in `tailwind.config.ts` and `src/app/globals.css`. Keep and refine them — do not rip them out:
  - Colors: `navy` (`#0a0f1a` / deep `#050608` / soft `#111827`), `charcoal` (`#141820` / light `#1c2333`), `cream` (`#f5f5f7` / muted `#a1a1aa` / dim `#71717a`), `accent` cyan (`#22d3ee` / dim `#0891b2` / glow).
  - Fonts (loaded in `layout.tsx` via next/font): `Syne` → `font-display`, `Instrument Sans` → `font-sans`, `JetBrains Mono` → `font-mono`.
  - Type scale: `display-xl`, `display-lg`, `display-md`, `editorial`. Spacing: `section`, `section-sm`. Easings: `ease-cinematic` `cubic-bezier(0.16,1,0.3,1)`, `ease-luxury`. Utilities: `.editorial-grid`, `.mask-reveal`, `.line-accent`, `.glass-nav`, `.glass-panel`, `fade-up` animation. There's a `useReducedMotion` hook and a `[data-theme='light']` token set already.
- **Routes present:** `app/page.tsx` (home), `philosophy/`, `projects/` (+ `[slug]/`), `capabilities/`, `experience/`, `technologies/`, `writing/` (+ `[slug]/`), `resume/`, `contact/`, plus `api/chat` and `api/github`.
- **Identity:** Charles Ndirangu — software engineer (full-stack, cloud, AI, security, system design). Metadata currently reads "Elite Software Engineering."

**Note:** several content entries are still placeholders (`[Your Organization]`, generic "Enterprise Platform" / "FinTech Analytics" projects). Flag these and leave clearly-marked `TODO:` notes where I need to drop in real details; don't invent fake specifics.

---

## 3. Design north star — translating Izanami into my dark theme

Izanami's power is **Ma (間)** — intentional negative space. Nothing is crowded; every element gets room to breathe; motion is slow and meditative; one idea per screen. Translate that into dark:

**Palette usage (restraint is the whole point)**
- `navy-deep #050608` is the canvas. Layer `navy` / `charcoal` only for subtle depth (a panel, a hovered row) — never hard cards with borders everywhere.
- `cream` for primary text, `cream-muted` for secondary/body, `cream-dim` for micro-labels.
- **Cyan accent is used sparingly** — a single hairline, one link-hover, the active section index, one CTA. No neon glow spam, no accent on everything. On dark, one quiet cyan line reads as luxury; ten read as a gamer UI.
- Dark negative space *is* the whitespace. Let sections be mostly empty.

**Typography**
- Headlines: `Syne` at large sizes (`text-display-xl` / `display-lg`), **light/normal weight**, tight tracking, `text-balance`. Big and calm, not loud.
- Micro-labels & section indices: `JetBrains Mono`, uppercase, wide letter-spacing (~`0.25em`), `cream-dim`. e.g. `01 — PHILOSOPHY`, `SELECTED WORK`, `2025`.
- Body: `Instrument Sans`, line-height ~1.7, measure capped ~60–65ch, `cream-muted`.
- **Optional, tasteful Japanese motif (opt-in, ask me first):** a single large faint kanji as a background watermark per major section (e.g. 和 harmony, 匠 craft) at very low opacity. Keep it rare and respectful, or skip entirely and use numeric indices only. It's a seasoning, not the theme.

**Layout & rhythm**
- Use the 12-col `.editorial-grid` with asymmetric placement and wide outer margins. Mix a centered hero with left-aligned editorial sections.
- Generous vertical rhythm via the `section` spacing token (clamp 6–12rem). When in doubt, add space.
- Hairline dividers (`.line-accent` / 1px `cream` at low opacity) instead of boxed cards.

**Motion (quiet, meditative — the Izanami signature)**
- Keep **Lenis** smooth scroll; tune it gentle (lerp ~0.08–0.1).
- **GSAP ScrollTrigger reveals:** fade-up + `.mask-reveal` (clip-path wipe) on headings and blocks. Slow (0.9–1.4s), `ease-cinematic`, small stagger (0.06–0.12s). Elements enter once, softly, and stay.
- **One hero motif** replacing the Three.js particle field: a slow-drifting soft mist/gradient (CSS radial-gradient blobs or a lightweight `<canvas>`/SVG), very subtle parallax on scroll. No WebGL on initial load.
- Hover: links draw a slow underline + shift to cyan; images get a gentle `scale(1.02)` + slight brightness. Nothing snappy.
- A minimal `scroll ↓` cue at the bottom of the hero.
- **Honor `prefers-reduced-motion`** via the existing `useReducedMotion` hook: drop transforms/parallax, keep opacity-only fades.

---

## 4. What to REMOVE (commit to minimalism)

Take these out of the render tree (delete the components, or keep files but stop importing — your call, keep the build green). Remove the whole "OS / boot / dashboard" concept:

- `components/BootSequence.tsx`, `components/OsMain.tsx`, `components/Dashboard.tsx`
- `components/terminal/*`, `components/three/*`, `components/experience/CinematicEnvironment.tsx`, `EasterEggs.tsx`, `LoadingSequence.tsx`
- `components/ui/CommandPalette.tsx`, `components/ui/SoundToggle.tsx`
- `components/widgets/*` (Spotify, GitHub, LiveClock, ActivityFeed, TechStack, AIAssistant)
- `components/ui/LuxuryCursor.tsx` — **optional**: keep only if you reduce it to a single subtle dot/ring that fits the calm mood; otherwise remove.
- Simplify `providers/ExperienceProvider.tsx` down to: Lenis init + reduced-motion + (optional) theme. Drop sound/boot/experience-mode state.
- You may leave `three`/`openai` in `package.json`; just don't ship them on the critical path. If `api/chat` + `api/github` become unused, note them for removal — don't delete without asking.

---

## 5. Page-by-page spec

### Global — Navigation & Footer
- **Nav:** fixed, transparent over the hero, easing into a subtle `.glass-nav` on scroll. Left: wordmark `Charles Ndirangu` (or a `CN` monogram). Right: a few links (`Work`, `Philosophy`, `About`, `Writing`, `Contact`) in mono micro-caps with a slow underline hover. On mobile, a calm full-screen overlay menu that fades in — **no** command palette.
- **Footer:** quiet. Name, a one-line ethos, email as a large link, socials (GitHub / LinkedIn / X), and a "back to top." Lots of padding.

### Home (`app/page.tsx`)
- **Hero, full viewport, editorial:** a mono eyebrow (e.g. `SOFTWARE ENGINEER — NAIROBI`), then a large `Syne` headline that is **my own tagline** (see §8 — do **not** reuse Izanami's "Remember who you are"), a muted one-line subhead, and one restrained CTA (`View work →`). Soft mist motif behind, `scroll ↓` cue below.
- **Then teaser sections**, each revealed slowly on scroll: Philosophy intro line → Selected Work (2–3 `featured` projects) → a Capabilities strip → a closing Contact CTA. Keep each short; the full content lives on the dedicated pages.

### Philosophy (`app/philosophy/`) — make this the centerpiece
My philosophy content is strong and it maps perfectly to Izanami's contemplative core. Use `philosophyIntro` + `philosophyPillars`. Present as a calm manifesto: a big opening statement, then each pillar as a large **numbered editorial block** (mono index, `Syne` headline, body description) with generous space and a slow reveal. Optional kanji watermark here.

### Work (`app/projects/` + `[slug]/`)
- **Index:** projects as large editorial rows — mono number + year/category, `Syne` title, tagline. Hairline dividers. Hover reveals the cyan index and a subtle shift. Click → detail.
- **Detail:** an editorial case study using the existing fields (overview, problem, research, architecture, technology, solution, impact, lessons). Each as a calm section with a mono section label and wide spacing; technology as a minimal tag row; a prev/next project link at the bottom. Replace the `heroGradient` blocks with a quiet type-led hero (thin cyan hairline, big title, meta).

### Capabilities & Technologies
- **Capabilities:** editorial two-column list — title + description, `areas` as quiet mono tags. No icon grid.
- **Technologies:** minimalist categorized lists with lots of air. No logo wall.

### Experience (`app/experience/`)
Quiet vertical timeline: period (mono), role (`Syne`), organization, description, highlights, separated by hairlines. Mark the `[Your Organization]` placeholders as `TODO:`.

### Writing (`app/writing/` + `[slug]/`)
- **Index:** editorial rows — date (mono), title (`Syne`), excerpt, read time; hairline dividers.
- **Article:** readable long-form, ~65ch measure, generous leading, mono metadata, slow reveal on scroll.

### Resume & Contact
- **Resume:** clean typographic summary + a "Download PDF" link.
- **Contact:** a serene closing screen — a large invitation headline, my email as a big link, socials, and either a minimal form (name / email / message) or just the email. One accent, nothing busy.

---

## 6. Definition of done (quality bar)

- `next build` is clean; no runtime console errors; no unused-import lint noise.
- All copy is rendered **from `src/content/*.ts`**; no duplicated strings in components.
- Fully responsive, mobile-first; mobile nav works; tap targets ≥ 44px.
- **Accessibility:** semantic landmarks, keyboard navigable, visible focus rings, the existing skip-link kept, `prefers-reduced-motion` honored, image `alt` text, text contrast AA on the dark background (watch `cream-dim` on `navy-deep`).
- **Performance:** `next/image` for imagery, lazy-load below the fold, no Three.js/WebGL on first load, minimal client JS. Aim Lighthouse ≥ 90 across the board.
- Dark palette tokens preserved and refined. The `[data-theme='light']` toggle may stay as an optional extra, but **default is dark**.
- **Zero Izanami assets or copy** — no reused text, images, logo, section names ("School/Craft/Retreat"), or the "Remember who you are" line. Emulate structure, whitespace, and motion only.

---

## 7. Suggested execution order (work incrementally, keep it green, commit each step)

1. **Branch:** create `izanami-redesign` before touching anything.
2. **Prune:** remove the OS/maximalist components from the render tree; slim `ExperienceProvider`; confirm the app still builds and routes render.
3. **Design system:** refine `globals.css` / `tailwind.config.ts` (spacing rhythm, a mono-label utility, hairline util, reveal utilities, the mist motif); build shared primitives — `SectionLabel`, a `Reveal` wrapper around GSAP ScrollTrigger, an `EditorialSection` layout, optional minimal cursor.
4. **Nav + Footer.**
5. **Home** (hero + teaser sections).
6. **Philosophy.**
7. **Work** index + detail.
8. **Capabilities, Technologies, Experience, Writing, Resume, Contact.**
9. **Motion pass:** ScrollTrigger reveals, hover states, Lenis tuning, reduced-motion checks.
10. **QA:** accessibility, performance, responsive across breakpoints.

Commit after each phase with a clear message. **Ask me before deleting any file you're unsure about**, and pause to show me the Home + Philosophy result before rolling the pattern across every page.

---

## 8. Copy starters (mine — refine, keep my voice; replace, don't reuse Izanami's)

Hero headline directions (pick/rework one, keep it calm and declarative):
- "Software, engineered with intention."
- "Systems built to endure."
- "Precision, at every layer."
- "Quiet software. Serious systems."

Hero eyebrow: `SOFTWARE ENGINEER — NAIROBI, KENYA`
Hero subhead: *"I design and build enterprise-grade systems — scalable, secure, and considered — for businesses and the future."*
Contact invitation: *"Let's build something that lasts."*

These are drafts to make the layout real — swap in my final wording. Anywhere you need a fact I haven't given (real employers, live project names, links), insert a visible `TODO:` rather than inventing it.
