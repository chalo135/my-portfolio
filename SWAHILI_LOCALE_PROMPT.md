# Bilingual brief — English ⇄ Kiswahili, with a locale toggle

Paste this whole file into Claude Code from the project root
(`C:\Users\charl\Desktop\my-portfolio\my-portfolio`).

Write **complete files**, not diffs or fragments. Run `npx tsc --noEmit` and
`npm run build` after every phase. Do not start a phase until the previous one
builds clean.

---

## Context

Next.js 15 / React 19 / Tailwind 3.4 / TypeScript personal portfolio for
Charles Ndirangu (software engineer, Nairobi). Beyond Next and React, the only
runtime dependencies are `lenis`, `clsx` and `tailwind-merge` — there is **no
animation library and no webfont**, by design. Reveals are CSS transitions driven by an
IntersectionObserver; every font family resolves locally off the machine.
Keep it that way. **Do not add an i18n library.** The content is already a
handful of typed TS objects, which is a dictionary in all but name.

The site is currently English-only.

### Read this before you assume anything about the "Japanese"

There is **no Japanese rendered anywhere on this site.** The only CJK in the
repo is nine kanji string literals in `src/content/philosophy.ts`
(`質 匠 拡 人 速 守 継 進` on the eight pillars, `道` on the intro), typed as
`kanji: string` and documented as "a faint background watermark for this
pillar."

Grep confirms nothing consumes them:

```
grep -rn 'kanji' src/components src/app   # → no matches
```

They are dead data. `src/app/philosophy/page.tsx` renders `pillar.title`,
`pillar.headline` and `pillar.description` and never touches `pillar.kanji`.

So this job is two things that were being described as one:

1. The intended Japanese decorative layer becomes a **Kiswahili** decorative
   layer — and this time it actually gets rendered.
2. The site gains a **real second locale** with a toggle in the header.

Do not go looking for Japanese UI copy to translate. There isn't any.

### What must not break

| Keep | Why |
|---|---|
| The dark/light theme system, the pre-paint script in `layout.tsx`, `ThemeToggle` | Works, is hydration-safe, and is the pattern the locale toggle should rhyme with |
| `HomeContent` and the page components as **server components** | There is an explicit comment saying only Hero/Reveal/RuleLine/AmbientVideo ship as client code. Do not turn pages into `'use client'` to get at locale state |
| The WebGL water trail and its heading-to-canvas handoff | Phase 5 exists specifically to keep this working. Read it before touching `Hero` |
| The local-only font stack | Kiswahili is Latin script. No new font is needed, and none should be added |
| `src/content/projects.ts`, `writing.ts`, `experience.ts` | Copy, not code. You will add Kiswahili alongside, never rewrite the English |

---

## Decisions already made — implement these, don't relitigate them

**Locale pair: `en` and `sw`. Two locales, not three.**
Japanese is not a candidate. There is no Japanese content on the site to build
on, so a `ja` locale would mean authoring and maintaining a full Japanese
portfolio for an audience that does not exist, and a half-populated locale
reads as broken rather than as craft. English is the recruiter language,
Kiswahili is the author's own and the actual differentiator for a Nairobi
engineer. Two states also means the control is a genuine toggle rather than a
menu.

**Routing: URL segment, `app/[locale]/…`, no middleware.**
A client-side locale context would force `HomeContent` and every page to
`'use client'`, which throws away the RSC boundary this codebase deliberately
built, and would leave page `metadata` and the Kiswahili copy invisible to
crawlers. The locale lives in the path; pages stay on the server; both locales
prerender statically.

English moves to `/en/...` and Kiswahili to `/sw/...`, with permanent redirects
from the old flat paths so no existing link dies. Accept-Language
auto-redirection is **deliberately not implemented** — guessing a visitor's
language from headers overrides their actual intent and is the single most
common complaint about multilingual sites. The visitor lands on `/en` and
chooses.

**Where the control lives vs. where the flourish lives.**
The switcher goes in the header next to `ThemeToggle`, as a text control, in
the two places research is unanimous about: prominent, top corner, text not
flags, no globe icon, endonyms in the accessible name (`Kiswahili`, not
`Swahili`). The vertical rotated-typography treatment that Japanese-aesthetic
award sites are known for goes to the **watermark** in Phase 4 — decoration
belongs on the page edge, a control the visitor has to find does not.

---

## Phase 1 — Locale routing

### 1.1 Move the route tree

Every route file under `src/app/` moves into `src/app/[locale]/`, with three
exceptions that must stay at `src/app/`:

| Stays at `src/app/` | Why |
|---|---|
| `sitemap.ts` | Must serve `/sitemap.xml`. Under `[locale]` it becomes `/en/sitemap.xml`, which is wrong |
| `robots.ts` | Same — must serve `/robots.txt` |
| `global-error.tsx` | Replaces the root layout entirely and renders its own `<html>`; it cannot live inside a layout it replaces |

Also add a new `src/app/not-found.tsx` at the root for paths that match no
locale at all, and keep a `src/app/[locale]/not-found.tsx` for in-locale 404s.

`error.tsx`, `icon.svg` and `opengraph-image.tsx` move under `[locale]`.
After the build, check `.next` output and confirm the icon and OG image are
still emitted for both locales; if the root-level placement turns out to work
better for them, say so rather than guessing.

Result:

```
src/app/
  layout.tsx            ← DELETE (moves into [locale])
  global-error.tsx      ← stays
  not-found.tsx         ← NEW, root-level
  robots.ts             ← stays
  sitemap.ts            ← stays
  [locale]/
    layout.tsx          ← the root layout now; renders <html lang={locale}>
    page.tsx
    error.tsx
    not-found.tsx
    icon.svg
    opengraph-image.tsx
    about/page.tsx
    capabilities/page.tsx
    contact/page.tsx
    experience/page.tsx
    philosophy/page.tsx
    projects/page.tsx
    projects/[slug]/page.tsx
    resume/page.tsx
    technologies/page.tsx
    writing/page.tsx
    writing/[slug]/page.tsx
```

Next.js explicitly supports the root layout living in the dynamic segment
("The root layout can also be nested in the new folder, e.g.
`app/[lang]/layout.js`").

### 1.2 The locale module

Create `src/i18n/config.ts`:

```ts
export const locales = ['en', 'sw'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/** Endonyms. Never render "Swahili" in the UI — the language calls itself
 *  Kiswahili, and endonyms are the one thing every language-selector
 *  guideline agrees on. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  sw: 'Kiswahili',
}

/** Short label for the compact header control. */
export const localeCodes: Record<Locale, string> = {
  en: 'EN',
  sw: 'SW',
}

/** BCP 47 tags for `hreflang` and the `lang` attribute. */
export const localeTags: Record<Locale, string> = {
  en: 'en',
  sw: 'sw-KE',
}
```

### 1.3 `src/app/[locale]/layout.tsx`

This is now the root layout. Requirements:

- `export async function generateStaticParams()` returning
  `locales.map((locale) => ({ locale }))`, so both locales prerender.
- **`params` is a Promise in Next 15.** Type it
  `params: Promise<{ locale: string }>` and `await` it. Getting this wrong is
  the most common failure mode of this refactor.
- Validate with `isLocale()` and call `notFound()` if it fails, so `/de/about`
  404s instead of rendering an empty page.
- `<html lang={localeTags[locale]}>` — replace the hardcoded `lang="en"`.
  Keep `suppressHydrationWarning` and the inline theme script **exactly as
  they are**; they are unrelated to locale and they are correct.
- `metadata` becomes `generateMetadata({ params })` so title, description and
  `openGraph.locale` follow the locale. Set `openGraph.locale` to `en_US` for
  `en` and `sw_KE` for `sw`.
- Add `alternates` with `canonical` and `languages` (`en`, `sw`, plus
  `x-default` → the `en` URL) on every page. Put the helper in
  `src/lib/alternates.ts` so no page hand-rolls it.
- Localize the skip link text.

Also update the hardcoded `lang="en"` in `src/app/global-error.tsx`. It sits
above the locale segment and cannot know the locale — leave it `en` and add a
one-line comment saying so, rather than inventing a way to read it.

### 1.4 Locale-aware links

Every internal `href` in the app is currently absolute-from-root
(`/projects`, `/philosophy`, …) and will now 404.

Do **not** rewrite the hrefs in `src/content/site.ts` — they are the canonical
route list and are also consumed by `sitemap.ts`. Instead add
`src/lib/locale-href.ts`:

```ts
import type { Locale } from '@/i18n/config'

/** Prefixes an app-relative href with the active locale. External URLs,
 *  mailto:, tel: and in-page anchors pass through untouched. */
export function localeHref(href: string, locale: Locale): string {
  if (!href.startsWith('/')) return href
  return `/${locale}${href === '/' ? '' : href}`
}
```

Then thread `locale` into every component that renders a `Link`:
`Navigation`, `Footer`, `PageShell`, `ActionLink`, `HomeContent` and its
`TeaserBlock` / `SelectedWork` / `CapabilitiesStrip` / `ContactCta`, plus
`BackToTop` if it links rather than scrolls.

Prop-drill `locale` from the page. **Do not use `next/root-params`** — that is
a Next 16 API and this project is on Next 15.

For the two client components that need the current locale without a prop
(`Navigation` and the new `LocaleToggle`), read it from the pathname via
`usePathname()` rather than adding a second context provider.

### 1.5 Redirects

In `next.config.ts`, add `redirects()` mapping the old flat paths to `/en/…`
with `permanent: true`. Enumerate them explicitly from `footerItems` plus `/`,
and add `/projects/:slug` and `/writing/:slug`. Do not try to write one
catch-all regex with a negative lookahead for `en|sw|_next|…` — it is easy to
get subtly wrong and it will happily redirect-loop. A dozen explicit entries
are boring, greppable and verifiable.

### 1.6 Sitemap and robots

`src/app/sitemap.ts` emits every route **twice**, once per locale, each entry
carrying `alternates.languages` pointing at its counterpart. Keep it importing
`footerItems`, `projects` and `writingPosts` as it does now — just map the
existing loop over `locales`.

`robots.ts` needs no change.

**Build must pass before Phase 2.**

---

## Phase 2 — The dictionary

### 2.1 Shape

The content already lives in typed objects. Keep that; do not flatten it into
JSON key-path strings — losing the types would be a downgrade.

Create `src/content/<name>.en.ts` and `src/content/<name>.sw.ts` for each of
the eight existing content modules, both satisfying the **same exported
interface**, which stays in `src/content/<name>.ts` alongside a resolver:

```ts
// src/content/site.ts  (interfaces + resolver; the copy moves out)
import type { Locale } from '@/i18n/config'
import * as en from './site.en'
import * as sw from './site.sw'

export interface NavItem { label: string; href: string }
// … the rest of the existing interfaces, unchanged …

const dictionaries = { en, sw } as const

export function getSite(locale: Locale) {
  return dictionaries[locale]
}
```

Because both files are typed against the same interface, TypeScript fails the
build if a Kiswahili key is missing. That is the guardrail — no runtime
fallback logic needed, and no chance of a raw key string shipping to the page.

Apply the same split to `about`, `capabilities`, `experience`, `philosophy`,
`projects`, `technologies`, `writing`.

### 2.2 What stays English in both locales

Do not translate, in either locale:

- `site.name`, `site.monogram`, `site.email`
- Technology names in `technologies.ts` and `capabilities.ts` — "PostgreSQL",
  "Next.js", "M-Pesa Daraja" are proper nouns
- `project.slug` and `post.slug` — URLs stay stable across locales, which is
  also what makes the toggle able to swap the prefix and land on the same page
- `project.year`, `project.category` codes, `heroGradient` class strings

### 2.3 Kiswahili chrome copy

Use this glossary for navigation, labels and controls. These are the
high-traffic strings; get them exactly right.

| English | Kiswahili |
|---|---|
| Work | Kazi |
| Projects | Miradi |
| Philosophy | Falsafa |
| About | Kuhusu |
| Capabilities | Uwezo |
| Technologies | Teknolojia |
| Experience | Uzoefu |
| Writing | Maandishi |
| Résumé | Wasifu |
| Contact | Mawasiliano |
| Get in touch | Wasiliana nami |
| Email me | Nitumie barua pepe |
| See the work | Tazama kazi |
| All work | Kazi zote |
| The full list | Orodha kamili |
| How I work | Jinsi ninavyofanya kazi |
| What I work with | Ninachotumia |
| Close | Funga |
| Top | Juu |
| Open menu | Fungua menyu |
| Site menu | Menyu ya tovuti |
| Skip to main content | Rukia hadi maudhui makuu |
| Switch to English | Badilisha kwa Kiingereza |
| Switch to Kiswahili | Badilisha kwa Kiswahili |

### 2.4 Long-form prose — draft, then flag

Translate the headlines, taglines, teaser leads and body paragraphs into
Kiswahili, but **do not treat your output as final.** Write every translated
paragraph — anything longer than roughly eight words — into a review file at
the project root:

```
SWAHILI_COPY_REVIEW.md
```

as a table of `file · key · English · your Kiswahili`. Charles is the Swahili
speaker; the site ships when he has signed off on that file, not when it
builds. Say so in a line at the top of the file.

Two things to actually get right rather than transliterate:

- `site.tagline` / `hero.headline` — "I build the software Kenyan businesses
  run on." The verb matters. `Ninaunda programu zinazoendesha biashara za
  Kenya` reads better than a literal `ninajenga … zinazotegemea`, but put both
  in the review file and let him pick.
- `site.ethos` — "Software that has to balance at the end of the month."
  This is an accounting pun. Flag it explicitly as needing a rewrite rather
  than a translation.

**Build must pass before Phase 3.**

---

## Phase 3 — The toggle

`src/components/layout/LocaleToggle.tsx`. It renders a `next/link`, not a
button with an onClick — the locale is in the URL, so switching it is a
navigation, and a `Link` gets middle-click, open-in-new-tab and copy-link-
address for free.

### Behaviour

- Reads the current pathname with `usePathname()`, swaps the leading locale
  segment for the other locale, and links there. `/sw/projects/salio` →
  `/en/projects/salio`. Slugs are shared (2.2), so the visitor lands on the
  same page, never on a home page.
- If the pathname somehow has no locale prefix, fall back to
  `/${otherLocale}`.
- `aria-label` uses the endonym: `Badilisha kwa Kiingereza` /
  `Switch to Kiswahili`. Not "Swahili". Not a flag. Not a globe icon.
- `hreflang` on the link, set to the target locale's tag.

### Appearance

Match the design vocabulary that is already in this codebase rather than
importing a new one:

- Two labels, `EN` and `SW`, from `localeCodes`, separated by a hairline
  `/` at `text-fg/30`.
- `font-mono text-[0.72rem] tracking-label` — mono is what this site already
  uses for indices, years and the clock, and it makes the two codes the same
  optical width so the header never reflows on toggle.
- Active locale `text-fg`; inactive `text-fg-muted`, going `text-accent-deep`
  on hover, `transition-colors duration-150 ease-out`.
- The active label carries the **same underline affordance as the nav links** —
  copy the `after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5
  after:bg-accent-deep after:transition-opacity after:duration-150` pattern
  from `Navigation.tsx` verbatim. `Navigation` already comments that hover
  borrows the active rule "so the affordance is the same shape either way" —
  the toggle joining that system is the whole point.
- No new keyframes, no clip-path flourish on the control itself. The page
  transition already runs the site's mask reveal on arrival via
  `Reveal on="load"`, so the language visibly wipes in. Animating the control
  *and* the page would be two competing motions.

### Placement

- **Desktop and mobile header:** inside the existing right-hand cluster in
  `Navigation.tsx`, `<LocaleToggle />` immediately before `<ThemeToggle />`,
  inside the same `flex items-center gap-2` div. Locale before theme: it
  changes content, theme only changes appearance.
- **Mobile overlay:** a second, full-word instance on the bottom row, in the
  `flex items-baseline justify-between` div that currently holds
  `{site.location}` and the `Close` button. Render `English / Kiswahili` from
  `localeNames` there — the overlay has the room and full words are clearer
  than codes. Give it `tabIndex={open ? 0 : -1}` like its siblings, and make
  sure it lands inside the focus trap's `focusable` query (it will: the query
  already selects `a[href]`).

### Header width

Adding a control to a header that already holds five nav items plus a theme
toggle is a real overflow risk, and the Kiswahili labels are longer
(`Mawasiliano` vs `Contact`). Check the desktop nav at **768px, 820px and
900px** in both locales. If it crowds, reduce the nav `gap-8` to
`gap-6 lg:gap-8` — do not drop nav items and do not shrink the type.

---

## Phase 4 — The watermark: kanji → Kiswahili, and actually render it

### 4.1 Data

In the `PhilosophyPillar` interface, replace:

```ts
/** Single kanji used as a faint background watermark for this pillar. */
kanji: string
```

with:

```ts
/** Single Kiswahili word set as a large, faint vertical watermark behind
 *  this pillar. Decorative: aria-hidden, and never the pillar's title. */
mark: string
```

Same for `philosophyIntro`. The word is **the same in both locale files** —
it is the identity layer, the way the kanji was going to be, so `Ubora` stands
behind the Quality pillar whether the visitor is reading English or Kiswahili.

| Pillar | Was | `mark` |
|---|---|---|
| Quality | 質 | Ubora |
| Craftsmanship | 匠 | Ufundi |
| Scalability | 拡 | Upanuzi |
| User-Centered Design | 人 | Mtumiaji |
| Performance | 速 | Kasi |
| Security | 守 | Usalama |
| Maintainability | 継 | Udumishaji |
| Innovation | 進 | Ubunifu |
| *intro* | 道 | Njia |

`道` → `Njia` is a straight hit: both mean "the way / the path". Put these in
`SWAHILI_COPY_REVIEW.md` too.

### 4.2 Render it

In `src/app/[locale]/philosophy/page.tsx`, each pillar `<article>` gets
`relative overflow-hidden`, and inside it:

```tsx
<span aria-hidden className="pillar-mark">{pillar.mark}</span>
```

CSS in `globals.css`, in the same hand-written region as `.rule-line` and the
theme glyphs:

```css
/* Oversized Kiswahili watermark behind each philosophy pillar. Vertical
   because that is the device the layout was designed around; `sideways`
   rather than the default `mixed` so a Latin word rotates as a run instead
   of stacking letter by letter. Decorative only — aria-hidden at the call
   site, and never load-bearing for meaning. */
.pillar-mark {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  writing-mode: vertical-rl;
  text-orientation: sideways;
  font-family: theme('fontFamily.serif');
  font-size: clamp(3rem, 8vw, 7rem);
  line-height: 1;
  letter-spacing: -0.02em;
  color: rgb(var(--fg-rgb) / 0.06);
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
}

@media (max-width: 767px) {
  .pillar-mark { display: none; }
}
```

Notes that matter:

- `0.06` alpha is tuned for the light theme's `--fg-rgb`. Check it on dark;
  if it disappears against `#050608`, add a `[data-theme='dark'] .pillar-mark`
  rule at `0.08` rather than raising both.
- Hidden below `768px`: at phone width it would sit under the body copy.
- It must **not** be wrapped in `Reveal`. Decoration does not animate in.
- The intro mark on the page header gets the same treatment at a larger size,
  positioned against the header rather than a pillar.

---

## Phase 5 — The canvas trap. Read this before touching `Hero`.

This is the part of the job most likely to ship broken, because it fails
silently and only in one locale.

### What actually happens

`src/components/home/Hero.tsx` hands its `<h1>` to `AmbientVideo` via
`headingRef`. `WaterTrailCanvas` rasterises that heading — `paintHeading()`
walks the element's text nodes with a `TreeWalker` and draws each character
into a 2D canvas using live `Range.getBoundingClientRect()` positions — uploads
it as a GL texture, and calls back `onTextPainted(true)`. `Hero` then applies
`canvas-painted` to the `<h1>`, which sets `color: transparent`. **The DOM
heading is invisible from that point on; what the visitor reads is the
texture.**

`repaintText()` is only ever called from `resize()`, which is driven by a
debounced `ResizeObserver` on the host, and from the pipeline rebuild. The
rebuild effect's dependency array is:

```ts
[reducedMotion, degraded, allowVideo, lightSrc.video, lightSrc.poster,
 darkSrc.video, darkSrc.poster]
```

The heading's **text is not in it, and nothing observes it.** So if the
headline string changes without the hero's box height changing, the canvas
keeps showing the old text while the DOM copy stays transparent — the hero
displays the wrong language, or nothing at all.

A Kiswahili headline that happens to wrap to the same number of lines is
exactly that case.

### The fix — do both parts

Phase 1's URL routing means `/en` → `/sw` crosses the root layout and remounts
the tree, which re-runs the pipeline effect and repaints. That is the primary
reason the routing decision was made this way. Do not rely on it alone.

**5.1** Thread a `textKey` prop: `Hero` passes `textKey={hero.headline}` →
`AmbientVideo` forwards it → `WaterTrailCanvas` accepts it and adds:

```tsx
// Declared AFTER the pipeline effect so repaintTextRef is populated by the
// time this first runs. The heading's text is not in the pipeline effect's
// deps — a headline that changes without changing the hero's height would
// otherwise leave a stale texture on screen over a transparent <h1>.
useEffect(() => {
  repaintTextRef.current?.()
}, [textKey])
```

Declaration order is load-bearing. Put it after the big `useEffect` that
assigns `repaintTextRef.current`, not before.

**5.2** Make the failure mode visible rather than blank. In `Hero`, reset the
handoff when the headline changes:

```tsx
useEffect(() => setHeadingOnCanvas(false), [hero.headline])
```

So the DOM heading is readable until the canvas confirms it has painted the
new one. If the repaint never fires, the visitor sees a plain heading — not an
empty hero.

### Verify it by hand

`npm run dev`, open `/en` on a desktop with a fine pointer (the trail is gated
on `pointer: fine`, `!prefers-reduced-motion` and width > 768px), let the
heading hand off to the canvas, then click the toggle to `/sw`. The Kiswahili
headline must be legible and must ripple under the cursor. Then go back.
Do this at 1440px and at 1024px.

---

## Phase 6 — Loose ends

| Item | Do |
|---|---|
| `src/components/layout/StatusStrip.tsx` | **Leave `Intl.DateTimeFormat('en-GB', …)` alone.** It is a fixed 24-hour `HH:mm:ss` numeric format — identical output under `sw-KE`, and changing it risks a hydration mismatch for zero gain. Add a one-line comment saying that, so the next reader doesn't "fix" it |
| Per-page `export const metadata` | Ten page files export a static `metadata` (`about`, `capabilities`, `experience`, `philosophy`, `projects`, `projects/[slug]`, `resume`, `technologies`, `writing`, `writing/[slug]`). All ten convert to `generateMetadata({ params })`. Miss one and that page ships an English title under `/sw` |
| `src/app/page.tsx` and `src/app/contact/page.tsx` | These two export **no** metadata today and inherit the layout's. Give each a `generateMetadata` too, or the home and contact pages are the only ones without a localized title |
| `generateStaticParams` on `projects/[slug]` and `writing/[slug]` | Both already have one. They must now return the cross product of locales × slugs, or those routes stop prerendering |
| `src/content/site.ts` `socialItems` | `href: '#'` entries are already filtered out by `Footer`. Leave that logic alone |
| `next.config.ts` `images.remotePatterns` | Untouched |
| Text expansion | Kiswahili runs roughly 15–30% longer than English. `text-display-xl` is `clamp(2.75rem, min(8vw, 12vh), 7rem)` on a `max-w-4xl` `<h1>` inside a `min-h-[100svh]` `items-end` hero. A longer headline adds a line, and the existing `pt-24 md:pt-28` is what stops the copy sliding under the fixed header. **Check the home hero at 360px width and at 700px viewport height in Kiswahili.** If it collides, raise the top padding — do not shrink the type |

---

## Phase 7 — Verification

`npx tsc --noEmit` clean. `npm run build` clean. Then work the matrix — do not
mark this done on a build alone.

**Routes.** Every one of these renders, in both locales:
`/` `/projects` `/projects/[each slug]` `/philosophy` `/about`
`/capabilities` `/technologies` `/experience` `/writing`
`/writing/[each slug]` `/resume` `/contact`

**Redirects.** Each old flat path 308s to its `/en` counterpart. `/` →
`/en`. No redirect loop — `curl -I` each one and check there is exactly one
hop.

**Toggle.** From a deep page (`/en/projects/<slug>`), toggling lands on
`/sw/projects/<slug>`, not on `/sw`. Middle-click opens it in a new tab.
Back button returns to the previous locale.

**`lang`.** View source on `/sw/about`: `<html lang="sw-KE">`. On `/en/about`:
`<html lang="en">`.

**hreflang.** Both pages carry `alternates.languages` for `en` and `sw` plus
`x-default`, and each points at a URL that returns 200.

**Sitemap.** `/sitemap.xml` — and not `/en/sitemap.xml` — lists both locales.
`/robots.txt` still resolves.

**Hero canvas.** Phase 5's manual check, both directions, at two widths.

**Watermark.** Visible but subtle on the philosophy page in both themes,
absent below 768px, and not announced by a screen reader.

**Keyboard.** Tab through the header: skip link → wordmark → nav items →
locale toggle → theme toggle → menu button. Open the mobile overlay and
confirm the full-word locale link is inside the focus trap and that Escape
still closes.

**Reduced motion.** With `prefers-reduced-motion: reduce`, the canvas does not
mount at all (`WaterTrailCanvas` returns `null`), so the `<h1>` must be
readable plain text in both locales. Verify — this is the path where a
`canvas-painted` bug would leave a permanently blank hero.

**No Japanese left.** `grep -rnP '[\x{3040}-\x{30FF}\x{4E00}-\x{9FFF}]' src`
returns nothing.

**No new dependencies.** `git diff package.json` shows no additions.

---

## Deliverables

1. The implementation.
2. `SWAHILI_COPY_REVIEW.md` at the project root — every translated string
   longer than ~8 words, as `file · key · English · Kiswahili`, with a note at
   the top that the site is not done until Charles has read it.
3. A short summary of anything in this brief that turned out to be wrong about
   the codebase. Say so plainly instead of working around it silently.
