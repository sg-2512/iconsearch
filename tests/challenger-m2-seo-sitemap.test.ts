import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import generateSitemapsFn, { default as sitemap } from '../app/sitemap'
import robots from '../app/robots'
import { generateSitemaps } from '../app/sitemap'
import { allLibraries } from '../data/library-catalog'
import { SITE_URL } from '../lib/seo'

function isValidIsoDate(dateVal?: string | Date): boolean {
  if (!dateVal) return false
  const d = dateVal instanceof Date ? dateVal : new Date(dateVal)
  return !isNaN(d.getTime())
}

function isValidAbsoluteUrl(urlStr: string): boolean {
  try {
    const u = new URL(urlStr)
    return u.protocol === 'https:' && u.host === 'iconsearch.info'
  } catch {
    return false
  }
}

describe('Milestone M2 Challenger Verification: Sitemaps & Robots', () => {
  // ── TIER 1: generateSitemaps() Verification ─────────────────────────────────
  describe('Tier 1: generateSitemaps() Segment Discovery', () => {
    it('C2.S01: generateSitemaps returns exactly the 5 expected segments', async () => {
      const segments = await generateSitemaps()
      assert.ok(Array.isArray(segments), 'generateSitemaps must return an array')
      assert.equal(segments.length, 5, 'Must return exactly 5 segments')

      const segmentIds = segments.map((s) => s.id)
      assert.deepEqual(segmentIds, ['core', 'categories', 'libraries', 'frameworks', 'plugins'])
    })

    it('C2.S02: generateSitemaps objects conform to Next.js 16 sitemap id signature', async () => {
      const segments = await generateSitemaps()
      for (const segment of segments) {
        assert.ok(typeof segment === 'object' && segment !== null)
        assert.ok('id' in segment)
        assert.ok(typeof segment.id === 'string' && segment.id.length > 0)
      }
    })
  })

  // ── TIER 2: Segment 'core' Sitemaps ────────────────────────────────────────
  describe('Tier 2: Segment "core" Sitemap Output', () => {
    it('C2.S03: sitemap({ id: "core" }) returns all essential static routes', async () => {
      const entries = await sitemap({ id: 'core' })
      assert.ok(Array.isArray(entries))
      assert.equal(entries.length, 14, 'Must contain 14 core static routes')

      const urls = entries.map((e) => e.url)
      const expectedPaths = [
        '/',
        '/free-svg-icons',
        '/icon-search',
        '/logo-maker',
        '/agents',
        '/docs/agents',
        '/mcp-server',
        '/directory',
        '/stats',
        '/licenses',
        '/about',
        '/contact',
        '/privacy-policy',
        '/terms',
      ]

      for (const path of expectedPaths) {
        const expectedUrl = new URL(path, SITE_URL).toString()
        assert.ok(urls.includes(expectedUrl), `Missing core path: ${expectedUrl}`)
      }
    })

    it('C2.S04: all "core" sitemap entries have valid absolute URLs and valid lastModified dates', async () => {
      const entries = await sitemap({ id: 'core' })
      for (const entry of entries) {
        assert.ok(isValidAbsoluteUrl(entry.url), `Invalid URL: ${entry.url}`)
        assert.ok(!entry.url.includes('undefined'), `URL contains undefined: ${entry.url}`)
        assert.ok(!entry.url.includes('//', 8), `URL contains double slashes: ${entry.url}`)
        assert.ok(entry.lastModified, `Entry missing lastModified: ${entry.url}`)
        assert.ok(isValidIsoDate(entry.lastModified), `Invalid lastModified date: ${entry.lastModified} for ${entry.url}`)
        assert.ok(typeof entry.priority === 'number' && entry.priority >= 0 && entry.priority <= 1.0)
        assert.ok(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].includes(entry.changeFrequency || ''))
      }
    })

    it('C2.S05: "core" sitemap strictly excludes comparison and category pages', async () => {
      const entries = await sitemap({ id: 'core' })
      for (const entry of entries) {
        assert.ok(!entry.url.includes('/compare'), `Found forbidden /compare in sitemap: ${entry.url}`)
        assert.ok(!entry.url.includes('/categories'), `Found forbidden /categories in sitemap: ${entry.url}`)
      }
    })
  })

  // ── TIER 3: Segment 'frameworks' Sitemaps ───────────────────────────────────
  describe('Tier 3: Segment "frameworks" Sitemap Output', () => {
    it('C2.S06: sitemap({ id: "frameworks" }) returns all 6 framework hub pages', async () => {
      const entries = await sitemap({ id: 'frameworks' })
      assert.equal(entries.length, 6, 'Must contain exactly 6 framework guides')

      const urls = entries.map((e) => e.url)
      const expectedFrameworks = [
        '/react-icons',
        '/nextjs-icons',
        '/tailwind-icons',
        '/vue-icons',
        '/svelte-icons',
        '/typescript-icons',
      ]

      for (const path of expectedFrameworks) {
        const expectedUrl = `${SITE_URL}${path}`
        assert.ok(urls.includes(expectedUrl), `Missing framework guide: ${expectedUrl}`)
      }
    })

    it('C2.S07: all framework sitemap entries have valid URLs and recent lastModified dates', async () => {
      const entries = await sitemap({ id: 'frameworks' })
      for (const entry of entries) {
        assert.ok(isValidAbsoluteUrl(entry.url), `Invalid URL: ${entry.url}`)
        assert.ok(entry.lastModified, `Entry missing lastModified: ${entry.url}`)
        assert.ok(isValidIsoDate(entry.lastModified), `Invalid lastModified date: ${entry.lastModified}`)
        assert.equal(entry.lastModified, '2026-08-20')
        assert.ok((entry.priority || 0) >= 0.8)
      }
    })
  })

  // ── TIER 4: Segment 'plugins' Sitemaps ──────────────────────────────────────
  describe('Tier 4: Segment "plugins" Sitemap Output', () => {
    it('C2.S08: sitemap({ id: "plugins" }) returns all 18 plugin landing pages', async () => {
      const entries = await sitemap({ id: 'plugins' })
      assert.equal(entries.length, 18, 'Must contain exactly 18 plugin pages')

      const expectedPlugins = [
        '/figma-plugin',
        '/vscode-extension',
        '/chrome-extension',
        '/framer-plugin',
        '/webflow-extension',
        '/canva-app',
        '/adobe-plugin',
        '/obsidian-plugin',
        '/penpot-plugin',
        '/raycast-extension',
        '/jetbrains-plugin',
        '/tailwind-plugin',
        '/storybook-addon',
        '/shopify-extension',
        '/sketch-plugin',
        '/wordpress-plugin',
        '/powerpoint-addin',
        '/google-slides-addon',
      ]

      const urls = entries.map((e) => e.url)
      for (const path of expectedPlugins) {
        const expectedUrl = `${SITE_URL}${path}`
        assert.ok(urls.includes(expectedUrl), `Missing plugin page: ${expectedUrl}`)
      }
    })

    it('C2.S09: all plugin entries have valid URLs and valid lastModified dates', async () => {
      const entries = await sitemap({ id: 'plugins' })
      for (const entry of entries) {
        assert.ok(isValidAbsoluteUrl(entry.url), `Invalid URL: ${entry.url}`)
        assert.ok(entry.lastModified, `Entry missing lastModified: ${entry.url}`)
        assert.ok(isValidIsoDate(entry.lastModified), `Invalid lastModified date: ${entry.lastModified}`)
      }
    })
  })

  // ── TIER 5: Segment 'libraries' Sitemaps ────────────────────────────────────
  describe('Tier 5: Segment "libraries" Sitemap Output', () => {
    it('C2.S10: sitemap({ id: "libraries" }) returns exactly 229 library collection paths', async () => {
      const entries = await sitemap({ id: 'libraries' })
      assert.equal(entries.length, allLibraries.length, `Expected ${allLibraries.length} libraries, got ${entries.length}`)
      assert.equal(entries.length, 229)

      const urls = new Set(entries.map((e) => e.url))
      for (const lib of allLibraries) {
        const expectedUrl = `${SITE_URL}/icons/${encodeURIComponent(lib.slug)}`
        assert.ok(urls.has(expectedUrl), `Missing library URL: ${expectedUrl}`)
      }
    })

    it('C2.S11: all library entries have valid lastModified timestamps and uniform priority', async () => {
      const entries = await sitemap({ id: 'libraries' })
      for (const entry of entries) {
        assert.ok(isValidAbsoluteUrl(entry.url), `Invalid URL: ${entry.url}`)
        assert.ok(entry.lastModified, `Entry missing lastModified: ${entry.url}`)
        assert.ok(isValidIsoDate(entry.lastModified), `Invalid lastModified date: ${entry.lastModified}`)
        assert.equal(entry.priority, 0.85)
        assert.equal(entry.changeFrequency, 'weekly')
      }
    })
  })

  // ── TIER 6: Async Props & Fallback Handling ─────────────────────────────────
  describe('Tier 6: Async Params & Fallback Resilience', () => {
    it('C2.S12: sitemap handles Promise-wrapped id argument (Next.js 16 async params)', async () => {
      const entries = await sitemap({ id: Promise.resolve('frameworks') as any })
      assert.equal(entries.length, 6)
      assert.ok(entries[0].url.includes('/react-icons'))
    })

    it('C2.S13: sitemap handles empty / undefined props with complete fallback list', async () => {
      const entries = await sitemap()
      assert.ok(Array.isArray(entries))
      assert.equal(entries.length, 14 + 26 + 6 + 18 + 229, 'Fallback should contain total of 293 sitemap entries')
    })

    it('C2.S14: sitemap handles unknown id gracefully by returning fallback', async () => {
      const entries = await sitemap({ id: 'non-existent-segment' } as any)
      assert.ok(Array.isArray(entries))
      assert.equal(entries.length, 293)
    })

    it('C2.S15: fallback sitemap strictly contains no duplicate URLs', async () => {
      const entries = await sitemap()
      const urlList = entries.map((e) => e.url)
      const urlSet = new Set(urlList)
      assert.equal(urlList.length, urlSet.size, 'Fallback sitemap must not have duplicate URLs')
    })
  })

  // ── TIER 7: Robots.txt Specification Verification ──────────────────────────
  describe('Tier 7: Robots.txt Rules & Directives', () => {
    it('C2.R01: robots() returns valid MetadataRoute.Robots configuration', () => {
      const r = robots()
      assert.ok(r, 'robots() must return an object')
      assert.ok(r.rules, 'robots() must contain rules')
      assert.ok(Array.isArray(r.rules), 'rules must be an array')
    })

    it('C2.R02: robots() configures all 3 required userAgent groups', () => {
      const r = robots()
      const rules = Array.isArray(r.rules) ? r.rules : [r.rules]
      assert.equal(rules.length, 3, 'Must have 3 rule blocks: search engines, AI bots, and wildcard')

      const searchEngineGroup = rules.find((rule) => Array.isArray(rule.userAgent) && rule.userAgent.includes('Googlebot'))
      assert.ok(searchEngineGroup, 'Search engine group must be present')
      assert.ok((searchEngineGroup.userAgent as string[]).includes('Bingbot'))
      assert.ok((searchEngineGroup.userAgent as string[]).includes('DuckDuckBot'))
      assert.ok((searchEngineGroup.userAgent as string[]).includes('Baiduspider'))
      assert.ok((searchEngineGroup.userAgent as string[]).includes('YandexBot'))

      const aiCrawlerGroup = rules.find((rule) => Array.isArray(rule.userAgent) && rule.userAgent.includes('GPTBot'))
      assert.ok(aiCrawlerGroup, 'AI crawler group must be present')
      const aiBots = aiCrawlerGroup.userAgent as string[]
      const requiredAiBots = [
        'GPTBot',
        'ClaudeBot',
        'PerplexityBot',
        'Google-Extended',
        'Applebot-Extended',
        'Anthropic-AI',
        'Bytespider',
        'cohere-ai',
        'DuckAssistBot',
      ]
      for (const bot of requiredAiBots) {
        assert.ok(aiBots.includes(bot), `Missing AI bot: ${bot}`)
      }

      const wildcardGroup = rules.find((rule) => rule.userAgent === '*')
      assert.ok(wildcardGroup, 'Wildcard * rule must be present')
    })

    it('C2.R03: all robot rules allow public paths and disallow private paths', () => {
      const r = robots()
      const rules = Array.isArray(r.rules) ? r.rules : [r.rules]
      
      const expectedAllows = ['/', '/api/icon-search', '/api/icons', '/api/svg/']
      const expectedDisallows = ['/api/', '/auth/', '/account/', '/oauth/', '/connect']

      for (const rule of rules) {
        assert.deepEqual(rule.allow, expectedAllows)
        assert.deepEqual(rule.disallow, expectedDisallows)
      }
    })

    it('C2.R04: robots() points to segmented sitemap index and llms.txt discovery', () => {
      const r = robots() as any
      assert.equal(r.sitemap, 'https://iconsearch.info/sitemap.xml')
      assert.ok(r.other, 'Must include other directives')
      assert.equal(r.other['llms-txt'], 'https://iconsearch.info/llms.txt')
    })

    it('C2.R05: robots() does NOT block /_next/ static assets', () => {
      const r = robots()
      const rules = Array.isArray(r.rules) ? r.rules : [r.rules]
      for (const rule of rules) {
        const disallows = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow]
        for (const d of disallows) {
          assert.ok(!d?.includes('_next'), `Blocked _next asset: ${d}`)
        }
      }
    })
  })
})
