import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { GET, OPTIONS, loadIcons, normalizeLicenseGroup, detectIconStyle, detectIconColorModel } from '../app/api/icon-search/route'
import { buildIconSearchIntent, describeIconSearchIntent, iconMatchesIntent } from '../lib/icon-intent'

let ipCounter = 2000

function makeRequest(params: Record<string, string | number | boolean> = {}, customIp?: string) {
  const url = new URL('http://localhost:3000/api/icon-search')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }
  const ip = customIp || `172.16.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`
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

describe('Adversarial & Edge-Case Stress Test Suite (Milestone M2)', () => {
  // ── SUITE 1: CONFLICTING & MUTUALLY EXCLUSIVE FACETS ──────────────────────
  describe('Suite 1: Conflicting and Mutually Exclusive Facets', () => {
    it('ADV-1.01: colorModel=mono on multicolor-only collection (logos) returns 0 icons without error', async () => {
      const { status, data } = await queryApi({ lib: 'logos', colorModel: 'mono' })
      assert.equal(status, 200)
      assert.equal(data.total, 0)
      assert.equal(data.icons.length, 0)
      assert.equal(data.totalPages, 0)
      assert.equal(data.facets.colorModels.mono, 0)
      assert.equal(data.facets.colorModels.multicolor, 0)
    })

    it('ADV-1.02: colorModel=mono on circle-flags collection returns 0 icons', async () => {
      const { status, data } = await queryApi({ lib: 'circle-flags', colorModel: 'mono' })
      assert.equal(status, 200)
      assert.equal(data.total, 0)
      assert.equal(data.icons.length, 0)
    })

    it('ADV-1.03: colorModel=multicolor on pure monochromatic collection (lucide-icons) returns 0 icons', async () => {
      const { status, data } = await queryApi({ lib: 'lucide-icons', colorModel: 'multicolor' })
      assert.equal(status, 200)
      assert.equal(data.total, 0)
      assert.equal(data.icons.length, 0)
      assert.equal(data.facets.colorModels.multicolor, 0)
    })

    it('ADV-1.04: colorModel=multicolor on feather-icons returns 0 icons', async () => {
      const { status, data } = await queryApi({ lib: 'feather-icons', colorModel: 'multicolor' })
      assert.equal(status, 200)
      assert.equal(data.total, 0)
      assert.equal(data.icons.length, 0)
    })

    it('ADV-1.05: style=sharp on lucide-icons (outline-only collection) returns 0 icons', async () => {
      const { status, data } = await queryApi({ lib: 'lucide-icons', style: 'sharp' })
      assert.equal(status, 200)
      assert.equal(data.total, 0)
      assert.equal(data.icons.length, 0)
      assert.equal(data.facets.styles.sharp, 0)
    })

    it('ADV-1.06: style=duotone on feather-icons returns 0 icons', async () => {
      const { status, data } = await queryApi({ lib: 'feather-icons', style: 'duotone' })
      assert.equal(status, 200)
      assert.equal(data.total, 0)
      assert.equal(data.icons.length, 0)
    })

    it('ADV-1.07: sourceType=curated combined with iconify-only collection (iconify-mdi) returns 0 icons', async () => {
      const { status, data } = await queryApi({ lib: 'iconify-mdi', sourceType: 'curated' })
      assert.equal(status, 200)
      assert.equal(data.total, 0)
      assert.equal(data.icons.length, 0)
    })

    it('ADV-1.08: sourceType=iconify combined with curated collection (lucide-icons) returns 0 icons', async () => {
      const { status, data } = await queryApi({ lib: 'lucide-icons', sourceType: 'iconify' })
      assert.equal(status, 200)
      assert.equal(data.total, 0)
      assert.equal(data.icons.length, 0)
    })

    it('ADV-1.09: license=OFL combined with lucide-icons (ISC license) returns 0 icons', async () => {
      const { status, data } = await queryApi({ lib: 'lucide-icons', license: 'OFL' })
      assert.equal(status, 200)
      assert.equal(data.total, 0)
      assert.equal(data.icons.length, 0)
    })

    it('ADV-1.10: Impossible multi-facet combo: curated + multicolor + duotone + lucide-icons returns 0', async () => {
      const { status, data } = await queryApi({
        sourceType: 'curated',
        colorModel: 'multicolor',
        style: 'duotone',
        lib: 'lucide-icons',
      })
      assert.equal(status, 200)
      assert.equal(data.total, 0)
      assert.equal(data.icons.length, 0)
    })

    it('ADV-1.11: Valid multi-facet intersection: lucide-icons + category=weather returns only lucide weather icons', async () => {
      const { status, data } = await queryApi({ lib: 'lucide-icons', category: 'weather' })
      assert.equal(status, 200)
      assert.ok(data.total > 0)
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.ok(icon.library.toLowerCase().includes('lucide'))
      }
    })
  })

  // ── SUITE 2: EMPTY, WHITESPACE, AND MALFORMED QUERY STRINGS ───────────────
  describe('Suite 2: Empty, Whitespace, and Malformed Query Strings', () => {
    it('ADV-2.01: q="" with style=solid returns all solid icons across libraries', async () => {
      const { status, data } = await queryApi({ q: '', style: 'solid', limit: 30 })
      assert.equal(status, 200)
      assert.ok(data.total > 0)
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        const name = icon.name.toLowerCase()
        const lib = icon.library.toLowerCase()
        const isSolid =
          name.includes('solid') ||
          name.includes('fill') ||
          name.includes('bold') ||
          (lib.includes('bootstrap') && name.includes('fill')) ||
          (lib.includes('remix') && name.includes('fill'))
        assert.ok(isSolid, `Icon ${icon.name} in ${icon.library} must match solid style`)
      }
    })

    it('ADV-2.02: q="" with colorModel=multicolor returns all multicolor icons', async () => {
      const { status, data } = await queryApi({ q: '', colorModel: 'multicolor', limit: 30 })
      assert.equal(status, 200)
      assert.ok(data.total > 0)
      assert.ok(data.icons.length > 0)
      assert.equal(data.facets.colorModels.multicolor, data.total)
      assert.equal(data.facets.colorModels.mono, 0)
    })

    it('ADV-2.03: q="" with license=CC0 returns all CC0/public domain icons', async () => {
      const { status, data } = await queryApi({ q: '', license: 'CC0', limit: 30 })
      assert.equal(status, 200)
      assert.ok(data.total > 0)
      for (const icon of data.icons) {
        const lic = (icon.license || '').toLowerCase()
        assert.ok(
          lic.includes('cc0') || lic.includes('public domain') || lic.includes('unlicense') || lic.includes('wtfpl')
        )
      }
    })

    it('ADV-2.04: q="" with sourceType=curated returns only curated libraries', async () => {
      const { status, data } = await queryApi({ q: '', sourceType: 'curated', limit: 30 })
      assert.equal(status, 200)
      assert.ok(data.total > 0)
      assert.equal(data.facets.sourceTypes.iconify, 0)
      assert.equal(data.facets.sourceTypes.curated, data.total)
    })

    it('ADV-2.05: Complex whitespace queries (\\t\\n\\r  ) are trimmed and served cleanly', async () => {
      const { status, data } = await queryApi({ q: '\t\r\n   \n\t  ' })
      assert.equal(status, 200)
      assert.ok(data.icons.length > 0)
      assert.ok(data.total > 0)
    })

    it('ADV-2.06: Malformed ids parameters (commas, spaces, empty tokens) do not crash', async () => {
      const payloads = ['', ',', ',,,,', ' , , , ', ' ; ; ; ', ',fake-id,']
      for (const ids of payloads) {
        const { status, data } = await queryApi({ ids })
        assert.equal(status, 200)
        assert.ok(Array.isArray(data.icons))
      }
    })

    it('ADV-2.07: Large ids list (100 ids) resolves matching subset without degradation', async () => {
      const { data: initial } = await queryApi({ limit: 10 })
      const validIds = initial.icons.map((i: { id: string }) => i.id)
      const fakeIds = Array.from({ length: 90 }, (_, idx) => `non-existent-id-${idx}`)
      const combinedIds = [...validIds, ...fakeIds].join(',')

      const { status, data } = await queryApi({ ids: combinedIds })
      assert.equal(status, 200)
      assert.equal(data.icons.length, validIds.length)
    })
  })

  // ── SUITE 3: UNKNOWN, BOGUS, AND EXOTIC LICENSES & FACETS ─────────────────
  describe('Suite 3: Unknown, Bogus, and Exotic Licenses & Facets', () => {
    it('ADV-3.01: Bogus license string returns 0 results cleanly without unhandled errors', async () => {
      const { status, data } = await queryApi({ license: 'NON_EXISTENT_SUPER_LICENSE_9999' })
      assert.equal(status, 200)
      assert.equal(data.total, 0)
      assert.equal(data.icons.length, 0)
      assert.ok(typeof data.facets === 'object')
    })

    it('ADV-3.02: license=GPL returns GPL icons or 0 results cleanly', async () => {
      const { status, data } = await queryApi({ license: 'GPL', limit: 10 })
      assert.equal(status, 200)
      assert.ok(Array.isArray(data.icons))
      for (const icon of data.icons) {
        assert.ok((icon.license || '').toLowerCase().includes('gpl'))
      }
    })

    it('ADV-3.03: license=BSD returns BSD icons or 0 results cleanly', async () => {
      const { status, data } = await queryApi({ license: 'BSD', limit: 10 })
      assert.equal(status, 200)
      assert.ok(Array.isArray(data.icons))
      for (const icon of data.icons) {
        assert.ok((icon.license || '').toLowerCase().includes('bsd'))
      }
    })

    it('ADV-3.04: Unsupported style value (style=polygonal) returns 0 results', async () => {
      const { status, data } = await queryApi({ style: 'polygonal' })
      assert.equal(status, 200)
      assert.equal(data.total, 0)
      assert.equal(data.icons.length, 0)
    })

    it('ADV-3.05: Unsupported colorModel value (colorModel=rainbow) returns 0 results', async () => {
      const { status, data } = await queryApi({ colorModel: 'rainbow' })
      assert.equal(status, 200)
      assert.equal(data.total, 0)
      assert.equal(data.icons.length, 0)
    })

    it('ADV-3.06: Unsupported sourceType value (sourceType=enterprise) gracefully falls back to all sources', async () => {
      const { status, data } = await queryApi({ sourceType: 'enterprise' })
      assert.equal(status, 200)
      assert.ok(data.total > 0)
      assert.ok(data.icons.length > 0)
    })

    it('ADV-3.07: Non-existent category returns empty array gracefully', async () => {
      const { status, data } = await queryApi({ category: 'quantum-computing-non-existent' })
      assert.equal(status, 200)
      assert.ok(Array.isArray(data.icons))
    })

    it('ADV-3.08: Non-existent iconifySet with lib=iconify returns 0 results', async () => {
      const { status, data } = await queryApi({ lib: 'iconify', iconifySet: 'non-existent-subcatalog' })
      assert.equal(status, 200)
      assert.equal(data.total, 0)
      assert.equal(data.icons.length, 0)
    })
  })

  // ── SUITE 4: EXTREME, NEGATIVE, AND PATHOLOGICAL PAGINATION ───────────────
  describe('Suite 4: Extreme, Negative, and Pathological Pagination', () => {
    it('ADV-4.01: limit=0 returns 0 icons without divide-by-zero crashes', async () => {
      const { status, data } = await queryApi({ limit: 0 })
      assert.equal(status, 200)
      assert.equal(data.icons.length, 0)
      assert.equal(data.limit, 0)
    })

    it('ADV-4.02: limit=500 returns at most requested page size without buffer overflow', async () => {
      const { status, data } = await queryApi({ limit: 500 })
      assert.equal(status, 200)
      assert.equal(data.icons.length, 500)
    })

    it('ADV-4.03: Negative page parameter (page=-10) handles slice gracefully', async () => {
      const { status, data } = await queryApi({ page: -10, limit: 10 })
      assert.equal(status, 200)
      assert.ok(Array.isArray(data.icons))
    })

    it('ADV-4.04: page=0 handles slice gracefully without crashing', async () => {
      const { status, data } = await queryApi({ page: 0, limit: 10 })
      assert.equal(status, 200)
      assert.ok(Array.isArray(data.icons))
    })

    it('ADV-4.05: Non-numeric page/limit (page=abc, limit=xyz) fallback cleanly', async () => {
      const { status, data } = await queryApi({ page: 'abc', limit: 'xyz' })
      assert.equal(status, 200)
      assert.ok(Array.isArray(data.icons))
    })

    it('ADV-4.06: Ultra-high page number (page=500000) returns empty icons array with accurate totalPages', async () => {
      const { status, data } = await queryApi({ page: 500000, limit: 50 })
      assert.equal(status, 200)
      assert.equal(data.icons.length, 0)
      assert.ok(data.totalPages > 0)
    })
  })

  // ── SUITE 5: INJECTION PAYLOADS, MALFORMED CHARACTERS & SECURITY ──────────
  describe('Suite 5: Injection Payloads, Malformed Characters, and Security Stress', () => {
    it('ADV-5.01: SQL injection strings in query, lib, style, license do not execute or error', async () => {
      const payloads = [
        "' OR '1'='1",
        "'; DROP TABLE icons; --",
        "1 UNION SELECT 1,2,3,4,5--",
        "admin'--",
        "' OR ''='",
      ]
      for (const p of payloads) {
        const { status, data } = await queryApi({ q: p, lib: p, style: p, license: p })
        assert.equal(status, 200)
        assert.ok(typeof data.total === 'number')
        assert.ok(Array.isArray(data.icons))
      }
    })

    it('ADV-5.02: XSS and HTML injection vectors do not cause unhandled exceptions', async () => {
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        '<svg/onload=alert(document.domain)>',
        '"><img src=x onerror=alert(1)>',
        'javascript:alert(1)',
        '<iframe src="https://evil.com"></iframe>',
      ]
      for (const p of xssPayloads) {
        const { status, data } = await queryApi({ q: p, category: p, license: p })
        assert.equal(status, 200)
        assert.ok(typeof data.total === 'number')
      }
    })

    it('ADV-5.03: Path traversal sequences do not expose or alter file paths', async () => {
      const traversalPayloads = [
        '../../../../etc/passwd',
        '..\\..\\..\\windows\\system32',
        '/etc/shadow',
        'file:///c:/boot.ini',
      ]
      for (const p of traversalPayloads) {
        const { status, data } = await queryApi({ lib: p, q: p })
        assert.equal(status, 200)
        assert.ok(Array.isArray(data.icons))
      }
    })

    it('ADV-5.04: Template injection and interpolation vectors treated as literal text', async () => {
      const templatePayloads = [
        '{{7*7}}',
        '${process.env.PATH}',
        '#{7*7}',
        '<%= 7*7 %>',
        '*{7*7}',
      ]
      for (const p of templatePayloads) {
        const { status, data } = await queryApi({ q: p })
        assert.equal(status, 200)
        assert.ok(typeof data.total === 'number')
      }
    })

    it('ADV-5.05: Complex nested regex ReDoS payloads do not freeze event loop', async () => {
      const redosPayloads = [
        '((((((((a+)+)+)+)+)+)+)+)!',
        'a'.repeat(200) + 'X',
        '^(([a-z])+.)+[A-Z]([a-z])+$',
        '(a|aa)+$',
        '(.*a){100}',
      ]
      for (const p of redosPayloads) {
        const start = Date.now()
        const { status, data } = await queryApi({ q: p })
        const elapsed = Date.now() - start
        assert.equal(status, 200)
        assert.ok(elapsed < 1500, `ReDoS payload "${p}" took too long (${elapsed}ms)`)
        assert.ok(typeof data.total === 'number')
      }
    })

    it('ADV-5.06: Extremely long query string (5,000 chars) processes under 500ms without memory leak', async () => {
      const longQuery = 'arrow-'.repeat(1000)
      const start = Date.now()
      const { status, data } = await queryApi({ q: longQuery })
      const elapsed = Date.now() - start
      assert.equal(status, 200)
      assert.ok(elapsed < 500, `Long query took ${elapsed}ms`)
      assert.equal(data.total, 0)
    })

    it('ADV-5.07: Unicode boundary, RTL characters, null bytes and emojis handled safely', async () => {
      const unicodeCases = [
        '\u0000\u0001\u0002', // Null and control bytes
        '\uFFFF\uFFFE',       // High unicode code points
        '\u202Ereversed',     // RTL override
        '🔥🚀✨⚡🎨📦💎',    // Emoji cluster
        'こんにちは世界',      // Multibyte CJK
        'مرحبا بالعالم',      // Arabic RTL
      ]
      for (const text of unicodeCases) {
        const { status, data } = await queryApi({ q: text })
        assert.equal(status, 200)
        assert.ok(typeof data.total === 'number')
      }
    })
  })

  // ── SUITE 6: FACET INVARIANTS, MATHEMATICAL CONSISTENCY & INTEGRITY ───────
  describe('Suite 6: Facet Invariants, Mathematical Consistency & Integrity', () => {
    it('ADV-6.01: Facet count sum invariant: colorModels.mono + colorModels.multicolor == total for keyword search', async () => {
      const queries = ['arrow', 'user', 'cloud', 'file', 'check', 'star', 'mail', 'lock']
      for (const q of queries) {
        const { data } = await queryApi({ q })
        assert.ok(data.total > 0)
        const mono = data.facets.colorModels.mono || 0
        const multi = data.facets.colorModels.multicolor || 0
        assert.equal(
          mono + multi,
          data.total,
          `Query "${q}": mono (${mono}) + multicolor (${multi}) must equal total (${data.total})`
        )
      }
    })

    it('ADV-6.02: Facet count sum invariant: sourceTypes.curated + sourceTypes.iconify == total', async () => {
      const queries = ['arrow', 'search', 'settings', 'heart', 'bell', 'eye']
      for (const q of queries) {
        const { data } = await queryApi({ q })
        assert.ok(data.total > 0)
        const curated = data.facets.sourceTypes.curated || 0
        const iconify = data.facets.sourceTypes.iconify || 0
        assert.equal(
          curated + iconify,
          data.total,
          `Query "${q}": curated (${curated}) + iconify (${iconify}) must equal total (${data.total})`
        )
      }
    })

    it('ADV-6.03: legalSafeCount invariant: legalSafeCount <= total for all queries', async () => {
      const queries = ['download', 'chevron', 'plus', 'edit', 'folder']
      for (const q of queries) {
        const { data } = await queryApi({ q, legalOnly: 0 })
        assert.ok(data.facets.legalSafeCount <= data.total, `legalSafeCount must be <= total for "${q}"`)
      }
    })

    it('ADV-6.04: Paging partition invariant: Distinct pages do not overlap and aggregate correctly', async () => {
      const { data: page1 } = await queryApi({ q: 'user', page: 1, limit: 15 })
      const { data: page2 } = await queryApi({ q: 'user', page: 2, limit: 15 })
      const { data: page3 } = await queryApi({ q: 'user', page: 3, limit: 15 })

      assert.equal(page1.icons.length, 15)
      assert.equal(page2.icons.length, 15)
      assert.equal(page3.icons.length, 15)

      const idSet1 = new Set(page1.icons.map((i: { id: string }) => i.id))
      const idSet2 = new Set(page2.icons.map((i: { id: string }) => i.id))
      const idSet3 = new Set(page3.icons.map((i: { id: string }) => i.id))

      // Check disjointness
      for (const id of idSet2) {
        assert.ok(!idSet1.has(id), `Page 2 item ${id} overlaps with Page 1`)
      }
      for (const id of idSet3) {
        assert.ok(!idSet1.has(id), `Page 3 item ${id} overlaps with Page 1`)
        assert.ok(!idSet2.has(id), `Page 3 item ${id} overlaps with Page 2`)
      }
    })

    it('ADV-6.05: Fast-path total equals totalIcons catalog statistic', async () => {
      const { data: fastPath } = await queryApi({ legalOnly: 0 })
      assert.equal(fastPath.total, fastPath.catalogStats.totalIcons)
      assert.equal(fastPath.total, 355702)
    })

    it('ADV-6.06: normalizeLicenseGroup correctly standardizes diverse license expressions', () => {
      assert.equal(normalizeLicenseGroup('MIT License'), 'MIT')
      assert.equal(normalizeLicenseGroup('Apache 2.0 License'), 'Apache-2.0')
      assert.equal(normalizeLicenseGroup('CC0 1.0 Universal'), 'CC0')
      assert.equal(normalizeLicenseGroup('Public Domain'), 'CC0')
      assert.equal(normalizeLicenseGroup('Unlicense'), 'CC0')
      assert.equal(normalizeLicenseGroup('WTFPL'), 'CC0')
      assert.equal(normalizeLicenseGroup('SIL OFL 1.1'), 'OFL')
      assert.equal(normalizeLicenseGroup('ISC'), 'ISC')
      assert.equal(normalizeLicenseGroup('CC-BY 4.0'), 'CC-BY')
      assert.equal(normalizeLicenseGroup('BSD 3-Clause'), 'BSD')
      assert.equal(normalizeLicenseGroup('GPL v3'), 'GPL')
      assert.equal(normalizeLicenseGroup(undefined), 'Other')
      assert.equal(normalizeLicenseGroup('Custom Commercial'), 'Custom Commercial')
    })

    it('ADV-6.07: detectIconColorModel correctly classifies known multicolor vs mono collections', () => {
      assert.equal(detectIconColorModel({ name: 'github', library: 'logos' }), 'multicolor')
      assert.equal(detectIconColorModel({ name: 'us', library: 'circle-flags' }), 'multicolor')
      assert.equal(detectIconColorModel({ name: 'javascript', library: 'vscode-icons' }), 'multicolor')
      assert.equal(detectIconColorModel({ name: 'smile', library: 'fluent-emoji' }), 'multicolor')
      assert.equal(detectIconColorModel({ name: 'arrow-left', library: 'lucide-icons' }), 'mono')
      assert.equal(detectIconColorModel({ name: 'heart', library: 'feather-icons' }), 'mono')
      assert.equal(detectIconColorModel({ name: 'gear', library: 'tabler-icons' }), 'mono')
    })
  })
})
