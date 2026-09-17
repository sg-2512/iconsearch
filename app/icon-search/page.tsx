import { Suspense } from 'react'
import fs from 'fs'
import path from 'path'
import IconSearchClient from './IconSearchClient'
import { NAMED_LIBRARY_COUNT, SEARCHABLE_ICON_COUNT } from '../../data/library-catalog'
import { createPageMetadata, generateWebApplicationSchema } from '../../lib/seo'

const title = `SVG Icon Search Engine — Filter & Copy 355,000+ Icons | IconSearch`
const description = `Instantly search 355,000+ free vector SVG icons across 229 libraries. Filter by stroke, solid, duotone, or license. One-click React JSX and clean SVG export.`

export const metadata = createPageMetadata({
  title,
  description,
  path: '/icon-search',
  keywords: [
    'svg icon search engine',
    'find svg icons',
    'vector icon finder',
    'svg to jsx converter',
    'search open source icons',
    'filter icons by stroke',
    'duotone icons search',
    'react icon component search',
    'copy svg code',
    'online svg editor',
    'download vector icons',
    'free commercial svg icons',
  ],
})

export default async function IconSearchServerPage() {
  const webApplicationSchema = generateWebApplicationSchema({
    name: 'IconSearch Vector Icon Engine',
    description,
    path: '/icon-search',
    featureList: [
      'Universal 355,000+ vector SVG icon search',
      'Real-time color, stroke width, and size customization',
      'One-click React, Vue, Svelte, and TSX component export',
      'Multi-library search with 229 open-source icon sets',
      'Bulk batch download and workspace export collections',
    ],
  })

  // Pre-load popular initial data for SSR to avoid Google "empty layout box" penalty
  let initialData = undefined
  try {
    const filePath = path.join(process.cwd(), 'data', 'icon-search (1).json')
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const parsedData = JSON.parse(fileContents)
      
      // We only want the first 80 icons to keep HTML payload reasonable
      if (parsedData && Array.isArray(parsedData.icons)) {
        initialData = {
          ...parsedData,
          icons: parsedData.icons.slice(0, 80),
          limit: 80,
          page: 1,
        }
      }
    }
  } catch (error) {
    console.error('Failed to load initial icon data for SSR:', error)
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema).replace(/</g, '\\u003c'),
        }}
      />
      <header style={{ maxWidth: '1500px', margin: '0 auto', padding: '40px 48px 0' }}>
        <h1 style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '12px' }}>
          Search {SEARCHABLE_ICON_COUNT.toLocaleString('en-US')} Free SVG Icons
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '760px', lineHeight: 1.7 }}>
          Search, customize, and export icons from {NAMED_LIBRARY_COUNT} open-source libraries. Copy SVG or generate production-ready React, Vue, and Svelte code.
        </p>
      </header>
      <Suspense fallback={<div style={{ padding: '48px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)' }}>Booting Icon Engine...</div>}>
        <IconSearchClient initialData={initialData} />
      </Suspense>
    </>
  )
}

