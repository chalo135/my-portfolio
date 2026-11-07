'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useExperience } from '@/providers/ExperienceProvider'
import WaterTrailCanvas, { type WaterTrailConfig } from '@/components/ui/WaterTrailCanvas'

export type AmbientSource = { video: string; poster: string }

type AmbientVideoProps = {
  sources: { light: AmbientSource; dark: AmbientSource }
  priority?: boolean
  className?: string
  /** Opt in to the WebGL water trail. Only the hero passes this — one GL
   *  context per page, not one per AmbientVideo mount. */
  trail?: boolean
  /** Slow drift on the poster. */
  kenBurns?: boolean
  headingRef?: React.RefObject<HTMLElement | null>
  onTextPainted?: (painted: boolean) => void
  /** Forwarded to the canvas so a headline change forces a repaint. */
  textKey?: string
  trailConfig?: Partial<WaterTrailConfig>
}

/**
 * Full-bleed ambient media painted into the hero signboard: the active theme's
 * poster, blended into the board colour behind it, optionally with the
 * water-trail canvas over it doing the same blend in-shader. The parent must
 * paint the board (`bg-board`) and be an isolated stacking context, so the
 * blend reaches the board and nothing further back.
 *
 * Only one poster is ever mounted; the other theme's file is prefetched so the
 * first toggle is instant.
 */
export default function AmbientVideo({
  sources,
  priority = false,
  className,
  trail = false,
  kenBurns = true,
  headingRef,
  onTextPainted,
  textKey,
  trailConfig,
}: AmbientVideoProps) {
  const { theme } = useExperience()
  const hostRef = useRef<HTMLDivElement>(null)
  const [allowVideo, setAllowVideo] = useState(false)
  // Both start false so the server and first client render agree.
  const [allowTrail, setAllowTrail] = useState(false)
  const [canvasPainted, setCanvasPainted] = useState(false)
  const [onScreen, setOnScreen] = useState(true)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
    const saveData = nav.connection?.saveData ?? false
    const smallScreen = window.matchMedia('(max-width: 768px)').matches
    if (!reduce && !saveData && !smallScreen) setAllowVideo(true)

    // The trail is a pointer effect. On a touch device there is no pointer to
    // trail, so a full-viewport displacement shader would cost a phone its
    // frame budget to draw something nobody can trigger.
    const finePointer = window.matchMedia('(pointer: fine)').matches
    if (!reduce && finePointer && !smallScreen) setAllowTrail(true)
  }, [])

  // Pause the drift while the section is off-screen — an infinite transform on
  // a full-viewport layer keeps the compositor busy whether or not it is seen.
  useEffect(() => {
    if (!kenBurns) return
    const host = hostRef.current
    if (!host) return
    const io = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      { threshold: 0 }
    )
    io.observe(host)
    return () => io.disconnect()
  }, [kenBurns])

  const inactive = theme === 'dark' ? 'light' : 'dark'

  return (
    <div
      ref={hostRef}
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden
    >
      {/* Warms the other theme's poster without mounting a second full-bleed
          animating layer for it. React hoists this into <head>. */}
      <link rel="prefetch" as="image" href={sources[inactive].poster} />

      {/* Mirrored to match the canvas, which flips the background in-shader so
          the poster → canvas handoff is invisible. The blend sits on this
          wrapper, not the <Image>: the transform makes the wrapper an isolated
          group, so a blend mode on anything inside it would only ever blend
          with the wrapper's own empty backdrop. */}
      <div
        className={cn(
          'board-media absolute inset-0 -scale-x-100 transition-opacity duration-700 ease-out',
          canvasPainted && 'opacity-0'
        )}
      >
        <Image
          key={theme}
          src={sources[theme].poster}
          alt=""
          fill
          priority={priority}
          sizes="100vw"
          className={cn(
            'object-cover',
            kenBurns && 'ambient-kenburns',
            kenBurns && !onScreen && 'ambient-paused'
          )}
        />
      </div>

      {trail && allowTrail ? (
        <WaterTrailCanvas
          sources={sources}
          headingRef={headingRef}
          allowVideo={allowVideo}
          config={trailConfig}
          onFirstFrame={setCanvasPainted}
          onTextPainted={onTextPainted}
          textKey={textKey}
        />
      ) : null}
    </div>
  )
}
