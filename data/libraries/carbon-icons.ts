export const carbonIconsData = {
  name: 'Carbon Icons',
  tagline: 'IBM\'s official open-source design system icon set, optimized for high-density enterprise UIs.',
  description: {
    intro: 'Carbon Icons is the official icon package of IBM\'s Carbon Design System. It is built from the ground up for developer dashboards, cloud platforms, and data-dense enterprise applications.',
    detail: 'Carbon features highly technical, square-ended line vectors designed on a precise grid. It provides high legibility at tiny dimensions such as 16px and 20px, making it a standard choice for software dashboards.',
    technical: 'The official `@carbon/icons-react` package is highly optimized, fully tree-shakable, and includes robust TypeScript definitions for all icons.',
    verdict: 'If you are building professional cloud architectures, developer tools, or dense analytics packages, IBM\'s Carbon Icons is an ideal selection.'
  },
  links: {
    website: 'https://carbondesignsystem.com',
    github: 'https://github.com/carbon-design-system/carbon'
  },
  stats: {
    iconCount: 2000,
    stars: 8500,
    weeklyDownloads: 450000,
    license: 'Apache 2.0',
    bundleSize: '0.8KB (Tree-shaken)',
    firstRelease: '2018'
  },
  installation: {
    react: {
      command: 'npm install @carbon/icons-react',
      note: 'Includes full TypeScript typings.'
    }
  },
  codeExamples: {
    reactBasic: `import { Home, Settings } from '@carbon/icons-react'

export default function App() {
  return (
    <div className="flex gap-4">
      <Home size={24} />
      <Settings size={24} />
    </div>
  )
}`,
    nextjsServer: `// Next.js App Router (Server Component)
import { User } from '@carbon/icons-react'

export default function Profile() {
  return <User size={20} />
}`
  },
  pros: [
    { title: 'Data Density Optimization', detail: 'Looks exceptionally clean and sharp at very small grid scales (16x16).' },
    { title: 'IBM Enterprise Standard', detail: 'Maintained by IBM designers, ensuring long-term updates and stability.' },
    { title: 'TypeScript Support', detail: 'Fully typed components out-of-the-box.' }
  ],
  cons: [
    { title: 'Strictly Minimalist Style', detail: 'Lacks casual or playful curves, designed purely for formal SaaS applications.' }
  ],
  whoShouldUse: [
    'Developers building admin portals, system utilities, cloud control centers, or databases.'
  ],
  whoShouldNot: [
    'Consumer apps or landing pages looking for warm, curved, friendly, or color-filled graphics.'
  ],
  faqs: [
    {
      q: 'Are Carbon Icons open source?',
      a: 'Yes, Carbon Icons are licensed under the Apache 2.0 License, allowing full commercial use.'
    }
  ]
}
