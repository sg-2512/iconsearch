'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Icon = {
  id: string
  name: string
  displayName: string
  library: string
  libraryName: string
  npmPackage: string
  license: string
  tags: string[]
  reactImport: string
  reactUsage: string
  svgUrl: string
  legalSafe?: boolean
  licenseUrl?: string
}

type CartItem = {
  key: string
  icon: Icon
  size: number
  stroke: number
  color: string
}

const LIBRARY_COLORS: Record<string, string> = {
  'lucide-icons': '#7c6af7',
  'heroicons': '#06b6d4',
  'tabler-icons': '#10b981',
  'phosphor-icons': '#f59e0b',
  'radix-icons': '#ec4899',
  'bootstrap-icons': '#7952b3',
  'feather-icons': '#3b82f6',
  'remix-icon': '#ff4c4c',
  'iconoir': '#e88c30',
}

const CATEGORIES = [
  { id: 'all', name: 'All Icons', icon: '✨' },
  { id: 'ai', name: 'AI & Intelligence', icon: '🤖' },
  { id: 'alert', name: 'Alert & Warning', icon: '⚠️' },
  { id: 'arrows', name: 'Arrows & Directions', icon: '➡️' },
  { id: 'media', name: 'Media & Audio', icon: '🎵' },
  { id: 'editor', name: 'Editor & Layout', icon: '📝' },
  { id: 'communication', name: 'Communications', icon: '💬' },
  { id: 'commerce', name: 'E-Commerce & Finance', icon: '💳' },
  { id: 'weather', name: 'Weather & Nature', icon: '☁️' },
  { id: 'devices', name: 'Devices & Tech', icon: '💻' },
  { id: 'design', name: 'Design & Art', icon: '🎨' },
  { id: 'security', name: 'Security & Keys', icon: '🛡️' },
  { id: 'health', name: 'Health & Medical', icon: '❤️' },
  { id: 'users', name: 'Users & Account', icon: '👤' },
  { id: 'buildings', name: 'Buildings & Place', icon: '🏢' },
]

type ApiResponse = {
  icons: Icon[]
  total: number
  page: number
  limit: number
  totalPages: number
  facets?: {
    libraries: string[]
    licenses: string[]
    iconifySets?: string[]
    legalSafeCount: number
    legalOnlyApplied: boolean
  }
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function getCleanSvgUrl(url: string, library: string): string {
  if (!url) return ''
  if (library === 'tabler-icons' && url.includes('@tabler/icons/icons/')) return url.replace('@tabler/icons/icons/', '@tabler/icons@2.47.0/icons/')
  if (library === 'phosphor-icons' && url.includes('@phosphor-icons/core/assets/')) return url.replace('@phosphor-icons/core/assets/', '@phosphor-icons/core@2.1.1/assets/')
  if (library === 'lucide-icons' && url.includes('lucide-static/icons/')) return url.replace('lucide-static/icons/', 'lucide-static@0.415.0/icons/')
  return url
}

export default function IconSearchPage() {
  const [query, setQuery] = useState('')
  const [selectedLib, setSelectedLib] = useState('all')
  const [selectedIconifySet, setSelectedIconifySet] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStyle, setSelectedStyle] = useState('all')
  const [sortBy, setSortBy] = useState<'relevance' | 'popular'>('relevance')
  const [legalOnly, setLegalOnly] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<ApiResponse>({ icons: [], total: 0, page: 1, limit: 80, totalPages: 1 })
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null)
  const [svgContent, setSvgContent] = useState('')
  const [customSize, setCustomSize] = useState(32)
  const [customStroke, setCustomStroke] = useState(1.5)
  const [customColor, setCustomColor] = useState('#818cf8')
  const [cart, setCart] = useState<CartItem[]>([])
  const [copied, setCopied] = useState(false)
  const [exportNotice, setExportNotice] = useState('')
  const [previewFallbackIndex, setPreviewFallbackIndex] = useState<Record<string, number>>({})
  const [previewFailed, setPreviewFailed] = useState<Record<string, boolean>>({})
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement !== searchRef.current) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [query, selectedLib, selectedIconifySet, selectedCategory, selectedStyle, sortBy, legalOnly])

  useEffect(() => {
    setPreviewFallbackIndex({})
    setPreviewFailed({})
  }, [results.page, selectedLib, selectedIconifySet, selectedCategory, selectedStyle, query, sortBy, legalOnly])

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          q: query,
          lib: selectedLib,
          iconifySet: selectedIconifySet,
          category: selectedCategory,
          style: selectedStyle,
          legalOnly: legalOnly ? '1' : '0',
          page: String(currentPage),
          limit: '80',
        })
        const res = await fetch(`/api/icon-search?${params.toString()}`, { signal: controller.signal })
        const data = await res.json()
        const icons: Icon[] = Array.isArray(data?.icons) ? data.icons : []
        if (sortBy === 'popular') {
          icons.sort((a, b) => {
            const pa = (LIBRARY_COLORS[a.library] ? 1 : 0)
            const pb = (LIBRARY_COLORS[b.library] ? 1 : 0)
            return pb - pa || a.name.localeCompare(b.name)
          })
        }
        setResults({ ...data, icons })
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('API search failed', error)
        }
      } finally {
        setLoading(false)
      }
    }, 180)

    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [query, selectedLib, selectedIconifySet, selectedCategory, selectedStyle, currentPage, sortBy, legalOnly])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('icon-search-cart')
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) setCart(parsed)
    } catch {
      // ignore local storage errors
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('icon-search-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (!selectedIcon) return
    setCustomSize(32)
    setCustomStroke(1.5)
    setCustomColor('#818cf8')
    const controller = new AbortController()
    fetch(getCleanSvgUrl(selectedIcon.svgUrl, selectedIcon.library), { signal: controller.signal })
      .then((res) => res.text())
      .then((text) => setSvgContent(text))
      .catch(() => setSvgContent(''))
    return () => controller.abort()
  }, [selectedIcon])

  const libraryOptions = useMemo(() => {
    const libraries = results.facets?.libraries || []
    const nonIconify = libraries.filter((library) => !library.startsWith('iconify-'))
    return ['all', ...nonIconify, 'iconify']
  }, [results.facets?.libraries])

  const iconifySetOptions = useMemo(() => {
    return ['all', ...(results.facets?.iconifySets || [])]
  }, [results.facets?.iconifySets])

  const selectedLibraryValue = useMemo(() => {
    if (selectedLib !== 'iconify') return selectedLib
    return selectedIconifySet === 'all' ? 'iconify' : `iconify:${selectedIconifySet}`
  }, [selectedLib, selectedIconifySet])

  function getPreviewCandidates(icon: Icon): string[] {
    const cleaned = getCleanSvgUrl(icon.svgUrl, icon.library)
    const candidates = new Set<string>()
    const add = (value?: string) => {
      if (value) candidates.add(value)
    }

    add(cleaned)
    add(icon.svgUrl)

    const dashedName = icon.name.replace(/_/g, '-')
    const underscoredName = icon.name.replace(/-/g, '_')

    if (icon.library === 'lucide-icons') {
      add(`https://unpkg.com/lucide-static@latest/icons/${dashedName}.svg`)
      add(`https://api.iconify.design/lucide/${dashedName}.svg`)
      add(`https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/${dashedName}.svg`)
    } else if (icon.library === 'tabler-icons') {
      add(`https://cdn.jsdelivr.net/npm/@tabler/icons@2.47.0/icons/${dashedName}.svg`)
      add(`https://api.iconify.design/tabler/${dashedName}.svg`)
    } else if (icon.library === 'phosphor-icons') {
      add(`https://unpkg.com/@phosphor-icons/core@latest/assets/regular/${dashedName}.svg`)
      add(`https://api.iconify.design/ph/${dashedName}.svg`)
    } else if (icon.library === 'heroicons') {
      add(`https://api.iconify.design/heroicons/${dashedName}.svg`)
      add(`https://api.iconify.design/heroicons-outline/${dashedName}.svg`)
      add(`https://api.iconify.design/heroicons-solid/${dashedName}.svg`)
    } else if (icon.library === 'bootstrap-icons') {
      add(`https://cdn.jsdelivr.net/npm/bootstrap-icons@latest/icons/${dashedName}.svg`)
      add(`https://api.iconify.design/bi/${dashedName}.svg`)
    } else if (icon.library === 'feather-icons') {
      add(`https://unpkg.com/feather-icons@latest/dist/icons/${dashedName}.svg`)
      add(`https://api.iconify.design/feather/${dashedName}.svg`)
    } else if (icon.library === 'remix-icon') {
      add(`https://api.iconify.design/ri/${dashedName}.svg`)
    } else if (icon.library === 'iconoir') {
      add(`https://api.iconify.design/iconoir/${dashedName}.svg`)
      add(`https://cdn.jsdelivr.net/npm/iconoir@latest/icons/regular/${dashedName}.svg`)
    } else if (icon.library.startsWith('iconify-')) {
      const prefix = icon.library.replace(/^iconify-/, '')
      add(`https://api.iconify.design/${prefix}/${dashedName}.svg`)
      add(`https://api.iconify.design/${prefix}/${underscoredName}.svg`)
    } else {
      const normalizedPrefix = icon.library
        .toLowerCase()
        .replace(/-icons?$/, '')
        .replace(/_/g, '-')
      add(`https://api.iconify.design/${normalizedPrefix}/${dashedName}.svg`)
      add(`https://api.iconify.design/${normalizedPrefix}/${underscoredName}.svg`)
    }

    return Array.from(candidates)
  }

  function onPreviewError(icon: Icon) {
    const candidates = getPreviewCandidates(icon)
    const current = previewFallbackIndex[icon.id] || 0
    if (current < candidates.length - 1) {
      setPreviewFallbackIndex((prev) => ({ ...prev, [icon.id]: current + 1 }))
    } else {
      setPreviewFailed((prev) => ({ ...prev, [icon.id]: true }))
    }
  }

  const customizedSvg = useMemo(() => {
    if (!svgContent) return ''
    let parsed = svgContent
    parsed = parsed.replace(/width="[^"]*"/g, `width="${customSize}"`)
    parsed = parsed.replace(/height="[^"]*"/g, `height="${customSize}"`)
    parsed = parsed.replace(/stroke-width="[^"]*"/g, `stroke-width="${customStroke}"`)
    parsed = parsed.replace(/stroke="currentColor"/g, `stroke="${customColor}"`)
    parsed = parsed.replace(/fill="currentColor"/g, `fill="${customColor}"`)
    if (!parsed.includes('width=')) parsed = parsed.replace('<svg', `<svg width="${customSize}"`)
    if (!parsed.includes('height=')) parsed = parsed.replace('<svg', `<svg height="${customSize}"`)
    if (!parsed.includes('stroke-width=')) parsed = parsed.replace('<svg', `<svg stroke-width="${customStroke}"`)
    return parsed
  }, [svgContent, customSize, customStroke, customColor])

  function addToCart() {
    if (!selectedIcon) return
    const item: CartItem = {
      key: `${selectedIcon.id}-${Date.now()}`,
      icon: selectedIcon,
      size: customSize,
      stroke: customStroke,
      color: customColor,
    }
    setCart((prev) => [item, ...prev])
  }

  function removeFromCart(key: string) {
    setCart((prev) => prev.filter((item) => item.key !== key))
  }

  function buildCartJson() {
    return cart.map((item) => ({
      icon: `${item.icon.library}:${item.icon.name}`,
      license: item.icon.license,
      legalSafe: Boolean(item.icon.legalSafe),
      size: item.size,
      stroke: item.stroke,
      color: item.color,
      import: item.icon.reactImport,
      usage: item.icon.reactUsage,
    }))
  }

  function buildReactExport() {
    const legalSafeItems = cart.filter((item) => item.icon.legalSafe)
    const imports = Array.from(new Set(legalSafeItems.map((item) => item.icon.reactImport))).join('\n')
    const components = legalSafeItems
      .map((item, idx) => {
        const base = item.icon.reactUsage
        const withSize = base.replace(/size=\{?\d+\}?/, `size={${item.size}}`)
        const withStroke = withSize.includes('strokeWidth=')
          ? withSize.replace(/strokeWidth=\{?[\d.]+\}?/, `strokeWidth={${item.stroke}}`)
          : withSize.replace('/>', ` strokeWidth={${item.stroke}} />`)
        const withColor = withStroke.includes('color=')
          ? withStroke.replace(/color=["'][^"']*["']/, `color="${item.color}"`)
          : withStroke.replace('/>', ` color="${item.color}" />`)
        return `        <div key="${item.key}-${idx}" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>${withColor}<span>${item.icon.name}</span></div>`
      })
      .join('\n')

    return `${imports}

export default function IconCartExport() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
${components}
    </div>
  )
}
`
  }

  function buildVueExport() {
    const legalSafeItems = cart.filter((item) => item.icon.legalSafe)
    const lines = legalSafeItems.map(
      (item) =>
        `  <Icon icon="${item.icon.library}:${item.icon.name}" :width="${item.size}" :height="${item.size}" style="color: ${item.color}" />`
    )
    return `<template>
  <div class="icon-cart-export">
${lines.join('\n')}
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
</script>
`
  }

  function buildTailwindExport() {
    return cart
      .filter((item) => item.icon.legalSafe)
      .map(
        (item) =>
          `<img src="${item.icon.svgUrl}" alt="${item.icon.name}" class="inline-block" style="width:${item.size}px;height:${item.size}px;color:${item.color};" />`
      )
      .join('\n')
  }

  function buildCsvExport() {
    const rows = [
      ['icon', 'library', 'license', 'legal_safe', 'size', 'stroke', 'color', 'svg_url'],
      ...cart.map((item) => [
        item.icon.name,
        item.icon.library,
        item.icon.license,
        String(Boolean(item.icon.legalSafe)),
        String(item.size),
        String(item.stroke),
        item.color,
        item.icon.svgUrl,
      ]),
    ]
    return rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
  }

  function downloadText(filename: string, content: string, mimeType = 'text/plain;charset=utf-8') {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  async function copyCartExport() {
    if (cart.length === 0) return
    const payload = buildCartJson()
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  function exportCart(format: 'json' | 'react' | 'vue' | 'tailwind' | 'csv') {
    if (cart.length === 0) return
    if (format === 'json') {
      downloadText('icon-cart.json', JSON.stringify(buildCartJson(), null, 2), 'application/json;charset=utf-8')
      setExportNotice('Downloaded JSON export')
    } else if (format === 'react') {
      downloadText('icon-cart-export.tsx', buildReactExport(), 'text/typescript;charset=utf-8')
      setExportNotice('Downloaded React export')
    } else if (format === 'vue') {
      downloadText('icon-cart-export.vue', buildVueExport(), 'text/plain;charset=utf-8')
      setExportNotice('Downloaded Vue export')
    } else if (format === 'tailwind') {
      downloadText('icon-cart-tailwind.html', buildTailwindExport(), 'text/html;charset=utf-8')
      setExportNotice('Downloaded Tailwind/HTML export')
    } else if (format === 'csv') {
      downloadText('icon-cart.csv', buildCsvExport(), 'text/csv;charset=utf-8')
      setExportNotice('Downloaded CSV export')
    }
    setTimeout(() => setExportNotice(''), 2200)
  }

  return (
    <main style={{ maxWidth: '1500px', margin: '0 auto', padding: '40px 48px', position: 'relative', minHeight: '100vh' }}>
      <div className="glow-grid-overlay" />
      <div className="glow-gradient-node" />

      <section style={{ position: 'relative', zIndex: 1, marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px', marginBottom: '12px' }}>
          // HUGE ICON REGISTRY
        </div>
        <h1 style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '12px' }}>
          Search 349,000+ Icons
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '760px', lineHeight: 1.7 }}>
          Hugeicons-style explorer with lightning-fast API search, clean cards, rich filters, and polished dark UI.
        </p>
        <p style={{ color: 'var(--green)', fontSize: '12px', marginTop: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
          {loading
            ? 'Checking license safety...'
            : `Legal-safe icons in current scope: ${formatNumber(results.facets?.legalSafeCount || 0)}`}
        </p>
      </section>

      <section style={{ position: 'relative', zIndex: 2, marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(24,24,27,0.78)', border: '1px solid var(--border)', borderRadius: '14px', padding: '10px 14px' }}>
          <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>🔎</span>
          <input
            ref={searchRef}
            type="text"
            placeholder="Try: home, settings, arrow-right, cloud..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text)', fontSize: '15px', outline: 'none' }}
          />
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', border: '1px solid var(--border)', borderRadius: '6px', padding: '3px 8px', fontFamily: 'JetBrains Mono, monospace' }}>/ focus</span>
        </div>
      </section>

      <section style={{ position: 'relative', zIndex: 2, marginBottom: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '10px' }}>
        <select
          aria-label="Filter by library"
          title="Filter by library"
          value={selectedLibraryValue}
          onChange={(e) => {
            const value = e.target.value
            if (value === 'all') {
              setSelectedLib('all')
              setSelectedIconifySet('all')
            } else if (value === 'iconify') {
              setSelectedLib('iconify')
              setSelectedIconifySet('all')
            } else if (value.startsWith('iconify:')) {
              setSelectedLib('iconify')
              setSelectedIconifySet(value.replace('iconify:', ''))
            } else {
              setSelectedLib(value)
              setSelectedIconifySet('all')
            }
          }}
          className="icon-search-select"
        >
          <option value="all">All libraries</option>
          {libraryOptions.filter((lib) => lib !== 'all' && lib !== 'iconify').map((lib) => (
            <option key={lib} value={lib}>
              {lib}
            </option>
          ))}
          <option value="iconify">Iconify (all sets)</option>
          {iconifySetOptions.filter((set) => set !== 'all').map((set) => (
            <option key={`iconify:${set}`} value={`iconify:${set}`}>
              {`Iconify / ${set}`}
            </option>
          ))}
        </select>
        <select aria-label="Filter by category" title="Filter by category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="icon-search-select">
          {CATEGORIES.map((cat) => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
        </select>
        <select aria-label="Filter by icon style" title="Filter by icon style" value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)} className="icon-search-select">
          <option value="all">All styles</option>
          <option value="stroke">Outline/Stroke</option>
          <option value="solid">Solid/Filled</option>
          <option value="duotone">Duotone</option>
          <option value="twotone">Two-Tone</option>
          <option value="sharp">Sharp</option>
        </select>
        <select aria-label="Sort search results" title="Sort search results" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'relevance' | 'popular')} className="icon-search-select">
          <option value="relevance">Sort: Relevance</option>
          <option value="popular">Sort: Popular</option>
        </select>
        <label className="icon-search-legal-toggle" title="Show only legally safer icon licenses">
          <input type="checkbox" checked={legalOnly} onChange={(e) => setLegalOnly(e.target.checked)} />
          Legal-safe only
        </label>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-card)' }}>
          {loading ? 'Searching...' : `${formatNumber(results.total)} results`}
        </div>
      </section>

      <section style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))', gap: '12px' }}>
          {results.icons.map((icon) => {
            const color = LIBRARY_COLORS[icon.library] || 'var(--accent)'
            const candidates = getPreviewCandidates(icon)
            const src = candidates[previewFallbackIndex[icon.id] || 0] || getCleanSvgUrl(icon.svgUrl, icon.library)
            const failed = Boolean(previewFailed[icon.id])
            return (
              <button
                key={icon.id}
                onClick={() => setSelectedIcon(icon)}
                style={{
                  background: 'rgba(24,24,27,0.8)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  alignItems: 'center',
                  transition: 'all 0.16s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = color
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 8px 24px ${color}1f`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ width: '54px', height: '54px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {failed ? (
                    <span style={{ fontSize: '11px', color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                      {icon.displayName?.slice(0, 2)?.toUpperCase() || icon.name.slice(0, 2).toUpperCase()}
                    </span>
                  ) : (
                    <img
                      src={src}
                      alt={icon.name}
                      width={25}
                      height={25}
                      style={{ filter: 'invert(1) brightness(0.95)', opacity: 0.9 }}
                      onError={() => onPreviewError(icon)}
                    />
                  )}
                </div>
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div style={{ color: 'var(--text)', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{icon.name}</div>
                  <div style={{ color, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {icon.libraryName}
                  </div>
                  <div style={{
                    marginTop: '6px',
                    fontSize: '8px',
                    fontFamily: 'JetBrains Mono, monospace',
                    borderRadius: '999px',
                    padding: '2px 6px',
                    display: 'inline-block',
                    background: icon.legalSafe ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)',
                    border: `1px solid ${icon.legalSafe ? 'rgba(52,211,153,0.55)' : 'rgba(248,113,113,0.55)'}`,
                    color: icon.legalSafe ? '#34d399' : '#f87171',
                  }}>
                    {icon.legalSafe ? 'legal-safe' : 'restricted'}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {results.totalPages > 1 && (
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <button disabled={results.page <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="icon-search-btn">
              Previous
            </button>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
              Page {results.page} / {results.totalPages}
            </span>
            <button disabled={results.page >= results.totalPages} onClick={() => setCurrentPage((p) => Math.min(results.totalPages, p + 1))} className="icon-search-btn">
              Next
            </button>
          </div>
        )}
      </section>

      {selectedIcon && (
        <>
          <div onClick={() => setSelectedIcon(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99 }} />
          <aside style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '420px', background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
            <button onClick={() => setSelectedIcon(null)} className="icon-search-btn icon-search-btn-small icon-search-close-btn">✕</button>
            <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>{selectedIcon.displayName || selectedIcon.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>{selectedIcon.libraryName}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>
              License: <span style={{ fontWeight: '600', color: 'var(--text)' }}>{selectedIcon.license}</span>{' '}
              {selectedIcon.licenseUrl && (
                <a
                  href={selectedIcon.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent)', textDecoration: 'underline', fontSize: '11px', marginLeft: '4px' }}
                >
                  (View source text)
                </a>
              )}
            </p>
            {!selectedIcon.legalSafe && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px dashed #ef4444',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                fontSize: '12px',
                color: '#fca5a5',
                lineHeight: '1.4'
              }}>
                <strong style={{ color: '#f87171', display: 'block', marginBottom: '4px' }}>⚠️ Restricted Set:</strong>
                This icon falls under a restricted license. Commercial SaaS exports may require manual attribution, trademark agreements, or license fee validation.
              </div>
            )}
            {selectedIcon.legalSafe && (
              <div style={{
                background: 'rgba(52, 211, 153, 0.06)',
                border: '1px dashed #34d399',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                fontSize: '12px',
                color: '#a7f3d0',
                lineHeight: '1.4'
              }}>
                <strong style={{ color: '#34d399', display: 'block', marginBottom: '4px' }}>✅ SaaS & Commercial Safe:</strong>
                100% pre-vetted for production deployment, business sites, SaaS web apps, and premium exports under {selectedIcon.license}.
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Size</label>
                  <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>{customSize}px</span>
                </div>
                <input
                  className="icon-search-slider"
                  type="range"
                  aria-label="Customizer icon size"
                  title="Customizer icon size"
                  min={16}
                  max={96}
                  value={customSize}
                  onChange={(e) => setCustomSize(Number(e.target.value))}
                />
              </div>
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Stroke</label>
                  <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>{customStroke.toFixed(1)}px</span>
                </div>
                <input
                  className="icon-search-slider"
                  type="range"
                  aria-label="Customizer stroke width"
                  title="Customizer stroke width"
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={customStroke}
                  onChange={(e) => setCustomStroke(Number(e.target.value))}
                />
              </div>
            </div>
            <div style={{ marginBottom: '12px', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', marginRight: '8px' }}>Color</label>
              <input
                type="color"
                aria-label="Customizer color picker"
                title="Customizer color picker"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
              />
              <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{customColor}</span>
            </div>
            <div style={{ marginBottom: '12px', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', minHeight: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
              {customizedSvg ? (
                <div dangerouslySetInnerHTML={{ __html: customizedSvg }} />
              ) : (
                <img src={getCleanSvgUrl(selectedIcon.svgUrl, selectedIcon.library)} alt={selectedIcon.name} width={customSize} height={customSize} style={{ filter: `drop-shadow(0 0 8px ${customColor}33) invert(1)` }} />
              )}
            </div>
            <pre style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', color: 'var(--green)', fontSize: '11px', overflowX: 'auto' }}>
{selectedIcon.reactImport}

{selectedIcon.reactUsage}
            </pre>
            <button onClick={addToCart} className="icon-search-btn" style={{ marginTop: '12px', width: '100%', background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }}>
              Add to Cart
            </button>
          </aside>
        </>
      )}

      <aside style={{
        position: 'fixed',
        left: '20px',
        bottom: '20px',
        width: '340px',
        maxHeight: '55vh',
        overflowY: 'auto',
        background: 'rgba(18,18,21,0.95)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        padding: '14px',
        zIndex: 90,
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ fontSize: '14px' }}>Cart ({cart.length})</h4>
          <button onClick={copyCartExport} className="icon-search-btn icon-search-btn-small">{copied ? 'Copied' : 'Copy JSON'}</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px', marginBottom: '10px' }}>
          <button onClick={() => exportCart('json')} className="icon-search-btn icon-search-btn-small">JSON</button>
          <button onClick={() => exportCart('react')} className="icon-search-btn icon-search-btn-small">React</button>
          <button onClick={() => exportCart('vue')} className="icon-search-btn icon-search-btn-small">Vue</button>
          <button onClick={() => exportCart('tailwind')} className="icon-search-btn icon-search-btn-small">Tailwind</button>
          <button onClick={() => exportCart('csv')} className="icon-search-btn icon-search-btn-small">CSV</button>
        </div>
        {exportNotice ? (
          <p style={{ color: 'var(--green)', fontSize: '11px', marginBottom: '10px', fontFamily: 'JetBrains Mono, monospace' }}>{exportNotice}</p>
        ) : null}
        {cart.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No icons yet. Open any icon and add it to cart.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cart.map((item) => (
              <div key={item.key} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text)' }}>{item.icon.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.icon.libraryName}</div>
                  <div style={{ fontSize: '9px', color: item.icon.legalSafe ? '#34d399' : '#f87171' }}>
                    {item.icon.legalSafe ? 'legal-safe' : 'restricted'}
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.key)} className="icon-search-btn icon-search-btn-small">Remove</button>
              </div>
            ))}
          </div>
        )}
      </aside>
    </main>
  )
}