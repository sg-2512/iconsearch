'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import type { IconLibraryMeta } from '../../data/library-catalog'
import { getFormattedCurrentMonthYear, getDynamicYear } from '../../lib/date'

type Props = {
  libraries: IconLibraryMeta[]
  totalIconCount: number
}

export default function BrowsePageClient({ libraries, totalIconCount }: Props) {
  const currentYear = getDynamicYear()
  const lastUpdated = getFormattedCurrentMonthYear()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return libraries
    const q = query.toLowerCase().trim()
    return libraries.filter(
      (lib) => lib.name.toLowerCase().includes(q) || lib.slug.toLowerCase().includes(q) || lib.license.toLowerCase().includes(q)
    )
  }, [libraries, query])

  const topLibraries = useMemo(() => {
    return libraries.slice(0, 8)
  }, [libraries])

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      
      {/* Header */}
      <section style={{ marginBottom: '36px', paddingBottom: '36px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '2px' }}>
            OPEN SOURCE ICON ECOSYSTEM
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono, monospace)', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: '999px' }}>
            Last updated: {lastUpdated}
          </div>
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px', color: 'var(--text)' }}>
          Free SVG Icons <span style={{ color: 'var(--accent)' }}>for Web & UI Projects</span> ({currentYear})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '780px', marginBottom: '24px', lineHeight: 1.7 }}>
          Browse all {libraries.length} open-source icon libraries and explore over {totalIconCount.toLocaleString('en-US')} high-quality vector icons. Free for commercial and personal usage across React, Next.js, Vue, Svelte, and Tailwind CSS.
        </p>

        {/* License Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['MIT License', 'Apache 2.0', 'ISC License', 'CC0 / CC BY', 'TypeScript Native', 'React & Next.js', 'Vue & Svelte'].map((tag) => (
            <span
              key={tag}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                padding: '5px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Stats Overview */}
      <section style={{ marginBottom: '36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { label: 'Searchable Index', value: totalIconCount.toLocaleString('en-US') },
            { label: 'Icon Libraries', value: libraries.length.toString() },
            { label: 'Commercial Safe', value: '100% Free' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono, monospace)', color: 'var(--accent)', marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Semantic Comparison Table */}
      <section style={{ marginBottom: '48px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px', color: 'var(--text)' }}>
          Which free SVG icon libraries are best for commercial web applications?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
          The top free SVG icon libraries for commercial web applications are Lucide Icons, Heroicons, Tabler Icons, Phosphor Icons, and Radix Icons. All five libraries carry permissive open-source licenses (MIT or ISC) that permit royalty-free commercial usage, SaaS distribution, and proprietary software inclusion without fees or mandatory attribution. The semantic comparison table below provides a side-by-side specification overview:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <caption style={{ textAlign: 'left', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', captionSide: 'top' }}>
              Comparison of Leading Open-Source SVG Icon Libraries ({currentYear})
            </caption>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-mono, monospace)', fontSize: '12px' }}>
                <th style={{ padding: '12px 14px' }}>Library Name</th>
                <th style={{ padding: '12px 14px' }}>Total Icons</th>
                <th style={{ padding: '12px 14px' }}>License</th>
                <th style={{ padding: '12px 14px' }}>TypeScript</th>
                <th style={{ padding: '12px 14px' }}>Bundle Weight</th>
                <th style={{ padding: '12px 14px' }}>Primary NPM Package</th>
              </tr>
            </thead>
            <tbody>
              {topLibraries.map((lib) => (
                <tr key={lib.slug} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                    <Link href={`/icons/${lib.slug}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                      {lib.name}
                    </Link>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono, monospace)' }}>
                    {lib.iconCount.toLocaleString('en-US')}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--green, #34d399)', fontFamily: 'var(--font-mono, monospace)' }}>
                    {lib.license}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--cyan, #38bdf8)' }}>
                    Native .d.ts
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                    ~0.8KB / icon
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono, monospace)', fontSize: '12px' }}>
                    <code>{lib.slug.startsWith('iconify-') ? `@iconify-json/${lib.slug.replace('iconify-', '')}` : lib.slug}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Question-Based Query Headings */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px', color: 'var(--text)' }}>
              How do open-source SVG icon licenses compare for commercial projects?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              Most open-source icon collections use either MIT, Apache 2.0, ISC, or CC-BY 4.0 licenses. MIT and ISC licenses offer maximum freedom without attribution requirements, whereas CC-BY 4.0 requires attribution in documentation or application credits. For 100% legal-safe commercial workflows, IconSearch filters and verifies all 229 collections to ensure developers never encounter unexpected licensing restrictions.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px', color: 'var(--text)' }}>
              How do you customize and export SVG icons from IconSearch?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              IconSearch provides an in-browser vector studio to modify size (16px to 512px), stroke width (1px to 3px), color palette, and background frames in real-time. You can copy clean React JSX, Vue SFC, Svelte 5 snippets, or download high-resolution PNG, WebP, and SVG files with one click.
            </p>
          </div>
        </div>
      </section>

      {/* Search Input for All Libraries */}
      <section style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '12px 18px',
        }}>
          <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>🔍</span>
          <input
            type="text"
            placeholder={`Search all ${libraries.length} icon libraries (e.g. lucide, heroicons, tabler, phosphor)...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text)',
              fontSize: '15px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px' }}
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* All Libraries Grid */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            ALL ICON LIBRARIES ({filtered.length})
          </span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border)' }}>
            No library matching &quot;{query}&quot;
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '12px',
          }}>
            {filtered.map((lib) => (
              <Link
                key={lib.id}
                href={`/icons/${lib.slug}`}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  padding: '20px',
                  textDecoration: 'none',
                  color: 'var(--text)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(129,140,248,0.4)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '16px', margin: 0 }}>{lib.name}</h3>
                    <span style={{
                      fontSize: '11px',
                      color: 'var(--green, #34d399)',
                      background: 'rgba(52,211,153,0.1)',
                      border: '1px solid rgba(52,211,153,0.3)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono, monospace)',
                      flexShrink: 0
                    }}>
                      {lib.license}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5, margin: '0 0 16px' }}>
                    Vector SVG collection containing {lib.iconCount.toLocaleString('en-US')} high-quality icons.
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'var(--font-mono, monospace)', fontWeight: 600 }}>
                    {lib.iconCount.toLocaleString('en-US')} icons
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Explore →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Visible Non-Affiliation Disclaimer */}
      <footer style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', textAlign: 'center', marginBottom: '24px' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.7 }}>
          Disclaimer: IconSearch is an independent open-source discovery platform and is not affiliated with, sponsored by, or endorsed by any featured icon library maintainers or framework organizations. All trademarks and logos are the property of their respective owners.
        </p>
      </footer>
    </div>
  )
}
