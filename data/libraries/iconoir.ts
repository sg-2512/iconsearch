export const iconoirData = {
  name: 'Iconoir',
  tagline: 'An open source icon library with 1,500+ premium line icons.',
  description: {
    intro: 'Iconoir is a high-quality, open-source library that has quickly become a favorite in the modern React and Figma communities. Featuring over 1,500 meticulously crafted icons, it offers a consistent, premium line-art style that feels incredibly sleek and modern.',
    detail: 'Unlike older libraries, Iconoir is designed entirely on a consistent grid with a unified stroke weight, making it highly suitable for modern SaaS, dashboard, and marketing applications. It supports React, React Native, Vue, SolidJS, and even Flutter out of the box with official packages.',
    technical: 'The React package (`iconoir-react`) is fully tree-shakable and provides excellent TypeScript definitions. Every icon can be customized via props for stroke width, color, and size, ensuring they blend seamlessly into your design system.',
    verdict: 'If you want a modern, high-end alternative to Lucide or Feather that looks premium but remains completely free (MIT licensed), Iconoir is one of the absolute best choices available in 2026.'
  },
  links: {
    website: 'https://iconoir.com',
    github: 'https://github.com/iconoir-icons/iconoir'
  },
  stats: {
    iconCount: 1530,
    stars: 5200,
    weeklyDownloads: 200000,
    license: 'MIT',
    bundleSize: '1.2KB (Tree-shaken)',
    firstRelease: '2020'
  },
  installation: {
    react: {
      command: 'npm install iconoir-react',
      note: 'Also works with Next.js (Server and Client components).'
    },
    vue: {
      command: 'npm install iconoir-vue'
    },
    css: {
      command: 'npm install iconoir',
      note: 'For vanilla CSS files.'
    }
  },
  codeExamples: {
    reactBasic: `import { Camera, Search } from 'iconoir-react'

export default function App() {
  return (
    <div className="flex gap-4 text-blue-500">
      <Camera 
        color="currentColor" 
        strokeWidth={1.5} 
        width={24} 
        height={24} 
      />
      <Search />
    </div>
  )
}`,
    nextjsServer: `// Next.js App Router (Server Component)
import { User } from 'iconoir-react'

export default function ProfileHeader() {
  // Iconoir works perfectly in server components out of the box
  return (
    <header className="flex items-center gap-2">
      <User className="h-6 w-6" strokeWidth={2} />
      <h2>User Profile</h2>
    </header>
  )
}`
  },
  pros: [
    { title: 'Premium Design', detail: 'Incredibly consistent, premium aesthetic that rivals paid libraries.' },
    { title: 'Wide Framework Support', detail: 'Official support for React, Vue, React Native, SolidJS, and Flutter.' },
    { title: 'Highly Customizable', detail: 'Change stroke width, color, and size natively via props.' },
    { title: 'Figma Integration', detail: 'Excellent official Figma plugin for design synchronization.' }
  ],
  cons: [
    { title: 'Line Style Only', detail: 'Does not offer solid, filled, or duotone variants out of the box.' },
    { title: 'No Brand Icons', detail: 'Does not include social media or technology logos.' }
  ],
  whoShouldUse: [
    'SaaS developers looking for a clean, modern aesthetic.',
    'Teams using React Native or Flutter alongside React web apps.',
    'Projects requiring highly consistent line-weight scaling.'
  ],
  whoShouldNot: [
    'Projects requiring filled or duotone icon styles.',
    'Sites that heavily rely on bundled brand/social icons.'
  ],
  faqs: [
    {
      q: 'Does Iconoir support Next.js App Router?',
      a: 'Yes! Iconoir works perfectly in Next.js Server Components out of the box with zero configuration required.'
    },
    {
      q: 'Can I change the stroke width of Iconoir icons?',
      a: 'Absolutely. The React package accepts a strokeWidth prop (default is 1.5) allowing you to seamlessly scale the visual weight of the icons.'
    },
    {
      q: 'Is Iconoir completely free for commercial use?',
      a: 'Yes. Iconoir is licensed under the MIT License, which means it is 100% free for personal, commercial, and enterprise usage with no strict attribution required.'
    }
  ]
}
