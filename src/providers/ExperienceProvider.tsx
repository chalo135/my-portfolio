'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react'

export type Theme = 'dark' | 'light'

/** localStorage key. Shared with the pre-paint script in app/layout.tsx —
 *  if you change it here, change it there too. */
export const THEME_STORAGE_KEY = 'theme'

interface LenisLike {
  scrollTo: (target: number | string, options?: Record<string, unknown>) => void
  stop: () => void
  start: () => void
  destroy: () => void
}

/** Where on screen the last toggle came from, in client coordinates. The water
 *  trail canvas uses it to burst the theme change outward from the button. */
export interface ToggleOrigin {
  x: number
  y: number
  /** Bumped on every toggle so consumers can tell two bursts at the same point apart. */
  id: number
}

interface ExperienceContextValue {
  theme: Theme
  toggleOrigin: ToggleOrigin | null
  toggleTheme: (origin?: { x: number; y: number }) => void
  reducedMotion: boolean
  scrollTo: (target: number | string) => void
  /** Pause/resume Lenis — used by the full-screen menu's scroll lock. */
  setScrollLocked: (locked: boolean) => void
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null)

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  // Rendered as 'light' on the server. The real value was already resolved
  // (stored choice, otherwise light) and stamped onto <html> before paint by
  // the inline script in layout.tsx; the effect below adopts it on mount rather
  // than resolving it a second time.
  const [theme, setThemeState] = useState<Theme>('light')
  const [toggleOrigin, setToggleOrigin] = useState<ToggleOrigin | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const adopted = useRef(false)
  const lenisRef = useRef<LenisLike | null>(null)

  // Track the user's motion preference.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Adopt-then-reflect, in one effect. Two effects would let the second stamp a
  // stale 'light' over the inline script's 'dark' for a frame.
  useEffect(() => {
    if (!adopted.current) {
      adopted.current = true
      const stamped = document.documentElement.getAttribute('data-theme')
      if ((stamped === 'dark' || stamped === 'light') && stamped !== theme) {
        setThemeState(stamped)
        return
      }
    }
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Smooth scroll via Lenis, on a plain rAF loop. The reveals are CSS
  // transitions driven by an IntersectionObserver, so there is no animation
  // library that needs to share a ticker with this. Skipped entirely when the
  // user prefers reduced motion.
  useEffect(() => {
    if (reducedMotion) return
    let disposed = false
    let dispose = () => {}

    ;(async () => {
      const { default: Lenis } = await import('lenis')
      if (disposed) return

      const lenis = new Lenis({ lerp: 0.14, smoothWheel: true, syncTouch: false })
      lenisRef.current = lenis

      let frame = 0
      const raf = (time: number) => {
        lenis.raf(time)
        frame = requestAnimationFrame(raf)
      }
      frame = requestAnimationFrame(raf)

      dispose = () => {
        cancelAnimationFrame(frame)
        lenis.destroy()
        lenisRef.current = null
      }
    })()

    return () => {
      disposed = true
      dispose()
    }
  }, [reducedMotion])

  const toggleTheme = useCallback((origin?: { x: number; y: number }) => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next)
      } catch {
        // Private mode / storage disabled — the choice just won't persist.
      }
      return next
    })
    if (origin) {
      setToggleOrigin((prev) => ({ ...origin, id: (prev?.id ?? 0) + 1 }))
    }
  }, [])

  const scrollTo = useCallback((target: number | string) => {
    const lenis = lenisRef.current
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.2 })
      return
    }
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' })
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const setScrollLocked = useCallback((locked: boolean) => {
    const lenis = lenisRef.current
    if (!lenis) return
    if (locked) lenis.stop()
    else lenis.start()
  }, [])

  return (
    <ExperienceContext.Provider
      value={{
        theme,
        toggleOrigin,
        toggleTheme,
        reducedMotion,
        scrollTo,
        setScrollLocked,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  )
}

export function useExperience() {
  const ctx = useContext(ExperienceContext)
  if (!ctx) throw new Error('useExperience must be used within ExperienceProvider')
  return ctx
}
