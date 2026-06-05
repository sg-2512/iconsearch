import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import { JetBrains_Mono, Inter } from 'next/font/google'
import Link from 'next/link'
import Script from 'next/script'
import { Analytics } from "@vercel/analytics/next"

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
  description: 'Search 350,000+ free SVG icons across Lucide, Heroicons, Tabler, Phosphor, Bootstrap, Remix, Feather, Radix, Iconoir, IonIcons, Octicons, and Iconify. Compare 16 React icon libraries by size, stars, and license.',
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
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "IconSearch",
              "alternateName": "IconSearch",
              "url": "https://iconsearch.info"
            })
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
        <Navbar />
        <div style={{ minHeight: 'calc(100vh - 60px - 80px)' }}>
          {children}
        </div>

        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: '48px',
          marginTop: '80px',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            {/* Footer Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '40px', marginBottom: '48px' }}>

              {/* Brand */}
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '16px', color: 'var(--text)', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--accent)' }}>&lt;</span>IconSearch<span style={{ color: 'var(--accent)' }}>/&gt;</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.7 }}>
                  Independent resource for comparing open source icon libraries.
                </p>
              </div>

              {/* Libraries */}
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px', marginBottom: '12px' }}>
                  LIBRARIES
                </div>
                {[
                  { label: 'Lucide Icons', href: '/icons/lucide-icons' },
                  { label: 'Heroicons', href: '/icons/heroicons' },
                  { label: 'Tabler Icons', href: '/icons/tabler-icons' },
                  { label: 'Phosphor Icons', href: '/icons/phosphor-icons' },
                  { label: 'All Libraries', href: '/free-svg-icons' },
                ].map(link => (
                  <Link key={link.href} href={link.href} style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Frameworks */}
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px', marginBottom: '12px' }}>
                  FRAMEWORKS
                </div>
                {[
                  { label: 'React Icons', href: '/react-icons' },
                  { label: 'Next.js Icons', href: '/nextjs-icons' },
                  { label: 'Vue Icons', href: '/vue-icons' },
                  { label: 'Svelte Icons', href: '/svelte-icons' },
                  { label: 'Tailwind Icons', href: '/tailwind-icons' },
                ].map(link => (
                  <Link key={link.href} href={link.href} style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Use Cases */}
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px', marginBottom: '12px' }}>
                  USE CASES
                </div>
                {[
                  { label: 'Icons for SaaS', href: '/use-cases/icons-for-saas' },
                  { label: 'Icons for Dashboards', href: '/use-cases/icons-for-dashboards' },
                  { label: 'Icons for Mobile', href: '/use-cases/icons-for-mobile-apps' },
                  { label: 'Icons for Dark Mode', href: '/use-cases/icons-for-dark-mode' },
                  { label: 'All Use Cases', href: '/use-cases' },
                ].map(link => (
                  <Link key={link.href} href={link.href} style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Resources */}
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px', marginBottom: '12px' }}>
                  RESOURCES
                </div>
                {[
                  { label: 'Browse', href: '/free-svg-icons' },
                  { label: 'Compare', href: '/compare' },
                  { label: 'Site Directory', href: '/directory' },
                  { label: 'Best For You', href: '/best-for-you' },
                  { label: 'Categories', href: '/icons/category' },
                  { label: 'License Guide', href: '/licenses' },
                  { label: 'Use Cases', href: '/use-cases' },
                  { label: 'Stats', href: '/stats' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'TypeScript Icons', href: '/typescript-icons' },
                ].map(link => (
                  <Link key={link.href} href={link.href} style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
                    {link.label}
                  </Link>
                ))}
              </div>

            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                <span style={{ color: 'var(--accent)' }}>// </span>
                IconSearch is an independent resource not affiliated with any icon library project.
              </span>
              <div style={{ display: 'flex', gap: '20px' }}>
                {[
                  { label: 'About', href: '/about' },
                  { label: 'Best For You', href: '/best-for-you' },
                  { label: 'Privacy Policy', href: '/privacy-policy' },
                  { label: 'Terms', href: '/terms' },
                  { label: 'Contact', href: '/contact' },
                ].map(link => (
                  <Link key={link.href} href={link.href} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}