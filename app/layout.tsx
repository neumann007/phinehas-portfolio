import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import Nav from '../components/Nav'
import { ThemeProvider } from '../components/ThemeProvider'
import GlassFilter from '@/components/GlassFilter'


const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap'
})

const dmMono = DM_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500']
})

export const metadata: Metadata = {
  title: {
    default: 'Phinehas Newman — Developer, Systems Thinker, Builder',
    template: '%s | Phinehas Newman'
  },
  description:
    'A developer who thinks in systems and builds things that should exist.',
  // rest of your metadata
  metadataBase: new URL('https://phinehas.xyz'),
  openGraph: {
    title: 'Phinehas Newman — Developer, Systems Thinker, Builder',
    description:
      'A developer who thinks in systems and builds things that should exist.',
    url: 'https://phinehas.xyz',
    siteName: 'Phinehas Newman',
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phinehas Newman — Developer, Systems Thinker, Builder',
    description:
      'A developer who thinks in systems and builds things that should exist.'
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={`${plusJakarta.variable} ${dmMono.variable}`}>
      <body className='antialiased'>
        <GlassFilter />
        <ThemeProvider>
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
