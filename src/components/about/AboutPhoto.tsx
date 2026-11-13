import Image from 'next/image'
import Paper from '@/components/bench/Paper'
import Tape from '@/components/bench/Tape'
import BenchObject from '@/components/bench/BenchObject'
import { publicFileExists } from '@/lib/public-file'
import { photoSrc } from '@/content/about'

/**
 * Server component. The taped print of Charles with a mug on its corner.
 * With no photo at public/me/chalo.jpg, a sand panel with the monogram.
 */
export default function AboutPhoto({ alt, caption }: { alt: string; caption: string }) {
  const hasPhoto = publicFileExists(photoSrc)
  return (
    <div className="relative min-w-0 max-w-[460px] flex-[1_1_380px] pt-5">
      <Paper as="figure" tilt={-3} className="px-4 pb-5 pt-4">
        <Tape />
        {hasPhoto ? (
          <Image
            src={photoSrc}
            alt={alt}
            width={800}
            height={1000}
            priority
            className="block aspect-[4/5] h-auto w-full object-cover"
          />
        ) : (
          <div aria-hidden className="flex aspect-[4/5] w-full items-center justify-center bg-pill">
            <span className="font-hand text-[160px] font-bold leading-none text-accent">C</span>
          </div>
        )}
        <figcaption className="mt-3 font-hand text-[28px] font-bold leading-tight">{caption}</figcaption>
      </Paper>
      <BenchObject
        name="mug"
        width={124}
        height={104}
        tilt={18}
        className="bottom-[-48px] right-[-8px] z-10 sm:bottom-[-60px] sm:right-[-40px]"
      />
    </div>
  )
}
