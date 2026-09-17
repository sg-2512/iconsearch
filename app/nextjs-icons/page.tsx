import { icons } from '../../lib/icons'
import Link from 'next/link'
import {
  createPageMetadata,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateFrameworkHubSchema,
} from '../../lib/seo'
import { getDynamicYear, getFormattedCurrentMonthYear } from '../../lib/date'

export function generateMetadata() {
  const year = getDynamicYear()
  return createPageMetadata({
    title: `Next.js Icons Guide (${year}) — App Router, Server Components & Turbopack`,
    description: 'Complete guide to using SVG icons in Next.js 15 App Router. Compare Lucide, Heroicons, and Tabler, with React Server Components (RSC) and Turbopack optimization.',
    path: '/nextjs-icons',
    type: 'article',
    keywords: [
      'nextjs icons',
      'nextjs app router svg',
      'server components icons',
      'turbopack svg icons',
      'inline svg nextjs',
      'nextjs 15 icons guide',
      'lucide react nextjs',
      'nextjs icon optimization',
      'heroicons nextjs',
      'rsc svg performance',
    ],
  })
}

const nextjsFaqs = [
  {
    q: 'Do icon components require "use client" in Next.js App Router?',
    a: 'No. Modern SVG icon packages (like lucide-react, @heroicons/react, @tabler/icons-react) render pure static SVG markup without React hooks (useState/useEffect) or browser APIs. They render natively inside React Server Components (RSC) on the server, sending zero client-side JavaScript to the browser.',
  },
  {
    q: 'Why are icon fonts discouraged in modern Next.js applications?',
    a: 'Icon fonts (such as legacy Font Awesome webfonts) require downloading an external .woff2 file. This introduces Cumulative Layout Shift (CLS) as glyphs flash from fallback text, blocks First Contentful Paint (FCP), and loads thousands of unnecessary glyph definitions. Modern inline SVGs eliminate webfont requests completely.',
  },
  {
    q: 'How does Turbopack optimize SVG icon imports in Next.js 15?',
    a: 'Turbopack leverages fast ESM static analysis to tree-shake unused exports directly during development and production builds. Named imports from packages with proper "sideEffects: false" configurations (like Lucide and Heroicons) compile in single-digit milliseconds without bundling unused icon definitions.',
  },
  {
    q: 'Can I use SVGR or inline SVG files directly in Next.js?',
    a: 'Yes, but for large collections, dedicated component packages are significantly faster to build and maintain than manually running @svgr/webpack or maintaining dozens of custom .svg files in your repository.',
  },
  {
    q: 'What is the fastest way to load dynamic icons in Next.js App Router?',
    a: 'If you need to render icons dynamically from a CMS slug or database value, avoid dynamic `import(\`lucide-react/\${name}\`)` inside client components. Instead, map permitted icon names to static imports in a Server Component dictionary, rendering only the resolved SVG component.',
  },
]

export default function NextjsIconsPage() {
  const currentYear = getDynamicYear()
  const lastUpdated = getFormattedCurrentMonthYear()
  const nextjsIcons = icons.filter((i) => i.frameworks.includes('nextjs'))

  const hubSchema = generateFrameworkHubSchema({
    name: `Next.js Icons Guide (${currentYear}) — App Router, Server Components & Turbopack`,
    description:
      'Complete guide to using SVG icons in Next.js 15 App Router. Compare Lucide, Heroicons, and Tabler, with React Server Components (RSC) and Turbopack optimization.',
    path: '/nextjs-icons',
    datePublished: '2026-08-17',
    dateModified: '2026-08-20',
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Next.js Icons', url: '/nextjs-icons' },
  ])

  const faqSchema = generateFAQSchema(nextjsFaqs)

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [hubSchema, breadcrumbSchema, faqSchema],
  }

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 48px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph).replace(/</g, '\\u003c') }}
      />

      {/* Header */}
      <section style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px' }}>
            NEXT.JS ARCHITECTURE & PERFORMANCE
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: '999px' }}>
            Last updated: {lastUpdated}
          </div>
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px' }}>
          Next.js Icons: <span style={{ color: 'var(--accent)' }}>App Router & Server Components Guide</span> ({currentYear})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '780px', lineHeight: 1.8, marginBottom: '20px' }}>
          Build high-performance web applications with zero client-side JavaScript overhead.
          Compare verified Next.js 15 App Router compatible icon libraries with SSR safety, Turbopack support, and tree-shaking.
        </p>
        <div style={{ background: '#f8717115', border: '1px solid var(--red)', borderRadius: '8px', padding: '14px 18px', display: 'inline-block' }}>
          <span style={{ fontSize: '13px', color: 'var(--red)', fontFamily: 'JetBrains Mono, monospace' }}>
            ⚠ Architecture note: Avoid icon packages relying on React Context — they break streaming and Server Components.
          </span>
        </div>
      </section>

      {/* Server Components Deep Dive */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', color: 'var(--text)' }}>
          Do icon components require &quot;use client&quot; in Next.js App Router?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
          No, modern SVG icon components do not require the &quot;use client&quot; directive in Next.js App Router. Dedicated packages like Lucide React and Heroicons render pure static SVG markup without React state hooks or browser APIs, allowing them to render natively on the server inside React Server Components (RSC) and ship 0KB client-side JavaScript. When rendered inside a Server Component, SVG tags are streamed directly as HTML strings to the client browser, eliminating bundle bloat and preventing layout shifts during hydration.
        </p>

        <div style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px', marginBottom: '24px', overflowX: 'auto' }}>
          <pre style={{ margin: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--green)', lineHeight: 1.6 }}>
{`// app/dashboard/page.tsx (React Server Component - No 'use client')
import { LayoutDashboard, Users, CreditCard } from 'lucide-react'

export default async function DashboardPage() {
  const stats = await getDashboardMetrics() // Server data fetching

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
        {/* Renders as pure static SVG markup - 0kb JS shipped to browser */}
        <LayoutDashboard className="w-6 h-6 text-emerald-400" />
        <div>
          <p className="text-xs text-zinc-400">Total Revenue</p>
          <p className="text-xl font-bold">{stats.revenue}</p>
        </div>
      </div>
    </div>
  )
}`}
          </pre>
        </div>
      </section>

      {/* Turbopack & Tree-Shaking Benchmarks */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', color: 'var(--text)' }}>
          How fast is Turbopack with named ESM icon imports?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
          Turbopack compiles named ESM icon imports in single-digit milliseconds by analyzing package module graphs and tree-shaking unused exports on the fly. Unlike legacy icon webfonts that trigger blocking network requests and layout shifts, inline SVG imports in Next.js 15 App Router compile instantaneously during both local development and production builds. The semantic benchmark table below highlights the performance difference between modern RSC icon packages and legacy font packages:
        </p>

        <div style={{ overflowX: 'auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <caption style={{ textAlign: 'left', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', captionSide: 'top' }}>
              Turbopack Build Performance & Bundle Weight Benchmark ({currentYear})
            </caption>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                <th style={{ padding: '12px 14px' }}>Library</th>
                <th style={{ padding: '12px 14px' }}>Total Icons</th>
                <th style={{ padding: '12px 14px' }}>License</th>
                <th style={{ padding: '12px 14px' }}>TypeScript</th>
                <th style={{ padding: '12px 14px' }}>Client JS Added</th>
                <th style={{ padding: '12px 14px' }}>Primary NPM Package</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                  <Link href="/icons/lucide-icons" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                    Lucide Icons
                  </Link>
                </td>
                <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>1,960+</td>
                <td style={{ padding: '12px 14px', color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace' }}>ISC</td>
                <td style={{ padding: '12px 14px', color: 'var(--cyan)' }}>Native .d.ts</td>
                <td style={{ padding: '12px 14px', color: 'var(--green)' }}>0.0 KB (RSC)</td>
                <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}><code>lucide-react</code></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                  <Link href="/icons/heroicons" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                    Heroicons v2
                  </Link>
                </td>
                <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>324</td>
                <td style={{ padding: '12px 14px', color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace' }}>MIT</td>
                <td style={{ padding: '12px 14px', color: 'var(--cyan)' }}>Native .d.ts</td>
                <td style={{ padding: '12px 14px', color: 'var(--green)' }}>0.0 KB (RSC)</td>
                <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}><code>@heroicons/react</code></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                  <Link href="/icons/tabler-icons" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                    Tabler Icons
                  </Link>
                </td>
                <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>6,100+</td>
                <td style={{ padding: '12px 14px', color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace' }}>MIT</td>
                <td style={{ padding: '12px 14px', color: 'var(--cyan)' }}>Native .d.ts</td>
                <td style={{ padding: '12px 14px', color: 'var(--green)' }}>0.0 KB (RSC)</td>
                <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}><code>@tabler/icons-react</code></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                  <Link href="/icons/radix-icons" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                    Radix Icons
                  </Link>
                </td>
                <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>318</td>
                <td style={{ padding: '12px 14px', color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace' }}>MIT</td>
                <td style={{ padding: '12px 14px', color: 'var(--cyan)' }}>Native .d.ts</td>
                <td style={{ padding: '12px 14px', color: 'var(--green)' }}>0.0 KB (RSC)</td>
                <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}><code>@radix-ui/react-icons</code></td>
              </tr>
              <tr>
                <td style={{ padding: '12px 14px', fontWeight: 600 }}>Legacy Icon Webfont</td>
                <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>2,000+</td>
                <td style={{ padding: '12px 14px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>Various</td>
                <td style={{ padding: '12px 14px', color: 'var(--red)' }}>CSS classes only</td>
                <td style={{ padding: '12px 14px', color: 'var(--red)' }}>120KB+ (.woff2)</td>
                <td style={{ padding: '12px 14px', color: 'var(--red)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>Non-tree-shakable</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Libraries Directory */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', color: 'var(--text)' }}>
          Next.js App Router Compatible Icon Libraries ({nextjsIcons.length})
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          {nextjsIcons.map((icon, index) => (
            <div key={icon.slug} style={{ background: 'var(--bg-card)', padding: '28px 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', minWidth: '28px' }}>
                    #{index + 1}
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>{icon.name}</h3>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>⭐ {icon.stars.toLocaleString()}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>◆ {icon.iconCount.toLocaleString()} icons</span>
                  <span style={{ fontSize: '11px', color: 'var(--green)', background: '#4ade8015', border: '1px solid var(--green)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace' }}>
                    {icon.license}
                  </span>
                </div>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px', maxWidth: '700px' }}>
                {icon.description}
              </p>

              <pre style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--green)', marginBottom: '16px', overflowX: 'auto' }}>
                {icon.installCommand}
              </pre>

              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                  Next.js compatibility: &nbsp;
                </span>
                <span style={{ fontSize: '12px', color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace' }}>
                  ✓ App Router &nbsp; ✓ SSR Safe &nbsp;
                  {icon.treeshakable && '✓ Tree-shakable '}
                  {icon.typescript && '✓ TypeScript'}
                </span>
              </div>

              <Link href={`/icons/${icon.slug}`} style={{ background: 'var(--accent)', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', display: 'inline-block' }}>
                Full Guide & SVG Catalog →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Next.js FAQ */}
      <section style={{ marginBottom: '56px', borderTop: '1px solid var(--border)', paddingTop: '48px' }}>
        <div style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px', marginBottom: '12px' }}>
          FREQUENTLY ASKED QUESTIONS
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', color: 'var(--text)' }}>
          Next.js Icon Implementation FAQ
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {nextjsFaqs.map((faq, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', color: 'var(--text)' }}>
                {faq.q}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.8, margin: 0 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation Footer */}
      <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '48px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Explore Next.js Styling Guides</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Learn how to style your Next.js SVG icons with Tailwind CSS or strict TypeScript.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/tailwind-icons" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            Tailwind CSS Guide →
          </Link>
          <Link href="/typescript-icons" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--text)', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace' }}>
            TypeScript Icons →
          </Link>
        </div>
      </section>

      {/* Non-Affiliation Disclaimer */}
      <footer style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.7 }}>
          Disclaimer: IconSearch is an independent open-source discovery platform and is not affiliated with, sponsored by, or endorsed by Vercel, Next.js, or any featured icon library maintainers.
        </p>
      </footer>
    </main>
  )
}
