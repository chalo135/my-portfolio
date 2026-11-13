import type { CSSProperties } from 'react'
import Image from 'next/image'
import { stickerTilts, techList } from '@/content/work'
import { cn } from '@/lib/utils'
import styles from './work.module.css'

/** The tech grid: round paper stickers with Devicon logos. */
export default function TechStickers({ heading, intro }: { heading: string; intro: string }) {
  return (
    <section aria-labelledby="tech-heading" className="pb-[110px] pt-10">
      <h2 id="tech-heading" className="text-[clamp(36px,4vw,56px)] font-bold leading-[1.05] tracking-[-0.02em]">
        {heading}
      </h2>
      <p className="mt-[10px] text-[19px] leading-[1.5] text-fg-muted">{intro}</p>
      <ul className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(118px,1fr))] gap-x-4 gap-y-[34px]">
        {techList.map((tech, i) => (
          <li
            key={tech.name}
            className={cn(styles.sticker, 'flex flex-col items-center text-center')}
            style={{ '--tilt': stickerTilts[i % stickerTilts.length] } as CSSProperties}
          >
            <span className="surface-light flex h-[84px] w-[84px] items-center justify-center rounded-full bg-paper shadow-disc">
              {tech.icon ? (
                <Image
                  src={`/icons/tech/${tech.icon}.svg`}
                  alt=""
                  width={42}
                  height={42}
                  loading="lazy"
                  className="h-[42px] w-[42px]"
                />
              ) : (
                <span aria-hidden className="font-sans text-[20px] font-bold leading-none text-accent">
                  {tech.badge}
                </span>
              )}
            </span>
            <span className="mt-[10px] text-[14px] font-medium leading-tight">{tech.name}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
