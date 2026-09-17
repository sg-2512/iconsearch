import type { Metadata } from 'next'
import './globals.css'
import AppShell from './components/AppShell'
import GoogleAdSense from './components/GoogleAdSense'
import GoogleAnalytics from './components/GoogleAnalytics'
import { JetBrains_Mono, Inter } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { NAMED_LIBRARY_COUNT, SEARCHABLE_ICON_COUNT } from '../data/library-catalog'
import {
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  DEFAULT_TWITTER_IMAGE,
  SITE_NAME,
  SITE_URL,
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '../lib/seo'

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Free SVG Icons — 355,000+ Vector Icons for Commercial Use | IconSearch`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `Search, customize, and download 355,000+ free SVG icons for commercial use from 229 open-source icon libraries. Export clean SVG, React JSX, Vue, and Tailwind components in one click.`,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'technology',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: `IconSearch — ${SEARCHABLE_ICON_COUNT.toLocaleString('en-US')} Free SVG Icons`,
    description: `Search, customize, and download free SVG icons from ${NAMED_LIBRARY_COUNT} open-source libraries.`,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'IconSearch — search, customize, and download free SVG icons',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@IconSearchinfo',
    creator: '@IconSearchinfo',
    title: `IconSearch — ${SEARCHABLE_ICON_COUNT.toLocaleString('en-US')} Free SVG Icons`,
    description: `Search, customize, and download free SVG icons from ${NAMED_LIBRARY_COUNT} open-source libraries.`,
    images: [DEFAULT_TWITTER_IMAGE],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${jetbrainsMono.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              generateWebSiteSchema(),
              generateOrganizationSchema(),
            ]),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
        <GoogleAdSense client="ca-pub-7157745573382727" />
        <GoogleAnalytics gaId="G-T75PM4NWBD" />
        <Analytics />
      </body>
    </html>
  )
}
