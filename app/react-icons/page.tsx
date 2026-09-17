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
    title: `React Icons Guide ${year} — Top Free SVG Icon Libraries & Tree-Shaking`,
    description: 'In-depth architectural comparison of the best React icon libraries (Lucide, Heroicons, Tabler, Phosphor, Radix). Learn tree-shaking, Server Components, and bundle optimization.',
    path: '/react-icons',
    type: 'article',
    keywords: [
      'react icons',
      'best react icon library',
      'tree shaking react icons',
      'lucide react vs react-icons',
      'react svg component',
      'react icons download',
      'server components react icons',
      'react vector icons free',
      'react jsx icons',
      'heroicons react',
      'tabler icons react',
    ],
  })
}

const reactFaqs = [
  {
    q: 'How does tree-shaking work with React icon libraries?',
    a: 'Modern React icon packages like lucide-react and @heroicons/react export each icon as an isolated ES module (ESM). When you write `import { Home, Settings } from "lucide-react"`, modern bundlers (Webpack 5, Vite, Rollup, Turbopack) only bundle the JavaScript and SVG path data for those specific components, discarding the thousands of unused icons.',
  },
  {
    q: 'Why should I avoid importing all icons from a single monolith package?',
    a: 'Older wrapper packages or improper CommonJS imports can inadvertently bundle entire icon registries (often 5MB to 40MB of unused vector data) into your client bundle. Always use named ESM imports or path-based imports to ensure the bundler can eliminate dead code.',
  },
  {
    q: 'Can I render SVG icon components inside React Server Components (RSC)?',
    a: 'Yes. Libraries like Lucide React, Heroicons, and Radix Icons render pure SVG elements with standard JSX attributes and do not invoke React state hooks (useState, useEffect) or Context. They render on the server to static HTML with zero client runtime overhead.',
  },
  {
    q: 'How do I style React SVG icons with Tailwind CSS?',
    a: 'Modern icon libraries use `currentColor` for their stroke and fill attributes. You can pass standard Tailwind CSS text color classes (such as `text-blue-600`, `hover:text-blue-800`, `dark:text-blue-400`) and sizing utilities (`w-5 h-5`, `size-6`) directly through the `className` prop.',
  },
  {
    q: 'What is the best way to handle dynamic icon names in React?',
    a: 'For dynamic icon rendering from CMS data or databases, avoid importing the entire icon library object. Instead, build an explicit lookup dictionary mapping allowed icon keys to lazy-loaded components with `React.lazy()` and `Suspense`, or use an icon proxy component.',
  },
]

export default function ReactIconsPage() {
  const currentYear = getDynamicYear()
  const lastUpdated = getFormattedCurrentMonthYear()
  const reactIcons = icons.filter((i) => i.frameworks.includes('react'))

  const hubSchema = generateFrameworkHubSchema({
    name: `React Icons Guide ${currentYear} — Top Free SVG Icon Libraries & Tree-Shaking`,
    description:
      'In-depth architectural comparison of the best React icon libraries (Lucide, Heroicons, Tabler, Phosphor, Radix). Learn tree-shaking, Server Components, and bundle optimization.',
    path: '/react-icons',
    datePublished: '2026-08-17',
    dateModified: '2026-08-20',
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'React Icons', url: '/react-icons' },
  ])

  const faqSchema = generateFAQSchema(reactFaqs)

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
            REACT ARCHITECTURE & ECOSYSTEM
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: '999px' }}>
            Last updated: {lastUpdated}
          </div>
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px' }}>
          React Icons: <span style={{ color: 'var(--accent)' }}>The Complete Developer Guide</span> ({currentYear})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '780px', lineHeight: 1.8, marginBottom: '20px' }}>
          Selecting the right icon architecture is critical for frontend performance, developer velocity, and bundle size.
          Compare verified open-source libraries, understand tree-shaking mechanics, and implement zero-runtime SVG rendering in modern React.
        </p>
        <div style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)', borderRadius: '8px', padding: '14px 18px', display: 'inline-block' }}>
          <span style={{ fontSize: '13px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
            TL;DR — Use Lucide React for general web applications. Use Heroicons when building with Tailwind UI.
          </span>
        </div>
      </section>

      {/* Deep-dive: React Icon Architecture */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', color: 'var(--text)' }}>
          What is the difference between React icon component packages and multi-set wrappers?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
          Dedicated React icon component packages export isolated ES modules per icon with zero runtime overhead, whereas multi-set wrappers aggregate multiple libraries under subpath imports. For modern React applications, dedicated packages like Lucide React and Heroicons deliver optimal tree-shaking and smaller bundle footprints. Dedicated packages compile each SVG glyph into an individual component with explicit TypeScript declarations, ensuring that your bundler only extracts the exact icons referenced in code while preserving full IDE autocomplete and prop forwarding.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', color: 'var(--text)' }}>
              Dedicated Component Packages
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '12px' }}>
              Built specifically for a single icon system. Each icon is compiled into an isolated ESM module with individual TypeScript declaration files.
            </p>
            <ul style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
              <li><strong>Pros:</strong> Flawless tree-shaking, visual consistency, smaller package install size, native prop forwarding.</li>
              <li><strong>Cons:</strong> Limited to the design system boundaries of that single library.</li>
              <li><strong>Top examples:</strong> Lucide React, Heroicons, Tabler React, Radix Icons.</li>
            </ul>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', color: 'var(--text)' }}>
              Multi-Set Wrapper Packages
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '12px' }}>
              Aggregates dozens of third-party icon collections under a unified React component API using subpath imports.
            </p>
            <ul style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
              <li><strong>Pros:</strong> Massive variety (40,000+ icons), unified syntax across multiple design sets.</li>
              <li><strong>Cons:</strong> Potential bundle bloat if subpath imports are missed; inconsistent stroke weights across sets.</li>
              <li><strong>Top examples:</strong> React Icons (`react-icons/fa`, `react-icons/md`).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Semantic Comparison Table */}
      <section style={{ marginBottom: '56px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px', color: 'var(--text)' }}>
          Which React icon libraries offer the best tree-shaking and bundle weight?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
          Comparing bundle weights across React icon packages reveals that individual tree-shaken ESM exports add under 1KB per icon to client bundles. The comparison table below details package architectures, licenses, TypeScript support, and npm packages for verified React libraries:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <caption style={{ textAlign: 'left', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', captionSide: 'top' }}>
              Comparison of Leading React SVG Icon Libraries ({currentYear})
            </caption>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                <th style={{ padding: '12px 14px' }}>Library</th>
                <th style={{ padding: '12px 14px' }}>Total Icons</th>
                <th style={{ padding: '12px 14px' }}>License</th>
                <th style={{ padding: '12px 14px' }}>TypeScript</th>
                <th style={{ padding: '12px 14px' }}>Bundle Weight</th>
                <th style={{ padding: '12px 14px' }}>Primary NPM Package</th>
              </tr>
            </thead>
            <tbody>
              {reactIcons.slice(0, 8).map((lib) => (
                <tr key={lib.slug} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                    <Link href={`/icons/${lib.slug}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                      {lib.name}
                    </Link>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {lib.iconCount.toLocaleString('en-US')}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {lib.license}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--cyan)' }}>
                    {lib.typescript ? 'Native .d.ts' : 'Community'}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                    ~0.8KB / icon
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                    <code>{lib.installCommand.replace('npm install ', '')}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Code Implementation Patterns */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', color: 'var(--text)' }}>
          How do you optimize React icon tree-shaking and bundle size?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, marginBottom: '16px' }}>
          To optimize React icon bundle weight, use named ESM imports from libraries configured with `sideEffects: false` and avoid barrel file imports that bundle entire collections. Named imports ensure bundlers like Vite, Webpack, and Turbopack discard unused SVG definitions, adding only ~0.5KB to 1KB per rendered icon. Avoid global object indexing like `Icons[name]` at runtime because dynamic property lookups prevent static dead-code elimination.
        </p>

        <div style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px', marginBottom: '24px', overflowX: 'auto' }}>
          <pre style={{ margin: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--green)', lineHeight: 1.6 }}>
{`// ✅ Correct: Named imports with clean ESM tree-shaking
import { Home, ArrowRight, Settings } from 'lucide-react'

// ✅ Correct: Subpath imports for multi-set packages
import { FaGithub, FaTwitter } from 'react-icons/fa6'

export function ActionHeader() {
  return (
    <nav className="flex items-center gap-4">
      <Home size={20} className="text-gray-500 hover:text-gray-900" />
      <Settings size={20} className="text-gray-500 hover:text-gray-900" />
    </nav>
  )
}`}
          </pre>
        </div>
      </section>

      {/* Top Libraries Directory */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', color: 'var(--text)' }}>
          Top Verified React Icon Libraries ({reactIcons.length})
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          {reactIcons.map((icon, index) => (
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

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link href={`/icons/${icon.slug}`} style={{ background: 'var(--accent)', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace' }}>
                  Full Guide & Catalog →
                </Link>
                {icon.typescript && <span style={{ fontSize: '12px', color: 'var(--cyan)', fontFamily: 'JetBrains Mono, monospace' }}>✓ TypeScript</span>}
                {icon.treeshakable && <span style={{ fontSize: '12px', color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace' }}>✓ Tree-shakable</span>}
                {icon.figmaPlugin && <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>✓ Figma Plugin</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section style={{ marginBottom: '56px', borderTop: '1px solid var(--border)', paddingTop: '48px' }}>
        <div style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px', marginBottom: '12px' }}>
          FREQUENTLY ASKED QUESTIONS
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', color: 'var(--text)' }}>
          React Icon Optimization FAQ
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reactFaqs.map((faq, i) => (
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

      {/* Next Step Navigation */}
      <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '48px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Next: Explore Framework Guides</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Learn how to set up SVG icons in Next.js App Router, Tailwind CSS, or TypeScript.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/nextjs-icons" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            Next.js Icons Guide →
          </Link>
          <Link href="/tailwind-icons" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--text)', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace' }}>
            Tailwind CSS →
          </Link>
        </div>
      </section>

      {/* Non-Affiliation Disclaimer */}
      <footer style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.7 }}>
          Disclaimer: IconSearch is an independent open-source discovery platform and is not affiliated with, sponsored by, or endorsed by React, Meta, or any featured icon library maintainers.
        </p>
      </footer>
    </main>
  )
}
