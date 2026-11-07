'use client'

import { useCallback, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import Reveal from '@/components/ui/Reveal'
import SectionLabel from '@/components/ui/SectionLabel'
import ActionLink from '@/components/ui/ActionLink'
import AmbientVideo from '@/components/ui/AmbientVideo'
import { getSite, media } from '@/content/site'
import type { Locale } from '@/i18n/config'

/** The only part of the home page that needs client state: the <h1> is handed
 *  between the DOM and the WebGL canvas, so it has to know which owns it. */
export default function Hero({ locale }: { locale: Locale }) {
  // The <h1> stays in normal flow and is measured from there; once the canvas
  // holds a texture of it, `canvas-painted` makes the DOM copy transparent.
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { hero } = getSite(locale)

  /**
   * Which headline the canvas has confirmed it holds a texture of — not a bare
   * boolean. The DOM copy only goes transparent when that matches the headline
   * being rendered right now.
   *
   * This is derived during render rather than reset in an effect. React can
   * keep this component's state across an /en → /sw navigation (same component,
   * same tree position), and an effect-based reset would run a frame late,
   * leaving the new headline transparent with a stale texture — or, once the
   * canvas has degraded, with nothing drawing it at all. Comparing text closes
   * that gap: a headline the canvas has not confirmed is never hidden.
   */
  const [paintedText, setPaintedText] = useState<string | null>(null)
  const headingOnCanvas = paintedText === hero.headline

  const onTextPainted = useCallback(
    (painted: boolean) => setPaintedText(painted ? hero.headline : null),
    [hero.headline]
  )

  // The board: the one bold moment on the site. Crimson in light, gold in
  // night. `isolate` keeps AmbientVideo's blend inside this section,
  // `signboard` letters everything on it in on-accent (white on crimson,
  // oxblood on gold), and `data-signboard` lets the fixed status strip tell
  // when it is over it.
  return (
    <section
      data-section="Intro"
      data-signboard
      className="signboard relative isolate flex min-h-[100svh] items-end overflow-hidden bg-board transition-colors duration-[600ms] ease-out"
    >
      <AmbientVideo
        sources={media}
        priority
        trail
        headingRef={headingRef}
        onTextPainted={onTextPainted}
        textKey={hero.headline}
      />

      {/* Top padding is what stops the bottom-aligned hero copy from sliding
          under the fixed header on a short viewport: once the content plus
          its padding exceeds 100svh the section grows instead of overlapping. */}
      <div className="relative z-10 mx-auto w-full max-w-content px-[var(--section-padding)] pb-24 pt-24 md:pb-28 md:pt-28">
        <Reveal on="load">
          <SectionLabel>{hero.eyebrow}</SectionLabel>
        </Reveal>

        <h1
          ref={headingRef}
          className={cn(
            'mt-8 max-w-4xl text-balance font-display text-display-xl font-bold text-fg',
            headingOnCanvas && 'canvas-painted'
          )}
        >
          {hero.headline}
        </h1>

        <Reveal
          as="p"
          on="load"
          delay={0.28}
          className="mt-8 max-w-measure text-editorial leading-relaxed text-fg"
        >
          {hero.subhead}
        </Reveal>

        <Reveal on="load" delay={0.42} className="mt-10">
          <ActionLink href={hero.ctaHref} locale={locale}>
            {hero.ctaLabel}
          </ActionLink>
        </Reveal>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-14 z-10 flex justify-center">
        <span className="h-12 w-px bg-gradient-to-b from-transparent via-fg/50 to-transparent" />
      </div>
    </section>
  )
}
