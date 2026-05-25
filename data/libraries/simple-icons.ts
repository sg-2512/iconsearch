export const simpleIconsData = {
  name: 'Simple Icons',
  slug: 'simple-icons',
  tagline: '3,109 free SVG brand icons — GitHub, Stripe, Vercel, AWS, and every major brand in one CC0 library',
  description: {
    intro: 'Simple Icons is the definitive free library for SVG brand and company logos. With 3,109+ icons covering every major technology brand, social media platform, company, and developer tool, it is the go-to solution for anyone who needs to display brand logos in a web project. The library has 25,047 GitHub stars, an active maintenance community, and ships entirely under the CC0 license — making it public domain.',
    detail: 'Every icon in Simple Icons is monochromatic — a single-fill SVG in the brand\'s official primary color or black when no color is defined. Each icon entry in the library ships with the brand\'s official hex color code, the brand\'s name, the website URL, and licensing metadata. This makes it uniquely useful for building "Powered by" sections, technology stacks, social media link rows, sponsor grids, and any UI that needs to represent real-world brands visually.',
    technical: 'The core library (simple-icons npm package) ships the raw SVG data and can be used in any environment. The React wrapper (@icons-pack/react-simple-icons) provides typed React components for each icon with 364,000+ weekly downloads. Each component accepts color, size, and className props. TypeScript definitions are included. Tree-shaking works correctly since each icon is a separate named export. The library is actively maintained with new brand icons added regularly as companies request inclusion.',
    verdict: 'Simple Icons is the only correct answer when you need free brand SVG logos. There is no meaningful competition in this category at zero cost — Font Awesome Brands covers 465 brands vs Simple Icons\' 3,109, and Font Awesome requires payment for full coverage. If your project needs to display GitHub, Vercel, Stripe, AWS, Figma, Linear, or any of 3,100+ other brands, Simple Icons is the library. The only limitation worth noting is that all icons are monochromatic — brand colors are available as data but icons cannot render multi-color logos.'
  },
  stats: {
    iconCount: 3109,
    stars: 25047,
    weeklyDownloads: 364028,
    license: 'CC0 1.0 (public domain) — note: brand names and logos remain trademarks of their owners',
    firstRelease: '2014',
    latestVersion: '13.13.0',
    bundleSize: '~1KB per icon (tree-shaken)',
    openIssues: 767,
  },
  installation: {
    react: {
      package: '@icons-pack/react-simple-icons',
      command: 'npm install @icons-pack/react-simple-icons',
      yarn: 'yarn add @icons-pack/react-simple-icons',
      pnpm: 'pnpm add @icons-pack/react-simple-icons',
      note: 'Icon components are named with Si prefix: SiGithub, SiVercel, SiStripe, SiAws, etc.',
    },
    nextjs: {
      package: '@icons-pack/react-simple-icons',
      command: 'npm install @icons-pack/react-simple-icons',
      note: 'Works in Next.js Server Components — icons render as static SVG with no use client required. Full tree-shaking support with named imports.',
    },
    vue: {
      package: 'simple-icons',
      command: 'npm install simple-icons',
      note: 'No official Vue component package. Use the core simple-icons package and render SVG manually, or use via Iconify with the "simple-icons:" prefix.',
    },
    vanilla: {
      package: 'simple-icons',
      command: 'npm install simple-icons',
    },
  },
  codeExamples: {
    basic: `import { SiGithub, SiVercel, SiStripe, SiFigma } from '@icons-pack/react-simple-icons'

// All icons use 'Si' prefix + PascalCase brand name
export function TechStack() {
  return (
    <div className="flex items-center gap-4">
      <SiGithub size={24} />
      <SiVercel size={24} />
      <SiStripe size={24} />
      <SiFigma size={24} />
    </div>
  )
}`,
    withBrandColors: `import {
  SiGithub,
  SiVercel,
  SiStripe,
  SiReact,
  SiTypescript,
  SiNextdotjs
} from '@icons-pack/react-simple-icons'

// Each icon ships with its official brand color
// Access colors via the library's color data
import { siGithub, siVercel, siStripe } from 'simple-icons'

export function BrandedIcons() {
  return (
    <div className="flex gap-4">
      {/* Use official brand color */}
      <SiGithub size={32} color={\`#\${siGithub.hex}\`} />
      <SiVercel size={32} color={\`#\${siVercel.hex}\`} />
      <SiStripe size={32} color={\`#\${siStripe.hex}\`} />

      {/* Or use currentColor for theme-aware icons */}
      <SiReact size={32} />
      <SiTypescript size={32} />
      <SiNextdotjs size={32} />
    </div>
  )
}`,
    poweredBySection: `import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiVercel,
  SiPrisma,
  SiPostgresql
} from '@icons-pack/react-simple-icons'

// Classic "built with" or "powered by" section
export function TechStackSection() {
  const stack = [
    { icon: SiReact, name: 'React' },
    { icon: SiNextdotjs, name: 'Next.js' },
    { icon: SiTailwindcss, name: 'Tailwind CSS' },
    { icon: SiVercel, name: 'Vercel' },
    { icon: SiPrisma, name: 'Prisma' },
    { icon: SiPostgresql, name: 'PostgreSQL' },
  ]

  return (
    <section>
      <h3>Built with</h3>
      <div className="flex flex-wrap gap-6">
        {stack.map(({ icon: Icon, name }) => (
          <div key={name} className="flex items-center gap-2 text-gray-600">
            <Icon size={20} aria-hidden="true" />
            <span className="text-sm">{name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}`,
    socialLinks: `import { SiGithub, SiTwitter, SiLinkedin, SiYoutube } from '@icons-pack/react-simple-icons'

export function SocialLinks() {
  const links = [
    { icon: SiGithub, href: 'https://github.com/yourname', label: 'GitHub' },
    { icon: SiTwitter, href: 'https://twitter.com/yourname', label: 'Twitter' },
    { icon: SiLinkedin, href: 'https://linkedin.com/in/yourname', label: 'LinkedIn' },
    { icon: SiYoutube, href: 'https://youtube.com/@yourname', label: 'YouTube' },
  ]

  return (
    <nav aria-label="Social media links">
      {links.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          className="text-gray-500 hover:text-gray-900 transition-colors"
        >
          <Icon size={20} aria-hidden="true" />
        </a>
      ))}
    </nav>
  )
}`,
  },
  pros: [
    {
      title: '3,109 brand icons — the largest free brand library',
      detail: 'Font Awesome Free covers 465 brand icons. Simple Icons covers 3,109. For any project needing brand logos — technology stacks, integrations pages, sponsor grids, social links — Simple Icons has the icon Font Awesome does not, for free.',
    },
    {
      title: 'CC0 public domain — zero restrictions',
      detail: 'CC0 is the most permissive license that exists — it dedicates the work to the public domain. No attribution required, no license notices, no commercial restrictions, no viral clauses. Use in any product, any context, with zero obligations. Note: brand names and logos remain trademarks of their owners regardless of the SVG file\'s CC0 status.',
    },
    {
      title: 'Official brand colors included',
      detail: 'Every icon in Simple Icons ships with the brand\'s official verified hex color code accessible via the simple-icons npm package data. You can render SiStripe in Stripe\'s official purple (#635BFF) or SiAws in Amazon\'s official orange (#FF9900) without any manual color lookup.',
    },
    {
      title: 'Works in Server Components',
      detail: 'Icons render as static SVG HTML on the server with no client JavaScript required. Use Simple Icons in any Next.js Server Component without use client — they are purely presentational SVG elements.',
    },
    {
      title: 'Actively maintained with regular additions',
      detail: 'Simple Icons has an active contributor community that processes icon addition requests from companies and the public. New brands are added regularly and existing icons are updated when brands rebrand. 25,047 GitHub stars reflects years of consistent trust from the developer community.',
    },
  ],
  cons: [
    {
      title: 'Monochromatic only — no multi-color logos',
      detail: 'Every icon in Simple Icons is a single-fill SVG. Real brand logos are often multi-color (Google\'s four-color logo, Mastercard\'s overlapping circles, Slack\'s pinwheel). Simple Icons renders these as single-color approximations. For accurate multi-color brand logos you need SVGL or custom SVG assets.',
    },
    {
      title: 'Brand icons only — no UI icons',
      detail: 'Simple Icons is exclusively for brand and company logos. It has no home icon, no search icon, no user icon. You must use it alongside a UI icon library (Lucide, Heroicons, Tabler) — it is a supplement, not a replacement.',
    },
    {
      title: 'Trademark nuance — CC0 covers the SVG, not the brand right',
      detail: 'CC0 licenses the SVG file code. The trademark rights to each brand logo remain with the brand owner regardless of the SVG license. Using a brand\'s logo to imply endorsement, partnership, or to create confusion about the product\'s origin may violate trademark law even if the SVG file is technically CC0. Editorial and informational use is generally safe; marketing use requires care.',
    },
    {
      title: 'React package is community-maintained, not official',
      detail: '@icons-pack/react-simple-icons is a community wrapper — not maintained by the Simple Icons organization itself. The core simple-icons package is the official artifact. This is not a significant practical concern given the wrapper\'s 364,000+ weekly downloads and active maintenance, but worth knowing.',
    },
  ],
  whoShouldUse: [
    'Any project displaying brand or company logos — technology stacks, integration pages, sponsor grids, social media links',
    'Marketing pages that need to show "integrates with" or "trusted by" sections with recognizable brand icons',
    'Developer portfolio sites listing technologies and tools used',
    'Products where Font Awesome Brands does not have the specific brand icon needed',
    'Projects that want brand icons at zero cost with no attribution requirement',
  ],
  whoShouldNot: [
    'Projects that need accurate multi-color brand logos (use SVGL for colored SVGs)',
    'Projects looking for a general UI icon library — Simple Icons has no UI icons whatsoever',
    'Marketing materials that could imply endorsement or partnership without permission from the brand',
  ],
  faqs: [
    {
      q: 'Can I use Simple Icons commercially without attribution?',
      a: 'The SVG files are CC0 — public domain — so no attribution is required for the artwork. However, brand logos are trademarks of their respective owners regardless of the SVG license. CC0 covers the file, not the right to use the brand. For informational use (listing integrations, showing tech stack) this is generally fine. For marketing use that could imply endorsement, check the brand\'s logo usage guidelines.'
    },
    {
      q: 'How do I find the component name for a specific brand?',
      a: 'All React components use the Si prefix plus PascalCase brand name. GitHub → SiGithub. Next.js → SiNextdotjs. AWS → SiAws. Tailwind CSS → SiTailwindcss. For brands with special characters or numbers, check the official listing at simpleicons.org or the npm package exports. The package\'s TypeScript definitions provide autocomplete for all 3,109 names in VS Code.'
    },
    {
      q: 'Does Simple Icons have the brand icon I need?',
      a: 'With 3,109 icons covering virtually every major technology, social media, company, and developer tool, coverage is extensive. Search at simpleicons.org. If a brand is missing, you can open a GitHub issue to request it — the maintainers actively process requests. Major companies and well-known tools are typically added quickly.'
    },
    {
      q: 'Should I use Simple Icons or Font Awesome Brands?',
      a: 'Simple Icons for almost all use cases. It has 3,109 icons vs Font Awesome Brands\' 465, is CC0 (vs Font Awesome\'s CC BY 4.0 which technically requires attribution), and is free with no paid tier. Font Awesome Brands makes sense only if you are already using Font Awesome Pro and want everything in one library with consistent rendering infrastructure.'
    },
  ],
  alternatives: ['font-awesome', 'iconify', 'react-icons'],
  links: {
    github: 'https://github.com/simple-icons/simple-icons',
    website: 'https://simpleicons.org',
    npm: 'https://www.npmjs.com/package/@icons-pack/react-simple-icons',
    figma: '',
  },
}