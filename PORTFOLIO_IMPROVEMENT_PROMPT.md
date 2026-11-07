# Portfolio rebuild brief — performance, legibility, typography, navigation

Paste this whole file into Claude Code from the project root
(`C:\Users\charl\Desktop\my-portfolio\my-portfolio`).

---

## Context

Next.js 15 / React 19 / Tailwind 3 personal portfolio for Charles Ndirangu
(software engineer, Nairobi). It runs, and it typechecks clean, but it is slow,
it stutters and occasionally locks up the tab, everything reads washed-out and
grey, and it looks machine-generated. The dark/light theme system works and
**must be kept** — both themes stay, the toggle stays, the pre-paint script
stays. This is about making it fast, legible, and human.

Work in order. Run `npx tsc --noEmit` and `npm run build` after each phase.
Do not start a phase until the previous one builds.

Do not touch: `src/content/projects.ts`, `src/content/writing.ts`,
`src/content/experience.ts` — those are copy, not code.

---

## Phase 0 — already done, don't redo it

These fixes are in the working tree already. Read them before you change
anything nearby so you don't undo them:

- 306 MB `.mp4` and 206 MB `.exe` moved out of the project root to
  `../_local-assets/`; `.gitignore` hardened so they can't come back.
- `src/app/error.tsx` and `src/app/global-error.tsx` added.
- `TextReveal` no longer uses a bare `opacity-0`; it uses `.reveal-init`, and
  `.reveal-init` is now scoped to `html.js-ready` (stamped by the pre-paint
  script in `layout.tsx`) so content is never permanently invisible when JS
  fails.
- `ThemeToggle` has a state-dependent `aria-label`.
- `src/app/api/chat/route.ts` hardened: same-origin check, body ceiling, strict
  message validation, per-IP token bucket.
- `src/app/api/github/route.ts` no longer returns fabricated follower counts on
  failure.

---

## Phase 1 — Performance. This is why it hangs.

### 1.1 Delete dead weight

None of these are imported anywhere in `src/`:

| Delete | Why |
|---|---|
| `three`, `@react-three/drei`, `@react-three/fiber` | zero imports; ~40 MB of `node_modules` and a slow install |
| `src/types/three-fiber.d.ts` | only exists to type a component that no longer exists |
| `gray-matter`, `class-variance-authority`, `@gsap/react` | zero imports |
| `src/components/profile/ProfileCard.tsx` | rendered by nothing |
| `src/components/ui/GlassPanel.tsx` | only used by ProfileCard |
| `src/components/ui/MistBackground.tsx` | rendered by nothing |
| `framer-motion`, `lucide-react` | only used by ProfileCard — free once it's gone |

Then delete the `.hero-mist` / `.mist-layer` / `.mist-1..3` /
`@keyframes mist-drift-*` block from `globals.css` (dead CSS for a dead
component — and three `filter: blur(90px)` layers at 46–52vw would have been a
GPU killer if it had ever mounted).

Then drop `experimental.optimizePackageImports` from `next.config.ts` — both
packages it names are gone.

Run `npm install` and verify the build.

### 1.2 Stop animating four full-screen images forever

`src/components/ui/AmbientVideo.tsx` renders **both** theme posters as
full-bleed `next/image`, both carrying `.ambient-kenburns` — a 44s infinite
`transform: scale()` with `will-change: transform`. `HomeContent` mounts
`AmbientVideo` **twice** (Hero and ContactCta). That's four permanently
compositing full-viewport layers, and the ContactCta pair keeps animating while
off-screen.

Fix:

- Render only the **active** theme's poster. Keep the other warm with
  `<link rel="prefetch" as="image">` in `<head>` instead of a mounted `<Image>`.
- Gate `.ambient-kenburns` on an `IntersectionObserver` — pause the animation
  (`animation-play-state: paused`) when the section leaves the viewport.
- Drop the Ken Burns entirely on the ContactCta instance. It's below the fold,
  behind a 0.86-alpha scrim, and nobody will ever see it move.

### 1.3 Fix the WebGL hot loop

`src/components/ui/WaterTrailCanvas.tsx`, the `frame()` function:

- **Two `getBoundingClientRect()` calls per frame** (pointer + burst). Each is a
  forced synchronous layout, and Lenis is driving scroll on the same tick.
  Cache the rect; refresh it in the `ResizeObserver` and on a throttled scroll
  handler.
- **`texImage2D` per frame per video** reallocates the whole texture every
  frame. Use `texImage2D` once to allocate, then `texSubImage2D` for updates.
- **`RGBA16F` render targets at DPR 2.** Halve the memory bandwidth: use
  `RGBA8` for the trail field (the values are small and clamped anyway), or
  `RG16F` if you keep the float path. Lower `DPR_CAP` from `2` to `1.5`.
- **Add a runtime perf bail-out.** Measure the first ~40 frames; if the mean
  frame time is worse than ~22 ms, tear the canvas down, call
  `onFirstFrame(false)` / `onTextPainted(false)`, and let the static poster take
  over. Persist that decision in `sessionStorage` so it isn't re-measured on
  every navigation. **This is the single most important change for the hangs** —
  right now a weak integrated GPU has no escape hatch.
- Attach the `pointermove` listener only while the canvas is on-screen (the
  `IntersectionObserver` is already there — use it).

### 1.4 Smaller, real wins

- `src/components/layout/StatusStrip.tsx`: the 1 Hz `setInterval` clock
  re-renders fixed chrome every second on every page forever. Clear it on
  `document.hidden` and restart on `visibilitychange`.
- `src/components/ui/Reveal.tsx`: the cleanup calls `ScrollTrigger.getAll()` and
  scans every trigger on the page on **every** unmount. Keep a reference to the
  instance the tween created and kill only that one.
- `src/components/layout/VerticalSectionLabel.tsx`: it calls
  `ScrollTrigger.refresh()` on every pathname change — a full recalculation of
  every trigger. Drop it, or defer it behind one `requestAnimationFrame` after
  fonts settle.
- `globals.css`: `.glass-nav` uses `backdrop-filter: blur(24px)` on a fixed
  full-width bar sitting over the animating canvas, forcing a re-blur every
  frame. Cut to `blur(10px)`, and once `scrolled` is true prefer a near-solid
  `rgb(var(--bg-rgb) / 0.94)` with no blur at all.
- `ExperienceProvider`: Lenis `lerp: 0.09` is very heavy smoothing and is a big
  part of why scrolling feels laggy. Use `0.14`. Add `syncTouch: false`.
- `globals.css`: `body { overflow-x: hidden }` fights Lenis. Use
  `overflow-x: clip` on `html` instead.

---

## Phase 2 — Typography. Kill the AI-generated look.

The current stack is Syne (display) + Instrument Sans (body) + JetBrains Mono.
That exact trio is the house style of every AI-generated portfolio from the last
two years, and it's three render-blocking Google font families.

**Replace all three with system fonts.** Zero network bytes, instant first
paint, no `document.fonts.load()` wait in the canvas, and it looks like a person
chose it.

Delete the `next/font/google` imports from `src/app/layout.tsx` entirely, then
in `tailwind.config.ts`:

```ts
fontFamily: {
  // Body + headings. Times New Roman is installed on essentially every
  // Windows and macOS machine; Liberation Serif and Tinos are the
  // metric-compatible substitutes shipped on Linux and Android.
  serif: ['"Times New Roman"', 'Times', '"Liberation Serif"', 'Tinos', 'Georgia', 'serif'],

  // UI / labels / navigation. Samsung's system typeface is One UI Sans
  // (One UI 6 and later); SamsungOne on older devices. Neither is licensed
  // for web embedding, so they are NAMED here and resolve locally on Samsung
  // hardware — everywhere else this falls through to the nearest match.
  sans: ['"One UI Sans"', 'SamsungOne', '"Samsung Sans"', 'Roboto', '"Segoe UI"', 'system-ui', 'sans-serif'],

  // Keep a mono for code and tabular numbers only.
  mono: ['"Cascadia Mono"', 'Consolas', '"SF Mono"', 'monospace'],
},
```

Then apply it deliberately — this is where the "human coded" feel comes from:

- `body` → `font-serif`. Times New Roman for running prose is a real editorial
  choice, and no AI-generated template makes it.
- Headings (`h1`–`h3`, `.text-display-*`) → `font-serif`, `font-weight: 400`.
  Times at large sizes needs tighter tracking: set `letter-spacing: -0.015em` on
  `display-xl` / `display-lg`.
- Navigation, buttons, labels, footer links, status strip → `font-sans`.
- `font-mono` survives **only** for the clock, project years, and the `01`/`02`
  section indices.

Bump the base body size to `1.0625rem` with `line-height: 1.65` — Times has a
smaller x-height than Instrument Sans, so a straight swap at the same size reads
smaller than it should.

Set `--font-syne`, `--font-instrument`, `--font-geist-mono` to nothing — remove
the variables and every reference to them. The heading painter in
`WaterTrailCanvas.paintHeading()` reads the resolved family off the element via
`getComputedStyle`, so it will pick up Times with no change — but **verify the
canvas-painted `<h1>` still lands on the same baseline**, and drop the
`waitForFont()` await entirely since there is no webfont left to wait for.

### While you're in there: the other AI tells

Remove or replace these. Each one is a tell on its own; together they're a
signature:

- **The kanji watermarks** (`道` in `HomeContent`, more in `about` and
  `philosophy`). A decorative Japanese character on a Kenyan engineer's site is
  unmotivated ornament. Delete `KanjiWatermark` and the `.font-kanji` CSS.
- **`tracking-label: 0.28em` uppercase micro-labels everywhere.** Cut to
  `0.08em` and stop using uppercase for anything except the two-digit section
  indices.
- **`ease-cinematic` + `duration-500`/`duration-700` on literally every hover.**
  Nothing on a real site takes 700 ms to change colour. Use `150ms ease-out`
  for hover states; keep the long easing only for the scroll reveals.
- **The essay-length JSDoc on every file.** Files like `AmbientVideo.tsx` and
  `SectionLabel.tsx` carry 15-line comment blocks justifying every decision.
  Cut them to one line, or none. This is the strongest tell in the whole
  codebase.
- **The copy.** "Software, engineered with intention." / "Systems built to
  endure." / "Let's build something that lasts." Rewrite in first person, plain,
  specific: what he builds, for whom, in Nairobi. Mention the actual work —
  multi-tenant ERP for Kenyan SMEs, M-Pesa Daraja integration, double-entry
  accounting in a POS, Supabase RLS and IDOR hardening on a live e-commerce
  platform. Specifics are the thing an LLM can't fake.

---

## Phase 3 — Legibility. Stop the dim look, keep both themes.

The dimness is not the dark theme. It's that almost nothing on the page uses
the actual foreground colour.

### 3.1 Tokens (`globals.css`)

Keep the structure. Change these values:

```
Light (:root):
  --line: rgba(26, 21, 18, 0.10)  →  rgba(26, 21, 18, 0.18)
  --fg-muted-rgb: 107 98 89       →  90 82 74     (7.2:1, up from 5.5:1)

Dark ([data-theme='dark'] AND the prefers-color-scheme block — change both):
  --line: rgba(245,245,247,0.06)  →  rgba(245,245,247,0.16)
  --fg-muted-rgb: 161 161 170     →  178 180 188
  --surface-rgb: 20 24 32         →  24 28 38     (lift it off pure black)
```

`--line` at 6 % alpha is the specific bug behind "hard to navigate": every
section divider, every card border, and the footer rule are currently invisible
in dark mode, so the page reads as one undifferentiated column.

### 3.2 Stop using `fg-muted` for body copy

Search `src/` for `text-fg-muted` and audit every hit. The rule:

- Body paragraphs, project taglines, the hero subhead, footer nav links →
  `text-fg` (or `text-fg/90`).
- `text-fg-muted` survives only for genuinely secondary metadata: the clock,
  years, "EAT, Nairobi KE".

Also fix these specific low-contrast spots:

- `text-fg/[0.08]` on the kanji (moot once it's deleted)
- `via-fg/25` on the hero scroll hairline → `via-fg/50`
- `bg-fg/15` on the SectionLabel dash → `bg-fg/35`
- `.text-legible`'s `0 2px 40px` shadow — a 40 px blur behind every hero glyph
  is what makes the headline look foggy. Cut to `0 1px 3px` plus
  `0 0 18px`, and lower `--halo-far` to `0.45`.

### 3.3 Scrims

`--scrim-strength: 1` in dark mode puts a full-opacity dark wash over already
dark footage, so the hero is nearly black with dim text on it. Set the dark
`--scrim-strength` to `0.75` and raise the mid-stop of `.scrim-hero` from
`0.14` to `0.30` so the text band is protected without flattening the whole
frame.

---

## Phase 4 — Navigation. Make it obvious.

### 4.1 The nav is invisible at rest

In `src/components/layout/Navigation.tsx`, desktop links are
`font-mono text-[0.7rem] uppercase tracking-label text-fg-muted` with an
underline that is `scale-x-0` until hover. That is ~11 px, letter-spaced to
0.28em, in the muted colour, with **no affordance at all** until the pointer is
already on it.

Rewrite as: `font-sans text-[0.9rem] tracking-normal text-fg`, normal case
(`Work`, not `WORK`). Give the active route a persistent 2 px underline in
`accent-deep` plus `font-medium`. Keep `aria-current="page"`.

### 4.2 Kill the duplicate menu

There are five links in the header **and** a "Menu" button that opens a
full-screen overlay containing nine links — five of which are the same five.
Two navigation systems side by side is why it's confusing.

Pick one:

- **Preferred:** drop the overlay on desktop. Show all the primary routes in the
  header; move `Résumé`, `Technologies`, `Capabilities`, `Experience` into a
  grouped footer. Keep the overlay for mobile only (`md:hidden`), labelled with
  a hamburger icon rather than the word "Menu".

### 4.3 The rest

- `src/components/layout/VerticalSectionLabel.tsx` — a rotated 10 px label
  pinned to the left edge that nobody reads. Delete it, and delete the
  `ScrollTrigger` block that drives it (a free perf win too).
- `StatusStrip` — `text-[0.65rem]` is ~10 px. Bump to `0.75rem`, and replace the
  bare word "Scroll" with nothing; keep only the clock and the "Top" control
  once past the fold.
- `/projects/[slug]` and `/writing/[slug]` have no way back except the browser
  button. Add a `← Work` / `← Writing` breadcrumb at the top of each.
- Footer: nine flat links in a two-column grid. Group them under three headings
  — **Work**, **About**, **Contact** — and raise them from `text-fg-muted` to
  `text-fg`.

---

## Phase 5 — Finish the half-built parts

These are real, visible gaps:

- `src/content/about.ts` — all three biography paragraphs are literally
  `'TODO: Paragraph one — ...'`. The About page ships placeholder text right
  now. Write it, or hide the section until it exists.
- `src/content/site.ts` — `socialItems` has LinkedIn and X as `href: '#'`. Fill
  them in or remove those entries; dead `#` links in a footer look broken.
- `src/app/layout.tsx` — `metadataBase: new URL('https://charlesndirangu.com')`
  is a TODO. Set the real deploy domain or OG and canonical URLs resolve wrong.
- `src/app/about/page.tsx` — a "Portrait — TODO" placeholder box.
- `data-cursor` attributes are scattered across six files, left over from a
  custom cursor that no longer exists. Remove them all.
- No `sitemap.ts`, no `robots.ts`, no `opengraph-image`. Add all three.
- `src/app/api/chat/route.ts` and `src/app/api/github/route.ts` are hardened but
  **called by nothing**. Either build the UI that uses them or delete them —
  a live OpenAI-spending endpoint with no caller is pure liability.

---

## Definition of done

- `npm run build` clean, `npx tsc --noEmit` clean, `npm run lint` clean.
- No `next/font` imports; every font resolves locally.
- Home page holds 60 fps while scrolling on integrated graphics, and drops the
  WebGL canvas automatically when it can't.
- Both themes work; the toggle works; no flash of the wrong theme on load.
- Every section divider is visible in both themes.
- Nav items are readable and their state is obvious without hovering.
- No `TODO` string reaches the rendered page.
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95 on `/` in both themes.

Commit in phases, one commit per phase, so anything can be reverted alone.
