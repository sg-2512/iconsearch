export const mageIconsData = {
  name: 'Mage Icons',
  tagline: 'A beautifully clean, pixel-perfect icon set designed for modern web products.',
  description: {
    intro: 'Mage Icons is a modern, premium-quality open-source icon set designed for digital products. It features highly consistent vector symbols with clean geometries and precise paths.',
    detail: 'Mage Icons is built on a standard grid structure, offering excellent visual alignment. It is designed to work seamlessly in Figma designs and modern front-end developments.',
    technical: 'The package provides fully optimized vector SVGs, making them lightweight and extremely fast to load, whether rendered as raw SVGs or wrapped inside react components.',
    verdict: 'Mage Icons is a stellar choice if you are building modern software, consumer apps, or clean websites and want a fresh, modern aesthetic that stands out.'
  },
  links: {
    website: 'https://mageicons.com',
    github: 'https://github.com/mageicons/mage-icons'
  },
  stats: {
    iconCount: 1042,
    stars: 320,
    weeklyDownloads: 1500,
    license: 'MIT',
    bundleSize: '0.9KB (Tree-shaken)',
    firstRelease: '2022'
  },
  installation: {
    react: {
      command: 'npm install @mageicons/react',
      note: 'Compatible with React, Next.js, and Vite projects.'
    }
  },
  codeExamples: {
    reactBasic: `import { Home, Search } from '@mageicons/react'

export default function App() {
  return (
    <div className="flex gap-4 text-neutral-800">
      <Home size={24} />
      <Search size={24} />
    </div>
  )
}`,
    nextjsServer: `// Next.js App Router (Server Component)
import { Settings } from '@mageicons/react'

export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center p-4">
      <h1>Dashboard</h1>
      <Settings size={20} />
    </div>
  )
}`
  },
  pros: [
    { title: 'Modern Aesthetic', detail: 'Clean lines and modern curves optimized for contemporary software interfaces.' },
    { title: 'Highly Consistent', detail: 'Built on a strict grid structure with uniform stroke and fill dimensions.' },
    { title: 'Optimized Path Geometry', detail: 'No unnecessary points or messy overlapping vectors, keeping SVGs tiny.' }
  ],
  cons: [
    { title: 'Smaller Library Size', detail: 'With just over 1,000 icons, it is smaller than Tabler or Google Material.' }
  ],
  whoShouldUse: [
    'Developers and designers building modern, clean digital SaaS platforms.',
    'UI designers looking for pixel-perfect standard vectors.'
  ],
  whoShouldNot: [
    'Legacy applications needing an extremely vast vocabulary of hyper-specific icons.'
  ],
  faqs: [
    {
      q: 'Is Mage Icons free for commercial use?',
      a: 'Yes, Mage Icons is distributed under the MIT license, making it fully free for personal and commercial applications.'
    }
  ]
}
