import React from 'react'
import Link from 'next/link'
import { icons } from '../../lib/icons'
import { createPageMetadata, generateBreadcrumbSchema } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'Icon Library Comparisons (2026) — Head-to-Head Architectural Guides',
  description: 'Side-by-side technical comparisons of popular open-source SVG icon libraries: Lucide vs Heroicons, Tabler vs Phosphor, Remix vs Radix, and more.',
  path: '/compare',
})

const POPULAR_COMPARISONS = [
  { slug: 'lucide-icons-vs-heroicons', nameA: 'Lucide Icons', nameB: 'Heroicons', tag: 'Most Popular' },
  { slug: 'tabler-icons-vs-lucide-icons', nameA: 'Tabler Icons', nameB: 'Lucide Icons', tag: 'Volume Comparison' },
  { slug: 'heroicons-vs-tabler-icons', nameA: 'Heroicons', nameB: 'Tabler Icons', tag: 'Tailwind UI Alternatives' },
  { slug: 'phosphor-icons-vs-lucide-icons', nameA: 'Phosphor Icons', nameB: 'Lucide Icons', tag: 'Duotone Styles' },
  { slug: 'remix-icons-vs-tabler-icons', nameA: 'Remix Icon', nameB: 'Tabler Icons', tag: 'General Web UI' },
  { slug: 'radix-icons-vs-heroicons', nameA: 'Radix Icons', nameB: 'Heroicons', tag: 'Micro & Dense UI' },
  { slug: 'feather-icons-vs-lucide-icons', nameA: 'Feather Icons', nameB: 'Lucide Icons', tag: 'Evolution Guide' },
  { slug: 'octicons-vs-lucide-icons', nameA: 'Octicons', nameB: 'Lucide Icons', tag: 'Developer Tools' },
]

export default function CompareIndexPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Compare', url: '/compare' },
  ]

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs)

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 48px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c'),
        }}
      />

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumbs"
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          fontSize: '13px',
          fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--text-dim)',
          marginBottom: '28px',
        }}
      >
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
          Home
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--accent)' }}>Compare</span>
      </nav>

      {/* Header */}
      <header
        style={{
          marginBottom: '48px',
          paddingBottom: '32px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: 'var(--accent)',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '2px',
            marginBottom: '12px',
          }}
        >
          TECHNICAL COMPARISONS
        </div>
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '16px',
            color: 'var(--text)',
          }}
        >
          Icon Library Comparison Matrix
        </h1>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '16px',
            maxWidth: '800px',
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          Evaluate open-source icon sets side by side. Compare vector fidelity, tree-shaking capabilities, TypeScript coverage, bundle footprints, and license compatibility before adopting a design system dependency.
        </p>
      </header>

      {/* Comparisons Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px',
          marginBottom: '56px',
        }}
      >
        {POPULAR_COMPARISONS.map((comp) => (
          <Link
            key={comp.slug}
            href={`/compare/${comp.slug}`}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '24px',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'border-color 0.15s ease',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--green)',
                    background: '#4ade8015',
                    border: '1px solid var(--green)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  {comp.tag}
                </span>
              </div>

              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--text)',
                  marginBottom: '8px',
                }}
              >
                {comp.nameA} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>vs</span> {comp.nameB}
              </h2>

              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Compare specifications, pros/cons, syntax, and performance differences between {comp.nameA} and {comp.nameB}.
              </p>
            </div>

            <div
              style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border)',
                fontSize: '12px',
                color: 'var(--accent)',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 600,
              }}
            >
              View Full Comparison →
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
