import { MetadataRoute } from 'next'
import { icons } from '../lib/icons'
import { getAllPosts } from '../lib/blog'
import { categories } from '../data/categories'
import { useCases } from '../data/usecases'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://iconsearch.info'
  const now = new Date()

  // ─── Static pages ─────────────────────────────────────────────────────────
  // Defined directly (no .map) so TypeScript preserves the literal types
  // of changeFrequency instead of widening them to string.
  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                       lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/free-svg-icons`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/react-icons`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/nextjs-icons`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/vue-icons`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/svelte-icons`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/tailwind-icons`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/typescript-icons`, lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/icon-search`,      lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/best-for-you`,     lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/licenses`,         lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/compare`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/blog`,             lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/stats`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/llm.txt`,          lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`,          lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy-policy`,   lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/terms`,            lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ]

  // ─── Library pages ────────────────────────────────────────────────────────
  const libraryPages: MetadataRoute.Sitemap = icons.map(icon => ({
    url: `${base}/icons/${icon.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // ─── Comparison pages ─────────────────────────────────────────────────────
  const comparisonPages: MetadataRoute.Sitemap = []
  for (let i = 0; i < icons.length; i++) {
    for (let j = i + 1; j < icons.length; j++) {
      comparisonPages.push({
        url: `${base}/compare/${icons[i].slug}-vs-${icons[j].slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })
    }
  }

  // ─── Blog posts ───────────────────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = getAllPosts().map(post => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // ─── Category pages ───────────────────────────────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = [
    { url: `${base}/icons/category`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    ...categories.map(cat => ({
      url: `${base}/icons/category/${cat.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]

  // ─── Use case pages ───────────────────────────────────────────────────────
  const useCasePages: MetadataRoute.Sitemap = [
    { url: `${base}/use-cases`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    ...useCases.map(uc => ({
      url: `${base}/use-cases/${uc.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]

  return [
    ...staticPages,
    ...libraryPages,
    ...comparisonPages,
    ...blogPages,
    ...categoryPages,
    ...useCasePages,
  ]
}