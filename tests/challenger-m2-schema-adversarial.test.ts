import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  generateWebApplicationSchema,
  generateFrameworkHubSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateWebSiteSchema,
  generateOrganizationSchema,
  SITE_URL,
  SITE_NAME,
} from '../lib/seo'

describe('Milestone M2 Adversarial Schema Stress Tests', () => {
  // ── TIER 1: SCHEMA.ORG SPECIFICATION CONFORMANCE ──────────────────────────
  describe('Tier 1: Specification & Entity Graph Conformance', () => {
    it('ADV.S01: generateWebApplicationSchema generates compliant WebApplication schema with connected @id graph', () => {
      const schema = generateWebApplicationSchema({
        name: 'IconSearch Vector Engine',
        description: 'Universal SVG search engine',
        path: '/icon-search',
        featureList: ['Instant search', 'SVG export', 'Color customizer'],
      })

      assert.equal(schema['@context'], 'https://schema.org')
      assert.equal(schema['@type'], 'WebApplication')
      assert.equal(schema['@id'], 'https://iconsearch.info/icon-search#webapp')
      assert.equal(schema.name, 'IconSearch Vector Engine')
      assert.equal(schema.description, 'Universal SVG search engine')
      assert.equal(schema.url, 'https://iconsearch.info/icon-search')
      assert.equal(schema.applicationCategory, 'DesignApplication')
      assert.equal(schema.operatingSystem, 'All (Web Browser, macOS, Windows, Linux, iOS, Android)')
      assert.equal(schema.browserRequirements, 'Requires JavaScript. Requires HTML5.')
      
      // Offers
      assert.ok(typeof schema.offers === 'object' && schema.offers !== null)
      assert.equal(schema.offers['@type'], 'Offer')
      assert.equal(schema.offers.price, '0')
      assert.equal(schema.offers.priceCurrency, 'USD')
      assert.equal(schema.offers.availability, 'https://schema.org/InStock')

      // Connected Graph IDs
      assert.equal(schema.isPartOf['@id'], 'https://iconsearch.info/#website')
      assert.equal(schema.author['@id'], 'https://iconsearch.info/#organization')
      assert.equal(schema.publisher['@id'], 'https://iconsearch.info/#organization')

      // Feature list
      assert.deepEqual(schema.featureList, ['Instant search', 'SVG export', 'Color customizer'])
    })

    it('ADV.S02: generateFrameworkHubSchema generates compliant TechArticle schema with dates and connected @id graph', () => {
      const schema = generateFrameworkHubSchema({
        name: 'React Icons Guide 2026',
        description: 'Guide on tree-shaking React SVG icons',
        path: '/react-icons',
        datePublished: '2026-08-17',
        dateModified: '2026-08-20',
      })

      assert.equal(schema['@context'], 'https://schema.org')
      assert.equal(schema['@type'], 'TechArticle')
      assert.equal(schema['@id'], 'https://iconsearch.info/react-icons#article')
      assert.equal(schema.headline, 'React Icons Guide 2026')
      assert.equal(schema.description, 'Guide on tree-shaking React SVG icons')
      assert.equal(schema.url, 'https://iconsearch.info/react-icons')
      assert.equal(schema.mainEntityOfPage, 'https://iconsearch.info/react-icons')
      assert.equal(schema.datePublished, '2026-08-17')
      assert.equal(schema.dateModified, '2026-08-20')
      assert.equal(schema.inLanguage, 'en')

      // Connected Graph IDs
      assert.equal(schema.isPartOf['@id'], 'https://iconsearch.info/#website')
      assert.equal(schema.author['@id'], 'https://iconsearch.info/#organization')
      assert.equal(schema.publisher['@id'], 'https://iconsearch.info/#organization')
    })

    it('ADV.S03: generateFrameworkHubSchema supplies default dates when omitted', () => {
      const schema = generateFrameworkHubSchema({
        name: 'Vue Icons Guide',
        description: 'Guide on Vue SVG icons',
        path: '/vue-icons',
      })

      assert.equal(schema.datePublished, '2026-08-17')
      assert.equal(schema.dateModified, '2026-08-20')
    })
  })

  // ── TIER 2: BOUNDARY & EDGE CASE HANDLING ─────────────────────────────────
  describe('Tier 2: Boundary & Corner Cases', () => {
    it('ADV.S04: WebApplication schema handles empty featureList without generating featureList key', () => {
      const schema = generateWebApplicationSchema({
        name: 'No Feature App',
        description: 'Test app without features',
        path: '/app',
        featureList: [],
      })

      assert.equal(schema.featureList, undefined)
      assert.ok(!('featureList' in schema))
    })

    it('ADV.S05: WebApplication schema handles omitted featureList without generating featureList key', () => {
      const schema = generateWebApplicationSchema({
        name: 'Default Feature App',
        description: 'Test app',
        path: '/app',
      })

      assert.equal(schema.featureList, undefined)
      assert.ok(!('featureList' in schema))
    })

    it('ADV.S06: WebApplication schema handles root path "/" with correct URL and ID', () => {
      const schema = generateWebApplicationSchema({
        name: 'Root App',
        description: 'Root page app',
        path: '/',
      })

      assert.equal(schema.url, 'https://iconsearch.info/')
      assert.equal(schema['@id'], 'https://iconsearch.info/#webapp')
    })

    it('ADV.S07: FrameworkHub schema handles deep nested paths cleanly', () => {
      const schema = generateFrameworkHubSchema({
        name: 'Deep Guide',
        description: 'Deep nested guide',
        path: '/guides/frontend/react/icons',
      })

      assert.equal(schema.url, 'https://iconsearch.info/guides/frontend/react/icons')
      assert.equal(schema['@id'], 'https://iconsearch.info/guides/frontend/react/icons#article')
      assert.equal(schema.mainEntityOfPage, 'https://iconsearch.info/guides/frontend/react/icons')
    })

    it('ADV.S08: WebApplication schema handles empty strings in name and description without crashing', () => {
      const schema = generateWebApplicationSchema({
        name: '',
        description: '',
        path: '/empty',
      })

      assert.equal(schema.name, '')
      assert.equal(schema.description, '')
      assert.equal(schema.url, 'https://iconsearch.info/empty')
    })

    it('ADV.S09: FrameworkHub schema handles custom ISO-8601 timestamps', () => {
      const published = '2026-09-01T12:00:00Z'
      const modified = '2026-09-02T16:00:00.000+00:00'
      const schema = generateFrameworkHubSchema({
        name: 'Timestamp Guide',
        description: 'Testing ISO timestamps',
        path: '/timestamp-test',
        datePublished: published,
        dateModified: modified,
      })

      assert.equal(schema.datePublished, published)
      assert.equal(schema.dateModified, modified)
    })
  })

  // ── TIER 3: ADVERSARIAL PAYLOADS & XSS STRESS ──────────────────────────────
  describe('Tier 3: Adversarial Payloads & XSS Stress', () => {
    it('ADV.S10: XSS payloads in WebApplication schema serialize and escape safely for script tags', () => {
      const maliciousPayload = '<script>alert("pwned")</script><img src=x onerror=alert(1)>'
      const schema = generateWebApplicationSchema({
        name: `Malicious App ${maliciousPayload}`,
        description: `Malicious Description ${maliciousPayload}`,
        path: '/hack',
        featureList: [maliciousPayload, '"><svg onload=alert(1)>', '</script><script>alert(2)</script>'],
      })

      const rawJson = JSON.stringify(schema)
      const sanitizedJson = rawJson.replace(/</g, '\\u003c')

      // Must not contain raw unescaped opening angle brackets
      assert.ok(!sanitizedJson.includes('<script>'), 'Must not contain raw <script>')
      assert.ok(!sanitizedJson.includes('<img'), 'Must not contain raw <img')
      assert.ok(!sanitizedJson.includes('</script>'), 'Must not contain raw </script>')
      assert.ok(sanitizedJson.includes('\\u003cscript>'))

      // Deserialization restores exact content without executing or mutating
      const restored = JSON.parse(sanitizedJson)
      assert.equal(restored.name, `Malicious App ${maliciousPayload}`)
      assert.equal(restored.featureList[0], maliciousPayload)
    })

    it('ADV.S11: XSS payloads in FrameworkHub schema serialize and escape safely for script tags', () => {
      const xssHeadline = '<script>document.location="http://evil.com"</script>'
      const xssDesc = '"><body onload=alert(document.cookie)>'
      const schema = generateFrameworkHubSchema({
        name: xssHeadline,
        description: xssDesc,
        path: '/xss-article',
        datePublished: '<script>',
        dateModified: '</script>',
      })

      const sanitizedJson = JSON.stringify(schema).replace(/</g, '\\u003c')
      assert.ok(!sanitizedJson.includes('<script>'))
      assert.ok(!sanitizedJson.includes('</script>'))
      assert.ok(!sanitizedJson.includes('<body'))

      const restored = JSON.parse(sanitizedJson)
      assert.equal(restored.headline, xssHeadline)
      assert.equal(restored.description, xssDesc)
    })

    it('ADV.S12: Unicode, emojis, RTL, and multi-byte characters preserve fidelity in JSON-LD', () => {
      const unicodeName = '🔍 免费矢量图标 🚀 — React & Next.js 图标 (العربية / עברית)'
      const unicodeDesc = 'Icons: ⚛️ ⚡ 🎨 📦 🛡️ 💎 🛠️ — שָׁלוֹם עֲלֵיכֶם — مرحبا بالعالم — 👨‍👩‍👧‍👦'
      const schema = generateWebApplicationSchema({
        name: unicodeName,
        description: unicodeDesc,
        path: '/unicode-test',
        featureList: ['Emoji support 🎯', 'RTL layout ➡️', 'Kanji 漢字 ✨'],
      })

      const serialized = JSON.stringify(schema).replace(/</g, '\\u003c')
      const parsed = JSON.parse(serialized)

      assert.equal(parsed.name, unicodeName)
      assert.equal(parsed.description, unicodeDesc)
      assert.equal(parsed.featureList.length, 3)
      assert.equal(parsed.featureList[0], 'Emoji support 🎯')
      assert.equal(parsed.featureList[2], 'Kanji 漢字 ✨')
    })

    it('ADV.S13: Large payload stress test (100KB payload with 1,000 features)', () => {
      const largeDescription = 'A'.repeat(50000)
      const largeFeatureList = Array.from({ length: 1000 }, (_, i) => `Feature ${i}: ${'B'.repeat(50)}`)

      const startTime = performance.now()
      const schema = generateWebApplicationSchema({
        name: 'Stress Test Massive App',
        description: largeDescription,
        path: '/massive',
        featureList: largeFeatureList,
      })

      const serialized = JSON.stringify(schema).replace(/</g, '\\u003c')
      const parsed = JSON.parse(serialized)
      const duration = performance.now() - startTime

      assert.ok(duration < 200, `Large payload generation took ${duration}ms, should be < 200ms`)
      assert.equal(parsed.description.length, 50000)
      assert.equal(parsed.featureList.length, 1000)
      assert.ok(serialized.length > 100000)
    })

    it('ADV.S14: Prototype pollution & injection key resilience', () => {
      const schema = generateWebApplicationSchema({
        name: '__proto__',
        description: 'constructor.prototype',
        path: '/pollute',
        featureList: ['__proto__', 'constructor', 'prototype', 'toString', 'valueOf'],
      })

      assert.equal(schema.name, '__proto__')
      assert.equal((schema as any).__proto__, Object.prototype)
      assert.equal(schema.featureList?.length, 5)

      const serialized = JSON.stringify(schema)
      const parsed = JSON.parse(serialized)
      assert.equal(parsed.name, '__proto__')
      assert.equal(Object.getPrototypeOf(parsed), Object.prototype)
    })
  })

  // ── TIER 4: CONNECTED GRAPH COMPOSITION & SEMANTIC VALIDATION ───────────────
  describe('Tier 4: Graph Composition & Semantic Validation', () => {
    it('ADV.S15: Composite @graph combining FrameworkHub, Breadcrumb, and FAQ schemas validates cleanly', () => {
      const hub = generateFrameworkHubSchema({
        name: 'Tailwind Icons Guide',
        description: 'How to use icons in Tailwind CSS',
        path: '/tailwind-icons',
      })
      const breadcrumbs = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Tailwind Icons', url: '/tailwind-icons' },
      ])
      const faqs = generateFAQSchema([
        { q: 'How to color icons in Tailwind?', a: 'Use currentColor and text utility classes.' },
        { q: 'How to resize icons?', a: 'Use w-* and h-* classes.' },
      ])

      const compositeGraph = {
        '@context': 'https://schema.org',
        '@graph': [hub, breadcrumbs, faqs],
      }

      const serialized = JSON.stringify(compositeGraph).replace(/</g, '\\u003c')
      const parsed = JSON.parse(serialized)

      assert.equal(parsed['@context'], 'https://schema.org')
      assert.ok(Array.isArray(parsed['@graph']))
      assert.equal(parsed['@graph'].length, 3)

      const [techArticle, breadcrumbList, faqPage] = parsed['@graph']
      assert.equal(techArticle['@type'], 'TechArticle')
      assert.equal(techArticle['@id'], 'https://iconsearch.info/tailwind-icons#article')
      assert.equal(techArticle.isPartOf['@id'], 'https://iconsearch.info/#website')

      assert.equal(breadcrumbList['@type'], 'BreadcrumbList')
      assert.equal(breadcrumbList.itemListElement.length, 2)
      assert.equal(breadcrumbList.itemListElement[0].position, 1)

      assert.equal(faqPage['@type'], 'FAQPage')
      assert.equal(faqPage.mainEntity.length, 2)
      assert.equal(faqPage.mainEntity[0]['@type'], 'Question')
      assert.equal(faqPage.mainEntity[0].acceptedAnswer['@type'], 'Answer')
    })

    it('ADV.S16: WebSite and Organization reference IDs correlate across all schemas', () => {
      const website = generateWebSiteSchema()
      const org = generateOrganizationSchema()
      const webapp = generateWebApplicationSchema({
        name: 'App',
        description: 'Desc',
        path: '/icon-search',
      })
      const article = generateFrameworkHubSchema({
        name: 'Guide',
        description: 'Desc',
        path: '/react-icons',
      })

      // Verify Website ID consistency
      assert.equal(website['@id'], 'https://iconsearch.info/#website')
      assert.equal(webapp.isPartOf['@id'], website['@id'])
      assert.equal(article.isPartOf['@id'], website['@id'])

      // Verify Organization ID consistency
      assert.equal(org['@id'], 'https://iconsearch.info/#organization')
      assert.equal(website.publisher['@id'], org['@id'])
      assert.equal(webapp.author['@id'], org['@id'])
      assert.equal(webapp.publisher['@id'], org['@id'])
      assert.equal(article.author['@id'], org['@id'])
      assert.equal(article.publisher['@id'], org['@id'])
    })
  })

  // ── TIER 5: ALL 6 FRAMEWORK HUBS & ICON SEARCH SCHEMAS INTEGRITY ──────────
  describe('Tier 5: Real-World Framework Hub & Icon Search Schemas Integrity', () => {
    const frameworkHubs = [
      { slug: 'react-icons', name: 'React Icons Guide 2026 — Top Free SVG Icon Libraries & Tree-Shaking' },
      { slug: 'nextjs-icons', name: 'Next.js Icons Guide 2026 — App Router, Server Components & SVGs' },
      { slug: 'vue-icons', name: 'Vue Icons Guide 2026 — Vue 3 Components, Nuxt & Tree-Shaking' },
      { slug: 'svelte-icons', name: 'Svelte Icons Guide 2026 — Svelte 4/5 Runes, SvelteKit & SVGs' },
      { slug: 'tailwind-icons', name: 'Tailwind CSS Icons Guide 2026 — Utility Classes & Vector Workflows' },
      { slug: 'typescript-icons', name: 'TypeScript Icons Guide 2026 — Type-Safe SVGs & Dynamic Imports' },
    ]

    for (const hub of frameworkHubs) {
      it(`ADV.S17: /${hub.slug} generates valid TechArticle schema matching route`, () => {
        const path = `/${hub.slug}`
        const schema = generateFrameworkHubSchema({
          name: hub.name,
          description: `Comprehensive architectural guide for ${hub.slug} in 2026.`,
          path,
          datePublished: '2026-08-17',
          dateModified: '2026-08-20',
        })

        assert.equal(schema['@context'], 'https://schema.org')
        assert.equal(schema['@type'], 'TechArticle')
        assert.equal(schema['@id'], `https://iconsearch.info${path}#article`)
        assert.equal(schema.url, `https://iconsearch.info${path}`)
        assert.equal(schema.mainEntityOfPage, `https://iconsearch.info${path}`)
        assert.equal(schema.headline, hub.name)
        assert.equal(schema.datePublished, '2026-08-17')
        assert.equal(schema.dateModified, '2026-08-20')
        assert.equal(schema.inLanguage, 'en')
        assert.equal(schema.isPartOf['@id'], 'https://iconsearch.info/#website')
        assert.equal(schema.author['@id'], 'https://iconsearch.info/#organization')
        assert.equal(schema.publisher['@id'], 'https://iconsearch.info/#organization')

        // Valid JSON serialization test
        const serialized = JSON.stringify(schema).replace(/</g, '\\u003c')
        assert.doesNotThrow(() => JSON.parse(serialized))
      })
    }

    it('ADV.S18: /icon-search WebApplication schema matches production configuration', () => {
      const schema = generateWebApplicationSchema({
        name: 'IconSearch Vector Icon Engine',
        description: 'Search 355,000+ free SVG icons from 229 open-source libraries.',
        path: '/icon-search',
        featureList: [
          'Universal 355,000+ vector SVG icon search',
          'Real-time color, stroke width, and size customization',
          'One-click React, Vue, Svelte, and TSX component export',
          'Multi-library search with 229 open-source icon sets',
          'Bulk batch download and workspace export collections',
        ],
      })

      assert.equal(schema['@type'], 'WebApplication')
      assert.equal(schema['@id'], 'https://iconsearch.info/icon-search#webapp')
      assert.equal(schema.applicationCategory, 'DesignApplication')
      assert.equal(schema.offers.price, '0')
      assert.equal(schema.offers.availability, 'https://schema.org/InStock')
      assert.equal(schema.featureList?.length, 5)

      const serialized = JSON.stringify(schema).replace(/</g, '\\u003c')
      assert.doesNotThrow(() => JSON.parse(serialized))
    })
  })
})
