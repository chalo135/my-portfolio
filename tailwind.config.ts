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
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        elev: 'rgb(var(--elev-rgb) / <alpha-value>)',
        fg: 'rgb(var(--fg-rgb) / <alpha-value>)',
        'fg-muted': 'rgb(var(--fg-muted-rgb) / <alpha-value>)',
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        'accent-deep': 'rgb(var(--accent-deep-rgb) / <alpha-value>)',
        // Text and icons on an accent fill: white on crimson, oxblood on gold.
        'on-accent': 'rgb(var(--on-accent-rgb) / <alpha-value>)',
        // Relic gold: chips, badges, the download button, code highlights.
        // A fill only — never text on white.
        highlight: 'rgb(var(--highlight-rgb) / <alpha-value>)',
        'on-highlight': 'rgb(var(--on-highlight-rgb) / <alpha-value>)',
        scrim: 'rgb(var(--scrim-rgb) / <alpha-value>)',
        // The hero board: crimson in light, gold in night.
        board: 'rgb(var(--board-rgb) / <alpha-value>)',
        // --line already carries its own per-theme alpha (tunic blue at 0.15 light /
        // white at 0.18 dark), so it is a resolved colour rather than bare channels.
        line: 'var(--line)',
      },
      // Two self-hosted variable webfonts via next/font, each exposed as a CSS
      // variable by the root layout. The fallback stacks matter more than usual
      // here: `display: 'swap'` paints them first, so they are picked to be the
      // roundest thing likely to be installed rather than an arbitrary default.
      fontFamily: {
        // Display face — headings, project titles, the name and the
        // philosophy watermark only. Cinzel is inscriptional Roman capitals:
        // lowercase draws as small capitals, so it is never used for running
        // text, nav, buttons, labels, tables or code.
        display: [
          'var(--font-display)',
          '"Trajan Pro"',
          '"Palatino Linotype"',
          'Palatino',
          'Georgia',
          'serif',
        ],

        // Body copy, navigation, labels, footer.
        sans: [
          'var(--font-sans)',
          '"Segoe UI"',
          'Roboto',
          'system-ui',
          'sans-serif',
        ],

        // Code and tabular numbers only. Unchanged, still local.
        mono: ['"Cascadia Mono"', 'Consolas', '"SF Mono"', 'monospace'],
      },
      // Set for Cinzel: a touch of positive tracking (never more than 0.02em,
      // and never negative — inscriptional capitals need their spacing).
      fontSize: {
        'display-xl': ['clamp(2.5rem, min(7.5vw, 11vh), 6rem)', { lineHeight: '1.05', letterSpacing: '0.01em' }],
        'display-lg': ['clamp(2.25rem, 4.5vw, 3.75rem)', { lineHeight: '1.1', letterSpacing: '0.01em' }],
        'display-md': ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '0.01em' }],
        'editorial': ['clamp(1.0625rem, 1.3vw, 1.25rem)', { lineHeight: '1.65' }],
      },
      spacing: {
        'section': 'clamp(6rem, 15vh, 12rem)',
        'section-sm': 'clamp(4rem, 10vh, 8rem)',
      },
      maxWidth: {
        content: '1400px',
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
