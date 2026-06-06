'use client'

import { useEffect, useMemo, useRef, useState, useCallback, memo } from 'react'
import { generateZipPackage } from '../../lib/exporter'
import { createClient, isSupabaseConfigured } from '@/lib/supabase'
import AuthModal from '../components/AuthModal'

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
  'iconoir': '#e88c30',
  'ant-design-icons': '#1890ff',
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

function getPreviewCandidates(icon: Icon): string[] {
  const cleaned = getCleanSvgUrl(icon.svgUrl, icon.library)
  const candidates = new Set<string>()
  const add = (value?: string) => {
    if (value) candidates.add(value)
  }

  add(cleaned)
  add(icon.svgUrl)

  const exactName = icon.name
  const dashedName = icon.name.replace(/_/g, '-')
  const underscoredName = icon.name.replace(/-/g, '_')

  if (icon.library === 'lucide-icons') {
    add(`https://unpkg.com/lucide-static@latest/icons/${exactName}.svg`)
    add(`https://unpkg.com/lucide-static@latest/icons/${dashedName}.svg`)
    add(`https://api.iconify.design/lucide/${exactName}.svg`)
    add(`https://api.iconify.design/lucide/${dashedName}.svg`)
  } else if (icon.library === 'tabler-icons') {
    add(`https://cdn.jsdelivr.net/npm/@tabler/icons@2.47.0/icons/${exactName}.svg`)
    add(`https://cdn.jsdelivr.net/npm/@tabler/icons@2.47.0/icons/${dashedName}.svg`)
    add(`https://api.iconify.design/tabler/${exactName}.svg`)
  } else if (icon.library === 'phosphor-icons') {
    add(`https://unpkg.com/@phosphor-icons/core@latest/assets/regular/${exactName}.svg`)
    add(`https://api.iconify.design/ph/${exactName}.svg`)
  } else if (icon.library === 'heroicons') {
    add(`https://api.iconify.design/heroicons/${exactName}.svg`)
    add(`https://api.iconify.design/heroicons-outline/${exactName}.svg`)
    add(`https://api.iconify.design/heroicons-solid/${exactName}.svg`)
  } else if (icon.library === 'bootstrap-icons') {
    add(`https://cdn.jsdelivr.net/npm/bootstrap-icons@latest/icons/${exactName}.svg`)
    add(`https://api.iconify.design/bi/${exactName}.svg`)
  } else if (icon.library === 'feather-icons') {
    add(`https://unpkg.com/feather-icons@latest/dist/icons/${exactName}.svg`)
    add(`https://api.iconify.design/feather/${exactName}.svg`)
  } else if (icon.library === 'remix-icon') {
    add(`https://api.iconify.design/ri/${exactName}.svg`)
  } else if (icon.library === 'iconoir') {
    add(`https://api.iconify.design/iconoir/${exactName}.svg`)
    add(`https://cdn.jsdelivr.net/npm/iconoir@latest/icons/regular/${exactName}.svg`)
  } else if (icon.library === 'ionicons') {
    add(`https://api.iconify.design/ion/${exactName}.svg`)
    add(`https://api.iconify.design/ion/${dashedName}.svg`)
    add(`https://api.iconify.design/ion/${underscoredName}.svg`)
  } else if (icon.library === 'octicons') {
    add(`https://api.iconify.design/octicon/${exactName}.svg`)
    add(`https://api.iconify.design/octicon/${dashedName}.svg`)
    add(`https://api.iconify.design/octicon/${underscoredName}.svg`)
  } else if (icon.library === 'ant-design-icons') {
    add(`https://api.iconify.design/ant-design/${exactName}.svg`)
    add(`https://api.iconify.design/ant-design/${dashedName}.svg`)
    add(`https://api.iconify.design/ant-design/${exactName}-filled.svg`)
    add(`https://api.iconify.design/ant-design/${exactName}-outlined.svg`)
    add(`https://api.iconify.design/ant-design/${exactName}-twotone.svg`)
    add(`https://api.iconify.design/ant-design/${exactName}-fill.svg`)
    add(`https://api.iconify.design/ant-design/${exactName}-outline.svg`)
  } else if (icon.library.startsWith('iconify-')) {
    const prefix = icon.library.replace(/^iconify-/, '')
    add(`https://api.iconify.design/${prefix}/${exactName}.svg`)
    add(`https://api.iconify.design/${prefix}/${dashedName}.svg`)
    add(`https://api.iconify.design/${prefix}/${underscoredName}.svg`)
  } else {
    const normalizedPrefix = icon.library
      .toLowerCase()
      .replace(/-icons?$/, '')
      .replace(/_/g, '-')
    add(`https://api.iconify.design/${normalizedPrefix}/${exactName}.svg`)
    add(`https://api.iconify.design/${normalizedPrefix}/${dashedName}.svg`)
    add(`https://api.iconify.design/${normalizedPrefix}/${underscoredName}.svg`)
  }

  return Array.from(candidates)
}

const IconCard = memo(({
  icon,
  color,
  isSelected,
  onSelect
}: {
  icon: Icon
  color: string
  isSelected: boolean
  onSelect: () => void
}) => {
  const [fallbackIndex, setFallbackIndex] = useState(0)
  const [failed, setFailed] = useState(false)

  const candidates = useMemo(() => getPreviewCandidates(icon), [icon])
  const src = candidates[fallbackIndex] || getCleanSvgUrl(icon.svgUrl, icon.library)

  const onError = useCallback(() => {
    if (fallbackIndex < candidates.length - 1) {
      setFallbackIndex((prev) => prev + 1)
    } else {
      setFailed(true)
    }
  }, [fallbackIndex, candidates.length])

  // Reset local state if icon changes
  useEffect(() => {
    setFallbackIndex(0)
    setFailed(false)
  }, [icon.id])

  return (
    <button
      onClick={onSelect}
      style={{
        background: isSelected ? 'rgba(129, 140, 248, 0.15)' : 'rgba(24,24,27,0.8)',
        border: isSelected ? `2.5px solid ${color}` : '1px solid var(--border)',
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
        e.currentTarget.style.borderColor = isSelected ? color : 'var(--border)'
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
            title={`${icon.name} from ${icon.libraryName}`}
            width={25}
            height={25}
            loading="lazy"
            decoding="async"
            style={{ filter: 'invert(1) brightness(0.95)', opacity: 0.9 }}
            onError={onError}
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
})
IconCard.displayName = 'IconCard'

export default function IconSearchClient({ initialData }: { initialData?: ApiResponse }) {
  const [query, setQuery] = useState('')
  const [selectedLib, setSelectedLib] = useState('all')
  const [selectedIconifySet, setSelectedIconifySet] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStyle, setSelectedStyle] = useState('all')
  const [sortBy, setSortBy] = useState<'relevance' | 'popular' | 'alphabetical'>('alphabetical')
  const [legalOnly, setLegalOnly] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(!initialData)
  const [results, setResults] = useState<ApiResponse>(initialData || { icons: [], total: 0, page: 1, limit: 80, totalPages: 1 })
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null)
  const [svgContent, setSvgContent] = useState('')
  const [customSize, setCustomSize] = useState(32)
  const [customStroke, setCustomStroke] = useState(1.5)
  const [customColor, setCustomColor] = useState('#818cf8')
  const [cart, setCart] = useState<CartItem[]>([])
  const [copied, setCopied] = useState(false)
  const [exportNotice, setExportNotice] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  // Exporter Upgrades (Phase 2)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [exportPackageName, setExportPackageName] = useState('icon-hub-package')
  const [exportFormats, setExportFormats] = useState({
    svg: true,
    png: true,
    react: true,
    vue: false,
    tailwind: false,
    sprite: true
  })
  const [exportPngScale, setExportPngScale] = useState(2)
  const [exportUsePreset, setExportUsePreset] = useState(false)
  const [exportPresetSize, setExportPresetSize] = useState(32)
  const [exportPresetStroke, setExportPresetStroke] = useState(1.5)
  const [exportPresetColor, setExportPresetColor] = useState('#818cf8')
  const [exportStatus, setExportStatus] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  // Workspace Upgrades (Phase 3)
  const [packs, setPacks] = useState<any[]>([
    { id: 'default', name: 'Dashboard Pack', items: [], createdAt: new Date().toISOString() }
  ])
  const [activePackId, setActivePackId] = useState('default')
  const [isRenamePackOpen, setIsRenamePackOpen] = useState(false)
  const [renamePackName, setRenamePackName] = useState('')
  const [isCreatePackOpen, setIsCreatePackOpen] = useState(false)
  const [createPackName, setCreatePackName] = useState('')

  // Style Presets Upgrades (Phase 3)
  const [presets, setPresets] = useState<any[]>([
    { id: 'default', name: 'Lucide Outline Default', size: 32, stroke: 1.5, color: '#818cf8' },
    { id: 'dense', name: 'Dense UI Outline (16px)', size: 16, stroke: 1.0, color: '#3b82f6' },
    { id: 'bold', name: 'Bold High-Contrast (48px)', size: 48, stroke: 2.2, color: '#ec4899' },
  ])
  const [selectedPresetId, setSelectedPresetId] = useState('none')
  const [isCreatePresetOpen, setIsCreatePresetOpen] = useState(false)
  const [createPresetName, setCreatePresetName] = useState('')

  // Phase 5: Auth, Cloud Sync & Plan Gating
  const [user, setUser] = useState<any>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [cloudSyncStatus, setCloudSyncStatus] = useState('')
  // Cloud sync helper: push packs to Supabase
  const syncPacksToCloud = useCallback(async (packsData: any[]) => {
    if (!user || !isSupabaseConfigured()) return
    const supabase = createClient()
    if (!supabase) return
    try {
      // Upsert each pack
      for (const pack of packsData) {
        const { error } = await supabase
          .from('packs')
          .upsert({
            id: pack.id,
            user_id: user.id,
            name: pack.name,
            items: pack.items,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' })
        if (error) {
          console.warn('Pack sync error:', error.message)
          alert('Pack sync error: ' + error.message)
        }
      }
    } catch (e: any) {
      console.warn('Cloud sync failed (packs):', e)
      alert('Cloud sync failed: ' + e.message)
    }
  }, [user])

  // Cloud sync helper: push presets to Supabase
  const syncPresetsToCloud = useCallback(async (presetsData: any[]) => {
    if (!user || !isSupabaseConfigured()) return
    const supabase = createClient()
    if (!supabase) return
    try {
      for (const preset of presetsData) {
        const { error } = await supabase
          .from('presets')
          .upsert({
            id: preset.id,
            user_id: user.id,
            name: preset.name,
            size: preset.size,
            stroke: preset.stroke,
            color: preset.color,
          }, { onConflict: 'id' })
        if (error) console.warn('Preset sync error:', error.message)
      }
    } catch (e) {
      console.warn('Cloud sync failed (presets):', e)
    }
  }, [user])

  // Fetch cloud data on login
  const fetchCloudData = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured()) return
    const supabase = createClient()
    if (!supabase) return
    try {
      setCloudSyncStatus('Syncing from cloud...')


      // Fetch packs
      const { data: cloudPacks } = await supabase
        .from('packs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (cloudPacks && cloudPacks.length > 0) {
        const merged = cloudPacks.map((p: any) => ({
          id: p.id,
          name: p.name,
          items: p.items || [],
          createdAt: p.created_at,
        }))
        setPacks(merged)
        setActivePackId(merged[0].id)
        setCart(merged[0].items || [])
        localStorage.setItem('icon-hub-workspace-packs', JSON.stringify(merged))
      }

      // Fetch presets
      const { data: cloudPresets } = await supabase
        .from('presets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (cloudPresets && cloudPresets.length > 0) {
        const mapped = cloudPresets.map((p: any) => ({
          id: p.id,
          name: p.name,
          size: p.size,
          stroke: Number(p.stroke),
          color: p.color,
        }))
        setPresets(mapped)
        localStorage.setItem('icon-hub-style-presets', JSON.stringify(mapped))
      }

      setCloudSyncStatus('Cloud sync complete')
      setTimeout(() => setCloudSyncStatus(''), 2500)
    } catch (e) {
      console.warn('Failed to fetch cloud data:', e)
      setCloudSyncStatus('')
    }
  }, [])

  // Auth session listener
  useEffect(() => {
    if (!isSupabaseConfigured()) return
    const supabase = createClient()
    if (!supabase) return

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchCloudData(session.user.id)
      }
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user)
          fetchCloudData(session.user.id)
        } else {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchCloudData])

  // Handle sign out
  async function handleSignOut() {
    if (!isSupabaseConfigured()) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setCloudSyncStatus('')
  }

  function handleAuthSuccess(authUser: any) {
    setUser(authUser)
    fetchCloudData(authUser.id)
  }

  async function handleStartExport() {
    if (cart.length === 0) return

    setIsExporting(true)
    try {
      await generateZipPackage({
        packageName: exportPackageName,
        items: cart,
        formats: exportFormats,
        pngScale: exportPngScale,
        usePreset: exportUsePreset,
        presetSize: exportPresetSize,
        presetStroke: exportPresetStroke,
        presetColor: exportPresetColor
      }, setExportStatus)
      setIsExportModalOpen(false)
    } catch (e) {
      console.error('Failed to generate package', e)
      setExportStatus('Failed to generate package. Try again.')
    } finally {
      setIsExporting(false)
    }
  }

  // Packs & Workspace helper handlers (Phase 3)
  function handleSwitchPack(packId: string) {
    setActivePackId(packId)
    const pack = packs.find(p => p.id === packId)
    if (pack) {
      setCart(pack.items)
    }
  }

  function handleCreatePack() {
    const name = createPackName.trim() || `Pack #${packs.length + 1}`
    const id = `pack-${Date.now()}`
    const newPack = { id, name, items: [], createdAt: new Date().toISOString() }
    const updatedPacks = [...packs, newPack]
    setPacks(updatedPacks)
    setActivePackId(id)
    setCart([])
    setIsCreatePackOpen(false)
    syncPacksToCloud(updatedPacks)
  }

  function handleRenamePack() {
    const name = renamePackName.trim()
    if (!name) return
    setPacks(prev => prev.map(p => p.id === activePackId ? { ...p, name } : p))
    setIsRenamePackOpen(false)
  }

  function handleDeleteActivePack() {
    if (packs.length <= 1) return
    const remaining = packs.filter(p => p.id !== activePackId)
    setPacks(remaining)
    const nextActive = remaining[0]
    setActivePackId(nextActive.id)
    setCart(nextActive.items)
  }

  function handleClearActivePack() {
    setCart([])
    setExportNotice('Cleared all icons in current pack.')
    setTimeout(() => setExportNotice(''), 1800)
  }

  // Presets helper handlers (Phase 3)
  function applyStylePreset(presetId: string) {
    setSelectedPresetId(presetId)
    if (presetId === 'none') return
    const preset = presets.find((p) => p.id === presetId)
    if (preset) {
      setCustomSize(preset.size)
      setCustomStroke(preset.stroke)
      setCustomColor(preset.color)
    }
  }

  function applyPresetToAllCart(presetId: string) {
    if (presetId === 'none') return
    const preset = presets.find((p) => p.id === presetId)
    if (!preset) return
    setCart((prev) =>
      prev.map((item) => ({
        ...item,
        size: preset.size,
        stroke: preset.stroke,
        color: preset.color,
      }))
    )
    setExportNotice('Applied preset styling to all cart icons!')
    setTimeout(() => setExportNotice(''), 2200)
  }



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
          sort: sortBy,
        })
        const res = await fetch(`/api/icon-search?${params.toString()}`, { signal: controller.signal })
        const data = await res.json()
        const icons: Icon[] = Array.isArray(data?.icons) ? data.icons : []
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

  // Load packs, presets, and check URL params on startup (Phase 3)
  useEffect(() => {
    try {
      const rawPacks = localStorage.getItem('icon-hub-workspace-packs')
      const rawActiveId = localStorage.getItem('icon-hub-workspace-active-pack')
      const rawPresets = localStorage.getItem('icon-hub-style-presets')

      let initialPacks = [
        { id: 'default', name: 'Dashboard Pack', items: [], createdAt: new Date().toISOString() }
      ]
      let activeId = 'default'

      if (rawPacks) {
        const parsed = JSON.parse(rawPacks)
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialPacks = parsed
          activeId = rawActiveId || parsed[0].id
        }
      }

      setPacks(initialPacks)
      setActivePackId(activeId)

      if (rawPresets) {
        const parsedPresets = JSON.parse(rawPresets)
        if (Array.isArray(parsedPresets)) setPresets(parsedPresets)
      }

      // Check if URL has cart deep-link parameter
      const params = new URLSearchParams(window.location.search)
      const cartParam = params.get('cart')
      if (cartParam) {
        const parts = cartParam.split(',').filter(Boolean)
        const parsedItems = parts.map(part => {
          const [id, sizeStr, strokeStr, colorHex] = part.split(':')
          return {
            id,
            size: Number(sizeStr) || 32,
            stroke: Number(strokeStr) || 1.5,
            color: colorHex ? `#${colorHex}` : '#818cf8'
          }
        })

        if (parsedItems.length > 0) {
          const ids = parsedItems.map(p => p.id).join(',')
          setLoading(true)
          fetch(`/api/icon-search?ids=${ids}&limit=100`)
            .then(res => res.json())
            .then(data => {
              const fetchedIcons = data.icons || []
              const cartItems: CartItem[] = parsedItems.map(p => {
                const matchedIcon = fetchedIcons.find((i: any) => i.id === p.id)
                if (!matchedIcon) return null
                return {
                  key: `${p.id}-${Date.now()}-${Math.random()}`,
                  icon: matchedIcon,
                  size: p.size,
                  stroke: p.stroke,
                  color: p.color
                }
              }).filter(Boolean) as CartItem[]

              if (cartItems.length > 0) {
                setCart(cartItems)
                // Also update the active pack with these loaded items
                setPacks(prev => prev.map(p => p.id === activeId ? { ...p, items: cartItems } : p))
              }
            })
            .catch(e => console.error('Failed to restore cart from URL', e))
            .finally(() => setLoading(false))
        }
      } else {
        // No URL params, load active pack's items
        const activePack = initialPacks.find((p: any) => p.id === activeId)
        if (activePack) setCart(activePack.items)
      }
    } catch (e) {
      console.error('Failed to initialize workspace data', e)
    }
  }, [])

  // Persist packs, active pack, and presets to local storage + cloud
  useEffect(() => {
    localStorage.setItem('icon-hub-workspace-packs', JSON.stringify(packs))
  }, [packs])

  useEffect(() => {
    localStorage.setItem('icon-hub-workspace-active-pack', activePackId)
  }, [activePackId])

  useEffect(() => {
    localStorage.setItem('icon-hub-style-presets', JSON.stringify(presets))
  }, [presets])

  // Cloud sync: push packs when modified (debounced)
  useEffect(() => {
    if (!user) return
    const timer = setTimeout(() => {
      syncPacksToCloud(packs)
    }, 2000)
    return () => clearTimeout(timer)
  }, [packs, user, syncPacksToCloud])

  // Cloud sync: push presets when modified (debounced)
  useEffect(() => {
    if (!user) return
    const timer = setTimeout(() => {
      syncPresetsToCloud(presets)
    }, 2000)
    return () => clearTimeout(timer)
  }, [presets, user, syncPresetsToCloud])

  // Synchronize cart changes to browser URL parameter dynamically (no next-router lag)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    if (cart.length === 0) {
      url.searchParams.delete('cart')
    } else {
      const serialized = cart
        .map((item) => `${item.icon.id}:${item.size}:${item.stroke}:${item.color.replace('#', '')}`)
        .join(',')
      url.searchParams.set('cart', serialized)
    }
    window.history.replaceState({}, '', url.toString())
  }, [cart])

  // Keep packs array in sync whenever active pack's cart items are altered
  useEffect(() => {
    setPacks((prev) =>
      prev.map((p) => (p.id === activePackId ? { ...p, items: cart } : p))
    )
  }, [cart, activePackId])


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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px', marginBottom: '12px' }}>
              // HUGE ICON REGISTRY
            </div>
            <h1 style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '12px' }}>
              Search 350,000+ Icons
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '760px', lineHeight: 1.7 }}>
              Hugeicons-style explorer with lightning-fast API search, clean cards, rich filters, and polished dark UI.
            </p>
            <p style={{ color: 'var(--green)', fontSize: '12px', marginTop: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
              {loading
                ? 'Checking license safety...'
                : `Legal-safe icons in current scope: ${formatNumber(results.facets?.legalSafeCount || 0)}`}
            </p>
          </div>

          {/* Auth / Profile Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {cloudSyncStatus && (
              <span style={{
                fontSize: '10px',
                color: 'var(--accent)',
                fontFamily: 'JetBrains Mono, monospace',
                background: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '6px',
                padding: '4px 8px',
              }}>
                ☁️ {cloudSyncStatus}
              </span>
            )}

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

                {/* Profile Button */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={handleSignOut}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      color: '#fff',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontFamily: 'JetBrains Mono, monospace',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)'
                      e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <span style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 800,
                    }}>
                      {user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'JetBrains Mono, monospace',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.5)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.3)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Sign In
              </button>
            )}
          </div>
        </div>
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
        <select aria-label="Sort search results" title="Sort search results" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'relevance' | 'popular' | 'alphabetical')} className="icon-search-select">
          <option value="alphabetical">Sort: A → Z</option>
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
            return (
              <IconCard
                key={icon.id}
                icon={icon}
                color={color}
                isSelected={selectedIcon?.id === icon.id}
                onSelect={() => setSelectedIcon(icon)}
              />
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

            {/* Visual Style Presets Panel (Phase 3 Upgrade) */}
            <div style={{ marginBottom: '12px', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', background: 'var(--bg-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Style Preset</label>
                <button 
                  onClick={() => {
                    setCreatePresetName('')
                    setIsCreatePresetOpen(true)
                  }}
                  className="icon-search-btn icon-search-btn-small"
                  style={{ fontSize: '9px', padding: '2px 6px' }}
                  title="Save current styles as custom preset"
                >
                  Save Preset
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <select 
                  aria-label="Style preset select picker"
                  value={selectedPresetId} 
                  onChange={(e) => applyStylePreset(e.target.value)} 
                  className="icon-search-select"
                  style={{ width: '100%', fontSize: '11px', padding: '4px 6px' }}
                >
                  <option value="none">No Preset (Custom Styles)</option>
                  {presets.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.size}px, {p.stroke}px)</option>
                  ))}
                </select>
                {selectedPresetId !== 'none' && cart.length > 0 && (
                  <button 
                    onClick={() => applyPresetToAllCart(selectedPresetId)}
                    className="icon-search-btn icon-search-btn-small"
                    style={{ width: '100%', fontSize: '9px', padding: '4px', background: 'var(--accent-dim)', color: 'var(--accent)', borderColor: 'var(--border)' }}
                  >
                    Apply Preset to All Icons in Cart
                  </button>
                )}
              </div>
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
        {/* Workspace Pack Manager dropdown (Phase 3 Upgrade) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>// ACTIVE WORKSPACE PACK</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                onClick={() => {
                  const pack = packs.find(p => p.id === activePackId)
                  if (pack) {
                    setRenamePackName(pack.name)
                    setIsRenamePackOpen(true)
                  }
                }} 
                className="icon-search-btn icon-search-btn-small" 
                title="Rename active pack"
                style={{ padding: '2px 6px', fontSize: '10px' }}
              >
                ✏️
              </button>
              <button 
                onClick={() => {
                  setCreatePackName('')
                  setIsCreatePackOpen(true)
                }} 
                className="icon-search-btn icon-search-btn-small" 
                title="Create new pack"
                style={{ padding: '2px 6px', fontSize: '10px' }}
              >
                ➕
              </button>
              {packs.length > 1 && (
                <button 
                  onClick={handleDeleteActivePack} 
                  className="icon-search-btn icon-search-btn-small" 
                  title="Delete active pack"
                  style={{ padding: '2px 6px', fontSize: '10px', color: 'var(--red)' }}
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
          <select 
            aria-label="Active workspace pack selection selector"
            value={activePackId} 
            onChange={(e) => handleSwitchPack(e.target.value)} 
            className="icon-search-select" 
            style={{ width: '100%', fontSize: '12px', padding: '6px 8px' }}
          >
            {packs.map((pack) => (
              <option key={pack.id} value={pack.id}>{pack.name} ({pack.items.length})</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 800 }}>Workspace Cart ({cart.length})</h4>
          {cart.length > 0 && (
            <button onClick={copyCartExport} className="icon-search-btn icon-search-btn-small" style={{ fontSize: '10px' }}>
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
          )}
        </div>

        
        {cart.length > 0 && (
          <button 
            onClick={() => setIsExportModalOpen(true)} 
            className="icon-search-btn"
            style={{ 
              width: '100%', 
              marginBottom: '12px', 
              background: 'var(--accent)', 
              borderColor: 'var(--accent)', 
              color: '#fff',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            📦 Export Pack ({cart.length})
          </button>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '4px', marginBottom: '12px' }}>
          <button onClick={() => exportCart('json')} className="icon-search-btn icon-search-btn-small" style={{ fontSize: '9px', padding: '4px 2px' }}>JSON</button>
          <button onClick={() => exportCart('react')} className="icon-search-btn icon-search-btn-small" style={{ fontSize: '9px', padding: '4px 2px', position: 'relative' }}>
            React
          </button>
          <button onClick={() => exportCart('vue')} className="icon-search-btn icon-search-btn-small" style={{ fontSize: '9px', padding: '4px 2px', position: 'relative' }}>
            Vue
          </button>
          <button onClick={() => exportCart('tailwind')} className="icon-search-btn icon-search-btn-small" style={{ fontSize: '9px', padding: '4px 2px', position: 'relative' }}>
            Tailwind
          </button>
          <button onClick={() => exportCart('csv')} className="icon-search-btn icon-search-btn-small" style={{ fontSize: '9px', padding: '4px 2px' }}>CSV</button>
          {cart.length > 0 && (
            <button onClick={handleClearActivePack} className="icon-search-btn icon-search-btn-small" style={{ fontSize: '9px', padding: '4px 2px', color: 'var(--red)' }} title="Clear current pack items">Clear All</button>
          )}
        </div>

        {exportNotice ? (
          <p style={{ color: 'var(--green)', fontSize: '10px', marginBottom: '10px', fontFamily: 'JetBrains Mono, monospace' }}>{exportNotice}</p>
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

      {/* Workspace Dialog Modals (Phase 3 Upgrade) */}
      {isCreatePackOpen && (
        <>
          <div onClick={() => setIsCreatePackOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '320px', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '18px', zIndex: 301, display: 'flex', flexDirection: 'column', gap: '12px'
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800 }}>Create New Icon Pack</h4>
            <input 
              type="text" 
              placeholder="e.g. Dashboard Icons" 
              value={createPackName} 
              onChange={(e) => setCreatePackName(e.target.value)}
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 10px', color: 'var(--text)', fontSize: '13px', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={handleCreatePack} className="icon-search-btn icon-search-btn-small" style={{ background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }}>Create</button>
              <button onClick={() => setIsCreatePackOpen(false)} className="icon-search-btn icon-search-btn-small">Cancel</button>
            </div>
          </div>
        </>
      )}

      {isRenamePackOpen && (
        <>
          <div onClick={() => setIsRenamePackOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '320px', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '18px', zIndex: 301, display: 'flex', flexDirection: 'column', gap: '12px'
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800 }}>Rename Icon Pack</h4>
            <input 
              type="text" 
              value={renamePackName} 
              onChange={(e) => setRenamePackName(e.target.value)}
              placeholder="Enter pack name"
              aria-label="Rename icon pack"
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 10px', color: 'var(--text)', fontSize: '13px', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={handleRenamePack} className="icon-search-btn icon-search-btn-small" style={{ background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }}>Rename</button>
              <button onClick={() => setIsRenamePackOpen(false)} className="icon-search-btn icon-search-btn-small">Cancel</button>
            </div>
          </div>
        </>
      )}

      {isCreatePresetOpen && (
        <>
          <div onClick={() => setIsCreatePresetOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '320px', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '18px', zIndex: 301, display: 'flex', flexDirection: 'column', gap: '12px'
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800 }}>Save Preset Style</h4>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Size: {customSize}px | Stroke: {customStroke.toFixed(1)}px | Color: {customColor}
            </div>
            <input 
              type="text" 
              placeholder="e.g. SaaS Brand Primary" 
              value={createPresetName} 
              onChange={(e) => setCreatePresetName(e.target.value)}
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 10px', color: 'var(--text)', fontSize: '13px', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  const name = createPresetName.trim() || `Preset #${presets.length + 1}`
                  const id = `preset-${Date.now()}`
                  const newPreset = { id, name, size: customSize, stroke: customStroke, color: customColor }
                  setPresets(prev => [...prev, newPreset])
                  setSelectedPresetId(id)
                  setIsCreatePresetOpen(false)
                }} 
                className="icon-search-btn icon-search-btn-small" 
                style={{ background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }}
              >
                Save
              </button>
              <button onClick={() => setIsCreatePresetOpen(false)} className="icon-search-btn icon-search-btn-small">Cancel</button>
            </div>
          </div>
        </>
      )}

      {/* Export Workspace Package Modal (Phase 2 Upgrade) */}
      {isExportModalOpen && (
        <>
          <div 
            onClick={() => !isExporting && setIsExportModalOpen(false)} 
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(0,0,0,0.75)', 
              backdropFilter: 'blur(4px)',
              zIndex: 200 
            }} 
          />
          
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '580px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'rgba(18, 18, 21, 0.96)',
            border: '1px solid var(--border)',
            borderRadius: '18px',
            padding: '24px',
            zIndex: 201,
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📦</span> Export Workspace Package
              </h3>
              <button 
                onClick={() => setIsExportModalOpen(false)} 
                disabled={isExporting}
                className="icon-search-btn icon-search-btn-small icon-search-close-btn"
              >
                ✕
              </button>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontFamily: 'JetBrains Mono, monospace' }}>
                // PACKAGE FILE NAME
              </label>
              <input 
                type="text" 
                placeholder="icon-hub-package" 
                value={exportPackageName}
                onChange={(e) => setExportPackageName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                style={{
                  width: '100%',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'var(--text)',
                  fontSize: '14px',
                  outline: 'none'
                }}
                disabled={isExporting}
              />
            </div>

            <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', background: 'var(--bg-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700 }}>Cohesive Presets Overrides</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Force all icons in package to use a uniform preset</p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={exportUsePreset} 
                    onChange={(e) => setExportUsePreset(e.target.checked)}
                    disabled={isExporting}
                  />
                  <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>Enable</span>
                </label>
              </div>

              {exportUsePreset && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Preset Size</span>
                      <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>{exportPresetSize}px</span>
                    </div>
                    <input 
                      type="range" 
                      aria-label="Preset size range selector"
                      min={16} 
                      max={96} 
                      value={exportPresetSize}
                      onChange={(e) => setExportPresetSize(Number(e.target.value))}
                      className="icon-search-slider"
                      disabled={isExporting}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Preset Stroke</span>
                      <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>{exportPresetStroke.toFixed(1)}px</span>
                    </div>
                    <input 
                      type="range" 
                      aria-label="Preset stroke range selector"
                      min={0.5} 
                      max={3} 
                      step={0.1}
                      value={exportPresetStroke}
                      onChange={(e) => setExportPresetStroke(Number(e.target.value))}
                      className="icon-search-slider"
                      disabled={isExporting}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Preset Color:</span>
                    <input 
                      type="color" 
                      aria-label="Preset color selection picker"
                      value={exportPresetColor} 
                      onChange={(e) => setExportPresetColor(e.target.value)}
                      disabled={isExporting}
                    />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{exportPresetColor}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
                // SELECT EXPORT FORMATS
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
                {[
                  { id: 'svg', label: 'Optimized SVGs (.svg)' },
                  { id: 'react', label: 'React Elements (.tsx)' },
                  { id: 'vue', label: 'Vue Components (.vue)' },
                  { id: 'tailwind', label: 'Tailwind / HTML embeds' },
                  { id: 'sprite', label: 'SVG Sprite Sheet (sprite.svg)' },
                  { id: 'png', label: 'PNG Images (.png)' },
                ].map((f) => (
                  <label 
                    key={f.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      background: 'var(--bg-card)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '8px', 
                      padding: '10px', 
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={exportFormats[f.id as keyof typeof exportFormats]} 
                      onChange={(e) => setExportFormats(prev => ({ ...prev, [f.id]: e.target.checked }))}
                      disabled={isExporting}
                    />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>

            {exportFormats.png && (
              <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', background: 'var(--bg-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700 }}>PNG Scale Multiplier</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Multiply standard size for high DPI (e.g. Retina @2x)</p>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace' }}>
                    @{exportPngScale}x
                  </span>
                </div>
                <input 
                  type="range" 
                  aria-label="PNG scale multiplier selector"
                  min={1} 
                  max={4} 
                  step={1}
                  value={exportPngScale}
                  onChange={(e) => setExportPngScale(Number(e.target.value))}
                  className="icon-search-slider"
                  disabled={isExporting}
                />
              </div>
            )}

            {isExporting && (
              <div style={{
                background: 'rgba(129,140,248,0.06)',
                border: '1px solid rgba(129,140,248,0.2)',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(129,140,248,0.2)',
                  borderTopColor: 'var(--accent)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }} />
                <span style={{ fontSize: '13px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {exportStatus}
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                onClick={handleStartExport}
                disabled={isExporting || Object.values(exportFormats).every(v => !v)}
                className="icon-search-btn"
                style={{ 
                  flex: 1, 
                  background: 'var(--accent)', 
                  color: '#fff', 
                  borderColor: 'var(--accent)', 
                  fontWeight: 'bold',
                  padding: '12px' 
                }}
              >
                {isExporting ? 'Packaging Workspace...' : 'Download ZIP Archive'}
              </button>
              <button 
                onClick={() => setIsExportModalOpen(false)}
                disabled={isExporting}
                className="icon-search-btn"
                style={{ padding: '12px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* Phase 5: Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

    </main>
  )
}