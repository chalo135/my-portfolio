// The real root layout is src/app/[locale]/layout.tsx; this file only exists so the root not-found page has a layout above it.
// It imports the global stylesheet because Next only puts layout CSS into the head of the prerendered 404.
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
