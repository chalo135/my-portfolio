# Build prompt — sunny/rainy water-trail hero (my-portfolio)

Run this from the repo root: `C:\Users\charl\Desktop\my-portfolio\my-portfolio`.
Attach `water-trail.html` as the shader reference.

Work through all six stages end to end. Don't stop for approval between them — verify each stage
yourself against its own checklist and keep going. Report everything at the end in the format asked
for in Stage 6.

---

Build a WebGL cursor water-trail hero for my portfolio: a warm, sunlit background by default, and a
dark rainy one behind a theme toggle. The cursor pushes the image around like water, and the
headline type distorts along with it.

## The reference

I'm modelling the *feel* on izanami-official.com — full-bleed background media, quiet editorial
type, a cursor wake that displaces the headline along with the image behind it.

I'm deliberately inverting its mood. Izanami is dark and sombre. Mine opens **bright, warm and
welcoming** — sunlit nature, golden hour — and switches to **dark and rainy** on toggle. Light is
the default and the primary design; dark is the alternate.

**Out of scope:** don't rewrite my copy, don't touch `src/content/*.ts` except `site.ts` where this
prompt says to, and don't redesign pages other than the home page. If you think the copy tone should
shift to match the warmer look, say so at the end — don't act on it.

## The codebase

- Next.js 15 App Router, React 19, TypeScript `strict: true`, Tailwind 3.4, ESLint
  `next/core-web-vitals`. Source under `src/`, alias `@/*` → `./src/*`.
- **Hero:** `src/components/home/HomeContent.tsx` → `Hero()`. A `min-h-[100svh]` section whose
  background is `src/components/ui/AmbientVideo.tsx` (full-bleed `absolute inset-0`). The same
  component is mounted a second time by `ContactCta()` lower down.
- **Smooth scroll:** `src/providers/ExperienceProvider.tsx` runs Lenis off GSAP's ticker.
- **Reveals:** `src/components/ui/Reveal.tsx` — GSAP + ScrollTrigger, with a `mask` mode used on the
  hero `h1`.
- **Media today:** only `public/images/ambient-poster.jpg`. `site.ts` has `media.ambientVideo` as an
  empty-string placeholder.
- **Do not touch:** `12830875_2160_3840_60fps.mp4` at the repo root — 320 MB, unused, and not
  covered by `.gitignore`. Don't import it, don't move it into `public/`, don't `git add` it. Add a
  `.gitignore` line for it in Stage 1.
- **Don't use:** `three`, `@react-three/fiber`, `@react-three/drei`. They're in `package.json` as
  dead weight from an earlier iteration. This is raw WebGL2. Report at the end whether anything in
  `src/` still imports them so I can drop the deps.

---

# Stage 1 — fix the theme system

Read `src/providers/ExperienceProvider.tsx`, `src/app/globals.css`, `tailwind.config.ts` and
`src/app/layout.tsx` before editing. Three things are broken today.

### 1a. The light theme doesn't apply

`globals.css` overrides `--cream`, `--navy-deep` etc. under `[data-theme='light']`, but
`tailwind.config.ts` defines those same colours as **hardcoded hex**. `text-cream` compiles to
`color: #f5f5f7` and ignores the override entirely. Only `body` changes today, via its own explicit
`[data-theme='light'] body` rule.

Convert the Tailwind colour tokens to CSS variables using the `<alpha-value>` pattern so opacity
modifiers (`/85`, `/[0.06]`) keep working:

```ts
// tailwind.config.ts
colors: {
  bg:      'rgb(var(--bg-rgb) / <alpha-value>)',
  surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
  fg:      'rgb(var(--fg-rgb) / <alpha-value>)',
  'fg-muted': 'rgb(var(--fg-muted-rgb) / <alpha-value>)',
  accent:  'rgb(var(--accent-rgb) / <alpha-value>)',
  'accent-deep': 'rgb(var(--accent-deep-rgb) / <alpha-value>)',
  line:    'rgb(var(--line-rgb) / <alpha-value>)',
  scrim:   'rgb(var(--scrim-rgb) / <alpha-value>)',
}
```

Keep the old names (`cream`, `navy`, `accent`…) as aliases pointing at the same variables so
existing markup doesn't break in one big bang, then sweep `src/` and migrate usages. When the sweep
is done, delete the aliases. Also catch the raw literals: `border-white/[0.06]`,
`bg-navy-deep/85`, `text-cream/30`, `#050608`, `#f5f5f7`, `rgba(245,245,247,...)` in `globals.css`.

### 1b. Define both palettes

Light on bare `:root`, dark under `[data-theme='dark']`, with a `prefers-color-scheme` block for
visitors who haven't chosen yet.

| Token | Light (sunny) | Dark (rainy) |
| --- | --- | --- |
| `--bg` | `#FAF6EF` warm off-white | `#050608` |
| `--surface` | `#F2EBE0` | `#141820` |
| `--fg` | `#1A1512` warm near-black | `#F5F5F7` |
| `--fg-muted` | `#6B6259` | `#A1A1AA` |
| `--accent` | `#C2703D` terracotta | `#22D3EE` |
| `--accent-deep` | `#9A5228` | `#0891B2` |
| `--line` | `26 21 18` @ 0.10 | `245 245 247` @ 0.06 |
| `--scrim` | `250 246 239` warm white | `5 6 8` |

`#C2703D` on `#FAF6EF` is roughly 3.4:1 — **large text and UI only, not body copy**. Use
`--accent-deep` (~5.4:1) for inline links and anything at body size. Verify both ratios yourself
rather than trusting those numbers, and adjust the hex if either falls short of AA for its use.
Report what you measured.

### 1c. Make the toggle exist and light be the default

`toggleTheme` is exported from `ExperienceProvider` and **called nowhere** — `useExperience()` has
zero consumers in `src/`. The whole theme context is dead code.

- Build a toggle into `src/components/layout/Navigation.tsx`, matching its existing restraint —
  quiet uppercase monospace, a small sun/rain glyph or two-state text label, not a chunky pill
  switch. `aria-label` + `aria-pressed`.
- `ExperienceProvider` currently does `useState<Theme>('dark')`. Change the resolution order to:
  `localStorage` → `prefers-color-scheme` → **light**. Persist on toggle.
- Add an inline script in `layout.tsx` that stamps `data-theme` on `<html>` **before paint**, so
  there's no flash of the wrong theme. It must run the same resolution order.
- `layout.tsx` also hardcodes `viewport.themeColor: '#050608'` and `colorScheme: 'dark'`. Make
  `themeColor` an array with `media` variants for light and dark, and set
  `colorScheme: 'light dark'`.

### 1d. The scrim and the text shadow

`Hero()` and `ContactCta()` each pass a different hardcoded navy gradient through
`overlayClassName` (`from-navy-deep/85 via-navy-deep/10 via-[35%] to-navy-deep to-[62%]` on the
hero), and the hero copy depends on it for legibility. Once tokenised it flips with the theme, but
the *shape* must differ: on bright media a **light warm wash at lower opacity** (dark text needs
light behind it); on rainy, the deep dark gradient it is now. Drive it from `--scrim` plus a
`--scrim-strength` token rather than duplicating class strings across call sites.

`.text-legible` in `globals.css` is a dark text-shadow — on the sunny hero it puts a muddy halo
around every letter. Give it a light-theme counterpart (a soft light halo, or drop it and lean on
the scrim).

**Stage 1 checklist:** toggle works both directions · no flash on load · reload keeps the choice ·
both themes look deliberate, not inverted-by-accident · `npm run lint` and `npm run build` clean.

---

# Stage 2 — background media

I don't have the clips. Source them yourself from **Pexels Videos, Coverr or Mixkit** (free for
commercial use). Confirm the licence on each specific clip and give me the URLs at the end so I can
verify them myself.

### What to look for

This matters more than the subject. **Displacement reads as liquid on soft gradients and as glitch
on hard edges.**

- **Sunny:** shallow depth of field, haze, bokeh, golden hour. Good — out-of-focus sunlight through
  leaves, a meadow or wheat field in a soft breeze with the background thrown out, mist burning off
  hills at sunrise, calm water with diffuse highlights. Bad — crisp foliage against blown-out sky,
  hard specular sparkle, fast camera motion, a sharp horizon line.
- **Rainy:** rain on glass with bokeh behind, low cloud moving through forest, wet ground under
  diffused light. Bad — hard neon edges, sharp in-focus raindrop streaks.

Both slow. This is a background, not a showreel.

### Process each clip

Cut an 8–12 s segment that loops without a visible jump. Then:

```bash
# sunny — soften, lift shadows, warm
ffmpeg -ss 00:00:12 -t 10 -i sunny-source.mp4 \
  -vf "scale=1600:-2:flags=lanczos,fps=30,gblur=sigma=1.5,\
eq=contrast=0.90:brightness=0.03:saturation=1.02,\
colorbalance=rm=0.05:gm=0.01:bm=-0.05" \
  -c:v libx264 -profile:v high -crf 26 -pix_fmt yuv420p \
  -movflags +faststart -an public/videos/sunny.mp4

# rainy — soften, crush slightly, cool and desaturate
ffmpeg -ss 00:00:04 -t 10 -i rainy-source.mp4 \
  -vf "scale=1600:-2:flags=lanczos,fps=30,gblur=sigma=1.3,\
eq=contrast=0.92:brightness=-0.04:saturation=0.78,\
colorbalance=rm=-0.04:bm=0.07" \
  -c:v libx264 -profile:v high -crf 26 -pix_fmt yuv420p \
  -movflags +faststart -an public/videos/rainy.mp4

# posters, pulled from the graded video so the handoff is invisible
ffmpeg -ss 2 -i public/videos/sunny.mp4 -frames:v 1 -q:v 4 public/images/sunny-poster.jpg
ffmpeg -ss 2 -i public/videos/rainy.mp4 -frames:v 1 -q:v 4 public/images/rainy-poster.jpg
```

The `gblur` is the single most important step — it's what makes the displacement read as water
rather than digital tearing, and it cuts file size. Tune sigma per clip; raise it if the result
looks glitchy.

**Budget: under 4 MB per video.** Report the final sizes. If a clip won't fit, drop to 1280 wide
before raising CRF past 28.

### Rewire the config

```ts
// src/content/site.ts
export const media = {
  light: { video: '/videos/sunny.mp4', poster: '/images/sunny-poster.jpg' },
  dark:  { video: '/videos/rainy.mp4', poster: '/images/rainy-poster.jpg' },
}
```

Update both `AmbientVideo` call sites. Tell me if `public/images/ambient-poster.jpg` ends up
unreferenced.

### Loading strategy

**Never download both videos up front.**

- Fetch only the active theme's video.
- Preload the *inactive* theme's poster image (small, cheap) so the first toggle has something
  instantly.
- Fetch the inactive video only on first toggle; hold its poster until `readyState >= 2`.
- Keep the existing gating in `AmbientVideo`: no video under `prefers-reduced-motion`, under
  `navigator.connection.saveData`, or at `max-width: 768px`. Those visitors get the graded still and
  never pay for the download.

---

# Stage 3 — the trail canvas

Build `src/components/ui/WaterTrailCanvas.tsx` as a client component (`"use client"`), GL context
created in a `useEffect` keyed to a canvas `ref`. Write it as **one self-contained file first**,
then do the minimal wiring into `AmbientVideo` and `HomeContent`.

### Architecture

**Trail pass** — ping-ponged `RGBA16F` framebuffer at half canvas resolution. Per frame: decay by a
delta-time-derived factor, diffuse into neighbours with a 4-tap blur, then stamp a soft falloff blob
of pointer velocity **along the segment** between previous and current pointer position, so fast
movement doesn't leave gaps. RG holds push direction, B holds ripple energy.

```glsl
// trail pass — the shape of it
vec4 prev = texture(uPrev, vUv);

// half-life decay: energy falls to 50% every uLifetime seconds, frame-rate independent
float decay = exp(-uDt * (0.6931 / uLifetime));

vec4 blur = 0.25 * (
    texture(uPrev, vUv + vec2(uTexel.x, 0.0)) + texture(uPrev, vUv - vec2(uTexel.x, 0.0))
  + texture(uPrev, vUv + vec2(0.0, uTexel.y)) + texture(uPrev, vUv - vec2(0.0, uTexel.y)));

vec4 field = mix(prev, blur, uDiffusion) * decay;

// distance to the pointer's travel segment, aspect-corrected so the blob stays round
float d = sdSegment(vUv * uAspect, uPointerPrev * uAspect, uPointer * uAspect);
float fall = smoothstep(uRadius, 0.0, d);

field.rg += uVelocity * fall * uDt * 60.0;
field.b  += length(uVelocity) * fall * uDt * 60.0;
```

**Composite pass** — sample the background at `vUv + trail.rg * strength`, with a small per-channel
offset for faint colour separation, plus a signed brightness adjustment scaled by trail energy:

```glsl
vec3 t = texture(uTrail, vUv).rgb;
vec2 push = t.rg * uStrength;
float energy = t.b;

vec3 col;
col.r = sampleBg(vUv + push * (1.0 + uChroma)).r;
col.g = sampleBg(vUv + push).g;
col.b = sampleBg(vUv + push * (1.0 - uChroma)).b;

col += uLift * energy;                       // uLift is SIGNED — see theme params
col  = mix(col, col * uTint, clamp(energy, 0.0, 1.0));
```

`sampleBg()` does cover-fit against the real media dimensions **and** the theme crossfade:
`mix(texture(uTexA, uv), texture(uTexB, uv), uMix)`.

### Theme-dependent parameters

The trail pass is theme-agnostic. The composite pass is not — a positive brightness lift on bright
sunny footage clips straight to white and looks blown out, and chroma separation that reads as
subtle refraction on dark footage reads as a JPEG artifact on bright.

| Param | Light (sunny) | Dark (rainy) |
| --- | --- | --- |
| `lift` | `-0.04` — the wake reads as **refraction darkening**, not glare | `+0.06` |
| `chroma` | `0.008` | `0.02` |
| `tint` | warm, e.g. `vec3(1.03, 1.00, 0.95)` | cool, e.g. `vec3(0.96, 1.00, 1.04)` |
| `strength` | `0.06` | `0.06` |

Interpolate these across the crossfade too, so the toggle doesn't pop.

### Theme crossfade, in the shader

Hold two background textures and a `uMix` uniform; animate it over ~900 ms on toggle with an ease
instead of hard-swapping. And since you already have a velocity field: **on toggle, inject a radial
burst of trail energy centred on the toggle button's own screen position**, so the theme change
ripples outward from the button that was just clicked. Keep it subtle, ease it, make it disableable
from the config object.

### Hard requirements

- **Raw WebGL2 only.** No Three.js, no `@react-three/fiber`, no fluid-sim libraries.
- Frame-rate independent — decay and pointer easing from delta time, never a fixed per-frame
  constant.
- DPR capped at 2.
- Pause the loop on `visibilitychange`, and when the hero leaves the viewport
  (`IntersectionObserver`). The home page is long; the hero is one screenful.
- **Reduced motion:** don't add a third `matchMedia` listener — the repo already has
  `useReducedMotion()` in `src/hooks/useReducedMotion.ts` and `reducedMotion` on `useExperience()`.
  Use the hook. When true: no canvas at all, render the existing `next/image` poster path for the
  active theme, and the DOM `h1` displays normally (Stage 4).
- Pointer events, so touch works. Nothing breaks if the pointer never moves.
- **Pointer coordinates:** Lenis makes the visual scroll position lag the real one. Track
  `clientX`/`clientY` against a freshly-read `getBoundingClientRect()`. Don't cache the rect across
  scroll; don't assume `pageY - scrollY` lines up.
- `ResizeObserver` on the canvas's parent, not a window listener.
- **No GL objects in React state** — refs only.
- Full cleanup on unmount: cancel the frame, delete textures/framebuffers/programs, remove
  listeners, `loseContext()` so `next dev` Fast Refresh doesn't leak contexts.

### Config object at the top of the file

`strength`, `radius`, `lifetime`, `chroma`, `warpText`, `trailScale`, `diffusion`, `lift`, `tint`,
`burstOnToggle` — overridable by partial props. Start at `strength 0.06`, `radius 0.05`,
`lifetime 2.8`, `trailScale 0.5`.

### Wiring

- **One context, not two.** `AmbientVideo` is mounted twice in `HomeContent.tsx`. Add an opt-in prop
  (`trail?: boolean`); only `Hero()` passes it. `ContactCta()` keeps the current poster +
  `.ambient-kenburns` drift, now pointed at the per-theme poster.
- **Preserve the layer stack.** `AmbientVideo` renders a mirrored (`-scale-x-100`) `next/image`
  poster, an optional video, and a scrim `div`. Keep the `next/image` poster in the tree as the
  pre-GL and fallback layer so the hero keeps a real LCP image; hide it once the canvas has painted
  its first frame. **Keep the scrim as a DOM element above the canvas** — don't fold it into the
  shader, or Stage 1's theming stops applying to it.

---

# Stage 4 — warp the headline

Only the hero `h1` goes into the canvas. All body copy, teasers, nav and footer stay normal DOM.

Paint the headline into an offscreen 2D canvas, upload as a texture, composite it over the
background **before** the displacement sample, so text and background distort together.

The traps, in the order you'll hit them:

- **Measure the DOM; don't reimplement the layout.** My typography is `clamp()`-based
  (`text-display-xl` is `clamp(3.5rem, 8vw, 7rem)`) inside a `max-w-content` /
  `var(--section-padding)` container. Reproducing that in JS will drift from the CSS at some
  breakpoint. Keep a real `h1` in normal flow to reserve the space, read its
  `getBoundingClientRect()` and `getComputedStyle()`, and paint from those measured values. Hide it
  in a way that **still occupies layout and still measures** — `display:none` and
  `visibility:hidden` are both wrong.
- **Fonts.** The display face is Syne via `next/font/google`, exposed as `--font-syne`. Painting
  before it loads bakes a fallback-font texture that never updates. Await `document.fonts.ready`
  *and* an explicit `document.fonts.load()` for the exact size/weight string, and read the resolved
  family from `getComputedStyle` rather than hardcoding it.
- **Repaint on:** resize (debounced), DPR change, and **theme change** — the text colour inverts.
- **Accessibility and SEO.** A real `<h1>` stays in the DOM with the actual text (the `.sr-only`
  pattern already exists in `globals.css`). Canvas gets `aria-hidden` and `pointer-events-none`.
  Verify the page exposes exactly one `h1` to the accessibility tree and that the headline text is
  present in view-source.
- **The reveal animation conflicts.** The hero `h1` animates via `Reveal` with `mask` (GSAP
  `clip-path`), which can't drive a canvas texture. Replace it *for this one element* with a
  canvas-side reveal — animate an alpha or wipe uniform on load with the same easing feel. Leave
  `Reveal` itself untouched for every other element; do not refactor it.
- **Reduced motion:** no canvas, so the DOM `h1` must become visible and styled normally. Actually
  exercise that path, don't just write it.

---

# Stage 5 — the Izanami chrome

Small, high-leverage layout details from the reference that my site doesn't have. Keep them quiet —
these are frame, not content.

- **Vertical section label.** A rotated uppercase label pinned to the left edge below the logo,
  showing the current section (`WORK`, `PHILOSOPHY`, `ABOUT`…), tracking-wide, `fg-muted`. On the
  home page it updates as sections scroll past — reuse the existing ScrollTrigger setup rather than
  adding a scroll listener. Hide below `md`.
- **Bottom status strip.** Fixed, full-width, above the fold content: `©2026` far left, a live
  `HH:MM:SS` clock labelled `EAT, NAIROBI KE` centre, `SCROLL` far right (swapping to `TOP` as a
  scroll-to-top control once past the first viewport). Monospace, `text-[0.65rem]`, tracking-wide.
  Hydration-safe — the clock must not render a server/client mismatch.
- **Full-screen menu.** The nav's `MENU` opens a full-viewport overlay with the nav items at
  display size, staggered in. `CLOSE` to dismiss. Trap focus, close on `Escape`, restore focus to
  the trigger, lock body scroll while open (and pause Lenis).
- **Hairline rule** under section headings — a thin `line`-token divider that animates its width
  from 0 on reveal.

Everything here respects `prefers-reduced-motion` and both themes.

---

# Stage 6 — verify, then report

**Walk every state yourself before saying it's done:**

- light theme · dark theme · toggle both directions · reload persists the choice · no flash on load
- reduced-motion on — no canvas, DOM `h1` visible, no video downloaded
- mobile width — no video downloaded, poster only
- tab hidden then restored — loop pauses and resumes
- hero scrolled out and back — loop pauses and resumes
- five Fast Refreshes in a row in `next dev` — no "too many active WebGL contexts"
- `npm run lint` and `npm run build` both clean

**Then report, in this order:**

1. The two clip URLs and their licences.
2. Final video and poster file sizes, and the exact ffmpeg commands you ended up running (I'll need
   them when I swap a clip).
3. Measured contrast ratios for `--accent` and `--accent-deep` on `--bg`, both themes.
4. Whether anything in `src/` still imports `three` / `@react-three/fiber` / `@react-three/drei`.
5. Whether `public/images/ambient-poster.jpg` is still referenced.
6. A line-by-line walkthrough of the **trail pass** fragment shader — I want to understand the decay
   and diffusion maths, not just run it.
7. Anything you'd tune that you left at the starting values.

## Debugging notes

- Renders black → check `EXT_color_buffer_float`; `RGBA16F` render targets need it.
- Trail smears like paint instead of water → lifetime too high or diffusion too low.
- Stutters on mobile → drop `trailScale` to 0.35 before touching anything else.
- Sunny hero looks like a glitch effect → the clip has too many hard edges; raise `gblur` sigma in
  the ffmpeg step before touching the shader.
- Hero copy loses contrast → that's the scrim and `.text-legible`, not the shader.
- "Too many active WebGL contexts" → cleanup path, not render path.
- Everything looks dark-theme in light mode → a colour escaped the tokenisation in Stage 1.
