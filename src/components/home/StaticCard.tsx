import Image from 'next/image'
import type { HomeCard } from '@/content/home'

// Literal light colours: the card is a real object and looks the same on the
// night desk.
const CRIMSON = '#A8141C'
const CRIMSON_DARK = '#7A0E14'
const GOLD = '#E3A92B'
const SAND = '#E9DFC8'
const METAL = '#9AA3B5'
const METAL_EDGE = '#6B7488'
const BUCKLE = '#1E1C1A'
const BUCKLE_LINE = '#3A3632'

/**
 * Server component. The ID card hanging from its lanyard, drawn in SVG and
 * CSS. It is what screen readers get, and what everyone sees until (and
 * unless) the 3D card takes over.
 *
 * Hangs from the top centre of its stage, tilted -3deg around the strap top.
 * The strap starts 40px above the stage; the card sits at 136px.
 */
export default function StaticCard({ card, photo }: { card: HomeCard; photo?: string }) {
  return (
    <div
      role="img"
      aria-label={card.alt}
      className="absolute left-1/2 top-[-40px] h-[472px] w-[210px] -ml-[105px]"
      style={{ transform: 'rotate(-3deg)', transformOrigin: '50% 0' }}
    >
      <Lanyard />
      <div
        className="absolute left-0 top-[176px] h-[296px] w-[210px] overflow-hidden rounded-[12px] shadow-card"
        style={{ backgroundColor: CRIMSON }}
      >
        {/* The holder's slot: a rounded slot with a small hole either side. */}
        <span aria-hidden className="absolute left-1/2 top-[7px] block h-[8px] w-[64px] -translate-x-1/2 rounded-full bg-bg" />
        <span aria-hidden className="absolute left-[calc(50%-46px)] top-[8px] block h-[6px] w-[6px] rounded-full bg-bg" />
        <span aria-hidden className="absolute left-[calc(50%+40px)] top-[8px] block h-[6px] w-[6px] rounded-full bg-bg" />
        {/* The plastic sleeve's inner edge. */}
        <span aria-hidden className="pointer-events-none absolute inset-[4px] rounded-[9px] border border-white/15" />

        <div className="flex h-[50px] items-end justify-center pb-[10px]">
          <span className="font-sans text-[14px] font-bold leading-none tracking-[0.12em] text-white">{card.name}</span>
        </div>

        <div className="relative mx-[14px] h-[172px] overflow-hidden rounded-[6px]" style={{ backgroundColor: SAND }}>
          {photo ? (
            <Image src={photo} alt="" width={182} height={172} className="h-full w-full object-cover" priority draggable={false} />
          ) : (
            // No photo yet: the monogram stands in.
            <span
              aria-hidden
              className="flex h-full w-full items-center justify-center font-hand text-[112px] font-bold leading-none"
              style={{ color: CRIMSON }}
            >
              C
            </span>
          )}
        </div>

        <div className="px-[16px] pb-[12px] pt-[12px]">
          <p className="text-[15px] font-bold leading-tight text-white">{card.role}</p>
          <p className="mt-[3px] text-[13px] leading-tight" style={{ color: '#F3E4E0' }}>
            {card.location}
          </p>
        </div>

        <span aria-hidden className="absolute inset-x-0 bottom-0 block h-[10px]" style={{ backgroundColor: CRIMSON_DARK }} />
      </div>
    </div>
  )
}

/**
 * Two strap lengths meeting at a black plastic buckle, a swivel ring, then a
 * metal snap hook whose loop goes through the card's slot. Coordinates start
 * at the strap top, 40px above the stage; the card's top edge is at 176.
 * The 3D card (Lanyard.tsx) is laid out from the same numbers.
 */
function Lanyard() {
  return (
    <svg
      aria-hidden
      focusable={false}
      width={80}
      height={196}
      viewBox="0 0 80 196"
      className="absolute left-1/2 top-0 z-10 -ml-[40px] overflow-visible"
    >
      {/* Strap lengths: gold edges, crimson face. */}
      <g strokeLinecap="butt">
        {/* On the desk the straps carry on up, behind the header. */}
        <g className="hidden min-[900px]:block">
          <line x1="16.31" y1="-58" x2="23.12" y2="1" stroke={GOLD} strokeWidth="11" />
          <line x1="16.31" y1="-58" x2="23.12" y2="1" stroke={CRIMSON} strokeWidth="7" />
          <line x1="63.69" y1="-58" x2="56.88" y2="1" stroke={GOLD} strokeWidth="11" />
          <line x1="63.69" y1="-58" x2="56.88" y2="1" stroke={CRIMSON} strokeWidth="7" />
        </g>
        <line x1="23" y1="0" x2="35" y2="104" stroke={GOLD} strokeWidth="11" />
        <line x1="23" y1="0" x2="35" y2="104" stroke={CRIMSON} strokeWidth="7" />
        <line x1="57" y1="0" x2="45" y2="104" stroke={GOLD} strokeWidth="11" />
        <line x1="57" y1="0" x2="45" y2="104" stroke={CRIMSON} strokeWidth="7" />
      </g>

      {/* Buckle, and the tab the swivel hangs from. */}
      <rect x="26" y="96.7" width="28" height="34" rx="4" fill={BUCKLE} />
      <rect x="30" y="100.7" width="20" height="10" rx="2" fill="none" stroke={BUCKLE_LINE} strokeWidth="1.5" />
      <rect x="31" y="115.7" width="18" height="2" rx="1" fill={BUCKLE_LINE} />
      <rect x="34" y="128.7" width="12" height="9" rx="1.5" fill={BUCKLE} />

      {/* Swivel ring and the hook's barrel. */}
      <circle cx="40" cy="139.2" r="5" fill="none" stroke={METAL_EDGE} strokeWidth="3.4" />
      <circle cx="40" cy="139.2" r="5" fill="none" stroke={METAL} strokeWidth="1.8" />
      <rect x="36.4" y="145.5" width="7.2" height="15" rx="1.5" fill={METAL} stroke={METAL_EDGE} strokeWidth="1" />

      {/* The hook's loop: its lower bar sits in the card's slot. */}
      <rect x="29" y="157" width="22" height="30" rx="8" fill="none" stroke={METAL_EDGE} strokeWidth="4.6" />
      <rect x="29" y="157" width="22" height="30" rx="8" fill="none" stroke={METAL} strokeWidth="2.6" />
      {/* Spring gate. */}
      <rect x="48.3" y="161.3" width="5.4" height="13.4" rx="2.7" fill={METAL_EDGE} />
    </svg>
  )
}
