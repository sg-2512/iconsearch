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
  renderSvgToPng,
  renderSvgToPngBlob,
  toPascalCase,
  type ExportOptions,
  type FrameShape,
  type CartItem,
  type Icon
} from '../lib/exporter'

describe('Challenger M3 Empirical Adversarial Stress Suite', () => {

  // =========================================================================
  // SECTION 1: PATHOLOGICAL SVG INPUTS & VIEWBOX ANOMALIES
  // =========================================================================
  describe('1. Pathological SVG Inputs & ViewBox Edge Cases', () => {
    it('CH1.01: SVG with missing viewBox and width/height is given a viewBox matching parsed dimensions', () => {
      const bareSvg = '<svg><path d="M0 0h10v10H0z"/></svg>'
      const customized = customizeSvg(bareSvg, { size: 48, padding: 0 })
      assert.ok(customized.includes('width="48"'))
      assert.ok(customized.includes('height="48"'))
      assert.ok(customized.includes('viewBox='))
    })

    it('CH1.02: SVG with explicit viewBox preserves coordinates accurately under resize', () => {
      const standardSvg = '<svg viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="30"/></svg>'
      const customized = customizeSvg(standardSvg, { size: 32 })
      assert.ok(customized.includes('viewBox="0 0 64 64"'))
      assert.ok(customized.includes('width="32"'))
      assert.ok(customized.includes('height="32"'))
    })

    it('CH1.03: SVG with negative coordinate origins in viewBox (e.g. -10 -10 100 100)', () => {
      const negOriginSvg = '<svg viewBox="-10 -10 100 100"><circle cx="0" cy="0" r="40"/></svg>'
      const customized = customizeSvg(negOriginSvg, { size: 50, padding: 10 })
      // scaleFactor = 100 / 50 = 2. padCoord = 20. newMin = -10 - 20 = -30. newWidth = 100 + 40 = 140
      assert.ok(customized.includes('viewBox="-30 -30 140 140"'))
    })

    it('CH1.04: SVG with comma-separated viewBox coordinates', () => {
      const commaSvg = '<svg viewBox="0,0,48,48"><rect width="48" height="48"/></svg>'
      const customized = customizeSvg(commaSvg, { size: 48, padding: 4 })
      assert.ok(customized.includes('viewBox="-4 -4 56 56"'))
    })

    it('CH1.05: SVG with floating-point decimals in viewBox (e.g. 0.5 0.5 23.5 23.5)', () => {
      const floatSvg = '<svg viewBox="0.5 0.5 23.5 23.5"><line x1="1" y1="1" x2="20" y2="20"/></svg>'
      const customized = customizeSvg(floatSvg, { size: 24, padding: 2 })
      assert.ok(customized.includes('viewBox='))
      assert.ok(!customized.includes('NaN'))
    })

    it('CH1.06: SVG with scientific notation in viewBox falls back safely without throw', () => {
      const sciSvg = '<svg viewBox="0 0 1e2 1e2" width="100" height="100"><rect width="100" height="100"/></svg>'
      const customized = customizeSvg(sciSvg, { size: 50 })
      assert.ok(typeof customized === 'string')
      assert.ok(customized.includes('width="50"'))
      assert.ok(!customized.includes('NaN'))
    })

    it('CH1.07: SVG with non-square aspect ratio viewBox (e.g. 0 0 100 50)', () => {
      const rectSvg = '<svg viewBox="0 0 100 50"><rect width="100" height="50"/></svg>'
      const customized = customizeSvg(rectSvg, { size: 50, padding: 5, frameShape: 'rounded' })
      assert.ok(customized.includes('viewBox="-10 -10 120 70"'))
      // Rounded rect matches expanded viewBox dimensions
      assert.ok(customized.includes('x="-10" y="-10" width="120" height="70"'))
    })

    it('CH1.08: Malformed viewBox with text strings does not crash parser', () => {
      const malformedSvg = '<svg viewBox="invalid coordinates here"><path d="M0 0"/></svg>'
      const customized = customizeSvg(malformedSvg, { size: 32 })
      assert.ok(typeof customized === 'string')
      assert.ok(customized.includes('width="32"'))
    })
  })

  // =========================================================================
  // SECTION 2: EXTREME PADDING & SIZE BOUNDARIES
  // =========================================================================
  describe('2. Extreme Padding & Dimension Boundaries', () => {
    it('CH2.01: Padding of 0 does not alter original viewBox', () => {
      const svg = '<svg viewBox="0 0 24 24"><path d="M12 2v20"/></svg>'
      const customized = customizeSvg(svg, { padding: 0 })
      assert.ok(customized.includes('viewBox="0 0 24 24"'))
    })

    it('CH2.02: Negative padding values are treated as non-positive (no collapse)', () => {
      const svg = '<svg viewBox="0 0 24 24"><path d="M12 2v20"/></svg>'
      const customized = customizeSvg(svg, { padding: -10 })
      assert.ok(customized.includes('viewBox="0 0 24 24"'))
    })

    it('CH2.03: Massive padding (e.g. 100px) scales viewBox correctly without overflow', () => {
      const svg = '<svg viewBox="0 0 24 24"><path d="M12 2v20"/></svg>'
      const customized = customizeSvg(svg, { size: 24, padding: 100 })
      assert.ok(customized.includes('viewBox="-100 -100 224 224"'))
    })

    it('CH2.04: Padding with size = 0 handles potential division by zero safely', () => {
      const svg = '<svg viewBox="0 0 24 24"><path d="M12 2v20"/></svg>'
      const customized = customizeSvg(svg, { size: 0, padding: 4 })
      assert.ok(customized.includes('viewBox="-4 -4 32 32"'))
      assert.ok(!customized.includes('Infinity'))
      assert.ok(!customized.includes('NaN'))
    })

    it('CH2.05: Fractional padding values (e.g. 1.25px)', () => {
      const svg = '<svg viewBox="0 0 24 24"><path d="M12 2v20"/></svg>'
      const customized = customizeSvg(svg, { size: 24, padding: 1.25 })
      assert.ok(customized.includes('viewBox="-1.25 -1.25 26.5 26.5"'))
    })

    it('CH2.06: Stroke width boundaries: 0, float 0.05, and high 10.5', () => {
      const svg = '<svg stroke="currentColor" stroke-width="2"><path d="M0 0"/></svg>'
      const zeroStroke = customizeSvg(svg, { strokeWidth: 0 })
      assert.ok(zeroStroke.includes('stroke-width="0"'))

      const microStroke = customizeSvg(svg, { strokeWidth: 0.05 })
      assert.ok(microStroke.includes('stroke-width="0.05"'))

      const macroStroke = customizeSvg(svg, { strokeWidth: 10.5 })
      assert.ok(macroStroke.includes('stroke-width="10.5"'))
    })
  })

  // =========================================================================
  // SECTION 3: CONTAINER FRAME SHAPES & STYLING
  // =========================================================================
  describe('3. Container Frame Shapes & Adverse Configurations', () => {
    it('CH3.01: Invalid or unsupported frame shape string is ignored safely', () => {
      const svg = '<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>'
      // @ts-expect-error - testing adverse input
      const customized = customizeSvg(svg, { frameShape: 'octagon' })
      assert.ok(!customized.includes('<octagon'))
      assert.ok(!customized.includes('<circle'))
      assert.ok(!customized.includes('<rect'))
    })

    it('CH3.02: Frame shape "circle" with custom frameStroke and strokeWidth', () => {
      const svg = '<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>'
      const customized = customizeSvg(svg, {
        frameShape: 'circle',
        frameColor: '#000000',
        frameStroke: '#ffffff',
        frameStrokeWidth: 2.5,
      })
      assert.ok(customized.includes('<circle cx="12" cy="12" r="12" fill="#000000" stroke="#ffffff" stroke-width="2.5" />'))
    })

    it('CH3.03: Frame shape "rounded" respects expanded padding coordinates', () => {
      const svg = '<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>'
      const customized = customizeSvg(svg, {
        size: 24,
        padding: 4,
        frameShape: 'rounded',
        frameColor: 'rgba(0,0,0,0.5)',
      })
      // With padding=4 on 24x24: viewBox="-4 -4 32 32", rx=32*0.2=6.4
      assert.ok(customized.includes('viewBox="-4 -4 32 32"'))
      assert.ok(customized.includes('<rect x="-4" y="-4" width="32" height="32" rx="6.4" ry="6.4" fill="rgba(0,0,0,0.5)" />'))
    })

    it('CH3.04: Frame shape "squircle" calculation with non-standard viewBox', () => {
      const svg = '<svg viewBox="0 0 100 100"><path d="M0 0"/></svg>'
      const customized = customizeSvg(svg, {
        frameShape: 'squircle',
        frameColor: '#6366f1',
      })
      // rx = 100 * 0.35 = 35
      assert.ok(customized.includes('<rect x="0" y="0" width="100" height="100" rx="35" ry="35" fill="#6366f1" />'))
    })

    it('CH3.05: Frame stroke "none" or "transparent" omits stroke attribute cleanly', () => {
      const svg = '<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>'
      const customizedNone = customizeSvg(svg, { frameShape: 'circle', frameStroke: 'none' })
      assert.ok(!customizedNone.includes('stroke="none"'))

      const customizedTrans = customizeSvg(svg, { frameShape: 'circle', frameStroke: 'transparent' })
      assert.ok(!customizedTrans.includes('stroke="transparent"'))
    })
  })

  // =========================================================================
  // SECTION 4: COMPLEX NESTED SVG STRUCTURES, COMMENTS, CDATA
  // =========================================================================
  describe('4. Complex Nested SVG Structures, Comments & CDATA', () => {
    it('CH4.01: SVG with XML comments, DOCTYPE and multi-line formatting', () => {
      const complexSvg = `<!-- Created with Inkscape -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <!-- Main icon glyph -->
  <g id="layer1">
    <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </g>
</svg>`
      const customized = customizeSvg(complexSvg, { size: 36, color: '#10b981' })
      assert.ok(customized.includes('width="36"'))
      assert.ok(customized.includes('fill="#10b981"'))
      assert.ok(customized.includes('d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"'))
    })

    it('CH4.02: SVG with nested <defs>, <linearGradient>, <clipPath>, <mask>', () => {
      const defsSvg = `<svg viewBox="0 0 24 24" width="24" height="24">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff0000" />
      <stop offset="100%" stop-color="#0000ff" />
    </linearGradient>
    <clipPath id="clip1">
      <circle cx="12" cy="12" r="10" />
    </clipPath>
  </defs>
  <rect width="24" height="24" fill="url(#grad1)" clip-path="url(#clip1)" />
</svg>`
      const reactCode = generateReactComponent('gradient-box', defsSvg)
      assert.ok(reactCode.includes('clipPath id="clip1"'))
      assert.ok(reactCode.includes('linearGradient id="grad1"'))
      assert.ok(reactCode.includes('IconGradientBox'))
    })

    it('CH4.03: SVG with CDATA blocks inside <style> tags', () => {
      const cdataSvg = `<svg viewBox="0 0 24 24">
  <style type="text/css">
    <![CDATA[
      .st0 { fill: currentColor; }
    ]]>
  </style>
  <path class="st0" d="M5 5h14v14H5z"/>
</svg>`
      const customized = customizeSvg(cdataSvg, { color: '#3b82f6' })
      assert.ok(customized.includes('CDATA'))
      const svelteCode = generateSvelteComponent('cdata-icon', customized)
      assert.ok(svelteCode.includes('export let size'))
    })

    it('CH4.04: SVG with self-closing inner tags (<circle />, <rect />, <polygon />)', () => {
      const multiSelfClosing = `<svg viewBox="0 0 24 24">
  <circle cx="6" cy="6" r="3" />
  <rect x="12" y="3" width="6" height="6" />
  <polygon points="6,15 12,21 3,21" />
</svg>`
      const tailwindCode = generateTailwindInlineSnippet(multiSelfClosing)
      assert.ok(tailwindCode.includes('circle cx="6" cy="6" r="3"'))
      assert.ok(tailwindCode.includes('polygon points="6,15 12,21 3,21"'))
      assert.ok(tailwindCode.includes('className="w-6 h-6 text-current"'))
    })
  })

  // =========================================================================
  // SECTION 5: COMPONENT NAME SANITIZATION & ADVERSARIAL IDENTIFIERS
  // =========================================================================
  describe('5. Component Name Sanitization & Identifier Robustness', () => {
    it('CH5.01: toPascalCase handles multi-word hyphens and underscores', () => {
      assert.equal(toPascalCase('arrow-circle-up-right'), 'ArrowCircleUpRight')
      assert.equal(toPascalCase('user_profile_avatar_badge'), 'UserProfileAvatarBadge')
    })

    it('CH5.02: toPascalCase with consecutive delimiters (---, __)', () => {
      assert.equal(toPascalCase('arrow---right'), 'ArrowRight')
      assert.equal(toPascalCase('user___name'), 'UserName')
    })

    it('CH5.03: toPascalCase with numeric prefixes and suffixes', () => {
      assert.equal(toPascalCase('3d-cube-4k'), '3dCube4k')
      assert.equal(toPascalCase('123-number'), '123Number')
    })

    it('CH5.04: React Component generation with complex name strings', () => {
      const code1 = generateReactComponent('layout-grid-3x3', '<svg><path d="M0 0"/></svg>')
      assert.ok(code1.includes('function IconLayoutGrid3x3('))

      const code2 = generateReactComponent('file-code-2', '<svg><path d="M0 0"/></svg>')
      assert.ok(code2.includes('function IconFileCode2('))
    })

    it('CH5.05: Svelte & Vue generation with single-letter names', () => {
      const svelte = generateSvelteComponent('x', '<svg><path d="M0 0"/></svg>')
      assert.ok(svelte.includes('<script lang="ts">'))

      const vue = generateVueComponent('<svg><path d="M0 0"/></svg>')
      assert.ok(vue.includes('<template>'))
    })
  })

  // =========================================================================
  // SECTION 6: UNIVERSAL CODE EXPORTER MULTI-FORMAT SYNTAX INTEGRITY
  // =========================================================================
  describe('6. Code Generation Integrity Across All Formats', () => {
    const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-activity"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`

    it('CH6.01: React JSX component converts all SVG attributes to React camelCase conventions', () => {
      const reactCode = generateReactComponent('activity', testSvg)
      assert.ok(!reactCode.includes('stroke-width='))
      assert.ok(!reactCode.includes('stroke-linecap='))
      assert.ok(!reactCode.includes('stroke-linejoin='))
      assert.ok(!reactCode.includes('class='))
      assert.ok(reactCode.includes('strokeWidth='))
      assert.ok(reactCode.includes('strokeLinecap='))
      assert.ok(reactCode.includes('strokeLinejoin='))
      assert.ok(reactCode.includes('className='))
      assert.ok(reactCode.includes('width={size}'))
      assert.ok(reactCode.includes('height={size}'))
      assert.ok(reactCode.includes('<svg {...props}'))
    })

    it('CH6.02: Vue 3 component binds dynamic props correctly without duplicating attrs', () => {
      const vueCode = generateVueComponent(testSvg)
      assert.ok(vueCode.includes(':width="size"'))
      assert.ok(vueCode.includes(':height="size"'))
      assert.ok(!vueCode.includes('width="24"'))
      assert.ok(!vueCode.includes('height="24"'))
      assert.ok(vueCode.includes('<script setup>'))
      assert.ok(vueCode.includes('defineProps({'))
    })

    it('CH6.03: Svelte component binds typed props and forwards restProps', () => {
      const svelteCode = generateSvelteComponent('activity', testSvg)
      assert.ok(svelteCode.includes('width={size}'))
      assert.ok(svelteCode.includes('height={size}'))
      assert.ok(svelteCode.includes('{...$$restProps}'))
      assert.ok(svelteCode.includes('export let size: number | string = 24'))
      assert.ok(svelteCode.includes("export let color: string = 'currentColor'"))
      assert.ok(svelteCode.includes('export let strokeWidth: number | string = 2'))
    })

    it('CH6.04: Tailwind inline snippet replaces class with custom or default className', () => {
      const tailwindCode1 = generateTailwindInlineSnippet(testSvg)
      assert.ok(tailwindCode1.includes('className="w-6 h-6 text-current"'))
      assert.ok(!tailwindCode1.includes('class="feather feather-activity"'))

      const tailwindCode2 = generateTailwindInlineSnippet(testSvg, {
        className: 'size-5 text-emerald-500 hover:text-emerald-400 transition-colors',
      })
      assert.ok(tailwindCode2.includes('className="size-5 text-emerald-500 hover:text-emerald-400 transition-colors"'))
    })

    it('CH6.05: SVG Sprite compiler combines multiple icons into symbol tags', () => {
      const items: { item: CartItem; svg: string }[] = [
        {
          item: {
            key: 'item1',
            icon: { id: 'lucide-arrow', name: 'arrow-right', displayName: 'ArrowRight', library: 'lucide', libraryName: 'Lucide', npmPackage: 'lucide-react', license: 'ISC', tags: [], reactImport: '', reactUsage: '', svgUrl: '' },
            size: 24,
            stroke: 2,
            color: '#ff0000',
          },
          svg: testSvg,
        },
        {
          item: {
            key: 'item2',
            icon: { id: 'lucide-check', name: 'check', displayName: 'Check', library: 'lucide', libraryName: 'Lucide', npmPackage: 'lucide-react', license: 'ISC', tags: [], reactImport: '', reactUsage: '', svgUrl: '' },
            size: 32,
            stroke: 1.5,
            color: '#00ff00',
          },
          svg: testSvg,
        },
      ]

      const sprite = compileSvgSprite(items, false, 2, 'currentColor')
      assert.ok(sprite.includes('<symbol id="icon-lucide-arrow-right"'))
      assert.ok(sprite.includes('<symbol id="icon-lucide-check"'))
      assert.ok(sprite.includes('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'))
    })
  })

  // =========================================================================
  // SECTION 7: RE-CUSTOMIZATION IDEMPOTENCY & STACKED OPERATIONS
  // =========================================================================
  describe('7. Re-customization Idempotency & Multi-Pass Transformations', () => {
    it('CH7.01: Passing an already customized SVG through customizeSvg again produces clean output without duplicate attributes', () => {
      const baseSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0"/></svg>'
      const pass1 = customizeSvg(baseSvg, { size: 32, strokeWidth: 1.5, color: '#3b82f6', padding: 2 })
      const pass2 = customizeSvg(pass1, { size: 48, strokeWidth: 2.0, color: '#ef4444', padding: 4 })

      // Should not have duplicate width/height or stroke-width attributes
      const widthMatches = pass2.match(/width="48"/g)
      const heightMatches = pass2.match(/height="48"/g)
      const strokeMatches = pass2.match(/stroke-width="2"/g)

      assert.equal(widthMatches?.length, 1)
      assert.equal(heightMatches?.length, 1)
      assert.equal(strokeMatches?.length, 1)
      assert.ok(!pass2.includes('width="32"'))
      assert.ok(!pass2.includes('stroke-width="1.5"'))
    })

    it('CH7.02: Multi-pass frame addition cleanly maintains valid SVG root tag', () => {
      const baseSvg = '<svg viewBox="0 0 24 24"><path d="M5 5h14v14H5z"/></svg>'
      const framed = customizeSvg(baseSvg, { frameShape: 'circle', frameColor: '#123456' })
      assert.ok(framed.includes('<circle cx="12" cy="12" r="12"'))
      assert.ok(framed.includes('<path d="M5 5h14v14H5z"/>'))
    })
  })

  // =========================================================================
  // SECTION 8: FULL JSZIP ARCHIVE BATCH VALIDATION
  // =========================================================================
  describe('8. Batch Multi-Format ZIP Archive Assembly Stress Test', () => {
    it('CH8.01: Batch exports 20 diverse icons into ZIP and verifies all folders and metadata', async () => {
      const zip = new JSZip()
      const svgFolder = zip.folder('svg')
      const reactFolder = zip.folder('react')
      const vueFolder = zip.folder('vue')
      const svelteFolder = zip.folder('svelte')
      const tailwindFolder = zip.folder('tailwind-html')

      const icons = Array.from({ length: 20 }, (_, i) => ({
        name: `icon-test-${i + 1}`,
        svg: `<svg viewBox="0 0 24 24"><circle cx="${i}" cy="${i}" r="5"/></svg>`,
      }))

      for (const icon of icons) {
        const customized = customizeSvg(icon.svg, { size: 28, strokeWidth: 1.8, color: '#6366f1' })
        svgFolder?.file(`${icon.name}.svg`, customized)
        reactFolder?.file(`Icon${toPascalCase(icon.name)}.tsx`, generateReactComponent(icon.name, customized))
        vueFolder?.file(`Icon${toPascalCase(icon.name)}.vue`, generateVueComponent(customized))
        svelteFolder?.file(`Icon${toPascalCase(icon.name)}.svelte`, generateSvelteComponent(icon.name, customized))
        tailwindFolder?.file(`${icon.name}.html`, generateTailwindInlineSnippet(customized))
      }

      zip.file('metadata.json', JSON.stringify({
        totalIcons: 20,
        exportedAt: new Date().toISOString(),
      }))

      const buffer = await zip.generateAsync({ type: 'nodebuffer' })
      assert.ok(buffer.length > 2000)

      const unzipped = await JSZip.loadAsync(buffer)
      const fileNames = Object.keys(unzipped.files).filter(f => !unzipped.files[f].dir)
      assert.equal(fileNames.filter(f => f.startsWith('svg/')).length, 20)
      assert.equal(fileNames.filter(f => f.startsWith('react/')).length, 20)
      assert.equal(fileNames.filter(f => f.startsWith('vue/')).length, 20)
      assert.equal(fileNames.filter(f => f.startsWith('svelte/')).length, 20)
      assert.equal(fileNames.filter(f => f.startsWith('tailwind-html/')).length, 20)
      assert.ok(unzipped.file('metadata.json'))
    })
  })
})
