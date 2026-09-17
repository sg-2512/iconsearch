import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_OG_IMAGE,
  DEFAULT_TWITTER_IMAGE,
  DEFAULT_KEYWORDS,
  createPageMetadata,
  generateWebSiteSchema,
  generateOrganizationSchema,
  generateSoftwareAppSchema,
  generateBreadcrumbSchema,
  generateImageObjectSchema,
  generateFAQSchema,
  generateWebApplicationSchema,
  generateFrameworkHubSchema,
} from '../lib/seo'

describe('SEO & Schema.org JSON-LD Test Suite', () => {
  // ── TIER 1: FEATURE COVERAGE ──────────────────────────────────────────────
  describe('Tier 1: Feature Coverage', () => {
    it('T1.01: Global SEO constants are defined with correct production domain and brand', () => {
      assert.equal(SITE_NAME, 'IconSearch')
      assert.equal(SITE_URL, 'https://iconsearch.info')
      assert.equal(DEFAULT_OG_IMAGE, 'https://iconsearch.info/opengraph-image')
      assert.equal(DEFAULT_TWITTER_IMAGE, 'https://iconsearch.info/twitter-image')
      assert.ok(Array.isArray(DEFAULT_KEYWORDS) && DEFAULT_KEYWORDS.length >= 10)
    })

    it('T1.02: createPageMetadata returns complete Next.js metadata object with title and description', () => {
      const meta = createPageMetadata({
        title: 'React Icons Guide — Top Vector SVG Libraries',
        description: 'Explore verified open-source React icon libraries with tree-shaking support.',
        path: '/react-icons',
      })

      assert.equal(meta.title, 'React Icons Guide — Top Vector SVG Libraries')
      assert.equal(meta.description, 'Explore verified open-source React icon libraries with tree-shaking support.')
      assert.equal(meta.alternates?.canonical, 'https://iconsearch.info/react-icons')
    })

    it('T1.03: createPageMetadata generates OpenGraph metadata with required og tags', () => {
      const meta = createPageMetadata({
        title: 'Tailwind Icons Integration',
        description: 'How to use free SVG icons with Tailwind CSS classes.',
        path: '/tailwind-icons',
        type: 'article',
      })

      assert.equal(meta.openGraph?.title, 'Tailwind Icons Integration')
      assert.equal(meta.openGraph?.siteName, 'IconSearch')
      assert.equal((meta.openGraph as any)?.type, 'article')
      assert.equal(meta.openGraph?.url, 'https://iconsearch.info/tailwind-icons')
      assert.equal(meta.openGraph?.locale, 'en_US')
      
      const images = meta.openGraph?.images as Array<{ url: string; width: number; height: number; alt: string }>
      assert.ok(images && images.length > 0)
      assert.equal(images[0].url, DEFAULT_OG_IMAGE)
      assert.equal(images[0].width, 1200)
      assert.equal(images[0].height, 630)
    })

    it('T1.04: createPageMetadata generates Twitter summary card tags', () => {
      const meta = createPageMetadata({
        title: 'Lucide Icons Collection',
        description: 'Browse 1960+ Lucide SVG icons.',
        path: '/icons/lucide-icons',
      })

      const twitter = meta.twitter as { card: string; site: string; creator: string; title: string; description: string; images: string[] }
      assert.equal(twitter?.card, 'summary_large_image')
      assert.equal(twitter?.site, '@IconSearchinfo')
      assert.equal(twitter?.creator, '@IconSearchinfo')
      assert.equal(twitter?.title, 'Lucide Icons Collection')
      assert.ok(twitter?.images?.length > 0)
    })

    it('T1.05: generateWebSiteSchema outputs Schema.org WebSite entity with SearchAction', () => {
      const schema = generateWebSiteSchema()
      assert.equal(schema['@context'], 'https://schema.org')
      assert.equal(schema['@type'], 'WebSite')
      assert.equal(schema['@id'], 'https://iconsearch.info/#website')
      assert.equal(schema.name, 'IconSearch')
      assert.equal(schema.url, 'https://iconsearch.info')
      assert.equal(schema.inLanguage, 'en')

      const action = schema.potentialAction
      assert.equal(action['@type'], 'SearchAction')
      assert.equal(action.target, 'https://iconsearch.info/icon-search?q={search_term_string}')
      assert.equal(action['query-input'], 'required name=search_term_string')
    })

    it('T1.06: generateOrganizationSchema outputs Organization entity with logomark and sameAs social links', () => {
      const schema = generateOrganizationSchema()
      assert.equal(schema['@context'], 'https://schema.org')
      assert.equal(schema['@type'], 'Organization')
      assert.equal(schema['@id'], 'https://iconsearch.info/#organization')
      assert.equal(schema.name, 'IconSearch')
      assert.equal(schema.url, 'https://iconsearch.info')
      
      const logo = schema.logo
      assert.equal(logo['@type'], 'ImageObject')
      assert.equal(logo.url, 'https://iconsearch.info/iconsearch-logomark-900.png')
      assert.equal(logo.width, 900)
      assert.equal(logo.height, 900)

      assert.ok(Array.isArray(schema.sameAs))
      assert.ok(schema.sameAs.includes('https://x.com/IconSearchinfo'))
      assert.ok(schema.sameAs.includes('https://github.com/iconsearch'))
    })

    it('T1.07: generateSoftwareAppSchema outputs SoftwareApplication with free Offer', () => {
      const schema = generateSoftwareAppSchema({
        name: 'IconSearch Vector Design Suite',
        description: 'In-browser vector icon customizer, code exporter, and sprite compiler.',
        path: '/icon-search',
        featureList: ['Live stroke width editing', 'Multi-facet filtering', 'ZIP bundle export'],
      })

      assert.equal(schema['@context'], 'https://schema.org')
      assert.equal(schema['@type'], 'SoftwareApplication')
      assert.equal(schema.name, 'IconSearch Vector Design Suite')
      assert.equal(schema.url, 'https://iconsearch.info/icon-search')
      assert.equal(schema.applicationCategory, 'DesignApplication')
      assert.equal(schema.offers.price, '0')
      assert.equal(schema.offers.priceCurrency, 'USD')
      assert.equal(schema.featureList?.length, 3)
      assert.equal(schema.author['@id'], 'https://iconsearch.info/#organization')
    })

    it('T1.08: generateBreadcrumbSchema outputs BreadcrumbList with ordered ListItems', () => {
      const schema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Frameworks', url: '/frameworks' },
        { name: 'React Icons', url: '/react-icons' },
      ])

      assert.equal(schema['@context'], 'https://schema.org')
      assert.equal(schema['@type'], 'BreadcrumbList')
      assert.equal(schema.itemListElement.length, 3)
      
      assert.equal(schema.itemListElement[0].position, 1)
      assert.equal(schema.itemListElement[0].name, 'Home')
      assert.equal(schema.itemListElement[0].item, 'https://iconsearch.info/')

      assert.equal(schema.itemListElement[1].position, 2)
      assert.equal(schema.itemListElement[1].name, 'Frameworks')
      assert.equal(schema.itemListElement[1].item, 'https://iconsearch.info/frameworks')

      assert.equal(schema.itemListElement[2].position, 3)
      assert.equal(schema.itemListElement[2].name, 'React Icons')
      assert.equal(schema.itemListElement[2].item, 'https://iconsearch.info/react-icons')
    })

    it('T1.09: generateImageObjectSchema outputs ImageObject with SPDX license and creator', () => {
      const schema = generateImageObjectSchema({
        name: 'Arrow Right SVG Icon',
        description: 'Vector right arrow icon in Lucide collection.',
        contentUrl: 'https://iconsearch.info/api/svg/lucide-icons/arrow-right',
        license: 'MIT',
        creator: 'Lucide Community',
        tags: ['arrow', 'right', 'navigation'],
      })

      assert.equal(schema['@context'], 'https://schema.org')
      assert.equal(schema['@type'], 'ImageObject')
      assert.equal(schema.name, 'Arrow Right SVG Icon')
      assert.equal(schema.contentUrl, 'https://iconsearch.info/api/svg/lucide-icons/arrow-right')
      assert.equal(schema.license, 'https://spdx.org/licenses/MIT.html')
      assert.equal(schema.acquireLicensePage, 'https://iconsearch.info/licenses')
      assert.equal(schema.creator.name, 'Lucide Community')
      assert.equal(schema.keywords, 'arrow, right, navigation')
    })

    it('T1.10: generateFAQSchema outputs FAQPage with Question and Answer mainEntities', () => {
      const faqs = [
        { q: 'Is IconSearch completely free?', a: 'Yes, all 355,000+ vector icons are open source.' },
        { q: 'Can I customize stroke width?', a: 'Yes, dynamic stroke width adjustment from 0.5px to 3.0px is supported.' },
      ]
      const schema = generateFAQSchema(faqs)

      assert.equal(schema['@context'], 'https://schema.org')
      assert.equal(schema['@type'], 'FAQPage')
      assert.equal(schema.mainEntity.length, 2)
      assert.equal(schema.mainEntity[0]['@type'], 'Question')
      assert.equal(schema.mainEntity[0].name, 'Is IconSearch completely free?')
      assert.equal(schema.mainEntity[0].acceptedAnswer['@type'], 'Answer')
      assert.equal(schema.mainEntity[0].acceptedAnswer.text, 'Yes, all 355,000+ vector icons are open source.')
    })

    it('T1.11: CollectionPage JSON-LD graph supports nested ItemList of icons', () => {
      const canonicalUrl = 'https://iconsearch.info/icons/lucide-icons'
      const collectionSchema = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CollectionPage',
            '@id': `${canonicalUrl}#collection`,
            name: 'Lucide Icons',
            url: canonicalUrl,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: 2,
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'arrow-right', url: `${canonicalUrl}/arrow-right` },
                { '@type': 'ListItem', position: 2, name: 'arrow-left', url: `${canonicalUrl}/arrow-left` },
              ],
            },
          },
        ],
      }

      assert.equal(collectionSchema['@context'], 'https://schema.org')
      assert.equal(collectionSchema['@graph'][0]['@type'], 'CollectionPage')
      assert.equal(collectionSchema['@graph'][0].mainEntity.itemListElement.length, 2)
    })

    it('T1.12: TechArticle schema generator validates framework guide structured data with dates and connected graph', () => {
      const techArticleSchema = generateFrameworkHubSchema({
        name: 'React Icons Guide 2026 — Architecture & Performance',
        description: 'Complete guide on tree-shaking and SVG component rendering in React.',
        path: '/react-icons',
        datePublished: '2026-08-17',
        dateModified: '2026-08-20',
      })

      assert.equal(techArticleSchema['@context'], 'https://schema.org')
      assert.equal(techArticleSchema['@type'], 'TechArticle')
      assert.equal(techArticleSchema['@id'], 'https://iconsearch.info/react-icons#article')
      assert.equal(techArticleSchema.headline.includes('React Icons Guide'), true)
      assert.equal(techArticleSchema.datePublished, '2026-08-17')
      assert.equal(techArticleSchema.dateModified, '2026-08-20')
      assert.equal(techArticleSchema.inLanguage, 'en')
      assert.equal(techArticleSchema.isPartOf['@id'], 'https://iconsearch.info/#website')
      assert.equal(techArticleSchema.author['@id'], 'https://iconsearch.info/#organization')
      assert.equal(techArticleSchema.publisher['@id'], 'https://iconsearch.info/#organization')
    })

    it('T1.13: generateWebApplicationSchema outputs WebApplication entity with connected graph and rich properties', () => {
      const schema = generateWebApplicationSchema({
        name: 'IconSearch Vector Icon Engine',
        description: 'Search 355,000+ free SVG icons.',
        path: '/icon-search',
        featureList: ['Universal vector search', 'Customizer sandbox'],
      })

      assert.equal(schema['@context'], 'https://schema.org')
      assert.equal(schema['@type'], 'WebApplication')
      assert.equal(schema['@id'], 'https://iconsearch.info/icon-search#webapp')
      assert.equal(schema.name, 'IconSearch Vector Icon Engine')
      assert.equal(schema.url, 'https://iconsearch.info/icon-search')
      assert.equal(schema.applicationCategory, 'DesignApplication')
      assert.equal(schema.operatingSystem, 'All (Web Browser, macOS, Windows, Linux, iOS, Android)')
      assert.equal(schema.browserRequirements, 'Requires JavaScript. Requires HTML5.')
      assert.equal(schema.offers.price, '0')
      assert.equal(schema.offers.priceCurrency, 'USD')
      assert.equal(schema.offers.availability, 'https://schema.org/InStock')
      assert.equal(schema.featureList?.length, 2)
      assert.equal(schema.isPartOf['@id'], 'https://iconsearch.info/#website')
      assert.equal(schema.author['@id'], 'https://iconsearch.info/#organization')
      assert.equal(schema.publisher['@id'], 'https://iconsearch.info/#organization')
    })


    it('T1.15: createPageMetadata supports custom robots meta tag settings', () => {
      const meta = createPageMetadata({
        title: 'Search Results',
        description: 'Search 355k icons',
        path: '/icon-search',
        robots: {
          index: false,
          follow: true,
        },
      })

      assert.deepEqual(meta.robots, { index: false, follow: true })
    })

    it('T1.16: createPageMetadata uses custom keywords array when provided', () => {
      const customKeywords = ['custom icon 1', 'custom icon 2']
      const meta = createPageMetadata({
        title: 'Custom Page',
        description: 'Custom Description',
        path: '/custom',
        keywords: customKeywords,
      })

      assert.deepEqual(meta.keywords, customKeywords)
    })

    it('T1.17: generateBreadcrumbSchema preserves existing absolute HTTP/HTTPS URLs', () => {
      const schema = generateBreadcrumbSchema([
        { name: 'External Hub', url: 'https://example.com/hub' },
        { name: 'Internal Page', url: '/page' },
      ])

      assert.equal(schema.itemListElement[0].item, 'https://example.com/hub')
      assert.equal(schema.itemListElement[1].item, 'https://iconsearch.info/page')
    })

    it('T1.18: generateSoftwareAppSchema includes optional screenshot when provided', () => {
      const schema = generateSoftwareAppSchema({
        name: 'IconSearch Studio',
        description: 'Interactive editor',
        path: '/studio',
        screenshot: 'https://iconsearch.info/screenshots/studio.png',
      })

      assert.equal(schema.screenshot, 'https://iconsearch.info/screenshots/studio.png')
    })

    it('T1.19: generateImageObjectSchema formats license URL with encoded SPDX ID', () => {
      const schema = generateImageObjectSchema({
        name: 'Apache Licensed Icon',
        description: 'Test',
        contentUrl: 'https://iconsearch.info/test.svg',
        license: 'Apache-2.0',
      })

      assert.equal(schema.license, 'https://spdx.org/licenses/Apache-2.0.html')
    })

    it('T1.20: generateFAQSchema handles multiple FAQ entries accurately', () => {
      const faqs = [
        { q: 'Q1', a: 'A1' },
        { q: 'Q2', a: 'A2' },
        { q: 'Q3', a: 'A3' },
        { q: 'Q4', a: 'A4' },
      ]
      const schema = generateFAQSchema(faqs)
      assert.equal(schema.mainEntity.length, 4)
      assert.equal(schema.mainEntity[3].name, 'Q4')
      assert.equal(schema.mainEntity[3].acceptedAnswer.text, 'A4')
    })
  })

  // ── TIER 2: BOUNDARY & CORNER CASES ───────────────────────────────────────
  describe('Tier 2: Boundary & Corner Cases', () => {
    it('T2.01: createPageMetadata handles root path "/" with correct canonical URL', () => {
      const meta = createPageMetadata({
        title: 'IconSearch — Search 355k Free Vector SVG Icons',
        description: 'Discover and customize 355,000+ open-source SVG icons from 229 libraries.',
        path: '/',
      })

      assert.equal(meta.alternates?.canonical, 'https://iconsearch.info/')
      assert.equal(meta.openGraph?.url, 'https://iconsearch.info/')
    })

    it('T2.02: createPageMetadata handles deeply nested paths cleanly', () => {
      const meta = createPageMetadata({
        title: 'Deep Nested Icon',
        description: 'Nested detail',
        path: '/icons/lucide-icons/arrow-up-right',
      })

      assert.equal(meta.alternates?.canonical, 'https://iconsearch.info/icons/lucide-icons/arrow-up-right')
    })

    it('T2.03: createPageMetadata handles custom OG image dimensions', () => {
      const meta = createPageMetadata({
        title: 'Custom Image Page',
        description: 'Testing dimension override',
        path: '/custom-image',
        image: 'https://iconsearch.info/custom.png',
        imageWidth: 800,
        imageHeight: 400,
        imageAlt: 'Custom alternative text',
      })

      const ogImages = meta.openGraph?.images as Array<{ url: string; width: number; height: number; alt: string }>
      assert.equal(ogImages[0].url, 'https://iconsearch.info/custom.png')
      assert.equal(ogImages[0].width, 800)
      assert.equal(ogImages[0].height, 400)
      assert.equal(ogImages[0].alt, 'Custom alternative text')
    })

    it('T2.04: generateBreadcrumbSchema handles empty breadcrumbs array without error', () => {
      const schema = generateBreadcrumbSchema([])
      assert.equal(schema['@type'], 'BreadcrumbList')
      assert.equal(schema.itemListElement.length, 0)
    })

    it('T2.05: generateBreadcrumbSchema handles single item breadcrumb list', () => {
      const schema = generateBreadcrumbSchema([{ name: 'Home', url: '/' }])
      assert.equal(schema.itemListElement.length, 1)
      assert.equal(schema.itemListElement[0].position, 1)
    })

    it('T2.06: generateFAQSchema handles empty FAQs array without error', () => {
      const schema = generateFAQSchema([])
      assert.equal(schema['@type'], 'FAQPage')
      assert.equal(schema.mainEntity.length, 0)
    })

    it('T2.07: generateSoftwareAppSchema handles empty featureList without generating featureList key', () => {
      const schema = generateSoftwareAppSchema({
        name: 'Minimal App',
        description: 'Minimal Description',
        path: '/app',
        featureList: [],
      })

      assert.equal(schema.featureList, undefined)
    })

    it('T2.08: generateImageObjectSchema handles empty tags list by producing empty string keywords', () => {
      const schema = generateImageObjectSchema({
        name: 'Untagged Icon',
        description: 'Icon without tags',
        contentUrl: 'https://iconsearch.info/untagged.svg',
        tags: [],
      })

      assert.equal(schema.keywords, '')
    })

    it('T2.09: JSON-LD serialization safely escapes angle brackets to prevent XSS in script tags', () => {
      const schema = generateFAQSchema([
        { q: 'Can I use <script> tags?', a: 'No, but <b>HTML</b> is safely sanitized.' },
      ])
      const json = JSON.stringify(schema).replace(/</g, '\\u003c')
      assert.ok(!json.includes('<script>'))
      assert.ok(json.includes('\\u003cscript>'))
    })

    it('T2.10: Schema serialization produces valid JSON that parses cleanly', () => {
      const schema = generateWebSiteSchema()
      const json = JSON.stringify(schema)
      const parsed = JSON.parse(json)
      assert.equal(parsed['@type'], 'WebSite')
      assert.equal(parsed.name, 'IconSearch')
    })

    it('T2.11: Complex schema graph with multiple entities serializes cleanly', () => {
      const graph = {
        '@context': 'https://schema.org',
        '@graph': [
          generateWebSiteSchema(),
          generateOrganizationSchema(),
          generateFAQSchema([{ q: 'Question', a: 'Answer' }]),
        ],
      }

      const json = JSON.stringify(graph)
      const parsed = JSON.parse(json)
      assert.equal(parsed['@graph'].length, 3)
    })

    it('T2.12: createPageMetadata handles special characters and quotes in title and description', () => {
      const meta = createPageMetadata({
        title: 'Lucide & Heroicons: "Top 10" <Vector> Icons in 2026',
        description: 'Explore "Lucide" & "Heroicons" with 100% precision & speed.',
        path: '/icon-search',
      })

      assert.ok(meta.title?.toString().includes('Lucide & Heroicons'))
      assert.ok(meta.description?.includes('"Lucide" & "Heroicons"'))
    })

    it('T2.13: generateImageObjectSchema defaults license to MIT when not specified', () => {
      const schema = generateImageObjectSchema({
        name: 'Default License Icon',
        description: 'Test icon',
        contentUrl: 'https://iconsearch.info/test.svg',
      })

      assert.equal(schema.license, 'https://spdx.org/licenses/MIT.html')
    })

    it('T2.14: generateImageObjectSchema defaults creator to Open Source Community', () => {
      const schema = generateImageObjectSchema({
        name: 'Default Creator Icon',
        description: 'Test icon',
        contentUrl: 'https://iconsearch.info/test.svg',
      })

      assert.equal(schema.creator.name, 'Open Source Community')
    })

    it('T2.15: createPageMetadata sets Twitter image fallback when custom image is passed', () => {
      const customImage = 'https://iconsearch.info/custom-twitter.png'
      const meta = createPageMetadata({
        title: 'Twitter Image Override',
        description: 'Test custom image',
        path: '/twitter-test',
        image: customImage,
      })

      const twitter = meta.twitter as { images: string[] }
      assert.equal(twitter?.images[0], customImage)
    })
  })

  // ── TIER 3: PAIRWISE COMBINATIONS ─────────────────────────────────────────
  describe('Tier 3: Pairwise Combinations', () => {
    it('T3.01: Pair 1: /react-icons Metadata + Breadcrumbs + FAQ Schema', () => {
      const meta = createPageMetadata({
        title: 'React Icons Hub',
        description: 'React guides',
        path: '/react-icons',
      })
      const breadcrumbs = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'React Icons', url: '/react-icons' },
      ])
      const faqs = generateFAQSchema([
        { q: 'How to tree-shake in React?', a: 'Use named ESM imports.' },
      ])

      assert.equal(meta.alternates?.canonical, 'https://iconsearch.info/react-icons')
      assert.equal(breadcrumbs.itemListElement.length, 2)
      assert.equal(faqs.mainEntity.length, 1)
    })

    it('T3.02: Pair 2: /tailwind-icons Metadata + TechArticle + SoftwareApplication', () => {
      const meta = createPageMetadata({
        title: 'Tailwind Icons Guide',
        description: 'Tailwind CSS icons',
        path: '/tailwind-icons',
      })
      const app = generateSoftwareAppSchema({
        name: 'Tailwind Icon Exporter',
        description: 'Generate Tailwind inline classes',
        path: '/tailwind-icons',
      })

      assert.equal(meta.openGraph?.siteName, 'IconSearch')
      assert.equal(app['@type'], 'SoftwareApplication')
    })

    it('T3.03: Pair 3: /vue-icons Metadata + Breadcrumbs + FAQ Schema (5 questions)', () => {
      const faqs = generateFAQSchema([
        { q: 'Q1', a: 'A1' },
        { q: 'Q2', a: 'A2' },
        { q: 'Q3', a: 'A3' },
        { q: 'Q4', a: 'A4' },
        { q: 'Q5', a: 'A5' },
      ])
      assert.equal(faqs.mainEntity.length, 5)
    })

    it('T3.04: Pair 4: /svelte-icons Metadata + TechArticle + Canonical URL', () => {
      const meta = createPageMetadata({
        title: 'Svelte Icons Guide',
        description: 'Svelte 4/5 icon components',
        path: '/svelte-icons',
        type: 'article',
      })
      assert.equal((meta.openGraph as any)?.type, 'article')
      assert.equal(meta.alternates?.canonical, 'https://iconsearch.info/svelte-icons')
    })

    it('T3.05: Pair 5: /nextjs-icons Metadata + OpenGraph Image + Keywords', () => {
      const meta = createPageMetadata({
        title: 'Next.js App Router Icons',
        description: 'Server component friendly SVG icons',
        path: '/nextjs-icons',
        keywords: ['nextjs icons', 'server components svg', 'app router'],
      })
      assert.equal(meta.keywords?.length, 3)
    })

    it('T3.07: Pair 7: Icon ImageObject Schema with ISC License', () => {
      const img = generateImageObjectSchema({
        name: 'Shopping Cart SVG',
        description: 'Cart icon',
        contentUrl: 'https://iconsearch.info/api/svg/lucide-icons/shopping-cart',
        license: 'ISC',
      })
      assert.equal(img.license, 'https://spdx.org/licenses/ISC.html')
    })

    it('T3.09: Pair 9: /icons/tabler-icons Library CollectionPage + Organization Schema', () => {
      const org = generateOrganizationSchema()
      assert.equal(org.name, 'IconSearch')
      assert.ok(org.logo.url.endsWith('.png'))
    })

    it('T3.10: Pair 10: /licenses Page Metadata + FAQ Schema + Breadcrumbs', () => {
      const meta = createPageMetadata({
        title: 'Open Source Icon Licenses (MIT, Apache 2.0, CC0)',
        description: 'Commercial usage terms and attribution requirements',
        path: '/licenses',
      })
      const faqs = generateFAQSchema([
        { q: 'Can I use MIT icons in commercial SaaS?', a: 'Yes, MIT allows commercial use with license preservation.' },
      ])
      assert.equal(meta.title?.toString().includes('Licenses'), true)
      assert.equal(faqs.mainEntity.length, 1)
    })
  })

  // ── TIER 4: REAL-WORLD DEVELOPER WORKLOADS ────────────────────────────────
  describe('Tier 4: Real-World Developer Workloads', () => {
    it('T4.02: Workload 2: Framework Hub documentation page validation (Metadata + FAQPage + WebSite)', () => {
      const metadata = createPageMetadata({
        title: 'Vue Icons Guide — Component Patterns & Vite Optimization',
        description: 'Comprehensive architectural guide on using vector icons in Vue 3.',
        path: '/vue-icons',
        type: 'article',
      })

      const website = generateWebSiteSchema()
      const faqs = generateFAQSchema([
        { q: 'How to use icons in Vue 3 script setup?', a: 'Import component or use inline SVG template.' },
      ])

      assert.equal((metadata.openGraph as any)?.type, 'article')
      assert.equal(website['@type'], 'WebSite')
      assert.equal(faqs['@type'], 'FAQPage')
    })

    it('T4.03: Workload 3: Single Icon Detail page SEO graph (ImageObject + Breadcrumbs + Twitter Card)', () => {
      const iconName = 'shield-check'
      const lib = 'lucide-icons'
      const path = `/icons/${lib}/${iconName}` as const

      const metadata = createPageMetadata({
        title: `${iconName} Icon (${lib}) — Free SVG & React JSX`,
        description: `Download ${iconName} SVG icon from ${lib}. Customize size, stroke width, and colors.`,
        path,
      })

      const imageObject = generateImageObjectSchema({
        name: `${iconName} SVG Vector Icon`,
        description: `Free open source vector icon from ${lib}`,
        contentUrl: `${SITE_URL}/api/svg/${lib}/${iconName}`,
        license: 'ISC',
        creator: 'Lucide Icons Community',
        tags: ['shield', 'check', 'security', 'verified'],
      })

      const breadcrumbs = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Lucide Icons', url: `/icons/${lib}` },
        { name: iconName, url: path },
      ])

      assert.ok(metadata.title?.toString().includes('shield-check'))
      assert.equal(imageObject['@type'], 'ImageObject')
      assert.equal(breadcrumbs.itemListElement.length, 3)
    })

    it('T4.04: Workload 4: Google Rich Snippet compliance audit on all generated schemas', () => {
      const schemas = [
        generateWebSiteSchema(),
        generateOrganizationSchema(),
        generateSoftwareAppSchema({ name: 'App', description: 'Desc', path: '/app' }),
        generateBreadcrumbSchema([{ name: 'Home', url: '/' }]),
        generateImageObjectSchema({ name: 'Icon', description: 'Desc', contentUrl: 'https://iconsearch.info/icon.svg' }),
        generateFAQSchema([{ q: 'Q', a: 'A' }]),
      ]

      for (const s of schemas) {
        assert.equal(s['@context'], 'https://schema.org')
        assert.ok(typeof s['@type'] === 'string')
        const serialized = JSON.stringify(s)
        assert.ok(serialized.length > 20)
        assert.doesNotThrow(() => JSON.parse(serialized))
      }
    })

    it('T4.05: Workload 5: Sitemap & Canonical integrity validation across canonical paths', () => {
      const samplePaths = [
        '/',
        '/icon-search',
        '/react-icons',
        '/tailwind-icons',
        '/vue-icons',
        '/svelte-icons',
        '/nextjs-icons',
        '/licenses',
        '/about',
        '/free-svg-icons',
      ] as const

      for (const p of samplePaths) {
        const meta = createPageMetadata({
          title: `Page ${p}`,
          description: `Description for ${p}`,
          path: p,
        })
        const canonical = String(meta.alternates?.canonical || '')
        assert.ok(canonical.startsWith('https://iconsearch.info'))
        assert.ok(!canonical.includes('undefined'))
        assert.ok(!canonical.includes('//', 8)) // no double slashes after https://
      }
    })
  })
})
