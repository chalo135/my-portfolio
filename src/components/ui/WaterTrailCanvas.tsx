'use client'

import { useEffect, useRef, useState } from 'react'
import { useExperience } from '@/providers/ExperienceProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/* ---------------------------------------------------------------------------
   Config
   --------------------------------------------------------------------------- */

export interface WaterTrailConfig {
  /** How far the trail pushes the background, in UV units. */
  strength: number
  /** Radius of the pointer stamp, in units of canvas height. */
  radius: number
  /** Seconds for trail energy to fall to 50%. */
  lifetime: number
  /** Per-channel offset multiplier for the colour separation. */
  chroma: number
  /** Paint the hero heading into the canvas so it distorts with the media. */
  warpText: boolean
  /** Trail framebuffer size relative to the canvas. Drop to 0.35 on weak GPUs. */
  trailScale: number
  /** 0 = no diffusion, 1 = fully replaced by the 4-tap blur each step. */
  diffusion: number
  /** SIGNED brightness added where the wake is strongest. */
  lift: number
  /** Multiplicative tint applied in the wake. */
  tint: [number, number, number]
  /** Ripple outward from the theme toggle when the theme changes. */
  burstOnToggle: boolean
}

/** Light (crimson board) defaults. */
const LIGHT_CONFIG: WaterTrailConfig = {
  strength: 0.06,
  radius: 0.05,
  lifetime: 2.8,
  chroma: 0.008,
  warpText: true,
  trailScale: 0.5,
  diffusion: 0.16,
  // On crimson the wake is cloth catching the light: a small lift toward white
  // at the edge, and a body that deepens toward the cloak shadow (#7A0F15).
  // The previous blue-leaning tint (0.96, 0.97, 1.06) was tuned for the old yellow board
  // and turned crimson pink-violet. Lift stays small: more than ~0.03 on red
  // reads as pink rather than as light.
  lift: 0.02,
  tint: [0.88, 0.86, 0.86],
  burstOnToggle: true,
}

/** Night (gold board) overrides. Only the composite-pass values differ; the
 *  trail simulation itself is theme-agnostic. */
const DARK_OVERRIDES = {
  // White-on-blue fringes read as neon at 0.02; oxblood on gold is calmer,
  // and a little over half of that still reads as refraction.
  chroma: 0.012,
  // On gold the wake darkens toward oxblood instead of lifting toward white,
  // which would wash gold out to cream. No hue of its own: in night the
  // "shadow" colour (accent-deep) is the gold itself.
  lift: -0.03,
  tint: [1.0, 1.0, 1.0] as [number, number, number],
}

/** The graded clips are mirrored by AmbientVideo's poster layer, so the canvas
 *  mirrors too — otherwise the poster→canvas handoff visibly flips. */
const MIRROR_BACKGROUND = true

const DPR_CAP = 1.5
/** Hard ceiling on the trail simulation buffer. The field is a low-frequency
 *  blur; past this it costs bandwidth without adding detail. */
const TRAIL_MAX_DIM = 900
/** Frames sampled before deciding whether this GPU can carry the effect, and
 *  the mean frame time above which it demonstrably cannot. */
const PERF_SAMPLE_FRAMES = 40
const PERF_WARMUP_FRAMES = 8
const PERF_BUDGET_MS = 22
/** Second, earlier gate. Waiting for the full sample means 48 slow frames,
 *  which on a genuinely bad GPU is several seconds of jank before the bail-out
 *  fires. A device this far over budget is not going to recover. */
const PERF_EARLY_FRAMES = 12
const PERF_EARLY_BUDGET_MS = 40
/** sessionStorage flag, so the verdict survives client-side navigation instead
 *  of being re-measured (and re-suffered) on every route change. */
const PERF_KEY = 'water-trail:degraded'
const CROSSFADE_MS = 900
const REVEAL_MS = 1400
const BURST_MS = 950
/** How strongly the bare board colour is restored around the heading's
 *  glyphs. It is not a glow: it clears the blended media out from behind the
 *  type, so the heading sits on plain board (7.6:1 white on crimson). */
const HALO_ALPHA = 0.72

/* ---------------------------------------------------------------------------
   Shaders
   --------------------------------------------------------------------------- */

const VERT = `#version 300 es
out vec2 vUv;
void main() {
  // Fullscreen triangle. vUv.y = 0 at the bottom, which matches the
  // UNPACK_FLIP_Y_WEBGL uploads used for every image/video/text texture.
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`

const TRAIL_FRAG = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform sampler2D uPrev;
uniform vec2  uTexel;        // 1 / trail framebuffer size
uniform vec2  uAspect;       // (width/height, 1.0) — keeps stamps round
uniform vec2  uPointer;      // current pointer, UV
uniform vec2  uPointerPrev;  // previous pointer, UV
uniform vec2  uVelocity;     // UV per second-ish, already smoothed
uniform float uDt;           // seconds since last frame
uniform float uLifetime;     // seconds to half energy
uniform float uDiffusion;
uniform float uRadius;
uniform vec4  uBurst;        // xy = centre UV, z = ring radius, w = amount

// Distance from p to the segment ab. Stamping along the segment the pointer
// travelled — rather than at a single point — is what stops fast flicks from
// leaving a dotted trail of separate blobs.
float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  vec4 prev = texture(uPrev, vUv);

  // Half-life decay. Energy falls to 50% every uLifetime seconds regardless of
  // frame rate: at 30fps dt is twice as large, so the exponent is twice as
  // negative and one frame decays exactly as much as two frames at 60fps.
  float decay = exp(-uDt * (0.6931 / uLifetime));

  // 4-tap box blur of the neighbours. This is the "water" half of the look:
  // it lets a stamp bleed outward into still field over successive frames.
  vec4 blur = 0.25 * (
      texture(uPrev, vUv + vec2(uTexel.x, 0.0)) + texture(uPrev, vUv - vec2(uTexel.x, 0.0))
    + texture(uPrev, vUv + vec2(0.0, uTexel.y)) + texture(uPrev, vUv - vec2(0.0, uTexel.y)));

  vec4 field = mix(prev, blur, uDiffusion) * decay;

  // Aspect-correct before measuring distance so the falloff is a circle on
  // screen, not an ellipse stretched by the canvas ratio.
  float d = sdSegment(vUv * uAspect, uPointerPrev * uAspect, uPointer * uAspect);
  float fall = smoothstep(uRadius, 0.0, d);

  // uDt * 60 normalises the deposit to "per 60fps frame", so the same gesture
  // deposits the same energy on a 30Hz and a 144Hz display.
  field.rg += uVelocity * fall * uDt * 60.0;
  field.b  += length(uVelocity) * fall * uDt * 60.0;

  // Expanding annulus from the theme toggle. JS grows uBurst.z and fades
  // uBurst.w, so this reads as one ring travelling outward.
  if (uBurst.w > 0.0) {
    vec2 delta = (vUv - uBurst.xy) * uAspect;
    float dist = length(delta);
    float ring =
        smoothstep(uBurst.z + 0.16, uBurst.z, dist)
      * smoothstep(uBurst.z - 0.20, uBurst.z - 0.04, dist);
    vec2 dir = dist > 1e-5 ? delta / dist : vec2(0.0);
    field.rg += dir * ring * uBurst.w;
    field.b  += ring * uBurst.w;
  }

  outColor = field;
}`

const COMPOSITE_FRAG = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform sampler2D uTrail;
uniform sampler2D uLightTex;
uniform sampler2D uDarkTex;
uniform sampler2D uText;
uniform vec3  uBoardLight;   // the crimson board
uniform vec3  uBoardDark;    // the gold board
uniform float uMediaLight;   // how much sunny media is multiplied into the board
uniform float uMediaDark;    // how much rainy media is screened into the board

uniform vec2  uLightScale;   // cover-fit scale for the light media
uniform vec2  uDarkScale;    // cover-fit scale for the dark media
uniform float uMix;          // 0 = sunny, 1 = rainy
uniform float uStrength;
uniform float uChroma;
uniform float uLift;
uniform vec3  uTint;
uniform float uTextAlpha;
uniform float uReveal;       // 0..1 wipe of the painted heading
uniform vec4  uTextRect;     // x0, y0, x1, y1 of the heading in UV
uniform float uMirror;       // 1.0 = flip the background horizontally
uniform vec3  uInk;          // heading colour, lerped across the crossfade
uniform vec3  uHalo;         // board colour restored behind the heading
uniform float uHaloAlpha;

vec2 cover(vec2 uv, vec2 scale) {
  return (uv - 0.5) * scale + 0.5;
}

// The media is painted INTO the board, not laid over it: the same blend
// AmbientVideo's DOM poster uses (.board-media), so the poster-to-canvas
// handoff matches. Multiply on both boards, crimson and gold, each at its own
// opacity. Multiply only darkens: white on crimson can only gain contrast, and
// the gold board's opacity is held low enough that oxblood on it stays 7:1.
// Done per theme and then crossfaded, so a toggle dissolves one finished board
// into the other.
vec3 background(vec2 uv) {
  vec2 b = vec2(mix(uv.x, 1.0 - uv.x, uMirror), uv.y);
  vec3 sunny = texture(uLightTex, cover(b, uLightScale)).rgb;
  vec3 rainy = texture(uDarkTex, cover(b, uDarkScale)).rgb;
  vec3 day = mix(uBoardLight, uBoardLight * sunny, uMediaLight);
  vec3 night = mix(uBoardDark, uBoardDark * rainy, uMediaDark);
  return mix(day, night, uMix);
}

// The heading is composited over the background *before* the displacement
// sample below, so type and media are pushed by exactly the same vector.
vec3 scene(vec2 uv) {
  vec3 bg = background(uv);
  if (uTextAlpha <= 0.0) return bg;

  // The texture is a pure coverage mask, no colour. Keeping colour *out* of it
  // means a theme change costs nothing: the ink and halo are uniforms, so they
  // crossfade with the media instead of needing the whole heading
  // re-rasterised (and re-rasterising on a theme change would read stale
  // tokens anyway — child effects run before the provider has stamped the new
  // data-theme).
  //
  // Two masks in one texture (see paintHeading): alpha is glyphs plus their
  // soft spread, red is the glyphs alone. Red is uploaded un-premultiplied, so
  // r * a gives glyph coverage back. This used to be one alpha channel split
  // by a smoothstep threshold, and inside small enclosed counters (b, d, o)
  // the spread piled up past the threshold and filled them with half-ink.
  // Named coverage rather than cover: the latter would shadow the cover()
  // helper above, which GLSL permits but some drivers are unhappy about.
  vec4 coverage = texture(uText, uv);
  float ink = coverage.r * coverage.a;
  float halo = coverage.a;

  // Left-to-right wipe in the heading's own local x, so the reveal reads the
  // same regardless of where the heading sits on screen.
  float local = (uv.x - uTextRect.x) / max(uTextRect.z - uTextRect.x, 1e-4);
  float wipe = clamp((uReveal * 1.22 - local) / 0.22, 0.0, 1.0);

  vec3 c = mix(bg, uHalo, halo * uHaloAlpha * uTextAlpha * wipe);
  return mix(c, uInk, ink * uTextAlpha * wipe);
}

void main() {
  vec3 t = texture(uTrail, vUv).rgb;
  vec2 push = t.rg * uStrength;
  float energy = t.b;

  // Sampling each channel at a slightly different offset gives the wake a
  // faint refractive edge. Kept much smaller on bright media, where it would
  // otherwise read as a JPEG artifact rather than as water.
  vec3 col;
  col.r = scene(vUv + push * (1.0 + uChroma)).r;
  col.g = scene(vUv + push).g;
  col.b = scene(vUv + push * (1.0 - uChroma)).b;

  col += uLift * energy;
  col = mix(col, col * uTint, clamp(energy, 0.0, 1.0));

  outColor = vec4(col, 1.0);
}`

/**
 * Reads a theme's colours without switching the page to it, by probing an
 * element carrying that theme's data-theme attribute. Keeps the palette in
 * globals.css as the single source of truth instead of duplicating the hexes
 * here, and lets the shader interpolate ink and board across the crossfade.
 *
 * The ink is the heading's real computed colour: the probe carries the same
 * `.signboard` class and the same `color: rgb(var(--fg-rgb))` the hero <h1>
 * gets, so getComputedStyle returns exactly what the DOM heading would be in
 * that theme — white on crimson, oxblood on gold. It is read from a probe, not
 * from the <h1> itself, for two reasons: once `canvas-painted` is on, the
 * <h1>'s computed colour is `transparent`; and on a toggle, child effects run
 * before the provider stamps the new data-theme, so reading the live heading
 * at that moment returns the OLD theme's colour. Both themes are read once,
 * up front, and the shader crossfades between them, so a toggle needs no
 * re-rasterisation and can never show the previous theme's colour.
 */
function readPalette(theme: 'light' | 'dark') {
  const probe = document.createElement('div')
  probe.setAttribute('data-theme', theme)
  probe.className = 'signboard'
  probe.style.cssText =
    'position:absolute;width:0;height:0;opacity:0;pointer-events:none;color:rgb(var(--fg-rgb))'
  document.body.appendChild(probe)
  const cs = getComputedStyle(probe)
  const parse = (name: string, fallback: [number, number, number]) => {
    const parts = cs.getPropertyValue(name).trim().split(/[\s,]+/).map(Number)
    return parts.length === 3 && parts.every((n) => Number.isFinite(n))
      ? ([parts[0] / 255, parts[1] / 255, parts[2] / 255] as [number, number, number])
      : fallback
  }
  const parseColor = (value: string, fallback: [number, number, number]) => {
    const parts = value.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? []
    return parts.length === 3 && parts.every((n) => Number.isFinite(n))
      ? ([parts[0] / 255, parts[1] / 255, parts[2] / 255] as [number, number, number])
      : fallback
  }
  // Fallbacks mirror globals.css: on-accent white / oxblood, board crimson / gold.
  const fg = parseColor(cs.color, theme === 'dark' ? [0.227, 0.051, 0.075] : [1, 1, 1])
  const board = parse('--board-rgb', theme === 'dark' ? [0.929, 0.71, 0.278] : [0.659, 0.078, 0.11])
  const mediaRaw = parseFloat(cs.getPropertyValue('--board-media'))
  const media = Number.isFinite(mediaRaw) ? mediaRaw : theme === 'dark' ? 0.11 : 0.3
  probe.remove()
  return { fg, board, media }
}

/* ---------------------------------------------------------------------------
   GL helpers
   --------------------------------------------------------------------------- */

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[WaterTrail] shader:', gl.getShaderInfoLog(shader))
    }
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function link(gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, vertSrc)
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc)
  if (!vs || !fs) return null
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  // The shaders are attached to the program, which keeps them alive; deleting
  // the handles now means the program owns the only reference.
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[WaterTrail] link:', gl.getProgramInfoLog(program))
    }
    gl.deleteProgram(program)
    return null
  }
  return program
}

function uniforms(gl: WebGL2RenderingContext, program: WebGLProgram) {
  const map: Record<string, WebGLUniformLocation | null> = {}
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i)
    if (info) map[info.name] = gl.getUniformLocation(program, info.name)
  }
  return map
}

function makeTexture(gl: WebGL2RenderingContext) {
  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  return tex
}

interface Target {
  fb: WebGLFramebuffer | null
  tex: WebGLTexture | null
}

function makeTarget(
  gl: WebGL2RenderingContext,
  w: number,
  h: number,
  internal: number
): Target {
  const tex = makeTexture(gl)
  gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null)
  const fb = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
  return { fb, tex }
}

/* ---------------------------------------------------------------------------
   Media slots
   --------------------------------------------------------------------------- */

type MediaSource = { video: string; poster: string }

/** One background layer. Starts as the poster still and upgrades in place to
 *  the video once that has decoded enough to show (readyState >= 2). */
interface Slot {
  tex: WebGLTexture | null
  width: number
  height: number
  /** Dimensions the texture storage was last allocated at. While the incoming
   *  frame matches these, uploads go through texSubImage2D and reuse it. */
  allocW: number
  allocH: number
  video: HTMLVideoElement | null
  videoReady: boolean
  wantsVideo: boolean
  requested: boolean
}

/* ---------------------------------------------------------------------------
   Heading painting
   --------------------------------------------------------------------------- */

interface PaintedText {
  canvas: HTMLCanvasElement
  /** Heading bounds in canvas UV space, for the reveal wipe. */
  rect: [number, number, number, number]
}

/**
 * Paints the hero heading into an offscreen 2D canvas at device resolution.
 *
 * The layout is *measured*, never recomputed: the real <h1> stays in normal
 * flow (transparent, but laid out and measurable), and every glyph is drawn at
 * the exact position the browser put it, taken from per-character Range rects.
 * That means clamp() sizing, max-w wrapping, text-balance and letter-spacing
 * all come along for free instead of being approximated in JS and drifting at
 * some breakpoint.
 */
function paintHeading(
  heading: HTMLElement,
  hostRect: { left: number; top: number; width: number; height: number },
  dpr: number
): PaintedText | null {
  const width = Math.round(hostRect.width * dpr)
  const height = Math.round(hostRect.height * dpr)
  if (width <= 0 || height <= 0) return null

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const cs = getComputedStyle(heading)
  const fontSize = parseFloat(cs.fontSize) || 16
  // The family is read off the element, so the canvas type always matches
  // whatever the stylesheet resolved for the heading.
  ctx.textBaseline = 'alphabetic'
  ctx.scale(dpr, dpr)
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`
  // Coverage only — the shader supplies the colour, so a theme toggle never
  // needs this re-rasterised. Two passes build two masks (see scene() in the
  // composite shader): first every glyph in pure blue with a blue shadow,
  // which fills alpha with the glyphs plus the area to clear down to bare
  // board; then every glyph again in white with no shadow, which is the only
  // thing that puts anything in the red channel. All shadowed glyphs go down
  // before any white one, or a later glyph's shadow would tint an earlier
  // glyph's body.
  const metrics = ctx.measureText('Hxg')
  const ascent = metrics.fontBoundingBoxAscent || metrics.actualBoundingBoxAscent || fontSize * 0.8
  const descent = metrics.fontBoundingBoxDescent || metrics.actualBoundingBoxDescent || fontSize * 0.2

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  const glyphs: { ch: string; x: number; baseline: number }[] = []

  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT)
  const range = document.createRange()

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeValue ?? ''
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]
      if (ch === ' ' || ch === '\n' || ch === '\t') continue
      range.setStart(node, i)
      range.setEnd(node, i + 1)
      const r = range.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) continue

      const x = r.left - hostRect.left
      // Centre the font box inside the measured line box, then step down to
      // the alphabetic baseline.
      const baseline = r.top - hostRect.top + (r.height - (ascent + descent)) / 2 + ascent
      glyphs.push({ ch, x, baseline })

      if (x < minX) minX = x
      if (x + r.width > maxX) maxX = x + r.width
      if (r.top - hostRect.top < minY) minY = r.top - hostRect.top
      if (r.bottom - hostRect.top > maxY) maxY = r.bottom - hostRect.top
    }
  }
  range.detach()

  if (glyphs.length === 0) return null

  ctx.fillStyle = '#00f'
  ctx.shadowColor = '#00f'
  ctx.shadowBlur = fontSize * 0.3
  for (const g of glyphs) ctx.fillText(g.ch, g.x, g.baseline)

  ctx.fillStyle = '#fff'
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  for (const g of glyphs) ctx.fillText(g.ch, g.x, g.baseline)

  return {
    canvas,
    rect: [
      minX / hostRect.width,
      1 - maxY / hostRect.height,
      maxX / hostRect.width,
      1 - minY / hostRect.height,
    ],
  }
}

/* ---------------------------------------------------------------------------
   Component
   --------------------------------------------------------------------------- */

interface WaterTrailCanvasProps {
  sources: { light: MediaSource; dark: MediaSource }
  /** The hero <h1>. Measured, then painted into the canvas. */
  headingRef?: React.RefObject<HTMLElement | null>
  /** Whether this visitor may download a video at all (save-data, small
   *  screens and reduced motion get the graded still instead). */
  allowVideo: boolean
  config?: Partial<WaterTrailConfig>
  /** Reports whether the canvas is painting real frames, so the DOM poster can
   *  fade out — and fade back in if the canvas ever goes away. */
  onFirstFrame?: (painting: boolean) => void
  /** Reports whether the canvas holds a texture of the heading. Only when this
   *  is true may the DOM <h1> go transparent: the font wait means "first frame"
   *  and "first frame *with type in it*" can be hundreds of milliseconds apart,
   *  and hiding the DOM heading at the earlier moment leaves a visible hole.
   *  It reports false again on teardown, so a visitor who turns reduced motion
   *  on does not end up with an invisible headline. */
  onTextPainted?: (painted: boolean) => void
  /** The heading's text. Not rendered — it exists so a headline change can
   *  trigger a repaint. See the effect at the bottom of this component. */
  textKey?: string
  className?: string
}

export default function WaterTrailCanvas({
  sources,
  headingRef,
  allowVideo,
  config,
  onFirstFrame,
  onTextPainted,
  textKey,
  className,
}: WaterTrailCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGL2RenderingContext | null>(null)
  const { theme, toggleOrigin } = useExperience()
  const reducedMotion = useReducedMotion()

  // Starts false on both server and client so hydration matches, then adopts a
  // verdict reached earlier in the session.
  const [degraded, setDegraded] = useState(false)
  const degradeRef = useRef<() => void>(() => {})

  useEffect(() => {
    try {
      // Through degradeRef, not setDegraded: this path tears the canvas down
      // too, so it needs the same hand-back-before-unmount ordering. Going
      // straight to setDegraded left the <h1> transparent with no canvas for a
      // frame on every navigation after the verdict was stored.
      if (sessionStorage.getItem(PERF_KEY)) degradeRef.current?.()
    } catch {
      // Storage unavailable — measure again this page load.
    }
  }, [])

  // Live values the render loop reads without needing to be torn down.
  const themeRef = useRef(theme)
  const firstFrameRef = useRef(onFirstFrame)
  const textPaintedRef = useRef(onTextPainted)
  const repaintTextRef = useRef<(() => void) | null>(null)
  const burstRef = useRef<{ x: number; y: number; start: number } | null>(null)
  themeRef.current = theme
  firstFrameRef.current = onFirstFrame
  textPaintedRef.current = onTextPainted

  /**
   * Hand the heading and the poster back BEFORE the state change that unmounts
   * the canvas. The effect cleanup reports them too, but it runs after React
   * has already removed the canvas from the DOM, which left the <h1>
   * transparent with nothing drawing it for a frame. Declared after the refs it
   * closes over so the ordering is obvious; the cleanup's duplicate call is
   * harmless because both are idempotent setState.
   */
  degradeRef.current = () => {
    textPaintedRef.current?.(false)
    firstFrameRef.current?.(false)
    setDegraded(true)
  }

  const cfg: WaterTrailConfig = { ...LIGHT_CONFIG, ...config }
  const cfgRef = useRef(cfg)
  cfgRef.current = cfg

  const lightSrc = sources.light
  const darkSrc = sources.dark

  /* --- the GL effect. Keyed only on things that require a full rebuild. --- */
  useEffect(() => {
    if (reducedMotion || degraded) return
    // `degraded` cannot be true on the first render — it has to start false so
    // server and client markup agree — so the stored verdict is re-checked here
    // as well. Without this the pipeline would initialise and paint the heading
    // once on every navigation after a bail-out, handing the <h1> to a canvas
    // that is about to be unmounted.
    try {
      if (sessionStorage.getItem(PERF_KEY)) {
        degradeRef.current?.()
        return
      }
    } catch {
      // Storage unavailable — fall through and measure.
    }
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return

    // One context per canvas element, reused across mounts. getContext() would
    // hand back the same object anyway; holding it in a ref makes that explicit
    // and lets the deferred teardown below know whether it is still ours.
    const gl =
      glRef.current ??
      canvas.getContext('webgl2', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: false,
        powerPreference: 'high-performance',
      })
    if (!gl || gl.isContextLost()) return
    glRef.current = gl

    // RGBA16F render targets are not colour-renderable without this. Without a
    // float target the RG channels could not hold a signed push direction, so
    // there is no sensible fallback — bail and let the DOM poster stand.
    const floatExt =
      gl.getExtension('EXT_color_buffer_float') ??
      gl.getExtension('EXT_color_buffer_half_float')
    if (!floatExt) return
    gl.getExtension('OES_texture_float_linear')

    /* --- programs --- */
    const trailProgram = link(gl, VERT, TRAIL_FRAG)
    const compositeProgram = link(gl, VERT, COMPOSITE_FRAG)
    if (!trailProgram || !compositeProgram) {
      if (trailProgram) gl.deleteProgram(trailProgram)
      if (compositeProgram) gl.deleteProgram(compositeProgram)
      return
    }
    const trailU = uniforms(gl, trailProgram)
    const compU = uniforms(gl, compositeProgram)

    // WebGL2 requires a bound VAO even for an attribute-less fullscreen
    // triangle generated from gl_VertexID.
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    /* --- state --- */
    let raf = 0
    let disposed = false
    let visible = true
    let onScreen = true
    let running = false
    let lastTime = 0
    let painted = false

    // Runtime perf probe. A weak integrated GPU has no other escape hatch: the
    // effect would simply run at 10fps forever and take the whole tab with it.
    let perfFrames = 0
    let perfTotal = 0
    let bailed = false

    let cssW = 0
    let cssH = 0
    let dpr = 1
    let trailW = 1
    let trailH = 1

    let targets: [Target, Target] | null = null
    let readIndex = 0

    const textTex = makeTexture(gl)
    let textAllocW = 0
    let textAllocH = 0
    let textAlpha = 0
    let textRect: [number, number, number, number] = [0, 0, 1, 1]

    // Crossfade + reveal clocks.
    let mix = theme === 'dark' ? 1 : 0
    let mixFrom = mix
    let mixTo = mix
    let mixStart = -1
    let revealStart = -1

    // Pointer state. clientX/clientY are stored raw and converted to UV against
    // a cached canvas rect. Reading the rect inside the frame loop is a forced
    // synchronous layout on the same tick Lenis is driving scroll on, so it is
    // read only when something can actually have moved it: a resize, or a
    // scroll (coalesced to at most one read per frame by `rectDirty`).
    let rectLeft = 0
    let rectTop = 0
    let rectWidth = 1
    let rectHeight = 1
    let rectDirty = true

    const readRect = () => {
      const r = canvas.getBoundingClientRect()
      rectLeft = r.left
      rectTop = r.top
      rectWidth = r.width
      rectHeight = r.height
      rectDirty = false
    }

    const invalidateRect = () => {
      rectDirty = true
    }
    window.addEventListener('scroll', invalidateRect, { passive: true })
    window.addEventListener('resize', invalidateRect, { passive: true })

    let clientX = -1
    let clientY = -1
    let hasPointer = false
    let uvX = 0.5
    let uvY = 0.5
    let prevUvX = 0.5
    let prevUvY = 0.5
    let velX = 0
    let velY = 0

    const slots: Record<'light' | 'dark', Slot> = {
      light: { tex: null, width: 1, height: 1, allocW: 0, allocH: 0, video: null, videoReady: false, wantsVideo: false, requested: false },
      dark: { tex: null, width: 1, height: 1, allocW: 0, allocH: 0, video: null, videoReady: false, wantsVideo: false, requested: false },
    }

    /* --- textures ------------------------------------------------------- */

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)

    const seedSlot = (key: 'light' | 'dark') => {
      const slot = slots[key]
      slot.tex = makeTexture(gl)
      // 1x1 mid-grey until the poster decodes, so the very first frame is not
      // an undefined-texture flash.
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([190, 180, 165, 255]))
      slot.allocW = 1
      slot.allocH = 1
    }

    /** Uploads a frame into a slot, reallocating storage only when the source
     *  dimensions actually change. texImage2D every frame re-creates the whole
     *  texture; texSubImage2D writes into storage the driver already has. */
    const uploadSlot = (slot: Slot, source: TexImageSource, w: number, h: number) => {
      gl.bindTexture(gl.TEXTURE_2D, slot.tex)
      if (w !== slot.allocW || h !== slot.allocH) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
        slot.allocW = w
        slot.allocH = h
        return
      }
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, source)
    }
    seedSlot('light')
    seedSlot('dark')

    const loadPoster = (key: 'light' | 'dark', url: string) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.decoding = 'async'
      img.onload = () => {
        if (disposed) return
        const slot = slots[key]
        // Do not clobber a video that has already taken over this slot.
        if (slot.videoReady) return
        slot.width = img.naturalWidth
        slot.height = img.naturalHeight
        uploadSlot(slot, img, img.naturalWidth, img.naturalHeight)
      }
      img.src = url
    }
    // Both posters load immediately: they are ~30 KB each, and having the
    // inactive one resident is what makes the first toggle instant.
    loadPoster('light', lightSrc.poster)
    loadPoster('dark', darkSrc.poster)

    const requestVideo = (key: 'light' | 'dark') => {
      const slot = slots[key]
      if (!allowVideo || slot.requested) return
      slot.requested = true
      const video = document.createElement('video')
      video.src = key === 'light' ? lightSrc.video : darkSrc.video
      video.muted = true
      video.loop = true
      video.playsInline = true
      video.preload = 'auto'
      video.crossOrigin = 'anonymous'
      // Kept out of the document: it is a texture source, not a visible layer.
      video.style.display = 'none'
      slot.video = video
      slot.wantsVideo = true
      video.addEventListener('loadeddata', () => {
        if (disposed) return
        // readyState >= 2 (HAVE_CURRENT_DATA) is the point at which there is a
        // frame to upload; before that the poster keeps standing in.
        if (video.readyState >= 2) slot.videoReady = true
      })
      void video.play().catch(() => {})
    }
    // Only the active theme's video is fetched up front. The other is fetched
    // on first toggle, below.
    requestVideo(theme === 'dark' ? 'dark' : 'light')

    const uploadVideoFrames = () => {
      for (const key of ['light', 'dark'] as const) {
        const slot = slots[key]
        const video = slot.video
        if (!slot.videoReady || !video || video.paused || video.readyState < 2) continue
        slot.width = video.videoWidth || slot.width
        slot.height = video.videoHeight || slot.height
        uploadSlot(slot, video, video.videoWidth, video.videoHeight)
      }
    }

    /* --- heading -------------------------------------------------------- */

    const palette = { light: readPalette('light'), dark: readPalette('dark') }

    const repaintText = () => {
      const heading = headingRef?.current
      if (!cfgRef.current.warpText || !heading || cssW === 0) return
      readRect()
      const result = paintHeading(
        heading,
        { left: rectLeft, top: rectTop, width: rectWidth, height: rectHeight },
        dpr
      )
      if (!result) return
      textRect = result.rect
      gl.bindTexture(gl.TEXTURE_2D, textTex)
      if (result.canvas.width !== textAllocW || result.canvas.height !== textAllocH) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, result.canvas)
        textAllocW = result.canvas.width
        textAllocH = result.canvas.height
      } else {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, result.canvas)
      }
      const firstPaint = textAlpha === 0
      textAlpha = 1
      if (revealStart < 0) revealStart = performance.now()
      if (firstPaint) textPaintedRef.current?.(true)
    }

    /**
     * Never paint the heading in the fallback face.
     *
     * paintHeading() takes glyph POSITIONS from live Range rects but draws the
     * glyphs themselves with ctx.font, so both have to be measured against the
     * same face. Cinzel loads with `display: 'swap'`: painting before it lands
     * bakes the fallback serif into the texture, and the DOM <h1> goes
     * transparent over it. So nothing is painted until the display face has
     * loaded — until then the DOM heading simply stays visible — and the
     * texture is repainted again whenever another font finishes loading.
     *
     * The family is read from the heading's computed style rather than
     * hard-coded, because next/font renames it (e.g. "__cinzel_1a2b3c").
     */
    let fontReady = false
    const repaintWhenReady = () => {
      if (fontReady) repaintText()
    }
    repaintTextRef.current = repaintWhenReady

    const waitForDisplayFont = async () => {
      const heading = headingRef?.current
      if (typeof document === 'undefined' || !document.fonts || !heading) return
      const cs = getComputedStyle(heading)
      const first = cs.fontFamily.split(',')[0].trim()
      const family = /^["']/.test(first) ? first : `"${first}"`
      await document.fonts.load(`${cs.fontWeight} 1em ${family}`)
      await document.fonts.ready
    }
    waitForDisplayFont()
      .catch(() => {
        // Font Loading API missing or the load failed. The DOM heading is in
        // the fallback face too, so painting it now still matches.
      })
      .finally(() => {
        if (disposed) return
        fontReady = true
        repaintText()
      })
    const onFontsLoaded = () => {
      if (!disposed) repaintWhenReady()
    }
    document.fonts?.addEventListener('loadingdone', onFontsLoaded)

    /* --- sizing --------------------------------------------------------- */

    const resize = () => {
      const rect = host.getBoundingClientRect()
      const nextDpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
      const w = Math.max(1, Math.round(rect.width))
      const h = Math.max(1, Math.round(rect.height))
      if (w === cssW && h === cssH && nextDpr === dpr) return

      cssW = w
      cssH = h
      dpr = nextDpr
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`

      const trailFit = Math.min(
        1,
        TRAIL_MAX_DIM / Math.max(canvas.width, canvas.height, 1)
      )
      const trailFactor = cfgRef.current.trailScale * trailFit
      trailW = Math.max(2, Math.round(canvas.width * trailFactor))
      trailH = Math.max(2, Math.round(canvas.height * trailFactor))

      if (targets) {
        for (const t of targets) {
          gl.deleteFramebuffer(t.fb)
          gl.deleteTexture(t.tex)
        }
      }
      const internal = gl.RGBA16F
      targets = [
        makeTarget(gl, trailW, trailH, internal),
        makeTarget(gl, trailW, trailH, internal),
      ]
      // Clear both so the first read is a defined zero field.
      for (const t of targets) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, t.fb)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

      repaintWhenReady()
    }

    // ResizeObserver on the parent, not a window listener: the hero can change
    // height without the window doing anything (font swap, address bar, etc).
    let resizeTimer = 0
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(resize, 120)
      // Size the drawing buffer immediately; only the (expensive) text repaint
      // is debounced inside resize().
      if (!targets) resize()
    })
    ro.observe(host)
    resize()

    /* --- pause / resume -------------------------------------------------- */

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((e) => e.isIntersecting)
        sync()
      },
      { threshold: 0 }
    )
    io.observe(host)

    const onVisibility = () => {
      visible = document.visibilityState !== 'hidden'
      for (const key of ['light', 'dark'] as const) {
        const video = slots[key].video
        if (!video) continue
        if (visible && onScreen) void video.play().catch(() => {})
        else video.pause()
      }
      sync()
    }
    document.addEventListener('visibilitychange', onVisibility)

    function sync() {
      const shouldRun = visible && onScreen && !disposed
      for (const key of ['light', 'dark'] as const) {
        const video = slots[key].video
        if (!video) continue
        if (shouldRun) void video.play().catch(() => {})
        else video.pause()
      }
      if (shouldRun && !running) {
        running = true
        // The listener lives only while the canvas is on-screen and the tab is
        // visible — a pointermove handler on every page that ever mounted a
        // hero is exactly the kind of thing that adds up.
        window.addEventListener('pointermove', onPointerMove, { passive: true })
        lastTime = performance.now()
        // A resumed loop starts its warm-up over: the first frames back are
        // full of texture re-uploads and say nothing about steady-state cost.
        perfFrames = 0
        perfTotal = 0
        raf = requestAnimationFrame(frame)
      } else if (!shouldRun && running) {
        running = false
        window.removeEventListener('pointermove', onPointerMove)
        cancelAnimationFrame(raf)
      }
    }

    /* --- pointer --------------------------------------------------------- */

    const onPointerMove = (e: PointerEvent) => {
      clientX = e.clientX
      clientY = e.clientY
      hasPointer = true
    }

    /* --- frame ----------------------------------------------------------- */

    function frame(now: number) {
      // `canvas` and `gl` are const and non-null by the guards at the top of
      // the effect, but this is a hoisted declaration so TypeScript drops that
      // narrowing here. Re-stating it costs one comparison per frame.
      if (disposed || !targets || !canvas || !gl) return
      raf = requestAnimationFrame(frame)

      // Clamped so a backgrounded tab or a long GC pause cannot deposit one
      // enormous timestep into the simulation.
      const dt = Math.min(Math.max((now - lastTime) / 1000, 0.0001), 0.05)
      lastTime = now
      const c = cfgRef.current

      // At most one layout read per frame, and only when a scroll or resize has
      // actually invalidated the cache.
      if (rectDirty) readRect()

      /* pointer → uv, against the cached rect */
      prevUvX = uvX
      prevUvY = uvY
      if (hasPointer) {
        if (rectWidth > 0 && rectHeight > 0) {
          const targetX = (clientX - rectLeft) / rectWidth
          const targetY = 1 - (clientY - rectTop) / rectHeight
          // Exponential smoothing written in terms of dt, so the easing feels
          // identical at 30, 60 and 144 Hz.
          const k = 1 - Math.exp(-dt * 22)
          uvX += (targetX - uvX) * k
          uvY += (targetY - uvY) * k
        }
      }
      velX = (uvX - prevUvX) / dt
      velY = (uvY - prevUvY) / dt
      // Deposit is proportional to speed but bounded, so a flick across the
      // screen does not saturate the field.
      const speed = Math.hypot(velX, velY)
      const clampScale = speed > 3 ? 3 / speed : 1

      /* theme crossfade */
      const targetMix = themeRef.current === 'dark' ? 1 : 0
      if (targetMix !== mixTo) {
        mixFrom = mix
        mixTo = targetMix
        mixStart = now
        requestVideo(targetMix === 1 ? 'dark' : 'light')
      }
      if (mixStart >= 0) {
        const p = Math.min((now - mixStart) / CROSSFADE_MS, 1)
        // easeInOutCubic — no pop at either end of the swap.
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
        mix = mixFrom + (mixTo - mixFrom) * e
        if (p >= 1) mixStart = -1
      }

      /* per-theme composite params, interpolated across the crossfade */
      const lerp = (a: number, b: number) => a + (b - a) * mix
      const chroma = lerp(c.chroma, DARK_OVERRIDES.chroma)
      const lift = lerp(c.lift, DARK_OVERRIDES.lift)
      const tintR = lerp(c.tint[0], DARK_OVERRIDES.tint[0])
      const tintG = lerp(c.tint[1], DARK_OVERRIDES.tint[1])
      const tintB = lerp(c.tint[2], DARK_OVERRIDES.tint[2])
      const inkR = lerp(palette.light.fg[0], palette.dark.fg[0])
      const inkG = lerp(palette.light.fg[1], palette.dark.fg[1])
      const inkB2 = lerp(palette.light.fg[2], palette.dark.fg[2])
      const haloR = lerp(palette.light.board[0], palette.dark.board[0])
      const haloG = lerp(palette.light.board[1], palette.dark.board[1])
      const haloB = lerp(palette.light.board[2], palette.dark.board[2])

      /* burst */
      let burstX = 0
      let burstY = 0
      let burstRadius = 0
      let burstAmount = 0
      const burst = burstRef.current
      if (burst && c.burstOnToggle) {
        const p = (now - burst.start) / BURST_MS
        if (p >= 1) {
          burstRef.current = null
        } else {
          burstX = (burst.x - rectLeft) / Math.max(rectWidth, 1)
          burstY = 1 - (burst.y - rectTop) / Math.max(rectHeight, 1)
          // Radius eases outward while the amount falls away, so it reads as a
          // single ring travelling out rather than a pulsing blob.
          burstRadius = (1 - Math.pow(1 - p, 3)) * 1.5
          burstAmount = (1 - p) * (1 - p) * 0.9
        }
      }

      uploadVideoFrames()

      /* ---- trail pass ---- */
      const read = targets[readIndex]
      const write = targets[1 - readIndex]
      gl.useProgram(trailProgram)
      gl.bindFramebuffer(gl.FRAMEBUFFER, write.fb)
      gl.viewport(0, 0, trailW, trailH)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, read.tex)
      gl.uniform1i(trailU.uPrev ?? null, 0)
      gl.uniform2f(trailU.uTexel ?? null, 1 / trailW, 1 / trailH)
      gl.uniform2f(trailU.uAspect ?? null, cssW / Math.max(cssH, 1), 1)
      gl.uniform2f(trailU.uPointer ?? null, uvX, uvY)
      gl.uniform2f(trailU.uPointerPrev ?? null, prevUvX, prevUvY)
      gl.uniform2f(trailU.uVelocity ?? null, velX * clampScale * 0.02, velY * clampScale * 0.02)
      gl.uniform1f(trailU.uDt ?? null, dt)
      gl.uniform1f(trailU.uLifetime ?? null, c.lifetime)
      gl.uniform1f(trailU.uDiffusion ?? null, c.diffusion)
      gl.uniform1f(trailU.uRadius ?? null, c.radius)
      gl.uniform4f(trailU.uBurst ?? null, burstX, burstY, burstRadius, burstAmount)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      readIndex = 1 - readIndex

      /* ---- composite pass ---- */
      const canvasAspect = canvas.width / Math.max(canvas.height, 1)
      const coverScale = (slot: Slot): [number, number] => {
        const ta = slot.width / Math.max(slot.height, 1)
        return canvasAspect > ta ? [1, ta / canvasAspect] : [canvasAspect / ta, 1]
      }
      const [lsx, lsy] = coverScale(slots.light)
      const [dsx, dsy] = coverScale(slots.dark)

      let reveal = 1
      if (revealStart >= 0) {
        const p = Math.min((now - revealStart) / REVEAL_MS, 1)
        reveal = 1 - Math.pow(1 - p, 4) // expo.out, matching Reveal's feel
      } else {
        reveal = 0
      }

      gl.useProgram(compositeProgram)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, write.tex)
      gl.uniform1i(compU.uTrail ?? null, 0)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, slots.light.tex)
      gl.uniform1i(compU.uLightTex ?? null, 1)
      gl.activeTexture(gl.TEXTURE2)
      gl.bindTexture(gl.TEXTURE_2D, slots.dark.tex)
      gl.uniform1i(compU.uDarkTex ?? null, 2)
      gl.activeTexture(gl.TEXTURE3)
      gl.bindTexture(gl.TEXTURE_2D, textTex)
      gl.uniform1i(compU.uText ?? null, 3)
      gl.uniform3f(compU.uBoardLight ?? null, ...palette.light.board)
      gl.uniform3f(compU.uBoardDark ?? null, ...palette.dark.board)
      gl.uniform1f(compU.uMediaLight ?? null, palette.light.media)
      gl.uniform1f(compU.uMediaDark ?? null, palette.dark.media)
      gl.uniform2f(compU.uLightScale ?? null, lsx, lsy)
      gl.uniform2f(compU.uDarkScale ?? null, dsx, dsy)
      gl.uniform1f(compU.uMix ?? null, mix)
      gl.uniform1f(compU.uStrength ?? null, c.strength)
      gl.uniform1f(compU.uChroma ?? null, chroma)
      gl.uniform1f(compU.uLift ?? null, lift)
      gl.uniform3f(compU.uTint ?? null, tintR, tintG, tintB)
      gl.uniform1f(compU.uTextAlpha ?? null, textAlpha)
      gl.uniform1f(compU.uReveal ?? null, reveal)
      gl.uniform4f(compU.uTextRect ?? null, textRect[0], textRect[1], textRect[2], textRect[3])
      gl.uniform1f(compU.uMirror ?? null, MIRROR_BACKGROUND ? 1 : 0)
      gl.uniform3f(compU.uInk ?? null, inkR, inkG, inkB2)
      gl.uniform3f(compU.uHalo ?? null, haloR, haloG, haloB)
      gl.uniform1f(compU.uHaloAlpha ?? null, HALO_ALPHA)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      if (!painted) {
        painted = true
        firstFrameRef.current?.(true)
      }

      /* ---- runtime perf verdict ---- */
      if (!bailed) {
        perfFrames++
        // The warm-up frames are shader compilation, first texture uploads and
        // the poster decode landing; they are not representative of the loop.
        if (perfFrames > PERF_WARMUP_FRAMES) {
          perfTotal += dt * 1000
          const sampled = perfFrames - PERF_WARMUP_FRAMES
          const early = sampled === PERF_EARLY_FRAMES &&
            perfTotal / PERF_EARLY_FRAMES > PERF_EARLY_BUDGET_MS
          if (early || sampled >= PERF_SAMPLE_FRAMES) {
            const mean = perfTotal / sampled
            if (early || mean > PERF_BUDGET_MS) {
              bailed = true
              try {
                sessionStorage.setItem(PERF_KEY, '1')
              } catch {
                // Private mode — the verdict just won't survive navigation.
              }
              // Unmounts the canvas, which runs the teardown below; that hands
              // the heading and the poster back to the DOM.
              degradeRef.current?.()
              return
            }
            // Fast enough. Stop sampling.
            bailed = true
          }
        }
      }
    }

    sync()

    /* --- teardown -------------------------------------------------------- */
    return () => {
      disposed = true
      running = false
      cancelAnimationFrame(raf)
      // Hand the heading and the poster back to the DOM. Without this, turning
      // reduced motion on after the canvas has painted leaves the <h1>
      // transparent with nothing drawing it.
      textPaintedRef.current?.(false)
      firstFrameRef.current?.(false)
      window.clearTimeout(resizeTimer)
      repaintTextRef.current = null
      document.fonts?.removeEventListener('loadingdone', onFontsLoaded)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', invalidateRect)
      window.removeEventListener('resize', invalidateRect)

      for (const key of ['light', 'dark'] as const) {
        const slot = slots[key]
        if (slot.video) {
          slot.video.pause()
          slot.video.removeAttribute('src')
          slot.video.load()
          slot.video = null
        }
        if (slot.tex) gl.deleteTexture(slot.tex)
      }
      gl.deleteTexture(textTex)
      if (targets) {
        for (const t of targets) {
          gl.deleteFramebuffer(t.fb)
          gl.deleteTexture(t.tex)
        }
      }
      gl.deleteVertexArray(vao)
      gl.deleteProgram(trailProgram)
      gl.deleteProgram(compositeProgram)

      // Dropping the context is what stops `next dev` Fast Refresh from
      // leaking one per edit until the browser starts killing the oldest
      // ("too many active WebGL contexts"). But it is permanent: a canvas
      // whose context has been lost hands the same dead context back to the
      // next getContext() call, and every getExtension() on it returns null.
      //
      // React StrictMode mounts, unmounts and remounts in development on the
      // *same* canvas node, so losing the context here unconditionally would
      // leave the surviving mount with a context that can never draw. Deferring
      // by a task tells the two cases apart: on a real unmount React has
      // detached the node by then, on a remount it is still in the document.
      const doomed = canvas
      window.setTimeout(() => {
        if (!doomed.isConnected) {
          glRef.current = null
          gl.getExtension('WEBGL_lose_context')?.loseContext()
        }
      }, 0)
    }
    // Rebuild only on things that invalidate the whole pipeline. `theme` is
    // read through a ref so a toggle crossfades instead of tearing down.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, degraded, allowVideo, lightSrc.video, lightSrc.poster, darkSrc.video, darkSrc.poster])

  /**
   * Repaint when the heading's text changes.
   *
   * Declared AFTER the pipeline effect so repaintTextRef is populated by the
   * time this first runs. The heading's text is not in the pipeline effect's
   * deps, and repaintText() is otherwise only called from resize() — so a
   * headline that changes without changing the hero's height would leave a
   * stale texture on screen over a transparent <h1>, showing the wrong
   * language or nothing at all.
   */
  useEffect(() => {
    repaintTextRef.current?.()
  }, [textKey])

  /* Feed the toggle's screen position to the shader for the ripple. */
  useEffect(() => {
    if (!toggleOrigin) return
    burstRef.current = { x: toggleOrigin.x, y: toggleOrigin.y, start: performance.now() }
  }, [toggleOrigin])

  // No canvas at all once degraded: the DOM poster is already back (the
  // teardown reported onFirstFrame(false)) and is a better result than a
  // 10fps shader.
  if (reducedMotion || degraded) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}
