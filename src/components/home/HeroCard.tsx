'use client'

import dynamic from 'next/dynamic'
import { Component, useCallback, useEffect, useState, type ReactNode } from 'react'
import type { HomeCard } from '@/content/home'
import { cn } from '@/lib/utils'

// The 3D card. Its chunk (three, drei, rapier, meshline) is only fetched when
// this component actually renders it, after the checks below pass.
const Lanyard = dynamic(() => import('./Lanyard'), { ssr: false, loading: () => null })

/** Keeps the static card if anything in the 3D card throws. */
class Fallback extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Renders the static card (passed in as children) first. After mount, only at
 * 900px and wider, with reduced motion off and WebGL available, it loads the
 * 3D card. Once that has drawn a frame, the static card fades out over 300ms.
 * The static card stays in the DOM for screen readers either way.
 */
export default function HeroCard({
  card,
  backWord,
  photo,
  children,
}: {
  card: HomeCard
  backWord: string
  photo?: string
  children: ReactNode
}) {
  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 900px)')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const webgl = hasWebGL()
    const update = () => {
      const ok = webgl && wide.matches && !calm.matches
      setEnabled(ok)
      if (!ok) setReady(false)
    }
    update()
    wide.addEventListener('change', update)
    calm.addEventListener('change', update)
    return () => {
      wide.removeEventListener('change', update)
      calm.removeEventListener('change', update)
    }
  }, [])

  const onReady = useCallback(() => setReady(true), [])
  const onError = useCallback(() => {
    setFailed(true)
    setReady(false)
  }, [])

  return (
    <>
      <div className={cn('absolute inset-0 transition-opacity duration-300', ready && 'opacity-0')}>{children}</div>
      {enabled && !failed ? (
        <Fallback onError={onError}>
          <Lanyard card={card} backWord={backWord} photo={photo} onReady={onReady} />
        </Fallback>
      ) : null}
    </>
  )
}
