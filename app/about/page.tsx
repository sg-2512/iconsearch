import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About IconSearch — Free Icon Library Comparison Tool',
  description: 'IconSearch is an independent resource helping developers find and compare the best free open source icon libraries for React, Next.js, Vue and Svelte.',
}

export default function AboutPage() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 48px' }}>
      <section style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px', marginBottom: '12px' }}>
          // ABOUT
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
          About <span style={{ color: 'var(--accent)' }}>IconSearch</span>
        </h1>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--text)' }}>What is IconSearch?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8 }}>
            IconSearch is an independent comparison and search tool for open source SVG icon libraries. We help React, Next.js, Vue, and Svelte developers find the right icon library for their projects — with real data, side-by-side comparisons, and honest recommendations.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--text)' }}>Why We Built This</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8 }}>
            Choosing an icon library should be a 5-minute decision. In practice it takes hours — reading GitHub READMEs, checking npm stats, opening multiple tabs to compare styles. We built IconSearch to make that decision fast and data-driven. One site, all the information you need.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--text)' }}>What We Cover</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8 }}>
            We cover 8 major open source icon libraries — Lucide Icons, Heroicons, Tabler Icons, Phosphor Icons, Remix Icon, Feather Icons, Bootstrap Icons, and Radix Icons. Every library gets a full guide covering installation, usage, TypeScript support, framework compatibility, and honest pros and cons.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--text)' }}>Independence</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8 }}>
            IconSearch is not affiliated with any icon library project. We do not accept payment for rankings or recommendations. All comparisons are based on publicly available data from GitHub, npm, and official documentation.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--text)' }}>Contact</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8 }}>
            Have a suggestion, found an error, or want to report outdated information? Reach out through our <a href="/contact" style={{ color: 'var(--accent)', textDecoration: 'none' }}>contact page</a>.
          </p>
        </div>

      </div>
    </main>
  )
}