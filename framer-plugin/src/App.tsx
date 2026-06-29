import { framer } from '@framer/plugin'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

framer.showUI({
  position: 'top right',
  width: 390,
  height: 620,
})

const API_BASE = 'https://iconsearch.info'
const SEARCH_API_URL = `${API_BASE}/api/extension/icon-search`
const AUTH_API_URL = `${API_BASE}/api`
const PRODUCT = 'framer'
const SESSION_KEY = 'iconsearchFramerSession'
const RECENT_KEY = 'iconsearchFramerRecent'
const PAGE_SIZE = 60
const SEARCHABLE_ICON_COUNT = 351_639
const ICONIFY_COLLECTION_COUNT = 224

type Access = {
  email: string
  product: string
  tier: string
  founderNumber: number | null
  expiresAt: string
}

type Session = {
  token: string
  access: Access | null
}

type ApiIcon = {
  id?: string
  name?: string
  library?: string
  libraryName?: string
  svgUrl?: string
  iconifyName?: string
}

type IconResult = {
  id: string
  name: string
  library: string
  libraryName: string
  svgUrl: string
  iconifyName: string
}

type SearchResponse = {
  icons?: ApiIcon[]
  total?: number
  totalPages?: number
  facets?: {
    iconifySets?: string[]
  }
  error?: string
}

const namedLibraries = [
  ['lucide-icons', 'Lucide Icons'],
  ['heroicons', 'Heroicons'],
  ['tabler-icons', 'Tabler Icons'],
  ['phosphor-icons', 'Phosphor Icons'],
  ['remix-icon', 'Remix Icon'],
  ['feather-icons', 'Feather Icons'],
  ['bootstrap-icons', 'Bootstrap Icons'],
  ['radix-icons', 'Radix Icons'],
  ['iconoir', 'Iconoir'],
  ['ionicons', 'Ionicons'],
  ['octicons', 'Octicons'],
  ['ant-design-icons', 'Ant Design Icons'],
  ['devicons', 'Devicons'],
  ['teenyicons', 'Teenyicons'],
  ['circum-icons', 'Circum Icons'],
  ['elusive-icons', 'Elusive Icons'],
] as const

const acronymParts = new Set(['ai', 'bi', 'fa', 'gis', 'ic', 'mdi', 'svg', 'ui'])

export function App() {
  const [session, setSession] = useState<Session | null>(() => readJson<Session | null>(SESSION_KEY, null))
  const [recent, setRecent] = useState<IconResult[]>(() => readJson<IconResult[]>(RECENT_KEY, []))
  const [icons, setIcons] = useState<IconResult[]>([])
  const [iconifySets, setIconifySets] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [library, setLibrary] = useState('all')
  const [style, setStyle] = useState('all')
  const [legalOnly, setLegalOnly] = useState(true)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const requestIdRef = useRef(0)
  const scrollingRef = useRef<HTMLDivElement | null>(null)
  const activeSession = session?.token ? session : null
  const token = activeSession?.token || ''

  const canSearch = Boolean(token)
  const accessLabel = useMemo(() => {
    const access = activeSession?.access
    if (!access) return 'Free access'
    const tier = access.tier === 'founder' && access.founderNumber
      ? `Founder #${access.founderNumber}`
      : 'Free access'
    return access.email ? `${access.email} - ${tier}` : tier
  }, [activeSession])

  const showRecent = !query.trim() && library === 'all' && style === 'all'
  const displayIcons = showRecent ? recent : icons

  const persistSession = useCallback((nextSession: Session | null) => {
    setSession(nextSession)
    if (nextSession) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
    } else {
      window.localStorage.removeItem(SESSION_KEY)
    }
  }, [])

  const refreshAccess = useCallback(async () => {
    if (!token) return

    try {
      const response = await fetch(`${AUTH_API_URL}/entitlements/me`, {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        persistSession(null)
        setStatus('Please sign in again.')
        return
      }

      if (!response.ok) return
      const payload = await response.json() as { access?: Access }
      const refreshedSession = {
        token,
        access: normalizeAccess(payload.access),
      }
      persistSession(refreshedSession)
    } catch {
      // Keep the saved session. The search API will be the source of truth.
    }
  }, [persistSession, token])

  const loadCatalog = useCallback(async () => {
    if (!token) return

    try {
      const url = new URL(SEARCH_API_URL)
      url.searchParams.set('limit', '1')
      url.searchParams.set('page', '1')
      url.searchParams.set('sort', 'popular')
      url.searchParams.set('legalOnly', '0')

      const response = await fetch(url.toString(), {
        headers: authHeaders(token),
      })
      if (!response.ok) return

      const payload = await response.json() as SearchResponse
      const sets = Array.isArray(payload.facets?.iconifySets)
        ? payload.facets.iconifySets.filter((set): set is string => typeof set === 'string')
        : []

      if (sets.length > 0) setIconifySets(sets)
    } catch {
      // The hard-coded collection count keeps the UI honest while offline checks fail.
    }
  }, [token])

  const search = useCallback(async ({ nextPage, append }: { nextPage: number; append: boolean }) => {
    if (!token) return

    const trimmedQuery = query.trim()
    const hasFilter = library !== 'all' || style !== 'all'
    if (trimmedQuery.length === 1 || (!trimmedQuery && !hasFilter)) {
      setIcons([])
      setTotal(0)
      setTotalPages(0)
      setPage(1)
      setStatus(recent.length ? 'Showing recent icons.' : `${SEARCHABLE_ICON_COUNT.toLocaleString('en-US')} online icons ready.`)
      return
    }

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    setLoading(true)
    setError('')
    setStatus(append ? 'Loading more icons...' : 'Searching online...')

    try {
      const url = new URL(SEARCH_API_URL)
      if (trimmedQuery) url.searchParams.set('q', trimmedQuery)
      url.searchParams.set('limit', String(PAGE_SIZE))
      url.searchParams.set('page', String(nextPage))
      url.searchParams.set('sort', 'relevance')
      url.searchParams.set('legalOnly', legalOnly ? '1' : '0')
      applyLibraryParams(url, library)
      if (style !== 'all') url.searchParams.set('style', style)

      const response = await fetch(url.toString(), {
        headers: authHeaders(token),
      })
      const payload = await response.json() as SearchResponse
      if (!response.ok) throw new Error(payload.error || `IconSearch API returned ${response.status}`)
      if (requestId !== requestIdRef.current) return

      const nextIcons = Array.isArray(payload.icons)
        ? payload.icons.map(normalizeIcon).filter((icon): icon is IconResult => Boolean(icon))
        : []
      const nextTotal = Number(payload.total) || nextIcons.length
      const nextTotalPages = Number(payload.totalPages) || Math.ceil(nextTotal / PAGE_SIZE)

      setIcons((current) => append ? current.concat(nextIcons) : nextIcons)
      setPage(nextPage)
      setTotal(nextTotal)
      setTotalPages(nextTotalPages)

      if (Array.isArray(payload.facets?.iconifySets) && payload.facets.iconifySets.length > iconifySets.length) {
        setIconifySets(payload.facets.iconifySets.filter((set): set is string => typeof set === 'string'))
      }

      const shown = append ? icons.length + nextIcons.length : nextIcons.length
      setStatus(`${shown.toLocaleString('en-US')} shown from ${nextTotal.toLocaleString('en-US')} online results.`)
      if (nextIcons.length === 0 && !append) setError('No icons found. Try a broader query or another library.')
    } catch (searchError) {
      if (requestId !== requestIdRef.current) return
      setError(searchError instanceof Error ? searchError.message : 'Online search failed.')
      setStatus('Could not load icons.')
    } finally {
      if (requestId === requestIdRef.current) setLoading(false)
    }
  }, [icons.length, iconifySets.length, legalOnly, library, query, recent.length, style, token])

  useEffect(() => {
    if (!token) return
    void refreshAccess()
    void loadCatalog()
  }, [loadCatalog, refreshAccess, token])

  useEffect(() => {
    if (!canSearch) return
    const timer = window.setTimeout(() => {
      void search({ nextPage: 1, append: false })
    }, 220)
    return () => window.clearTimeout(timer)
  }, [canSearch, legalOnly, library, query, search, style])

  const beginSignIn = async () => {
    setAuthLoading(true)
    setError('')
    setStatus('Opening secure sign-in in your browser...')

    try {
      const startResponse = await fetch(`${AUTH_API_URL}/device/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ product: PRODUCT, clientName: `Framer ${navigator.userAgent.slice(0, 48)}` }),
      })
      const startPayload = await startResponse.json() as {
        deviceCode?: string
        verificationUriComplete?: string
        expiresIn?: number
        interval?: number
        error?: string
      }
      if (!startResponse.ok) throw new Error(startPayload.error || 'Could not start sign-in.')

      const deviceCode = startPayload.deviceCode
      const verificationUrl = startPayload.verificationUriComplete
      if (!deviceCode || !verificationUrl) throw new Error('The sign-in response was incomplete.')

      window.open(verificationUrl, '_blank', 'noopener,noreferrer')
      setStatus('Approve the browser page. This plugin will update automatically.')

      const deadline = Date.now() + (Number(startPayload.expiresIn) || 600) * 1000
      const interval = Math.max(2, Number(startPayload.interval) || 3) * 1000

      while (Date.now() < deadline) {
        await delay(interval)
        const statusResponse = await fetch(`${AUTH_API_URL}/device/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', accept: 'application/json' },
          body: JSON.stringify({ deviceCode }),
        })
        const statusPayload = await statusResponse.json() as {
          status?: string
          token?: string
          access?: Access
          error?: string
        }

        if (statusPayload.status === 'pending') continue
        if (statusPayload.status !== 'authorized' || !statusPayload.token) {
          throw new Error(statusPayload.error || 'The sign-in link expired. Please try again.')
        }

        persistSession({
          token: statusPayload.token,
          access: normalizeAccess(statusPayload.access),
        })
        setStatus('IconSearch connected. Search and insert icons.')
        return
      }

      throw new Error('The sign-in link expired. Please try again.')
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Could not connect your account.')
    } finally {
      setAuthLoading(false)
    }
  }

  const signOut = async () => {
    const currentToken = token
    persistSession(null)
    setIcons([])
    setStatus('Signed out.')

    if (!currentToken) return
    try {
      await fetch(`${AUTH_API_URL}/device/revoke`, {
        method: 'POST',
        headers: { authorization: `Bearer ${currentToken}` },
      })
    } catch {
      // Local sign-out already happened.
    }
  }

  const rememberIcon = (icon: IconResult) => {
    const nextRecent = [icon].concat(recent.filter((item) => item.id !== icon.id)).slice(0, 16)
    setRecent(nextRecent)
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(nextRecent))
  }

  const insertIcon = async (icon: IconResult) => {
    setError('')
    setStatus(`Loading ${icon.name} SVG...`)

    try {
      const svg = await fetchSvg(icon)
      await framer.addSVG({
        svg,
        name: `${safeFileName(icon.name)}.svg`,
      })
      rememberIcon(icon)
      setStatus(`Inserted ${icon.name} into the canvas.`)
      notify(`Inserted ${icon.name}`)
    } catch (insertError) {
      setError(insertError instanceof Error ? insertError.message : 'Could not insert this icon.')
      setStatus('Insert failed.')
    }
  }

  const loadMore = () => {
    if (loading || showRecent) return
    if (totalPages && page >= totalPages) return
    void search({ nextPage: page + 1, append: true })
  }

  const handleScroll = () => {
    const node = scrollingRef.current
    if (!node) return
    const remaining = node.scrollHeight - node.scrollTop - node.clientHeight
    if (remaining < 900) loadMore()
  }

  if (!token) {
    return (
      <main className="plugin-shell unlock-shell">
        <div className="brand-row">
          <span className="brand-mark">IS</span>
          <span>IconSearch</span>
          <strong>FREE</strong>
        </div>

        <section className="unlock-card">
          <div className="eyebrow">Live icon search</div>
          <h1>Search 351,639 SVG icons inside Framer.</h1>
          <p>
            Sign in securely in your browser. Framer stores only a revocable IconSearch app token.
          </p>
          <button type="button" onClick={() => void beginSignIn()} disabled={authLoading} className="primary-button">
            {authLoading ? 'Waiting for approval...' : 'Sign in with IconSearch'}
          </button>
          <div className="trust-line">16 named libraries + 224 Iconify collections. Online-only results.</div>
        </section>

        {status && <p className="status-line">{status}</p>}
        {error && <p className="error-line">{error}</p>}
      </main>
    )
  }

  return (
    <main className="plugin-shell">
      <header className="toolbar">
        <div className="brand-row compact">
          <span className="brand-mark">IS</span>
          <div>
            <strong>IconSearch</strong>
            <small>{accessLabel}</small>
          </div>
          <button type="button" onClick={() => void signOut()} className="ghost-button">Sign out</button>
        </div>

        <label className="search-field" htmlFor="iconsearch-query">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
          </svg>
          <input
            id="iconsearch-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search home, arrow, chart..."
          />
        </label>

        <div className="filter-row">
          <select value={library} onChange={(event) => setLibrary(event.target.value)} aria-label="Library">
            <option value="all">All libraries - 351,639</option>
            <optgroup label={`Named libraries (${namedLibraries.length})`}>
              {namedLibraries.map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </optgroup>
            <optgroup label={`Iconify collections (${iconifySets.length || ICONIFY_COLLECTION_COUNT})`}>
              <option value="iconify">All Iconify collections</option>
              {iconifySets.map((set) => (
                <option key={set} value={`iconify:${set}`}>{formatIconifySet(set)}</option>
              ))}
            </optgroup>
          </select>

          <select value={style} onChange={(event) => setStyle(event.target.value)} aria-label="Style">
            <option value="all">All styles</option>
            <option value="stroke">Outline</option>
            <option value="solid">Solid</option>
            <option value="duotone">Duotone</option>
            <option value="twotone">Two tone</option>
            <option value="sharp">Sharp</option>
          </select>
        </div>

        <div className="sub-toolbar">
          <label>
            <input
              type="checkbox"
              checked={legalOnly}
              onChange={(event) => setLegalOnly(event.target.checked)}
            />
            Legal-safe only
          </label>
          <span>{showRecent ? `${recent.length} recent` : `${icons.length.toLocaleString('en-US')} / ${total.toLocaleString('en-US')}`}</span>
        </div>
      </header>

      <section className="results-panel" ref={scrollingRef} onScroll={handleScroll}>
        {displayIcons.length === 0 && !loading ? (
          <div className="empty-state">
            <strong>{error || 'Start with a search or choose a library.'}</strong>
            <span>Try "home", "arrow", "chart", "calendar", or "settings".</span>
          </div>
        ) : (
          <div className="icon-grid">
            {displayIcons.map((icon) => (
              <button
                key={icon.id}
                type="button"
                className="icon-card"
                onClick={() => void insertIcon(icon)}
                title={`${icon.name} - ${icon.libraryName}`}
              >
                <span className="icon-preview">
                  <img alt="" src={icon.svgUrl} loading="lazy" />
                </span>
                <span className="icon-name">{icon.name}</span>
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="loading-grid" aria-label="Loading icons">
            {Array.from({ length: 8 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
        )}
      </section>

      <footer className="plugin-footer">
        <span className={error ? 'footer-error' : ''}>{error || status || 'Click any icon to insert a clean SVG.'}</span>
      </footer>
    </main>
  )
}

function authHeaders(token: string) {
  return {
    accept: 'application/json',
    authorization: `Bearer ${token}`,
    'x-iconsearch-product': PRODUCT,
  }
}

function applyLibraryParams(url: URL, value: string) {
  if (value === 'all') return
  if (value === 'iconify') {
    url.searchParams.set('lib', 'iconify')
    return
  }
  if (value.startsWith('iconify:')) {
    url.searchParams.set('lib', 'iconify')
    url.searchParams.set('iconifySet', value.slice('iconify:'.length))
    return
  }
  url.searchParams.set('lib', value)
}

function normalizeIcon(value: ApiIcon): IconResult | null {
  const name = String(value.name || '')
  const library = String(value.library || '')
  if (!name || !library) return null

  const svgUrl = normalizeSvgUrl(String(value.svgUrl || ''), library, name)
  if (!svgUrl) return null

  return {
    id: String(value.id || `${library}-${name}`),
    name,
    library,
    libraryName: String(value.libraryName || getLibraryLabel(library)),
    svgUrl,
    iconifyName: String(value.iconifyName || toIconifyName(library, name)),
  }
}

function normalizeSvgUrl(url: string, library: string, name: string) {
  if (url.startsWith('//')) return `https:${url}`
  if (/^https?:\/\//.test(url)) return url

  const dashedName = name.replace(/_/g, '-')
  const prefixes: Record<string, string> = {
    'lucide-icons': 'lucide',
    heroicons: 'heroicons',
    'tabler-icons': 'tabler',
    'phosphor-icons': 'ph',
    'remix-icon': 'ri',
    'feather-icons': 'feather',
    'bootstrap-icons': 'bi',
    'radix-icons': 'radix-icons',
    iconoir: 'iconoir',
    ionicons: 'ion',
    octicons: 'octicon',
    'ant-design-icons': 'ant-design',
    devicons: 'devicon',
    teenyicons: 'teenyicons',
    'circum-icons': 'circum',
    'elusive-icons': 'el',
  }

  if (library.startsWith('iconify-')) {
    return `https://api.iconify.design/${library.replace(/^iconify-/, '')}/${dashedName}.svg`
  }

  const prefix = prefixes[library]
  return prefix ? `https://api.iconify.design/${prefix}/${dashedName}.svg` : ''
}

function toIconifyName(library: string, name: string) {
  const prefixMap: Record<string, string> = {
    'lucide-icons': 'lucide',
    heroicons: 'heroicons',
    'tabler-icons': 'tabler',
    'phosphor-icons': 'ph',
    'remix-icon': 'ri',
    'feather-icons': 'feather',
    'bootstrap-icons': 'bi',
    'radix-icons': 'radix-icons',
    iconoir: 'iconoir',
    ionicons: 'ion',
    octicons: 'octicon',
    'ant-design-icons': 'ant-design',
    devicons: 'devicon',
    teenyicons: 'teenyicons',
    'circum-icons': 'circum',
    'elusive-icons': 'el',
  }
  const prefix = library.startsWith('iconify-') ? library.replace(/^iconify-/, '') : prefixMap[library]
  return `${prefix || library}:${name.replace(/_/g, '-')}`
}

function getLibraryLabel(library: string) {
  const found = namedLibraries.find(([id]) => id === library)
  if (found) return found[1]
  if (library.startsWith('iconify-')) return `${formatIconifySet(library.replace(/^iconify-/, ''))} (Iconify)`
  return library
}

function formatIconifySet(value: string) {
  return String(value)
    .replace(/^iconify-/, '')
    .split('-')
    .map((part) => acronymParts.has(part) ? part.toUpperCase() : `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

async function fetchSvg(icon: IconResult) {
  const response = await fetch(icon.svgUrl, { headers: { accept: 'image/svg+xml,text/plain,*/*' } })
  if (!response.ok) throw new Error(`SVG source returned ${response.status}`)
  const text = await response.text()
  if (!text.includes('<svg')) throw new Error('The source did not return SVG markup.')
  return text.trim()
}

function normalizeAccess(value: Access | undefined): Access | null {
  if (!value || typeof value !== 'object') return null
  return {
    email: String(value.email || ''),
    product: String(value.product || PRODUCT),
    tier: String(value.tier || 'free'),
    founderNumber: typeof value.founderNumber === 'number' ? value.founderNumber : null,
    expiresAt: String(value.expiresAt || ''),
  }
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}

function safeFileName(value: string) {
  return value.replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '') || 'icon'
}

function notify(message: string) {
  const maybeFramer = framer as unknown as { notify?: (text: string) => void }
  maybeFramer.notify?.(message)
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}
