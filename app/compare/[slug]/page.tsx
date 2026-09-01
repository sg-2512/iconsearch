import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { icons, getIconBySlug, type IconLibrary } from '../../../lib/icons'
import {
  createPageMetadata,
  generateComparisonSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '../../../lib/seo'

interface ComparePageProps {
  params: Promise<{ slug: string }> | { slug: string }
}

function resolveComparisonLibraries(slug: string): [IconLibrary, IconLibrary] | null {
  const parts = slug.split('-vs-')
  if (parts.length !== 2) return null

  const slugA = parts[0].trim().toLowerCase()
  const slugB = parts[1].trim().toLowerCase()

  const findLib = (s: string) => {
    let lib = getIconBySlug(s)
    if (lib) return lib
    lib = getIconBySlug(`${s}-icons`)
    if (lib) return lib
    lib = icons.find((i) => i.name.toLowerCase().includes(s) || i.npm.toLowerCase().includes(s))
    return lib
  }

  const libA = findLib(slugA)
  const libB = findLib(slugB)

  if (!libA || !libB || libA.slug === libB.slug) return null
  return [libA, libB]
}

export async function generateStaticParams() {
  const paramsList: { slug: string }[] = []
  const topSlugs = ['lucide-icons', 'heroicons', 'tabler-icons', 'phosphor-icons', 'remix-icons', 'radix-icons', 'feather-icons', 'octicons']

  for (let i = 0; i < topSlugs.length; i++) {
    for (let j = i + 1; j < topSlugs.length; j++) {
      paramsList.push({ slug: `${topSlugs[i]}-vs-${topSlugs[j]}` })
      // Add shorter aliases
      const shortA = topSlugs[i].replace('-icons', '')
      const shortB = topSlugs[j].replace('-icons', '')
      if (shortA !== topSlugs[i] || shortB !== topSlugs[j]) {
        paramsList.push({ slug: `${shortA}-vs-${shortB}` })
      }
    }
  }

  return paramsList
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const pair = resolveComparisonLibraries(resolvedParams.slug)

  if (!pair) {
    return {
      title: 'Icon Library Comparison — IconSearch',
    }
  }

  const [libA, libB] = pair
  return createPageMetadata({
    title: `${libA.name} vs ${libB.name}: Architectural Comparison (2026)`,
    description: `Head-to-head comparison of ${libA.name} and ${libB.name}. Compare icon counts (${libA.iconCount.toLocaleString()} vs ${libB.iconCount.toLocaleString()}), bundle size, tree-shaking, licenses (${libA.license} vs ${libB.license}), and framework support.`,
    path: `/compare/${resolvedParams.slug}`,
    type: 'article',
    keywords: [
      `${libA.name.toLowerCase()} vs ${libB.name.toLowerCase()}`,
      `${libA.slug} vs ${libB.slug}`,
      'icon library comparison',
      'best react icons',
      'svg icons comparison 2026',
    ],
  })
}

export default async function ComparePage({ params }: ComparePageProps) {
  const resolvedParams = await params
  const pair = resolveComparisonLibraries(resolvedParams.slug)

  if (!pair) {
    notFound()
  }

  const [libA, libB] = pair

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Compare', url: '/compare' },
    { name: `${libA.name} vs ${libB.name}`, url: `/compare/${resolvedParams.slug}` },
  ]

  const comparisonFaqs = [
    {
      q: `When should I choose ${libA.name} over ${libB.name}?`,
      a: `${libA.name} is ideal if you prioritize ${libA.pros.join(', ').toLowerCase()} and require ${libA.iconCount.toLocaleString()} available icons.`,
    },
    {
      q: `When should I choose ${libB.name} over ${libA.name}?`,
      a: `${libB.name} is recommended if you benefit from ${libB.pros.join(', ').toLowerCase()} with native ${libB.frameworks.join(', ')} support.`,
    },
    {
      q: `Can I use both ${libA.name} and ${libB.name} in the same React project?`,
      a: `Yes, both packages support tree-shaking and can coexist without bundle conflicts when using ESM named imports. However, maintaining visual consistency in stroke weights is recommended.`,
    },
  ]

  const comparisonSchema = generateComparisonSchema({
    libA: libA.name,
    libB: libB.name,
    path: `/compare/${resolvedParams.slug}`,
    description: `In-depth architectural comparison between ${libA.name} and ${libB.name}.`,
  })

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs)
  const faqSchema = generateFAQSchema(comparisonFaqs)

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [comparisonSchema, breadcrumbSchema, faqSchema],
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
        <Link href="/compare" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
          Compare
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--accent)' }}>
          {libA.name} vs {libB.name}
        </span>
      </nav>

      {/* Hero Header */}
      <header
        style={{
          marginBottom: '48px',
          paddingBottom: '36px',
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
            textTransform: 'uppercase',
          }}
        >
          HEAD-TO-HEAD COMPARISON
        </div>
        <h1
          style={{
            fontSize: 'clamp(28px, 4.5vw, 46px)',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '16px',
            color: 'var(--text)',
          }}
        >
          {libA.name} <span style={{ color: 'var(--text-dim)' }}>vs</span> {libB.name}
        </h1>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '16px',
            maxWidth: '820px',
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          Detailed comparison of icon design consistency, total collection volume, licensing, bundle ergonomics, and framework compatibility.
        </p>
      </header>

      {/* Side-by-Side Key Metrics Table */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', color: 'var(--text)' }}>
          1. Direct Specifications Matrix
        </h2>

        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--code-bg)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                  FEATURE / METRIC
                </th>
                <th style={{ padding: '16px 20px', fontSize: '15px', color: 'var(--accent)', fontWeight: 700 }}>
                  {libA.name}
                </th>
                <th style={{ padding: '16px 20px', fontSize: '15px', color: 'var(--green)', fontWeight: 700 }}>
                  {libB.name}
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '14px' }}>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Icons</td>
                <td style={{ padding: '14px 20px', fontWeight: 700 }}>{libA.iconCount.toLocaleString()}</td>
                <td style={{ padding: '14px 20px', fontWeight: 700 }}>{libB.iconCount.toLocaleString()}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>License</td>
                <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace' }}>{libA.license}</td>
                <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace' }}>{libB.license}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>NPM Package</td>
                <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)' }}>{libA.npm}</td>
                <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--green)' }}>{libB.npm}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>GitHub Stars</td>
                <td style={{ padding: '14px 20px' }}>⭐ {libA.stars.toLocaleString()}</td>
                <td style={{ padding: '14px 20px' }}>⭐ {libB.stars.toLocaleString()}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>Styles Supported</td>
                <td style={{ padding: '14px 20px' }}>{libA.style.join(', ')}</td>
                <td style={{ padding: '14px 20px' }}>{libB.style.join(', ')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>TypeScript Support</td>
                <td style={{ padding: '14px 20px' }}>{libA.typescript ? '✅ First-class types' : '⚠️ Community types'}</td>
                <td style={{ padding: '14px 20px' }}>{libB.typescript ? '✅ First-class types' : '⚠️ Community types'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>Tree-Shakable</td>
                <td style={{ padding: '14px 20px' }}>{libA.treeshakable ? '✅ Yes (ESM)' : '❌ Monolith'}</td>
                <td style={{ padding: '14px 20px' }}>{libB.treeshakable ? '✅ Yes (ESM)' : '❌ Monolith'}</td>
              </tr>
              <tr>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>Frameworks</td>
                <td style={{ padding: '14px 20px' }}>{libA.frameworks.join(', ')}</td>
                <td style={{ padding: '14px 20px' }}>{libB.frameworks.join(', ')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pros & Cons Grid */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', color: 'var(--text)' }}>
          2. Architectural Strengths & Trade-offs
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Lib A Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--accent)' }}>
              {libA.name} Overview
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '16px' }}>
              {libA.description}
            </p>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--green)', marginBottom: '8px' }}>Key Advantages:</div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {libA.pros.map((pro, i) => (
                  <li key={i}>{pro}</li>
                ))}
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--amber)', marginBottom: '8px' }}>Trade-offs:</div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {libA.cons.map((con, i) => (
                  <li key={i}>{con}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Lib B Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--green)' }}>
              {libB.name} Overview
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '16px' }}>
              {libB.description}
            </p>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--green)', marginBottom: '8px' }}>Key Advantages:</div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {libB.pros.map((pro, i) => (
                  <li key={i}>{pro}</li>
                ))}
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--amber)', marginBottom: '8px' }}>Trade-offs:</div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {libB.cons.map((con, i) => (
                  <li key={i}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Code Installation & Usage Comparison */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', color: 'var(--text)' }}>
          3. Installation & Usage Syntax
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>{libA.name}</h3>
            <pre style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', overflowX: 'auto', marginBottom: '10px' }}>
              {libA.installCommand}
            </pre>
            <pre style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text)', overflowX: 'auto' }}>
              {libA.usageExample}
            </pre>
          </div>

          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>{libB.name}</h3>
            <pre style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--green)', overflowX: 'auto', marginBottom: '10px' }}>
              {libB.installCommand}
            </pre>
            <pre style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text)', overflowX: 'auto' }}>
              {libB.usageExample}
            </pre>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section style={{ marginBottom: '56px', borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', color: 'var(--text)' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {comparisonFaqs.map((faq, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px 24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: 'var(--text)' }}>
                {faq.q}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.75, margin: 0 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Links */}
      <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>Browse Individual Collections</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Explore the full vector catalogs and one-click copy snippets for both libraries.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href={`/icons/${libA.slug}`} style={{ background: 'var(--accent)', color: '#fff', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            {libA.name} Catalog →
          </Link>
          <Link href={`/icons/${libB.slug}`} style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', color: 'var(--text)', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace' }}>
            {libB.name} Catalog →
          </Link>
        </div>
      </section>
    </main>
  )
}
