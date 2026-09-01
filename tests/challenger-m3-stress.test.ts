import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import JSZip from 'jszip'
import {
  customizeSvg,
  generateReactComponent,
  generateReactSnippet,
  generateVueComponent,
  generateVueSnippet,
  generateSvelteComponent,
  generateSvelteSnippet,
  generateTailwindInlineSnippet,
  generateSvgSnippet,
  compileSvgSprite,
  toPascalCase,
  type CartItem,
  type ExportConfig,
  type ExportOptions,
  type FrameShape,
  type Icon,
} from '../lib/exporter'

// ── Diverse Sample SVGs ─────────────────────────────────────────────────────
const svgStrokeLucide = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`

const svgSolidHeroicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z" clip-rule="evenodd" /></svg>`

const svgDuotonePhosphor = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256"><path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2" class="duotone-secondary" fill="currentColor"/><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" fill="currentColor"/></svg>`

const svgLargeViewBox = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"/></svg>`

const svgNoViewBox = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"><circle cx="16" cy="16" r="12"/></svg>`

const svgComplexProps = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-dasharray="4 2" stroke-dashoffset="1" stroke-linecap="square" stroke-linejoin="miter"><polygon points="12 2 22 22 2 22"/></svg>`

const svgTemplates = [
  svgStrokeLucide,
  svgSolidHeroicon,
  svgDuotonePhosphor,
  svgLargeViewBox,
  svgNoViewBox,
  svgComplexProps,
]

// Helper to generate N realistic mock icons
function generateMockIcons(count: number): { item: CartItem; svg: string }[] {
  const libraries = [
    { lib: 'lucide-icons', name: 'Lucide Icons', pkg: 'lucide-react', lic: 'ISC' },
    { lib: 'heroicons', name: 'Heroicons', pkg: '@heroicons/react', lic: 'MIT' },
    { lib: 'tabler-icons', name: 'Tabler Icons', pkg: '@tabler/icons-react', lic: 'MIT' },
    { lib: 'phosphor-icons', name: 'Phosphor Icons', pkg: '@phosphor-icons/react', lic: 'MIT' },
    { lib: 'remix-icons', name: 'Remix Icon', pkg: 'remixicon', lic: 'Apache-2.0' },
    { lib: 'radix-icons', name: 'Radix Icons', pkg: '@radix-ui/react-icons', lic: 'MIT' },
    { lib: 'feather', name: 'Feather Icons', pkg: 'feather-icons', lic: 'MIT' },
    { lib: 'octicons', name: 'Octicons', pkg: '@primer/octicons-react', lic: 'MIT' },
  ]

  const baseNames = [
    'arrow-right', 'arrow-left', 'arrow-up', 'arrow-down', 'check', 'check-circle',
    'x', 'x-circle', 'user', 'user-plus', 'user-minus', 'settings', 'settings-2',
    'bell', 'bell-off', 'home', 'search', 'filter', 'calendar', 'clock',
    'folder', 'file', 'file-text', 'trash', 'trash-2', 'edit', 'edit-3',
    'copy', 'clipboard', 'share', 'share-2', 'download', 'upload', 'cloud',
    'mail', 'phone', 'message-square', 'camera', 'image', 'video', 'music',
    'heart', 'star', 'bookmark', 'tag', 'flag', 'shield', 'lock', 'unlock',
    'eye', 'eye-off', 'sun', 'moon', 'globe', 'compass', 'map-pin', 'navigation',
    'shopping-cart', 'credit-card', 'dollar-sign', 'percent', 'activity',
    'award', 'bar-chart', 'pie-chart', 'layers', 'grid', 'list', 'menu',
    'more-horizontal', 'more-vertical', 'power', 'refresh-cw', 'rotate-cw',
    'database', 'server', 'terminal', 'code', 'cpu', 'wifi', 'bluetooth',
    'battery', 'zap', 'alert-circle', 'alert-triangle', 'info', 'help-circle'
  ]

  const items: { item: CartItem; svg: string }[] = []

  for (let i = 0; i < count; i++) {
    const lib = libraries[i % libraries.length]
    const baseName = baseNames[i % baseNames.length]
    const iconName = i < baseNames.length ? baseName : `${baseName}-v${i}`
    const svgTemplate = svgTemplates[i % svgTemplates.length]
    const size = 16 + ((i * 4) % 32)
    const stroke = 1 + ((i * 0.25) % 2)
    const colors = ['#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b', '#06b6d4', 'currentColor']
    const color = colors[i % colors.length]

    const icon: Icon = {
      id: `${lib.lib}-${iconName}`,
      name: iconName,
      displayName: toPascalCase(iconName),
      library: lib.lib,
      libraryName: lib.name,
      npmPackage: lib.pkg,
      license: lib.lic,
      tags: ['icon', baseName, lib.lib],
      reactImport: `import { ${toPascalCase(iconName)} } from '${lib.pkg}'`,
      reactUsage: `<${toPascalCase(iconName)} size={24} />`,
      svgUrl: `/api/svg/${lib.lib}/${iconName}`,
      legalSafe: lib.lic === 'MIT' || lib.lic === 'Apache-2.0' || lib.lic === 'ISC',
    }

    const item: CartItem = {
      key: `${lib.lib}-${iconName}-${size}-${stroke}-${color}`,
      icon,
      size,
      stroke,
      color,
    }

    items.push({ item, svg: svgTemplate })
  }

  return items
}

// ── Synthetic JSZip Bundle Generator (Mirrors generateZipPackage core logic in memory) ──
async function buildZipArchive(
  items: { item: CartItem; svg: string }[],
  config: {
    packageName?: string
    formats: {
      svg?: boolean
      react?: boolean
      vue?: boolean
      svelte?: boolean
      tailwind?: boolean
      sprite?: boolean
    }
    usePreset?: boolean
    presetSize?: number
    presetStroke?: number
    presetColor?: string
    padding?: number
    frameShape?: FrameShape
    frameColor?: string
    frameStroke?: string
    frameStrokeWidth?: number
  }
): Promise<JSZip> {
  const zip = new JSZip()
  const metadataList: any[] = []

  const svgFolder = config.formats.svg ? zip.folder('svg') : null
  const reactFolder = config.formats.react ? zip.folder('react') : null
  const vueFolder = config.formats.vue ? zip.folder('vue') : null
  const svelteFolder = config.formats.svelte ? zip.folder('svelte') : null
  const tailwindFolder = config.formats.tailwind ? zip.folder('tailwind-html') : null

  for (const { item, svg } of items) {
    if (!svg) continue

    const size = config.usePreset ? (config.presetSize ?? 24) : item.size
    const stroke = config.usePreset ? (config.presetStroke ?? 2) : item.stroke
    const color = config.usePreset ? (config.presetColor ?? 'currentColor') : item.color

    const exportOptions: ExportOptions = {
      size,
      strokeWidth: stroke,
      color,
      padding: config.padding,
      frameShape: config.frameShape,
      frameColor: config.frameColor,
      frameStroke: config.frameStroke,
      frameStrokeWidth: config.frameStrokeWidth,
    }

    const customizedSvg = customizeSvg(svg, exportOptions)
    const componentName = toPascalCase(item.icon.name)

    if (svgFolder) {
      svgFolder.file(`${item.icon.name}.svg`, customizedSvg)
    }

    if (reactFolder) {
      reactFolder.file(`Icon${componentName}.tsx`, generateReactComponent(item.icon.name, customizedSvg))
    }

    if (vueFolder) {
      vueFolder.file(`Icon${componentName}.vue`, generateVueComponent(customizedSvg))
    }

    if (svelteFolder) {
      svelteFolder.file(`Icon${componentName}.svelte`, generateSvelteComponent(item.icon.name, customizedSvg))
    }

    if (tailwindFolder) {
      tailwindFolder.file(`${item.icon.name}.html`, generateTailwindInlineSnippet(customizedSvg))
    }

    metadataList.push({
      id: item.icon.id,
      name: item.icon.name,
      library: item.icon.library,
      libraryName: item.icon.libraryName,
      license: item.icon.license,
      legalSafe: Boolean(item.icon.legalSafe),
      exportedConfig: { size, stroke, color },
    })
  }

  if (config.formats.sprite) {
    const spriteContent = compileSvgSprite(
      items,
      Boolean(config.usePreset),
      config.presetStroke ?? 2,
      config.presetColor ?? 'currentColor'
    )
    zip.file('sprite.svg', spriteContent)
  }

  zip.file(
    'metadata.json',
    JSON.stringify(
      {
        packageName: config.packageName || 'icon-hub-package',
        exportedAt: new Date().toISOString(),
        totalIcons: items.length,
        configUsed: {
          usePreset: Boolean(config.usePreset),
          presetSize: config.usePreset ? config.presetSize : 'custom',
          presetStroke: config.usePreset ? config.presetStroke : 'custom',
          presetColor: config.usePreset ? config.presetColor : 'custom',
        },
        icons: metadataList,
      },
      null,
      2
    )
  )

  return zip
}

describe('Challenger M3 Empirical Verification: JSZip Multi-Icon Bundling & SVG Idempotency', () => {

  // ══════════════════════════════════════════════════════════════════════════
  // TASK 1: STRESS TEST MULTI-ICON JSZIP PACKAGE GENERATION (50+ TO 200+ ICONS)
  // ══════════════════════════════════════════════════════════════════════════
  describe('Task 1: Multi-Icon JSZip Package Generation Stress Testing', () => {
    it('S1.01: Bundle exactly 55 icons across all 6 formats (SVG, React, Vue, Svelte, Tailwind, Sprite, metadata.json)', async () => {
      const mockIcons = generateMockIcons(55)
      assert.equal(mockIcons.length, 55)

      const zip = await buildZipArchive(mockIcons, {
        packageName: 'stress-bundle-55',
        formats: {
          svg: true,
          react: true,
          vue: true,
          svelte: true,
          tailwind: true,
          sprite: true,
        },
        usePreset: false,
      })

      // Generate binary archive buffer
      const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
      assert.ok(buffer.length > 5000, `ZIP buffer size must be substantial (${buffer.length} bytes)`)

      // Load back into JSZip to verify integrity
      const loadedZip = await JSZip.loadAsync(buffer)

      // Verify metadata.json
      const metaFile = loadedZip.file('metadata.json')
      assert.ok(metaFile, 'metadata.json must exist in root of zip')
      const metaContent = await metaFile.async('text')
      const metadata = JSON.parse(metaContent)
      assert.equal(metadata.packageName, 'stress-bundle-55')
      assert.equal(metadata.totalIcons, 55)
      assert.equal(metadata.icons.length, 55)

      // Verify each individual icon format in the zip
      for (const { item } of mockIcons) {
        const compName = toPascalCase(item.icon.name)

        // 1. SVG
        const svgFile = loadedZip.file(`svg/${item.icon.name}.svg`)
        assert.ok(svgFile, `SVG file for ${item.icon.name} must exist`)
        const svgText = await svgFile.async('text')
        assert.ok(svgText.startsWith('<svg'), `SVG for ${item.icon.name} must start with <svg`)
        assert.ok(svgText.endsWith('</svg>'), `SVG for ${item.icon.name} must end with </svg>`)

        // 2. React TSX
        const reactFile = loadedZip.file(`react/Icon${compName}.tsx`)
        assert.ok(reactFile, `React file Icon${compName}.tsx must exist`)
        const reactText = await reactFile.async('text')
        assert.ok(reactText.includes(`export default function Icon${compName}(`), `React component must export Icon${compName}`)
        assert.ok(reactText.includes('export interface IconProps'), 'React component must have IconProps interface')

        // 3. Vue SFC
        const vueFile = loadedZip.file(`vue/Icon${compName}.vue`)
        assert.ok(vueFile, `Vue file Icon${compName}.vue must exist`)
        const vueText = await vueFile.async('text')
        assert.ok(vueText.includes('<template>'), 'Vue SFC must contain <template>')
        assert.ok(vueText.includes('<script setup>'), 'Vue SFC must contain <script setup>')

        // 4. Svelte
        const svelteFile = loadedZip.file(`svelte/Icon${compName}.svelte`)
        assert.ok(svelteFile, `Svelte file Icon${compName}.svelte must exist`)
        const svelteText = await svelteFile.async('text')
        assert.ok(svelteText.includes('<script lang="ts">'), 'Svelte component must have script block')
        assert.ok(svelteText.includes('{...$$restProps}'), 'Svelte component must forward restProps')

        // 5. Tailwind HTML
        const tailwindFile = loadedZip.file(`tailwind-html/${item.icon.name}.html`)
        assert.ok(tailwindFile, `Tailwind HTML file ${item.icon.name}.html must exist`)
        const tailwindText = await tailwindFile.async('text')
        assert.ok(tailwindText.includes('className="w-6 h-6 text-current"'), 'Tailwind HTML must include className')
      }

      // Verify sprite.svg
      const spriteFile = loadedZip.file('sprite.svg')
      assert.ok(spriteFile, 'sprite.svg must exist')
      const spriteText = await spriteFile.async('text')
      assert.ok(spriteText.includes('<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">'))
      assert.ok(spriteText.includes('</svg>'))
      for (const { item } of mockIcons) {
        assert.ok(spriteText.includes(`id="icon-${item.icon.library}-${item.icon.name}"`))
      }
    })

    it('S1.02: Stress test 120 icons with global preset overrides and container frame shapes', async () => {
      const mockIcons = generateMockIcons(120)
      assert.equal(mockIcons.length, 120)

      const zip = await buildZipArchive(mockIcons, {
        packageName: 'preset-framed-120',
        formats: {
          svg: true,
          react: true,
          vue: true,
          svelte: true,
          tailwind: true,
          sprite: false,
        },
        usePreset: true,
        presetSize: 36,
        presetStroke: 1.75,
        presetColor: '#6366f1',
        padding: 4,
        frameShape: 'circle',
        frameColor: '#1e293b',
        frameStroke: '#6366f1',
        frameStrokeWidth: 2,
      })

      const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
      const loadedZip = await JSZip.loadAsync(buffer)

      const metaContent = await loadedZip.file('metadata.json')?.async('text')
      assert.ok(metaContent)
      const meta = JSON.parse(metaContent)
      assert.equal(meta.totalIcons, 120)
      assert.equal(meta.configUsed.presetSize, 36)
      assert.equal(meta.configUsed.presetStroke, 1.75)
      assert.equal(meta.configUsed.presetColor, '#6366f1')

      // Spot check 10 random icons
      for (let i = 0; i < 120; i += 12) {
        const { item } = mockIcons[i]
        const compName = toPascalCase(item.icon.name)

        const svgContent = await loadedZip.file(`svg/${item.icon.name}.svg`)?.async('text')
        assert.ok(svgContent)
        assert.ok(svgContent.includes('width="36"'))
        assert.ok(svgContent.includes('height="36"'))
        assert.ok(svgContent.includes('stroke-width="1.75"'))
        assert.ok(svgContent.includes('<circle cx='))
        assert.ok(svgContent.includes('fill="#1e293b"'))

        const reactContent = await loadedZip.file(`react/Icon${compName}.tsx`)?.async('text')
        assert.ok(reactContent)
        assert.ok(reactContent.includes('<circle cx='))
      }
    })

    it('S1.03: High-capacity load test: 200 icons bundling completes rapidly without OOM or data corruption', async () => {
      const mockIcons = generateMockIcons(200)
      const startTime = performance.now()

      const zip = await buildZipArchive(mockIcons, {
        packageName: 'scale-test-200',
        formats: {
          svg: true,
          react: true,
          vue: true,
          svelte: true,
          tailwind: true,
          sprite: true,
        },
        usePreset: true,
        presetSize: 28,
        presetStroke: 2.0,
        presetColor: '#10b981',
      })

      const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
      const durationMs = performance.now() - startTime

      assert.ok(durationMs < 5000, `200 icon packaging must take under 5 seconds (took ${durationMs.toFixed(2)}ms)`)
      assert.ok(buffer.length > 20000, `Archive size for 200 icons across 6 formats should be > 20KB (${buffer.length} bytes)`)

      const loadedZip = await JSZip.loadAsync(buffer)
      const files = Object.keys(loadedZip.files)
      // 200 * 5 formats + metadata.json + sprite.svg = 1002 files + 5 directory entries = 1007
      const nonDirFiles = files.filter(f => !loadedZip.files[f].dir)
      assert.equal(nonDirFiles.length, 200 * 5 + 2, 'Must contain 1002 total files in 200-icon bundle')
    })

    it('S1.04: Subset format combinations (e.g. only Svelte + SVG, or only React + Tailwind)', async () => {
      const mockIcons = generateMockIcons(20)

      // Test selective formats: Svelte + SVG only
      const zipSvelteOnly = await buildZipArchive(mockIcons, {
        formats: { svg: true, svelte: true, react: false, vue: false, tailwind: false, sprite: false },
      })
      const buf1 = await zipSvelteOnly.generateAsync({ type: 'nodebuffer' })
      const loaded1 = await JSZip.loadAsync(buf1)
      assert.ok(loaded1.file('svg/arrow-right.svg'))
      assert.ok(loaded1.file('svelte/IconArrowRight.svelte'))
      assert.equal(loaded1.file('react/IconArrowRight.tsx'), null)
      assert.equal(loaded1.file('vue/IconArrowRight.vue'), null)
      assert.equal(loaded1.file('tailwind-html/arrow-right.html'), null)
      assert.equal(loaded1.file('sprite.svg'), null)

      // Test selective formats: React + Tailwind only
      const zipReactTailwind = await buildZipArchive(mockIcons, {
        formats: { svg: false, svelte: false, react: true, vue: false, tailwind: true, sprite: false },
      })
      const buf2 = await zipReactTailwind.generateAsync({ type: 'nodebuffer' })
      const loaded2 = await JSZip.loadAsync(buf2)
      assert.ok(loaded2.file('react/IconArrowRight.tsx'))
      assert.ok(loaded2.file('tailwind-html/arrow-right.html'))
      assert.equal(loaded2.file('svg/arrow-right.svg'), null)
      assert.equal(loaded2.file('svelte/IconArrowRight.svelte'), null)
    })
  })

  // ══════════════════════════════════════════════════════════════════════════
  // TASK 2: TEST SVG CUSTOMIZATION IDEMPOTENCY & STABILITY UNDER ITERATION
  // ══════════════════════════════════════════════════════════════════════════
  describe('Task 2: SVG Customization Idempotency & Attribute Stability', () => {

    it('I2.01: Mathematical idempotency: customizeSvg(customizeSvg(svg, opts), opts) produces identical output for standard options', () => {
      const opts: ExportOptions = {
        size: 32,
        strokeWidth: 1.5,
        color: '#3b82f6',
      }

      for (const rawSvg of [svgStrokeLucide, svgSolidHeroicon, svgDuotonePhosphor, svgLargeViewBox]) {
        const pass1 = customizeSvg(rawSvg, opts)
        const pass2 = customizeSvg(pass1, opts)
        const pass3 = customizeSvg(pass2, opts)

        assert.equal(pass2, pass1, 'Second customization pass with same options must be identical to first pass')
        assert.equal(pass3, pass2, 'Third customization pass with same options must be identical to second pass')
      }
    })

    it('I2.02: Attribute corruption check: No duplicate attributes (width, height, stroke-width, viewBox, class) after multiple passes', () => {
      let current = svgStrokeLucide

      // Apply 10 sequential customization passes with varying sizes & strokes
      const sizes = [16, 20, 24, 32, 48, 64, 24, 36, 40, 48]
      const strokes = [1.0, 1.5, 2.0, 2.5, 3.0, 1.2, 1.8, 2.2, 0.8, 2.0]

      for (let i = 0; i < 10; i++) {
        current = customizeSvg(current, { size: sizes[i], strokeWidth: strokes[i] })
      }

      // Check root tag attributes
      const rootTagMatch = current.match(/<svg([^>]*)>/)
      assert.ok(rootTagMatch, 'SVG root tag must exist and be well-formed')
      const rootAttrs = rootTagMatch[1]

      // Count occurrences of standalone attributes in root tag (distinguishing width from stroke-width)
      const widthMatches = rootAttrs.match(/(?:^|\s)width=/g) || []
      const heightMatches = rootAttrs.match(/(?:^|\s)height=/g) || []
      const strokeWidthMatches = rootAttrs.match(/(?:^|\s)stroke-width=/g) || []
      const viewBoxMatches = rootAttrs.match(/(?:^|\s)viewBox=/g) || []

      assert.equal(widthMatches.length, 1, `Must contain exactly 1 width attribute, found ${widthMatches.length}`)
      assert.equal(heightMatches.length, 1, `Must contain exactly 1 height attribute, found ${heightMatches.length}`)
      assert.equal(strokeWidthMatches.length, 1, `Must contain exactly 1 stroke-width attribute, found ${strokeWidthMatches.length}`)
      assert.equal(viewBoxMatches.length, 1, `Must contain exactly 1 viewBox attribute, found ${viewBoxMatches.length}`)

      // Values should reflect the last pass (size 48, stroke 2.0)
      assert.ok(rootAttrs.includes('width="48"'), 'Final width must be 48')
      assert.ok(rootAttrs.includes('height="48"'), 'Final height must be 48')
      assert.ok(rootAttrs.includes('stroke-width="2"'), 'Final stroke-width must be 2')
    })

    it('I2.03: ViewBox stability: Ensure viewBox numbers remain valid floating points without NaN, null, or corrupted syntax', () => {
      let current = svgStrokeLucide

      for (let i = 1; i <= 8; i++) {
        current = customizeSvg(current, { size: 24 + i * 4, strokeWidth: 1 + i * 0.2 })
        
        const match = current.match(/viewBox=["']([-\d.]+)[,\s]+([-\d.]+)[,\s]+([-\d.]+)[,\s]+([-\d.]+)["']/)
        assert.ok(match, `viewBox must remain syntactically valid after step ${i}: ${current.substring(0, 100)}`)

        const minX = parseFloat(match[1])
        const minY = parseFloat(match[2])
        const width = parseFloat(match[3])
        const height = parseFloat(match[4])

        assert.ok(!isNaN(minX), 'minX must not be NaN')
        assert.ok(!isNaN(minY), 'minY must not be NaN')
        assert.ok(!isNaN(width) && width > 0, `width must be positive number (${width})`)
        assert.ok(!isNaN(height) && height > 0, `height must be positive number (${height})`)
      }
    })

    it('I2.04: Preserves inner vector paths, clipPaths, and geometries across multiple customization rounds', () => {
      let current = svgComplexProps
      const originalPathContent = 'polygon points="12 2 22 22 2 22"'

      for (let i = 0; i < 5; i++) {
        current = customizeSvg(current, {
          size: 32,
          strokeWidth: 2.5,
          color: '#ec4899',
        })
      }

      assert.ok(current.includes(originalPathContent), 'Inner polygon points must remain perfectly preserved')
      assert.ok(current.includes('stroke-dasharray="4 2"'), 'stroke-dasharray must be preserved')
      assert.ok(current.includes('stroke-dashoffset="1"'), 'stroke-dashoffset must be preserved')
    })

    it('I2.05: Sequential code generation on re-customized SVGs produces valid React, Vue, Svelte, and Tailwind components', () => {
      // Step 1: Base customize
      const stage1 = customizeSvg(svgStrokeLucide, { size: 32, strokeWidth: 1.5, color: '#3b82f6' })
      // Step 2: Re-customize
      const stage2 = customizeSvg(stage1, { size: 48, strokeWidth: 2.0, color: '#10b981' })

      // Generate all 4 component formats
      const reactCode = generateReactComponent('test-icon', stage2)
      const vueCode = generateVueComponent(stage2)
      const svelteCode = generateSvelteComponent('test-icon', stage2)
      const tailwindCode = generateTailwindInlineSnippet(stage2, { className: 'w-12 h-12 text-emerald-500' })

      // React verification
      assert.ok(reactCode.includes('export default function IconTestIcon('))
      assert.ok(reactCode.includes('width={size}'))
      assert.ok(reactCode.includes('height={size}'))
      assert.ok(reactCode.includes('strokeWidth="2"'))
      assert.ok(!reactCode.includes('stroke-width='))
      assert.ok(!reactCode.includes('class='))

      // Vue verification
      assert.ok(vueCode.includes(':width="size"'))
      assert.ok(vueCode.includes(':height="size"'))
      assert.ok(vueCode.includes('stroke-width="2"'))

      // Svelte verification
      assert.ok(svelteCode.includes('<script lang="ts">'))
      assert.ok(svelteCode.includes('{...$$restProps}'))
      assert.ok(svelteCode.includes('width={size}'))

      // Tailwind verification
      assert.ok(tailwindCode.includes('className="w-12 h-12 text-emerald-500"'))
      assert.ok(tailwindCode.includes('strokeWidth="2"'))
    })

    it('I2.06: Zero and Extreme boundary robustness: handles 0 strokeWidth, size 1, size 1024, empty strings', () => {
      // Zero strokeWidth
      const zeroStroke = customizeSvg(svgStrokeLucide, { strokeWidth: 0 })
      assert.ok(zeroStroke.includes('stroke-width="0"'))

      // Extreme small size
      const tiny = customizeSvg(svgStrokeLucide, { size: 1 })
      assert.ok(tiny.includes('width="1"'))
      assert.ok(tiny.includes('height="1"'))

      // Extreme large size
      const huge = customizeSvg(svgStrokeLucide, { size: 1024 })
      assert.ok(huge.includes('width="1024"'))
      assert.ok(huge.includes('height="1024"'))

      // Empty string
      assert.equal(customizeSvg('', { size: 24 }), '')
    })

    it('I2.07: Duotone opacity stability across repeated customization calls', () => {
      let current = svgDuotonePhosphor

      current = customizeSvg(current, { secondaryOpacity: 0.35 })
      assert.ok(current.includes('opacity="0.35"'))

      current = customizeSvg(current, { secondaryOpacity: 0.6 })
      assert.ok(current.includes('opacity="0.6"'))
      assert.ok(!current.includes('opacity="0.35"'))

      current = customizeSvg(current, { secondaryOpacity: 0.15 })
      assert.ok(current.includes('opacity="0.15"'))
      assert.ok(!current.includes('opacity="0.6"'))
    })

    it('I2.08: Attribute order edge case: stroke-width attribute preceding width/height does not corrupt code generators', () => {
      const svgStrokeFirst = `<svg xmlns="http://www.w3.org/2000/svg" stroke-width="2" width="24" height="24" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>`
      
      const reactCode = generateReactComponent('stroke-first', svgStrokeFirst)
      const vueCode = generateVueComponent(svgStrokeFirst)
      const svelteCode = generateSvelteComponent('stroke-first', svgStrokeFirst)

      // Verify React does not produce stroke-width={size}
      assert.ok(reactCode.includes('strokeWidth="2"'), `React should keep strokeWidth="2", got:\n${reactCode}`)
      assert.ok(reactCode.includes('width={size}'), `React should have width={size}`)

      // Verify Vue does not produce stroke-:width="size"
      assert.ok(vueCode.includes(':width="size"'), `Vue should have :width="size", got:\n${vueCode}`)
      assert.ok(!vueCode.includes('stroke-:width='), `Vue should NOT have corrupted stroke-:width= attribute`)

      // Verify Svelte does not corrupt stroke-width
      assert.ok(svelteCode.includes('width={size}'), `Svelte should have width={size}`)
      assert.ok(!svelteCode.includes('stroke-width={size}'), `Svelte should NOT corrupt stroke-width={size}`)
    })

    it('I2.09: ViewBox parsing edge case: stroke-width preceding width on non-viewBox SVG must not squash width to stroke-width', () => {
      const svgNoVbStrokeFirst = `<svg xmlns="http://www.w3.org/2000/svg" stroke-width="2" width="32" height="32"><circle cx="16" cy="16" r="12"/></svg>`
      
      const customized = customizeSvg(svgNoVbStrokeFirst, { size: 32, strokeWidth: 2 })
      
      // The inferred viewBox should be "0 0 32 32", not "0 0 2 32"
      assert.ok(
        customized.includes('viewBox="0 0 32 32"'),
        `Expected viewBox="0 0 32 32", but got:\n${customized}`
      )
    })
  })
})

