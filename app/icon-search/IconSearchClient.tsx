'use client'

import { useEffect, useMemo, useRef, useState, useCallback, memo } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Subscription, User } from '@supabase/supabase-js'
import { generateZipPackage, customizeSvg, type FrameShape, type ExportOptions } from '../../lib/exporter'
import { ICON_PREVIEW_CACHE_VERSION, getBestIconPreviewUrl, getCleanSvgUrl, getIconPreviewCandidates } from '../../lib/icon-preview'
import { createClient, isSupabaseConfigured } from '@/lib/supabase'
import { trackSearch, trackAddToCart, trackCartImport, trackExport } from '@/lib/analytics'
import dynamic from 'next/dynamic'
import LibraryFilter from '../components/LibraryFilter'
import { namedLibraries } from '../../data/library-catalog'

const AuthModal = dynamic(() => import('../components/AuthModal'), { ssr: false })
const UniversalExporterModal = dynamic(() => import('../components/UniversalExporterModal'), { ssr: false })
const MultiFacetFilterBar = dynamic(() => import('../components/MultiFacetFilterBar'), { ssr: false })


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

type WorkspacePack = {
  id: string
  name: string
  items: CartItem[]
  createdAt: string
}

type StylePreset = {
  id: string
  name: string
  size: number
  stroke: number
  color: string
}

type CloudPackRow = {
  id: string
  name: string
  items: CartItem[] | null
  created_at: string
}

type CloudPresetRow = {
  id: string
  name: string
  size: number
  stroke: number | string
  color: string
}

const LIBRARY_COLORS: Record<string, string> = {
  'lucide-icons': '#7c6af7',
  'heroicons': '#06b6d4',
  'tabler-icons': '#10b981',
  'patternfly-icons': '#06b6d4',
  'untitled-ui-icons': '#7dd3fc',
  'phosphor-icons': '#f59e0b',
  'radix-icons': '#ec4899',
  'bootstrap-icons': '#7952b3',
  'feather-icons': '#3b82f6',
  'iconoir': '#e88c30',
  'ant-design-icons': '#1890ff',
}

const TAILWIND_PALETTES = [
  { name: 'Current', color: 'currentColor' },
  { name: 'Slate', color: '#64748b' },
  { name: 'Red', color: '#ef4444' },
  { name: 'Emerald', color: '#10b981' },
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Violet', color: '#8b5cf6' },
  { name: 'Amber', color: '#f59e0b' },
  { name: 'Rose', color: '#f43f5e' },
  { name: 'Neutral', color: '#737373' },
]

const BRAND_PALETTES = [
  { name: 'Discord', color: '#5865f2' },
  { name: 'Twitter/X', color: '#1da1f2' },
  { name: 'GitHub', color: '#f0f6fc' },
  { name: 'React', color: '#61dafb' },
  { name: 'Figma', color: '#f24e1e' },
]

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
    styles?: Record<string, number>
    colorModels?: Record<string, number>
    licenseCounts?: Record<string, number>
    sourceTypes?: Record<string, number>
  }
}

async function readJsonResponse<T>(response: Response, label: string): Promise<T> {
  const text = await response.text()

  if (!response.ok) {
    const detail = text.trim().slice(0, 180)
    throw new Error(`${label} returned ${response.status}${detail ? `: ${detail}` : ''}`)
  }

  if (!text.trim()) {
    throw new Error(`${label} returned an empty response`)
  }

  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(`${label} returned invalid JSON`)
  }
}

type SortOption = 'relevance' | 'popular' | 'alphabetical'

type SearchParamReader = {
  get(name: string): string | null
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function readSearchState(params: SearchParamReader | null) {
  const query = (params?.get('q') || '').trim()
  const rawLib = params?.get('lib') || 'all'
  const rawIconifySet = params?.get('iconifySet') || 'all'
  const rawCategory = params?.get('category') || 'all'
  const rawStyle = params?.get('style') || 'all'
  const rawColorModel = params?.get('colorModel') || 'all'
  const rawLicense = params?.get('license') || 'all'
  const rawSourceType = (params?.get('sourceType') || 'all') as 'all' | 'curated' | 'iconify'
  const rawSort = params?.get('sort') as SortOption | null
  const page = Math.max(1, Number(params?.get('page') || '1') || 1)

  let selectedLib = 'all'
  let selectedIconifySet = 'all'

  if (rawLib === 'iconify') {
    selectedLib = 'iconify'
    selectedIconifySet = rawIconifySet || 'all'
  } else if (rawLib.startsWith('iconify:')) {
    selectedLib = 'iconify'
    selectedIconifySet = rawLib.replace('iconify:', '') || 'all'
  } else if (rawLib.startsWith('iconify-')) {
    selectedLib = 'iconify'
    selectedIconifySet = rawLib.replace(/^iconify-/, '') || 'all'
  } else if (rawLib) {
    selectedLib = rawLib
  }

  const validCategory = CATEGORIES.some((cat) => cat.id === rawCategory) ? rawCategory : 'all'
  const validStyle = ['all', 'stroke', 'solid', 'duotone', 'twotone', 'sharp'].includes(rawStyle) ? rawStyle : 'all'
  const validColorModel = ['all', 'mono', 'multicolor'].includes(rawColorModel) ? rawColorModel : 'all'
  const validSourceType = ['all', 'curated', 'iconify'].includes(rawSourceType) ? rawSourceType : 'all'
  const sortBy: SortOption = ['relevance', 'popular', 'alphabetical'].includes(rawSort || '')
    ? rawSort!
    : query
      ? 'relevance'
      : 'popular'

  return {
    query,
    selectedLib,
    selectedIconifySet,
    selectedCategory: validCategory,
    selectedStyle: validStyle,
    selectedColorModel: validColorModel,
    selectedLicense: rawLicense,
    selectedSourceType: validSourceType,
    sortBy,
    legalOnly: params?.get('legalOnly') !== '0',
    currentPage: page,
    hasExplicitSort: Boolean(rawSort),
  }
}

const workingUrlCache = new Map<string, string>()

const IconCard = memo(({
  icon,
  color,
  onSelect,
  onExport,
}: {
  icon: Icon
  color: string
  onSelect: (icon: Icon) => void
  onExport?: (icon: Icon) => void
}) => {
  const [fallbackIndex, setFallbackIndex] = useState(0)
  const [failed, setFailed] = useState(false)

  const candidates = useMemo(() => getIconPreviewCandidates(icon), [icon])
  const previewCacheKey = `${ICON_PREVIEW_CACHE_VERSION}:${icon.id}`
  const candidateSignature = candidates.join('|')

  const src = useMemo(() => {
    if (workingUrlCache.has(previewCacheKey)) {
      return workingUrlCache.get(previewCacheKey)!
    }
    return candidates[fallbackIndex] || getCleanSvgUrl(icon.svgUrl, icon.library)
  }, [previewCacheKey, candidates, fallbackIndex, icon.svgUrl, icon.library])

  const onError = useCallback(() => {
    if (workingUrlCache.has(previewCacheKey)) {
      workingUrlCache.delete(previewCacheKey)
      setFallbackIndex(0)
      return
    }

    if (fallbackIndex < candidates.length - 1) {
      setFallbackIndex((prev) => prev + 1)
    } else {
      setFailed(true)
    }
  }, [fallbackIndex, candidates.length, previewCacheKey])

  // Reset local state if icon changes
  useEffect(() => {
    // This component intentionally resets its local fallback state when the rendered icon identity changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFallbackIndex(0)
    setFailed(false)
  }, [icon.id, icon.svgUrl, candidateSignature])

  const handleLoad = useCallback(() => {
    if (!failed && src) {
      workingUrlCache.set(previewCacheKey, src)
    }
  }, [previewCacheKey, src, failed])

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Customize ${icon.displayName || icon.name}`}
      onClick={() => onSelect(icon)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(icon)
        }
      }}
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
        color: 'inherit',
        font: 'inherit',
        transition: 'all 0.16s ease',
        position: 'relative',
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
            title={`${icon.name} from ${icon.libraryName}`}
            width={25}
            height={25}
            loading="lazy"
            decoding="async"
            style={{ filter: 'invert(1) brightness(0.95)', opacity: 0.9 }}
            onError={onError}
            onLoad={handleLoad}
          />
        )}
      </div>

      {/* Top right quick open button (+) */}
      <button
        type="button"
        aria-label={`Open and customize ${icon.name}`}
        title="Open and customize icon"
        onClick={(e) => {
          e.stopPropagation()
          onSelect(icon)
        }}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '22px',
          height: '22px',
          borderRadius: '6px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          lineHeight: 1,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--accent)'
          e.currentTarget.style.borderColor = 'var(--accent)'
          e.currentTarget.style.color = '#ffffff'
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.color = 'var(--text-muted)'
          e.currentTarget.style.transform = 'none'
        }}
      >
        +
      </button>

      <div style={{ textAlign: 'center', width: '100%' }}>
        <div style={{ color: 'var(--text)', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{icon.name}</div>
        <div style={{ color, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {icon.libraryName}
        </div>
      </div>
    </div>
  )
})
IconCard.displayName = 'IconCard'

export default function IconSearchClient({ initialData }: { initialData?: ApiResponse }) {
  const searchParams = useSearchParams()
  const initialSearchState = readSearchState(searchParams)
  const [query, setQuery] = useState(initialSearchState.query)
  const [selectedLib, setSelectedLib] = useState(initialSearchState.selectedLib)
  const [selectedIconifySet, setSelectedIconifySet] = useState(initialSearchState.selectedIconifySet)
  const [selectedCategory, setSelectedCategory] = useState(initialSearchState.selectedCategory)
  const [selectedStyle, setSelectedStyle] = useState(initialSearchState.selectedStyle)
  const [selectedColorModel, setSelectedColorModel] = useState(initialSearchState.selectedColorModel)
  const [selectedLicense, setSelectedLicense] = useState(initialSearchState.selectedLicense)
  const [selectedSourceType, setSelectedSourceType] = useState<'all' | 'curated' | 'iconify'>(initialSearchState.selectedSourceType)
  const [sortBy, setSortBy] = useState<SortOption>(initialSearchState.sortBy)
  const [sortTouched, setSortTouched] = useState(initialSearchState.hasExplicitSort)
  const [legalOnly, setLegalOnly] = useState(initialSearchState.legalOnly)
  const [currentPage, setCurrentPage] = useState(initialSearchState.currentPage)
  const [loading, setLoading] = useState(!initialData)
  const [results, setResults] = useState<ApiResponse>(initialData || { icons: [], total: 0, page: 1, limit: 80, totalPages: 1 })
  const [catalog, setCatalog] = useState({
    libraries: namedLibraries.map((library) => library.id),
    iconifySets: initialData?.facets?.iconifySets || [],
  })
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null)
  const [svgContent, setSvgContent] = useState('')
  const [customSize, setCustomSize] = useState(32)
  const [customStroke, setCustomStroke] = useState(1.5)
  const [customColor, setCustomColor] = useState('#818cf8')
  const [customPadding, setCustomPadding] = useState(0)
  const [customFrameShape, setCustomFrameShape] = useState<FrameShape>('none')
  const [customFrameColor, setCustomFrameColor] = useState('rgba(129, 140, 248, 0.15)')
  const [customFrameStroke, setCustomFrameStroke] = useState('rgba(129, 140, 248, 0.3)')
  const [customSecondaryOpacity, setCustomSecondaryOpacity] = useState(0.3)
  const [isUniversalModalOpen, setIsUniversalModalOpen] = useState(false)
  const [universalModalIcon, setUniversalModalIcon] = useState<Icon | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const lastSearchParamStringRef = useRef(searchParams?.toString() || '')
  const lastQueryRef = useRef(query)

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
  const [packs, setPacks] = useState<WorkspacePack[]>([
    { id: 'default', name: 'Dashboard Pack', items: [], createdAt: new Date().toISOString() }
  ])
  const [activePackId, setActivePackId] = useState('default')
  const [isRenamePackOpen, setIsRenamePackOpen] = useState(false)
  const [renamePackName, setRenamePackName] = useState('')
  const [isCreatePackOpen, setIsCreatePackOpen] = useState(false)
  const [createPackName, setCreatePackName] = useState('')

  // Style Presets Upgrades (Phase 3)
  const [presets, setPresets] = useState<StylePreset[]>([
    { id: 'default', name: 'Lucide Outline Default', size: 32, stroke: 1.5, color: '#818cf8' },
    { id: 'dense', name: 'Dense UI Outline (16px)', size: 16, stroke: 1.0, color: '#3b82f6' },
    { id: 'bold', name: 'Bold High-Contrast (48px)', size: 48, stroke: 2.2, color: '#ec4899' },
  ])
  const [selectedPresetId, setSelectedPresetId] = useState('none')
  const [isCreatePresetOpen, setIsCreatePresetOpen] = useState(false)
  const [createPresetName, setCreatePresetName] = useState('')

  // Phase 5: Auth, Cloud Sync & Plan Gating
  const [user, setUser] = useState<User | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [cloudSyncStatus, setCloudSyncStatus] = useState('')
  // Cloud sync helper: push packs to Supabase
  const syncPacksToCloud = useCallback(async (packsData: WorkspacePack[]) => {
    if (!user || !isSupabaseConfigured()) return
    const supabase = await createClient()
    if (!supabase) return
    try {
      // Ensure user-scoped pack IDs so primary key 'id' in Supabase never conflicts across users
      const updatedLocalPacks: WorkspacePack[] = []
      let packsNeedUpdate = false

      for (const pack of packsData) {
        const cloudId = pack.id.startsWith(`${user.id}_`)
          ? pack.id
          : `${user.id}_${pack.id}`

        if (cloudId !== pack.id) {
          packsNeedUpdate = true
        }
        updatedLocalPacks.push({ ...pack, id: cloudId })

        const { error } = await supabase
          .from('packs')
          .upsert({
            id: cloudId,
            user_id: user.id,
            name: pack.name,
            items: pack.items,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' })
        if (error) {
          console.warn('Pack sync error:', error.message)
          setCloudSyncStatus('Sync warning: ' + error.message)
        }
      }

      if (packsNeedUpdate) {
        setPacks(updatedLocalPacks)
        setActivePackId((prev) => (prev === 'default' ? `${user.id}_default` : prev))
      }
    } catch (e) {
      console.warn('Cloud sync failed (packs):', e)
      setCloudSyncStatus('Cloud sync offline')
    }
  }, [user])

  // Cloud sync helper: push presets to Supabase
  const syncPresetsToCloud = useCallback(async (presetsData: StylePreset[]) => {
    if (!user || !isSupabaseConfigured()) return
    const supabase = await createClient()
    if (!supabase) return
    try {
      const updatedLocalPresets: StylePreset[] = []
      let presetsNeedUpdate = false

      for (const preset of presetsData) {
        const cloudId = preset.id.startsWith(`${user.id}_`)
          ? preset.id
          : `${user.id}_${preset.id}`

        if (cloudId !== preset.id) {
          presetsNeedUpdate = true
        }
        updatedLocalPresets.push({ ...preset, id: cloudId })

        const { error } = await supabase
          .from('presets')
          .upsert({
            id: cloudId,
            user_id: user.id,
            name: preset.name,
            size: preset.size,
            stroke: preset.stroke,
            color: preset.color,
          }, { onConflict: 'id' })
        if (error) console.warn('Preset sync error:', error.message)
      }

      if (presetsNeedUpdate) {
        setPresets(updatedLocalPresets)
      }
    } catch (e) {
      console.warn('Cloud sync failed (presets):', e)
    }
  }, [user])

  // Fetch cloud data on login
  const fetchCloudData = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured()) return
    const supabase = await createClient()
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
        const merged = (cloudPacks as CloudPackRow[]).map((p) => ({
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
        const mapped = (cloudPresets as CloudPresetRow[]).map((p) => ({
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
    let subscription: Subscription | null = null

    async function initAuth() {
      const supabase = await createClient()
      if (!supabase) return

      // Check existing session
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        fetchCloudData(session.user.id)
      }

      // Listen for auth state changes
      const { data } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) {
            setUser(session.user)
            fetchCloudData(session.user.id)
          } else {
            setUser(null)
          }
        }
      )
      subscription = data.subscription
    }

    initAuth()

    return () => subscription?.unsubscribe()
  }, [fetchCloudData])

  // Handle sign out
  async function handleSignOut() {
    if (!isSupabaseConfigured()) return
    const supabase = await createClient()  // 👈 add await here
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setCloudSyncStatus('')
  }

  function handleAuthSuccess(authUser: User) {
    setUser(authUser)
    fetchCloudData(authUser.id)
  }

  async function handleStartExport() {
    if (cart.length === 0) return

    if (!user) {
      setIsExportModalOpen(false)
      setIsAuthModalOpen(true)
      return
    }

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

      // Track ZIP export (fire-and-forget)
      const libSet = [...new Set(cart.map(i => i.icon.library))].join(',')
      const names = cart.map(i => i.icon.name).join(',')
      trackExport({
        format: 'zip',
        iconCount: cart.length,
        libraries: libSet,
        iconNames: names,
      })
    } catch (e) {
      console.error('Failed to generate package', e)
      setExportStatus('Failed to generate package. Try again.')
    } finally {
      setIsExporting(false)
    }
  }

  // Packs & Workspace helper handlers (Phase 3)
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
  }

  function handleQueryChange(value: string) {
    setQuery(value)
    setCurrentPage(1)
    if (!sortTouched) {
      setSortBy(value.trim() ? 'relevance' : 'popular')
    }
  }

  function handleLibraryChange(value: string) {
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
    setCurrentPage(1)
  }

  function handleSortChange(value: SortOption) {
    setSortTouched(true)
    setSortBy(value)
    setCurrentPage(1)
  }

  function handleCategoryChange(value: string) {
    setSelectedCategory(value)
    setCurrentPage(1)
  }

  function handleStyleChange(value: string) {
    setSelectedStyle(value)
    setCurrentPage(1)
  }

  function handleColorModelChange(value: string) {
    setSelectedColorModel(value)
    setCurrentPage(1)
  }

  function handleLicenseChange(value: string) {
    setSelectedLicense(value)
    setCurrentPage(1)
  }

  function handleSourceTypeChange(value: 'all' | 'curated' | 'iconify') {
    setSelectedSourceType(value)
    if (value === 'curated' && selectedLib.startsWith('iconify-')) {
      setSelectedLib('all')
      setSelectedIconifySet('all')
    }
    setCurrentPage(1)
  }

  function handleLegalOnlyChange(value: boolean) {
    setLegalOnly(value)
    setCurrentPage(1)
  }

  function handleResetFilters() {
    setSelectedSourceType('all')
    setSelectedLib('all')
    setSelectedIconifySet('all')
    setSelectedCategory('all')
    setSelectedStyle('all')
    setSelectedColorModel('all')
    setSelectedLicense('all')
    setLegalOnly(true)
    setCurrentPage(1)
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
    const controller = new AbortController()

    fetch('/api/icon-search?limit=1&legalOnly=0', { signal: controller.signal })
      .then((response) => readJsonResponse<ApiResponse>(response, 'Catalog'))
      .then((data) => {
        const libraries = Array.isArray(data?.facets?.libraries)
          ? data.facets.libraries.filter((library: unknown): library is string => typeof library === 'string' && !library.startsWith('iconify-'))
          : namedLibraries.map((library) => library.id)
        const iconifySets = Array.isArray(data?.facets?.iconifySets)
          ? data.facets.iconifySets.filter((set: unknown): set is string => typeof set === 'string')
          : []

        setCatalog({ libraries, iconifySets })
      })
      .catch((error) => {
        if ((error as Error).name !== 'AbortError') {
          console.error('Could not load full library catalog', error)
        }
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const fetchResults = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          q: query,
          lib: selectedLib,
          iconifySet: selectedIconifySet,
          category: selectedCategory,
          style: selectedStyle,
          colorModel: selectedColorModel,
          license: selectedLicense,
          sourceType: selectedSourceType,
          legalOnly: legalOnly ? '1' : '0',
          page: String(currentPage),
          limit: '80',
          sort: sortBy,
        })
        const res = await fetch(`/api/icons?${params.toString()}`, { signal: controller.signal })
        const data = await readJsonResponse<ApiResponse>(res, 'API search')
        const icons: Icon[] = Array.isArray(data?.icons) ? data.icons : []
        setResults({ ...data, icons })

        // Track search analytics (fire-and-forget)
        if (query.trim()) {
          trackSearch({
            query,
            library: selectedLib,
            category: selectedCategory,
            style: selectedStyle,
            sort: sortBy,
            legalOnly: legalOnly,
            resultCount: data?.total ?? icons.length,
          })
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('API search failed', error)
        }
      } finally {
        setLoading(false)
      }
    }

    let timer: NodeJS.Timeout | null = null
    if (query !== lastQueryRef.current) {
      lastQueryRef.current = query
      timer = setTimeout(fetchResults, 180)
    } else {
      fetchResults()
    }

    return () => {
      controller.abort()
      if (timer) clearTimeout(timer)
    }
  }, [query, selectedLib, selectedIconifySet, selectedCategory, selectedStyle, selectedColorModel, selectedLicense, selectedSourceType, currentPage, sortBy, legalOnly])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)

    if (query.trim()) url.searchParams.set('q', query.trim())
    else url.searchParams.delete('q')

    if (selectedLib === 'all') {
      url.searchParams.delete('lib')
      url.searchParams.delete('iconifySet')
    } else if (selectedLib === 'iconify') {
      url.searchParams.set('lib', 'iconify')
      if (selectedIconifySet !== 'all') url.searchParams.set('iconifySet', selectedIconifySet)
      else url.searchParams.delete('iconifySet')
    } else {
      url.searchParams.set('lib', selectedLib)
      url.searchParams.delete('iconifySet')
    }

    if (selectedSourceType !== 'all') url.searchParams.set('sourceType', selectedSourceType)
    else url.searchParams.delete('sourceType')

    if (selectedCategory !== 'all') url.searchParams.set('category', selectedCategory)
    else url.searchParams.delete('category')

    if (selectedStyle !== 'all') url.searchParams.set('style', selectedStyle)
    else url.searchParams.delete('style')

    if (selectedColorModel !== 'all') url.searchParams.set('colorModel', selectedColorModel)
    else url.searchParams.delete('colorModel')

    if (selectedLicense !== 'all') url.searchParams.set('license', selectedLicense)
    else url.searchParams.delete('license')

    if (!legalOnly) url.searchParams.set('legalOnly', '0')
    else url.searchParams.delete('legalOnly')

    const defaultSort = query.trim() ? 'relevance' : 'popular'
    if (sortBy !== defaultSort) url.searchParams.set('sort', sortBy)
    else url.searchParams.delete('sort')

    if (currentPage > 1) url.searchParams.set('page', String(currentPage))
    else url.searchParams.delete('page')

    const nextSearch = url.searchParams.toString()
    lastSearchParamStringRef.current = nextSearch
    window.history.replaceState({}, '', url.toString())
  }, [query, selectedLib, selectedIconifySet, selectedCategory, selectedStyle, selectedColorModel, selectedLicense, selectedSourceType, sortBy, legalOnly, currentPage])

  // Load packs, presets, and check URL params on startup (Phase 3)
  useEffect(() => {
    try {
      const rawPacks = localStorage.getItem('icon-hub-workspace-packs')
      const rawActiveId = localStorage.getItem('icon-hub-workspace-active-pack')
      const rawPresets = localStorage.getItem('icon-hub-style-presets')

      let initialPacks: WorkspacePack[] = [
        { id: 'default', name: 'Dashboard Pack', items: [], createdAt: new Date().toISOString() }
      ]
      let activeId = 'default'

      if (rawPacks) {
        const parsed = JSON.parse(rawPacks)
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialPacks = parsed as WorkspacePack[]
          activeId = rawActiveId || parsed[0].id
        }
      }

      // Workspace state is hydrated from browser storage after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
          fetch(`/api/icons?ids=${ids}&limit=100`)
            .then(res => readJsonResponse<ApiResponse>(res, 'Cart restore'))
            .then(data => {
              const fetchedIcons = data.icons || []
              const cartItems: CartItem[] = parsedItems.map(p => {
                const matchedIcon = fetchedIcons.find((i) => i.id === p.id)
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
                trackCartImport({
                  source: 'shared_url',
                  iconCount: cartItems.length,
                  libraries: [...new Set(cartItems.map(item => item.icon.library))].join(','),
                })
              }
              setIsLoaded(true)
            })
            .catch(e => {
              console.error('Failed to restore cart from URL', e)
              setIsLoaded(true)
            })
            .finally(() => setLoading(false))
        } else {
          setIsLoaded(true)
        }
      } else {
        // No URL params, load active pack's items
        const activePack = initialPacks.find((p) => p.id === activeId)
        if (activePack) setCart(activePack.items)
        setIsLoaded(true)
      }
    } catch (e) {
      console.error('Failed to initialize workspace data', e)
      setIsLoaded(true)
    }
  }, [])

  // Persist packs, active pack, and presets to local storage + cloud
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('icon-hub-workspace-packs', JSON.stringify(packs))
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { source: 'icon-search' } }))
  }, [packs, isLoaded])

  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('icon-hub-workspace-active-pack', activePackId)
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { source: 'icon-search' } }))
  }, [activePackId, isLoaded])

  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('icon-hub-style-presets', JSON.stringify(presets))
  }, [presets, isLoaded])

  // Sync workspace states back when changed externally (from global CartDrawer or detail page)
  useEffect(() => {
    const handleCartUpdate = (event: Event) => {
      if (event instanceof CustomEvent && event.detail?.source === 'icon-search') return

      try {
        const rawPacks = localStorage.getItem('icon-hub-workspace-packs')
        const rawActiveId = localStorage.getItem('icon-hub-workspace-active-pack')

        let currentPacks: WorkspacePack[] = [
          { id: 'default', name: 'Dashboard Pack', items: [], createdAt: new Date().toISOString() }
        ]
        let activeId = 'default'

        if (rawPacks) {
          const parsed = JSON.parse(rawPacks)
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentPacks = parsed as WorkspacePack[]
            activeId = rawActiveId || parsed[0].id
          }
        }

        setPacks(currentPacks)
        setActivePackId(activeId)

        const activePack = currentPacks.find((p) => p.id === activeId)
        if (activePack) {
          setCart(activePack.items)
        }
      } catch (e) {
        console.error('Failed to sync workspace states', e)
      }
    }

    window.addEventListener('cart-updated', handleCartUpdate)
    window.addEventListener('storage', handleCartUpdate)
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate)
      window.removeEventListener('storage', handleCartUpdate)
    }
  }, [])

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
    // The active workspace pack mirrors the cart state for persistence and cross-page sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPacks((prev) => {
      let changed = false
      const next = prev.map((pack) => {
        if (pack.id !== activePackId || pack.items === cart) return pack
        changed = true
        return { ...pack, items: cart }
      })

      return changed ? next : prev
    })
  }, [cart, activePackId])


  useEffect(() => {
    if (!selectedIcon) return
    // Style controls reset whenever the selected icon changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCustomSize(32)
    setCustomStroke(1.5)
    setCustomColor('#818cf8')
    setCustomPadding(0)
    setCustomFrameShape('none')
    setCustomSecondaryOpacity(0.3)
    const controller = new AbortController()
    fetch(getBestIconPreviewUrl(selectedIcon), { signal: controller.signal })
      .then((res) => res.text())
      .then((text) => setSvgContent(text))
      .catch(() => setSvgContent(''))
    return () => controller.abort()
  }, [selectedIcon])

  const libraryOptions = useMemo(() => {
    return ['all', ...catalog.libraries, 'iconify']
  }, [catalog.libraries])

  const iconifySetOptions = useMemo(() => {
    return ['all', ...catalog.iconifySets]
  }, [catalog.iconifySets])

  const selectedLibraryValue = useMemo(() => {
    if (selectedLib !== 'iconify') return selectedLib
    return selectedIconifySet === 'all' ? 'iconify' : `iconify:${selectedIconifySet}`
  }, [selectedLib, selectedIconifySet])

  const customizedSvg = useMemo(() => {
    if (!svgContent) return ''
    return customizeSvg(svgContent, {
      size: customSize,
      strokeWidth: customStroke,
      color: customColor,
      padding: customPadding,
      frameShape: customFrameShape,
      frameColor: customFrameColor,
      frameStroke: customFrameStroke,
      secondaryOpacity: customSecondaryOpacity,
    })
  }, [svgContent, customSize, customStroke, customColor, customPadding, customFrameShape, customFrameColor, customFrameStroke, customSecondaryOpacity])

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

    // Track add-to-cart (fire-and-forget)
    trackAddToCart({
      iconId: selectedIcon.id,
      iconName: selectedIcon.name,
      library: selectedIcon.library,
    })
  }

  return (
    <main className="icon-search-page-main" style={{ maxWidth: '1500px', margin: '0 auto', padding: '16px 48px 40px', position: 'relative', minHeight: '100vh' }}>
      <div className="glow-grid-overlay" />
      <div className="glow-gradient-node" />

      <section style={{ position: 'relative', zIndex: 1, marginBottom: '24px' }}>
        <div className="icon-search-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'var(--green)', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
            Legal-safe icons in current scope: {loading ? 'loading...' : formatNumber(results.facets?.legalSafeCount || 0)}
          </p>

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
                  <button suppressHydrationWarning
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
              <button suppressHydrationWarning
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
          <input suppressHydrationWarning
            ref={searchRef}
            type="text"
            placeholder="Try: home, settings, arrow-right, cloud..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text)', fontSize: '15px', outline: 'none' }}
          />
          <span className="icon-search-focus-hint" style={{ fontSize: '11px', color: 'var(--text-dim)', border: '1px solid var(--border)', borderRadius: '6px', padding: '3px 8px', fontFamily: 'JetBrains Mono, monospace' }}>/ focus</span>
        </div>
      </section>

      <MultiFacetFilterBar
        selectedLib={selectedLib}
        onLibraryChange={handleLibraryChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={CATEGORIES}
        selectedStyle={selectedStyle}
        onStyleChange={handleStyleChange}
        selectedColorModel={selectedColorModel}
        onColorModelChange={handleColorModelChange}
        selectedLicense={selectedLicense}
        onLicenseChange={handleLicenseChange}
        legalOnly={legalOnly}
        onLegalOnlyChange={handleLegalOnlyChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        totalResults={results.total}
        loading={loading}
        facetCounts={results.facets}
        onResetFilters={handleResetFilters}
      />

      <section style={{ position: 'relative', zIndex: 1 }}>
        <div className="icon-search-results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))', gap: '12px' }}>
          {results.icons.map((icon) => {
            const color = LIBRARY_COLORS[icon.library] || 'var(--accent)'
            return (
              <IconCard
                key={icon.id}
                icon={icon}
                color={color}
                onSelect={setSelectedIcon}
                onExport={(ic) => {
                  setUniversalModalIcon(ic)
                  setIsUniversalModalOpen(true)
                }}
              />
            )
          })}
        </div>

        {results.totalPages > 1 && (
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <button suppressHydrationWarning disabled={results.page <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="icon-search-btn">
              Previous
            </button>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
              Page {results.page} / {results.totalPages}
            </span>
            <button suppressHydrationWarning disabled={results.page >= results.totalPages} onClick={() => setCurrentPage((p) => Math.min(results.totalPages, p + 1))} className="icon-search-btn">
              Next
            </button>
          </div>
        )}
      </section>

      {selectedIcon && (
        <>
          <div onClick={() => setSelectedIcon(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99 }} />
          <aside className="icon-search-detail-panel" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(420px, 100vw)', background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
            <button suppressHydrationWarning onClick={() => setSelectedIcon(null)} className="icon-search-btn icon-search-btn-small icon-search-close-btn">✕</button>
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
            {/* Quick 1-Click Code & PNG Exporter Trigger */}
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => {
                setUniversalModalIcon(selectedIcon)
                setIsUniversalModalOpen(true)
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                border: 'none',
                borderRadius: '10px',
                padding: '11px 16px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '14px',
                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.35)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.35)'
              }}
            >
              <span>⚡</span>
              <span>Universal Code Exporter (SVG, React, Vue, Svelte, Tailwind, PNG)</span>
            </button>

            {/* Live Interactive Preview Box */}
            <div style={{ marginBottom: '14px', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', minHeight: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, rgba(30,30,36,0.8) 0%, rgba(18,18,21,0.95) 100%)' }}>
              {customizedSvg ? (
                <div dangerouslySetInnerHTML={{ __html: customizedSvg }} />
              ) : (
                <img src={getBestIconPreviewUrl(selectedIcon)} alt={selectedIcon.name} width={customSize} height={customSize} style={{ filter: `drop-shadow(0 0 8px ${customColor === 'currentColor' ? '#818cf8' : customColor}33) invert(1)` }} />
              )}
            </div>

            {/* Dimension & Stroke Sliders */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', background: 'var(--bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Size</label>
                  <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>{customSize}px</span>
                </div>
                <input suppressHydrationWarning
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
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', background: 'var(--bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Stroke</label>
                  <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>{customStroke.toFixed(1)}px</span>
                </div>
                <input suppressHydrationWarning
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

            {/* Canvas Padding Slider */}
            <div style={{ marginBottom: '12px', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', background: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Canvas Padding</label>
                <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>{customPadding}px</span>
              </div>
              <input suppressHydrationWarning
                className="icon-search-slider"
                type="range"
                aria-label="Customizer canvas padding"
                title="Customizer canvas padding"
                min={0}
                max={24}
                step={1}
                value={customPadding}
                onChange={(e) => setCustomPadding(Number(e.target.value))}
              />
            </div>

            {/* Container Frame Shape Selector */}
            <div style={{ marginBottom: '12px', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', background: 'var(--bg)' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Container Frame Shape
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {[
                  { id: 'none', label: 'None' },
                  { id: 'circle', label: 'Circle' },
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'squircle', label: 'Squircle' },
                ].map((s) => {
                  const isSelected = customFrameShape === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCustomFrameShape(s.id as FrameShape)}
                      style={{
                        padding: '6px 4px',
                        borderRadius: '6px',
                        border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                        background: isSelected ? 'rgba(129, 140, 248, 0.15)' : 'transparent',
                        color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                        fontSize: '11px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontWeight: isSelected ? 700 : 500,
                      }}
                    >
                      {s.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Curated Color Palettes */}
            <div style={{ marginBottom: '12px', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', background: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Color Palette</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input suppressHydrationWarning
                    type="color"
                    aria-label="Customizer color picker"
                    title="Customizer color picker"
                    value={customColor === 'currentColor' ? '#818cf8' : customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    style={{ width: '20px', height: '20px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: 'transparent' }}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>{customColor}</span>
                </div>
              </div>

              {/* Tailwind Swatches */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {TAILWIND_PALETTES.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    title={p.name}
                    onClick={() => setCustomColor(p.color)}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: p.color === 'currentColor' ? 'linear-gradient(135deg, #fff 50%, #475569 50%)' : p.color,
                      border: customColor === p.color ? '2px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                      cursor: 'pointer',
                      transform: customColor === p.color ? 'scale(1.15)' : 'none',
                      transition: 'all 0.12s ease',
                    }}
                  />
                ))}
              </div>

              {/* Brand Swatches */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px' }}>
                {BRAND_PALETTES.map((b) => (
                  <button
                    key={b.name}
                    type="button"
                    title={b.name}
                    onClick={() => setCustomColor(b.color)}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: b.color,
                      border: customColor === b.color ? '2px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                      cursor: 'pointer',
                      transform: customColor === b.color ? 'scale(1.15)' : 'none',
                      transition: 'all 0.12s ease',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Duotone Secondary Opacity Slider */}
            <div style={{ marginBottom: '12px', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', background: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Duotone Opacity</label>
                <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>{customSecondaryOpacity.toFixed(2)}</span>
              </div>
              <input suppressHydrationWarning
                className="icon-search-slider"
                type="range"
                aria-label="Duotone secondary opacity"
                title="Duotone secondary opacity"
                min={0.1}
                max={0.9}
                step={0.05}
                value={customSecondaryOpacity}
                onChange={(e) => setCustomSecondaryOpacity(Number(e.target.value))}
              />
            </div>

            {/* Visual Style Presets Panel (Phase 3 Upgrade) */}
            <div style={{ marginBottom: '12px', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', background: 'var(--bg-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Style Preset</label>
                <button suppressHydrationWarning 
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
                <select suppressHydrationWarning 
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
                  <button suppressHydrationWarning 
                    onClick={() => applyPresetToAllCart(selectedPresetId)}
                    className="icon-search-btn icon-search-btn-small"
                    style={{ width: '100%', fontSize: '9px', padding: '4px', background: 'var(--accent-dim)', color: 'var(--accent)', borderColor: 'var(--border)' }}
                  >
                    Apply Preset to All Icons in Bundle
                  </button>
                )}
              </div>
            </div>

            <pre style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', color: 'var(--green)', fontSize: '11px', overflowX: 'auto', marginBottom: '12px' }}>
{selectedIcon.reactImport}

{selectedIcon.reactUsage}
            </pre>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button suppressHydrationWarning onClick={addToCart} className="icon-search-btn" style={{ width: '100%', background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }}>
                Add to Bundle
              </button>
              {cart.length > 0 && (
                <button
                  suppressHydrationWarning
                  onClick={() => setIsExportModalOpen(true)}
                  className="icon-search-btn"
                  style={{
                    width: '100%',
                    background: 'rgba(52, 211, 153, 0.12)',
                    borderColor: 'rgba(52, 211, 153, 0.4)',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontWeight: 600,
                  }}
                >
                  <span>📦</span>
                  <span>Export Bundle ZIP ({cart.length})</span>
                </button>
              )}
            </div>
          </aside>
        </>
      )}



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
            <input suppressHydrationWarning 
              type="text" 
              placeholder="e.g. Dashboard Icons" 
              value={createPackName} 
              onChange={(e) => setCreatePackName(e.target.value)}
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 10px', color: 'var(--text)', fontSize: '13px', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button suppressHydrationWarning onClick={handleCreatePack} className="icon-search-btn icon-search-btn-small" style={{ background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }}>Create</button>
              <button suppressHydrationWarning onClick={() => setIsCreatePackOpen(false)} className="icon-search-btn icon-search-btn-small">Cancel</button>
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
            <input suppressHydrationWarning 
              type="text" 
              value={renamePackName} 
              onChange={(e) => setRenamePackName(e.target.value)}
              placeholder="Enter pack name"
              aria-label="Rename icon pack"
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 10px', color: 'var(--text)', fontSize: '13px', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button suppressHydrationWarning onClick={handleRenamePack} className="icon-search-btn icon-search-btn-small" style={{ background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }}>Rename</button>
              <button suppressHydrationWarning onClick={() => setIsRenamePackOpen(false)} className="icon-search-btn icon-search-btn-small">Cancel</button>
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
            <input suppressHydrationWarning 
              type="text" 
              placeholder="e.g. SaaS Brand Primary" 
              value={createPresetName} 
              onChange={(e) => setCreatePresetName(e.target.value)}
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 10px', color: 'var(--text)', fontSize: '13px', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button suppressHydrationWarning 
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
              <button suppressHydrationWarning onClick={() => setIsCreatePresetOpen(false)} className="icon-search-btn icon-search-btn-small">Cancel</button>
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
              <button suppressHydrationWarning 
                onClick={() => setIsExportModalOpen(false)} 
                disabled={isExporting}
                className="icon-search-btn icon-search-btn-small icon-search-close-btn"
              >
                ✕
              </button>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontFamily: 'JetBrains Mono, monospace' }}>
                PACKAGE FILE NAME
              </label>
              <input suppressHydrationWarning 
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
                  <input suppressHydrationWarning 
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
                    <input suppressHydrationWarning 
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
                    <input suppressHydrationWarning 
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
                    <input suppressHydrationWarning 
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
                SELECT EXPORT FORMATS
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
                    <input suppressHydrationWarning 
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
                <input suppressHydrationWarning 
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
              <button suppressHydrationWarning 
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
              <button suppressHydrationWarning 
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

      {/* Universal Code & PNG Exporter Modal (Milestone M3) */}
      <UniversalExporterModal
        isOpen={isUniversalModalOpen}
        onClose={() => setIsUniversalModalOpen(false)}
        icon={universalModalIcon || selectedIcon}
        initialSvgContent={universalModalIcon?.id === selectedIcon?.id ? svgContent : ''}
        initialOptions={{
          size: customSize,
          strokeWidth: customStroke,
          color: customColor,
          padding: customPadding,
          frameShape: customFrameShape,
          frameColor: customFrameColor,
          frameStroke: customFrameStroke,
          secondaryOpacity: customSecondaryOpacity,
        }}
      />

    </main>
  )
}
