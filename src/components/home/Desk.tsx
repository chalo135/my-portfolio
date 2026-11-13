import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import type { HomeContent } from '@/content/home'
import BenchObject from '@/components/bench/BenchObject'
import HandNote from '@/components/bench/HandNote'
import Paper from '@/components/bench/Paper'
import Pill from '@/components/bench/Pill'
import StatusLine from '@/components/bench/StatusLine'
import StickyNote from '@/components/bench/StickyNote'
import Tape from '@/components/bench/Tape'
import { localeHref } from '@/lib/locale-href'
import { logo } from '@/content/site'
import HeroCard from './HeroCard'
import StaticCard from './StaticCard'

// Shown from 900px; the "wide" ones only from 1200px, so no text touches an
// object on narrower desks.
const onDesk = 'hidden min-[900px]:block'
const onWideDesk = 'hidden min-[1200px]:block'

/**
 * Server component. The home desk: below 900px a plain column (the sheet,
 * then the card); from 900px a 780px desk with everything placed by percent.
 */
export default function Desk({
  locale,
  copy,
  status,
  photo,
}: {
  locale: Locale
  copy: HomeContent
  status: string
  photo?: string
}) {
  return (
    <div className="relative mx-auto flex max-w-[1360px] flex-col items-center px-4 pb-10 pt-6 min-[900px]:block min-[900px]:h-[780px] min-[900px]:p-0">
      {/* Objects, back to front. */}
      <BenchObject name="notebook" label={copy.notebookLabel} width={170} height={220} tilt={-8} className={onDesk} style={{ left: '3%', top: '4%' }} />
      <BenchObject name="phone" width={86} height={164} tilt={10} className={onDesk} style={{ left: '19%', top: '3%' }} />
      <BenchObject name="mug" width={124} height={104} className={onDesk} style={{ left: '69%', top: '1%' }} />
      <BenchObject name="pencil" width={196} height={18} tilt={32} className={onWideDesk} style={{ left: '15%', top: '40%' }} />
      <BenchObject name="wrench" width={250} height={72} tilt={-20} className={onDesk} style={{ left: '2%', top: '49%' }} />
      <BenchObject name="leaf" width={140} height={74} tilt={24} className={onWideDesk} style={{ left: '22%', top: '64%' }} />
      <BenchObject name="sprocket" width={124} height={124} tilt={12} className={onWideDesk} style={{ left: '88%', top: '78%' }} />

      <div className={`${onWideDesk} absolute`} style={{ left: '9%', top: '76%' }}>
        <StickyNote
          aria-hidden
          color="yellow"
          tilt={-5}
          className="flex h-[140px] w-[150px] flex-col justify-center px-5 font-hand text-[26px] font-bold leading-[1.1]"
        >
          <span>{copy.sticky[0]}</span>
          <span>{copy.sticky[1]}</span>
        </StickyNote>
      </div>

      <Link
        href={localeHref('/work', locale)}
        aria-label={copy.laptopLabel}
        className={`${onDesk} absolute z-[5] rounded-[12px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg`}
        style={{ left: '47%', top: '64%', width: 364, height: 240 }}
      >
        <BenchObject name="laptop" width={364} height={240} tilt={-4} position="relative" />
      </Link>

      <div className={`${onDesk} absolute z-[5]`} style={{ left: '22%', top: '82%' }}>
        <HandNote size={28} arrow="arrow-curve" arrowPosition="after">
          {copy.noteLaptop}
        </HandNote>
      </div>

      {/* The sheet: static and square below 900px, placed and tilted above. */}
      <Paper
        tilt={0}
        className="z-10 flex w-full max-w-[520px] flex-col gap-[18px] px-[42px] pb-[34px] pt-[40px] max-[420px]:px-6 min-[900px]:absolute min-[900px]:left-[calc(50%-280px)] min-[900px]:top-[17%] min-[900px]:w-[520px] min-[900px]:-rotate-1"
      >
        <Tape />
        <h1 className="text-[clamp(40px,11vw,52px)] font-bold leading-[1.05] tracking-[-0.02em] min-[900px]:text-[52px]">
          {copy.heading}
        </h1>
        <p className="text-[20px] leading-[1.5]">{copy.intro}</p>
        <div className="flex flex-wrap gap-3">
          <Pill href={localeHref('/work', locale)} variant="primary" className="min-h-[50px]">
            {copy.ctaWork}
          </Pill>
          <Pill href={localeHref('/contact', locale)} className="min-h-[50px]">
            {copy.ctaContact}
          </Pill>
        </div>
        <StatusLine text={status} />
      </Paper>

      {/* The ID card stage. */}
      <div className="relative z-20 mt-16 h-[520px] w-[260px] shrink-0 min-[900px]:absolute min-[900px]:left-[73.5%] min-[900px]:top-0 min-[900px]:mt-0 min-[900px]:h-[470px] min-[900px]:w-[240px]">
        <HeroCard card={copy.card} backWord={logo} photo={photo}>
          <StaticCard card={copy.card} photo={photo} />
        </HeroCard>
      </div>

      <div aria-hidden className={`${onDesk} absolute z-[5]`} style={{ left: '77%', top: '58%' }}>
        <HandNote size={30} arrow="arrow-up" arrowPosition="before">
          {copy.noteMe}
        </HandNote>
        <HandNote size={22} className="mt-1 flex pl-[36px] text-fg-muted">
          {copy.noteTug}
        </HandNote>
      </div>
    </div>
  )
}
