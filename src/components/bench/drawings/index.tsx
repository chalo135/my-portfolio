// The bench object drawings from the design canvas, as components.
// Every one is decorative (aria-hidden). Where the canvas said BG, the fill is
// the page background token (`fill-bg`), so holes show the desk in both themes.
// Text uses the hand (Caveat) font.

import type { SVGProps } from 'react'

export interface DrawingProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number
  height?: number
}

function svgProps(
  { width, height, ...rest }: DrawingProps,
  w: number,
  h: number
): SVGProps<SVGSVGElement> {
  return {
    viewBox: `0 0 ${w} ${h}`,
    width: width ?? w,
    height: height ?? h,
    'aria-hidden': true,
    focusable: false,
    ...rest,
  }
}

export function Notebook({ label = 'ideas', ...props }: DrawingProps & { label?: string }) {
  return (
    <svg {...svgProps(props, 170, 220)}>
      <rect width="170" height="220" rx="8" fill="#C9A27E" />
      <rect x="12" y="10" width="146" height="200" rx="4" fill="#B98F68" />
      <rect x="138" y="0" width="8" height="220" fill="#2A2622" />
      <text x="26" y="58" fontWeight="700" fontSize="30" fill="#2A2622" className="font-hand">
        {label}
      </text>
      <path
        d="M26 86c20-6 40 6 60 0s30-4 40 0M26 112c24-5 46 5 70 0M26 138c18-4 38 4 56 0"
        stroke="#5B4632"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Phone(props: DrawingProps) {
  return (
    <svg {...svgProps(props, 86, 164)}>
      <rect width="86" height="164" rx="14" fill="#222" />
      <rect x="6" y="14" width="74" height="136" rx="6" fill="#F5F1E6" />
      <rect x="16" y="96" width="12" height="40" rx="2" fill="#A8141C" />
      <rect x="34" y="72" width="12" height="64" rx="2" fill="#E3A92B" />
      <rect x="52" y="54" width="12" height="82" rx="2" fill="#2A2622" />
      <rect x="16" y="28" width="40" height="6" rx="3" fill="#2A2622" />
      <rect x="16" y="40" width="26" height="5" rx="2.5" fill="#B5AA94" />
    </svg>
  )
}

export function Mug(props: DrawingProps) {
  return (
    <svg {...svgProps(props, 124, 104)}>
      <rect x="86" y="40" width="34" height="22" rx="11" fill="none" stroke="#E2D7C2" strokeWidth="10" />
      <circle cx="52" cy="52" r="48" fill="#EEE6D6" stroke="#D8CCB4" strokeWidth="3" />
      <circle cx="52" cy="52" r="37" fill="#5A3A22" />
      <circle cx="40" cy="42" r="8" fill="#7A5638" />
    </svg>
  )
}

export function Pencil(props: DrawingProps) {
  return (
    <svg {...svgProps(props, 196, 18)}>
      <polygon points="0,9 22,1 22,17" fill="#E9C9A0" />
      <polygon points="0,9 8,6 8,12" fill="#2A2622" />
      <rect x="22" y="1" width="140" height="16" fill="#E3A92B" />
      <rect x="162" y="1" width="12" height="16" fill="#9AA3B5" />
      <rect x="174" y="1" width="22" height="16" rx="3" fill="#D98C8C" />
    </svg>
  )
}

export function Wrench(props: DrawingProps) {
  return (
    <svg {...svgProps(props, 250, 72)}>
      <rect x="40" y="28" width="168" height="16" rx="8" fill="#9AA3B5" />
      <circle cx="32" cy="36" r="28" fill="#9AA3B5" />
      <rect x="10" y="26" width="30" height="20" className="fill-bg" />
      <circle cx="222" cy="36" r="22" fill="#9AA3B5" />
      <circle cx="222" cy="36" r="10" className="fill-bg" />
    </svg>
  )
}

export function Leaf(props: DrawingProps) {
  return (
    <svg {...svgProps(props, 140, 74)}>
      <path d="M4 37C30 2 104 -4 136 37C104 78 30 72 4 37Z" fill="#4F8A5B" />
      <path
        d="M10 37H128M40 37l18-16M40 37l18 16M74 37l18-14M74 37l18 14"
        stroke="#3B6B45"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="52" cy="24" r="6" fill="#C77A2B" />
      <circle cx="94" cy="50" r="5" fill="#C77A2B" />
    </svg>
  )
}

export function Laptop(props: DrawingProps) {
  return (
    <svg {...svgProps(props, 364, 240)}>
      <rect width="364" height="240" rx="16" fill="#3B3B3B" />
      <rect x="14" y="12" width="336" height="124" rx="6" fill="#1E1E1E" />
      <rect x="30" y="30" width="70" height="8" rx="4" fill="#A8141C" />
      <rect x="108" y="30" width="120" height="8" rx="4" fill="#E9DFC8" />
      <rect x="46" y="48" width="96" height="8" rx="4" fill="#E3A92B" />
      <rect x="150" y="48" width="64" height="8" rx="4" fill="#8FB8DE" />
      <rect x="46" y="66" width="150" height="8" rx="4" fill="#E9DFC8" />
      <rect x="62" y="84" width="80" height="8" rx="4" fill="#8FB8DE" />
      <rect x="150" y="84" width="100" height="8" rx="4" fill="#E3A92B" />
      <rect x="30" y="102" width="40" height="8" rx="4" fill="#A8141C" />
      <line x1="40" y1="160" x2="324" y2="160" stroke="#555" strokeWidth="10" strokeDasharray="16 5" />
      <line x1="48" y1="176" x2="316" y2="176" stroke="#555" strokeWidth="10" strokeDasharray="16 5" />
      <line x1="56" y1="192" x2="308" y2="192" stroke="#555" strokeWidth="10" strokeDasharray="16 5" />
      <rect x="142" y="208" width="80" height="22" rx="4" fill="#333" />
    </svg>
  )
}

export function Sprocket(props: DrawingProps) {
  return (
    <svg {...svgProps(props, 124, 124)}>
      <circle cx="62" cy="62" r="54" fill="none" stroke="#4A4A4A" strokeWidth="14" strokeDasharray="9 7" />
      <circle cx="62" cy="62" r="48" fill="#4A4A4A" />
      <circle cx="62" cy="62" r="18" className="fill-bg" />
      <circle cx="62" cy="30" r="6" className="fill-bg" />
      <circle cx="62" cy="94" r="6" className="fill-bg" />
      <circle cx="30" cy="62" r="6" className="fill-bg" />
      <circle cx="94" cy="62" r="6" className="fill-bg" />
    </svg>
  )
}

export function Pen(props: DrawingProps) {
  return (
    <svg {...svgProps(props, 220, 20)}>
      <polygon points="0,10 20,3 20,17" fill="#2A2622" />
      <rect x="20" y="3" width="150" height="14" rx="2" fill="#A8141C" />
      <rect x="170" y="2" width="50" height="16" rx="4" fill="#2A2622" />
      <rect x="176" y="0" width="34" height="5" rx="2" fill="#9AA3B5" />
    </svg>
  )
}

export function Paperclip(props: DrawingProps) {
  return (
    <svg
      {...svgProps(props, 26, 62)}
      fill="none"
      stroke="#9AA3B5"
      strokeWidth="3"
      strokeLinecap="round"
    >
      <path d="M8 20V8a5 5 0 0 1 10 0v40a8 8 0 0 1-16 0V16" />
    </svg>
  )
}

export function Postmark(props: DrawingProps) {
  return (
    <svg {...svgProps(props, 96, 96)} fill="none" stroke="#2A2622" strokeWidth="2">
      <circle cx="48" cy="48" r="40" />
      <circle cx="48" cy="48" r="30" />
      <path d="M2 40c14-6 22 6 36 0s22 6 36 0 14 6 20 2M2 56c14-6 22 6 36 0s22 6 36 0 14 6 20 2" />
    </svg>
  )
}

/* --- arrows: stroke accent, width 3, round caps, no fill -------------------- */

export type ArrowName = 'arrow-curve' | 'arrow-down' | 'arrow-up'

const arrowSizes: Record<ArrowName, [number, number]> = {
  'arrow-curve': [60, 34],
  'arrow-down': [46, 52],
  'arrow-up': [30, 40],
}

export function Arrow({ name, ...props }: DrawingProps & { name: ArrowName }) {
  const [w, h] = arrowSizes[name]
  return (
    <svg
      {...svgProps(props, w, h)}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={['text-accent', props.className].filter(Boolean).join(' ')}
    >
      {name === 'arrow-curve' ? (
        <>
          <path d="M4 26C20 30 40 24 54 8" />
          <path d="M42 8h12v12" />
        </>
      ) : name === 'arrow-down' ? (
        <>
          <path d="M8 4C30 10 38 26 30 46" />
          <path d="M20 38l10 9 8-11" />
        </>
      ) : (
        <>
          <path d="M15 36V6" />
          <path d="M6 14l9-9 9 9" />
        </>
      )}
    </svg>
  )
}

/** Lookup for BenchObject. */
export const drawings = {
  notebook: Notebook,
  phone: Phone,
  mug: Mug,
  pencil: Pencil,
  wrench: Wrench,
  leaf: Leaf,
  laptop: Laptop,
  sprocket: Sprocket,
  pen: Pen,
} as const

export type BenchName = keyof typeof drawings
