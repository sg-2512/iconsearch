import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'
import { NextResponse } from 'next/server'
import { publicOptions, publicJson } from '@/lib/device-auth'

export const runtime = 'nodejs'

const SVG_HEADERS = {
  'Content-Type': 'image/svg+xml; charset=utf-8',
  'Cache-Control': 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-iconsearch-product',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

// Keep the runtime cache outside the project tree so output tracing cannot
// accidentally bundle the entire repository into this server function.
const CACHE_DIR = path.join(tmpdir(), 'iconsearch', 'svgs')

function isSafeSegment(value: string) {
  return /^[a-z0-9][a-z0-9._-]*$/i.test(value)
}

function normalizeName(name: string) {
  return name.replace(/\.svg$/i, '').replace(/_/g, '-').trim()
}

function sanitizeSvg(svg: string): string {
  if (!/^<svg\b/i.test(svg.trim())) return ''

  let clean = svg
    .replace(/<\?[\s\S]*?\?>/g, '')
    .replace(/<!doctype[\s\S]*?>/gi, '')
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<foreignObject\b[\s\S]*?<\/foreignObject\s*>/gi, '')
    .replace(/<link\b[\s\S]*?>/gi, '')
    .replace(/\s(on[a-z]+)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s(?:href|xlink:href)\s*=\s*(["'])\s*javascript:[\s\S]*?\1/gi, '')
    .trim()

  if (!/\sxmlns=/.test(clean)) {
    clean = clean.replace(/^<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg"')
  }

  return clean
}

function customizeSvg(svg: string, request: Request) {
  const { searchParams } = new URL(request.url)
  const requestedSize = Number.parseInt(searchParams.get('width') || '', 10)
  const size = Number.isFinite(requestedSize) ? Math.min(512, Math.max(8, requestedSize)) : null
  const requestedColor = searchParams.get('color') || ''
  const color = /^#[0-9a-f]{6}$/i.test(requestedColor) ? requestedColor.toUpperCase() : ''

  let customized = svg
  if (size) {
    customized = setSvgRootAttribute(customized, 'width', String(size))
    customized = setSvgRootAttribute(customized, 'height', String(size))
  }
  if (color) {
    customized = setSvgRootAttribute(customized, 'color', color).replace(/currentColor/gi, color)
  }
  return customized
}

function setSvgRootAttribute(svg: string, name: string, value: string) {
  const attributePattern = new RegExp(`\\s${name}\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]+)`, 'i')
  const attribute = ` ${name}="${value}"`
  return svg.replace(/<svg\b[^>]*>/i, (openingTag) =>
    attributePattern.test(openingTag)
      ? openingTag.replace(attributePattern, attribute)
      : openingTag.replace(/^<svg\b/i, `<svg${attribute}`),
  )
}

const LIBRARY_ALIASES: Record<string, string[]> = {
  // Akar Icons
  'akar-icons': ['akar-icons', 'akar'],
  akar: ['akar-icons', 'akar'],

  // Bootstrap Icons
  'bootstrap-icons': ['bi', 'bootstrap-icons', 'bootstrap'],
  bi: ['bi', 'bootstrap-icons', 'bootstrap'],
  bootstrap: ['bi', 'bootstrap-icons', 'bootstrap'],

  // Phosphor Icons
  'phosphor-icons': ['ph', 'phosphor-icons', 'phosphor'],
  ph: ['ph', 'phosphor-icons', 'phosphor'],
  phosphor: ['ph', 'phosphor-icons', 'phosphor'],

  // Remix Icon
  'remix-icon': ['ri', 'remix-icon', 'remixicon', 'remix-icons', 'remix'],
  'remix-icons': ['ri', 'remix-icon', 'remixicon', 'remix-icons', 'remix'],
  remixicon: ['ri', 'remix-icon', 'remixicon', 'remix-icons', 'remix'],
  ri: ['ri', 'remix-icon', 'remixicon', 'remix-icons', 'remix'],
  remix: ['ri', 'remix-icon', 'remixicon', 'remix-icons', 'remix'],

  // Ant Design Icons
  'ant-design': ['ant-design', 'ant-design-icons'],
  'ant-design-icons': ['ant-design', 'ant-design-icons'],

  // Radix Icons
  'radix-icons': ['radix-icons', 'radix-ui', 'radix'],
  'radix-ui': ['radix-icons', 'radix-ui', 'radix'],
  radix: ['radix-icons', 'radix-ui', 'radix'],

  // File Icons
  'file-icons': ['file-icons', 'file'],
  file: ['file-icons', 'file'],

  // Flag Icons
  'flag-icons': ['flag', 'flag-icons', 'circle-flags', 'flagpack'],
  flag: ['flag', 'flag-icons', 'circle-flags', 'flagpack'],

  // Lucide Icons
  'lucide-icons': ['lucide', 'lucide-icons'],
  lucide: ['lucide', 'lucide-icons'],

  // Tabler Icons
  'tabler-icons': ['tabler', 'tabler-icons'],
  tabler: ['tabler', 'tabler-icons'],

  // Feather Icons
  'feather-icons': ['feather', 'feather-icons', 'fe'],
  feather: ['feather', 'feather-icons', 'fe'],
  fe: ['feather', 'feather-icons', 'fe'],

  // Ionicons
  ionicons: ['ion', 'ionicons', 'ion-icons'],
  ion: ['ion', 'ionicons', 'ion-icons'],
  'ion-icons': ['ion', 'ionicons', 'ion-icons'],

  // Octicons
  octicons: ['octicon', 'octicons'],
  octicon: ['octicon', 'octicons'],

  // Devicons
  devicons: ['devicon', 'devicons', 'devicon-plain'],
  devicon: ['devicon', 'devicons', 'devicon-plain'],
  'devicon-plain': ['devicon-plain', 'devicon', 'devicons'],

  // Circum Icons
  'circum-icons': ['circum', 'circum-icons'],
  circum: ['circum', 'circum-icons'],

  // Elusive Icons
  'elusive-icons': ['el', 'elusive', 'elusive-icons'],
  elusive: ['el', 'elusive', 'elusive-icons'],
  el: ['el', 'elusive', 'elusive-icons'],

  // Teenyicons
  teenyicons: ['teenyicons', 'teeny'],
  teeny: ['teenyicons', 'teeny'],

  // Heroicons
  heroicons: ['heroicons', 'heroicons-outline', 'heroicons-solid'],
  'heroicons-outline': ['heroicons-outline', 'heroicons'],
  'heroicons-solid': ['heroicons-solid', 'heroicons'],

  // Weather Icons
  'weather-icons': ['wi', 'weather-icons', 'weather'],
  wi: ['wi', 'weather-icons', 'weather'],
  weather: ['wi', 'weather-icons', 'weather'],

  // VS Code Icons
  'vscode-icons': ['vscode-icons', 'vscode', 'vs'],
  vscode: ['vscode-icons', 'vscode', 'vs'],
  vs: ['vscode-icons', 'vscode', 'vs'],

  // Patternfly
  'patternfly-icons': ['patternfly-icons', 'patternfly'],
  patternfly: ['patternfly-icons', 'patternfly'],

  // Other libraries with -icons suffix
  'bitcoin-icons': ['bitcoin-icons', 'bitcoin'],
  bitcoin: ['bitcoin-icons', 'bitcoin'],
  'dinkie-icons': ['dinkie-icons', 'dinkie'],
  dinkie: ['dinkie-icons', 'dinkie'],
  'duo-icons': ['duo-icons', 'duo'],
  duo: ['duo-icons', 'duo'],
  'eos-icons': ['eos-icons', 'eos'],
  eos: ['eos-icons', 'eos'],
  'flat-color-icons': ['flat-color-icons', 'flat-color'],
  'flat-color': ['flat-color-icons', 'flat-color'],
  'game-icons': ['game-icons', 'game'],
  game: ['game-icons', 'game'],
  'grommet-icons': ['grommet-icons', 'grommet'],
  grommet: ['grommet-icons', 'grommet'],
  'lets-icons': ['lets-icons', 'lets'],
  lets: ['lets-icons', 'lets'],
  'mono-icons': ['mono-icons', 'mono'],
  mono: ['mono-icons', 'mono'],
  'rivet-icons': ['rivet-icons', 'rivet'],
  rivet: ['rivet-icons', 'rivet'],
  'simple-icons': ['simple-icons', 'simple'],
  simple: ['simple-icons', 'simple'],
  'simple-line-icons': ['simple-line-icons', 'simple-line'],
  'simple-line': ['simple-line-icons', 'simple-line'],
  'skill-icons': ['skill-icons', 'skill'],
  skill: ['skill-icons', 'skill'],
}

function findLocalSvgFile(library: string, name: string): string {
  const normalizedLib = library.replace(/^iconify-/i, '').toLowerCase().replace(/_/g, '-')
  const aliases = new Set([normalizedLib, ...(LIBRARY_ALIASES[normalizedLib] || [])])
  const nameVariants = Array.from(new Set([name, name.replace(/_/g, '-'), name.replace(/-/g, '_')]))

  if (aliases.has('patternfly-icons') || aliases.has('patternfly')) {
    for (const n of nameVariants) {
      const candidate = path.join(
        process.cwd(),
        'node_modules',
        '@patternfly',
        'react-icons',
        'dist',
        'static',
        `${n}.svg`,
      )
      if (existsSync(candidate)) return candidate
    }
  }

  if (aliases.has('bootstrap-icons') || aliases.has('bi') || aliases.has('bootstrap')) {
    for (const n of nameVariants) {
      const candidate = path.join(
        process.cwd(),
        'node_modules',
        'bootstrap-icons',
        'icons',
        `${n}.svg`,
      )
      if (existsSync(candidate)) return candidate
    }
  }

  if (aliases.has('untitled-ui-icons') || aliases.has('untitled-ui') || aliases.has('untitledui')) {
    for (const n of nameVariants) {
      const candidate = path.join(process.cwd(), 'public', 'untitled-ui-icons', `${n}.svg`)
      if (existsSync(candidate)) return candidate
    }
  }

  return ''
}

function getUpstreamCandidateUrls(library: string, name: string): string[] {
  const candidates = new Set<string>()
  const rawVariants = Array.from(new Set([name, name.replace(/_/g, '-'), name.replace(/-/g, '_')]))
  const variants: string[] = []
  for (const v of rawVariants) {
    variants.push(v)
    if (!v.endsWith('-outline') && !v.endsWith('-solid') && !v.endsWith('-regular') && !v.endsWith('-filled')) {
      variants.push(`${v}-outline`, `${v}-solid`, `${v}-regular`, `${v}-filled`, `${v}-line`, `${v}-fill`)
    }
  }

  const add = (url: string) => candidates.add(url)

  const baseLib = library.replace(/^iconify-/i, '').toLowerCase()
  const normalizedLib = baseLib.replace(/_/g, '-')
  const strippedLib = normalizedLib.replace(/-icons?$/, '')
  const withIconsLib = strippedLib.endsWith('-icons') ? strippedLib : `${strippedLib}-icons`
  const withIconLib = strippedLib.endsWith('-icon') ? strippedLib : `${strippedLib}-icon`

  const prefixSet = new Set<string>()
  if (library.startsWith('iconify-')) {
    prefixSet.add(baseLib)
  }
  const aliases = LIBRARY_ALIASES[normalizedLib] || LIBRARY_ALIASES[baseLib]
  if (aliases) {
    for (const a of aliases) prefixSet.add(a)
  }
  prefixSet.add(normalizedLib)
  prefixSet.add(strippedLib)
  prefixSet.add(withIconsLib)
  prefixSet.add(withIconLib)

  const prefixes = Array.from(prefixSet)

  // Primary: standard Iconify URLs for each prefix and variant
  for (const prefix of prefixes) {
    for (const v of variants) {
      add(`https://api.iconify.design/${prefix}/${v}.svg`)
    }
  }

  // Secondary: CDN / package fallbacks for specific icon collections
  const allAliases = new Set(prefixes)

  if (allAliases.has('ant-design') || allAliases.has('ant-design-icons')) {
    for (const v of variants) {
      add(`https://api.iconify.design/ant-design/${v}-outlined.svg`)
      add(`https://api.iconify.design/ant-design/${v}-filled.svg`)
    }
  }

  if (allAliases.has('lucide') || allAliases.has('lucide-icons')) {
    for (const v of variants) {
      add(`https://cdn.jsdelivr.net/npm/lucide-static/icons/${v}.svg`)
    }
  }

  if (allAliases.has('tabler') || allAliases.has('tabler-icons')) {
    for (const v of variants) {
      add(`https://cdn.jsdelivr.net/npm/@tabler/icons/icons/${v}.svg`)
    }
  }

  if (allAliases.has('ph') || allAliases.has('phosphor-icons') || allAliases.has('phosphor')) {
    for (const v of variants) {
      add(`https://cdn.jsdelivr.net/npm/@phosphor-icons/core/assets/regular/${v}.svg`)
    }
  }

  if (allAliases.has('feather') || allAliases.has('feather-icons') || allAliases.has('fe')) {
    for (const v of variants) {
      add(`https://unpkg.com/feather-icons/dist/icons/${v}.svg`)
    }
  }

  if (allAliases.has('devicon') || allAliases.has('devicons') || allAliases.has('devicon-plain')) {
    for (const v of variants) {
      add(`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${v}/${v}-original.svg`)
    }
  }

  if (allAliases.has('heroicons') || allAliases.has('heroicons-outline') || allAliases.has('heroicons-solid')) {
    for (const v of variants) {
      add(`https://api.iconify.design/heroicons-outline/${v}.svg`)
      add(`https://api.iconify.design/heroicons-solid/${v}.svg`)
    }
  }

  return Array.from(candidates)
}

async function fetchAndCacheUpstream(library: string, name: string): Promise<string> {
  const candidates = getUpstreamCandidateUrls(library, name)
  for (const url of candidates) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'IconSearch-Server/1.0' },
        signal: AbortSignal.timeout(5000),
      })
      if (!response.ok) continue
      const text = await response.text()
      const cleanSvg = sanitizeSvg(text)
      if (!cleanSvg) continue

      try {
        const libDir = path.join(CACHE_DIR, library)
        if (!existsSync(libDir)) {
          mkdirSync(libDir, { recursive: true })
        }
        const cachePath = path.join(libDir, `${name}.svg`)
        writeFileSync(cachePath, cleanSvg, 'utf8')
      } catch {
        // Disk write failed (e.g. read-only serverless filesystem), safely ignore
      }

      return cleanSvg
    } catch {
      // Continue to next candidate
    }
  }

  return ''
}


export function OPTIONS() {
  return publicOptions()
}

export async function GET(
  request: Request,
  context: { params: Promise<{ library: string; name: string }> }
) {
  // Validate route parameters
  const { library, name: rawName } = await context.params
  const name = normalizeName(rawName)

  if (!isSafeSegment(library) || !isSafeSegment(name)) {
    return publicJson({ error: 'Invalid icon path parameters.' }, { status: 400 })
  }


  // 3. Resolve from local package / public directory
  const localFile = findLocalSvgFile(library, name)
  if (localFile) {
    const rawContent = readFileSync(localFile, 'utf8')
    return new NextResponse(customizeSvg(sanitizeSvg(rawContent), request), { status: 200, headers: SVG_HEADERS })
  }

  // 4. Resolve from server disk cache
  const cachePath = path.join(CACHE_DIR, library, `${name}.svg`)
  if (existsSync(cachePath)) {
    const cachedContent = readFileSync(cachePath, 'utf8')
    return new NextResponse(customizeSvg(cachedContent, request), { status: 200, headers: SVG_HEADERS })
  }

  // 5. Upstream server-side fetch & cache
  const fetchedContent = await fetchAndCacheUpstream(library, name)
  if (fetchedContent) {
    return new NextResponse(customizeSvg(fetchedContent, request), { status: 200, headers: SVG_HEADERS })
  }

  return publicJson({ error: 'Icon SVG not found.' }, { status: 404 })
}
