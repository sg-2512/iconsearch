import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { gunzipSync } from 'zlib'
import {
  allLibraries,
  namedLibraries,
  ICONIFY_COLLECTION_COUNT,
  ICONIFY_ICON_COUNT,
  NAMED_LIBRARY_COUNT,
  SEARCHABLE_ICON_COUNT,
} from '../../../data/library-catalog'
import {
  getIconSourceSetId,
  ICON_SOURCE_SET_COUNT,
  ICON_SOURCE_SET_OPTIONS,
} from '../../../lib/icon-source-sets'
import {
  buildIconSearchIntent,
  describeIconSearchIntent,
  iconMatchesIntent,
  scoreIconIntent,
} from '../../../lib/icon-intent'
import { CATEGORY_KEYWORDS_MAP } from '../../../lib/categories'

const LIBRARY_OPTIONS = allLibraries
  .map(({ id, name }) => ({ id, name }))
  .sort((left, right) => left.name.localeCompare(right.name))

const LIBRARY_FILTER_ALIASES: Record<string, string> = {
  'iconify-ant-design': 'ant-design-icons',
  'iconify-ion': 'ionicons',
  'iconify-octicon': 'octicons',
}

const NAMED_LIBRARY_ID_SET = new Set([
  ...namedLibraries.map((l) => l.id.toLowerCase()),
  'lucide-icons',
  'heroicons',
  'tabler-icons',
  'patternfly-icons',
  'untitled-ui-icons',
  'phosphor-icons',
  'remix-icon',
  'feather-icons',
  'bootstrap-icons',
  'radix-icons',
  'iconoir',
  'ionicons',
  'octicons',
  'ant-design-icons',
  'devicons',
  'teenyicons',
  'circum-icons',
  'elusive-icons',
])

const MULTICOLOR_LIBRARIES = new Set([
  'flat-color-icons',
  'devicons',
  'devicon',
  'skill-icons',
  'vscode-icons',
  'logos',
  'circle-flags',
  'flag',
  'flagpack',
  'cif',
  'country-flag',
  'twemoji',
  'noto',
  'noto-v1',
  'emojione',
  'emojione-v1',
  'emojione-monotone',
  'openmoji',
  'fxemoji',
  'fluent-emoji',
  'fluent-emoji-flat',
  'fluent-emoji-high-contrast',
  'catppuccin',
  'cryptocurrency-color',
  'cryptocurrency',
  'token-branded',
  'simple-icons-color',
  'streamline-color',
  'streamline-plump-color',
  'streamline-freehand-color',
  'streamline-flex-color',
  'streamline-sharp-color',
  'streamline-ultimate-color',
  'streamline-cyber-color',
  'streamline-kameleon-color',
  'streamline-stickies-color',
  'fluent-color',
])

export function detectIconStyle(icon: { name: string; library: string }): 'stroke' | 'solid' | 'duotone' | 'twotone' | 'sharp' | undefined {
  const nameLower = icon.name.toLowerCase()
  const libLower = icon.library.toLowerCase()

  if (nameLower.includes('duotone')) return 'duotone'
  if (nameLower.includes('twotone') || nameLower.includes('two-tone')) return 'twotone'
  if (nameLower.includes('sharp')) return 'sharp'
  if (
    nameLower.includes('solid') ||
    nameLower.includes('fill') ||
    nameLower.includes('bold') ||
    (libLower.includes('bootstrap') && nameLower.includes('fill')) ||
    (libLower.includes('remix') && nameLower.includes('fill'))
  ) {
    return 'solid'
  }
  if (
    nameLower.includes('outline') ||
    nameLower.includes('regular') ||
    nameLower.includes('light') ||
    nameLower.includes('thin') ||
    nameLower.includes('line') ||
    libLower.includes('lucide') ||
    libLower.includes('feather') ||
    libLower.includes('iconoir')
  ) {
    return 'stroke'
  }
  return undefined
}

export function detectIconColorModel(icon: { name: string; library: string; tags?: string[] }): 'mono' | 'multicolor' {
  const libLower = icon.library.toLowerCase()
  const cleanLib = libLower.replace(/^iconify-/, '')

  if (MULTICOLOR_LIBRARIES.has(libLower) || MULTICOLOR_LIBRARIES.has(cleanLib)) {
    return 'multicolor'
  }

  if (
    libLower.includes('color') ||
    libLower.includes('emoji') ||
    libLower.includes('flag') ||
    cleanLib.includes('color') ||
    cleanLib.includes('emoji') ||
    cleanLib.includes('flag')
  ) {
    return 'multicolor'
  }

  const tags = icon.tags || []
  if (
    tags.some((t) => {
      const tl = t.toLowerCase()
      return tl === 'multicolor' || tl === 'colored' || tl === 'multi-color' || tl === 'emoji' || tl === 'flags'
    })
  ) {
    return 'multicolor'
  }

  return 'mono'
}

export function normalizeLicenseGroup(lic?: string): string {
  if (!lic) return 'Other'
  const l = lic.trim().toUpperCase()
  if (l.includes('MIT')) return 'MIT'
  if (l.includes('APACHE')) return 'Apache-2.0'
  if (l.includes('CC0') || l.includes('PUBLIC DOMAIN') || l.includes('UNLICENSE') || l.includes('WTFPL')) return 'CC0'
  if (l.includes('OFL') || l.includes('SIL')) return 'OFL'
  if (l.includes('ISC')) return 'ISC'
  if (l.includes('CC-BY') || l.includes('CREATIVE COMMONS')) return 'CC-BY'
  if (l.includes('BSD')) return 'BSD'
  if (l.includes('GPL')) return 'GPL'
  return lic
}

let cachedIcons: SearchIcon[] | null = null
let cachedPopular: SearchIcon[] | null = null
let cachedLegal: SearchIcon[] | null = null
let cachedLegalPopular: SearchIcon[] | null = null
let cachedLegalSafeCount: number = 0

const API_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// Library popularity weights used for 'popular' sort order
const LIBRARY_POPULARITY: Record<string, number> = {
  'lucide-icons': 10,
  'heroicons': 9,
  'ant-design-icons': 8.5,
  'tabler-icons': 8,
  'patternfly-icons': 7.5,
  'untitled-ui-icons': 7.25,
  'phosphor-icons': 7,
  'remix-icon': 6,
  'bootstrap-icons': 5,
  'radix-icons': 4,
  'feather-icons': 3,
  'iconoir': 2,
  'devicons': 1,
  'teenyicons': 1,
  'circum-icons': 1,
  'elusive-icons': 1,
}

type Facets = {
  libraries: string[]
  licenses: string[]
  iconifySets: string[]
  styles: Record<string, number>
  colorModels: Record<string, number>
  licenseCounts: Record<string, number>
  sourceTypes: Record<string, number>
}

type NormalizableIcon = {
  library?: unknown
  name?: unknown
  previewUrls?: unknown
  svgUrl?: unknown
}

type SearchIcon = NormalizableIcon & {
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
  style?: 'stroke' | 'solid' | 'duotone' | 'twotone' | 'sharp'
  colorModel?: 'mono' | 'multicolor'
  isCurated?: boolean
}

let cachedFacets: {
  all: Facets
  legal: Facets
} | null = null

// Sliding window rate limiter (Phase 4 Upgrade)
const ipCache = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 120 // 120 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = ipCache.get(ip)
  if (!record) {
    ipCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }
  
  if (now > record.resetTime) {
    ipCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }
  
  record.count++
  return record.count > MAX_REQUESTS
}

function normalizePreviewUrls(icon: NormalizableIcon) {
  const library = typeof icon.library === 'string' ? icon.library : ''
  const name = typeof icon.name === 'string' ? icon.name : ''
  if (!library || !name) return

  const internalPath = `/api/svg/${encodeURIComponent(library)}/${encodeURIComponent(name.replace(/\.svg$/i, ''))}`
  icon.svgUrl = internalPath
  icon.previewUrls = [internalPath]
}

function computeFacetsForList(icons: SearchIcon[]): Facets {
  const allLibs = Array.from(new Set(icons.map((icon) => icon.library))).sort()
  const allLics = Array.from(
    new Set(icons.map((icon) => icon.license).filter((license): license is string => typeof license === 'string'))
  ).sort()
  const allSets = allLibs
    .filter((name) => name.startsWith('iconify-'))
    .map((name) => name.replace(/^iconify-/, ''))
    .sort()

  const styles: Record<string, number> = { stroke: 0, solid: 0, duotone: 0, twotone: 0, sharp: 0 }
  const colorModels: Record<string, number> = { mono: 0, multicolor: 0 }
  const licenseCounts: Record<string, number> = { MIT: 0, 'Apache-2.0': 0, CC0: 0, OFL: 0, ISC: 0, Other: 0 }
  const sourceTypes: Record<string, number> = { curated: 0, iconify: 0 }

  for (let i = 0; i < icons.length; i++) {
    const icon = icons[i]
    if (icon.style && styles[icon.style] !== undefined) {
      styles[icon.style]++
    }
    if (icon.colorModel && colorModels[icon.colorModel] !== undefined) {
      colorModels[icon.colorModel]++
    }
    if (icon.isCurated) {
      sourceTypes.curated++
    } else {
      sourceTypes.iconify++
    }
    const normLic = normalizeLicenseGroup(icon.license)
    if (licenseCounts[normLic] !== undefined) {
      licenseCounts[normLic]++
    } else {
      licenseCounts.Other = (licenseCounts.Other || 0) + 1
    }
  }

  return {
    libraries: allLibs,
    licenses: allLics,
    iconifySets: allSets,
    styles,
    colorModels,
    licenseCounts,
    sourceTypes,
  }
}

export function loadIcons() {
  if (cachedIcons) return cachedIcons
  const start = Date.now()
  console.log(`Loading ${SEARCHABLE_ICON_COUNT.toLocaleString('en-US')} icon database into server memory cache...`)
  
  const canonicalPathGz = join(process.cwd(), 'data/canonical-icon-search.json.gz')
  if (existsSync(canonicalPathGz)) {
    try {
      const compressedData = readFileSync(canonicalPathGz)
      const decompressedData = gunzipSync(compressedData).toString('utf-8')
      const list = JSON.parse(decompressedData)
      const parsedList = Array.isArray(list) ? (list as SearchIcon[]) : []
      
      // Helper to convert kebab/snake cases to PascalCase
      const toPascalCase = (str: string) => {
        return str.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
      }

      // Map dynamic Iconify subsets to native, first-class libraries
      parsedList.forEach(icon => {
        if (icon.library === 'iconify-ion') {
          icon.library = 'ionicons'
          icon.libraryName = 'IonIcons'
          icon.npmPackage = 'react-ionicons'
          const compName = toPascalCase(icon.name) + 'Outline'
          icon.reactImport = `import { ${compName} } from 'react-ionicons'`
          icon.reactUsage = `<${compName} color="#818cf8" height="24px" width="24px" />`
        } else if (icon.library === 'iconify-octicon') {
          icon.library = 'octicons'
          icon.libraryName = 'Octicons'
          icon.npmPackage = '@primer/octicons-react'
          const compName = toPascalCase(icon.name) + 'Icon'
          icon.reactImport = `import { ${compName} } from '@primer/octicons-react'`
          icon.reactUsage = `<${compName} size={16} />`
        } else if (icon.library === 'iconify-ant-design') {
          icon.library = 'ant-design-icons'
          icon.libraryName = 'Ant Design Icons'
          icon.npmPackage = '@ant-design/icons'
          
          // Determine variant for React import based on name
          let suffix = 'Outlined'
          if (icon.name.endsWith('-fill') || icon.name.endsWith('-filled')) {
            suffix = 'Filled'
            icon.name = icon.name.replace(/-filled?$/, '')
          } else if (icon.name.endsWith('-twotone') || icon.name.endsWith('-two-tone')) {
            suffix = 'TwoTone'
            icon.name = icon.name.replace(/-two-tone$/, '').replace(/-twotone$/, '')
          } else if (icon.name.endsWith('-outline') || icon.name.endsWith('-outlined')) {
            suffix = 'Outlined'
            icon.name = icon.name.replace(/-outlined?$/, '')
          }
          
          const compName = toPascalCase(icon.name) + suffix
          icon.reactImport = `import { ${compName} } from '@ant-design/icons'`
          icon.reactUsage = `<${compName} style={{ fontSize: '24px' }} />`
        }

        icon.style = detectIconStyle(icon)
        icon.colorModel = detectIconColorModel(icon)
        icon.isCurated = NAMED_LIBRARY_ID_SET.has(icon.library.toLowerCase()) || !icon.library.startsWith('iconify-')

        normalizePreviewUrls(icon)
      })

      // Pre-sort alphabetically once on startup to optimize future default/alphabetical requests
      console.log('Pre-sorting icons alphabetically...')
      parsedList.sort((a, b) => a.name.localeCompare(b.name))
      
      cachedIcons = parsedList

      // Pre-compute static facets to optimize query execution latency
      console.log('Pre-computing static search facets...')
      const legalList = parsedList.filter((icon) => Boolean(icon.legalSafe))

      cachedFacets = {
        all: computeFacetsForList(parsedList),
        legal: computeFacetsForList(legalList),
      }

      // Pre-compute popularity-sorted and legal-safe subsets to eliminate per-request sorting
      console.log('Pre-computing popularity-sorted and legal-safe cached subsets...')
      cachedPopular = [...parsedList].sort((a, b) => {
        const pa = LIBRARY_POPULARITY[a.library] || 0
        const pb = LIBRARY_POPULARITY[b.library] || 0
        if (pa !== pb) return pb - pa
        return a.name.localeCompare(b.name)
      })
      cachedLegal = legalList // already alphabetically sorted (filtered from sorted parsedList)
      cachedLegalPopular = [...legalList].sort((a, b) => {
        const pa = LIBRARY_POPULARITY[a.library] || 0
        const pb = LIBRARY_POPULARITY[b.library] || 0
        if (pa !== pb) return pb - pa
        return a.name.localeCompare(b.name)
      })
      cachedLegalSafeCount = legalList.length

      console.log(`Successfully compiled in-memory index: ${cachedIcons.length} icons in ${Date.now() - start}ms`)
      return cachedIcons
    } catch (e) {
      console.error('Error loading canonical database:', e)
    }
  }
  
  cachedIcons = []
  cachedFacets = {
    all: { libraries: [], licenses: [], iconifySets: [], styles: {}, colorModels: {}, licenseCounts: {}, sourceTypes: {} },
    legal: { libraries: [], licenses: [], iconifySets: [], styles: {}, colorModels: {}, licenseCounts: {}, sourceTypes: {} },
  }
  return cachedIcons
}

export async function GET(request: Request) {
  const startTime = performance.now()
  const { searchParams } = new URL(request.url)

  // 1. IP Abuse Protection / Rate Limiting (Phase 4 Upgrade)
  const clientIp = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1'
  
  if (isRateLimited(clientIp)) {
    console.warn(`[API Rate Limit] Blocked IP: ${clientIp} due to high search query hits`)
    return new NextResponse(
      JSON.stringify({ error: 'Too Many Requests', message: 'You have exceeded your rate limit of 120 requests per minute.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
          ...API_CORS_HEADERS,
        }
      }
    )
  }

  const idsParam = searchParams.get('ids') || ''
  const query = searchParams.get('q')?.toLowerCase().trim() || ''
  const lib = searchParams.get('lib') || 'all'
  const iconifySet = searchParams.get('iconifySet') || 'all'
  const sourceSet = searchParams.get('sourceSet') || 'all'
  const sourceType = searchParams.get('sourceType') || 'all'
  const style = searchParams.get('style') || 'all'
  const colorModel = searchParams.get('colorModel') || 'all'
  const license = searchParams.get('license') || 'all'
  const category = searchParams.get('category') || 'all'
  const legalOnly = searchParams.get('legalOnly') !== '0'
  const page = parseInt(searchParams.get('page') || '1', 10)
  
  const defaultLimit = idsParam ? 200 : 80
  const limit = parseInt(searchParams.get('limit') || String(defaultLimit), 10)
  const sort = searchParams.get('sort') || 'relevance'
  const searchIntent = buildIconSearchIntent(query)

  const allIcons = loadIcons()

  // Fast-path: when no filters are active, serve directly from pre-computed cached arrays
  const noFilters =
    !query &&
    !idsParam &&
    lib === 'all' &&
    style === 'all' &&
    colorModel === 'all' &&
    license === 'all' &&
    sourceType === 'all' &&
    category === 'all' &&
    iconifySet === 'all' &&
    sourceSet === 'all'

  if (noFilters) {
    let source: SearchIcon[]
    if (legalOnly && sort === 'popular') {
      source = cachedLegalPopular!
    } else if (legalOnly) {
      source = cachedLegal!
    } else if (sort === 'popular') {
      source = cachedPopular!
    } else {
      source = allIcons
    }

    const total = source.length
    const paginated = source.slice((page - 1) * limit, page * limit)
    const legalSafeCount = legalOnly ? total : cachedLegalSafeCount
    const facets = legalOnly ? cachedFacets?.legal : cachedFacets?.all

    const elapsed = (performance.now() - startTime).toFixed(2)
    console.log(`[API Search] query: "(fast-path)", results: ${total}, taken: ${elapsed}ms`)

    return NextResponse.json({
      icons: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      catalogStats: {
        totalIcons: SEARCHABLE_ICON_COUNT,
        namedLibraries: NAMED_LIBRARY_COUNT,
        iconifyIcons: ICONIFY_ICON_COUNT,
        iconifyCollections: ICONIFY_COLLECTION_COUNT,
        sourceSets: ICON_SOURCE_SET_COUNT,
      },
      facets: {
        libraries: facets?.libraries || [],
        libraryOptions: LIBRARY_OPTIONS,
        licenses: facets?.licenses || [],
        iconifySets: facets?.iconifySets || [],
        sourceSets: ICON_SOURCE_SET_OPTIONS,
        legalSafeCount,
        legalOnlyApplied: legalOnly,
        styles: facets?.styles || { stroke: 0, solid: 0, duotone: 0, twotone: 0, sharp: 0 },
        colorModels: facets?.colorModels || { mono: 0, multicolor: 0 },
        licenseCounts: facets?.licenseCounts || {},
        licensesCount: facets?.licenseCounts || {},
        sourceTypes: facets?.sourceTypes || { curated: 0, iconify: 0 },
      }
    }, {
      headers: {
        ...API_CORS_HEADERS,
        'X-Response-Time': `${elapsed}ms`
      }
    })
  }
  
  let filtered = allIcons

  if (idsParam) {
    const idList = idsParam.split(',').filter(Boolean)
    const idSet = new Set(idList)
    filtered = filtered.filter(icon => idSet.has(icon.id))
  } else {
    if (legalOnly) {
      filtered = filtered.filter(icon => Boolean(icon.legalSafe))
    }

    // 1. Source Type Filter (Curated Named Libraries vs Full Iconify Catalog)
    if (sourceType === 'curated') {
      filtered = filtered.filter(icon => Boolean(icon.isCurated))
    } else if (sourceType === 'iconify') {
      filtered = filtered.filter(icon => !icon.isCurated || icon.library.startsWith('iconify-'))
    }

    // 2. Canonical Source Set Filter
    if (sourceSet !== 'all') {
      const normalizedSourceSet = sourceSet.toLowerCase()
      filtered = filtered.filter(icon => getIconSourceSetId(icon.library) === normalizedSourceSet)
    }
    
    // 3. Library Filter
    if (lib !== 'all') {
      if (lib === 'iconify') {
        filtered = filtered.filter(icon => icon.library.startsWith('iconify-'))
        if (iconifySet !== 'all') {
          const normalized = `iconify-${iconifySet}`.toLowerCase()
          filtered = filtered.filter(icon => icon.library.toLowerCase() === normalized)
        }
      } else {
        const requestedLibrary = LIBRARY_FILTER_ALIASES[lib.toLowerCase()] || lib.toLowerCase()
        const cleanLib = requestedLibrary.replace(/^iconify-/, '')
        filtered = filtered.filter(icon => {
          const iconLib = icon.library.toLowerCase()
          const iconClean = iconLib.replace(/^iconify-/, '')
          return iconLib === requestedLibrary || iconClean === cleanLib
        })
      }
    }
    
    // 4. Style Filter
    if (style !== 'all') {
      const targetStyle = style.toLowerCase()
      filtered = filtered.filter(icon => icon.style === targetStyle)
    }

    // 5. Color Model Filter (Monochromatic vs Multi-color)
    if (colorModel !== 'all') {
      const targetColorModel = colorModel.toLowerCase()
      filtered = filtered.filter(icon => icon.colorModel === targetColorModel)
    }

    // 6. License Filter
    if (license !== 'all') {
      const licLower = license.toLowerCase().trim()
      filtered = filtered.filter(icon => {
        const iconLic = (icon.license || '').toLowerCase()
        if (licLower === 'mit') return iconLic.includes('mit')
        if (licLower === 'apache-2.0' || licLower === 'apache') return iconLic.includes('apache')
        if (licLower === 'cc0' || licLower === 'public domain') {
          return iconLic.includes('cc0') || iconLic.includes('public domain') || iconLic.includes('unlicense') || iconLic.includes('wtfpl')
        }
        if (licLower === 'ofl' || licLower === 'sil ofl') return iconLic.includes('ofl') || iconLic.includes('sil')
        if (licLower === 'isc') return iconLic.includes('isc')
        if (licLower === 'cc-by') return iconLic.includes('cc-by')
        return iconLic === licLower || iconLic.includes(licLower)
      })
    }
    
    // 7. Category Filter with Tag Mapping
    if (category !== 'all') {
      const catLower = category.toLowerCase()
      const aliases: Record<string, string[]> = {
        'alert': ['alert', 'warning', 'info', 'bell', 'clock', 'alarm', 'shield', 'danger', 'triangle', 'octagon'],
        'users': ['user', 'profile', 'group', 'avatar', 'people', 'person', 'users', 'contact'],
        'buildings': ['home', 'building', 'house', 'office', 'store', 'warehouse', 'hotel', 'map', 'pin'],
      }
      const keywords = CATEGORY_KEYWORDS_MAP[catLower] || aliases[catLower] || [catLower]
      if (keywords.length > 0) {
        filtered = filtered.filter((icon) => {
          const iconTags = icon.tags || []
          const iconName = icon.name.toLowerCase()
          return keywords.some((kw) => {
            const kwLower = kw.toLowerCase()
            return (
              iconTags.some((t: string) => t.toLowerCase() === kwLower) ||
              iconName.includes(kwLower)
            )
          })
        })
      }
    }
    
    // 8. Search Query Filter
    if (query) {
      filtered = filtered.filter((icon) => iconMatchesIntent(icon, searchIntent))
    }
  }

  // Fast single-pass dynamic facet aggregation over filtered results
  const styleFacetCounts: Record<string, number> = { stroke: 0, solid: 0, duotone: 0, twotone: 0, sharp: 0 }
  const colorModelFacetCounts: Record<string, number> = { mono: 0, multicolor: 0 }
  const licenseFacetCounts: Record<string, number> = { MIT: 0, 'Apache-2.0': 0, CC0: 0, OFL: 0, ISC: 0, Other: 0 }
  const sourceTypeFacetCounts: Record<string, number> = { curated: 0, iconify: 0 }

  for (let i = 0; i < filtered.length; i++) {
    const icon = filtered[i]
    if (icon.style && styleFacetCounts[icon.style] !== undefined) {
      styleFacetCounts[icon.style]++
    }
    if (icon.colorModel && colorModelFacetCounts[icon.colorModel] !== undefined) {
      colorModelFacetCounts[icon.colorModel]++
    }
    if (icon.isCurated) {
      sourceTypeFacetCounts.curated++
    } else {
      sourceTypeFacetCounts.iconify++
    }
    const normLic = normalizeLicenseGroup(icon.license)
    if (licenseFacetCounts[normLic] !== undefined) {
      licenseFacetCounts[normLic]++
    } else {
      licenseFacetCounts.Other = (licenseFacetCounts.Other || 0) + 1
    }
  }

  // 9. Sorting
  if (sort === 'relevance' && query) {
    const intentScores = new Map(filtered.map((icon) => [icon, scoreIconIntent(icon, searchIntent)]))
    filtered.sort((a, b) => {
      const scoreDifference = (intentScores.get(b) || 0) - (intentScores.get(a) || 0)
      if (scoreDifference !== 0) return scoreDifference
      const popularityDifference = (LIBRARY_POPULARITY[b.library] || 0) - (LIBRARY_POPULARITY[a.library] || 0)
      if (popularityDifference !== 0) return popularityDifference
      return a.name.localeCompare(b.name)
    })
  } else if (sort === 'popular') {
    // Since we are sorting, prevent mutating the global memory cache if no filters were applied
    const toSort = filtered === allIcons ? [...filtered] : filtered
    toSort.sort((a, b) => {
      const pa = LIBRARY_POPULARITY[a.library] || 0
      const pb = LIBRARY_POPULARITY[b.library] || 0
      if (pa !== pb) return pb - pa
      return a.name.localeCompare(b.name)
    })
    filtered = toSort
  } else {
    // Default or 'alphabetical'
    // Since the master list is pre-sorted alphabetically on load and JS filter() preserves order,
    // we don't need to do anything here! This is a massive CPU optimization.
  }

  const legalSafeCount = filtered.filter((icon) => icon.legalSafe).length
  
  const total = filtered.length
  const paginated = filtered.slice((page - 1) * limit, page * limit)
  
  const baseFacets = legalOnly ? cachedFacets?.legal : cachedFacets?.all

  const elapsed = (performance.now() - startTime).toFixed(2)
  console.log(`[API Search] query: "${query || idsParam || '(none)'}", results: ${total}, taken: ${elapsed}ms`)

  return NextResponse.json({
    icons: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    catalogStats: {
      totalIcons: SEARCHABLE_ICON_COUNT,
      namedLibraries: NAMED_LIBRARY_COUNT,
      iconifyIcons: ICONIFY_ICON_COUNT,
      iconifyCollections: ICONIFY_COLLECTION_COUNT,
      sourceSets: ICON_SOURCE_SET_COUNT,
    },
    query: {
      raw: query,
      interpretedAs: describeIconSearchIntent(searchIntent),
    },
    facets: {
      libraries: baseFacets?.libraries || [],
      libraryOptions: LIBRARY_OPTIONS,
      licenses: baseFacets?.licenses || [],
      iconifySets: baseFacets?.iconifySets || [],
      sourceSets: ICON_SOURCE_SET_OPTIONS,
      legalSafeCount,
      legalOnlyApplied: legalOnly,
      styles: styleFacetCounts,
      colorModels: colorModelFacetCounts,
      licenseCounts: licenseFacetCounts,
      licensesCount: licenseFacetCounts,
      sourceTypes: sourceTypeFacetCounts,
    }
  }, {
    headers: {
      ...API_CORS_HEADERS,
      'X-Response-Time': `${elapsed}ms`
    }
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: API_CORS_HEADERS,
  })
}

// Module-level Cache Startup Warmup (Phase 4 Upgrade)
loadIcons()
