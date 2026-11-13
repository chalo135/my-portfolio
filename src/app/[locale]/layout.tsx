import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import '../globals.css'
import { fontVariables } from '../fonts'
import { ExperienceProvider } from '@/providers/ExperienceProvider'
import { getSite } from '@/content/site'
import { getPages } from '@/content/pages'
import { siteUrl } from '@/lib/site-url'
import { alternatesFor } from '@/lib/alternates'
import { locales, isLocale, localeTags, localeOgTags } from '@/i18n/config'

/** Both locales prerender; there is no runtime locale negotiation anywhere. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

/** Static export: any other locale is a 404, not a render attempt. */
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const { site, meta } = getSite(locale)
  const home = getPages(locale).meta.home

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: home.title,
      template: `%s | ${site.name}`,
    },
    description: home.description,
    keywords: meta.keywords,
    authors: [{ name: site.name }],
    alternates: alternatesFor('/', locale),
    openGraph: {
      title: home.title,
      description: home.description,
      type: 'website',
      locale: localeOgTags[locale],
    },
  }
}

export const viewport: Viewport = {
  // The cream desk (--bg-rgb, light). One value: the site opens light for
  // everyone, so the bar does not follow the OS scheme.
  themeColor: '#F5F1E6',
  // Light only at the document level so an OS in dark mode does not paint a
  // dark canvas before the stylesheet lands. [data-theme='dark'] sets
  // `color-scheme: dark` itself when a visitor chooses the night theme.
  colorScheme: 'light',
}

/** Stamps data-theme on <html> before first paint: a theme the visitor chose
 *  earlier (localStorage), otherwise light. prefers-color-scheme is
 *  deliberately not read: every first visit lands on the cream desk. */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light'){t='light'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}try{document.documentElement.classList.add('js-ready')}catch(e){}})()`

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // params is a Promise in Next 15 and must be awaited before use.
  const { locale } = await params
  // A path like /de/about matches this segment but is not a locale we serve;
  // 404 rather than rendering a shell with no content.
  if (!isLocale(locale)) notFound()

  const { ui } = getSite(locale)

  return (
    <html
      lang={localeTags[locale]}
      // The script below mutates data-theme before React hydrates, which React
      // would otherwise flag as a server/client attribute mismatch.
      suppressHydrationWarning
      className={fontVariables}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-bg text-fg antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-accent focus:text-on-accent"
        >
          {ui.skipToContent}
        </a>
        <ExperienceProvider>{children}</ExperienceProvider>
      </body>
    </html>
  )
}
