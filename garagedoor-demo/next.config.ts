import type { NextConfig } from 'next'

// Static export: `npm run build` writes a plain website to /out,
// which Firebase Hosting serves directly (free Spark plan is enough).
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
