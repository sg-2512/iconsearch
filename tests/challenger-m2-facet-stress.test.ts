import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { GET, OPTIONS, loadIcons, detectIconStyle, detectIconColorModel, normalizeLicenseGroup } from '../app/api/icon-search/route'
import { buildIconSearchIntent, iconMatchesIntent } from '../lib/icon-intent'
import { getIconSourceSetId } from '../lib/icon-source-sets'

let ipCounter = 3000

function makeRequest(params: Record<string, string | number | boolean> = {}, customIp?: string) {
  const url = new URL('http://localhost:3000/api/icon-search')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }
  const ip = customIp || `198.51.100.${(ipCounter++ % 240) + 1}`
  return new Request(url.toString(), {
    headers: {
      'x-forwarded-for': ip,
    },
  })
}

async function queryApi(params: Record<string, string | number | boolean> = {}, customIp?: string) {
  const req = makeRequest(params, customIp)
  const res = await GET(req)
  const data = await res.json()
  return { status: res.status, headers: res.headers, data }
}

describe('Challenger 2 Empirical Verification: Facet Accuracy & Stress Testing', () => {
  const allIcons = loadIcons()

  // ══════════════════════════════════════════════════════════════════════════
  // PART 1: COMPREHENSIVE FACET ACCURACY ACROSS 355k ICONS
  // ══════════════════════════════════════════════════════════════════════════
  describe('Part 1: 355k Icon Facet Accuracy & Partition Integrity', () => {
    it('C2.01: Master database icon count matches expectation (355,702 icons)', () => {
      assert.equal(allIcons.length, 355702, 'Total loaded icons should match 355,702')
    })

    it('C2.02: Fast-path facet counts match manual single-pass ground truth across all 355,702 icons', async () => {
      const { data } = await queryApi({ legalOnly: 0 })
      assert.equal(data.total, 355702)

      // Compute ground truth directly on raw master list
      let expectedMono = 0
      let expectedMulticolor = 0
      let expectedCurated = 0
      let expectedIconify = 0
      const expectedStyles: Record<string, number> = { stroke: 0, solid: 0, duotone: 0, twotone: 0, sharp: 0 }
      const expectedLicenses: Record<string, number> = { MIT: 0, 'Apache-2.0': 0, CC0: 0, OFL: 0, ISC: 0, Other: 0 }

      for (const icon of allIcons) {
        if (icon.colorModel === 'mono') expectedMono++
        else if (icon.colorModel === 'multicolor') expectedMulticolor++

        if (icon.isCurated) expectedCurated++
        else expectedIconify++

        if (icon.style && expectedStyles[icon.style] !== undefined) {
          expectedStyles[icon.style]++
        }

        const normLic = normalizeLicenseGroup(icon.license)
        if (expectedLicenses[normLic] !== undefined) {
          expectedLicenses[normLic]++
        } else {
          expectedLicenses.Other = (expectedLicenses.Other || 0) + 1
        }
      }

      // Assert Color Models
      assert.equal(data.facets.colorModels.mono, expectedMono, 'Mono count should match ground truth')
      assert.equal(data.facets.colorModels.multicolor, expectedMulticolor, 'Multicolor count should match ground truth')
      assert.equal(data.facets.colorModels.mono + data.facets.colorModels.multicolor, 355702, 'Color models must sum to 355,702')

      // Assert Source Types
      assert.equal(data.facets.sourceTypes.curated, expectedCurated, 'Curated count should match ground truth')
      assert.equal(data.facets.sourceTypes.iconify, expectedIconify, 'Iconify count should match ground truth')
      assert.equal(data.facets.sourceTypes.curated + data.facets.sourceTypes.iconify, 355702, 'Source types must sum to 355,702')

      // Assert Licenses
      for (const [licKey, count] of Object.entries(expectedLicenses)) {
        assert.equal(data.facets.licenseCounts[licKey], count, `License ${licKey} count must match ground truth`)
      }
      const sumLicenses = Object.values(data.facets.licenseCounts as Record<string, number>).reduce((a, b) => a + b, 0)
      assert.equal(sumLicenses, 355702, 'License counts must sum exactly to 355,702')

      // Assert Styles
      for (const [styleKey, count] of Object.entries(expectedStyles)) {
        assert.equal(data.facets.styles[styleKey], count, `Style ${styleKey} count must match ground truth`)
      }
    })

    it('C2.03: Legal-only fast-path facet counts match ground truth across legalSafe subset', async () => {
      const { data } = await queryApi({ legalOnly: 1 })
      const legalIcons = allIcons.filter((i) => i.legalSafe)
      assert.equal(data.total, legalIcons.length)
      assert.equal(data.facets.legalSafeCount, legalIcons.length)

      let expectedMono = 0
      let expectedMulticolor = 0
      let expectedCurated = 0
      let expectedIconify = 0

      for (const icon of legalIcons) {
        if (icon.colorModel === 'mono') expectedMono++
        else if (icon.colorModel === 'multicolor') expectedMulticolor++
        if (icon.isCurated) expectedCurated++
        else expectedIconify++
      }

      assert.equal(data.facets.colorModels.mono, expectedMono)
      assert.equal(data.facets.colorModels.multicolor, expectedMulticolor)
      assert.equal(data.facets.colorModels.mono + data.facets.colorModels.multicolor, legalIcons.length)
      assert.equal(data.facets.sourceTypes.curated, expectedCurated)
      assert.equal(data.facets.sourceTypes.iconify, expectedIconify)
      assert.equal(data.facets.sourceTypes.curated + data.facets.sourceTypes.iconify, legalIcons.length)
    })

    it('C2.04: Dynamic facet counts accurately partition filtered query result sets', async () => {
      const testQueries = ['arrow', 'user', 'settings', 'cloud', 'chart', 'heart', 'lock', 'mail']
      
      for (const q of testQueries) {
        const { data } = await queryApi({ q, legalOnly: 0 })
        const total = data.total
        assert.ok(total > 0, `Query ${q} should have results`)

        // 1. Color model sum equals total
        const cmSum = (data.facets.colorModels.mono || 0) + (data.facets.colorModels.multicolor || 0)
        assert.equal(cmSum, total, `Color models sum must equal total for q=${q}`)

        // 2. Source types sum equals total
        const stSum = (data.facets.sourceTypes.curated || 0) + (data.facets.sourceTypes.iconify || 0)
        assert.equal(stSum, total, `Source types sum must equal total for q=${q}`)

        // 3. License counts sum equals total
        const licSum = Object.values(data.facets.licenseCounts as Record<string, number>).reduce((a, b) => a + b, 0)
        assert.equal(licSum, total, `License counts sum must equal total for q=${q}`)

        // 4. Style counts sum <= total
        const styleSum = Object.values(data.facets.styles as Record<string, number>).reduce((a, b) => a + b, 0)
        assert.ok(styleSum <= total, `Style counts sum must be <= total for q=${q}`)
      }
    })

    it('C2.05: Dynamic facet counts accurately partition category filtered sets', async () => {
      const categories = ['ai', 'alert', 'arrows', 'media', 'editor', 'communication', 'commerce', 'weather', 'devices', 'design', 'security', 'health', 'users', 'buildings']

      for (const category of categories) {
        const { data } = await queryApi({ category, legalOnly: 0 })
        const total = data.total
        assert.ok(total > 0, `Category ${category} should have results`)

        const cmSum = (data.facets.colorModels.mono || 0) + (data.facets.colorModels.multicolor || 0)
        assert.equal(cmSum, total, `Color models sum must equal total for category=${category}`)

        const stSum = (data.facets.sourceTypes.curated || 0) + (data.facets.sourceTypes.iconify || 0)
        assert.equal(stSum, total, `Source types sum must equal total for category=${category}`)

        const licSum = Object.values(data.facets.licenseCounts as Record<string, number>).reduce((a, b) => a + b, 0)
        assert.equal(licSum, total, `License counts sum must equal total for category=${category}`)
      }
    })

    it('C2.06: Dynamic facet counts under multi-filter constraints (lib + category + style)', async () => {
      const { data } = await queryApi({ lib: 'lucide-icons', style: 'stroke', category: 'arrows' })
      assert.ok(data.total > 0)
      assert.equal(data.facets.styles.stroke, data.total)
      assert.equal(data.facets.styles.solid, 0)
      assert.equal(data.facets.styles.duotone, 0)
      assert.equal(data.facets.sourceTypes.curated, data.total)
      assert.equal(data.facets.sourceTypes.iconify, 0)
      assert.equal(data.facets.licenseCounts.ISC, data.total)
    })

    it('C2.07: Style classification function detectIconStyle() correctly maps edge cases', () => {
      assert.equal(detectIconStyle({ name: 'arrow-right-solid', library: 'heroicons' }), 'solid')
      assert.equal(detectIconStyle({ name: 'arrow-right-outline', library: 'heroicons' }), 'stroke')
      assert.equal(detectIconStyle({ name: 'user-duotone', library: 'phosphor-icons' }), 'duotone')
      assert.equal(detectIconStyle({ name: 'settings-twotone', library: 'ant-design-icons' }), 'twotone')
      assert.equal(detectIconStyle({ name: 'settings-two-tone', library: 'ant-design-icons' }), 'twotone')
      assert.equal(detectIconStyle({ name: 'camera-sharp', library: 'ionicons' }), 'sharp')
      assert.equal(detectIconStyle({ name: 'heart-fill', library: 'bootstrap-icons' }), 'solid')
      assert.equal(detectIconStyle({ name: 'heart-line', library: 'remix-icon' }), 'stroke')
      assert.equal(detectIconStyle({ name: 'random-icon', library: 'lucide-icons' }), 'stroke')
      assert.equal(detectIconStyle({ name: 'random-icon', library: 'unknown-lib' }), undefined)
    })

    it('C2.08: Color model classification function detectIconColorModel() correctly maps edge cases', () => {
      assert.equal(detectIconColorModel({ name: 'flag-us', library: 'circle-flags' }), 'multicolor')
      assert.equal(detectIconColorModel({ name: 'google', library: 'logos' }), 'multicolor')
      assert.equal(detectIconColorModel({ name: 'smile', library: 'noto' }), 'multicolor')
      assert.equal(detectIconColorModel({ name: 'smile', library: 'twemoji' }), 'multicolor')
      assert.equal(detectIconColorModel({ name: 'btc', library: 'cryptocurrency-color' }), 'multicolor')
      assert.equal(detectIconColorModel({ name: 'arrow', library: 'lucide-icons' }), 'mono')
      assert.equal(detectIconColorModel({ name: 'user', library: 'heroicons' }), 'mono')
      assert.equal(detectIconColorModel({ name: 'user', library: 'custom-set', tags: ['multicolor'] }), 'multicolor')
      assert.equal(detectIconColorModel({ name: 'flag', library: 'custom-set', tags: ['flags'] }), 'multicolor')
    })

    it('C2.09: normalizeLicenseGroup correctly handles license variants', () => {
      assert.equal(normalizeLicenseGroup('MIT License'), 'MIT')
      assert.equal(normalizeLicenseGroup('Apache 2.0'), 'Apache-2.0')
      assert.equal(normalizeLicenseGroup('Apache-2.0'), 'Apache-2.0')
      assert.equal(normalizeLicenseGroup('CC0-1.0'), 'CC0')
      assert.equal(normalizeLicenseGroup('Public Domain'), 'CC0')
      assert.equal(normalizeLicenseGroup('Unlicense'), 'CC0')
      assert.equal(normalizeLicenseGroup('WTFPL'), 'CC0')
      assert.equal(normalizeLicenseGroup('SIL OFL 1.1'), 'OFL')
      assert.equal(normalizeLicenseGroup('ISC'), 'ISC')
      assert.equal(normalizeLicenseGroup('CC-BY 4.0'), 'CC-BY')
      assert.equal(normalizeLicenseGroup('GPL-3.0'), 'GPL')
      assert.equal(normalizeLicenseGroup('BSD 3-Clause'), 'BSD')
      assert.equal(normalizeLicenseGroup(undefined), 'Other')
    })
  })

  // ══════════════════════════════════════════════════════════════════════════
  // PART 2: STRESS TEST & HIGH-FREQUENCY PARAMETER PERMUTATIONS
  // ══════════════════════════════════════════════════════════════════════════
  describe('Part 2: High-Frequency Parameter Permutation Stress Testing', () => {
    const keywords = ['', 'arrow', 'user', 'settings', 'cloud', 'chart', 'edit', 'delete', 'check', 'mail', 'search', 'folder', 'plus', 'star', 'heart', 'lock', 'calendar', 'phone', 'globe', 'home']
    const styles = ['all', 'stroke', 'solid', 'duotone', 'twotone', 'sharp']
    const colorModels = ['all', 'mono', 'multicolor']
    const licenses = ['all', 'MIT', 'Apache-2.0', 'CC0', 'OFL', 'ISC']
    const sourceTypes = ['all', 'curated', 'iconify']
    const categories = ['all', 'ai', 'alert', 'arrows', 'media', 'editor', 'communication', 'commerce', 'weather', 'devices', 'design', 'security']
    const libs = ['all', 'lucide-icons', 'heroicons', 'tabler-icons', 'feather-icons', 'radix-icons', 'bootstrap-icons', 'remix-icon', 'phosphor-icons']
    const sorts = ['relevance', 'popular', 'alphabetical']
    const limits = [20, 50, 80]

    it('C2.10: Executes 250 randomized query permutations sequentially without errors or latency degradation', async () => {
      const NUM_QUERIES = 250
      const latencies: number[] = []

      for (let i = 0; i < NUM_QUERIES; i++) {
        const q = keywords[i % keywords.length]
        const style = styles[(i * 2) % styles.length]
        const colorModel = colorModels[(i * 3) % colorModels.length]
        const license = licenses[(i * 5) % licenses.length]
        const sourceType = sourceTypes[(i * 7) % sourceTypes.length]
        const category = categories[(i * 11) % categories.length]
        const lib = libs[(i * 13) % libs.length]
        const sort = sorts[i % sorts.length]
        const limit = limits[i % limits.length]
        const legalOnly = (i % 2 === 0) ? '1' : '0'

        const start = performance.now()
        const { status, data } = await queryApi({
          q,
          style,
          colorModel,
          license,
          sourceType,
          category,
          lib,
          sort,
          limit,
          legalOnly,
        })
        const duration = performance.now() - start
        latencies.push(duration)

        assert.equal(status, 200, `Query #${i} should return 200`)
        assert.ok(typeof data.total === 'number', `Query #${i} should have valid total`)
        assert.ok(Array.isArray(data.icons), `Query #${i} should have icons array`)
        assert.ok(data.facets, `Query #${i} should have facets`)
      }

      latencies.sort((a, b) => a - b)
      const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length
      const p50 = latencies[Math.floor(latencies.length * 0.5)]
      const p95 = latencies[Math.floor(latencies.length * 0.95)]
      const p99 = latencies[Math.floor(latencies.length * 0.99)]
      const max = latencies[latencies.length - 1]

      console.log(`[Sequential Stress 250 Queries] Avg: ${avg.toFixed(2)}ms | p50: ${p50.toFixed(2)}ms | p95: ${p95.toFixed(2)}ms | p99: ${p99.toFixed(2)}ms | Max: ${max.toFixed(2)}ms`)

      assert.ok(avg < 150, `Average latency (${avg.toFixed(2)}ms) should be under 150ms`)
      assert.ok(p95 < 350, `P95 latency (${p95.toFixed(2)}ms) should be under 350ms`)
    })

    it('C2.11: Executes 100 concurrent queries in parallel batches with stable performance', async () => {
      const BATCH_SIZE = 20
      const TOTAL_CONCURRENT_QUERIES = 100

      const allLatencies: number[] = []

      for (let b = 0; b < TOTAL_CONCURRENT_QUERIES / BATCH_SIZE; b++) {
        const promises = Array.from({ length: BATCH_SIZE }).map(async (_, idx) => {
          const globalIdx = b * BATCH_SIZE + idx
          const q = keywords[globalIdx % keywords.length]
          const style = styles[(globalIdx * 2) % styles.length]
          const colorModel = colorModels[(globalIdx * 3) % colorModels.length]
          const license = licenses[(globalIdx * 5) % licenses.length]
          const sourceType = sourceTypes[(globalIdx * 7) % sourceTypes.length]
          const category = categories[(globalIdx * 11) % categories.length]
          const lib = libs[(globalIdx * 13) % libs.length]
          const legalOnly = (globalIdx % 2 === 0) ? '1' : '0'

          const t0 = performance.now()
          const res = await queryApi({
            q,
            style,
            colorModel,
            license,
            sourceType,
            category,
            lib,
            legalOnly,
          })
          const lat = performance.now() - t0
          allLatencies.push(lat)

          assert.equal(res.status, 200)
          assert.ok(res.data.total >= 0)
          assert.ok(res.data.facets)
        })

        await Promise.all(promises)
      }

      allLatencies.sort((a, b) => a - b)
      const avg = allLatencies.reduce((a, b) => a + b, 0) / allLatencies.length
      const p95 = allLatencies[Math.floor(allLatencies.length * 0.95)]

      console.log(`[Concurrent Stress 100 Queries] Avg: ${avg.toFixed(2)}ms | p95: ${p95.toFixed(2)}ms`)
      assert.ok(avg < 1500, `Concurrent average latency (${avg.toFixed(2)}ms) should remain under 1500ms`)
    })

    it('C2.12: High-cardinality combinatorial filter verification (Style x ColorModel x License x SourceType)', async () => {
      const testCombinations = [
        { sourceType: 'curated', colorModel: 'mono', style: 'stroke', license: 'MIT' },
        { sourceType: 'curated', colorModel: 'mono', style: 'solid', license: 'Apache-2.0' },
        { sourceType: 'curated', colorModel: 'mono', style: 'duotone', license: 'MIT' },
        { sourceType: 'iconify', colorModel: 'multicolor', style: 'all', license: 'all' },
        { sourceType: 'all', colorModel: 'multicolor', style: 'all', license: 'CC0' },
        { sourceType: 'curated', colorModel: 'mono', style: 'all', license: 'OFL' },
        { sourceType: 'curated', colorModel: 'mono', style: 'all', license: 'ISC' },
        { sourceType: 'iconify', colorModel: 'mono', style: 'sharp', license: 'all' },
      ]

      for (const comb of testCombinations) {
        const { status, data } = await queryApi({
          sourceType: comb.sourceType,
          colorModel: comb.colorModel,
          style: comb.style,
          license: comb.license,
          limit: 10,
        })
        assert.equal(status, 200)
        assert.ok(typeof data.total === 'number')

        if (data.total > 0) {
          for (const icon of data.icons) {
            if (comb.sourceType === 'curated') {
              assert.ok(icon.isCurated, `Icon ${icon.name} should be curated`)
            }
            if (comb.colorModel !== 'all') {
              assert.equal(icon.colorModel, comb.colorModel, `Icon ${icon.name} colorModel mismatch`)
            }
            if (comb.style !== 'all') {
              assert.equal(icon.style, comb.style, `Icon ${icon.name} style mismatch`)
            }
            if (comb.license !== 'all') {
              assert.equal(normalizeLicenseGroup(icon.license), normalizeLicenseGroup(comb.license), `Icon ${icon.name} normalized license mismatch`)
            }
          }
        }
      }
    })

    it('C2.13: Edge Case: Zero-result facet verification preserves valid structure with zeros', async () => {
      const { status, data } = await queryApi({
        q: 'xyznonexistentterm99999random',
        style: 'duotone',
        colorModel: 'multicolor',
      })
      assert.equal(status, 200)
      assert.equal(data.total, 0)
      assert.equal(data.icons.length, 0)
      assert.equal(data.facets.styles.stroke, 0)
      assert.equal(data.facets.styles.solid, 0)
      assert.equal(data.facets.styles.duotone, 0)
      assert.equal(data.facets.styles.twotone, 0)
      assert.equal(data.facets.styles.sharp, 0)
      assert.equal(data.facets.colorModels.mono, 0)
      assert.equal(data.facets.colorModels.multicolor, 0)
      assert.equal(data.facets.sourceTypes.curated, 0)
      assert.equal(data.facets.sourceTypes.iconify, 0)
      assert.equal(data.facets.licenseCounts.MIT, 0)
    })
  })
})
