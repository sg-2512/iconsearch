import type { Metadata } from 'next'
import './globals.css'
import Sidebar from './components/Sidebar'
import CartDrawer from './components/CartDrawer'
import { JetBrains_Mono, Inter } from 'next/font/google'
import Link from 'next/link'
import Script from 'next/script'
import { Analytics } from "@vercel/analytics/next"
import { footerLegalLinks, internalLinkGroups } from '../data/internal-links'
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
        <Sidebar />
        <div className="app-main">
          {children}

        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: '48px',
          marginTop: '80px',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            {/* Footer Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '40px', marginBottom: '48px' }}>

              {/* Brand */}
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '16px', color: 'var(--text)', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--accent)' }}>&lt;</span>IconSearch<span style={{ color: 'var(--accent)' }}>/&gt;</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.7 }}>
                  Independent resource for comparing open source icon libraries.
                </p>
              </div>

              {internalLinkGroups.map(group => (
                <div key={group.title}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px', marginBottom: '12px' }}>
                    {group.title}
                  </div>
                  {group.links.map(link => (
                    <Link key={link.href} href={link.href} style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}

            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                <span style={{ color: 'var(--accent)' }}>// </span>
                IconSearch is an independent resource not affiliated with any icon library project.
              </span>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {footerLegalLinks.map(link => (
                  <Link key={link.href} href={link.href} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </footer>
        </div>
        <Analytics />
        <CartDrawer />
      </body>
    </html>
  )
}
