import { staticPages } from '../data/static-pages'
import { icons } from '../lib/icons'
import { NAMED_LIBRARY_COUNT, SEARCHABLE_ICON_COUNT } from '../data/library-catalog'
import { createPageMetadata } from '../lib/seo'
import HomeExperience from './components/HomeExperience'

const title = `Free SVG Icons — 355,000+ Vector Icons for Commercial Use (React, Tailwind & Web)`
const description = `Search, customize, and download 355,000+ free SVG icons for commercial use from 229 open-source icon libraries. One-click export for React, Next.js, Vue, Svelte, and Tailwind CSS.`

export const metadata = createPageMetadata({
  title,
  description,
  path: '/',
  keywords: [
    'free svg icons',
    'vector icons free download',
    'open source icon library',
    'commercial use svg icons',
    'royalty free vector icons',
    'svg icon search engine',
    'download svg icons free',
    'ui icons set',
    'web vector icons',
    'lucide icons',
    'heroicons',
    'tabler icons',
    'phosphor icons',
    'material symbols',
    'copy svg',
    'svg to jsx',
  ],
})

export default function Home() {
  const allRecentItems = [...staticPages]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div suppressHydrationWarning>
      <HomeExperience initialLibraries={icons} recentItems={allRecentItems} />
    </div>
  )
}
