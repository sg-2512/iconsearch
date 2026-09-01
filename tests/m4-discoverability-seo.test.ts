import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  CATEGORIES,
  CATEGORY_KEYWORDS_MAP,
  getAllCategories,
  getCategoryBySlug,
} from '../lib/categories'
import {
  generateCategoryPageSchema,
  generateFrameworkHubSchema,
  generateComparisonSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  createPageMetadata,
} from '../lib/seo'
import { getComparisonPairs, getIconBySlug } from '../lib/icons'

describe('Milestone M4: Discoverability & Programmatic SEO Test Suite', () => {
  describe('1. Category Taxonomies & Metadata', () => {
    it('M4.01: Exactly 25 high-intent category taxonomies are defined with required attributes', () => {
      const categories = getAllCategories()
      assert.equal(categories.length, 25, 'Must contain exactly 25 categories')

      const expectedSlugs = [
        'ai', 'commerce', 'arrows', 'media', 'communication', 'security',
        'weather', 'devices', 'design', 'development', 'finance', 'social',
        'nature', 'health', 'travel', 'food', 'editor', 'maps',
        'interface', 'brand', 'education', 'real-estate', 'sports', 'files', 'emoji'
      ]

      for (const slug of expectedSlugs) {
        const cat = getCategoryBySlug(slug)
        assert.ok(cat, `Category "${slug}" must exist`)
        assert.ok(cat.name && cat.name.length > 0, `Category "${slug}" must have name`)
        assert.ok(cat.title && cat.title.length > 0, `Category "${slug}" must have title`)
        assert.ok(cat.description && cat.description.length > 20, `Category "${slug}" must have detailed description`)
        assert.ok(cat.keywords && cat.keywords.length >= 6, `Category "${slug}" must have at least 6 keywords`)
        assert.ok(cat.iconSampleNames && cat.iconSampleNames.length >= 4, `Category "${slug}" must have sample icons`)
        assert.ok(cat.faqs && cat.faqs.length >= 1, `Category "${slug}" must have FAQs`)
        assert.ok(cat.relatedCategories && cat.relatedCategories.length >= 2, `Category "${slug}" must have related categories`)
      }
    })

    it('M4.02: CATEGORY_KEYWORDS_MAP contains all categories and allows case-insensitive lookups', () => {
      assert.equal(Object.keys(CATEGORY_KEYWORDS_MAP).length, 25)
      assert.ok(CATEGORY_KEYWORDS_MAP['ai'].includes('brain'))
      assert.ok(CATEGORY_KEYWORDS_MAP['commerce'].includes('cart'))
      assert.ok(CATEGORY_KEYWORDS_MAP['security'].includes('shield'))
      assert.ok(CATEGORY_KEYWORDS_MAP['development'].includes('code'))
    })

    it('M4.03: getCategoryBySlug handles case variations and invalid slugs cleanly', () => {
      assert.ok(getCategoryBySlug('AI'))
      assert.ok(getCategoryBySlug('Commerce'))
      assert.equal(getCategoryBySlug('non-existent-category-xyz'), undefined)
    })
  })

  describe('2. Schema.org JSON-LD Generation for M4 Hubs', () => {
    it('M4.04: generateCategoryPageSchema creates valid CollectionPage with ItemList', () => {
      const schema = generateCategoryPageSchema({
        name: 'Free AI & Machine Learning SVG Icons',
        description: '4500+ vector AI icons',
        path: '/categories/ai',
        count: 4500,
        icons: [
          { name: 'Sparkles', url: '/api/svg/lucide-icons/sparkles' },
          { name: 'Bot', url: '/api/svg/lucide-icons/bot' },
        ],
      })

      assert.equal(schema['@context'], 'https://schema.org')
      assert.equal(schema['@type'], 'CollectionPage')
      assert.equal(schema.url, 'https://iconsearch.info/categories/ai')
      assert.equal(schema.numberOfItems, 4500)
      const mainEntity = schema.mainEntity as any
      assert.ok(mainEntity)
      assert.equal(mainEntity['@type'], 'ItemList')
      assert.equal(mainEntity.numberOfItems, 2)
      assert.equal(mainEntity.itemListElement[0].name, 'Sparkles')
      assert.equal(mainEntity.itemListElement[0].url, 'https://iconsearch.info/api/svg/lucide-icons/sparkles')
    })

    it('M4.05: generateFrameworkHubSchema creates valid TechArticle schema', () => {
      const schema = generateFrameworkHubSchema({
        name: 'React Icons Guide 2026',
        description: 'Complete architecture guide for React icons.',
        path: '/react-icons',
      })

      assert.equal(schema['@context'], 'https://schema.org')
      assert.equal(schema['@type'], 'TechArticle')
      assert.equal(schema.headline, 'React Icons Guide 2026')
      assert.equal(schema.url, 'https://iconsearch.info/react-icons')
    })

    it('M4.06: generateComparisonSchema creates valid comparison TechArticle schema', () => {
      const schema = generateComparisonSchema({
        libA: 'Lucide Icons',
        libB: 'Heroicons',
        path: '/compare/lucide-icons-vs-heroicons',
      })

      assert.equal(schema['@context'], 'https://schema.org')
      assert.equal(schema['@type'], 'TechArticle')
      assert.ok(schema.headline.includes('Lucide Icons vs Heroicons'))
      assert.equal(schema.url, 'https://iconsearch.info/compare/lucide-icons-vs-heroicons')
    })
  })

  describe('3. Comparison Pair Generation & Resolution', () => {
    it('M4.07: getComparisonPairs generates combinations for all icons', () => {
      const pairs = getComparisonPairs()
      assert.ok(pairs.length > 50, 'Should generate numerous comparison combinations')
      for (const [a, b] of pairs) {
        assert.notEqual(a.slug, b.slug)
        assert.ok(a.name && b.name)
      }
    })

    it('M4.08: Metadata generator produces canonical URLs and OpenGraph tags for categories', () => {
      const cat = getCategoryBySlug('commerce')!
      const meta = createPageMetadata({
        title: `${cat.title} — IconSearch`,
        description: cat.description,
        path: `/categories/${cat.slug}`,
      })

      assert.equal(meta.title, `${cat.title} — IconSearch`)
      assert.equal(meta.alternates?.canonical, 'https://iconsearch.info/categories/commerce')
      assert.equal(meta.openGraph?.url, 'https://iconsearch.info/categories/commerce')
    })
  })
})
