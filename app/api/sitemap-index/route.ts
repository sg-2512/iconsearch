import { generateSitemaps } from '../../sitemap'
import { SITE_URL } from '../../../lib/seo'
import snapshot from '../../../data/icon-search.snapshot.json'

export const dynamic = 'force-static'
export const revalidate = 86400

export async function GET() {
  const segments = await generateSitemaps()
  const lastmod = snapshot.generatedAt || new Date().toISOString().split('T')[0]

  const sitemapsXml = segments
    .map(
      (s) => `  <sitemap>
    <loc>${SITE_URL}/sitemap/${s.id}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXml}
</sitemapindex>`

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
