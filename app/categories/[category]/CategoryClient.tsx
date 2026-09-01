'use client'

import React, { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { type CategoryDefinition } from '../../../lib/categories'
import UniversalExporterModal from '../../components/UniversalExporterModal'
import { type Icon } from '../../../lib/exporter'

interface CategoryClientProps {
  category: CategoryDefinition
}

export default function CategoryClient({ category }: CategoryClientProps) {
  const [icons, setIcons] = useState<Icon[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedStyle, setSelectedStyle] = useState<string>('all')
  const [selectedColorModel, setSelectedColorModel] = useState<string>('all')
  const [selectedLicense, setSelectedLicense] = useState<string>('all')
  const [activeIcon, setActiveIcon] = useState<Icon | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    let isCancelled = false
    setLoading(true)

    const params = new URLSearchParams()
    params.set('category', category.slug)
    params.set('limit', '72')
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    if (selectedStyle !== 'all') params.set('style', selectedStyle)
    if (selectedColorModel !== 'all') params.set('colorModel', selectedColorModel)
    if (selectedLicense !== 'all') params.set('license', selectedLicense)

    fetch(`/api/icon-search?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled) {
          setIcons(data.icons || [])
          setTotalCount(data.total || 0)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch category icons:', err)
        if (!isCancelled) setLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [category.slug, searchQuery, selectedStyle, selectedColorModel, selectedLicense])

  const handleIconClick = (icon: Icon) => {
    setActiveIcon(icon)
    setModalOpen(true)
  }

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Search & Filter Toolbar */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Filter in ${category.name} (e.g. ${category.keywords.slice(0, 3).join(', ')})...`}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--code-bg)',
                color: 'var(--text)',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Style Filters */}
            <div style={{ display: 'flex', background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '2px' }}>
              {(['all', 'stroke', 'solid', 'duotone'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStyle(st)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    background: selectedStyle === st ? 'var(--accent)' : 'transparent',
                    color: selectedStyle === st ? '#ffffff' : 'var(--text-muted)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* License Filter */}
            <select
              value={selectedLicense}
              onChange={(e) => setSelectedLicense(e.target.value)}
              style={{
                padding: '7px 12px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--code-bg)',
                color: 'var(--text)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Licenses</option>
              <option value="MIT">MIT Only</option>
              <option value="Apache-2.0">Apache-2.0</option>
              <option value="ISC">ISC</option>
              <option value="CC0">CC0 / Public</option>
              <option value="OFL">OFL</option>
            </select>
          </div>
        </div>

        {/* Keyword Tags */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
            Keywords:
          </span>
          {category.keywords.map((kw) => (
            <button
              key={kw}
              onClick={() => setSearchQuery(kw)}
              style={{
                fontSize: '11px',
                fontFamily: 'JetBrains Mono, monospace',
                padding: '3px 8px',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                background: searchQuery === kw ? 'var(--accent-dim)' : 'rgba(255,255,255,0.03)',
                color: searchQuery === kw ? 'var(--accent)' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              #{kw}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Icons */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
          {loading ? 'Searching catalog...' : `Showing ${icons.length} of ${totalCount.toLocaleString()} vector icons`}
        </span>
        <Link
          href={`/icon-search?category=${category.slug}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
          style={{
            fontSize: '12px',
            color: 'var(--accent)',
            fontFamily: 'JetBrains Mono, monospace',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Open in Full Search Studio →
        </Link>
      </div>

      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '12px',
          }}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                height: '110px',
                animation: 'pulse 1.5s infinite',
                opacity: 0.5,
              }}
            />
          ))}
        </div>
      ) : icons.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '16px', color: 'var(--text)', marginBottom: '8px' }}>
            No icons found matching your filters in {category.name}.
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Try resetting your search query or choosing another license/style filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedStyle('all')
              setSelectedLicense('all')
            }}
            style={{
              background: 'var(--accent)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '12px',
          }}
        >
          {icons.map((icon) => (
            <div
              key={icon.id}
              onClick={() => handleIconClick(icon)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '16px 12px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
              className="icon-card-hover"
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  color: 'var(--text)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/svg/${icon.library}/${icon.name}`}
                  alt={icon.name}
                  width={32}
                  height={32}
                  loading="lazy"
                  style={{ width: '32px', height: '32px' }}
                />
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text)',
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '100%',
                  marginBottom: '4px',
                }}
              >
                {icon.name}
              </span>

              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--text-dim)',
                  fontFamily: 'JetBrains Mono, monospace',
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '100%',
                }}
              >
                {icon.libraryName || icon.library}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Universal Exporter Modal */}
      {modalOpen && activeIcon && (
        <UniversalExporterModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setActiveIcon(null)
          }}
          icon={activeIcon}
        />
      )}
    </div>
  )
}
