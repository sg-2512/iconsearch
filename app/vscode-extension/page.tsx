'use client'

import Link from 'next/link'

export default function VSCodeExtensionPage() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 48px' }}>

      <section style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px', marginBottom: '12px' }}>
          // VS CODE INTEGRATION
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.02em' }}>
          IconSearch <span style={{ color: 'var(--accent)' }}>VS Code Extension</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.7, maxWidth: '600px', marginBottom: '24px' }}>
          Search and insert 350,000+ open-source SVG icons directly inside your code editor. Write cleaner code and speed up your workflow with inline previews.
        </p>

        {/* Launching Soon Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.12))',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            borderRadius: '999px',
            padding: '10px 22px',
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: 'JetBrains Mono, monospace',
            color: 'var(--accent)',
            letterSpacing: '0.5px',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s ease-in-out infinite' }} />
            Launching Soon
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            href="/icon-search"
            style={{
              background: 'var(--accent)',
              color: '#000',
              fontWeight: 700,
              fontSize: '14px',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            Try Web Search
          </Link>
        </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

        {/* What to Expect */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace' }}>
            What to Expect
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {[
              {
                title: 'Instant Command Palette Search',
                desc: 'Access the entire 350,000+ icon database from any file using simple VS Code command palette keystrokes.',
              },
              {
                title: 'React / Next.js Component Imports',
                desc: 'Select an icon and automatically write import statements and JSX elements (Lucide, Heroicons, React Icons, etc.) directly into your active code file.',
              },
              {
                title: 'Inline SVG Code Injection',
                desc: 'Need raw SVG vectors? Inject optimized SVG code inline with one click, fully configured with current color variables.',
              },
              {
                title: 'Sidebar Panel Browser',
                desc: 'A dedicated activity bar icon provides a visual dashboard to browse sets, search keywords, and preview icon shapes side-by-side with your code.',
              },
              {
                title: 'Auto-Complete Snippets',
                desc: 'Type helper snippets to instantly view suggestions, complete with autocomplete lists matching all major icon libraries.',
              }
            ].map(item => (
              <div key={item.title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '18px 22px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', marginTop: '2px', flexShrink: 0 }}>✓</span>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)', marginBottom: '4px' }}>{item.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seamless Sync */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace' }}>
            Seamless Code Alignment
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8 }}>
            Our VS Code extension will map to the exact same database structure and library identifiers as our Figma plugin, guaranteeing seamless designer-to-developer handoff. Developers will be able to copy the matching library keys from the designs and immediately import them inside the IDE.
          </p>
        </div>

        {/* Stay Updated */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.06), rgba(59, 130, 246, 0.04))',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '12px',
          padding: '24px 28px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace' }}>
            Stay in the Loop
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7 }}>
            We&apos;re actively building the VS Code extension. In the meantime, you can use the full-featured{' '}
            <Link href="/icon-search" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>web search</Link>{' '}
            to find, customize, and export icons for your projects.
          </p>
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </main>
  )
}
