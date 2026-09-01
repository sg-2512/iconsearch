'use client'

import React, { useMemo } from 'react'
import LibraryFilter from './LibraryFilter'

export interface FacetCounts {
  styles?: Record<string, number>
  colorModels?: Record<string, number>
  licenses?: Record<string, number> | string[]
  licenseCounts?: Record<string, number>
  legalSafeCount?: number
}

export interface MultiFacetFilterBarProps {
  // Library selection (across all 229 icon sets)
  selectedLib: string
  onLibraryChange: (lib: string) => void

  // Category selection
  selectedCategory: string
  onCategoryChange: (category: string) => void
  categories: { id: string; name: string; icon?: string }[]

  // Style facet
  selectedStyle: string
  onStyleChange: (style: string) => void

  // Color Model facet
  selectedColorModel: string
  onColorModelChange: (colorModel: string) => void

  // License facet
  selectedLicense: string
  onLicenseChange: (license: string) => void

  // Commercial Safe toggle
  legalOnly: boolean
  onLegalOnlyChange: (legalOnly: boolean) => void

  // Sort
  sortBy: 'relevance' | 'popular' | 'alphabetical'
  onSortChange: (sort: 'relevance' | 'popular' | 'alphabetical') => void

  // Results count and loading state
  totalResults: number
  loading?: boolean

  // Dynamic Facet counts from API
  facetCounts?: FacetCounts

  // Reset all filters
  onResetFilters: () => void
}

function formatCount(num?: number): string | null {
  if (num === undefined || num === null || num <= 0) return null
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(num >= 10_000 ? 0 : 1)}k`
  return num.toString()
}

export default function MultiFacetFilterBar({
  selectedLib,
  onLibraryChange,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedStyle,
  onStyleChange,
  selectedColorModel,
  onColorModelChange,
  selectedLicense,
  onLicenseChange,
  legalOnly,
  onLegalOnlyChange,
  sortBy,
  onSortChange,
  totalResults,
  loading = false,
  facetCounts,
  onResetFilters,
}: MultiFacetFilterBarProps) {
  // Style definitions with SVG previews
  const STYLE_OPTIONS = useMemo(
    () => [
      {
        id: 'all',
        label: 'All Styles',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
          </svg>
        ),
      },
      {
        id: 'stroke',
        label: 'Stroke / Outline',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
          </svg>
        ),
        countKey: 'stroke',
      },
      {
        id: 'solid',
        label: 'Solid / Filled',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="9" />
          </svg>
        ),
        countKey: 'solid',
      },
      {
        id: 'duotone',
        label: 'Duotone',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3a9 9 0 0 0 0 18v-18z" fill="currentColor" opacity="0.35" />
            <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        countKey: 'duotone',
      },
      {
        id: 'twotone',
        label: 'Two-Tone',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9V3z" fill="currentColor" opacity="0.45" />
            <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        countKey: 'twotone',
      },
      {
        id: 'sharp',
        label: 'Sharp',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <polygon points="12 2 22 22 2 22" />
          </svg>
        ),
        countKey: 'sharp',
      },
    ],
    []
  )

  // Color model options
  const COLOR_MODEL_OPTIONS = useMemo(
    () => [
      {
        id: 'all',
        label: 'All Colors',
        icon: (
          <span style={{ fontSize: '13px' }}>🎨</span>
        ),
      },
      {
        id: 'mono',
        label: 'Monochromatic',
        sublabel: 'Single-color / Themeable',
        icon: (
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'currentColor',
              display: 'inline-block',
            }}
          />
        ),
        countKey: 'mono',
      },
      {
        id: 'multicolor',
        label: 'Multi-color',
        sublabel: 'Colored / Logos / Emojis',
        icon: (
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f43f5e 0%, #3b82f6 50%, #10b981 100%)',
              display: 'inline-block',
            }}
          />
        ),
        countKey: 'multicolor',
      },
    ],
    []
  )

  // License options
  const LICENSE_OPTIONS = useMemo(
    () => [
      { id: 'all', label: 'All Licenses' },
      { id: 'MIT', label: 'MIT', countKey: 'MIT' },
      { id: 'Apache-2.0', label: 'Apache 2.0', countKey: 'Apache-2.0' },
      { id: 'CC0', label: 'CC0 / Public Domain', countKey: 'CC0' },
      { id: 'OFL', label: 'OFL (SIL Font)', countKey: 'OFL' },
      { id: 'ISC', label: 'ISC', countKey: 'ISC' },
    ],
    []
  )

  // Calculate active filter count for quick badge display
  const activeFilters = useMemo(() => {
    const filters: { id: string; label: string; onRemove: () => void }[] = []

    if (selectedLib !== 'all') {
      filters.push({
        id: 'lib',
        label: `Collection: ${selectedLib.replace(/^iconify-/, '')}`,
        onRemove: () => onLibraryChange('all'),
      })
    }

    if (selectedCategory !== 'all') {
      const catObj = categories.find((c) => c.id === selectedCategory)
      filters.push({
        id: 'category',
        label: `Category: ${catObj ? catObj.name : selectedCategory}`,
        onRemove: () => onCategoryChange('all'),
      })
    }

    if (selectedStyle !== 'all') {
      const styleObj = STYLE_OPTIONS.find((s) => s.id === selectedStyle)
      filters.push({
        id: 'style',
        label: `Style: ${styleObj ? styleObj.label : selectedStyle}`,
        onRemove: () => onStyleChange('all'),
      })
    }

    if (selectedColorModel !== 'all') {
      const colorObj = COLOR_MODEL_OPTIONS.find((c) => c.id === selectedColorModel)
      filters.push({
        id: 'colorModel',
        label: `Color: ${colorObj ? colorObj.label : selectedColorModel}`,
        onRemove: () => onColorModelChange('all'),
      })
    }

    if (selectedLicense !== 'all') {
      const licObj = LICENSE_OPTIONS.find((l) => l.id === selectedLicense)
      filters.push({
        id: 'license',
        label: `License: ${licObj ? licObj.label : selectedLicense}`,
        onRemove: () => onLicenseChange('all'),
      })
    }

    if (!legalOnly) {
      filters.push({
        id: 'legalOnly',
        label: 'Show All Licenses (Unrestricted)',
        onRemove: () => onLegalOnlyChange(true),
      })
    }

    return filters
  }, [
    selectedLib,
    selectedCategory,
    selectedStyle,
    selectedColorModel,
    selectedLicense,
    legalOnly,
    categories,
    STYLE_OPTIONS,
    COLOR_MODEL_OPTIONS,
    LICENSE_OPTIONS,
    onLibraryChange,
    onCategoryChange,
    onStyleChange,
    onColorModelChange,
    onLicenseChange,
    onLegalOnlyChange,
  ])

  return (
    <div
      className="icon-search-multi-facet-bar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* ── TOP BAR: Collection Scope Counter & Commercial Safe Toggle ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          paddingBottom: '12px',
        }}
      >
        {/* Quick Directory Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <span style={{ fontSize: '15px' }}>⚡</span>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>
            Universal Open Source Directory
          </span>
          <span
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '999px',
              background: 'rgba(129, 140, 248, 0.15)',
              color: 'var(--accent)',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 600,
            }}
          >
            229 Icon Collections
          </span>
        </div>

        {/* Commercial Safe Toggle & Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            aria-pressed={legalOnly}
            onClick={() => onLegalOnlyChange(!legalOnly)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              border: legalOnly ? '1px solid rgba(52, 211, 153, 0.5)' : '1px solid var(--border)',
              background: legalOnly ? 'rgba(52, 211, 153, 0.12)' : 'var(--bg-card)',
              color: legalOnly ? '#34d399' : 'var(--text-dim)',
            }}
            title={legalOnly ? 'Showing commercial-safe vetted licenses only' : 'Showing all licenses including non-commercial'}
          >
            <span style={{ fontSize: '13px' }}>{legalOnly ? '🛡️' : '🔓'}</span>
            <span>{legalOnly ? 'Commercial Safe: ON' : 'Commercial Safe: OFF'}</span>
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontFamily: 'JetBrains Mono, monospace',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '6px 12px',
            }}
          >
            {loading ? (
              <>
                <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{totalResults.toLocaleString()}</span>
                <span>icons</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── ROW 1: PRIMARY DROPDOWNS (Library, Category, Sort) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        {/* Searchable Library Dropdown */}
        <div style={{ minWidth: 0 }}>
          <LibraryFilter value={selectedLib} onChange={(newLib) => onLibraryChange(newLib)} />
        </div>

        {/* Category Selector */}
        <div style={{ position: 'relative' }}>
          <select
            suppressHydrationWarning
            aria-label="Filter icons by category"
            title="Filter icons by category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="icon-search-select"
            style={{ width: '100%', height: '38px', padding: '0 12px' }}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon || '📁'} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div style={{ position: 'relative' }}>
          <select
            suppressHydrationWarning
            aria-label="Sort search results"
            title="Sort search results"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'relevance' | 'popular' | 'alphabetical')}
            className="icon-search-select"
            style={{ width: '100%', height: '38px', padding: '0 12px' }}
          >
            <option value="relevance">⚡ Sort: Relevance</option>
            <option value="popular">🔥 Sort: Popularity</option>
            <option value="alphabetical">🔤 Sort: A → Z</option>
          </select>
        </div>
      </div>

      {/* ── ROW 2: STYLE FACET CHIPS ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)' }}>
            Icon Style
          </span>
        </div>
        <div
          role="group"
          aria-label="Filter by icon visual style"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '2px',
          }}
        >
          {STYLE_OPTIONS.map((style) => {
            const isSelected = selectedStyle === style.id
            const count = style.countKey && facetCounts?.styles ? facetCounts.styles[style.countKey] : undefined
            const countBadge = formatCount(count)

            return (
              <button
                key={style.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onStyleChange(style.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: isSelected ? 600 : 400,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                  border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: isSelected ? 'rgba(129, 140, 248, 0.15)' : 'var(--bg-card)',
                  color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>{style.icon}</span>
                <span>{style.label}</span>
                {countBadge && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'JetBrains Mono, monospace',
                      padding: '1px 5px',
                      borderRadius: '999px',
                      background: isSelected ? 'var(--accent)' : 'rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#ffffff' : 'var(--text-dim)',
                    }}
                  >
                    {countBadge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── ROW 3: COLOR MODEL & LICENSE CHIPS ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '10px',
        }}
      >
        {/* Color Model Facets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)' }}>
            Color Model
          </span>
          <div
            role="group"
            aria-label="Filter by color model"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '2px',
            }}
          >
            {COLOR_MODEL_OPTIONS.map((cm) => {
              const isSelected = selectedColorModel === cm.id
              const count = cm.countKey && facetCounts?.colorModels ? facetCounts.colorModels[cm.countKey] : undefined
              const countBadge = formatCount(count)

              return (
                <button
                  key={cm.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onColorModelChange(cm.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: isSelected ? 600 : 400,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                    border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: isSelected ? 'rgba(129, 140, 248, 0.15)' : 'var(--bg-card)',
                    color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>{cm.icon}</span>
                  <span>{cm.label}</span>
                  {countBadge && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'JetBrains Mono, monospace',
                        padding: '1px 5px',
                        borderRadius: '999px',
                        background: isSelected ? 'var(--accent)' : 'rgba(255, 255, 255, 0.08)',
                        color: isSelected ? '#ffffff' : 'var(--text-dim)',
                      }}
                    >
                      {countBadge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* License Facets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)' }}>
            License Type
          </span>
          <div
            role="group"
            aria-label="Filter by open source license"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '2px',
            }}
          >
            {LICENSE_OPTIONS.map((lic) => {
              const isSelected = selectedLicense === lic.id
              const count = lic.countKey && facetCounts?.licenseCounts ? facetCounts.licenseCounts[lic.countKey] : undefined
              const countBadge = formatCount(count)

              return (
                <button
                  key={lic.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onLicenseChange(lic.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 9px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: isSelected ? 600 : 400,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                    border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: isSelected ? 'rgba(129, 140, 248, 0.15)' : 'var(--bg-card)',
                    color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                  }}
                >
                  <span>{lic.label}</span>
                  {countBadge && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'JetBrains Mono, monospace',
                        padding: '1px 5px',
                        borderRadius: '999px',
                        background: isSelected ? 'var(--accent)' : 'rgba(255, 255, 255, 0.08)',
                        color: isSelected ? '#ffffff' : 'var(--text-dim)',
                      }}
                    >
                      {countBadge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── ROW 4: ACTIVE FILTER REMOVAL PILLS & RESET ── */}
      {activeFilters.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            paddingTop: '8px',
            borderTop: '1px dashed rgba(255, 255, 255, 0.08)',
          }}
        >
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>Active Filters:</span>
          {activeFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={filter.onRemove}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                background: 'rgba(129, 140, 248, 0.12)',
                border: '1px solid rgba(129, 140, 248, 0.3)',
                color: 'var(--text)',
                cursor: 'pointer',
                transition: 'all 0.12s',
              }}
              title="Click to remove this filter"
            >
              <span>{filter.label}</span>
              <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 700 }}>✕</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onResetFilters}
            style={{
              fontSize: '11px',
              color: 'var(--accent)',
              background: 'transparent',
              border: 'none',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: '2px 6px',
            }}
          >
            Reset all
          </button>
        </div>
      )}
    </div>
  )
}
