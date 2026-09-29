import type { NextConfig } from 'next'

// Serverful build for Vercel (API routes / Nodemailer). Not a static export.
const nextConfig: NextConfig = {
  images: { unoptimized: true },
}

export default nextConfig
