import type { NextConfig } from 'next'

// Server build for Vercel (includes /api/demo-lead for quote emails).
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
