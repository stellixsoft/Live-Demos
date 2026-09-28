import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/archivo/wdth.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'StellixSoft for Appliance Repair',
  description: 'Websites, call handling, and software built for appliance repair businesses.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'StellixSoft for Appliance Repair',
    description: 'See how your appliance repair business could win more jobs and run with less paperwork.',
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
