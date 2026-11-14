'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getSite, logo, type NavIcon } from '@/content/site'
import { localeHref } from '@/lib/locale-href'
import type { Locale } from '@/i18n/config'
import { useExperience } from '@/providers/ExperienceProvider'
import Pill, { pillClasses } from '@/components/bench/Pill'
import { BriefcaseIcon, EnvelopeIcon, MenuIcon, SmileyIcon } from '@/components/bench/Icons'
import ThemeToggle from '@/components/layout/ThemeToggle'
import LocaleToggle from '@/components/layout/LocaleToggle'

const icons: Record<NavIcon, () => React.ReactElement> = {
  briefcase: () => <BriefcaseIcon />,
  smiley: () => <SmileyIcon />,
  envelope: () => <EnvelopeIcon />,
}

/**
 * Header: the `chalo` logo (the link home) on the left; on the right, wrapping,
 * the page pills, the locale pill and the theme pill. The current page's pill
 * is dark. In the document flow, not fixed. Under 768px the page pills move
 * into a full-screen overlay behind a menu pill.
 */
export default function Navigation({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false)
  // trailingSlash: true means the URL is /en/about/; compare without the slash.
  const rawPathname = usePathname()
  const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/+$/, '') : rawPathname
  const { setScrollLocked } = useExperience()
  const { navItems, footerItems, ui } = getSite(locale)
  const themeLabels = { toLight: ui.themeToLight, toDark: ui.themeToDark, generic: ui.themeSwitch }

  const overlayRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const close = useCallback(() => setOpen(false), [])

  // The overlay is `md:hidden`. If the viewport grows past 768px while it is
  // open (a phone turned to landscape), close it, or the page would stay
  // scroll-locked behind a menu nobody can see.
  useEffect(() => {
    if (!open) return
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [open])

  // While the overlay is open: lock scroll, close on Escape, trap Tab.
  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement as HTMLElement | null
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

  const isActive = (href: string) => {
    const full = localeHref(href, locale)
    if (href === '/') return pathname === full
    return pathname === full || pathname.startsWith(full + '/')
  }

  return (
    <header className="relative z-50 px-4 py-[18px] sm:px-10">
      <nav
        className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-x-6 gap-y-3"
        aria-label={ui.primaryNavLabel}
      >
        <Link
          href={localeHref('/', locale)}
          aria-current={isActive('/') ? 'page' : undefined}
          className="inline-flex min-h-[44px] items-center font-hand text-[38px] font-bold leading-none text-fg transition-colors duration-150 ease-out hover:text-accent"
        >
          {logo}
          <span className="sr-only"> {ui.homeLabel}</span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <ul className="hidden flex-wrap items-center gap-2 md:flex">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <li key={item.href}>
                  <Pill
                    href={localeHref(item.href, locale)}
                    variant={active ? 'active' : 'default'}
                    aria-current={active ? 'page' : undefined}
                    icon={item.icon ? icons[item.icon]() : undefined}
                  >
                    {item.label}
                  </Pill>
                </li>
              )
            })}
          </ul>

          <LocaleToggle labels={ui.switchTo} />
          <ThemeToggle labels={themeLabels} />

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            className={cn(pillClasses('default'), 'min-w-[44px] px-[14px] md:hidden')}
            aria-expanded={open}
            aria-controls="full-menu"
            aria-label={ui.openMenu}
          >
            <MenuIcon />
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
          'fixed inset-0 z-40 flex flex-col justify-center bg-bg px-6 transition-opacity duration-200 ease-out md:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!open}
      >
        <ul className="flex flex-col items-start gap-3">
          {footerItems.map((item) => {
            const nav = navItems.find((n) => n.href === item.href)
            const active = isActive(item.href)
            return (
              <li key={item.href}>
                <Pill
                  href={localeHref(item.href, locale)}
                  tabIndex={open ? 0 : -1}
                  variant={active ? 'active' : 'default'}
                  aria-current={active ? 'page' : undefined}
                  icon={nav?.icon ? icons[nav.icon]() : undefined}
                  className="min-h-[52px] px-6 text-xl"
                >
                  {item.label}
                </Pill>
              </li>
            )
          })}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <LocaleToggle labels={ui.switchTo} variant="names" tabIndex={open ? 0 : -1} />
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            tabIndex={open ? 0 : -1}
            className={pillClasses('default')}
          >
            {ui.close}
          </button>
        </div>
      </div>
    </header>
  )
}
