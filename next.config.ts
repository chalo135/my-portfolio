import type { NextConfig } from 'next'
import path from 'path'

/**
 * Static export: `next build` writes plain HTML/CSS/JS into out/, which
 * hosting.com's LiteSpeed server serves as files. No Node process runs there.
 * See DEPLOY.md.
 */
const nextConfig: NextConfig = {
  output: 'export',
  // Every page exports as folder/index.html, which the server serves with no
  // rewrite rules. Canonical/hreflang/sitemap URLs carry the slash to match.
  trailingSlash: true,
  outputFileTracingRoot: path.join(__dirname),
  images: {
    // The default loader needs a server. Images are served as they are.
    unoptimized: true,
  },
  // redirects() can't run in a static export; the redirects now live in public/.htaccess.
}

export default nextConfig
