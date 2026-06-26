import type { Metadata } from 'next'
import './globals.css'
import AppShell from './components/AppShell'
import { JetBrains_Mono, Inter } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from "@vercel/analytics/next"
import { SEARCHABLE_ICON_COUNT } from '../data/library-catalog'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://iconsearch.info'),
  title: 'IconSearch — Find & Compare 16 Free SVG Icon Libraries (2026)',
  description: `Search ${SEARCHABLE_ICON_COUNT.toLocaleString('en-US')} free SVG icons from 16 named libraries and 224 Iconify collections. Compare 16 React icon libraries by size, stars, and license.`,
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jetbrainsMono.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "IconSearch",
                "alternateName": "IconSearch",
                "url": "https://iconsearch.info",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://iconsearch.info/icon-search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "IconSearch",
                "url": "https://iconsearch.info",
                "logo": "https://iconsearch.info/favicon.svg"
              }
            ])
          }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-T75PM4NWBD`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T75PM4NWBD');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  )
}
