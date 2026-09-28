import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/archivo/wdth.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'StellixSoft for Garage Door Companies',
  description: 'Websites, call handling, and software built for garage door repair and installation companies.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'StellixSoft for Garage Door Companies',
    description: 'See how your garage door company could win more jobs and run with less paperwork.',
    type: 'website',
  },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#2446C9',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
