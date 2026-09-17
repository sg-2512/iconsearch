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
    title: `Svelte Icons Guide (${year}) — Svelte 5 Runes, SvelteKit & Vite Tree-Shaking`,
    description: 'Complete guide to using SVG icons in Svelte 5 and SvelteKit. Compare Lucide Svelte, Tabler Svelte, and unplugin-icons with SSR and bundle optimization.',
    path: '/svelte-icons',
    type: 'article',
    keywords: [
      'svelte icons',
      'svelte 5 runes icons',
      'lucide svelte',
      'sveltekit svg icon',
      'svelte vector icons',
      'tabler icons svelte',
      'unplugin icons svelte',
      'svelte 5 icon components',
    ],
  })
}

const svelteFaqs = [
  {
    q: 'How do I use Lucide icons in Svelte 5 with runes?',
    a: 'Install `lucide-svelte` and import icons directly into your `.svelte` component: `<script>import { Sparkles, ArrowRight } from "lucide-svelte";</script> <Sparkles size={20} class="text-indigo-400" />`. Svelte 5 handles prop reactivity and event dispatchers automatically.',
  },
  {
    q: 'Is lucide-svelte compatible with SvelteKit SSR and hydration?',
    a: 'Yes. Lucide Svelte compiles to native Svelte component output with pure inline SVG tags, rendering seamlessly during SvelteKit server-side rendering without hydration mismatches.',
  },
  {
    q: 'Can I dynamically change strokeWidth and color in Svelte?',
    a: 'Yes. Lucide Svelte components expose `strokeWidth`, `size`, `color`, and `class` props that can be bound to reactive state or runes (`$state()`).',
  },
  {
    q: 'What is the best alternative for Svelte if I need 5,000+ icons?',
    a: '`@tabler/icons-svelte` provides over 5,500 icons with the same component ergonomics and first-class SvelteKit support.',
  },
]

export default function SvelteIconsPage() {
  const currentYear = getDynamicYear()
  const lastUpdated = getFormattedCurrentMonthYear()
  const svelteIcons = icons.filter((i) => i.frameworks.includes('svelte'))

  const hubSchema = generateFrameworkHubSchema({
    name: `Svelte Icons Guide (${currentYear}) — Svelte 5 Runes, SvelteKit & Vite Tree-Shaking`,
    description:
      'Complete guide to using SVG icons in Svelte 5 and SvelteKit. Compare Lucide Svelte, Tabler Svelte, and unplugin-icons with SSR and bundle optimization.',
    path: '/svelte-icons',
    datePublished: '2026-08-17',
    dateModified: '2026-08-20',
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Svelte Icons', url: '/svelte-icons' },
  ])

  const faqSchema = generateFAQSchema(svelteFaqs)

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
            SVELTE 5 & SVELTEKIT ARCHITECTURE
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: '999px' }}>
            Last updated: {lastUpdated}
          </div>
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px' }}>
          Svelte Icons: <span style={{ color: 'var(--accent)' }}>Svelte 5 & SvelteKit Guide</span> ({currentYear})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '780px', lineHeight: 1.8, marginBottom: '20px' }}>
          Build lightning-fast Svelte 5 and SvelteKit applications with verified, tree-shakable SVG icon packages.
          Explore reactive prop binding, Svelte runes support, and SSR-safe rendering.
        </p>
        <div style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)', borderRadius: '8px', padding: '14px 18px', display: 'inline-block' }}>
          <span style={{ fontSize: '13px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
            Top Pick: lucide-svelte for modern Svelte 5 & SvelteKit applications.
          </span>
        </div>
      </section>

      {/* Svelte Code Pattern */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', color: 'var(--text)' }}>
          How do you use SVG icons with Svelte 5 runes and SvelteKit?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
          In Svelte 5 and SvelteKit, SVG icons from libraries like <code>lucide-svelte</code> and <code>@tabler/icons-svelte</code> are imported as native Svelte components with full support for reactive <code>$state()</code> runes and bindable props. These components compile to lightweight static SVG markup during SvelteKit SSR with zero client hydration overhead. Svelte&apos;s compiler optimizes template expressions directly, allowing reactive toggling of stroke colors, dimensions, and active states without virtual DOM diffing.
        </p>

        <div style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px', marginBottom: '24px', overflowX: 'auto' }}>
          <pre style={{ margin: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--green)', lineHeight: 1.6 }}>
{`<!-- src/lib/BookmarkButton.svelte -->
<script lang="ts">
  import { Bookmark, BookmarkCheck } from 'lucide-svelte'

  let isSaved = $state(false)

  function toggleSave() {
    isSaved = !isSaved
  }
</script>

<button 
  onclick={toggleSave}
  class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-sm font-medium transition"
>
  {#if isSaved}
    <BookmarkCheck size={18} class="text-emerald-400" />
    <span>Saved</span>
  {:else}
    <Bookmark size={18} class="text-zinc-400" />
    <span>Save Icon</span>
  {/if}
</button>`}
          </pre>
        </div>
      </section>

      {/* Semantic Comparison Table */}
      <section style={{ marginBottom: '56px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px', color: 'var(--text)' }}>
          Which open-source icon libraries support Svelte 5 and SvelteKit?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
          Svelte-compatible icon libraries compile directly into native `.svelte` component definitions with TypeScript support and Vite tree-shaking. The comparison table below highlights top Svelte 5 and SvelteKit packages:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <caption style={{ textAlign: 'left', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', captionSide: 'top' }}>
              Comparison of Svelte 5 & SvelteKit SVG Icon Libraries ({currentYear})
            </caption>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                <th style={{ padding: '12px 14px' }}>Library</th>
                <th style={{ padding: '12px 14px' }}>Total Icons</th>
                <th style={{ padding: '12px 14px' }}>License</th>
                <th style={{ padding: '12px 14px' }}>TypeScript</th>
                <th style={{ padding: '12px 14px' }}>SvelteKit SSR</th>
                <th style={{ padding: '12px 14px' }}>Primary NPM Package</th>
              </tr>
            </thead>
            <tbody>
              {svelteIcons.slice(0, 8).map((lib) => (
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
                  <td style={{ padding: '12px 14px', color: 'var(--green)' }}>
                    ✓ SvelteKit Ready
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

      {/* Libraries Directory */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', color: 'var(--text)' }}>
          Verified Svelte Icon Packages ({svelteIcons.length})
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          {svelteIcons.map((icon, index) => (
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
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ marginBottom: '56px', borderTop: '1px solid var(--border)', paddingTop: '48px' }}>
        <div style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px', marginBottom: '12px' }}>
          FREQUENTLY ASKED QUESTIONS
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', color: 'var(--text)' }}>
          Svelte & SvelteKit Icon FAQ
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {svelteFaqs.map((faq, i) => (
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

      {/* Navigation */}
      <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '48px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Explore Next.js & React Guides</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Discover React Server Components and Tailwind CSS icon setups.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/react-icons" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            React Guide →
          </Link>
          <Link href="/nextjs-icons" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--text)', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace' }}>
            Next.js Guide →
          </Link>
        </div>
      </section>

      {/* Non-Affiliation Disclaimer */}
      <footer style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.7 }}>
          Disclaimer: IconSearch is an independent open-source discovery platform and is not affiliated with, sponsored by, or endorsed by Svelte, SvelteKit, or any featured icon library maintainers.
        </p>
      </footer>
    </main>
  )
}
