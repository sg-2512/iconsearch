export type IconLibrary = {
  name: string
  slug: string
  description: string
  website: string
  github: string
  npm: string
  stars: number
  iconCount: number
  license: string
  frameworks: string[]
  style: string[]
  figmaPlugin: boolean
  typescript: boolean
  treeshakable: boolean
  pros: string[]
  cons: string[]
  installCommand: string
  usageExample: string
}

export const icons: IconLibrary[] = [
  {
    name: "Lucide Icons",
    slug: "lucide-icons",
    description: "A clean, consistent open-source icon library with 1900+ icons, forked from Feather Icons with active maintenance and TypeScript support.",
    website: "https://lucide.dev",
    github: "https://github.com/lucide-icons/lucide",
    npm: "lucide-react",
    stars: 12000,
    iconCount: 1959,
    license: "ISC",
    frameworks: ["react", "vue", "svelte", "nextjs"],
    style: ["outline"],
    figmaPlugin: true,
    typescript: true,
    treeshakable: true,
    pros: ["Actively maintained", "Consistent style", "TypeScript support", "Tree-shakable"],
    cons: ["Outline only", "No filled variant"],
    installCommand: "npm install lucide-react",
    usageExample: "import { Home } from 'lucide-react'\n\nexport default function App() {\n  return <Home size={24} />\n}"
  },
  {
    name: "Heroicons",
    slug: "heroicons",
    description: "Beautiful hand-crafted SVG icons by the makers of Tailwind CSS. Available in outline and solid styles with 324 icons.",
    website: "https://heroicons.com",
    github: "https://github.com/tailwindlabs/heroicons",
    npm: "@heroicons/react",
    stars: 21000,
    iconCount: 324,
    license: "MIT",
    frameworks: ["react", "vue", "nextjs"],
    style: ["outline", "solid", "mini"],
    figmaPlugin: true,
    typescript: true,
    treeshakable: true,
    pros: ["Made by Tailwind team", "Multiple styles", "High quality"],
    cons: ["Only 292 icons", "Limited framework support"],
    installCommand: "npm install @heroicons/react",
    usageExample: "import { HomeIcon } from '@heroicons/react/24/outline'\n\nexport default function App() {\n  return <HomeIcon className='h-6 w-6' />\n}"
  },
  {
    name: "Tabler Icons",
    slug: "tabler-icons",
    description: "Over 6100 free MIT-licensed high-quality SVG icons. One of the largest free icon libraries available for web projects.",
    website: "https://tabler-icons.io",
    github: "https://github.com/tabler/tabler-icons",
    npm: "@tabler/icons-react",
    stars: 18000,
    iconCount: 6146,
    license: "MIT",
    frameworks: ["react", "vue", "svelte", "nextjs"],
    style: ["outline", "filled"],
    figmaPlugin: true,
    typescript: true,
    treeshakable: true,
    pros: ["Largest collection", "Both outline and filled", "Very consistent"],
    cons: ["Large package if not tree-shaken"],
    installCommand: "npm install @tabler/icons-react",
    usageExample: "import { IconHome } from '@tabler/icons-react'\n\nexport default function App() {\n  return <IconHome size={24} />\n}"
  },
  {
    name: "Phosphor Icons",
    slug: "phosphor-icons",
    description: "Flexible icon family with 6 weights including thin, light, regular, bold, fill and duotone. Over 1500 icons available.",
    website: "https://phosphoricons.com",
    github: "https://github.com/phosphor-icons/react",
    npm: "@phosphor-icons/react",
    stars: 8000,
    iconCount: 1533,
    license: "MIT",
    frameworks: ["react", "vue", "nextjs"],
    style: ["thin", "light", "regular", "bold", "fill", "duotone"],
    figmaPlugin: true,
    typescript: true,
    treeshakable: true,
    pros: ["6 weight variants", "Duotone support", "Large collection"],
    cons: ["Heavier package size"],
    installCommand: "npm install @phosphor-icons/react",
    usageExample: "import { House } from '@phosphor-icons/react'\n\nexport default function App() {\n  return <House size={24} weight='duotone' />\n}"
  },
  {
    name: "Remix Icon",
    slug: "remix-icon",
    description: "Open-source neutral-style system symbols for designers and developers. Over 3200 icons in line and fill styles.",
    website: "https://remixicon.com",
    github: "https://github.com/Remix-Design/RemixIcon",
    npm: "remixicon",
    stars: 6000,
    iconCount: 3229,
    license: "Apache 2.0",
    frameworks: ["react", "vue", "nextjs"],
    style: ["line", "fill"],
    figmaPlugin: false,
    typescript: false,
    treeshakable: false,
    pros: ["2800+ icons", "Both line and fill", "Free for commercial use"],
    cons: ["No TypeScript", "Not tree-shakable"],
    installCommand: "npm install remixicon",
    usageExample: "import 'remixicon/fonts/remixicon.css'\n\nexport default function App() {\n  return <i className='ri-home-line'></i>\n}"
  },
  {
    name: "Feather Icons",
    slug: "feather-icons",
    description: "Simply beautiful open source icons designed on a 24x24 grid with an emphasis on simplicity, consistency and readability.",
    website: "https://feathericons.com",
    github: "https://github.com/feathericons/feather",
    npm: "react-feather",
    stars: 24000,
    iconCount: 287,
    license: "MIT",
    frameworks: ["react", "nextjs"],
    style: ["outline"],
    figmaPlugin: false,
    typescript: false,
    treeshakable: true,
    pros: ["Minimal and clean", "Lightweight", "High GitHub stars"],
    cons: ["No longer maintained", "Only 287 icons", "No TypeScript"],
    installCommand: "npm install react-feather",
    usageExample: "import { Home } from 'react-feather'\n\nexport default function App() {\n  return <Home size={24} />\n}"
  },
  {
    name: "Bootstrap Icons",
    slug: "bootstrap-icons",
    description: "Free, high quality, open source icon library with over 2000 icons. Designed by the Bootstrap team.",
    website: "https://icons.getbootstrap.com",
    github: "https://github.com/twbs/icons",
    npm: "bootstrap-icons",
    stars: 7000,
    iconCount: 2078,
    license: "MIT",
    frameworks: ["react", "vue", "nextjs"],
    style: ["outline", "filled"],
    figmaPlugin: true,
    typescript: false,
    treeshakable: false,
    pros: ["1800+ icons", "Both styles", "Backed by Bootstrap team"],
    cons: ["No TypeScript", "Not tree-shakable"],
    installCommand: "npm install bootstrap-icons",
    usageExample: "import 'bootstrap-icons/font/bootstrap-icons.css'\n\nexport default function App() {\n  return <i className='bi bi-house'></i>\n}"
  },
  {
    name: "Radix Icons",
    slug: "radix-icons",
    description: "A crisp set of 15x15 icons designed by the WorkOS team. Perfectly sized for dense UIs and dashboards.",
    website: "https://radix-ui.com/icons",
    github: "https://github.com/radix-ui/icons",
    npm: "@radix-ui/react-icons",
    stars: 5000,
    iconCount: 318,
    license: "MIT",
    frameworks: ["react", "nextjs"],
    style: ["outline"],
    figmaPlugin: true,
    typescript: true,
    treeshakable: true,
    pros: ["Perfect for dense UIs", "TypeScript support", "Made by Radix team"],
    cons: ["Only 318 icons", "15x15 fixed size only"],
    installCommand: "npm install @radix-ui/react-icons",
    usageExample: "import { HomeIcon } from '@radix-ui/react-icons'\n\nexport default function App() {\n  return <HomeIcon />\n}"
  },
  {
    name: 'Font Awesome',
    slug: 'font-awesome',
    description: 'The internet\'s most popular icon library with 2,000+ free icons and 16,000+ Pro icons. Used by millions of websites worldwide. Available as SVG components for React with the official @fortawesome/react-fontawesome package.',
    website: 'https://fontawesome.com',
    github: 'https://github.com/FortAwesome/Font-Awesome',
    npm: 'https://www.npmjs.com/package/@fortawesome/react-fontawesome',
    stars: 76500,
    iconCount: 2058,
    license: 'Mixed (CC BY 4.0 free icons, MIT code)',
    frameworks: ['react', 'vue', 'angular', 'svelte'],
    style: ['solid', 'regular', 'light', 'thin', 'duotone', 'brands'],
    figmaPlugin: true,
    typescript: true,
    treeshakable: true,
    pros: ["Extensive Library","Infinite Scalability","CSS Customization","Ease of Integration","Accessibility-Minded"],
    cons:["Performance Overhead","Licensing Costs","Rendering Issues","Size Inconsistencies","Design Sameness"],
    installCommand: 'npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome',
    usageExample: "<FontAwesomeIcon icon={faHome} />",
  },

  {
    name: 'React Icons',
    slug: 'react-icons',
    description: 'One package, 52,000+ icons. Aggregates Font Awesome, Material Design, Heroicons, Tabler, Feather, Bootstrap Icons, and 20+ more icon sets under a single unified React API.',
    website: 'https://react-icons.github.io/react-icons/',
    github: 'https://github.com/react-icons/react-icons',
    npm: 'react-icons',
    stars: 11500,
    iconCount: 52000,
    license: 'MIT',
    frameworks: ['react', 'nextjs'],
    style: ['outline', 'filled', 'duotone', 'brands'],
    figmaPlugin: false,
    typescript: true,
    treeshakable: true,
    pros: [
      'One package replaces 25+ separate installs',
      '40,000+ icons — largest vocabulary available',
      'Unified API across all included sets',
      'Full TypeScript support',
    ],
    cons: [
      'No consistent visual identity — mixing sets looks inconsistent',
      'Heavy node_modules footprint',
      'Not a library — a wrapper around other libraries',
    ],
    installCommand: 'npm install react-icons',
    usageExample: "import { FaHome } from 'react-icons/fa'\nimport { MdSettings } from 'react-icons/md'\nimport { HiUser } from 'react-icons/hi'\n\nexport default function App() {\n  return (\n    <div>\n      <FaHome size={24} />\n      <MdSettings size={24} />\n      <HiUser size={24} />\n    </div>\n  )\n}",
  },

  {
    name: 'Material Icons',
    slug: 'material-icons',
    description: "Google's official Material Design icon library for React. 2,100+ icons across 5 styles — Filled, Outlined, Rounded, Sharp, and TwoTone. The most downloaded React icon package with 5.1M weekly npm installs. Requires @mui/material as a peer dependency.",
    website: 'https://mui.com/material-ui/material-icons/',
    github: 'https://github.com/mui/material-ui/tree/master/packages/mui-icons-material',
    npm: '@mui/icons-material',
    stars: 98300,
    iconCount: 2100,
    license: 'MIT',
    frameworks: ['react', 'nextjs'],
    style: ['filled', 'outlined', 'rounded', 'sharp', 'twotone'],
    figmaPlugin: true,
    typescript: true,
    treeshakable: true,
    pros: [
      '5 style variants per icon — Filled, Outlined, Rounded, Sharp, TwoTone from one package',
      'Most downloaded React icon package — 5.1M weekly npm installs, 98K GitHub stars',
      'Native MUI integration — sx prop, theme color tokens, fontSize scale all work out of the box',
      "Google's official Material Design visual language — recognized by billions of Android and web users",
      'Works in Next.js Server Components — renders static SVG HTML with no use client required',
      'Full TypeScript support — SvgIconProps type covers sx, color, fontSize, and className',
    ],
    cons: [
      'Requires 3 peer dependencies — @mui/material, @emotion/styled, @emotion/react (~300KB gzip if not on MUI)',
      'Named barrel imports are up to 6x slower in Vite/webpack dev mode — path imports required',
      'React only — no official Vue, Svelte, or vanilla JS packages',
      'Material Design aesthetic reads as Google/Android — not ideal for minimal modern SaaS UIs',
      'No stroke width customization — must switch variants to change visual weight',
      'Material Symbols (the successor) is not yet supported by @mui/icons-material',
    ],
    installCommand: 'npm install @mui/icons-material @mui/material @emotion/styled @emotion/react',
    usageExample: "import HomeIcon from '@mui/icons-material/Home'\nimport HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'\nimport SearchIcon from '@mui/icons-material/Search'\nimport DeleteIcon from '@mui/icons-material/Delete'\n\n// ✅ Path imports — up to 6x faster in dev than barrel imports\n// ❌ Avoid: import { HomeIcon } from '@mui/icons-material'\n\nexport default function App() {\n  return (\n    <div>\n      {/* Filled — bold, solid, for primary actions */}\n      <HomeIcon />\n\n      {/* Outlined — minimal stroke-style, for supporting UI */}\n      <HomeOutlinedIcon />\n\n      {/* Sizing via fontSize prop */}\n      <SearchIcon fontSize=\"small\" />   {/* 20px */}\n      <SearchIcon fontSize=\"medium\" />  {/* 24px default */}\n      <SearchIcon fontSize=\"large\" />   {/* 35px */}\n      <SearchIcon sx={{ fontSize: 48 }} />\n\n      {/* Color via MUI theme tokens or custom hex */}\n      <DeleteIcon color=\"error\" />\n      <DeleteIcon sx={{ color: '#6366f1' }} />\n    </div>\n  )\n}",
  },

  // ── Iconify ───────────────────────────────────────────────────────────────────
  {
    name: 'Iconify',
    slug: 'iconify',
    description: 'One framework, 350,000+ icons across 211 open source icon sets. Access Lucide, Material Design, Font Awesome, Tabler, Heroicons, Phosphor, Bootstrap Icons, Simple Icons, and 200+ more through one unified <Icon> component with a prefix:name syntax. Official packages for React, Vue, Svelte, SolidJS, and vanilla HTML.',
    website: 'https://iconify.design',
    github: 'https://github.com/iconify/iconify',
    npm: '@iconify/react',
    stars: 5162,
    iconCount: 350000,
    license: 'MIT (framework) — icon sets retain their original licenses',
    frameworks: ['react', 'nextjs', 'vue', 'svelte'],
    style: ['outline', 'filled', 'duotone', 'brands', 'any'],
    figmaPlugin: true,
    typescript: true,
    treeshakable: true,
    pros: [
      '350,000+ icons from 211 sets through one component — Lucide, MDI, Font Awesome, Tabler and more',
      'Zero bundle cost in API mode — only the 15KB renderer ships, icon data loads on demand',
      'Official packages for React, Vue, Svelte, SolidJS, Angular, and vanilla HTML web component',
      'Unified prefix:name syntax — "lucide:home", "mdi:account", "fa6-solid:house" — one API for all sets',
      'All 211 icon sets automatically kept up to date without npm package updates',
      'Iconify Figma plugin lets designers browse all sets and export icon names for developers',
    ],
    cons: [
      'API mode does not work in Next.js Server Components — offline mode with addCollection() setup required',
      'API dependency in default mode — icons fail silently if Iconify CDN is unavailable',
      'Mixed icon licenses across 211 sets — each set must be verified individually for commercial use',
      'No single visual identity — mixing sets creates inconsistency without strict design discipline',
      'Lower GitHub stars (5K) relative to download count — thinner community resources than Lucide or Font Awesome',
      'Offline mode setup adds friction — requires @iconify-json/* packages and addCollection() calls',
    ],
    installCommand: 'npm install @iconify/react',
    usageExample: "import { Icon } from '@iconify/react'\n\n// Access 350,000+ icons with one component\n// Format: prefix:icon-name\nexport default function App() {\n  return (\n    <div>\n      {/* Lucide Icons */}\n      <Icon icon=\"lucide:home\" width={24} height={24} />\n\n      {/* Material Design Icons */}\n      <Icon icon=\"mdi:account-circle\" width={24} />\n\n      {/* Font Awesome Solid */}\n      <Icon icon=\"fa6-solid:house\" width={20} />\n\n      {/* Simple Icons (brand logos) */}\n      <Icon icon=\"simple-icons:github\" width={24} />\n\n      {/* With color and className */}\n      <Icon icon=\"lucide:bell\" className=\"h-5 w-5 text-gray-500\" />\n      <Icon icon=\"mdi:check-circle\" color=\"#4ade80\" width={20} />\n    </div>\n  )\n}",
  },

// ── Simple Icons ──────────────────────────────────────────────────────────────
  {
    name: 'Simple Icons',
    slug: 'simple-icons',
    description: '3,200 free SVG brand icons for every major technology company, social platform, and developer tool. GitHub, Stripe, Vercel, AWS, Figma, Linear, and thousands more. CC0 public domain — no attribution required. The largest free brand icon library available, with 25K GitHub stars and official brand colors included for every icon.',
    website: 'https://simpleicons.org',
    github: 'https://github.com/simple-icons/simple-icons',
    npm: '@icons-pack/react-simple-icons',
    stars: 25047,
    iconCount: 3200,
    license: 'CC0 1.0 (Public Domain)',
    frameworks: ['react', 'nextjs'],
    style: ['filled'],
    figmaPlugin: false,
    typescript: true,
    treeshakable: true,
    pros: [
      '3,109 brand icons — 6x more than Font Awesome Brands (465) at zero cost',
      'CC0 public domain — no attribution required, no license notices, use in any commercial project',
      'Official brand hex colors included — render SiStripe in #635BFF, SiGithub in #181717 with one prop',
      'Works in Next.js Server Components — renders static SVG HTML with no use client required',
      'Full TypeScript support — all 3,109 Si-prefixed components are typed with full VS Code autocomplete',
      'Actively maintained — new brand icons added regularly, existing icons updated on rebrands',
    ],
    cons: [
      'Brand icons only — no UI icons whatsoever, must pair with Lucide or Heroicons for product UI',
      'Monochromatic only — all icons are single-fill SVG, no multi-color logos (Google, Mastercard)',
      'React package (@icons-pack/react-simple-icons) is community-maintained, not by Simple Icons org',
      'CC0 covers the SVG file, not trademark rights — brand logos remain trademarks of their owners',
      'No Vue, Svelte or vanilla package — use core simple-icons package with manual SVG rendering',
    ],
    installCommand: 'npm install @icons-pack/react-simple-icons',
    usageExample: "import {\n  SiGithub,\n  SiVercel,\n  SiStripe,\n  SiReact,\n  SiNextdotjs,\n  SiTailwindcss,\n} from '@icons-pack/react-simple-icons'\n// All components use 'Si' prefix + PascalCase brand name\n\nexport function TechStack() {\n  return (\n    <div className=\"flex items-center gap-4\">\n      {/* Use currentColor — inherits from parent */}\n      <SiGithub size={24} />\n      <SiVercel size={24} />\n\n      {/* Use official brand color */}\n      <SiStripe size={24} color=\"#635BFF\" />\n      <SiReact size={24} color=\"#61DAFB\" />\n\n      {/* Social links row */}\n      <a href=\"https://github.com\" aria-label=\"GitHub\">\n        <SiGithub size={20} className=\"text-gray-600 hover:text-gray-900\" />\n      </a>\n    </div>\n  )\n}",
  },
  
  // ── Iconoir ──────────────────────────────────────────────────────────────────
  {
    name: 'Iconoir',
    slug: 'iconoir',
    description: 'A high-quality, open-source icon library featuring over 1,500 meticulously crafted line icons. Highly consistent, premium aesthetic perfect for modern UIs.',
    website: 'https://iconoir.com',
    github: 'https://github.com/iconoir-icons/iconoir',
    npm: 'iconoir-react',
    stars: 5200,
    iconCount: 1530,
    license: 'MIT',
    frameworks: ['react', 'nextjs', 'vue', 'solid'],
    style: ['outline'],
    figmaPlugin: true,
    typescript: true,
    treeshakable: true,
    pros: [
      'Incredibly consistent, premium aesthetic that rivals paid libraries.',
      'Wide framework support including React Native and Flutter.',
      'Highly customizable stroke widths.',
      'Excellent Figma plugin synchronization.'
    ],
    cons: [
      'Line style only — no filled or duotone variants.',
      'Does not include brand/social media icons.'
    ],
    installCommand: 'npm install iconoir-react',
    usageExample: "import { Camera, Search } from 'iconoir-react'\n\nexport default function App() {\n  return (\n    <div className=\"flex gap-4 text-blue-500\">\n      <Camera color=\"currentColor\" strokeWidth={1.5} />\n      <Search />\n    </div>\n  )\n}",
  },

]

export function getIconBySlug(slug: string) {
  return icons.find((i) => i.slug === slug)
}

export function getComparisonPairs() {
  const pairs: [IconLibrary, IconLibrary][] = []
  for (let i = 0; i < icons.length; i++) {
    for (let j = i + 1; j < icons.length; j++) {
      pairs.push([icons[i], icons[j]])
    }
  }
  return pairs
}