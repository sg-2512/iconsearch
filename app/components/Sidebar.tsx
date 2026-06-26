'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { formatIconifyCollectionName, namedLibraries } from '../../data/library-catalog'

const navLinks = [
  { label: 'Home', href: '/', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { label: 'Search', href: '/icon-search', icon: '' },
  { label: 'Browse', href: '/free-svg-icons', icon: 'M4 6h16M4 12h16M4 18h16' },
  { label: 'Compare', href: '/compare', icon: 'M9 12l2 2 4-4m-6 8h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z' },
  { label: 'Blog', href: '/blog', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [iconifySets, setIconifySets] = useState<string[]>([])

  useEffect(() => {
    const timer = window.setTimeout(() => setMobileOpen(false), 0)
    return () => window.clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/icon-search?limit=1&legalOnly=0', { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(`Catalog returned ${response.status}`)))
      .then((data) => {
        const sets = Array.isArray(data?.facets?.iconifySets) ? data.facets.iconifySets : []
        setIconifySets(sets)
      })
      .catch((error) => {
        if ((error as Error).name !== 'AbortError') {
          console.error('Could not load Iconify collections', error)
        }
      })

    return () => controller.abort()
  }, [])

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="sidebar-mobile-toggle"
        aria-label="Toggle sidebar"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`app-sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #818cf8, #6366f1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace' }}>
            IS
          </div>
          <Link href="/" style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text)', textDecoration: 'none', letterSpacing: '-0.5px', fontFamily: 'Inter, sans-serif' }}>
            Iconsearch
          </Link>
        </div>

        {/* Nav Links */}
        <nav style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '20px' }}>
          {navLinks.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  color: isActive ? 'var(--text)' : 'var(--text-muted)',
                  background: isActive ? 'var(--accent-dim)' : 'transparent',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '14px',
                  transition: 'all 0.15s ease',
                }}
              >
                {link.label === 'Search' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={link.icon} />
                  </svg>
                )}
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/figma-plugin"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              color: pathname === '/figma-plugin' ? 'var(--text)' : 'var(--text-muted)',
              background: pathname === '/figma-plugin' ? 'var(--accent-dim)' : 'transparent',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontWeight: pathname === '/figma-plugin' ? 500 : 400,
              fontSize: '14px',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/>
              <path d="M12 2h3.5a3.5 3.5 0 0 1 0 7H12V2z"/>
              <path d="M12 9h3.5a3.5 3.5 0 1 1-3.5 3.5V9z"/>
              <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/>
              <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-3.5 3.5z"/>
            </svg>
            Figma plugin
          </Link>
          <Link
            href="/vscode-extension"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              color: pathname === '/vscode-extension' ? 'var(--text)' : 'var(--text-muted)',
              background: pathname === '/vscode-extension' ? 'var(--accent-dim)' : 'transparent',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontWeight: pathname === '/vscode-extension' ? 500 : 400,
              fontSize: '14px',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
            VS Code extension
          </Link>
        </nav>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border)', margin: '0 20px 16px' }} />

        {/* Libraries List */}
        <div style={{ padding: '0 12px', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '0 8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              Libraries
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {namedLibraries.map(lib => {
              const isActive = pathname === `/icons/${lib.slug}`
              return (
                <Link
                  key={lib.slug}
                  href={`/icons/${lib.slug}`}
                  style={{
                    fontSize: '13px',
                    color: isActive ? 'var(--text)' : 'var(--text-muted)',
                    background: isActive ? 'var(--accent-dim)' : 'transparent',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '7px 12px',
                    borderRadius: '6px',
                    transition: 'all 0.15s ease',
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: lib.color, flexShrink: 0 }} />
                  {lib.name}
                </Link>
              )
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', marginTop: '12px', padding: '14px 8px 4px' }}>
            <label htmlFor="sidebar-iconify-collection" style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.3px', marginBottom: '8px' }}>
              Iconify Collections
            </label>
            <select
              id="sidebar-iconify-collection"
              aria-label="Browse Iconify collections"
              defaultValue=""
              onChange={(event) => {
                const collection = event.target.value
                if (!collection) return
                router.push(`/icon-search?lib=iconify&iconifySet=${encodeURIComponent(collection)}`)
                setMobileOpen(false)
              }}
              style={{
                width: '100%',
                minWidth: 0,
                border: '1px solid var(--border)',
                borderRadius: '7px',
                padding: '8px 9px',
                color: 'var(--text)',
                background: 'var(--bg-card)',
                fontSize: '12px',
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                cursor: 'pointer',
              }}
            >
              <option value="">
                {iconifySets.length ? `${iconifySets.length} collections` : 'Loading collections...'}
              </option>
              {iconifySets.map((set) => (
                <option key={set} value={set}>
                  {formatIconifyCollectionName(set)}
                </option>
              ))}
            </select>
            <Link
              href="/icon-search?lib=iconify"
              style={{ display: 'block', marginTop: '8px', color: 'var(--accent)', textDecoration: 'none', fontSize: '12px', padding: '4px 2px' }}
            >
              Browse all Iconify icons
            </Link>
          </div>
        </div>

        {/* Bottom section */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            {[
              { label: 'Account', href: '/account' },
              { label: 'About', href: '/about' },
              { label: 'Privacy', href: '/privacy-policy' },
              { label: 'Contact', href: '/contact' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{ fontSize: '11px', color: 'var(--text-dim)', textDecoration: 'none' }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
