'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomeSearch() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/icon-search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div style={{ marginTop: '32px', marginBottom: '0' }}>
      <form onSubmit={handleSearch}>
        <div style={{ position: 'relative', maxWidth: '680px' }}>
          <input
            type="text"
            placeholder="Search 15,000+ icons — try 'camera', 'home', 'arrow'..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '16px 120px 16px 20px',
              fontSize: '15px',
              color: 'var(--text)',
              fontFamily: 'JetBrains Mono, monospace',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button
            type="submit"
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'var(--accent-accessible)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '13px',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Search →
          </button>
        </div>
      </form>

      {/* Quick search chips */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap', maxWidth: '680px' }}>
        {['camera', 'home', 'settings', 'arrow', 'user', 'bell', 'heart', 'search'].map(term => (
          <button
            key={term}
            onClick={() => router.push(`/icon-search?q=${term}`)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '100px',
              padding: '4px 12px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  )
}