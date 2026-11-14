// Canvas drawings for the 3D card's textures. Client only; imported by
// Lanyard.tsx, so it ships in the 3D chunk, not with the page.

import type { HomeCard } from '@/content/home'

export const CARD_COLORS = {
  crimson: '#A8141C',
  crimsonDark: '#7A0E14',
  gold: '#E3A92B',
  sand: '#E9DFC8',
  ink: '#2A2622',
  white: '#FFFFFF',
  location: '#F3E4E0',
  metal: '#9AA3B5',
  metalEdge: '#6B7488',
  buckle: '#1E1C1A',
  buckleLine: '#3A3632',
}

/** The card in CSS px, same as the static card. */
export const CARD_PX = { w: 210, h: 296, radius: 12 }
/** One strap length in CSS px: 7px of crimson between two 2px gold edges. */
export const STRAP_PX = { w: 11, edge: 2 }
/** The buckle's face in CSS px. */
export const BUCKLE_PX = { w: 28, h: 34, inset: 3 }
/** The card's shadow: `0 16px 30px`, as on the static card. */
export const SHADOW_PX = { offset: 16, blur: 30, margin: 64 }

/** Font family strings from the next/font CSS variables, with fallbacks. */
function families() {
  const css = getComputedStyle(document.documentElement)
  const sans = css.getPropertyValue('--font-sans').trim() || 'sans-serif'
  const hand = css.getPropertyValue('--font-hand').trim() || 'cursive'
  return { sans, hand }
}

/**
 * Waits for DM Sans and Caveat (the faces that cover `text`), then for every
 * pending font. Resolves to false if a face the card needs did not load, so
 * the caller can keep the static card instead of drawing a fallback font.
 */
export async function loadCardFonts(text: string): Promise<boolean> {
  const { sans, hand } = families()
  const wanted = [`700 14px ${sans}`, `400 13px ${sans}`, `700 40px ${hand}`]
  try {
    await Promise.all(wanted.map((font) => document.fonts.load(font, text)))
    await document.fonts.ready
    return wanted.every((font) => document.fonts.check(font, text))
  } catch {
    return false
  }
}

/** Loads and decodes the photo. Resolves to null if it can't. */
export async function loadPhoto(src?: string): Promise<HTMLImageElement | null> {
  if (!src) return null
  const img = new Image()
  img.src = src
  try {
    await img.decode()
    return img
  } catch {
    return null
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = Math.round(w)
  c.height = Math.round(h)
  const ctx = c.getContext('2d')
  if (!ctx) throw new Error('No 2D canvas')
  return { c, ctx }
}

/** Centred text with CSS-style letter spacing, also where canvas lacks it. */
function spacedText(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, spacing: number) {
  ctx.textAlign = 'left'
  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = `${spacing}px`
    // The width includes a trailing gap; CSS centres the box with it too.
    const width = ctx.measureText(text).width
    ctx.fillText(text, cx - width / 2, y)
    ctx.letterSpacing = '0px'
    return
  }
  const chars = [...text]
  const widths = chars.map((ch) => (ctx as CanvasRenderingContext2D).measureText(ch).width + spacing)
  let x = cx - widths.reduce((a, b) => a + b, 0) / 2
  chars.forEach((ch, i) => {
    ;(ctx as CanvasRenderingContext2D).fillText(ch, x, y)
    x += widths[i]
  })
}

/**
 * Front: the static card's design, drawn in CSS px and scaled by `scale`
 * texels per px. The slot and holes are cut in the geometry, not drawn.
 */
export function drawFront(card: HomeCard, photo: HTMLImageElement | null, scale: number): HTMLCanvasElement {
  const { w, h, radius } = CARD_PX
  const { c, ctx } = canvas(w * scale, h * scale)
  const { sans, hand } = families()
  ctx.scale(c.width / w, c.height / h)

  roundRect(ctx, 0, 0, w, h, radius)
  ctx.fillStyle = CARD_COLORS.crimson
  ctx.fill()

  // Plastic sleeve edge.
  roundRect(ctx, 4.5, 4.5, w - 9, h - 9, 8.5)
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 1
  ctx.stroke()

  // Name band.
  ctx.fillStyle = CARD_COLORS.white
  ctx.font = `700 14px ${sans}`
  ctx.textBaseline = 'alphabetic'
  spacedText(ctx, card.name, w / 2, 39.8, 1.68)

  // Photo, or the monogram.
  const px = 14
  const py = 50
  const pw = w - 28
  const ph = 172
  ctx.save()
  roundRect(ctx, px, py, pw, ph, 6)
  ctx.clip()
  ctx.fillStyle = CARD_COLORS.sand
  ctx.fillRect(px, py, pw, ph)
  if (photo) {
    // object-fit: cover
    const s = Math.max(pw / photo.naturalWidth, ph / photo.naturalHeight)
    const dw = photo.naturalWidth * s
    const dh = photo.naturalHeight * s
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(photo, px + (pw - dw) / 2, py + (ph - dh) / 2, dw, dh)
  } else {
    ctx.fillStyle = CARD_COLORS.crimson
    ctx.font = `700 112px ${hand}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('C', w / 2, py + ph / 2 + 4)
  }
  ctx.restore()

  // Role and place.
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = CARD_COLORS.white
  ctx.font = `700 15px ${sans}`
  ctx.fillText(card.role, 16, py + ph + 12 + 14)
  ctx.fillStyle = CARD_COLORS.location
  ctx.font = `400 13px ${sans}`
  ctx.fillText(card.location, 16, py + ph + 12 + 14 + 19)

  // Footer strip, inside the rounded corners.
  ctx.save()
  roundRect(ctx, 0, 0, w, h, radius)
  ctx.clip()
  ctx.fillStyle = CARD_COLORS.crimsonDark
  ctx.fillRect(0, h - 10, w, 10)
  ctx.restore()

  return c
}

/** Back: near-black with `chalo` in Caveat, gold, centred. */
export function drawBack(word: string, scale: number): HTMLCanvasElement {
  const { w, h, radius } = CARD_PX
  const { c, ctx } = canvas(w * scale, h * scale)
  const { hand } = families()
  ctx.scale(c.width / w, c.height / h)
  roundRect(ctx, 0, 0, w, h, radius)
  ctx.fillStyle = CARD_COLORS.ink
  ctx.fill()
  ctx.fillStyle = CARD_COLORS.gold
  ctx.font = `700 62px ${hand}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(word, w / 2, h / 2)
  return c
}

/**
 * One strap length, across the line: crimson with two thin gold edges. The
 * colour does not change along the strap, so the texture is only 4 texels long.
 */
export function drawStrap(): HTMLCanvasElement {
  const k = 4
  const { c, ctx } = canvas(4, STRAP_PX.w * k)
  ctx.fillStyle = CARD_COLORS.gold
  ctx.fillRect(0, 0, 4, STRAP_PX.w * k)
  ctx.fillStyle = CARD_COLORS.crimson
  ctx.fillRect(0, STRAP_PX.edge * k, 4, (STRAP_PX.w - 2 * STRAP_PX.edge) * k)
  return c
}

/** The buckle's face inside its rounded edge: the moulded window and ridge. */
export function drawBuckle(): HTMLCanvasElement {
  const k = 8
  const { w, h, inset } = BUCKLE_PX
  const { c, ctx } = canvas((w - inset * 2) * k, (h - inset * 2) * k)
  ctx.scale(k, k)
  ctx.translate(-inset, -inset)
  ctx.fillStyle = CARD_COLORS.buckle
  ctx.fillRect(0, 0, w, h)
  roundRect(ctx, 4, 4, 20, 10, 2)
  ctx.strokeStyle = CARD_COLORS.buckleLine
  ctx.lineWidth = 1.5
  ctx.stroke()
  roundRect(ctx, 5, 19, 18, 2, 1)
  ctx.fillStyle = CARD_COLORS.buckleLine
  ctx.fill()
  return c
}

/**
 * The card's soft shadow as white on clear, tinted by the material. The card
 * outline sits in the middle with `SHADOW_PX.margin` around it.
 */
export function drawShadow(): HTMLCanvasElement {
  const { w, h, radius } = CARD_PX
  const { margin, blur } = SHADOW_PX
  const { c, ctx } = canvas(w + margin * 2, h + margin * 2)
  // Draw the card far off the canvas so only its shadow lands on it.
  const away = 4000
  ctx.shadowColor = '#FFFFFF'
  ctx.shadowBlur = blur
  ctx.shadowOffsetX = away
  ctx.fillStyle = '#FFFFFF'
  roundRect(ctx, margin - away, margin, w, h, radius)
  ctx.fill()
  return c
}
