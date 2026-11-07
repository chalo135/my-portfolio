'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getSite } from '@/content/site'
import { localeHref } from '@/lib/locale-href'
import type { Locale } from '@/i18n/config'
import { useExperience } from '@/providers/ExperienceProvider'
import ThemeToggle from '@/components/layout/ThemeToggle'
import LocaleToggle from '@/components/layout/LocaleToggle'

export default function Navigation({ locale }: { locale: Locale }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  // trailingSlash: true means the URL is /en/about/; compare without the slash.
  const rawPathname = usePathname()
  const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/+$/, '') : rawPathname
  const { setScrollLocked } = useExperience()
  const { site, navItems, footerItems, ui } = getSite(locale)

  const overlayRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const close = useCallback(() => setOpen(false), [])

  // While the overlay is open: lock scroll (both native and Lenis), close on
  // Escape, and keep Tab inside the overlay.
  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement as HTMLElement | null
    // Captured now rather than read in the cleanup: by then the ref may point
    // at a different node (or none).
    const trigger = triggerRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setScrollLocked(true)

    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key !== 'Tab') return
      const root = overlayRef.current
      if (!root) return
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      setScrollLocked(false)
      ;(previousFocus ?? trigger)?.focus?.()
    }
  }, [open, close, setScrollLocked])

  // Compared against the locale-prefixed href, since that is what is in the URL.
  const isActive = (href: string) => {
    const full = localeHref(href, locale)
    return pathname === full || pathname.startsWith(full + '/')
  }

  // The home hero is the crimson board, and the unscrolled header sits
  // transparently on top of it. Once scrolled it gets its own white bar.
  const overBoard = !scrolled && pathname === localeHref('/', locale)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-200 ease-out',
        scrolled ? 'glass-nav py-4' : 'bg-transparent py-6 md:py-8'
      )}
    >
      <nav
        className={cn(
          'relative z-50 mx-auto flex max-w-content items-center justify-between px-[var(--section-padding)]',
          overBoard && 'signboard'
        )}
        aria-label={ui.primaryNavLabel}
      >
        <Link
          href={localeHref('/', locale)}
          className="font-display text-[1.05rem] font-semibold text-fg transition-colors duration-150 ease-out hover:text-accent"
        >
          {site.name}
        </Link>

        {/* Every primary route, readable at rest. The overlay below is a
            mobile-only duplicate of these, not a second navigation system.
            gap-6 at md: the Kiswahili labels are longer than the English ones
            and gap-8 crowded the header between 768px and 900px. */}
        <ul className="hidden items-center gap-6 md:flex lg:gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={localeHref(item.href, locale)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'relative block py-1 font-sans text-[0.9rem] tracking-normal text-fg transition-colors duration-150 ease-out hover:text-accent',
                  // The active route keeps its underline; hover borrows the
                  // same rule, so the affordance is the same shape either way.
                  'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-accent after:transition-opacity after:duration-150',
                  isActive(item.href)
                    ? 'font-medium after:opacity-100'
                    : 'after:opacity-0 hover:after:opacity-60'
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* Locale before theme: it changes content, theme only changes
              appearance. */}
          <LocaleToggle labels={ui.switchTo} />
          <ThemeToggle />
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center text-fg transition-colors duration-150 ease-out hover:text-accent md:hidden"
            aria-expanded={open}
            aria-controls="full-menu"
            aria-label={ui.openMenu}
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
            </svg>
          </button>
        </div>
      </nav>

      <div
        ref={overlayRef}
        id="full-menu"
        role="dialog"
        aria-modal="true"
        aria-label={ui.siteMenu}
        className={cn(
          'fixed inset-0 z-40 flex flex-col justify-center bg-bg px-[var(--section-padding)] transition-opacity duration-200 ease-out md:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!open}
      >
        <div className="mx-auto w-full max-w-content">
          <ul className="flex flex-col gap-1">
            {footerItems.map((item, i) => (
              <li
                key={item.href}
                className={cn(
                  'transition-all duration-300 ease-out',
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                )}
                // Stagger only on the way in; on the way out everything leaves
                // together so dismissing feels immediate.
                style={{ transitionDelay: open ? `${40 + i * 30}ms` : '0ms' }}
              >
                <Link
                  href={localeHref(item.href, locale)}
                  tabIndex={open ? 0 : -1}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'block py-2 font-sans text-3xl font-semibold transition-colors duration-150 ease-out',
                    isActive(item.href) ? 'text-accent' : 'text-fg hover:text-accent'
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Full endonyms here: the overlay has the room, and words are
              clearer than codes. On its own row rather than crowded into the
              location/Close line, which is already tight on a narrow phone.
              Inside the focus trap via its a[href]. */}
          <div className="mt-12 border-t border-line pt-6">
            <LocaleToggle
              labels={ui.switchTo}
              variant="names"
              tabIndex={open ? 0 : -1}
            />
          </div>

          <div className="mt-6 flex items-baseline justify-between font-sans text-[0.8rem] tracking-label text-fg-muted">
            <span>{site.location}</span>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              tabIndex={open ? 0 : -1}
              className="tracking-label text-fg transition-colors duration-150 ease-out hover:text-accent"
            >
              {ui.close}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
