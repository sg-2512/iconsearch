import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { gunzipSync } from 'zlib'

let cachedIcons: any[] | null = null

function loadIcons() {
  if (cachedIcons) return cachedIcons
  const start = Date.now()
  console.log('Loading 360,000+ Icon database into server memory cache...')
  
  const canonicalPathGz = join(process.cwd(), 'data/canonical-icon-search.json.gz')
  if (existsSync(canonicalPathGz)) {
    try {
      const compressedData = readFileSync(canonicalPathGz)
      const decompressedData = gunzipSync(compressedData).toString('utf-8')
      const list = JSON.parse(decompressedData)
      const parsedList = Array.isArray(list) ? list : []
      
      // Pre-sort alphabetically once on startup to optimize future default/alphabetical requests
      console.log('Pre-sorting icons alphabetically...')
      parsedList.sort((a, b) => a.name.localeCompare(b.name))
      
      cachedIcons = parsedList
      console.log(`Successfully compiled in-memory index: ${cachedIcons.length} icons in ${Date.now() - start}ms`)
      return cachedIcons
    } catch (e) {
      console.error('Error loading canonical database:', e)
    }
  }
  
  cachedIcons = []
  return cachedIcons
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const idsParam = searchParams.get('ids') || ''
  const query = searchParams.get('q')?.toLowerCase().trim() || ''
  const lib = searchParams.get('lib') || 'all'
  const iconifySet = searchParams.get('iconifySet') || 'all'
  const style = searchParams.get('style') || 'all'
  const category = searchParams.get('category') || 'all'
  const legalOnly = searchParams.get('legalOnly') !== '0'
  const page = parseInt(searchParams.get('page') || '1', 10)
  
  const defaultLimit = idsParam ? 200 : 80
  const limit = parseInt(searchParams.get('limit') || String(defaultLimit), 10)
  const sort = searchParams.get('sort') || 'relevance'

  const allIcons = loadIcons()
  
  let filtered = allIcons

  if (idsParam) {
    const idList = idsParam.split(',').filter(Boolean)
    const idSet = new Set(idList)
    filtered = filtered.filter(icon => idSet.has(icon.id))
  } else {
    if (legalOnly) {
      filtered = filtered.filter(icon => Boolean(icon.legalSafe))
    }
    
    // 1. Library Filter
    if (lib !== 'all') {
      if (lib === 'iconify') {
        filtered = filtered.filter(icon => icon.library.startsWith('iconify-'))
        if (iconifySet !== 'all') {
          const normalized = `iconify-${iconifySet}`.toLowerCase()
          filtered = filtered.filter(icon => icon.library.toLowerCase() === normalized)
        }
      } else {
        filtered = filtered.filter(icon => icon.library === lib)
      }
    }
    
    // 2. Style Filter
    if (style !== 'all') {
      filtered = filtered.filter(icon => {
        const nameLower = icon.name.toLowerCase()
        const libLower = icon.library.toLowerCase()
        if (style === 'solid') {
          return nameLower.includes('solid') || nameLower.includes('fill') || nameLower.includes('bold') ||
                 libLower.includes('bootstrap') && nameLower.includes('fill') ||
                 libLower.includes('remix') && nameLower.includes('fill')
        } else if (style === 'duotone') {
          return nameLower.includes('duotone')
        } else if (style === 'twotone') {
          return nameLower.includes('twotone') || nameLower.includes('two-tone')
        } else if (style === 'stroke') {
          return nameLower.includes('outline') || nameLower.includes('regular') || nameLower.includes('light') || 
                 nameLower.includes('thin') || nameLower.includes('line') || libLower.includes('lucide') || 
                 libLower.includes('feather') || libLower.includes('iconoir')
        } else if (style === 'sharp') {
          return nameLower.includes('sharp')
        }
        return true
      })
    }
    
    // 3. Category Filter with Tag Mapping
    if (category !== 'all') {
      const CATEGORY_MAP: Record<string, string[]> = {
        'ai': ['ai', 'brain', 'cpu', 'sparkles', 'bot', 'chip', 'robot', 'wand', 'magic'],
        'alert': ['alert', 'warning', 'info', 'bell', 'clock', 'alarm', 'shield', 'danger', 'triangle', 'octagon'],
        'arrows': ['arrow', 'chevron', 'direction', 'move', 'left', 'right', 'up', 'down', 'pointer', 'refresh', 'sync'],
        'media': ['play', 'music', 'video', 'sound', 'audio', 'volume', 'camera', 'image', 'picture', 'disc', 'film', 'mic'],
        'editor': ['edit', 'write', 'pen', 'align', 'format', 'list', 'trash', 'save', 'copy', 'paste', 'grid', 'table', 'columns'],
        'communication': ['mail', 'message', 'chat', 'phone', 'call', 'send', 'share', 'envelope', 'inbox'],
        'commerce': ['cart', 'shop', 'card', 'price', 'wallet', 'dollar', 'euro', 'money', 'bag', 'bank', 'coins', 'percent'],
        'weather': ['sun', 'cloud', 'rain', 'snow', 'wind', 'temp', 'weather', 'star', 'moon', 'leaf', 'tree', 'flower'],
        'devices': ['device', 'phone', 'computer', 'monitor', 'cpu', 'keyboard', 'laptop', 'tablet', 'wifi', 'battery', 'tv', 'plug'],
        'design': ['paint', 'brush', 'color', 'palette', 'ruler', 'pencil', 'layers', 'crop', 'bezier', 'vector'],
        'security': ['lock', 'shield', 'key', 'eye', 'secure', 'auth', 'unlock', 'password', 'keyhole', 'fingerprint'],
        'health': ['heart', 'plus', 'aid', 'medical', 'health', 'hospital', 'pill', 'activity', 'thermometer', 'pulse'],
        'users': ['user', 'profile', 'group', 'avatar', 'people', 'person', 'users', 'contact'],
        'buildings': ['home', 'building', 'house', 'office', 'store', 'warehouse', 'hotel', 'map', 'pin']
      }
      const keywords = CATEGORY_MAP[category] || []
      if (keywords.length > 0) {
        filtered = filtered.filter(icon => {
          const iconTags = icon.tags || []
          const iconName = icon.name.toLowerCase()
          return keywords.some(kw => {
            const kwLower = kw.toLowerCase()
            return iconTags.some((t: string) => t.toLowerCase() === kwLower) || iconName.includes(kwLower)
          })
        })
      }
    }
    
    // 4. Search Query Filter
    if (query) {
      const qParts = query.split(/\s+/).filter(Boolean)
      filtered = filtered.filter(icon => {
        const name = icon.name.toLowerCase()
        const tags = icon.tags ? icon.tags.map((t: string) => t.toLowerCase()) : []
        return qParts.every(part => name.includes(part) || tags.some((t: string) => t.includes(part)))
      })
    }
  }

  // 5. Sorting
  if (sort === 'relevance' && query) {
    filtered.sort((a, b) => {
      const aName = a.name.toLowerCase()
      const bName = b.name.toLowerCase()
      
      // 1. Exact Match
      if (aName === query && bName !== query) return -1
      if (bName === query && aName !== query) return 1
      
      // 2. Starts with Match
      const aStarts = aName.startsWith(query)
      const bStarts = bName.startsWith(query)
      if (aStarts && !bStarts) return -1
      if (bStarts && !aStarts) return 1
      
      // 3. Shorter name length (closer match)
      if (aStarts && bStarts) {
        return aName.length - bName.length
      }
      
      // 4. Default Alphabetical
      return aName.localeCompare(bName)
    })
  } else if (sort === 'popular') {
    const LIBRARY_POPULARITY: Record<string, number> = {
      'lucide-icons': 10,
      'heroicons': 9,
      'tabler-icons': 8,
      'phosphor-icons': 7,
      'remix-icon': 6,
      'bootstrap-icons': 5,
      'radix-icons': 4,
      'feather-icons': 3,
      'iconoir': 2,
    }
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

  const facetsSource = legalOnly ? allIcons.filter((icon) => Boolean(icon.legalSafe)) : allIcons
  const libraries = Array.from(new Set(facetsSource.map((icon) => icon.library))).sort()
  const licenses = Array.from(new Set(facetsSource.map((icon) => icon.license))).sort()
  const iconifySets = libraries
    .filter((name) => name.startsWith('iconify-'))
    .map((name) => name.replace(/^iconify-/, ''))
    .sort()
  const legalSafeCount = filtered.filter((icon) => icon.legalSafe).length
  
  const total = filtered.length
  const paginated = filtered.slice((page - 1) * limit, page * limit)
  
  return NextResponse.json({
    icons: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    facets: {
      libraries,
      licenses,
      iconifySets,
      legalSafeCount,
      legalOnlyApplied: legalOnly,
    }
  })
}
