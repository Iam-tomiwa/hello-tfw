import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

export const viewport: Viewport = {
  themeColor: '#c2587a',
}

export const metadata: Metadata = {
  title: 'The Fiery Woman',
  description: 'Your personal comfort corner — messages of love, prayer & encouragement',
  applicationName: 'The Fiery Woman',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'The Fiery Woman',
  },
  formatDetection: { telephone: false },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  )
}
