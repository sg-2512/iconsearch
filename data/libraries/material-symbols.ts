export const materialSymbolsData = {
  name: 'Material Symbols',
  tagline: 'Google\'s newest variable icon set, consolidating outline, filled, rounded, and sharp options.',
  description: {
    intro: 'Material Symbols is Google\'s next-generation variable icon system, consolidating three styles (Rounded, Outlined, Sharp) and variable axes (Weight, Fill, Grade, Optical Size) into a single versatile library.',
    detail: 'It succeeds Material Icons, introducing cleaner lines, standardized proportions, and a variable font model that lets developers fine-tune visual weight dynamically via CSS.',
    technical: 'The `@material-symbols/svg-600` package provides optimized individual SVG vector layers, allowing you to bundle them without styling constraints.',
    verdict: 'As the official standard for modern Google products, Material Symbols is a state-of-the-art framework for digital products.'
  },
  links: {
    website: 'https://fonts.google.com/icons',
    github: 'https://github.com/google/material-design-icons'
  },
  stats: {
    iconCount: 3000,
    stars: 49000,
    weeklyDownloads: 80000,
    license: 'Apache 2.0',
    bundleSize: '1.1KB (Tree-shaken)',
    firstRelease: '2022'
  },
  installation: {
    react: {
      command: 'npm install @material-symbols/svg-600',
      note: 'Installs individual lightweight SVG vector structures.'
    }
  },
  codeExamples: {
    reactBasic: `import Home from '@material-symbols/svg-600/Home.svg'

export default function App() {
  return (
    <div>
      <img src={Home} alt="Home" width={24} height={24} />
    </div>
  )
}`,
    nextjsServer: `// Next.js App Router (Server Component)
import Settings from '@material-symbols/svg-600/Settings.svg'

export default function Config() {
  return <img src={Settings} alt="Settings" />
}`
  },
  pros: [
    { title: 'Variable Customization', detail: 'Adjust weights, optical sizes, and fill states on the fly.' },
    { title: 'Modern Upgrades', detail: 'Sleeker and better-proportioned vector shapes compared to classic Material Icons.' },
    { title: 'Universal recognition', detail: 'Built on Google\'s widely-recognized design language.' }
  ],
  cons: [
    { title: 'Variable Font Dev Loading', detail: 'Integrating variable font assets can require additional webpack loaders.' }
  ],
  whoShouldUse: [
    'Developers building cross-platform apps targeting Android, ChromeOS, or clean material layouts.'
  ],
  whoShouldNot: [
    'Aesthetic-heavy landing pages looking for decorative, non-standard duotone icons.'
  ],
  faqs: [
    {
      q: 'What is the difference between Material Icons and Material Symbols?',
      a: 'Material Symbols is the newer, variable vector successor to Material Icons. It features updated aesthetics, cleaner shapes, and supports variable axes like custom stroke weights.'
    }
  ]
}
