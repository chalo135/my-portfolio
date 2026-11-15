import type { NextConfig } from 'next'
import path from 'path'

/** Removed pages and where each one went. Used for the flat paths
 *  (/projects) and for both locales (/en/projects, /sw/projects). */
const moved: { from: string; to: string }[] = [
  { from: 'projects', to: 'work/' },
  { from: 'projects/:slug', to: 'work/' },
  { from: 'capabilities', to: 'work/' },
  { from: 'technologies', to: 'work/' },
  { from: 'philosophy', to: '' },
  { from: 'writing', to: '' },
  { from: 'writing/:slug', to: '' },
  { from: 'experience', to: 'about/' },
  { from: 'resume', to: 'about/' },
]

/**
 * Hosted on Vercel, which runs Next.js as it is. Every page is still
 * prerendered at build time and served as a static file. See DEPLOY.md.
 */
const nextConfig: NextConfig = {
  // Every URL ends in a slash: canonical, hreflang and sitemap URLs match.
  trailingSlash: true,
  outputFileTracingRoot: path.join(__dirname),

  /**
   * Old links. Vercel handles HTTPS and the www host itself, so neither is
   * here. No target matches a source, so nothing can loop. Next sends 308
   * for permanent and 307 for temporary redirects.
   */
  async redirects() {
    return [
      // There is no page at /. Temporary, so browsers don't cache the
      // language choice.
      { source: '/', destination: '/en/', permanent: false },

      // Flat paths from before the locale prefix.
      { source: '/work', destination: '/en/work/', permanent: true },
      { source: '/about', destination: '/en/about/', permanent: true },
      { source: '/contact', destination: '/en/contact/', permanent: true },
      ...moved.map(({ from, to }) => ({
        source: `/${from}`,
        destination: `/en/${to}`,
        permanent: true,
      })),

      // The same removed pages inside each locale.
      ...moved.map(({ from, to }) => ({
        source: `/:locale(en|sw)/${from}`,
        destination: `/:locale/${to}`,
        permanent: true,
      })),

      // The old site's favicon, still in some bookmarks.
      { source: '/favicon.svg', destination: '/favicon.ico', permanent: true },
    ]
  },

  /**
   * Security headers on every response. No Cache-Control (Vercel caches
   * /_next/static forever and refreshes pages on each deploy), no
   * Strict-Transport-Security (Vercel sends it) and no Content-Security-Policy.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Files are used as the type the server says they are.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Other sites see the origin only, never the full page URL.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // No other site may show these pages in a frame.
          { key: 'X-Frame-Options', value: 'DENY' },
          // A tab opened from another site cannot script this one.
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          // Device features the site never uses are switched off.
          {
            key: 'Permissions-Policy',
            value:
              'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), browsing-topics=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
