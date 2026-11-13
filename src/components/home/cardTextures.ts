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
  buckle: '#1E1C1A',
}

/** The card in CSS px, same as the static card. */
export const CARD_PX = { w: 210, h: 296, radius: 12 }

/** Font family strings from the next/font CSS variables, with fallbacks. */
function families() {
  const css = getComputedStyle(document.documentElement)
  const sans = css.getPropertyValue('--font-sans').trim() || 'sans-serif'
  const hand = css.getPropertyValue('--font-hand').trim() || 'cursive'
  return { sans, hand }
}

/** Waits for DM Sans and Caveat, then for every pending font. */
export async function loadCardFonts() {
  const { sans, hand } = families()
  try {
    await Promise.all([
      document.fonts.load(`700 14px ${sans}`),
      document.fonts.load(`400 13px ${sans}`),
      document.fonts.load(`700 40px ${hand}`),
    ])
    await document.fonts.ready
  } catch {
    // Fallback fonts still draw a readable card.
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
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  if (!ctx) throw new Error('No 2D canvas')
  return { c, ctx }
}

/** Front, 1024x1440: the static card's design, drawn in CSS px and scaled. */
export function drawFront(card: HomeCard, photo: HTMLImageElement | null): HTMLCanvasElement {
  const { c, ctx } = canvas(1024, 1440)
  const { sans, hand } = families()
  const { w, h, radius } = CARD_PX
  ctx.scale(1024 / w, 1440 / h)

  roundRect(ctx, 0, 0, w, h, radius)
  ctx.fillStyle = CARD_COLORS.crimson
  ctx.fill()

  // Plastic sleeve edge.
  roundRect(ctx, 4.5, 4.5, w - 9, h - 9, 9)
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 1
  ctx.stroke()

  // Name band.
  ctx.fillStyle = CARD_COLORS.white
  ctx.font = `700 14px ${sans}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.letterSpacing = '1.68px'
  ctx.fillText(card.name, w / 2 + 0.84, 40)
  ctx.letterSpacing = '0px'

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
export function drawBack(word: string): HTMLCanvasElement {
  const { c, ctx } = canvas(1024, 1440)
  const { hand } = families()
  roundRect(ctx, 0, 0, 1024, 1440, (CARD_PX.radius * 1024) / CARD_PX.w)
  ctx.fillStyle = CARD_COLORS.ink
  ctx.fill()
  ctx.fillStyle = CARD_COLORS.gold
  ctx.font = `700 300px ${hand}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(word, 512, 720)
  return c
}

/**
 * Strap, 512x64. Two lengths side by side (the lanyard loop), each crimson
 * with thin gold edges, a clear gap between them.
 */
export function drawStrap(): HTMLCanvasElement {
  const { c, ctx } = canvas(512, 64)
  const band = (y: number, hgt: number) => {
    ctx.fillStyle = CARD_COLORS.gold
    ctx.fillRect(0, y, 512, hgt)
    ctx.fillStyle = CARD_COLORS.crimson
    ctx.fillRect(0, y + 3, 512, hgt - 6)
  }
  band(0, 29)
  band(35, 29)
  return c
}
