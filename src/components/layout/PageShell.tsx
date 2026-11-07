import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import StatusStrip from '@/components/layout/StatusStrip'
import type { Locale } from '@/i18n/config'

/** Shared page frame: nav, main landmark, footer, status strip. */
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
      <StatusStrip locale={locale} />
    </>
  )
}
