import type { CSSProperties } from 'react'
import Image from 'next/image'
import Paper from '@/components/bench/Paper'
import Tape from '@/components/bench/Tape'
import Pill from '@/components/bench/Pill'
import { ArrowUpRightIcon } from '@/components/bench/Icons'
import type { WorkProject } from '@/content/work'
import { cn } from '@/lib/utils'
import styles from './work.module.css'

/** One project: a taped print and its text. Every second row swaps sides. */
export default function ProjectRow({
  project,
  index,
  visitSite,
  opensNewTab,
}: {
  project: WorkProject
  index: number
  visitSite: string
  opensNewTab: string
}) {
  const swapped = index % 2 === 1
  const number = String(index + 1).padStart(2, '0')

  return (
    <li
      data-desk-row
      className={cn(
        styles.row,
        'grid grid-cols-1 items-center gap-x-16 gap-y-10',
        swapped
          ? 'min-[860px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]'
          : 'min-[860px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]'
      )}
      style={{ '--tilt': project.tilt } as CSSProperties}
    >
      <div className={cn(styles.print, swapped && 'min-[860px]:order-2')}>
        <Paper className="px-[14px] pb-[18px] pt-[14px]">
          <Tape left="40%" rotate={-3} />
          {project.image ? (
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width={1600}
              height={800}
              className="block aspect-[2/1] h-auto w-full object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="flex aspect-[2/1] w-full items-end p-6 font-sans text-[28px] font-bold leading-tight"
              style={{ backgroundColor: project.panel.bg, color: project.panel.fg }}
            >
              {project.title}
            </div>
          )}
        </Paper>
      </div>

      <div className={cn(styles.text, 'flex flex-col items-start gap-3')}>
        <span aria-hidden className="font-hand text-[26px] font-bold leading-none text-accent">
          {number}
        </span>
        <h2 className="text-[clamp(32px,3.4vw,46px)] font-bold leading-[1.05] tracking-[-0.02em]">
          {project.title}
        </h2>
        <p className="text-[19px] leading-[1.5] text-fg-muted">{project.descriptor}</p>
        {project.url ? (
          <Pill
            href={project.url}
            external
            target="_blank"
            rel="noopener noreferrer"
            icon={<ArrowUpRightIcon />}
            className="mt-1"
          >
            {visitSite}
            <span className="sr-only"> {opensNewTab}</span>
          </Pill>
        ) : null}
      </div>
    </li>
  )
}
