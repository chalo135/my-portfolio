// Writes the raster icons from the same drawing as src/app/icon.svg.
//
//   node scripts/make-icons.mjs
//
// Run by hand when the icon changes; the outputs are committed.
//   src/app/apple-icon.png  180x180, square corners (iOS rounds them itself,
//                           and paints transparent corners black)
//   src/app/favicon.ico     16, 32 and 48 px, for clients that ask for
//                           /favicon.ico without reading the page
//
// Uses sharp, which is installed with Next.

import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const APP = join(process.cwd(), 'src', 'app')

// Literal copies of --accent-rgb and --paper-rgb (light), as in icon.svg.
const CRIMSON = '#A8141C'
const CREAM = '#FBF7EE'
const C_PATH =
  'M43 22c-3.5-4-9.5-5-14.5-2.5C22 23 19 31 21.5 38c2.4 6.6 9.6 9.6 16 7.2 2.6-1 4.7-2.6 6.3-4.6'

const svg = (radius) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
      `<rect width="64" height="64" rx="${radius}" fill="${CRIMSON}"/>` +
      `<path d="${C_PATH}" fill="none" stroke="${CREAM}" stroke-width="6.5" stroke-linecap="round"/>` +
      `</svg>`
  )

const png = (radius, size) =>
  sharp(svg(radius), { density: (72 * size) / 64 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer()

/** An .ico file holding PNG images (valid since Windows Vista). */
function ico(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(images.length, 4)
  let offset = 6 + 16 * images.length
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size, 0) // width
    entry.writeUInt8(size, 1) // height
    entry.writeUInt16LE(1, 4) // colour planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += data.length
    return entry
  })
  return Buffer.concat([header, ...entries, ...images.map((image) => image.data)])
}

// Flattened: the apple icon carries no alpha channel.
const apple = await sharp(await png(0, 180)).flatten({ background: CRIMSON }).png().toBuffer()
await writeFile(join(APP, 'apple-icon.png'), apple)

const sizes = [16, 32, 48]
const images = await Promise.all(sizes.map(async (size) => ({ size, data: await png(14, size) })))
await writeFile(join(APP, 'favicon.ico'), ico(images))

console.log('Wrote src/app/apple-icon.png and src/app/favicon.ico')
