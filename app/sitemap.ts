import type { MetadataRoute } from 'next'
import { allLibraries } from '../data/library-catalog'
import snapshot from '../data/icon-search.snapshot.json'
import { staticPages } from '../data/static-pages'
import { CATEGORIES } from '../lib/categories'
import { SITE_URL } from '../lib/seo'

const knownPageDates = new Map(staticPages.map((page) => [page.href, page.date]))
knownPageDates.set('/', '2026-08-20')
knownPageDates.set('/free-svg-icons', snapshot.generatedAt)
knownPageDates.set('/icon-search', snapshot.generatedAt)
knownPageDates.set('/logo-maker', '2026-08-17')
knownPageDates.set('/agents', '2026-08-15')
knownPageDates.set('/docs/agents', '2026-08-15')
knownPageDates.set('/mcp-server', '2026-08-15')
knownPageDates.set('/directory', snapshot.generatedAt)
knownPageDates.set('/stats', '2026-05-18')
knownPageDates.set('/licenses', '2026-05-20')
knownPageDates.set('/about', '2026-07-24')
knownPageDates.set('/contact', '2026-07-24')
knownPageDates.set('/privacy-policy', '2026-07-24')
knownPageDates.set('/terms', '2026-07-24')

// Framework dates
knownPageDates.set('/react-icons', '2026-08-20')
knownPageDates.set('/nextjs-icons', '2026-08-20')
knownPageDates.set('/tailwind-icons', '2026-08-20')
knownPageDates.set('/vue-icons', '2026-08-20')
knownPageDates.set('/svelte-icons', '2026-08-20')
knownPageDates.set('/typescript-icons', '2026-08-20')

// Plugin dates
knownPageDates.set('/figma-plugin', '2026-07-20')
knownPageDates.set('/vscode-extension', '2026-06-28')
knownPageDates.set('/chrome-extension', '2026-06-28')
knownPageDates.set('/framer-plugin', '2026-06-28')
knownPageDates.set('/webflow-extension', '2026-07-20')
knownPageDates.set('/canva-app', '2026-07-20')
knownPageDates.set('/adobe-plugin', '2026-07-20')
knownPageDates.set('/obsidian-plugin', '2026-07-20')
knownPageDates.set('/penpot-plugin', '2026-07-20')
knownPageDates.set('/raycast-extension', '2026-07-20')
knownPageDates.set('/jetbrains-plugin', '2026-07-20')
knownPageDates.set('/tailwind-plugin', '2026-07-20')
knownPageDates.set('/storybook-addon', '2026-07-20')
knownPageDates.set('/shopify-extension', '2026-07-20')
knownPageDates.set('/sketch-plugin', '2026-07-20')
knownPageDates.set('/wordpress-plugin', '2026-07-20')
knownPageDates.set('/powerpoint-addin', '2026-07-20')
knownPageDates.set('/google-slides-addon', '2026-07-20')

function entry(
  path: string,
  lastModified?: string,
  changeFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly',
  priority = 0.7
): MetadataRoute.Sitemap[number] {
  return {
    url: new URL(path, SITE_URL).toString(),
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
  }
}

export async function generateSitemaps() {
  return [
    { id: 'core' },
    { id: 'categories' },
    { id: 'libraries' },
    { id: 'frameworks' },
    { id: 'plugins' },
  ]
}

export default async function sitemap(
  props?: { id: Promise<string> } | { id: string }
): Promise<MetadataRoute.Sitemap> {
  const catalogModified = snapshot.generatedAt
  const rawId = props && 'id' in props ? props.id : undefined
  const sitemapId = rawId ? (typeof (rawId as any).then === 'function' ? await (rawId as Promise<string>) : (rawId as string)) : undefined

  if (sitemapId === 'core') {
    return [
      entry('/', knownPageDates.get('/'), 'daily', 1.0),
      entry('/free-svg-icons', catalogModified, 'daily', 0.9),
      entry('/icon-search', catalogModified, 'daily', 0.9),
      entry('/logo-maker', knownPageDates.get('/logo-maker'), 'weekly', 0.9),
      entry('/agents', knownPageDates.get('/agents'), 'weekly', 0.8),
      entry('/docs/agents', knownPageDates.get('/docs/agents'), 'weekly', 0.8),
      entry('/mcp-server', knownPageDates.get('/mcp-server'), 'weekly', 0.8),
      entry('/directory', catalogModified, 'weekly', 0.8),
      entry('/stats', knownPageDates.get('/stats'), 'weekly', 0.75),
      entry('/licenses', knownPageDates.get('/licenses'), 'monthly', 0.7),
      entry('/about', knownPageDates.get('/about'), 'monthly', 0.5),
      entry('/contact', knownPageDates.get('/contact'), 'monthly', 0.5),
      entry('/privacy-policy', knownPageDates.get('/privacy-policy'), 'monthly', 0.3),
      entry('/terms', knownPageDates.get('/terms'), 'monthly', 0.3),
    ]
  }

  if (sitemapId === 'categories') {
    return [
      entry('/categories', catalogModified, 'weekly', 0.9),
      ...CATEGORIES.map((cat) =>
        entry(`/categories/${encodeURIComponent(cat.slug)}`, catalogModified, 'weekly', 0.85)
      ),
    ]
  }

  if (sitemapId === 'frameworks') {
    return [
      entry('/react-icons', knownPageDates.get('/react-icons'), 'weekly', 0.85),
      entry('/nextjs-icons', knownPageDates.get('/nextjs-icons'), 'weekly', 0.85),
      entry('/tailwind-icons', knownPageDates.get('/tailwind-icons'), 'weekly', 0.85),
      entry('/vue-icons', knownPageDates.get('/vue-icons'), 'weekly', 0.8),
      entry('/svelte-icons', knownPageDates.get('/svelte-icons'), 'weekly', 0.8),
      entry('/typescript-icons', knownPageDates.get('/typescript-icons'), 'weekly', 0.8),
    ]
  }

  if (sitemapId === 'plugins') {
    return [
      entry('/figma-plugin', knownPageDates.get('/figma-plugin'), 'weekly', 0.8),
      entry('/vscode-extension', knownPageDates.get('/vscode-extension'), 'weekly', 0.8),
      entry('/chrome-extension', knownPageDates.get('/chrome-extension'), 'weekly', 0.8),
      entry('/framer-plugin', knownPageDates.get('/framer-plugin'), 'weekly', 0.75),
      entry('/webflow-extension', knownPageDates.get('/webflow-extension'), 'weekly', 0.75),
      entry('/canva-app', knownPageDates.get('/canva-app'), 'weekly', 0.75),
      entry('/adobe-plugin', knownPageDates.get('/adobe-plugin'), 'weekly', 0.75),
      entry('/obsidian-plugin', knownPageDates.get('/obsidian-plugin'), 'weekly', 0.75),
      entry('/penpot-plugin', knownPageDates.get('/penpot-plugin'), 'weekly', 0.75),
      entry('/raycast-extension', knownPageDates.get('/raycast-extension'), 'weekly', 0.75),
      entry('/jetbrains-plugin', knownPageDates.get('/jetbrains-plugin'), 'weekly', 0.75),
      entry('/tailwind-plugin', knownPageDates.get('/tailwind-plugin'), 'weekly', 0.75),
      entry('/storybook-addon', knownPageDates.get('/storybook-addon'), 'weekly', 0.75),
      entry('/shopify-extension', knownPageDates.get('/shopify-extension'), 'weekly', 0.75),
      entry('/sketch-plugin', knownPageDates.get('/sketch-plugin'), 'weekly', 0.75),
      entry('/wordpress-plugin', knownPageDates.get('/wordpress-plugin'), 'weekly', 0.8),
      entry('/powerpoint-addin', knownPageDates.get('/powerpoint-addin'), 'weekly', 0.8),
      entry('/google-slides-addon', knownPageDates.get('/google-slides-addon'), 'weekly', 0.8),
    ]
  }

  if (sitemapId === 'libraries') {
    return allLibraries.map((library) =>
      entry(`/icons/${encodeURIComponent(library.slug)}`, catalogModified, 'weekly', 0.85)
    )
  }

  // Fallback if sitemap() is called without ID (e.g. legacy flat sitemap)
  return [
    entry('/', knownPageDates.get('/'), 'daily', 1.0),
    entry('/free-svg-icons', catalogModified, 'daily', 0.9),
    entry('/icon-search', catalogModified, 'daily', 0.9),
    entry('/logo-maker', knownPageDates.get('/logo-maker'), 'weekly', 0.9),
    entry('/react-icons', knownPageDates.get('/react-icons'), 'weekly', 0.85),
    entry('/nextjs-icons', knownPageDates.get('/nextjs-icons'), 'weekly', 0.85),
    entry('/tailwind-icons', knownPageDates.get('/tailwind-icons'), 'weekly', 0.85),
    entry('/vue-icons', knownPageDates.get('/vue-icons'), 'weekly', 0.8),
    entry('/svelte-icons', knownPageDates.get('/svelte-icons'), 'weekly', 0.8),
    entry('/typescript-icons', knownPageDates.get('/typescript-icons'), 'weekly', 0.8),
    entry('/agents', knownPageDates.get('/agents'), 'weekly', 0.8),
    entry('/docs/agents', knownPageDates.get('/docs/agents'), 'weekly', 0.8),
    entry('/mcp-server', knownPageDates.get('/mcp-server'), 'weekly', 0.8),
    entry('/directory', catalogModified, 'weekly', 0.8),
    entry('/stats', knownPageDates.get('/stats'), 'weekly', 0.75),
    entry('/licenses', knownPageDates.get('/licenses'), 'monthly', 0.7),
    entry('/figma-plugin', knownPageDates.get('/figma-plugin'), 'weekly', 0.8),
    entry('/vscode-extension', knownPageDates.get('/vscode-extension'), 'weekly', 0.8),
    entry('/chrome-extension', knownPageDates.get('/chrome-extension'), 'weekly', 0.8),
    entry('/framer-plugin', knownPageDates.get('/framer-plugin'), 'weekly', 0.75),
    entry('/webflow-extension', knownPageDates.get('/webflow-extension'), 'weekly', 0.75),
    entry('/canva-app', knownPageDates.get('/canva-app'), 'weekly', 0.75),
    entry('/adobe-plugin', knownPageDates.get('/adobe-plugin'), 'weekly', 0.75),
    entry('/obsidian-plugin', knownPageDates.get('/obsidian-plugin'), 'weekly', 0.75),
    entry('/penpot-plugin', knownPageDates.get('/penpot-plugin'), 'weekly', 0.75),
    entry('/raycast-extension', knownPageDates.get('/raycast-extension'), 'weekly', 0.75),
    entry('/jetbrains-plugin', knownPageDates.get('/jetbrains-plugin'), 'weekly', 0.75),
    entry('/tailwind-plugin', knownPageDates.get('/tailwind-plugin'), 'weekly', 0.75),
    entry('/storybook-addon', knownPageDates.get('/storybook-addon'), 'weekly', 0.75),
    entry('/shopify-extension', knownPageDates.get('/shopify-extension'), 'weekly', 0.75),
    entry('/sketch-plugin', knownPageDates.get('/sketch-plugin'), 'weekly', 0.75),
    entry('/wordpress-plugin', knownPageDates.get('/wordpress-plugin'), 'weekly', 0.8),
    entry('/powerpoint-addin', knownPageDates.get('/powerpoint-addin'), 'weekly', 0.8),
    entry('/google-slides-addon', knownPageDates.get('/google-slides-addon'), 'weekly', 0.8),
    entry('/about', knownPageDates.get('/about'), 'monthly', 0.5),
    entry('/contact', knownPageDates.get('/contact'), 'monthly', 0.5),
    entry('/privacy-policy', knownPageDates.get('/privacy-policy'), 'monthly', 0.3),
    entry('/terms', knownPageDates.get('/terms'), 'monthly', 0.3),
    entry('/categories', catalogModified, 'weekly', 0.9),
    ...CATEGORIES.map((cat) =>
      entry(`/categories/${encodeURIComponent(cat.slug)}`, catalogModified, 'weekly', 0.85)
    ),
    ...allLibraries.map((library) =>
      entry(`/icons/${encodeURIComponent(library.slug)}`, catalogModified, 'weekly', 0.85)
    ),
  ]
}
