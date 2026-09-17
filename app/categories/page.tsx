import React from 'react'
import Link from 'next/link'
import { getAllCategories } from '../../lib/categories'
import { createPageMetadata, generateBreadcrumbSchema } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'Icon Categories Directory (2026) — 25 High-Intent SVG Taxonomies',
  description: 'Browse 355,000+ vector SVG icons organized across 25 curated categories including AI, Commerce, Security, Arrows, Media, Development, and Healthcare.',
  path: '/categories',
  keywords: [
    'svg icon categories',
    'vector icon categories',
    'icon taxonomy',
    'free icon categories',
    'ai icons svg',
    'ecommerce icons svg',
    'security icons vector',
    'arrow icons svg',
    'ui icons directory',
    'commercial use svg icons',
  ],
})

export default function CategoriesIndexPage() {
  const categories = getAllCategories()

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories' },
  ]

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs)

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'IconSearch Categories Directory',
    description: 'Explore 25 curated vector icon categories spanning 355,000+ SVG icons from 229 open-source libraries.',
    url: 'https://iconsearch.info/categories',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: categories.length,
      itemListElement: categories.map((cat, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: cat.name,
        url: `https://iconsearch.info/categories/${cat.slug}`,
      })),
    },
  }

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [collectionSchema, breadcrumbSchema],
  }

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 48px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaGraph).replace(/</g, '\\u003c'),
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
        <span style={{ color: 'var(--accent)' }}>Categories</span>
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
          TAXONOMY DIRECTORY
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
          Icon Categories Directory
        </h1>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '16px',
            maxWidth: '800px',
            lineHeight: 1.8,
            marginBottom: '0',
          }}
        >
          Explore over 355,000 open-source vector SVG icons organized into 25 high-intent domain taxonomies.
          Each category page includes interactive search, style filtering, copy snippets, and live SVG customizer.
        </p>
      </header>

      {/* Categories Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '56px',
        }}
      >
        {categories.map((cat, idx) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
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
              transition: 'border-color 0.15s ease, transform 0.15s ease',
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
                    fontSize: '12px',
                    color: 'var(--accent)',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-dim)',
                    background: 'var(--code-bg)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  {cat.keywords.length} tags
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
                {cat.name}
              </h2>

              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  marginBottom: '16px',
                }}
              >
                {cat.description}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap',
                borderTop: '1px solid var(--border)',
                paddingTop: '14px',
              }}
            >
              {cat.keywords.slice(0, 4).map((kw) => (
                <span
                  key={kw}
                  style={{
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--text-dim)',
                    background: 'rgba(255,255,255,0.03)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  #{kw}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
