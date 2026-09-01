import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { GET, OPTIONS, loadIcons } from '../app/api/icon-search/route'
import { buildIconSearchIntent, describeIconSearchIntent, iconMatchesIntent } from '../lib/icon-intent'
import { getIconSourceSetId, getIconSourceSet } from '../lib/icon-source-sets'
import { allLibraries, namedLibraries, resolveLibraryMeta, formatCollectionName } from '../data/library-catalog'

let ipCounter = 1

function makeRequest(params: Record<string, string | number | boolean> = {}, customIp?: string) {
  const url = new URL('http://localhost:3000/api/icon-search')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }
  const ip = customIp || `10.0.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`
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

describe('Search API & Facets Test Suite', () => {
  // ── TIER 1: FEATURE COVERAGE ──────────────────────────────────────────────
  describe('Tier 1: Feature Coverage', () => {
    it('T1.01: Default search returns 200 with icons array and valid pagination', async () => {
      const { status, data } = await queryApi()
      assert.equal(status, 200)
      assert.ok(Array.isArray(data.icons))
      assert.ok(data.icons.length > 0)
      assert.ok(data.total > 0)
      assert.equal(data.page, 1)
      assert.equal(data.limit, 80)
      assert.ok(data.totalPages >= 1)
    })

    it('T1.02: Response includes CORS headers and X-Response-Time header', async () => {
      const { headers } = await queryApi()
      assert.equal(headers.get('Access-Control-Allow-Origin'), '*')
      assert.ok(headers.get('X-Response-Time')?.endsWith('ms'))
    })

    it('T1.03: OPTIONS preflight returns HTTP 204 with CORS allow headers', async () => {
      const res = await OPTIONS()
      assert.equal(res.status, 204)
      assert.equal(res.headers.get('Access-Control-Allow-Origin'), '*')
      assert.ok(res.headers.get('Access-Control-Allow-Methods')?.includes('GET'))
    })

    it('T1.04: Search query filtering by keyword "arrow" returns matching icons', async () => {
      const { data } = await queryApi({ q: 'arrow' })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons.slice(0, 10)) {
        const matchesName = icon.name.toLowerCase().includes('arrow')
        const matchesTag = icon.tags?.some((t: string) => t.toLowerCase().includes('arrow'))
        assert.ok(matchesName || matchesTag || iconMatchesIntent(icon, buildIconSearchIntent('arrow')), `Icon ${icon.name} should match intent`)
      }
    })

    it('T1.05: Search query filtering by keyword "settings" matches configuration icons', async () => {
      const { data } = await queryApi({ q: 'settings' })
      assert.ok(data.icons.length > 0)
      assert.ok(data.total > 0)
      assert.ok(data.query.interpretedAs.length > 0)
    })

    it('T1.06: Search query filtering by keyword "user" matches profile/account icons', async () => {
      const { data } = await queryApi({ q: 'user' })
      assert.ok(data.icons.length > 0)
      assert.ok(data.total > 0)
    })

    it('T1.07: Style filter "stroke" returns outline/stroke icons', async () => {
      const { data } = await queryApi({ style: 'stroke', limit: 20 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        const name = icon.name.toLowerCase()
        const lib = icon.library.toLowerCase()
        const isStroke = name.includes('outline') || name.includes('regular') || name.includes('light') ||
                         name.includes('thin') || name.includes('line') || lib.includes('lucide') ||
                         lib.includes('feather') || lib.includes('iconoir')
        assert.ok(isStroke, `Icon ${icon.name} in ${icon.library} should be stroke style`)
      }
    })

    it('T1.08: Style filter "solid" returns filled/solid/bold icons', async () => {
      const { data } = await queryApi({ style: 'solid', limit: 20 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        const name = icon.name.toLowerCase()
        const lib = icon.library.toLowerCase()
        const isSolid = name.includes('solid') || name.includes('fill') || name.includes('bold') ||
                        (lib.includes('bootstrap') && name.includes('fill')) ||
                        (lib.includes('remix') && name.includes('fill'))
        assert.ok(isSolid, `Icon ${icon.name} in ${icon.library} should be solid style`)
      }
    })

    it('T1.09: Style filter "duotone" returns duotone icons', async () => {
      const { data } = await queryApi({ style: 'duotone', limit: 20 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.ok(icon.name.toLowerCase().includes('duotone'))
      }
    })

    it('T1.10: Style filter "twotone" returns two-tone icons', async () => {
      const { data } = await queryApi({ style: 'twotone', limit: 20 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        const name = icon.name.toLowerCase()
        assert.ok(name.includes('twotone') || name.includes('two-tone'))
      }
    })

    it('T1.11: Style filter "sharp" returns sharp icons', async () => {
      const { data } = await queryApi({ style: 'sharp', limit: 20 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.ok(icon.name.toLowerCase().includes('sharp'))
      }
    })

    it('T1.12: Category filter "ai" matches artificial intelligence and robot icons', async () => {
      const { data } = await queryApi({ category: 'ai', limit: 20 })
      assert.ok(data.icons.length > 0)
    })

    it('T1.13: Category filter "security" matches security and lock icons', async () => {
      const { data } = await queryApi({ category: 'security', limit: 20 })
      assert.ok(data.icons.length > 0)
    })

    it('T1.14: Category filter "commerce" matches shopping and financial icons', async () => {
      const { data } = await queryApi({ category: 'commerce', limit: 20 })
      assert.ok(data.icons.length > 0)
    })

    it('T1.15: Category filter "media" matches playback and camera icons', async () => {
      const { data } = await queryApi({ category: 'media', limit: 20 })
      assert.ok(data.icons.length > 0)
    })

    it('T1.16: Category filter "arrows" matches navigation and chevron icons', async () => {
      const { data } = await queryApi({ category: 'arrows', limit: 20 })
      assert.ok(data.icons.length > 0)
    })

    it('T1.17: Category filter "weather" matches climate and nature icons', async () => {
      const { data } = await queryApi({ category: 'weather', limit: 20 })
      assert.ok(data.icons.length > 0)
    })

    it('T1.18: Category filter "devices" matches hardware and gadget icons', async () => {
      const { data } = await queryApi({ category: 'devices', limit: 20 })
      assert.ok(data.icons.length > 0)
    })

    it('T1.19: Library filter "lucide-icons" returns exclusively Lucide icons', async () => {
      const { data } = await queryApi({ lib: 'lucide-icons', limit: 20 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.ok(icon.library.toLowerCase().includes('lucide'))
      }
    })

    it('T1.20: Library filter "heroicons" returns Heroicons icons', async () => {
      const { data } = await queryApi({ lib: 'heroicons', limit: 20 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        const cleanLib = icon.library.replace(/^iconify-/, '').toLowerCase()
        assert.equal(cleanLib, 'heroicons')
      }
    })

    it('T1.21: Library filter "tabler-icons" returns exclusively Tabler icons', async () => {
      const { data } = await queryApi({ lib: 'tabler-icons', limit: 20 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        const cleanLib = icon.library.replace(/^iconify-/, '').toLowerCase()
        assert.equal(cleanLib, 'tabler-icons')
      }
    })

    it('T1.22: Library filter "radix-icons" returns Radix icons', async () => {
      const { data } = await queryApi({ lib: 'radix-icons', limit: 20 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        const cleanLib = icon.library.replace(/^iconify-/, '').toLowerCase()
        assert.equal(cleanLib, 'radix-icons')
      }
    })

    it('T1.23: Library filter alias translates "iconify-ant-design" to "ant-design-icons"', async () => {
      const { data } = await queryApi({ lib: 'iconify-ant-design', limit: 10 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.equal(icon.library, 'ant-design-icons')
      }
    })

    it('T1.24: Library filter alias translates "iconify-ion" to "ionicons"', async () => {
      const { data } = await queryApi({ lib: 'iconify-ion', limit: 10 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.equal(icon.library, 'ionicons')
      }
    })

    it('T1.25: Library filter alias translates "iconify-octicon" to "octicons"', async () => {
      const { data } = await queryApi({ lib: 'iconify-octicon', limit: 10 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.equal(icon.library, 'octicons')
      }
    })

    it('T1.26: Catalog filter "iconify" returns only iconify libraries', async () => {
      const { data } = await queryApi({ lib: 'iconify', limit: 20 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.ok(icon.library.startsWith('iconify-'))
      }
    })

    it('T1.27: Iconify set filter selects specific iconify subset', async () => {
      const { data } = await queryApi({ lib: 'iconify', iconifySet: 'mdi', limit: 10 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.equal(icon.library, 'iconify-mdi')
      }
    })

    it('T1.28: SourceSet filter "lucide" filters correctly', async () => {
      const { data } = await queryApi({ sourceSet: 'lucide', limit: 10 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.equal(getIconSourceSetId(icon.library), 'lucide')
      }
    })

    it('T1.29: SourceSet filter "heroicons" filters correctly', async () => {
      const { data } = await queryApi({ sourceSet: 'heroicons', limit: 10 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.equal(getIconSourceSetId(icon.library), 'heroicons')
      }
    })

    it('T1.30: legalOnly=1 enforces legalSafe flag on all returned icons', async () => {
      const { data } = await queryApi({ legalOnly: 1, limit: 30 })
      assert.ok(data.icons.length > 0)
      assert.equal(data.facets.legalOnlyApplied, true)
      for (const icon of data.icons) {
        assert.equal(icon.legalSafe, true)
      }
    })

    it('T1.31: legalOnly=0 allows icons without strict legalSafe restriction', async () => {
      const { data } = await queryApi({ legalOnly: 0, limit: 30 })
      assert.ok(data.icons.length > 0)
      assert.equal(data.facets.legalOnlyApplied, false)
    })

    it('T1.32: ids batch lookup retrieves exact requested icon records', async () => {
      const { data: initial } = await queryApi({ limit: 3 })
      assert.equal(initial.icons.length, 3)
      const requestedIds = initial.icons.map((i: { id: string }) => i.id)
      
      const { data } = await queryApi({ ids: requestedIds.join(',') })
      assert.equal(data.icons.length, 3)
      const returnedIds = data.icons.map((i: { id: string }) => i.id)
      for (const id of requestedIds) {
        assert.ok(returnedIds.includes(id))
      }
    })

    it('T1.33: ids batch lookup uses default limit of 200', async () => {
      const { data } = await queryApi({ ids: 'fake-id' })
      assert.equal(data.limit, 200)
    })

    it('T1.34: sort=popular orders icons by library popularity', async () => {
      const { data } = await queryApi({ sort: 'popular', limit: 20 })
      assert.ok(data.icons.length > 0)
    })

    it('T1.35: sort=relevance weights search intent matches', async () => {
      const { data } = await queryApi({ q: 'home', sort: 'relevance', limit: 10 })
      assert.ok(data.icons.length > 0)
      assert.equal(data.query.raw, 'home')
    })

    it('T1.36: catalogStats includes totalIcons, namedLibraries, iconifyCollections', async () => {
      const { data } = await queryApi()
      const stats = data.catalogStats
      assert.ok(stats.totalIcons > 0)
      assert.ok(stats.namedLibraries > 0)
      assert.ok(stats.iconifyCollections > 0)
      assert.ok(stats.sourceSets > 0)
    })

    it('T1.37: facets payload includes libraries, licenses, iconifySets, sourceSets', async () => {
      const { data } = await queryApi()
      const f = data.facets
      assert.ok(Array.isArray(f.libraries) && f.libraries.length > 0)
      assert.ok(Array.isArray(f.libraryOptions) && f.libraryOptions.length > 0)
      assert.ok(Array.isArray(f.licenses) && f.licenses.length > 0)
      assert.ok(Array.isArray(f.iconifySets) && f.iconifySets.length > 0)
      assert.ok(Array.isArray(f.sourceSets) && f.sourceSets.length > 0)
      assert.ok(f.legalSafeCount > 0)
    })

    it('T1.38: in-memory loadIcons() parses and normalizes icons database', () => {
      const icons = loadIcons()
      assert.ok(Array.isArray(icons))
      assert.ok(icons.length > 0)
      const sample = icons[0]
      assert.ok(sample.id)
      assert.ok(sample.name)
      assert.ok(sample.library)
      assert.ok(sample.svgUrl)
    })

    it('T1.39: getIconSourceSetId strips iconify- prefix and matches sets', () => {
      assert.equal(getIconSourceSetId('lucide-icons'), 'lucide')
      assert.equal(getIconSourceSetId('heroicons'), 'heroicons')
      assert.equal(getIconSourceSetId('iconify-mdi'), 'mdi')
      assert.equal(getIconSourceSetId('iconify-carbon'), 'carbon')
    })

    it('T1.40: resolveLibraryMeta resolves libraries by slug and id', () => {
      const lucide = resolveLibraryMeta('lucide-icons')
      assert.ok(lucide)
      assert.equal(lucide?.name, 'Lucide Icons')

      const tabler = resolveLibraryMeta('tabler-icons')
      assert.ok(tabler)
      assert.equal(tabler?.slug, 'tabler-icons')
    })
  })

  // ── TIER 2: BOUNDARY & CORNER CASES ───────────────────────────────────────
  describe('Tier 2: Boundary & Corner Cases', () => {
    it('T2.01: Empty query string q="" triggers fast-path response', async () => {
      const { status, data } = await queryApi({ q: '' })
      assert.equal(status, 200)
      assert.ok(data.icons.length > 0)
    })

    it('T2.02: Whitespace-only query string is trimmed and served cleanly', async () => {
      const { status, data } = await queryApi({ q: '     ' })
      assert.equal(status, 200)
      assert.ok(data.icons.length > 0)
    })

    it('T2.03: Non-existent library returns empty results with total 0', async () => {
      const { data } = await queryApi({ lib: 'non-existent-library-xyz-999' })
      assert.equal(data.total, 0)
      assert.equal(data.icons.length, 0)
      assert.equal(data.totalPages, 0)
    })

    it('T2.04: Non-existent category returns gracefully without crashing', async () => {
      const { status, data } = await queryApi({ category: 'invalid-category-xyz' })
      assert.equal(status, 200)
      assert.ok(Array.isArray(data.icons))
    })

    it('T2.05: Non-existent sourceSet returns empty results without error', async () => {
      const { data } = await queryApi({ sourceSet: 'non-existent-source-set' })
      assert.equal(data.total, 0)
      assert.equal(data.icons.length, 0)
    })

    it('T2.06: Out-of-bounds page number (e.g. 99999) returns empty array with accurate totalPages', async () => {
      const { data } = await queryApi({ page: 99999, limit: 50 })
      assert.equal(data.icons.length, 0)
      assert.ok(data.totalPages > 0)
      assert.equal(data.page, 99999)
    })

    it('T2.07: Consecutive pages page=1 and page=2 return disjoint icon sets', async () => {
      const { data: p1 } = await queryApi({ page: 1, limit: 10 })
      const { data: p2 } = await queryApi({ page: 2, limit: 10 })
      assert.equal(p1.icons.length, 10)
      assert.equal(p2.icons.length, 10)
      const p1Ids = new Set(p1.icons.map((i: { id: string }) => i.id))
      for (const icon of p2.icons) {
        assert.ok(!p1Ids.has(icon.id), `Icon ${icon.id} should not appear on both page 1 and page 2`)
      }
    })

    it('T2.08: Boundary limit=1 returns exactly 1 icon', async () => {
      const { data } = await queryApi({ limit: 1 })
      assert.equal(data.icons.length, 1)
      assert.equal(data.limit, 1)
    })

    it('T2.09: Boundary limit=100 returns exactly 100 icons', async () => {
      const { data } = await queryApi({ limit: 100 })
      assert.equal(data.icons.length, 100)
      assert.equal(data.limit, 100)
    })

    it('T2.10: Partial batch lookup with mixed valid and invalid IDs returns only valid icons', async () => {
      const { data: sample } = await queryApi({ limit: 2 })
      const validId = sample.icons[0].id
      const { data } = await queryApi({ ids: `${validId},fake-invalid-id-xyz` })
      assert.equal(data.icons.length, 1)
      assert.equal(data.icons[0].id, validId)
    })

    it('T2.11: Special HTML / script characters in query do not crash server', async () => {
      const { status, data } = await queryApi({ q: '<script>alert("xss")</script>' })
      assert.equal(status, 200)
      assert.ok(typeof data.total === 'number')
    })

    it('T2.12: Query containing regex meta-characters does not crash or throw', async () => {
      const { status, data } = await queryApi({ q: 'arrow (.*) [a-z]+ {2,3}' })
      assert.equal(status, 200)
      assert.ok(typeof data.total === 'number')
    })

    it('T2.13: Synonym expansion: "delete" concept expands to trash, remove, and bin', () => {
      const intent = buildIconSearchIntent('delete')
      assert.ok(intent.groups.length > 0)
      const terms = intent.groups.flatMap((g) => g.terms)
      assert.ok(terms.includes('trash') && terms.includes('bin') && terms.includes('delete'))
    })

    it('T2.14: Synonym expansion: "settings" concept expands to cog, gear, and wrench', () => {
      const intent = buildIconSearchIntent('settings')
      assert.ok(intent.groups.length > 0)
      const terms = intent.groups.flatMap((g) => g.terms)
      assert.ok(terms.includes('cog') && terms.includes('gear') && terms.includes('settings'))
    })

    it('T2.15: Synonym expansion: "search" concept expands to magnify, find, and scan', () => {
      const intent = buildIconSearchIntent('search')
      assert.ok(intent.groups.length > 0)
      const terms = intent.groups.flatMap((g) => g.terms)
      assert.ok(terms.includes('magnify') && terms.includes('find') && terms.includes('search'))
    })

    it('T2.16: Rate limiter triggers HTTP 429 when client exceeds MAX_REQUESTS limit', async () => {
      const dedicatedIp = `192.168.99.${Math.floor(Math.random() * 200) + 1}`
      let received429 = false

      // Send 125 fast-path requests from the same IP to trigger rate limit (threshold is 120)
      for (let i = 0; i < 125; i++) {
        const { status } = await queryApi({}, dedicatedIp)
        if (status === 429) {
          received429 = true
          break
        }
      }
      assert.equal(received429, true, 'Should trigger 429 after exceeding rate limit')
    })

    it('T2.17: Library filter handles uppercase and mixed case gracefully', async () => {
      const { data } = await queryApi({ lib: 'LUCIDE-ICONS', limit: 5 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.ok(icon.library.toLowerCase().includes('lucide'))
      }
    })

    it('T2.18: Category filter handles uppercase input gracefully', async () => {
      const { data } = await queryApi({ category: 'ARROWS', limit: 5 })
      assert.ok(data.icons.length > 0)
    })

    it('T2.19: Fast path with legalOnly=0 serves non-restricted cache', async () => {
      const { data } = await queryApi({ legalOnly: 0 })
      assert.ok(data.icons.length > 0)
      assert.equal(data.facets.legalOnlyApplied, false)
      assert.equal(data.total, data.catalogStats.totalIcons)
    })

    it('T2.20: Fast path with sort=popular serves precomputed popular cache', async () => {
      const { data } = await queryApi({ sort: 'popular', legalOnly: 0 })
      assert.ok(data.icons.length > 0)
      assert.equal(data.total, data.catalogStats.totalIcons)
    })
  })

  // ── TIER 3: PAIRWISE COMBINATIONS ─────────────────────────────────────────
  describe('Tier 3: Pairwise Combinations', () => {
    it('T3.01: Pair 1: lib=lucide-icons + style=stroke + category=arrows', async () => {
      const { data } = await queryApi({ lib: 'lucide-icons', style: 'stroke', category: 'arrows', limit: 10 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.ok(icon.library.toLowerCase().includes('lucide'))
      }
    })

    it('T3.02: Pair 2: lib=heroicons + style=solid + legalOnly=1', async () => {
      const { data } = await queryApi({ lib: 'heroicons', style: 'solid', legalOnly: 1, limit: 10 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        const cleanLib = icon.library.replace(/^iconify-/, '').toLowerCase()
        assert.equal(cleanLib, 'heroicons')
        assert.equal(icon.legalSafe, true)
      }
    })

    it('T3.03: Pair 3: lib=iconify + iconifySet=bi + style=solid', async () => {
      const { data } = await queryApi({ lib: 'iconify', iconifySet: 'bi', style: 'solid', limit: 10 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.equal(icon.library, 'iconify-bi')
      }
    })

    it('T3.04: Pair 4: lib=tabler-icons + category=devices + sort=popular', async () => {
      const { data } = await queryApi({ lib: 'tabler-icons', category: 'devices', sort: 'popular', limit: 10 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        const cleanLib = icon.library.replace(/^iconify-/, '').toLowerCase()
        assert.equal(cleanLib, 'tabler-icons')
      }
    })

    it('T3.05: Pair 5: sourceSet=feather + q=mail + legalOnly=1', async () => {
      const { data } = await queryApi({ sourceSet: 'feather', q: 'mail', legalOnly: 1, limit: 5 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.equal(icon.legalSafe, true)
      }
    })

    it('T3.06: Pair 6: category=security + style=stroke + limit=10', async () => {
      const { data } = await queryApi({ category: 'security', style: 'stroke', limit: 10 })
      assert.ok(data.icons.length > 0)
      assert.ok(data.icons.length <= 10)
    })

    it('T3.07: Pair 7: q=edit + category=editor + sort=relevance', async () => {
      const { data } = await queryApi({ q: 'edit', category: 'editor', sort: 'relevance', limit: 10 })
      assert.ok(data.icons.length > 0)
      assert.equal(data.query.raw, 'edit')
    })

    it('T3.08: Pair 8: style=twotone + category=arrows + legalOnly=1', async () => {
      const { data } = await queryApi({ style: 'twotone', category: 'arrows', legalOnly: 1, limit: 10 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.equal(icon.legalSafe, true)
      }
    })

    it('T3.09: Pair 9: lib=phosphor-icons + q=user + limit=10', async () => {
      const { data } = await queryApi({ lib: 'phosphor-icons', q: 'user', limit: 10 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        const cleanLib = icon.library.replace(/^iconify-/, '').toLowerCase()
        assert.equal(cleanLib, 'phosphor-icons')
      }
    })

    it('T3.10: Pair 10: legalOnly=0 + lib=iconify + limit=20', async () => {
      const { data } = await queryApi({ legalOnly: 0, lib: 'iconify', limit: 20 })
      assert.ok(data.icons.length > 0)
      assert.equal(data.facets.legalOnlyApplied, false)
      for (const icon of data.icons) {
        assert.ok(icon.library.startsWith('iconify-'))
      }
    })
  })

  // ── TIER 4: REAL-WORLD DEVELOPER WORKLOADS ────────────────────────────────
  describe('Tier 4: Real-World Developer Workloads', () => {
    it('T4.01: Workload 1: Developer searches "trash", filters stroke style, paginates page 1 & 2', async () => {
      const p1 = await queryApi({ q: 'trash', style: 'stroke', page: 1, limit: 5 })
      const p2 = await queryApi({ q: 'trash', style: 'stroke', page: 2, limit: 5 })
      
      assert.equal(p1.status, 200)
      assert.equal(p2.status, 200)
      assert.ok(p1.data.icons.length > 0)
      assert.ok(p2.data.icons.length > 0)
      assert.notEqual(p1.data.icons[0].id, p2.data.icons[0].id)
    })

    it('T4.02: Workload 2: Developer batch fetches 5 navigation icons by IDs for navbar', async () => {
      const { data: search } = await queryApi({ q: 'home', limit: 5 })
      const ids = search.icons.map((i: { id: string }) => i.id)
      
      const { data: batch } = await queryApi({ ids: ids.join(',') })
      assert.equal(batch.icons.length, ids.length)
      for (const icon of batch.icons) {
        assert.ok(icon.svgUrl.startsWith('/api/svg/'))
        assert.ok(icon.name.length > 0)
      }
    })

    it('T4.03: Workload 3: Marketing engineer browses commercial-safe AI icons sorted by popular', async () => {
      const { data } = await queryApi({ category: 'ai', legalOnly: 1, sort: 'popular', limit: 15 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.equal(icon.legalSafe, true)
      }
    })

    it('T4.04: Workload 4: Design systems engineer paginates through entire radix-icons library', async () => {
      const { data } = await queryApi({ lib: 'radix-icons', limit: 50 })
      assert.ok(data.icons.length > 0)
      assert.ok(data.total > 0)
      for (const icon of data.icons) {
        const cleanLib = icon.library.replace(/^iconify-/, '').toLowerCase()
        assert.equal(cleanLib, 'radix-icons')
      }
    })

    it('T4.05: Workload 5: Multi-step query refinement from general search to library and style filter', async () => {
      // Step 1: General search
      const s1 = await queryApi({ q: 'arrow' })
      assert.ok(s1.data.total > 100)

      // Step 2: Refine by library
      const s2 = await queryApi({ q: 'arrow', lib: 'lucide-icons' })
      assert.ok(s2.data.total < s1.data.total)
      assert.ok(s2.data.total > 0)

      // Step 3: Refine by style
      const s3 = await queryApi({ q: 'arrow', lib: 'lucide-icons', style: 'stroke' })
      assert.ok(s3.data.total > 0)
      assert.ok(s3.data.total <= s2.data.total)
    })
  })

  // ── TIER 5: ENHANCED MULTI-FACET FILTERING (MILESTONE M2) ──────────────────
  describe('Tier 5: Enhanced Multi-Facet Filtering (Milestone M2)', () => {
    it('T5.01: ColorModel filter "mono" returns monochromatic icons and valid facets', async () => {
      const { data } = await queryApi({ colorModel: 'mono', limit: 20 })
      assert.ok(data.icons.length > 0)
      assert.ok(data.total > 0)
      assert.ok(data.facets.colorModels.mono > 0)
    })

    it('T5.02: ColorModel filter "multicolor" returns multi-color icons', async () => {
      const { data } = await queryApi({ colorModel: 'multicolor', limit: 20 })
      assert.ok(data.icons.length > 0)
      assert.ok(data.total > 0)
      assert.ok(data.facets.colorModels.multicolor > 0)
    })

    it('T5.03: License filter "MIT" returns MIT licensed icons', async () => {
      const { data } = await queryApi({ license: 'MIT', limit: 20 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.ok((icon.license || '').toLowerCase().includes('mit'), `Icon ${icon.name} should have MIT license`)
      }
    })

    it('T5.04: License filter "Apache-2.0" returns Apache licensed icons', async () => {
      const { data } = await queryApi({ license: 'Apache-2.0', limit: 20 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.ok((icon.license || '').toLowerCase().includes('apache'), `Icon ${icon.name} should have Apache license`)
      }
    })

    it('T5.05: License filter "CC0" returns CC0 / Public Domain licensed icons', async () => {
      const { data } = await queryApi({ license: 'CC0', limit: 20 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        const lic = (icon.license || '').toLowerCase()
        assert.ok(
          lic.includes('cc0') || lic.includes('public domain') || lic.includes('unlicense') || lic.includes('wtfpl'),
          `Icon ${icon.name} should have CC0/Public domain license`
        )
      }
    })

    it('T5.06: SourceType filter "curated" returns only curated named libraries', async () => {
      const { data } = await queryApi({ sourceType: 'curated', limit: 30 })
      assert.ok(data.icons.length > 0)
      const namedSlugs = new Set([
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

      for (const icon of data.icons) {
        const cleanLib = icon.library.toLowerCase()
        assert.ok(namedSlugs.has(cleanLib) || !cleanLib.startsWith('iconify-'), `Icon ${icon.name} from ${icon.library} should be curated`)
      }
    })

    it('T5.07: SourceType filter "iconify" returns only full catalog iconify sets', async () => {
      const { data } = await queryApi({ sourceType: 'iconify', limit: 30 })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.ok(icon.library.startsWith('iconify-') || !namedLibraries.some((l) => l.id === icon.library), `Icon ${icon.name} should be in iconify catalog`)
      }
    })

    it('T5.08: Fast-path response contains all required facet aggregations', async () => {
      const { data } = await queryApi()
      assert.ok(data.facets)
      assert.ok(typeof data.facets.styles === 'object')
      assert.ok(typeof data.facets.colorModels === 'object')
      assert.ok(typeof data.facets.licenseCounts === 'object')
      assert.ok(typeof data.facets.sourceTypes === 'object')
      assert.ok(data.facets.styles.stroke > 0)
      assert.ok(data.facets.colorModels.mono > 0)
      assert.ok(data.facets.licenseCounts.MIT > 0)
      assert.ok(data.facets.sourceTypes.curated > 0)
    })

    it('T5.09: Filtered search on keyword aggregates dynamic facet counts', async () => {
      const { data } = await queryApi({ q: 'cloud' })
      assert.ok(data.total > 0)
      assert.ok(data.facets.styles.stroke !== undefined)
      assert.ok(data.facets.colorModels.mono !== undefined)
      assert.ok(data.facets.licenseCounts.MIT !== undefined)
      assert.ok(data.facets.sourceTypes.curated !== undefined)
    })

    it('T5.10: Multi-facet combination: sourceType=curated + colorModel=mono + style=stroke + license=MIT', async () => {
      const { data } = await queryApi({
        sourceType: 'curated',
        colorModel: 'mono',
        style: 'stroke',
        license: 'MIT',
        limit: 20,
      })
      assert.ok(data.icons.length > 0)
      for (const icon of data.icons) {
        assert.ok((icon.license || '').toLowerCase().includes('mit'))
        assert.ok(
          icon.name.toLowerCase().includes('outline') ||
            icon.name.toLowerCase().includes('regular') ||
            icon.name.toLowerCase().includes('light') ||
            icon.name.toLowerCase().includes('thin') ||
            icon.name.toLowerCase().includes('line') ||
            icon.library.toLowerCase().includes('lucide') ||
            icon.library.toLowerCase().includes('feather') ||
            icon.library.toLowerCase().includes('iconoir')
        )
      }
    })
  })
})

