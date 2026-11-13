import { Caveat, DM_Sans } from 'next/font/google'

// DM Sans for everything, headings included. Caveat for the handwritten
// notes, the logo, captions and the notebook values. Both self-hosted by
// next/font at build time; `display: 'swap'` paints the fallback first.
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-hand',
  display: 'swap',
})

/** Both font variables, for the className on <html>. */
export const fontVariables = `${dmSans.variable} ${caveat.variable}`
