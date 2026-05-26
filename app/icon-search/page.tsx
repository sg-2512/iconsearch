'use client'

import { useState, useMemo, useEffect, useRef } from 'react'

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
  words?: string[]
  tagsSet?: Set<string>
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const LIBRARIES = [
  { slug: 'all', name: 'All Libraries' },
  { slug: 'lucide-icons', name: 'Lucide' },
  { slug: 'heroicons', name: 'Heroicons' },
  { slug: 'tabler-icons', name: 'Tabler' },
  { slug: 'phosphor-icons', name: 'Phosphor' },
  { slug: 'radix-icons', name: 'Radix' },
  { slug: 'bootstrap-icons', name: 'Bootstrap' },
  { slug: 'feather-icons', name: 'Feather' },
  { slug: 'remix-icon', name: 'Remix' },
  { slug: 'iconoir', name: 'Iconoir' },
]

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

// Category Configuration with Tag Mappings
const CATEGORIES = [
  { id: 'all', name: 'All Icons', icon: '✨', keywords: [] },
  { id: 'ai', name: 'AI & Intelligence', icon: '🤖', keywords: ['ai', 'brain', 'cpu', 'sparkles', 'bot', 'chip', 'robot', 'wand', 'magic'] },
  { id: 'alert', name: 'Alert & Warning', icon: '⚠️', keywords: ['alert', 'warning', 'info', 'bell', 'clock', 'alarm', 'shield', 'danger', 'triangle', 'octagon'] },
  { id: 'arrows', name: 'Arrows & Directions', icon: '➡️', keywords: ['arrow', 'chevron', 'direction', 'move', 'left', 'right', 'up', 'down', 'pointer', 'refresh', 'sync'] },
  { id: 'media', name: 'Media & Audio', icon: '🎵', keywords: ['play', 'music', 'video', 'sound', 'audio', 'volume', 'camera', 'image', 'picture', 'disc', 'film', 'mic'] },
  { id: 'editor', name: 'Editor & Layout', icon: '📝', keywords: ['edit', 'write', 'pen', 'align', 'format', 'list', 'trash', 'save', 'copy', 'paste', 'grid', 'table', 'columns'] },
  { id: 'communication', name: 'Communications', icon: '💬', keywords: ['mail', 'message', 'chat', 'phone', 'call', 'send', 'share', 'envelope', 'inbox'] },
  { id: 'commerce', name: 'E-Commerce & Finance', icon: '💳', keywords: ['cart', 'shop', 'card', 'price', 'wallet', 'dollar', 'euro', 'money', 'bag', 'bank', 'coins', 'percent'] },
  { id: 'weather', name: 'Weather & Nature', icon: '☁️', keywords: ['sun', 'cloud', 'rain', 'snow', 'wind', 'temp', 'weather', 'star', 'moon', 'leaf', 'tree', 'flower'] },
  { id: 'devices', name: 'Devices & Tech', icon: '💻', keywords: ['device', 'phone', 'computer', 'monitor', 'cpu', 'keyboard', 'laptop', 'tablet', 'wifi', 'battery', 'tv', 'plug'] },
  { id: 'design', name: 'Design & Art', icon: '🎨', keywords: ['paint', 'brush', 'color', 'palette', 'ruler', 'pencil', 'layers', 'crop', 'bezier', 'vector'] },
  { id: 'security', name: 'Security & Keys', icon: '🛡️', keywords: ['lock', 'shield', 'key', 'eye', 'secure', 'auth', 'unlock', 'password', 'keyhole', 'fingerprint'] },
  { id: 'health', name: 'Health & Medical', icon: '❤️', keywords: ['heart', 'plus', 'aid', 'medical', 'health', 'hospital', 'pill', 'activity', 'thermometer', 'pulse'] },
  { id: 'users', name: 'Users & Account', icon: '👤', keywords: ['user', 'profile', 'group', 'avatar', 'people', 'person', 'users', 'contact'] },
  { id: 'buildings', name: 'Buildings & Place', icon: '🏢', keywords: ['home', 'building', 'house', 'office', 'store', 'warehouse', 'hotel', 'map', 'pin'] }
]



// Clean CDN URLs pinning helper to ensure robust preview loading
function getCleanSvgUrl(url: string, library: string): string {
  if (!url) return ''
  
  // 1. Pin Tabler Icons to stable v2.47.0 release so direct /icons/ folder maps outline SVGs successfully
  if (library === 'tabler-icons') {
    if (url.includes('@tabler/icons/icons/')) {
      return url.replace('@tabler/icons/icons/', '@tabler/icons@2.47.0/icons/')
    }
  }
  
  // 2. Pin Phosphor Icons to 2.1.1 to guarantee outline assets resolve
  if (library === 'phosphor-icons') {
    if (url.includes('@phosphor-icons/core/assets/')) {
      return url.replace('@phosphor-icons/core/assets/', '@phosphor-icons/core@2.1.1/assets/')
    }
  }

  // 3. Pin Lucide Icons to a stable static release
  if (library === 'lucide-icons') {
    if (url.includes('lucide-static/icons/')) {
      return url.replace('lucide-static/icons/', 'lucide-static@0.415.0/icons/')
    }
  }
  
  return url
}

export default function IconSearchPage() {
  const [query, setQuery] = useState('')
  const [selectedLib, setSelectedLib] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStyle, setSelectedStyle] = useState('all')

  const [icons, setIcons] = useState<Icon[]>([])
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Customizer Drawer State
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null)
  const [svgContent, setSvgContent] = useState<string>('')
  const [loadingSvg, setLoadingSvg] = useState(false)
  const [customSize, setCustomSize] = useState(48)
  const [customStroke, setCustomStroke] = useState(1.5)
  const [customColor, setCustomColor] = useState('#818cf8')
  const [customColorName, setCustomColorName] = useState('Indigo')
  const [hexInput, setHexInput] = useState('#818cf8')
  const [activeCodeTab, setActiveCodeTab] = useState<'jsx' | 'svg' | 'vue' | 'tailwind'>('jsx')
  const [copiedCode, setCopiedCode] = useState(false)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 80

  const searchRef = useRef<HTMLInputElement>(null)

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [query, selectedLib, selectedCategory, selectedStyle])

  // Keydown listener for autofocusing search
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

  // Check URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlQuery = params.get('q')
    if (urlQuery) {
      setQuery(urlQuery)
      loadIcons()
    }
  }, [])

  // Lazy load icon data & pre-process split words / tagsSet for lag-free rendering
  async function loadIcons() {
    if (loaded) return
    setLoading(true)
    try {
      const res = await fetch('/icon-search.json')
      const data = await res.json()
      
      // Index strings to eliminate runtime overhead
      const processed = data.map((icon: any) => {
        const words = icon.name.toLowerCase().split(/[-_\s]/)
        const tagsSet = new Set(icon.tags.map((t: string) => t.toLowerCase()))
        return {
          ...icon,
          words,
          tagsSet
        }
      })

      setIcons(processed)
      setLoaded(true)
    } catch (e) {
      console.error('Failed to load icons', e)
    }
    setLoading(false)
  }

  // Fetch individual SVG content for sandbox customizer using the clean URL
  useEffect(() => {
    if (!selectedIcon) {
      setSvgContent('')
      return
    }
    setLoadingSvg(true)
    const cleanUrl = getCleanSvgUrl(selectedIcon.svgUrl, selectedIcon.library)
    fetch(cleanUrl)
      .then(res => res.text())
      .then(text => {
        setSvgContent(text)
        setLoadingSvg(false)
      })
      .catch(err => {
        console.error('Failed to fetch SVG', err)
        setLoadingSvg(false)
      })
  }, [selectedIcon])

  // Smart, lag-free filter processing using indexed Sets and arrays
  const filteredIcons = useMemo(() => {
    if (!loaded) return []

    return icons.filter(icon => {
      // 1. Library Filter
      const matchesLib = selectedLib === 'all' || icon.library === selectedLib

      // 2. Style Filter (Fully Functional mapping)
      let matchesStyle = true
      if (selectedStyle !== 'all') {
        const iconNameLower = icon.name.toLowerCase()
        const libraryLower = icon.library.toLowerCase()
        
        if (selectedStyle === 'solid') {
          // Solid / Filled Style
          matchesStyle = iconNameLower.includes('solid') || iconNameLower.includes('fill') || iconNameLower.includes('bold') ||
                         libraryLower.includes('bootstrap') && iconNameLower.includes('fill') ||
                         libraryLower.includes('remix') && iconNameLower.includes('fill')
        } else if (selectedStyle === 'duotone') {
          matchesStyle = iconNameLower.includes('duotone')
        } else if (selectedStyle === 'twotone') {
          matchesStyle = iconNameLower.includes('twotone') || iconNameLower.includes('two-tone')
        } else if (selectedStyle === 'stroke') {
          matchesStyle = iconNameLower.includes('outline') || iconNameLower.includes('regular') || 
                         iconNameLower.includes('light') || iconNameLower.includes('thin') || 
                         iconNameLower.includes('line') || libraryLower.includes('lucide') || 
                         libraryLower.includes('feather') || libraryLower.includes('iconoir')
        } else if (selectedStyle === 'sharp') {
          matchesStyle = iconNameLower.includes('sharp')
        }
      }

      // 3. Category Filter (Smart Whole-Word Boundary Matching)
      let matchesCategory = true
      if (selectedCategory !== 'all') {
        const cat = CATEGORIES.find(c => c.id === selectedCategory)
        if (cat) {
          matchesCategory = cat.keywords.some(kw => {
            const kwLower = kw.toLowerCase()
            const tagMatch = icon.tagsSet ? icon.tagsSet.has(kwLower) : icon.tags.some(tag => tag.toLowerCase() === kwLower)
            const wordMatch = icon.words ? icon.words.includes(kwLower) : false
            return tagMatch || wordMatch
          })
        }
      }

      // 4. Search Query Filter
      let matchesQuery = true
      const q = query.toLowerCase().trim()
      if (q) {
        const namePart = icon.name.includes(q)
        const tagPart = icon.tagsSet ? icon.tagsSet.has(q) : icon.tags.some(t => t.includes(q))
        matchesQuery = namePart || tagPart
      }

      return matchesLib && matchesStyle && matchesCategory && matchesQuery
    })
  }, [icons, loaded, query, selectedLib, selectedCategory, selectedStyle])

  // Optimized dynamic counts (Only re-evaluates when libraries/styles changes, completely lag-free)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    if (!loaded) return counts

    CATEGORIES.forEach(cat => {
      if (cat.id === 'all') {
        counts[cat.id] = icons.length
        return
      }
      
      const matching = icons.filter(icon => {
        // Keep context-aware for selected library & style
        const matchesLib = selectedLib === 'all' || icon.library === selectedLib
        
        let matchesStyle = true
        if (selectedStyle !== 'all') {
          const iconNameLower = icon.name.toLowerCase()
          if (selectedStyle === 'solid') matchesStyle = iconNameLower.includes('solid') || iconNameLower.includes('fill')
          else if (selectedStyle === 'duotone') matchesStyle = iconNameLower.includes('duotone')
          else if (selectedStyle === 'stroke') matchesStyle = iconNameLower.includes('outline') || iconNameLower.includes('line')
        }

        // Whole-word matching logic
        const matchesCat = cat.keywords.some(kw => {
          const kwLower = kw.toLowerCase()
          const tagMatch = icon.tagsSet ? icon.tagsSet.has(kwLower) : icon.tags.some(t => t.toLowerCase() === kwLower)
          const wordMatch = icon.words ? icon.words.includes(kwLower) : false
          return tagMatch || wordMatch
        })

        return matchesLib && matchesStyle && matchesCat
      })
      counts[cat.id] = matching.length
    })
    return counts
  }, [icons, loaded, selectedLib, selectedStyle])

  // Pagination calculation
  const totalPages = Math.ceil(filteredIcons.length / itemsPerPage)
  const paginatedIcons = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredIcons.slice(start, start + itemsPerPage)
  }, [filteredIcons, currentPage])

  // Handle pagination numbers render
  const paginationRange = useMemo(() => {
    const range: (number | string)[] = []
    const siblingCount = 1

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) range.push(i)
    } else {
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

      const shouldShowLeftDots = leftSiblingIndex > 2
      const shouldShowRightDots = rightSiblingIndex < totalPages - 2

      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + 2 * siblingCount
        for (let i = 1; i <= leftItemCount; i++) range.push(i)
        range.push('...')
        range.push(totalPages)
      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 3 + 2 * siblingCount
        range.push(1)
        range.push('...')
        for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) range.push(i)
      } else if (shouldShowLeftDots && shouldShowRightDots) {
        range.push(1)
        range.push('...')
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) range.push(i)
        range.push('...')
        range.push(totalPages)
      }
    }
    return range
  }, [totalPages, currentPage])

  // Customize Single SVG content using client sliders
  const customizedSvg = useMemo(() => {
    if (!svgContent) return ''

    let parsed = svgContent
    
    // Replace width
    parsed = parsed.replace(/width="[^"]*"/, `width="${customSize}"`)
    if (!parsed.includes(`width="${customSize}"`)) {
      parsed = parsed.replace('<svg', `<svg width="${customSize}"`)
    }

    // Replace height
    parsed = parsed.replace(/height="[^"]*"/, `height="${customSize}"`)
    if (!parsed.includes(`height="${customSize}"`)) {
      parsed = parsed.replace('<svg', `<svg height="${customSize}"`)
    }

    // Replace stroke-width if exists, else inject
    if (parsed.includes('stroke-width=')) {
      parsed = parsed.replace(/stroke-width="[^"]*"/g, `stroke-width="${customStroke}"`)
    } else if (parsed.includes('stroke=')) {
      parsed = parsed.replace('<svg', `<svg stroke-width="${customStroke}"`)
    }

    // Replace currentColor/black/white stroke and fills with customized color
    parsed = parsed.replace(/stroke="currentColor"/g, `stroke="${customColor}"`)
    parsed = parsed.replace(/fill="currentColor"/g, `fill="${customColor}"`)

    return parsed
  }, [svgContent, customSize, customStroke, customColor])

  // Generate dynamic code output for sidebar panels
  const generatedCode = useMemo(() => {
    if (!selectedIcon) return ''
    
    if (activeCodeTab === 'jsx') {
      return selectedIcon.reactImport + '\n\n' + selectedIcon.reactUsage.replace('size={24}', `size={${customSize}} color="${customColor}"`)
    } else if (activeCodeTab === 'svg') {
      return customizedSvg || '<!-- loading SVG -->'
    } else if (activeCodeTab === 'vue') {
      return `<template>\n  <span style="color: ${customColor}; font-size: ${customSize}px">\n    <!-- SVG representation -->\n    ${customizedSvg}\n  </span>\n</template>`
    } else if (activeCodeTab === 'tailwind') {
      return `<span class="text-[${customColor}] w-[${customSize}px] h-[${customSize}px] block">\n  <!-- SVG render -->\n</span>`
    }
    return ''
  }, [selectedIcon, activeCodeTab, customizedSvg, customSize, customColor])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const PRESET_COLORS = [
    { name: 'Indigo', hex: '#818cf8' },
    { name: 'Emerald', hex: '#34d399' },
    { name: 'Rose', hex: '#fb7185' },
    { name: 'Amber', hex: '#fbbf24' },
    { name: 'Cyan', hex: '#22d3ee' },
    { name: 'White', hex: '#ffffff' },
  ]

  return (
    <main style={{ 
      maxWidth: '1500px', 
      margin: '0 auto', 
      padding: '40px 48px',
      position: 'relative',
      minHeight: '100vh',
    }}>
      {/* Decorative Neon Backdrop Grid */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '400px',
        backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        opacity: 0.15,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        top: '100px',
        left: '20%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Page Header */}
      <section style={{ 
        position: 'relative', 
        zIndex: 1, 
        marginBottom: '32px',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '32px'
      }}>
        <div style={{ 
          fontSize: '11px', 
          color: 'var(--accent)', 
          fontFamily: 'var(--font-mono, monospace)', 
          letterSpacing: '3px', 
          textTransform: 'uppercase',
          marginBottom: '12px' 
        }}>
          // BROWSE DEV REGISTRY
        </div>
        <h1 style={{ 
          fontSize: 'clamp(28px, 4vw, 42px)', 
          fontWeight: 900, 
          lineHeight: 1.1, 
          marginBottom: '12px',
          letterSpacing: '-1px'
        }}>
          Explore 16,000+ Icons
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '650px', lineHeight: 1.6 }}>
          Meticulously indexed design resources across Lucide, Heroicons, Tabler, Phosphor, Radix, Bootstrap, Remix, Feather, and Iconoir. Download SVGs or copy imports dynamically.
        </p>
      </section>

      {/* Search Box */}
      <section style={{ position: 'relative', zIndex: 2, marginBottom: '24px' }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '4px 8px 4px 18px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <span style={{ fontSize: '20px', color: 'var(--text-muted)', marginRight: '12px' }}>🔍</span>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search 16,000+ icons — try 'camera', 'chevron', 'lock'..."
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              loadIcons()
            }}
            onFocus={loadIcons}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              padding: '16px 0',
              fontSize: '16px',
              color: 'var(--text)',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          {/* Keyboard Indicator */}
          {!query && (
            <span style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '11px',
              color: 'var(--text-dim)',
              marginRight: '12px',
              fontFamily: 'var(--font-mono, monospace)',
            }}>
              Press / to focus
            </span>
          )}
        </div>
      </section>

      {/* Clean & Functional Style Filter Row (Cured Redundancies) */}
      <section style={{ 
        position: 'relative', 
        zIndex: 2, 
        marginBottom: '32px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Filter Styles:</span>
        {[
          { id: 'all', name: 'All Styles' },
          { id: 'stroke', name: 'Outline / Stroke' },
          { id: 'solid', name: 'Solid / Filled' },
          { id: 'duotone', name: 'Duotone' },
          { id: 'twotone', name: 'Two-Tone' },
          { id: 'sharp', name: 'Sharp' },
        ].map(style => (
          <button
            key={style.id}
            onClick={() => {
              setSelectedStyle(style.id)
              loadIcons()
            }}
            style={{
              background: selectedStyle === style.id ? 'var(--accent)' : 'var(--bg-card)',
              border: `1px solid ${selectedStyle === style.id ? 'var(--accent)' : 'var(--border)'}`,
              color: selectedStyle === style.id ? 'white' : 'var(--text-muted)',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.15s',
            }}
          >
            {style.name}
          </button>
        ))}
      </section>

      {/* Library Scroll Bar (Lucide / Tabler selector) */}
      <section style={{ position: 'relative', zIndex: 2, marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {LIBRARIES.map(lib => (
            <button
              key={lib.slug}
              onClick={() => {
                setSelectedLib(lib.slug)
                loadIcons()
              }}
              style={{
                background: selectedLib === lib.slug ? 'var(--accent)' : 'var(--bg-card)',
                border: `1px solid ${selectedLib === lib.slug ? 'var(--accent)' : 'var(--border)'}`,
                color: selectedLib === lib.slug ? 'white' : 'var(--text-muted)',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.15s',
              }}
            >
              {lib.name}
            </button>
          ))}
        </div>
      </section>

      {/* Main Two-Column Split Screen Panel */}
      <section style={{ 
        position: 'relative', 
        zIndex: 2, 
        display: 'grid', 
        gridTemplateColumns: '260px 1fr', 
        gap: '32px',
        alignItems: 'start',
        marginBottom: '60px'
      }}>
        {/* Left Sticky Sidebar Categories */}
        <aside style={{
          position: 'sticky',
          top: '20px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '20px 16px',
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <h3 style={{ 
            fontSize: '11px', 
            fontWeight: 800, 
            color: 'var(--text-dim)', 
            textTransform: 'uppercase', 
            letterSpacing: '1px', 
            marginBottom: '12px',
            paddingLeft: '8px'
          }}>
            Categories
          </h3>
          {CATEGORIES.map(cat => {
            const count = loaded ? (categoryCounts[cat.id] || 0) : 0
            const isSelected = selectedCategory === cat.id
            
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id)
                  loadIcons()
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: isSelected ? 'var(--accent-dim)' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                  fontSize: '13px',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>
                {loaded ? (
                  <span style={{
                    fontSize: '10px',
                    color: isSelected ? 'var(--accent)' : 'var(--text-dim)',
                    background: isSelected ? 'rgba(129,140,248,0.2)' : 'var(--bg-secondary)',
                    padding: '2px 8px',
                    borderRadius: '99px',
                    fontFamily: 'var(--font-mono, monospace)',
                  }}>
                    {count}
                  </span>
                ) : (
                  <div style={{
                    width: '24px',
                    height: '14px',
                    background: 'var(--border)',
                    borderRadius: '4px',
                    animation: 'pulse 1.5s infinite'
                  }} />
                )}
              </button>
            )
          })}
        </aside>

        {/* Right Main Search Results Grid */}
        <section style={{ minWidth: 0 }}>
          {/* Statistics Info Row */}
          {!loading && !query && selectedLib === 'all' && selectedCategory === 'all' && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '16px', 
              marginBottom: '32px' 
            }}>
              {[
                { number: '16,000+', label: 'Searchable Icons', color: 'var(--accent)' },
                { number: '9', label: 'Icon Libraries', color: 'var(--green)' },
                { number: '14', label: 'Smart Categories', color: 'var(--cyan)' },
                { number: '100% Free', label: 'Developer Sandbox', color: 'var(--yellow)' },
              ].map(stat => (
                <div key={stat.label} style={{ 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '12px', 
                  padding: '20px', 
                  textAlign: 'center',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: stat.color, fontFamily: 'var(--font-mono, monospace)' }}>{stat.number}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Title and stats summary */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'baseline', 
            borderBottom: '1px solid var(--border)',
            paddingBottom: '12px',
            marginBottom: '20px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>
              {selectedCategory === 'all' ? 'All Icons' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </h2>
            {loaded && (
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono, monospace)' }}>
                // Found {formatNumber(filteredIcons.length)} results
              </span>
            )}
          </div>

          {/* Loader State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid var(--border)',
                borderTop: '3px solid var(--accent)',
                borderRadius: '50%',
                margin: '0 auto 16px auto',
                animation: 'spin 1s linear infinite',
              }} />
              <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px' }}>// compiling icon repository index...</p>
            </div>
          )}

          {/* Default Start Prompt (Click to load) */}
          {!loading && !loaded && (
            <div 
              onClick={loadIcons}
              style={{
                textAlign: 'center', 
                padding: '80px 40px', 
                background: 'var(--bg-card)',
                border: '2px dashed var(--border)',
                borderRadius: '16px',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <span style={{ fontSize: '40px', display: 'block', marginBottom: '16px' }}>⚡</span>
              <h3 style={{ fontSize: '18px', color: 'var(--text)', marginBottom: '8px' }}>Launch Icon Database</h3>
              <p style={{ fontSize: '13px', maxWidth: '350px', margin: '0 auto', lineHeight: 1.5 }}>
                Click anywhere to load the high-performance SVG registry in your browser sandbox.
              </p>
            </div>
          )}

          {/* Empty Results state */}
          {loaded && !loading && filteredIcons.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '80px 20px', 
              background: 'var(--bg-card)', 
              borderRadius: '16px', 
              border: '1px solid var(--border)' 
            }}>
              <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>🔍</span>
              <h3 style={{ color: 'var(--text)', fontSize: '16px', marginBottom: '6px' }}>No Icons Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '300px', margin: '0 auto', lineHeight: 1.5 }}>
                No matches found for "{query}". Try checking your library filter or search spelling.
              </p>
            </div>
          )}

          {/* Results Cards Grid */}
          {loaded && !loading && filteredIcons.length > 0 && (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '12px',
                marginBottom: '40px',
              }}>
                {paginatedIcons.map((icon) => {
                  const brandColor = LIBRARY_COLORS[icon.library] || 'var(--accent)'
                  const cleanUrl = getCleanSvgUrl(icon.svgUrl, icon.library)
                  
                  return (
                    <div 
                      key={icon.id}
                      onClick={() => setSelectedIcon(icon)}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = brandColor
                        e.currentTarget.style.boxShadow = `0 4px 20px ${brandColor}15`
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border)'
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.transform = 'none'
                      }}
                    >
                      {/* Icon Canvas Preview (Resolved unpinned CDN image fails + Fallbacks) */}
                      <div style={{
                        width: '56px',
                        height: '56px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        overflow: 'hidden',
                      }}>
                        <img
                          src={cleanUrl}
                          alt={icon.name}
                          width={26}
                          height={26}
                          style={{ 
                            filter: 'invert(1) brightness(0.95)', 
                            opacity: 0.85 
                          }}
                          onError={e => {
                            // Fallback text rendering so card is never empty
                            e.currentTarget.style.display = 'none'
                            const parent = e.currentTarget.parentElement
                            if (parent) {
                              const fallback = document.createElement('span')
                              fallback.innerText = icon.displayName.slice(0, 2).toUpperCase()
                              fallback.style.fontFamily = 'var(--font-mono, monospace)'
                              fallback.style.fontSize = '12px'
                              fallback.style.fontWeight = '700'
                              fallback.style.color = brandColor
                              parent.appendChild(fallback)
                            }
                          }}
                        />
                      </div>

                      {/* Info labels */}
                      <div style={{ textAlign: 'center', width: '100%' }}>
                        <div style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: 'var(--text)',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          fontFamily: 'var(--font-mono, monospace)',
                          marginBottom: '2px'
                        }}>
                          {icon.name}
                        </div>
                        <div style={{
                          fontSize: '9px',
                          color: brandColor,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {icon.libraryName.replace(' Icons', '')}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Standard Functional Pagination Row (Hugeicons Screenshot Style) */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '40px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                }}>
                  {/* Previous button */}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(c => Math.max(c - 1, 1))}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: currentPage === 1 ? 'var(--text-dim)' : 'var(--text-muted)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    Previous
                  </button>

                  {/* Dynamic page numbers */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {paginationRange.map((page, idx) => {
                      if (page === '...') {
                        return (
                          <span key={'dots-' + idx} style={{
                            padding: '8px 12px',
                            color: 'var(--text-dim)',
                            fontSize: '13px',
                            fontFamily: 'var(--font-mono, monospace)',
                          }}>
                            ...
                          </span>
                        )
                      }
                      
                      const isCurrent = currentPage === page
                      return (
                        <button
                          key={'page-' + page}
                          onClick={() => setCurrentPage(Number(page))}
                          style={{
                            background: isCurrent ? 'var(--accent)' : 'var(--bg-secondary)',
                            border: `1px solid ${isCurrent ? 'var(--accent)' : 'var(--border)'}`,
                            color: isCurrent ? 'white' : 'var(--text-muted)',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            fontFamily: 'var(--font-mono, monospace)',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>

                  {/* Next button */}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(c => Math.min(c + 1, totalPages))}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: currentPage === totalPages ? 'var(--text-dim)' : 'var(--text-muted)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    Next
                  </button>

                  {/* Index stats */}
                  <span style={{ 
                    marginLeft: '16px', 
                    fontSize: '12px', 
                    color: 'var(--text-dim)',
                    fontFamily: 'var(--font-mono, monospace)',
                    borderLeft: '1px solid var(--border)',
                    paddingLeft: '16px',
                  }}>
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              )}
            </>
          )}
        </section>
      </section>

      {/* SVG DESIGN CUSTOMIZER DRAWER (Slides in from the right) */}
      {selectedIcon && (
        <>
          {/* Backdrop mask */}
          <div 
            onClick={() => setSelectedIcon(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 999,
              transition: 'opacity 0.3s',
            }}
          />

          {/* Drawer Body */}
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '450px',
            background: 'var(--bg-secondary)',
            borderLeft: '1px solid var(--border)',
            boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            overflowY: 'auto',
          }}>
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Design Artboard</h3>
                <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono, monospace)', textTransform: 'uppercase' }}>
                  {selectedIcon.libraryName}
                </span>
              </div>
              <button 
                onClick={() => setSelectedIcon(null)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}
              >
                ✕
              </button>
            </div>

            {/* Artboard Canvas Grid */}
            <div style={{
              height: '180px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}>
              {loadingSvg ? (
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Loading canvas...</div>
              ) : customizedSvg ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: customizedSvg }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'scale(1.2)',
                  }}
                />
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--red)' }}>Error rendering icon template</span>
              )}

              {/* Tag metadata inside artboard */}
              <span style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                fontSize: '10px',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-mono, monospace)',
                background: 'var(--bg-secondary)',
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border)'
              }}>
                {customSize}px × {customSize}px
              </span>
            </div>

            {/* Config Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Size Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Icon Size</span>
                  <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono, monospace)' }}>{customSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="16" 
                  max="128" 
                  value={customSize} 
                  onChange={e => setCustomSize(Number(e.target.value))}
                  style={{
                    width: '100%',
                    accentColor: 'var(--accent)',
                    cursor: 'pointer',
                  }}
                />
              </div>

              {/* Stroke Width Slider (Lucide/Tabler/Feather/Iconoir only) */}
              {(selectedIcon.library === 'lucide-icons' || 
                selectedIcon.library === 'tabler-icons' || 
                selectedIcon.library === 'feather-icons' ||
                selectedIcon.library === 'iconoir') && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Stroke Weight</span>
                    <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono, monospace)' }}>{customStroke}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="3.0" 
                    step="0.1"
                    value={customStroke} 
                    onChange={e => setCustomStroke(Number(e.target.value))}
                    style={{
                      width: '100%',
                      accentColor: 'var(--accent)',
                      cursor: 'pointer',
                    }}
                  />
                </div>
              )}

              {/* Preset Palette Swatches */}
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Brand Theme Color
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {PRESET_COLORS.map(color => {
                    const isSelected = customColor === color.hex
                    return (
                      <button
                        key={color.name}
                        onClick={() => {
                          setCustomColor(color.hex)
                          setHexInput(color.hex)
                          setCustomColorName(color.name)
                        }}
                        style={{
                          background: color.hex,
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          border: isSelected ? '3px solid var(--text)' : '2px solid var(--border)',
                          cursor: 'pointer',
                          boxShadow: isSelected ? '0 0 10px rgba(255,255,255,0.4)' : 'none',
                          transition: 'all 0.15s',
                        }}
                        title={color.name}
                      />
                    )
                  })}
                </div>

                {/* Hex input block */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '4px 12px',
                }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '13px', marginRight: '6px', fontFamily: 'var(--font-mono, monospace)' }}>HEX:</span>
                  <input 
                    type="text" 
                    value={hexInput}
                    onChange={e => {
                      setHexInput(e.target.value)
                      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                        setCustomColor(e.target.value)
                      }
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text)',
                      fontSize: '13px',
                      fontFamily: 'var(--font-mono, monospace)',
                      outline: 'none',
                      flex: 1,
                    }}
                  />
                  <input 
                    type="color" 
                    value={customColor}
                    onChange={e => {
                      setCustomColor(e.target.value)
                      setHexInput(e.target.value)
                    }}
                    style={{
                      border: 'none',
                      background: 'none',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Code Export Tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div style={{ 
                display: 'flex', 
                borderBottom: '1px solid var(--border)',
                marginBottom: '12px',
                overflowX: 'auto',
                gap: '8px'
              }}>
                {[
                  { tab: 'jsx', label: 'React JSX' },
                  { tab: 'svg', label: 'Raw SVG' },
                  { tab: 'vue', label: 'Vue 3' },
                  { tab: 'tailwind', label: 'Tailwind' },
                ].map(item => (
                  <button
                    key={item.tab}
                    onClick={() => setActiveCodeTab(item.tab as any)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: activeCodeTab === item.tab ? 'var(--accent)' : 'var(--text-muted)',
                      borderBottom: activeCodeTab === item.tab ? '2px solid var(--accent)' : '2px solid transparent',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Code output field */}
              <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
                <pre style={{
                  background: 'var(--code-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '16px',
                  fontSize: '11px',
                  color: 'var(--green)',
                  fontFamily: 'var(--font-mono, monospace)',
                  height: '180px',
                  overflow: 'auto',
                  margin: 0,
                }}>
                  <code>{generatedCode}</code>
                </pre>

                {/* Floating Copy Button */}
                <button
                  onClick={() => copyToClipboard(generatedCode)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: copiedCode ? '#4ade8015' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${copiedCode ? '#4ade80' : 'var(--border)'}`,
                    color: copiedCode ? '#4ade80' : 'var(--text)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.15s',
                  }}
                >
                  {copiedCode ? '✓ Copied' : 'Copy Code'}
                </button>
              </div>
            </div>

            {/* Quick NPM Installation instructions */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)' }}>
                NPM PACKAGE INSTALLATION
              </span>
              <code style={{
                fontSize: '10px',
                color: 'var(--cyan)',
                fontFamily: 'var(--font-mono, monospace)',
              }}>
                npm i {selectedIcon.npmPackage}
              </code>
            </div>
          </div>
        </>
      )}

      {/* Global CSS Inject for Animations */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </main>
  )
}