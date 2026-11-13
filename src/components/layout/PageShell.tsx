import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import type { Locale } from '@/i18n/config'

/** Shared page frame: header, main landmark, footer. */
export default function PageShell({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation locale={locale} />
      <main id="main-content">{children}</main>
      <Footer locale={locale} />
    </>
  )
}
