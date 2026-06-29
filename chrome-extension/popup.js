const API_BASE = 'https://iconsearch.info'
const SEARCH_API_URL = `${API_BASE}/api/extension/icon-search`
const AUTH_API_URL = `${API_BASE}/api`
const PRODUCT = 'chrome'
const SESSION_KEY = 'iconsearchChromeSession'
const RECENT_KEY = 'iconsearchChromeRecent'
const PAGE_SIZE = 48
const SEARCHABLE_ICON_COUNT = 351639
const ICONIFY_COLLECTION_COUNT = 224

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
]

const acronymParts = new Set(['ai', 'bi', 'fa', 'gis', 'ic', 'mdi', 'svg', 'ui'])

const state = {
  token: '',
  access: null,
  icons: [],
  total: 0,
  totalPages: 0,
  page: 1,
  query: '',
  library: 'all',
  style: 'all',
  legalOnly: true,
  format: 'react',
  loading: false,
  requestId: 0,
  recent: [],
  iconifySets: [],
  selectedIcon: null,
  observer: null,
}

const elements = {
  unlockView: document.querySelector('#unlockView'),
  searchView: document.querySelector('#searchView'),
  signInBtn: document.querySelector('#signInBtn'),
  signOutBtn: document.querySelector('#signOutBtn'),
  authStatus: document.querySelector('#authStatus'),
  accessLabel: document.querySelector('#accessLabel'),
  searchInput: document.querySelector('#searchInput'),
  librarySelect: document.querySelector('#librarySelect'),
  styleSelect: document.querySelector('#styleSelect'),
  legalOnly: document.querySelector('#legalOnly'),
  resultStatus: document.querySelector('#resultStatus'),
  emptyState: document.querySelector('#emptyState'),
  resultsGrid: document.querySelector('#resultsGrid'),
  loadSentinel: document.querySelector('#loadSentinel'),
  modeButtons: Array.from(document.querySelectorAll('.mode-btn')),
  actionSheet: document.querySelector('#actionSheet'),
  sheetTitle: document.querySelector('#sheetTitle'),
  sheetSource: document.querySelector('#sheetSource'),
  sheetCloseControls: Array.from(document.querySelectorAll('[data-sheet-close]')),
  sheetActionButtons: Array.from(document.querySelectorAll('[data-sheet-action]')),
}

void boot()

async function boot() {
  renderLibraryOptions()
  bindEvents()

  const saved = await chrome.storage.local.get([SESSION_KEY, RECENT_KEY])
  const session = saved[SESSION_KEY]
  state.recent = Array.isArray(saved[RECENT_KEY]) ? saved[RECENT_KEY] : []

  if (session && typeof session.token === 'string') {
    state.token = session.token
    state.access = session.access || null
    showSearch()
    await refreshAccess()
    if (state.token) await loadCatalog()
    renderRecentOrEmpty()
  } else {
    showUnlock()
  }
}

function bindEvents() {
  elements.signInBtn.addEventListener('click', () => {
    void beginSignIn()
  })

  elements.signOutBtn.addEventListener('click', () => {
    void signOut()
  })

  elements.searchInput.addEventListener('input', debounce(() => {
    state.query = elements.searchInput.value.trim()
    void search({ page: 1, append: false })
  }, 220))

  elements.librarySelect.addEventListener('change', () => {
    state.library = elements.librarySelect.value
    void search({ page: 1, append: false })
  })

  elements.styleSelect.addEventListener('change', () => {
    state.style = elements.styleSelect.value
    void search({ page: 1, append: false })
  })

  elements.legalOnly.addEventListener('change', () => {
    state.legalOnly = elements.legalOnly.checked
    void search({ page: 1, append: false })
  })

  elements.modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.format = button.dataset.format || 'react'
      elements.modeButtons.forEach((item) => item.classList.toggle('active', item === button))
    })
  })

  elements.sheetCloseControls.forEach((button) => {
    button.addEventListener('click', closeActionSheet)
  })

  elements.sheetActionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      void handleSheetAction(button.dataset.sheetAction || '')
    })
  })

  state.observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      void loadMore()
    }
  }, { root: null, rootMargin: '700px 0px' })
  state.observer.observe(elements.loadSentinel)
}

function renderLibraryOptions() {
  const selected = elements.librarySelect.value || state.library
  const allLabel = `All libraries - ${SEARCHABLE_ICON_COUNT.toLocaleString('en-US')} icons`
  const iconifyLabel = `Iconify collections (${state.iconifySets.length || ICONIFY_COLLECTION_COUNT})`
  const namedOptions = namedLibraries
    .map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`)
    .join('')
  const iconifyOptions = state.iconifySets
    .map((set) => `<option value="iconify:${escapeHtml(set)}">${escapeHtml(formatIconifySet(set))}</option>`)
    .join('')

  elements.librarySelect.innerHTML = `
    <option value="all">${escapeHtml(allLabel)}</option>
    <optgroup label="Named libraries (${namedLibraries.length})">
      ${namedOptions}
    </optgroup>
    <optgroup label="${escapeAttribute(iconifyLabel)}">
      <option value="iconify">All Iconify collections</option>
      ${iconifyOptions}
    </optgroup>
  `

  const nextValue = Array.from(elements.librarySelect.options).some((option) => option.value === selected)
    ? selected
    : 'all'
  elements.librarySelect.value = nextValue
  state.library = nextValue
}

async function loadCatalog() {
  if (!state.token) return

  try {
    const url = new URL(SEARCH_API_URL)
    url.searchParams.set('limit', '1')
    url.searchParams.set('page', '1')
    url.searchParams.set('sort', 'popular')
    url.searchParams.set('legalOnly', '0')

    const response = await fetch(url.toString(), {
      headers: authHeaders(),
    })
    const payload = await response.json()
    if (!response.ok) return

    const sets = Array.isArray(payload.facets?.iconifySets)
      ? payload.facets.iconifySets.filter((set) => typeof set === 'string')
      : []
    if (sets.length > 0) {
      state.iconifySets = sets
      renderLibraryOptions()
    }
  } catch {
    renderLibraryOptions()
  }
}

function showUnlock() {
  elements.unlockView.classList.remove('hidden')
  elements.searchView.classList.add('hidden')
  closeActionSheet()
}

function showSearch() {
  elements.unlockView.classList.add('hidden')
  elements.searchView.classList.remove('hidden')
  const access = state.access || {}
  const tier = access.tier === 'founder' && access.founderNumber
    ? `Founder #${access.founderNumber}`
    : 'Free access'
  elements.accessLabel.textContent = access.email ? `${access.email} - ${tier}` : tier
}

async function beginSignIn() {
  elements.signInBtn.disabled = true
  elements.signInBtn.textContent = 'Waiting for approval...'
  elements.authStatus.textContent = 'Opening secure sign-in in your browser...'

  try {
    const startResponse = await fetch(`${AUTH_API_URL}/device/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ product: PRODUCT, clientName: `Chrome ${navigator.userAgent.slice(0, 44)}` }),
    })
    const startPayload = await startResponse.json()
    if (!startResponse.ok) throw new Error(startPayload.error || 'Could not start sign-in.')

    const deviceCode = startPayload.deviceCode
    const verificationUrl = startPayload.verificationUriComplete
    if (!deviceCode || !verificationUrl) throw new Error('The sign-in response was incomplete.')

    await chrome.tabs.create({ url: verificationUrl, active: true })
    elements.authStatus.textContent = 'Approve the connection in your browser. This popup will update automatically.'

    const deadline = Date.now() + (Number(startPayload.expiresIn) || 600) * 1000
    const interval = Math.max(2, Number(startPayload.interval) || 3) * 1000

    while (Date.now() < deadline) {
      await delay(interval)
      const statusResponse = await fetch(`${AUTH_API_URL}/device/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ deviceCode }),
      })
      const statusPayload = await statusResponse.json()

      if (statusPayload.status === 'pending') continue
      if (statusPayload.status !== 'authorized') {
        throw new Error(statusPayload.error || 'The sign-in link expired. Please try again.')
      }

      state.token = statusPayload.token
      state.access = normalizeAccess(statusPayload.access)
      await chrome.storage.local.set({ [SESSION_KEY]: { token: state.token, access: state.access } })
      showSearch()
      await loadCatalog()
      renderRecentOrEmpty()
      return
    }

    throw new Error('The sign-in link expired. Please try again.')
  } catch (error) {
    elements.authStatus.textContent = error instanceof Error ? error.message : 'Could not connect your account.'
  } finally {
    elements.signInBtn.disabled = false
    elements.signInBtn.textContent = 'Sign in with IconSearch'
  }
}

async function refreshAccess() {
  if (!state.token) return

  try {
    const response = await fetch(`${AUTH_API_URL}/entitlements/me`, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${state.token}`,
      },
    })
    if (response.status === 401) {
      await signOut(false)
      return
    }
    if (!response.ok) return

    const payload = await response.json()
    state.access = normalizeAccess(payload.access)
    await chrome.storage.local.set({ [SESSION_KEY]: { token: state.token, access: state.access } })
    showSearch()
  } catch {
    showSearch()
  }
}

async function signOut(callApi = true) {
  const token = state.token
  state.token = ''
  state.access = null
  state.icons = []

  if (callApi && token) {
    try {
      await fetch(`${AUTH_API_URL}/device/revoke`, {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
      })
    } catch {}
  }

  await chrome.storage.local.remove(SESSION_KEY)
  showUnlock()
}

async function search({ page, append }) {
  const query = elements.searchInput.value.trim()
  const hasFilter = elements.librarySelect.value !== 'all' || elements.styleSelect.value !== 'all'
  if (query.length === 1 || (!query && !hasFilter)) {
    state.icons = []
    state.total = 0
    state.totalPages = 0
    state.page = 1
    renderRecentOrEmpty()
    return
  }

  const requestId = ++state.requestId
  state.loading = true
  state.query = query
  state.library = elements.librarySelect.value
  state.style = elements.styleSelect.value
  state.legalOnly = elements.legalOnly.checked
  state.page = page

  if (!append) {
    elements.resultsGrid.innerHTML = ''
    elements.emptyState.classList.add('hidden')
    elements.resultStatus.textContent = 'Searching online...'
  } else {
    elements.resultStatus.textContent = `Loading more from ${state.total.toLocaleString('en-US')} results...`
  }

  try {
    const url = new URL(SEARCH_API_URL)
    if (query) url.searchParams.set('q', query)
    url.searchParams.set('limit', String(PAGE_SIZE))
    url.searchParams.set('page', String(page))
    url.searchParams.set('sort', 'relevance')
    url.searchParams.set('legalOnly', state.legalOnly ? '1' : '0')
    applyLibraryParams(url, state.library)
    if (state.style !== 'all') url.searchParams.set('style', state.style)

    const response = await fetch(url.toString(), {
      headers: authHeaders(),
    })
    const payload = await response.json()
    if (!response.ok) throw new Error(payload.error || `IconSearch API returned ${response.status}`)
    if (requestId !== state.requestId) return

    const icons = Array.isArray(payload.icons) ? payload.icons.map(normalizeIcon).filter(Boolean) : []
    state.total = Number(payload.total) || icons.length
    state.totalPages = Number(payload.totalPages) || Math.ceil(state.total / PAGE_SIZE)
    state.icons = append ? state.icons.concat(icons) : icons

    if (Array.isArray(payload.facets?.iconifySets) && payload.facets.iconifySets.length > state.iconifySets.length) {
      state.iconifySets = payload.facets.iconifySets.filter((set) => typeof set === 'string')
      renderLibraryOptions()
    }

    renderResults(append ? icons : state.icons, append)
    elements.resultStatus.textContent = `${state.icons.length.toLocaleString('en-US')} shown from ${state.total.toLocaleString('en-US')} online results`
    if (state.icons.length === 0) showEmpty('No icons found. Try a broader query or another library.')
  } catch (error) {
    if (requestId !== state.requestId) return
    if (append) {
      elements.resultStatus.textContent = error instanceof Error ? error.message : 'Could not load more icons.'
    } else {
      showEmpty(error instanceof Error ? error.message : 'Online search failed.')
      elements.resultStatus.textContent = 'Could not load icons.'
    }
  } finally {
    if (requestId === state.requestId) state.loading = false
  }
}

async function loadMore() {
  if (state.loading || !state.token) return
  if (!state.query && state.library === 'all' && state.style === 'all') return
  if (state.totalPages && state.page >= state.totalPages) return

  await search({ page: state.page + 1, append: true })
}

function renderResults(icons, append) {
  if (!append) elements.resultsGrid.innerHTML = ''
  elements.emptyState.classList.add('hidden')

  const fragment = document.createDocumentFragment()
  icons.forEach((icon) => {
    const card = document.createElement('article')
    card.className = 'icon-card'
    card.innerHTML = `
      <div class="icon-preview">
        <img alt="" src="${escapeAttribute(icon.svgUrl)}" loading="lazy">
      </div>
      <div class="icon-meta">
        <strong title="${escapeAttribute(icon.name)}">${escapeHtml(icon.name)}</strong>
        <small title="${escapeAttribute(icon.libraryName)}">${escapeHtml(icon.libraryName)}</small>
      </div>
      <div class="card-actions">
        <button class="primary" type="button" data-action="copy">Copy</button>
        <button type="button" data-action="more">Actions</button>
      </div>
    `

    card.querySelector('[data-action="copy"]').addEventListener('click', () => {
      void runAction(() => copyIcon(icon))
    })
    card.querySelector('[data-action="more"]').addEventListener('click', () => {
      showIconActions(icon)
    })
    fragment.appendChild(card)
  })

  elements.resultsGrid.appendChild(fragment)
}

function renderRecentOrEmpty() {
  if (state.recent.length > 0) {
    elements.emptyState.classList.add('hidden')
    renderResults(state.recent, false)
    elements.resultStatus.textContent = `Recent icons - ${SEARCHABLE_ICON_COUNT.toLocaleString('en-US')} searchable online`
    return
  }

  elements.resultsGrid.innerHTML = ''
  showEmpty('Search the live IconSearch API, or pick from recent icons after your first copy.')
  elements.resultStatus.textContent = `${SEARCHABLE_ICON_COUNT.toLocaleString('en-US')} online icons ready`
}

function showEmpty(message) {
  elements.resultsGrid.innerHTML = ''
  elements.emptyState.textContent = message
  elements.emptyState.classList.remove('hidden')
}

async function copyIcon(icon) {
  const format = state.format
  const text = format === 'svg'
    ? await fetchSvg(icon)
    : format === 'url'
      ? icon.svgUrl
      : createReactSnippet(icon)

  await navigator.clipboard.writeText(text)
  await rememberIcon(icon)
  elements.resultStatus.textContent = format === 'svg'
    ? 'Copied live SVG markup.'
    : format === 'url'
      ? 'Copied online SVG URL.'
      : 'Copied React snippet.'
}

function showIconActions(icon) {
  state.selectedIcon = icon
  elements.sheetTitle.textContent = icon.name
  elements.sheetSource.textContent = `${icon.libraryName} - online SVG`
  elements.actionSheet.classList.remove('hidden')
  elements.actionSheet.setAttribute('aria-hidden', 'false')
}

function closeActionSheet() {
  state.selectedIcon = null
  elements.actionSheet.classList.add('hidden')
  elements.actionSheet.setAttribute('aria-hidden', 'true')
}

async function handleSheetAction(action) {
  const icon = state.selectedIcon
  if (!icon) return
  closeActionSheet()

  await runAction(async () => {
    if (action === 'copy') await copyIcon(icon)
    if (action === 'svg') {
      const previous = state.format
      state.format = 'svg'
      await copyIcon(icon)
      state.format = previous
    }
    if (action === 'url') {
      await navigator.clipboard.writeText(icon.svgUrl)
      await rememberIcon(icon)
      elements.resultStatus.textContent = 'Copied online SVG URL.'
    }
    if (action === 'download') await downloadIcon(icon)
    if (action === 'open') await chrome.tabs.create({ url: icon.svgUrl, active: true })
  })
}

async function runAction(task) {
  try {
    await task()
  } catch (error) {
    elements.resultStatus.textContent = error instanceof Error ? error.message : 'Action failed.'
  }
}

async function downloadIcon(icon) {
  const svg = await fetchSvg(icon)
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  await chrome.downloads.download({
    url,
    filename: `iconsearch/${safeFileName(icon.name)}.svg`,
    saveAs: false,
  })
  window.setTimeout(() => URL.revokeObjectURL(url), 15000)
  await rememberIcon(icon)
  elements.resultStatus.textContent = 'SVG download started.'
}

async function fetchSvg(icon) {
  const response = await fetch(icon.svgUrl, { headers: { accept: 'image/svg+xml,text/plain,*/*' } })
  if (!response.ok) throw new Error(`SVG source returned ${response.status}`)
  const text = await response.text()
  if (!text.includes('<svg')) throw new Error('The source did not return SVG markup.')
  return text.trim()
}

async function rememberIcon(icon) {
  state.recent = [icon].concat(state.recent.filter((item) => item.id !== icon.id)).slice(0, 12)
  await chrome.storage.local.set({ [RECENT_KEY]: state.recent })
}

function createReactSnippet(icon) {
  if (icon.reactImport && icon.reactUsage) return `${icon.reactImport}\n\n${icon.reactUsage}`
  if (icon.reactUsage) return icon.reactUsage
  return `import { Icon } from '@iconify/react';\n\n<Icon icon="${icon.iconifyName}" width={24} height={24} />`
}

function applyLibraryParams(url, value) {
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

function authHeaders() {
  return {
    accept: 'application/json',
    authorization: `Bearer ${state.token}`,
    'x-iconsearch-product': PRODUCT,
  }
}

function normalizeIcon(value) {
  if (!value || typeof value !== 'object') return null
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
    reactImport: String(value.reactImport || ''),
    reactUsage: String(value.reactUsage || ''),
  }
}

function normalizeSvgUrl(url, library, name) {
  if (url && url.startsWith('//')) return `https:${url}`
  if (url && /^https?:\/\//.test(url)) return url
  const dashedName = name.replace(/_/g, '-')

  const prefixes = {
    'lucide-icons': 'lucide',
    'heroicons': 'heroicons',
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

function toIconifyName(library, name) {
  const prefixMap = {
    'lucide-icons': 'lucide',
    'heroicons': 'heroicons',
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

function getLibraryLabel(library) {
  const found = namedLibraries.find(([id]) => id === library)
  if (found) return found[1]
  if (library.startsWith('iconify-')) return `${formatIconifySet(library.replace(/^iconify-/, ''))} (Iconify)`
  return library
}

function formatIconifySet(value) {
  return String(value)
    .replace(/^iconify-/, '')
    .split('-')
    .map((part) => acronymParts.has(part) ? part.toUpperCase() : `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

function normalizeAccess(value) {
  if (!value || typeof value !== 'object') return null
  return {
    email: String(value.email || ''),
    product: String(value.product || PRODUCT),
    tier: String(value.tier || 'free'),
    founderNumber: typeof value.founderNumber === 'number' ? value.founderNumber : null,
    expiresAt: String(value.expiresAt || ''),
  }
}

function debounce(fn, wait) {
  let timeout = 0
  return (...args) => {
    window.clearTimeout(timeout)
    timeout = window.setTimeout(() => fn(...args), wait)
  }
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function safeFileName(value) {
  return value.replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '') || 'icon'
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeAttribute(value) {
  return escapeHtml(value)
}
