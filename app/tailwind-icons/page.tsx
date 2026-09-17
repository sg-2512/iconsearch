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
    title: `Tailwind CSS Icons Guide (${year}) — Sizing, Dark Mode & currentColor`,
    description: 'Learn how to integrate and style SVG icons with Tailwind CSS v4. Explore currentColor, size utilities, hover micro-animations, and Heroicons vs Lucide comparison.',
    path: '/tailwind-icons',
    type: 'article',
    keywords: [
      'tailwind icons',
      'tailwind css svg icons',
      'currentcolor tailwind',
      'heroicons tailwind',
      'icon sizing tailwind v4',
      'tailwind css vector icons',
      'tailwind hover icon animation',
      'lucide react tailwind',
      'dark mode icons tailwind',
    ],
  })
}

const tailwindFaqs = [
  {
    q: 'How does currentColor work with Tailwind CSS text color utilities?',
    a: 'SVG icons styled with `stroke="currentColor"` or `fill="currentColor"` inherit the CSS `color` computed property from their parent element or direct class list. Applying Tailwind classes like `text-zinc-600 dark:text-zinc-300 hover:text-indigo-600` dynamically recolors the SVG icon without requiring custom fill/stroke CSS rules.',
  },
  {
    q: 'What is the recommended sizing utility for icons in Tailwind CSS v4?',
    a: 'In Tailwind CSS v3.4+ and v4, the `size-*` utility (e.g. `size-4`, `size-5`, `size-6`) sets both width and height simultaneously (`width: 1.25rem; height: 1.25rem`), eliminating the need to write separate `w-5 h-5` classes.',
  },
  {
    q: 'How do I optically align an SVG icon with adjacent typography in Tailwind?',
    a: 'Wrap your label and icon in an element with `flex items-center gap-1.5`. Because letter ascenders/descenders can create optical imbalance, you can apply `-mt-0.5` or `translate-y-[-1px]` to vertically center icons with uppercase text or button labels.',
  },
  {
    q: 'Can I animate SVG icons on button hover using Tailwind group classes?',
    a: 'Yes. Add `group` to the parent button and `transition-transform group-hover:translate-x-0.5` or `group-hover:rotate-12` to the icon component for smooth GPU-accelerated micro-interactions.',
  },
  {
    q: 'What is the difference between Heroicons and Lucide for Tailwind projects?',
    a: 'Heroicons was created by Tailwind Labs to match Tailwind UI components natively with 20px (mini), 24px (outline/solid), and 16px (micro) variants. Lucide Icons is a broader community library with 1,900+ icons and customizable stroke-width properties (`strokeWidth={1.75}`).',
  },
]

export default function TailwindIconsPage() {
  const currentYear = getDynamicYear()
  const lastUpdated = getFormattedCurrentMonthYear()
  const tailwindFriendly = icons.filter((i) => i.frameworks.includes('react'))

  const hubSchema = generateFrameworkHubSchema({
    name: `Tailwind CSS Icons Guide (${currentYear}) — Sizing, Dark Mode & currentColor`,
    description:
      'Learn how to integrate and style SVG icons with Tailwind CSS v4. Explore currentColor, size utilities, hover micro-animations, and Heroicons vs Lucide comparison.',
    path: '/tailwind-icons',
    datePublished: '2026-08-17',
    dateModified: '2026-08-20',
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Tailwind Icons', url: '/tailwind-icons' },
  ])

  const faqSchema = generateFAQSchema(tailwindFaqs)

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
            TAILWIND CSS STYLING & UTILITIES
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: '999px' }}>
            Last updated: {lastUpdated}
          </div>
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px' }}>
          Tailwind CSS Icons: <span style={{ color: 'var(--accent)' }}>Sizing, Dark Mode & currentColor</span> ({currentYear})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '780px', lineHeight: 1.8, marginBottom: '20px' }}>
          Master SVG icon styling in modern Tailwind CSS. Learn how <code>currentColor</code> handles seamless dark mode transitions, 
          streamline component sizing with <code>size-*</code>, and build responsive interactive UI buttons.
        </p>
        <div style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)', borderRadius: '8px', padding: '14px 18px', display: 'inline-block' }}>
          <span style={{ fontSize: '13px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
            TL;DR — Heroicons is the official Tailwind Labs icon library. Lucide is the most versatile general-purpose alternative.
          </span>
        </div>
      </section>

      {/* Tailwind Utility Patterns */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', color: 'var(--text)' }}>
          How does currentColor enable dark mode and dynamic text coloring in Tailwind CSS?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
          SVG icons styled with <code>currentColor</code> automatically inherit the computed CSS <code>color</code> property from their parent container or direct utility class list. Applying Tailwind classes like <code>text-zinc-600 dark:text-zinc-300 hover:text-indigo-600</code> dynamically recolors stroke and fill attributes across light mode, dark mode, and interactive hover states without requiring bespoke CSS rules. This approach guarantees that vector graphics always synchronize with your application theme, typography hierarchy, and active focus states across your entire frontend stack.
        </p>

        <div style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px', marginBottom: '24px', overflowX: 'auto' }}>
          <pre style={{ margin: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--green)', lineHeight: 1.6 }}>
{`// 1. Sizing: Use 'size-*' for proportional dimensions
<Home className="size-4" /> {/* 16px */}
<Home className="size-5" /> {/* 20px - standard UI */}
<Home className="size-6" /> {/* 24px - headers/nav */}

// 2. Dark Mode: Automatic color switching via currentColor
<Settings className="size-5 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" />

// 3. Interactive Buttons: Micro-animations with group-hover
<button className="group flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
  <span>Continue to Checkout</span>
  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
</button>`}
          </pre>
        </div>
      </section>

      {/* Semantic Comparison Table */}
      <section style={{ marginBottom: '56px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px', color: 'var(--text)' }}>
          Which icon libraries integrate best with Tailwind CSS utility classes?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
          Tailwind CSS compatible libraries forward the <code>className</code> prop directly to the root <code>&lt;svg&gt;</code> tag and default their paths to <code>currentColor</code>. The comparison table below outlines top Tailwind-ready libraries, licenses, TypeScript support, and primary packages:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <caption style={{ textAlign: 'left', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', captionSide: 'top' }}>
              Comparison of Tailwind CSS Compatible Vector Icon Libraries ({currentYear})
            </caption>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                <th style={{ padding: '12px 14px' }}>Library</th>
                <th style={{ padding: '12px 14px' }}>Total Icons</th>
                <th style={{ padding: '12px 14px' }}>License</th>
                <th style={{ padding: '12px 14px' }}>TypeScript</th>
                <th style={{ padding: '12px 14px' }}>Tailwind Fit</th>
                <th style={{ padding: '12px 14px' }}>Primary NPM Package</th>
              </tr>
            </thead>
            <tbody>
              {tailwindFriendly.slice(0, 8).map((lib) => (
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
                    {lib.slug === 'heroicons' ? 'Official Tailwind UI' : 'className prop / currentColor'}
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

      {/* Directory of Tailwind Libraries */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', color: 'var(--text)' }}>
          Tailwind CSS Compatible Icon Sets ({tailwindFriendly.length})
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          {tailwindFriendly.map((icon, index) => (
            <div key={icon.slug} style={{ background: 'var(--bg-card)', padding: '28px 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', minWidth: '28px' }}>
                    #{index + 1}
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>{icon.name}</h3>
                  {icon.slug === 'heroicons' && (
                    <span style={{ fontSize: '11px', background: 'var(--accent)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace' }}>
                      BY TAILWIND LABS
                    </span>
                  )}
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
          Tailwind CSS Icon Styling FAQ
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tailwindFaqs.map((faq, i) => (
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

      {/* Footer Navigation */}
      <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '48px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Next: Explore TypeScript & Framework Guides</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Type-safe icon components in React, Next.js, Vue, and Svelte.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/typescript-icons" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            TypeScript Guide →
          </Link>
          <Link href="/react-icons" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--text)', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace' }}>
            React Guide →
          </Link>
        </div>
      </section>

      {/* Non-Affiliation Disclaimer */}
      <footer style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.7 }}>
          Disclaimer: IconSearch is an independent open-source discovery platform and is not affiliated with, sponsored by, or endorsed by Tailwind Labs, Tailwind CSS, or any featured icon library maintainers.
        </p>
      </footer>
    </main>
  )
}
