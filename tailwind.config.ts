import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Every token resolves through a CSS variable so `[data-theme]` actually
      // switches the palette. The `<alpha-value>` placeholder is what keeps
      // opacity modifiers (`bg-bg/85`, `border-line/[0.06]`) working.
      colors: {
        bg: 'rgb(var(--bg-rgb) / <alpha-value>)',
        paper: 'rgb(var(--paper-rgb) / <alpha-value>)',
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        elev: 'rgb(var(--elev-rgb) / <alpha-value>)',
        fg: 'rgb(var(--fg-rgb) / <alpha-value>)',
        'fg-muted': 'rgb(var(--fg-muted-rgb) / <alpha-value>)',
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        'accent-deep': 'rgb(var(--accent-deep-rgb) / <alpha-value>)',
        'on-accent': 'rgb(var(--on-accent-rgb) / <alpha-value>)',
        highlight: 'rgb(var(--highlight-rgb) / <alpha-value>)',
        'on-highlight': 'rgb(var(--on-highlight-rgb) / <alpha-value>)',
        scrim: 'rgb(var(--scrim-rgb) / <alpha-value>)',
        pill: 'rgb(var(--pill-rgb) / <alpha-value>)',
        'pill-hover': 'rgb(var(--pill-hover-rgb) / <alpha-value>)',
        ok: 'rgb(var(--ok-rgb) / <alpha-value>)',
        'sticky-yellow': 'rgb(var(--sticky-yellow-rgb) / <alpha-value>)',
        'sticky-green': 'rgb(var(--sticky-green-rgb) / <alpha-value>)',
        'sticky-pink': 'rgb(var(--sticky-pink-rgb) / <alpha-value>)',
        'paper-ink': 'rgb(var(--paper-ink-rgb) / <alpha-value>)',
        // Carries its own alpha; never used with an opacity modifier.
        line: 'var(--line)',
      },
      // DM Sans for everything, headings included; Caveat for the hand.
      // Both from next/font/google, exposed as CSS variables by the layout.
      fontFamily: {
        display: ['var(--font-sans)', '"Segoe UI"', 'Roboto', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', '"Segoe UI"', 'Roboto', 'system-ui', 'sans-serif'],
        hand: ['var(--font-hand)', '"Segoe Print"', '"Comic Sans MS"', 'cursive'],
        // The DAX line only.
        mono: ['"Cascadia Mono"', 'Consolas', '"SF Mono"', 'monospace'],
      },
      boxShadow: {
        paper: '0 14px 28px rgb(var(--shadow-rgb) / 0.16)',
        sticky: '0 10px 18px rgb(var(--shadow-rgb) / 0.12)',
        postcard: '0 18px 36px rgb(var(--shadow-rgb) / 0.16)',
        card: '0 16px 30px rgb(var(--shadow-rgb) / 0.25)',
        disc: '0 6px 14px rgb(var(--shadow-rgb) / 0.14)',
      },
      spacing: {
        'section': 'clamp(6rem, 15vh, 12rem)',
        'section-sm': 'clamp(4rem, 10vh, 8rem)',
      },
      maxWidth: {
        content: '1360px',
        measure: '68ch',
      },
      // Labels are sentence case at normal tracking. The tracked-out label was
      // template chrome; the name stays so the call sites need not change.
      letterSpacing: {
        label: 'normal',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
        luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      animation: {
        'fade-up': 'fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
