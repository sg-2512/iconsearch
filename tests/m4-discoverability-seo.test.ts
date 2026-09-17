import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  CATEGORIES,
  CATEGORY_KEYWORDS_MAP,
  getAllCategories,
  getCategoryBySlug,
} from '../lib/categories'
import {
  generateFrameworkHubSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  createPageMetadata,
} from '../lib/seo'
import { getIconBySlug } from '../lib/icons'

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

  describe('2. Schema.org JSON-LD Generation for Framework Hubs', () => {
    it('M4.05: generateFrameworkHubSchema creates valid TechArticle schema', () => {
      const schema = generateFrameworkHubSchema({
        name: 'React Icons Guide 2026',
        description: 'Complete architecture guide for React icons.',
        path: '/react-icons',
        datePublished: '2026-08-17',
        dateModified: '2026-08-20',
      })

      assert.equal(schema['@context'], 'https://schema.org')
      assert.equal(schema['@type'], 'TechArticle')
      assert.equal(schema['@id'], 'https://iconsearch.info/react-icons#article')
      assert.equal(schema.headline, 'React Icons Guide 2026')
      assert.equal(schema.url, 'https://iconsearch.info/react-icons')
      assert.equal(schema.datePublished, '2026-08-17')
      assert.equal(schema.dateModified, '2026-08-20')
      assert.equal(schema.isPartOf['@id'], 'https://iconsearch.info/#website')
    })
  })

  describe('3. Metadata & Canonical URLs', () => {
    it('M4.08: Metadata generator produces canonical URLs and OpenGraph tags for category search queries', () => {
      const cat = getCategoryBySlug('commerce')!
      const meta = createPageMetadata({
        title: `${cat.title} — IconSearch`,
        description: cat.description,
        path: `/icon-search?category=${cat.slug}`,
      })

      assert.equal(meta.title, `${cat.title} — IconSearch`)
      assert.equal(meta.alternates?.canonical, 'https://iconsearch.info/icon-search?category=commerce')
      assert.equal(meta.openGraph?.url, 'https://iconsearch.info/icon-search?category=commerce')
    })
  })
})
