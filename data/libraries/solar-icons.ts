export const solarIconsData = {
  name: 'Solar Icons',
  tagline: 'An incredibly beautiful, modern, multi-style icon library featuring over 7,400 icons.',
  description: {
    intro: 'Solar Icons is a massive, visually stunning collection of open-source vector icons. It offers unique design variants, including outline, linear, bold, broken-line, and duotone styles.',
    detail: 'Designed by 480-design, Solar Icons has become highly popular for its beautiful modern line shapes and unique "broken-line" effect which adds a distinct architectural feel to any layout.',
    technical: 'Solar Icons is highly modular. The npm package offers simple tree-shaking support, letting you extract and package only the specific shapes your website imports.',
    verdict: 'If you want maximum flexibility in icon styles—especially duotone or broken line designs—Solar Icons is unmatched.'
  },
  links: {
    website: 'https://solaricons.com',
    github: 'https://github.com/480-design/solar-icons'
  },
  stats: {
    iconCount: 7400,
    stars: 450,
    weeklyDownloads: 3000,
    license: 'MIT',
    bundleSize: '1.5KB (Tree-shaken)',
    firstRelease: '2023'
  },
  installation: {
    react: {
      command: 'npm install solar-icon-set',
      note: 'Installs all styles (linear, outline, bold, duotone).'
    }
  },
  codeExamples: {
    reactBasic: `import { Home, Search } from 'solar-icon-set'

export default function App() {
  return (
    <div className="flex gap-4">
      <Home size={24} style="broken" />
      <Search size={24} style="duotone" />
    </div>
  )
}`,
    nextjsServer: `// Next.js App Router (Server Component)
import { Settings } from 'solar-icon-set'

export default function AppSettings() {
  return <Settings size={24} style="linear" />
}`
  },
  pros: [
    { title: 'Vast Selection', detail: 'Over 7,400 icons to choose from covering almost all domains.' },
    { title: 'Five Unique Styles', detail: 'Outline, linear, bold, broken, and duotone weights fit any visual theme.' },
    { title: 'Stunning Modern Aesthetics', detail: 'Unique broken styling stands out from conventional icon libraries.' }
  ],
  cons: [
    { title: 'Modular Setup Complexity', detail: 'Specifying styles inside react requires standard props config.' }
  ],
  whoShouldUse: [
    'Designers and developers who want a distinct, high-fidelity UI aesthetic.',
    'Projects requiring consistent style variants (e.g., solid active states vs outline default states).'
  ],
  whoShouldNot: [
    'Ultra-conservative or legacy enterprise software where standard classic shapes are preferred.'
  ],
  faqs: [
    {
      q: 'Does Solar Icons support duotone color themes?',
      a: 'Yes, the duotone variant uses multi-opacity paths, allowing you to easily adjust secondary colors using CSS or opacity props.'
    }
  ]
}
