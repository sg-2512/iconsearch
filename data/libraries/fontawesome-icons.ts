export const fontAwesomeIconsData = {
  name: 'Font Awesome',
  slug: 'font-awesome',
  tagline: "The internet's most popular icon library — 76,000+ GitHub stars, 1.8M weekly downloads",
  description: {
    intro:
      'Font Awesome is the world\'s most widely used icon library, powering icons on millions of websites since 2012. With over 76,000 GitHub stars and 1.8 million weekly npm downloads, it has defined the default icon language of the web for over a decade.',
    detail:
      'Version 6 is now Long Term Support (LTS) with 2,058 free icons across solid, regular, and brands styles. Version 7 is the latest active release with expanded icon coverage, improved tree-shaking, and better performance. The Pro plan unlocks 16,000+ icons across 10 styles including duotone, sharp, and thin variants.',
    technical:
      'Font Awesome splits into multiple npm packages: @fortawesome/fontawesome-svg-core for the rendering engine, separate packs for each style (free-solid-svg-icons, free-regular-svg-icons, free-brands-svg-icons), and @fortawesome/react-fontawesome for the React component. Full TypeScript support is included. Next.js requires one extra SSR setup step to prevent a flash of unstyled icons during hydration.',
    verdict:
      'Font Awesome is the safe, battle-tested choice — especially when you need brand icons (GitHub, Twitter, LinkedIn) or are maintaining a legacy codebase. For greenfield projects in 2026 that don\'t need brand logos, Lucide Icons offers a cleaner API, simpler installation, and a more modern aesthetic with fewer trade-offs.',
  },

  stats: {
    iconCount: 2058,
    stars: 76500,
    weeklyDownloads: 1874785,
    license: 'Mixed (CC BY 4.0 / MIT)',
    firstRelease: '2012',
    latestVersion: "6.7.2",
    bundleSize: '~7kb per icon',
    openIssues: 890,
  },

  installation: {
    react: {
      package: '@fortawesome/react-fontawesome',
      command: `npm install @fortawesome/fontawesome-svg-core
npm install @fortawesome/free-solid-svg-icons
npm install @fortawesome/free-regular-svg-icons
npm install @fortawesome/free-brands-svg-icons
npm install @fortawesome/react-fontawesome`,
    },
    nextjs: {
      package: '@fortawesome/react-fontawesome',
      command: `npm install @fortawesome/fontawesome-svg-core
npm install @fortawesome/free-solid-svg-icons
npm install @fortawesome/react-fontawesome`,
      note: 'Add these two lines to your root layout.tsx to prevent SSR flash: import \'@fortawesome/fontawesome-svg-core/styles.css\' and config.autoAddCss = false',
    },
    vue: {
      package: '@fortawesome/vue-fontawesome',
      command: `npm install @fortawesome/fontawesome-svg-core
npm install @fortawesome/free-solid-svg-icons
npm install @fortawesome/vue-fontawesome@latest`,
    },
    svelte: {
      package: 'N/A',
      command: `// No official Svelte package.
// Use SVG files directly from fontawesome.com or a community wrapper.`,
    },
    vanilla: {
      package: '@fortawesome/fontawesome-free',
      command: `npm install @fortawesome/fontawesome-free

// Or via CDN in HTML:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.x.x/css/all.min.css" />`,
    },
  },

  codeExamples: {
    basic: `import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faSearch, faCog } from '@fortawesome/free-solid-svg-icons'

export function NavBar() {
  return (
    <nav>
      <FontAwesomeIcon icon={faHome} />
      <FontAwesomeIcon icon={faSearch} />
      <FontAwesomeIcon icon={faCog} />
    </nav>
  )
}`,

    sizing: `// Using size prop (em-based)
<FontAwesomeIcon icon={faHome} size="xs" />   // 0.75em
<FontAwesomeIcon icon={faHome} size="sm" />   // 0.875em
<FontAwesomeIcon icon={faHome} />             // 1em (default)
<FontAwesomeIcon icon={faHome} size="lg" />   // 1.25em
<FontAwesomeIcon icon={faHome} size="xl" />   // 1.5em
<FontAwesomeIcon icon={faHome} size="2xl" />  // 2em

// Fixed width for aligned icon lists
<FontAwesomeIcon icon={faHome} fixedWidth />`,

    withTailwind: `import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faStar, faSpinner } from '@fortawesome/free-solid-svg-icons'

export function Examples() {
  return (
    <div className="flex items-center gap-4">
      {/* Color via Tailwind */}
      <FontAwesomeIcon icon={faHeart} className="text-red-500 h-5 w-5" />

      {/* Rotation */}
      <FontAwesomeIcon icon={faStar} rotation={90} className="text-yellow-400" />

      {/* Spin animation for loading */}
      <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500" />
    </div>
  )
}`,

    brandIcons: `import { faGithub, faTwitter, faLinkedin, faReact } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Brand icons — unique to Font Awesome among free libraries
export function SocialLinks() {
  return (
    <div className="flex gap-4">
      <FontAwesomeIcon icon={faGithub} className="h-6 w-6" />
      <FontAwesomeIcon icon={faTwitter} className="h-6 w-6 text-sky-400" />
      <FontAwesomeIcon icon={faLinkedin} className="h-6 w-6 text-blue-600" />
      <FontAwesomeIcon icon={faReact} className="h-6 w-6 text-cyan-400" />
    </div>
  )
}`,

    nextjsSSR: `// app/layout.tsx — REQUIRED for Next.js to prevent style flash
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

// This prevents Font Awesome from injecting CSS on the client
// during SSR hydration, which causes a brief flash of full-size icons.`,
  },

  pros: [
    {
      title: 'Most recognized icon library in the world',
      detail: 'Users already know these icons. 76,000+ GitHub stars and over a decade of dominance means your users have seen these icons everywhere — reducing cognitive friction.',
    },
    {
      title: '1.87M weekly npm downloads',
      detail: 'The largest install base of any icon library. Massive ecosystem of tutorials, Stack Overflow answers, and community support.',
    },
    {
      title: 'Brand icons included free',
      detail: '400+ company and social media logos (GitHub, Twitter, LinkedIn, Discord, etc.) are included in the free tier — unique among major icon libraries.',
    },
    {
      title: 'Multiple style variants',
      detail: 'Solid, regular, and brands styles free. Pro plan unlocks duotone, sharp, thin, and 7 more styles — the widest style coverage of any icon library.',
    },
    {
      title: 'Full TypeScript support',
      detail: 'Official React component ships with complete TypeScript definitions. All icon names are typed, providing autocomplete and preventing typos.',
    },
    {
      title: 'Works everywhere',
      detail: 'Official packages for React, Vue, Angular, Svelte, and vanilla HTML/CSS. One design language that works across any framework your team uses.',
    },
  ],

  cons: [
    {
      title: 'Multi-package installation is complex',
      detail: 'Requires 3–4 separate npm installs compared to a single package for Lucide or Heroicons. New developers frequently miss a package and get confusing errors.',
    },
    {
      title: 'Free tier limited to 2,058 icons',
      detail: 'Pro plan starts at $99/year to access 16,000+ icons. Tabler Icons offers 5,500+ icons completely free under MIT — more than double for no cost.',
    },
    {
      title: 'Icons are CC BY 4.0 — not MIT',
      detail: 'The icon SVG assets technically require attribution under CC BY 4.0. The code is MIT, but the icons themselves are not. Competitors like Lucide, Heroicons, and Tabler are fully MIT with zero attribution requirement.',
    },
    {
      title: 'Easy to accidentally import entire icon sets',
      detail: 'The library pattern (library.add(fas)) imports every icon and destroys tree-shaking, bloating bundle size. Requires deliberate per-icon imports to stay lean.',
    },
    {
      title: 'Older design aesthetic',
      detail: 'Font Awesome icons look less modern than Lucide, Heroicons, or Phosphor in 2026 UIs. The heavier, more detailed strokes can feel out of place in clean minimal interfaces.',
    },
    {
      title: 'Next.js requires manual SSR setup',
      detail: 'Without the config.autoAddCss = false fix in layout.tsx, icons flash to full size on first load. This is a known gotcha that trips up every new Next.js project.',
    },
  ],

  whoShouldUse: [
    'Projects that need brand/social media icons (GitHub, Twitter, LinkedIn) — Font Awesome is the only major free library with these',
    'Teams migrating or maintaining legacy codebases already using Font Awesome',
    'Projects that need Pro icon variants like duotone or sharp styles',
    'WordPress sites — Font Awesome has the best CMS plugin ecosystem',
    'Developers who need the widest possible icon vocabulary across solid and regular styles',
  ],

  whoShouldNot: [
    'New React or Next.js projects in 2026 — use Lucide Icons for a cleaner API and better tree-shaking',
    'Projects that need a fully MIT-licensed icon set with zero attribution concerns',
    'Teams that want single-package installation without multi-step setup',
    'Minimalist or modern UI projects where Font Awesome\'s heavier aesthetic clashes with the design',
    'Projects that need 5,000+ free icons — Tabler Icons provides more at no cost',
  ],

  faqs: [
    {
      q: 'Is Font Awesome free for commercial use?',
      a: 'Yes, with an important caveat. The JavaScript code is MIT licensed and free for commercial use without attribution. However the icon SVG assets are CC BY 4.0 licensed, which technically requires attribution. In practice most developers use Font Awesome commercially without attribution and the company does not enforce this aggressively. If you need fully clean MIT icons, Lucide, Heroicons, or Tabler Icons are better choices.',
    },
    {
      q: 'What is the difference between Font Awesome 6 and Font Awesome 7?',
      a: 'Font Awesome 6 is now Long Term Support (LTS) receiving critical bug fixes only. Font Awesome 7 is the current active release with expanded icon coverage, improved tree-shaking, and better performance. New projects should use Font Awesome 7. Existing projects on FA6 can stay on LTS or migrate.',
    },
    {
      q: 'Why does Font Awesome require multiple npm packages?',
      a: 'Font Awesome splits its library into separate packages by purpose: fontawesome-svg-core for the rendering engine, separate icon packs per style (solid, regular, brands), and react-fontawesome for the React wrapper. This lets you install only the styles you need, but in practice it makes setup more complex than single-package alternatives like Lucide.',
    },
    {
      q: 'How do I fix the Font Awesome flash of unstyled icons in Next.js?',
      a: 'Add two lines to your root layout.tsx: import \'@fortawesome/fontawesome-svg-core/styles.css\' and set config.autoAddCss = false. Without this, Font Awesome injects CSS on the client during hydration, causing icons to flash at full size before styling kicks in.',
    },
    {
      q: 'Should I use Font Awesome or Lucide Icons for a new React project in 2026?',
      a: 'For most new projects, Lucide Icons is the better default. It has a cleaner API, single-package installation, better tree-shaking, no attribution requirement, and a more modern design aesthetic. Choose Font Awesome specifically when you need brand icons (GitHub, Twitter, etc.) or are already invested in the FA ecosystem.',
    },
    {
      q: 'How do I migrate from Font Awesome 5 to Font Awesome 6 or 7?',
      a: 'Font Awesome provides an official upgrade guide at docs.fontawesome.com. The main changes are icon name updates and some removed icons. Run npm update @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome to upgrade packages, then fix any TypeScript errors flagging renamed icons.',
    },
  ],

  alternatives: ['lucide-icons', 'heroicons', 'tabler-icons', 'phosphor-icons'],

  links: {
    github: 'https://github.com/FortAwesome/Font-Awesome',
    website: 'https://fontawesome.com',
    npm: 'https://www.npmjs.com/package/@fortawesome/react-fontawesome',
    figma: 'https://www.figma.com/community/plugin/774202616885508874',
  },
}