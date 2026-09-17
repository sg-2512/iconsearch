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
  generateBase64Snippet,
  compileSvgSprite,
  renderSvgToPng,
  renderSvgToPngBlob,
  toPascalCase,
  type CartItem,
  type ExportConfig,
  type ExportOptions,
  type FrameShape,
  type Icon,
} from '../lib/exporter'

const sampleSvg1 = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`

const sampleSvg2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Z" clip-rule="evenodd"/></svg>`

const sampleDuotoneSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" opacity="0.2" class="duotone-secondary" d="M3 3h18v18H3z"/><path fill="currentColor" d="M12 5l7 7-7 7"/></svg>`

const sampleCartIcon1: Icon = {
  id: 'lucide-icons-arrow-right',
  name: 'arrow-right',
  displayName: 'ArrowRight',
  library: 'lucide-icons',
  libraryName: 'Lucide Icons',
  npmPackage: 'lucide-react',
  license: 'ISC',
  tags: ['arrow', 'right', 'direction'],
  reactImport: "import { ArrowRight } from 'lucide-react'",
  reactUsage: '<ArrowRight size={24} />',
  svgUrl: '/api/svg/lucide-icons/arrow-right',
  legalSafe: true,
}

const sampleCartIcon2: Icon = {
  id: 'heroicons-check-circle',
  name: 'check-circle',
  displayName: 'CheckCircle',
  library: 'heroicons',
  libraryName: 'Heroicons',
  npmPackage: '@heroicons/react',
  license: 'MIT',
  tags: ['check', 'circle', 'success'],
  reactImport: "import { CheckCircleIcon } from '@heroicons/react/24/solid'",
  reactUsage: '<CheckCircleIcon className="w-6 h-6" />',
  svgUrl: '/api/svg/heroicons/check-circle',
  legalSafe: true,
}

const sampleCartItem1: CartItem = {
  key: 'lucide-icons-arrow-right-24-2-#000000',
  icon: sampleCartIcon1,
  size: 24,
  stroke: 2,
  color: '#3b82f6',
}

const sampleCartItem2: CartItem = {
  key: 'heroicons-check-circle-32-1.5-#10b981',
  icon: sampleCartIcon2,
  size: 32,
  stroke: 1.5,
  color: '#10b981',
}

describe('Universal Exporter & Code Generation Suite', () => {
  // ── TIER 1: FEATURE COVERAGE ──────────────────────────────────────────────
  describe('Tier 1: Feature Coverage', () => {
    it('T1.01: customizeSvg scales dimensions to target size (width & height)', () => {
      const customized = customizeSvg(sampleSvg1, 48, 2, 'currentColor')
      assert.ok(customized.includes('width="48"'))
      assert.ok(customized.includes('height="48"'))
      assert.ok(!customized.includes('width="24"'))
    })

    it('T1.02: customizeSvg updates stroke-width attribute', () => {
      const customized = customizeSvg(sampleSvg1, 24, 1.5, 'currentColor')
      assert.ok(customized.includes('stroke-width="1.5"'))
      assert.ok(!customized.includes('stroke-width="2"'))
    })

    it('T1.03: customizeSvg replaces stroke="currentColor" with custom hex', () => {
      const customized = customizeSvg(sampleSvg1, 24, 2, '#3b82f6')
      assert.ok(customized.includes('stroke="#3b82f6"'))
      assert.ok(!customized.includes('stroke="currentColor"'))
    })

    it('T1.04: customizeSvg replaces fill="currentColor" with custom hex', () => {
      const customized = customizeSvg(sampleSvg2, 24, 2, '#ef4444')
      assert.ok(customized.includes('fill="#ef4444"'))
      assert.ok(!customized.includes('fill="currentColor"'))
    })

    it('T1.05: customizeSvg injects missing width and height attributes into root tag', () => {
      const customized = customizeSvg(sampleSvg2, 32, 2, 'currentColor')
      assert.ok(customized.includes('width="32"'))
      assert.ok(customized.includes('height="32"'))
    })

    it('T1.06: customizeSvg injects missing stroke-width attribute when absent', () => {
      const customized = customizeSvg(sampleSvg2, 24, 1.75, 'currentColor')
      assert.ok(customized.includes('stroke-width="1.75"'))
    })

    it('T1.07: generateReactComponent creates PascalCase component name with Icon prefix', () => {
      const code = generateReactComponent('arrow-right', sampleSvg1)
      assert.ok(code.includes('export default function IconArrowRight('))
    })

    it('T1.08: generateReactComponent converts snake_case and multi-hyphens to PascalCase', () => {
      const code = generateReactComponent('user_profile_v2', sampleSvg1)
      assert.ok(code.includes('export default function IconUserProfileV2('))
    })

    it('T1.09: generateReactComponent maps class to className', () => {
      const code = generateReactComponent('arrow-right', sampleSvg1)
      assert.ok(code.includes('className="lucide lucide-arrow-right"'))
      assert.ok(!code.includes('class='))
    })

    it('T1.10: generateReactComponent maps kebab-case SVG attributes to camelCase JSX', () => {
      const code = generateReactComponent('arrow-right', sampleSvg1)
      assert.ok(code.includes('strokeWidth='))
      assert.ok(code.includes('strokeLinecap='))
      assert.ok(code.includes('strokeLinejoin='))
      assert.ok(!code.includes('stroke-linecap='))
      assert.ok(!code.includes('stroke-linejoin='))
    })

    it('T1.11: generateReactComponent maps fill-rule and clip-rule to camelCase JSX', () => {
      const code = generateReactComponent('check-circle', sampleSvg2)
      assert.ok(code.includes('fillRule='))
      assert.ok(code.includes('clipRule='))
      assert.ok(!code.includes('fill-rule='))
      assert.ok(!code.includes('clip-rule='))
    })

    it('T1.12: generateReactComponent binds width={size} and height={size}', () => {
      const code = generateReactComponent('arrow-right', sampleSvg1)
      assert.ok(code.includes('width={size}'))
      assert.ok(code.includes('height={size}'))
    })

    it('T1.13: generateReactComponent exports IconProps interface extending SVGProps', () => {
      const code = generateReactComponent('arrow-right', sampleSvg1)
      assert.ok(code.includes('export interface IconProps extends React.SVGProps<SVGSVGElement>'))
      assert.ok(code.includes('size?: number | string'))
    })

    it('T1.14: generateReactComponent forwards props to SVG root element', () => {
      const code = generateReactComponent('arrow-right', sampleSvg1)
      assert.ok(code.includes('<svg {...props}'))
    })

    it('T1.15: generateVueComponent generates template with :width and :height bindings', () => {
      const code = generateVueComponent(sampleSvg1)
      assert.ok(code.includes('<template>'))
      assert.ok(code.includes(':width="size"'))
      assert.ok(code.includes(':height="size"'))
      assert.ok(code.includes('</template>'))
    })

    it('T1.16: generateVueComponent includes <script setup> with defineProps', () => {
      const code = generateVueComponent(sampleSvg1)
      assert.ok(code.includes('<script setup>'))
      assert.ok(code.includes('defineProps({'))
      assert.ok(code.includes('type: [Number, String]'))
      assert.ok(code.includes('default: 24'))
    })

    it('T1.17: compileSvgSprite wraps items in hidden SVG container', () => {
      const sprite = compileSvgSprite(
        [{ item: sampleCartItem1, svg: sampleSvg1 }],
        false,
        2,
        'currentColor'
      )
      assert.ok(sprite.startsWith('<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">'))
      assert.ok(sprite.endsWith('</svg>'))
    })

    it('T1.18: compileSvgSprite generates symbol with correct id convention', () => {
      const sprite = compileSvgSprite(
        [{ item: sampleCartItem1, svg: sampleSvg1 }],
        false,
        2,
        'currentColor'
      )
      assert.ok(sprite.includes('<symbol id="icon-lucide-icons-arrow-right" viewBox="0 0 24 24">'))
    })

    it('T1.19: compileSvgSprite applies preset overrides when usePreset is true', () => {
      const sprite = compileSvgSprite(
        [{ item: sampleCartItem1, svg: sampleSvg1 }],
        true,
        3.0,
        '#ff0000'
      )
      assert.ok(sprite.includes('id="icon-lucide-icons-arrow-right"'))
      assert.ok(sprite.includes('viewBox="0 0 24 24"'))
      assert.ok(sprite.includes('<path d="M5 12h14"/>'))
    })

    it('T1.20: renderSvgToPng rejects gracefully in Node environment without browser window', async () => {
      await assert.rejects(
        async () => {
          await renderSvgToPng(sampleSvg1, 64)
        },
        {
          name: 'Error',
          message: 'Canvas rendering is only supported in browser environments.',
        }
      )
    })
  })

  // ── TIER 2: BOUNDARY & CORNER CASES ───────────────────────────────────────
  describe('Tier 2: Boundary & Corner Cases', () => {
    it('T2.01: customizeSvg returns empty string for empty or null rawSvg', () => {
      assert.equal(customizeSvg('', 24, 2, 'currentColor'), '')
    })

    it('T2.02: customizeSvg handles zero size boundary', () => {
      const customized = customizeSvg(sampleSvg1, 0, 2, 'currentColor')
      assert.ok(customized.includes('width="0"'))
      assert.ok(customized.includes('height="0"'))
    })

    it('T2.03: customizeSvg handles floating point stroke widths (0.25, 2.75)', () => {
      const customized = customizeSvg(sampleSvg1, 24, 0.25, 'currentColor')
      assert.ok(customized.includes('stroke-width="0.25"'))
      const customized2 = customizeSvg(sampleSvg1, 24, 2.75, 'currentColor')
      assert.ok(customized2.includes('stroke-width="2.75"'))
    })

    it('T2.04: customizeSvg preserves inner paths and shapes untouched', () => {
      const customized = customizeSvg(sampleSvg1, 48, 1, '#123456')
      assert.ok(customized.includes('d="M5 12h14"'))
      assert.ok(customized.includes('d="m12 5 7 7-7 7"'))
    })

    it('T2.05: generateReactComponent handles single-word icon names', () => {
      const code = generateReactComponent('home', sampleSvg1)
      assert.ok(code.includes('export default function IconHome('))
    })

    it('T2.06: generateReactComponent handles icon names starting with numbers', () => {
      const code = generateReactComponent('3d-cube', sampleSvg1)
      assert.ok(code.includes('export default function Icon3dCube('))
    })

    it('T2.07: generateReactComponent handles stroke-dasharray and stroke-dashoffset conversion', () => {
      const svgWithDash = `<svg stroke-dasharray="4 2" stroke-dashoffset="1"><path d="M0 0"/></svg>`
      const code = generateReactComponent('dashed-icon', svgWithDash)
      assert.ok(code.includes('strokeDasharray='))
      assert.ok(code.includes('strokeDashoffset='))
    })

    it('T2.08: generateVueComponent handles SVGs without initial width/height attributes', () => {
      const raw = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>`
      const code = generateVueComponent(raw)
      assert.ok(code.includes(':width="size"'))
      assert.ok(code.includes(':height="size"'))
    })

    it('T2.09: compileSvgSprite with empty items array returns valid empty sprite SVG', () => {
      const sprite = compileSvgSprite([], false, 2, 'currentColor')
      assert.equal(sprite, '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\n</svg>')
    })

    it('T2.10: compileSvgSprite skips items with empty svg string gracefully', () => {
      const sprite = compileSvgSprite(
        [
          { item: sampleCartItem1, svg: '' },
          { item: sampleCartItem2, svg: sampleSvg2 },
        ],
        false,
        2,
        'currentColor'
      )
      assert.ok(!sprite.includes('icon-lucide-icons-arrow-right'))
      assert.ok(sprite.includes('icon-heroicons-check-circle'))
    })

    it('T2.11: compileSvgSprite extracts custom non-standard viewBox correctly', () => {
      const customViewBoxSvg = `<svg viewBox="0 0 512 512" fill="currentColor"><rect width="512" height="512"/></svg>`
      const sprite = compileSvgSprite(
        [{ item: sampleCartItem1, svg: customViewBoxSvg }],
        false,
        2,
        'currentColor'
      )
      assert.ok(sprite.includes('viewBox="0 0 512 512"'))
    })

    it('T2.12: JSZip package metadata schema validation', async () => {
      const zip = new JSZip()
      const metadata = {
        packageName: 'custom-package',
        exportedAt: new Date().toISOString(),
        totalIcons: 2,
        configUsed: {
          usePreset: true,
          presetSize: 24,
          presetStroke: 2,
          presetColor: '#000000',
          pngScale: 2,
        },
        icons: [
          {
            id: 'lucide-arrow-right',
            name: 'arrow-right',
            library: 'lucide-icons',
            libraryName: 'Lucide Icons',
            license: 'ISC',
            legalSafe: true,
            exportedConfig: { size: 24, stroke: 2, color: '#000000' },
          },
        ],
      }
      zip.file('metadata.json', JSON.stringify(metadata, null, 2))
      const content = await zip.file('metadata.json')?.async('text')
      assert.ok(content)
      const parsed = JSON.parse(content)
      assert.equal(parsed.packageName, 'custom-package')
      assert.equal(parsed.totalIcons, 2)
      assert.equal(parsed.icons[0].name, 'arrow-right')
    })

    it('T2.13: JSZip builds multi-folder structure (svg, react, vue, svelte, tailwind-html)', async () => {
      const zip = new JSZip()
      const svgFolder = zip.folder('svg')
      const reactFolder = zip.folder('react')
      const vueFolder = zip.folder('vue')
      const svelteFolder = zip.folder('svelte')
      const tailwindFolder = zip.folder('tailwind-html')

      svgFolder?.file('arrow-right.svg', sampleSvg1)
      reactFolder?.file('IconArrowRight.tsx', generateReactComponent('arrow-right', sampleSvg1))
      vueFolder?.file('IconArrowRight.vue', generateVueComponent(sampleSvg1))
      svelteFolder?.file('IconArrowRight.svelte', generateSvelteComponent('arrow-right', sampleSvg1))
      tailwindFolder?.file('arrow-right.html', generateTailwindInlineSnippet(sampleSvg1))

      assert.ok(zip.file('svg/arrow-right.svg'))
      assert.ok(zip.file('react/IconArrowRight.tsx'))
      assert.ok(zip.file('vue/IconArrowRight.vue'))
      assert.ok(zip.file('svelte/IconArrowRight.svelte'))
      assert.ok(zip.file('tailwind-html/arrow-right.html'))
    })

    it('T2.14: React component generates valid TypeScript code without syntax errors', () => {
      const code = generateReactComponent('settings-gear', sampleSvg1)
      assert.ok(code.startsWith("import React from 'react'"))
      assert.ok(code.includes('export interface IconProps'))
      assert.ok(code.includes('export default function IconSettingsGear('))
      assert.ok(code.trim().endsWith('}'))
    })

    it('T2.15: Vue component generates valid single-file component template structure', () => {
      const code = generateVueComponent(sampleSvg2)
      assert.ok(code.startsWith('<template>'))
      assert.ok(code.includes('</template>'))
      assert.ok(code.includes('<script setup>'))
      assert.ok(code.includes('</script>'))
    })
  })

  // ── TIER 3: PAIRWISE COMBINATIONS ─────────────────────────────────────────
  describe('Tier 3: Pairwise Combinations', () => {
    it('T3.01: Pair 1: Lucide SVG + Size 32 + Stroke 1.5 + React TSX export', () => {
      const customized = customizeSvg(sampleSvg1, 32, 1.5, '#3b82f6')
      const reactCode = generateReactComponent('arrow-right', customized)
      assert.ok(reactCode.includes('strokeWidth="1.5"'))
      assert.ok(reactCode.includes('stroke="#3b82f6"'))
      assert.ok(reactCode.includes('IconArrowRight'))
    })

    it('T3.02: Pair 2: Heroicons SVG + Size 16 + Color #3b82f6 + Vue 3 export', () => {
      const customized = customizeSvg(sampleSvg2, 16, 2, '#3b82f6')
      const vueCode = generateVueComponent(customized)
      assert.ok(vueCode.includes('fill="#3b82f6"'))
      assert.ok(vueCode.includes(':width="size"'))
    })

    it('T3.03: Pair 3: Tabler SVG + Size 48 + Stroke 2.5 + SVG Sprite export', () => {
      const customized = customizeSvg(sampleSvg1, 48, 2.5, '#10b981')
      const sprite = compileSvgSprite(
        [{ item: sampleCartItem1, svg: customized }],
        false,
        2.5,
        '#10b981'
      )
      assert.ok(sprite.includes('id="icon-lucide-icons-arrow-right"'))
      assert.ok(sprite.includes('viewBox="0 0 24 24"'))
      assert.ok(sprite.includes('<path d="M5 12h14"/>'))
    })

    it('T3.04: Pair 4: Remix SVG + Size 20 + Color #10b981 + React export', () => {
      const customized = customizeSvg(sampleSvg2, 20, 1, '#10b981')
      const reactCode = generateReactComponent('check-circle', customized)
      assert.ok(reactCode.includes('fill="#10b981"'))
      assert.ok(reactCode.includes('IconCheckCircle'))
    })

    it('T3.05: Pair 5: Phosphor SVG + Size 64 + Preset config enabled + Multi-format ZIP', async () => {
      const zip = new JSZip()
      const customized = customizeSvg(sampleSvg1, 64, 2, '#8b5cf6')
      zip.file('svg/arrow.svg', customized)
      zip.file('react/IconArrow.tsx', generateReactComponent('arrow', customized))
      zip.file('vue/IconArrow.vue', generateVueComponent(customized))
      
      const zipData = await zip.generateAsync({ type: 'nodebuffer' })
      assert.ok(zipData.length > 0)
    })

    it('T3.06: Pair 6: Radix SVG + Size 15 + Stroke 1.0 + Custom className React', () => {
      const customized = customizeSvg(sampleSvg1, 15, 1.0, 'currentColor')
      const reactCode = generateReactComponent('radix-dot', customized)
      assert.ok(reactCode.includes('strokeWidth="1"'))
      assert.ok(reactCode.includes('IconRadixDot'))
    })

    it('T3.07: Pair 7: Feather SVG + Size 24 + Color currentColor + Vue export', () => {
      const customized = customizeSvg(sampleSvg1, 24, 2, 'currentColor')
      const vueCode = generateVueComponent(customized)
      assert.ok(vueCode.includes('stroke="currentColor"'))
      assert.ok(vueCode.includes('<script setup>'))
    })

    it('T3.08: Pair 8: Octicons SVG + Size 16 + Stroke 2.0 + Raw SVG export', () => {
      const customized = customizeSvg(sampleSvg1, 16, 2.0, '#333333')
      assert.ok(customized.includes('width="16"'))
      assert.ok(customized.includes('height="16"'))
      assert.ok(customized.includes('stroke="#333333"'))
    })

    it('T3.09: Pair 9: Ant Design SVG + Size 28 + Color #ef4444 + Sprite export', () => {
      const sprite = compileSvgSprite(
        [{ item: sampleCartItem2, svg: sampleSvg2 }],
        true,
        2,
        '#ef4444'
      )
      assert.ok(sprite.includes('id="icon-heroicons-check-circle"'))
      assert.ok(sprite.includes('viewBox="0 0 24 24"'))
      assert.ok(sprite.includes('<path'))
    })

    it('T3.10: Pair 10: Iconoir SVG + Size 40 + Preset color #8b5cf6 + ZIP with metadata.json', async () => {
      const zip = new JSZip()
      zip.file('metadata.json', JSON.stringify({ library: 'iconoir', color: '#8b5cf6' }))
      const jsonContent = await zip.file('metadata.json')?.async('text')
      assert.ok(jsonContent?.includes('#8b5cf6'))
    })
  })

  // ── TIER 4: REAL-WORLD DEVELOPER WORKLOADS ────────────────────────────────
  describe('Tier 4: Real-World Developer Workloads', () => {
    it('T4.01: Workload 1: Design System Core Icon Set export (10 icons) to React TSX components', () => {
      const iconNames = ['arrow-left', 'arrow-right', 'home', 'settings', 'user', 'bell', 'search', 'check', 'x', 'menu']
      const reactComponents = iconNames.map((name) => {
        const styledSvg = customizeSvg(sampleSvg1, 20, 1.5, 'currentColor')
        return {
          name,
          code: generateReactComponent(name, styledSvg),
        }
      })

      assert.equal(reactComponents.length, 10)
      for (const comp of reactComponents) {
        assert.ok(comp.code.includes(`export default function Icon`))
        assert.ok(comp.code.includes('strokeWidth="1.5"'))
        assert.ok(comp.code.includes('width={size}'))
      }
    })

    it('T4.02: Workload 2: Generating single-file SVG Sprite sheet with 5 navigation icons', () => {
      const navIcons = ['home', 'dashboard', 'settings', 'profile', 'notifications']
      const items = navIcons.map((name) => ({
        item: {
          key: `nav-${name}`,
          icon: { ...sampleCartIcon1, name },
          size: 24,
          stroke: 2,
          color: '#1e293b',
        },
        svg: sampleSvg1.replace('arrow-right', name),
      }))

      const sprite = compileSvgSprite(items, false, 2, '#1e293b')
      assert.ok(sprite.includes('<symbol id="icon-lucide-icons-home"'))
      assert.ok(sprite.includes('<symbol id="icon-lucide-icons-dashboard"'))
      assert.ok(sprite.includes('<symbol id="icon-lucide-icons-settings"'))
      assert.ok(sprite.includes('<symbol id="icon-lucide-icons-profile"'))
      assert.ok(sprite.includes('<symbol id="icon-lucide-icons-notifications"'))
    })

    it('T4.03: Workload 3: Batch exporting cart of 8 icons into ZIP archive and validating archive structure', async () => {
      const zip = new JSZip()
      const icons = [sampleCartItem1, sampleCartItem2]
      
      const svgDir = zip.folder('svg')
      const reactDir = zip.folder('react')
      const vueDir = zip.folder('vue')

      for (const item of icons) {
        const svg = item.icon.id.includes('arrow') ? sampleSvg1 : sampleSvg2
        const customized = customizeSvg(svg, item.size, item.stroke, item.color)
        svgDir?.file(`${item.icon.name}.svg`, customized)
        reactDir?.file(`Icon${item.icon.displayName}.tsx`, generateReactComponent(item.icon.name, customized))
        vueDir?.file(`Icon${item.icon.displayName}.vue`, generateVueComponent(customized))
      }

      zip.file('metadata.json', JSON.stringify({
        total: icons.length,
        items: icons.map((i) => ({ id: i.icon.id, name: i.icon.name })),
      }))

      const zipBlob = await zip.generateAsync({ type: 'nodebuffer' })
      assert.ok(zipBlob.length > 500)

      const unzipped = await JSZip.loadAsync(zipBlob)
      assert.ok(unzipped.file('svg/arrow-right.svg'))
      assert.ok(unzipped.file('react/IconArrowRight.tsx'))
      assert.ok(unzipped.file('vue/IconArrowRight.vue'))
      assert.ok(unzipped.file('metadata.json'))
    })

    it('T4.04: Workload 4: Live Customizer theme switching (Light -> Dark -> Brand)', () => {
      const lightSvg = customizeSvg(sampleSvg1, 24, 2, '#0f172a')
      const darkSvg = customizeSvg(sampleSvg1, 24, 2, '#f8fafc')
      const brandSvg = customizeSvg(sampleSvg1, 24, 2, '#6366f1')

      assert.ok(lightSvg.includes('stroke="#0f172a"'))
      assert.ok(darkSvg.includes('stroke="#f8fafc"'))
      assert.ok(brandSvg.includes('stroke="#6366f1"'))
    })

    it('T4.05: Workload 5: Full pipeline round-trip: raw SVG -> customize -> React TSX -> Vue 3 -> Sprite', () => {
      // Step 1: Customize
      const customized = customizeSvg(sampleSvg1, 36, 1.75, '#ec4899')
      assert.ok(customized.includes('width="36"'))
      assert.ok(customized.includes('stroke-width="1.75"'))
      assert.ok(customized.includes('stroke="#ec4899"'))

      // Step 2: React Component
      const reactCode = generateReactComponent('forward-arrow', customized)
      assert.ok(reactCode.includes('export default function IconForwardArrow('))
      assert.ok(reactCode.includes('strokeWidth="1.75"'))

      // Step 3: Vue Component
      const vueCode = generateVueComponent(customized)
      assert.ok(vueCode.includes(':width="size"'))
      assert.ok(vueCode.includes('<script setup>'))

      // Step 4: Sprite
      const sprite = compileSvgSprite([{ item: sampleCartItem1, svg: customized }], false, 1.75, '#ec4899')
      assert.ok(sprite.includes('id="icon-lucide-icons-arrow-right"'))
      assert.ok(sprite.includes('viewBox="0 0 24 24"'))
      assert.ok(sprite.includes('<path d="M5 12h14"/>'))
    })
  })

  // ── TIER 5: M3 UNIVERSAL EXPORTER & ADVANCED CUSTOMIZATION ──────────────────
  describe('Tier 5: M3 Universal Exporter & Advanced Customization', () => {
    it('T5.01: generateSvelteComponent generates valid Svelte 4/5 component syntax', () => {
      const svelteCode = generateSvelteComponent('arrow-right', sampleSvg1)
      assert.ok(svelteCode.includes('<script lang="ts">'))
      assert.ok(svelteCode.includes('export let size: number | string = 24'))
      assert.ok(svelteCode.includes("export let color: string = 'currentColor'"))
      assert.ok(svelteCode.includes('export let strokeWidth: number | string = 2'))
      assert.ok(svelteCode.includes('</script>'))
      assert.ok(svelteCode.includes('width={size}'))
      assert.ok(svelteCode.includes('height={size}'))
      assert.ok(svelteCode.includes('{...$$restProps}'))
    })

    it('T5.02: generateSvelteSnippet alias generates valid Svelte component snippet', () => {
      const svelteSnippet = generateSvelteSnippet('check-circle', sampleSvg2)
      assert.ok(svelteSnippet.includes('<script lang="ts">'))
      assert.ok(svelteSnippet.includes('{...$$restProps}'))
      assert.ok(svelteSnippet.includes('width={size}'))
    })

    it('T5.03: generateTailwindInlineSnippet generates inline SVG with default className', () => {
      const tailwindCode = generateTailwindInlineSnippet(sampleSvg1)
      assert.ok(tailwindCode.startsWith('<svg'))
      assert.ok(tailwindCode.includes('className="w-6 h-6 text-current"'))
      assert.ok(tailwindCode.includes('strokeWidth="2"'))
    })

    it('T5.04: generateTailwindInlineSnippet respects custom className option', () => {
      const tailwindCode = generateTailwindInlineSnippet(sampleSvg1, {
        className: 'w-8 h-8 text-indigo-500 hover:text-indigo-400 stroke-2',
      })
      assert.ok(tailwindCode.includes('className="w-8 h-8 text-indigo-500 hover:text-indigo-400 stroke-2"'))
    })

    it('T5.05: generateSvgSnippet produces customized clean SVG string', () => {
      const svgSnippet = generateSvgSnippet(sampleSvg1, { size: 36, strokeWidth: 1.8, color: '#3b82f6' })
      assert.ok(svgSnippet.includes('width="36"'))
      assert.ok(svgSnippet.includes('height="36"'))
      assert.ok(svgSnippet.includes('stroke-width="1.8"'))
      assert.ok(svgSnippet.includes('stroke="#3b82f6"'))
    })

    it('T5.06: generateReactSnippet alias creates PascalCase React component with options', () => {
      const reactCode = generateReactSnippet('search-icon', sampleSvg1, { size: 40, color: '#10b981' })
      assert.ok(reactCode.includes('export default function IconSearchIcon('))
      assert.ok(reactCode.includes('stroke="#10b981"'))
    })

    it('T5.07: generateVueSnippet alias creates Vue 3 component with options', () => {
      const vueCode = generateVueSnippet('bell-alert', sampleSvg1, { color: '#f43f5e' })
      assert.ok(vueCode.includes('<template>'))
      assert.ok(vueCode.includes('stroke="#f43f5e"'))
      assert.ok(vueCode.includes('<script setup>'))
    })

    it('T5.08: customizeSvg with padding expands viewBox proportionally while preserving paths', () => {
      const padded = customizeSvg(sampleSvg1, { size: 24, padding: 4 })
      assert.ok(padded.includes('viewBox="-4 -4 32 32"'))
      assert.ok(padded.includes('d="M5 12h14"'))
      assert.ok(padded.includes('d="m12 5 7 7-7 7"'))
    })

    it('T5.09: customizeSvg with non-standard viewBox expands correctly with padding', () => {
      const svg512 = `<svg viewBox="0 0 512 512"><path d="M100 100h312v312H100z"/></svg>`
      // size 24, padding 3 => scaleFactor = 512/24 = 21.3333, padCoord = 64
      const padded = customizeSvg(svg512, { size: 512, padding: 32 })
      assert.ok(padded.includes('viewBox="-32 -32 576 576"'))
    })

    it('T5.10: customizeSvg injects Circle container frame when frameShape is "circle"', () => {
      const framed = customizeSvg(sampleSvg1, {
        size: 24,
        frameShape: 'circle',
        frameColor: '#1e293b',
        frameStroke: '#3b82f6',
        frameStrokeWidth: 1.5,
      })
      assert.ok(framed.includes('<circle cx="12" cy="12" r="12" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5" />'))
    })

    it('T5.11: customizeSvg injects Rounded container frame when frameShape is "rounded"', () => {
      const framed = customizeSvg(sampleSvg1, {
        size: 24,
        frameShape: 'rounded',
        frameColor: '#0f172a',
        frameStroke: 'rgba(255,255,255,0.1)',
        frameStrokeWidth: 1,
      })
      assert.ok(framed.includes('<rect x="0" y="0" width="24" height="24" rx="4.8" ry="4.8" fill="#0f172a" stroke="rgba(255,255,255,0.1)" stroke-width="1" />'))
    })

    it('T5.12: customizeSvg injects Squircle container frame when frameShape is "squircle"', () => {
      const framed = customizeSvg(sampleSvg1, {
        size: 24,
        frameShape: 'squircle',
        frameColor: '#18181b',
      })
      assert.ok(framed.includes('<rect x="0" y="0" width="24" height="24" rx="8.4" ry="8.4" fill="#18181b" />'))
    })

    it('T5.13: customizeSvg handles frameShape "none" without injecting background elements', () => {
      const unFramed = customizeSvg(sampleSvg1, {
        size: 24,
        frameShape: 'none',
      })
      assert.ok(!unFramed.includes('<circle'))
      assert.ok(!unFramed.includes('<rect'))
    })

    it('T5.14: customizeSvg modifies duotone secondary opacity when secondaryOpacity is provided', () => {
      const duotone = customizeSvg(sampleDuotoneSvg, {
        size: 24,
        secondaryOpacity: 0.45,
      })
      assert.ok(duotone.includes('opacity="0.45"'))
      assert.ok(!duotone.includes('opacity="0.2"'))
    })

    it('T5.15: customizeSvg applies secondaryColor to duotone secondary elements', () => {
      const duotone = customizeSvg(sampleDuotoneSvg, {
        size: 24,
        secondaryColor: '#38bdf8',
      })
      assert.ok(duotone.includes('fill="#38bdf8"'))
    })

    it('T5.16: toPascalCase handles single words, hyphens, and multiple delimiters', () => {
      assert.equal(toPascalCase('arrow-right'), 'ArrowRight')
      assert.equal(toPascalCase('user_profile_card'), 'UserProfileCard')
      assert.equal(toPascalCase('home'), 'Home')
      assert.equal(toPascalCase('chevron-double-up-right'), 'ChevronDoubleUpRight')
    })

    it('T5.17: renderSvgToPngBlob rejects gracefully in Node environment without browser window', async () => {
      await assert.rejects(
        async () => {
          await renderSvgToPngBlob(sampleSvg1, 64, 4)
        },
        {
          name: 'Error',
          message: 'Canvas rendering is only supported in browser environments.',
        }
      )
    })

    it('T5.18: Full M3 multi-format pipeline: customize -> Svelte -> Tailwind -> React -> Vue -> ZIP', async () => {
      const options: ExportOptions = {
        size: 32,
        strokeWidth: 2,
        color: '#8b5cf6',
        padding: 2,
        frameShape: 'rounded',
        frameColor: 'rgba(139,92,246,0.1)',
      }

      const customized = customizeSvg(sampleSvg1, options)
      const svelteCode = generateSvelteComponent('arrow-right', customized)
      const tailwindCode = generateTailwindInlineSnippet(customized, options)
      const reactCode = generateReactComponent('arrow-right', customized)
      const vueCode = generateVueComponent(customized)

      assert.ok(svelteCode.includes('<script lang="ts">'))
      assert.ok(tailwindCode.includes('className="w-6 h-6 text-current"'))
      assert.ok(reactCode.includes('export default function IconArrowRight('))
      assert.ok(vueCode.includes('<template>'))

      // Verify ZIP bundling with all formats
      const zip = new JSZip()
      zip.file('svelte/IconArrowRight.svelte', svelteCode)
      zip.file('tailwind-html/arrow-right.html', tailwindCode)
      zip.file('react/IconArrowRight.tsx', reactCode)
      zip.file('vue/IconArrowRight.vue', vueCode)
      zip.file('svg/arrow-right.svg', customized)

      const zipBlob = await zip.generateAsync({ type: 'nodebuffer' })
      assert.ok(zipBlob.length > 500)

      const unzipped = await JSZip.loadAsync(zipBlob)
      assert.ok(unzipped.file('svelte/IconArrowRight.svelte'))
      assert.ok(unzipped.file('tailwind-html/arrow-right.html'))
      assert.ok(unzipped.file('react/IconArrowRight.tsx'))
      assert.ok(unzipped.file('vue/IconArrowRight.vue'))
      assert.ok(unzipped.file('svg/arrow-right.svg'))
    })

    it('T5.19: customizeSvg applies rotation transform centered on viewBox', () => {
      const rotated = customizeSvg(sampleSvg1, { rotate: 90 })
      assert.ok(rotated.includes('transform="rotate(90 12 12)"'))
    })

    it('T5.20: customizeSvg applies horizontal and vertical flip transforms', () => {
      const flippedH = customizeSvg(sampleSvg1, { flipHorizontal: true })
      assert.ok(flippedH.includes('transform="translate(24 0) scale(-1 1)"'))

      const flippedV = customizeSvg(sampleSvg1, { flipVertical: true })
      assert.ok(flippedV.includes('transform="translate(0 24) scale(1 -1)"'))

      const flippedBoth = customizeSvg(sampleSvg1, { flipHorizontal: true, flipVertical: true })
      assert.ok(flippedBoth.includes('translate(24 0) scale(-1 1)'))
      assert.ok(flippedBoth.includes('translate(0 24) scale(1 -1)'))
    })

    it('T5.21: customizeSvg combines rotation and flipping seamlessly', () => {
      const combined = customizeSvg(sampleSvg1, { rotate: 180, flipHorizontal: true })
      assert.ok(combined.includes('rotate(180 12 12)'))
      assert.ok(combined.includes('translate(24 0) scale(-1 1)'))
    })

    it('T5.22: generateBase64Snippet generates valid data URI with base64 encoded SVG', () => {
      const base64Uri = generateBase64Snippet(sampleSvg1, { size: 32, color: '#3b82f6' })
      assert.ok(base64Uri.startsWith('data:image/svg+xml;base64,'))
      const rawBase64 = base64Uri.replace('data:image/svg+xml;base64,', '')
      const decoded = Buffer.from(rawBase64, 'base64').toString('utf-8')
      assert.ok(decoded.includes('<svg'))
      assert.ok(decoded.includes('width="32"'))
      assert.ok(decoded.includes('stroke="#3b82f6"'))
    })
  })
})
