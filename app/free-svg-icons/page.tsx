import { allLibraries, NAMED_LIBRARY_COUNT, SEARCHABLE_ICON_COUNT } from '../../data/library-catalog'
import { createPageMetadata } from '../../lib/seo'
import { getDynamicYear } from '../../lib/date'
import BrowsePageClient from './BrowsePageClient'

export function generateMetadata() {
  const year = getDynamicYear()
  return createPageMetadata({
    title: `229 Best Free SVG Icon Libraries (${year}) — Open-Source Packs | IconSearch`,
    description: `Explore the complete catalog of 229 open-source SVG icon libraries in ${year}. Compare icon counts, licenses (MIT, Apache, CC0), and download packs for web and UI design.`,
    path: '/free-svg-icons',
    keywords: [
      'free svg icon libraries',
      'best open source icon packs',
      'vector icon collections',
      'icon library list',
      'lucide vs heroicons',
      'tabler icons download',
      'material symbols open source',
      'feather icons alternative',
      'commercial use icon packs',
      'mit licensed icons',
      'ui icon collections',
      'open source svg sets',
    ],
  })
}

export default function FreeSvgIconsPage() {
  return (
    <main>
      <BrowsePageClient libraries={allLibraries} totalIconCount={SEARCHABLE_ICON_COUNT} />
    </main>
  )
}
