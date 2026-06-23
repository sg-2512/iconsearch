export const boxIconsData = {
  name: 'BoxIcons',
  tagline: 'Simple vector icons carefully crafted for high-quality web layouts.',
  description: {
    intro: 'BoxIcons is a high-quality web icon library with 1,600+ icons designed to fit web page layouts. It features standard outline and filled themes, as well as a dedicated brand logo set.',
    detail: 'BoxIcons is highly popular for general-purpose design, providing a clean appearance that scales well on websites. It includes icons for web actions, media, e-commerce, and brands.',
    technical: 'The CSS package loads the icon assets using web fonts, while you can also import raw SVGs directly or use them dynamically via icon wrappers.',
    verdict: 'If you want a solid, reliable set of everyday web icons that includes clean brand logos, BoxIcons is a fantastic choice.'
  },
  links: {
    website: 'https://boxicons.com',
    github: 'https://github.com/atisawd/boxicons'
  },
  stats: {
    iconCount: 1600,
    stars: 1700,
    weeklyDownloads: 35000,
    license: 'CC BY 4.0',
    bundleSize: '1.0KB (Tree-shaken)',
    firstRelease: '2018'
  },
  installation: {
    react: {
      command: 'npm install boxicons',
      note: 'Imports CSS bundle styles into your application entrypoint.'
    }
  },
  codeExamples: {
    reactBasic: `import 'boxicons/css/boxicons.min.css'

export default function App() {
  return (
    <div className="flex gap-4">
      <i className='bx bx-home'></i>
      <i className='bx bxs-user'></i>
    </div>
  )
}`,
    nextjsServer: `// Next.js App Router (Server Component)
export default function Layout() {
  return <i className='bx bx-settings' />
}`
  },
  pros: [
    { title: 'Brand Logos Included', detail: 'Includes popular tech brand icons alongside standard UI shapes.' },
    { title: 'Clean Modern Proportions', detail: 'Consistent look and feel designed specifically for websites.' }
  ],
  cons: [
    { title: 'CC BY License Attribution', detail: 'Requires basic license compliance compared to standard MIT packages.' }
  ],
  whoShouldUse: [
    'Web developers needing a simple, fast icon pack that includes social/brand logos.'
  ],
  whoShouldNot: [
    'Enterprise products requiring complete MIT-licensed freedom with zero attribution limits.'
  ],
  faqs: [
    {
      q: 'Does BoxIcons require attribution?',
      a: 'BoxIcons is licensed under CC BY 4.0, which means you are free to share and adapt the icons as long as you provide appropriate credit to the creator.'
    }
  ]
}
