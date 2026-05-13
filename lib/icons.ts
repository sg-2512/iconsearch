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
    description: "A clean, consistent open-source icon library with 1400+ icons, forked from Feather Icons with active maintenance and TypeScript support.",
    website: "https://lucide.dev",
    github: "https://github.com/lucide-icons/lucide",
    npm: "lucide-react",
    stars: 12000,
    iconCount: 1400,
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
    description: "Beautiful hand-crafted SVG icons by the makers of Tailwind CSS. Available in outline and solid styles with 292 icons.",
    website: "https://heroicons.com",
    github: "https://github.com/tailwindlabs/heroicons",
    npm: "@heroicons/react",
    stars: 21000,
    iconCount: 292,
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
    description: "Over 5500 free MIT-licensed high-quality SVG icons. One of the largest free icon libraries available for web projects.",
    website: "https://tabler-icons.io",
    github: "https://github.com/tabler/tabler-icons",
    npm: "@tabler/icons-react",
    stars: 18000,
    iconCount: 5500,
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
    description: "Flexible icon family with 6 weights including thin, light, regular, bold, fill and duotone. Over 1200 icons available.",
    website: "https://phosphoricons.com",
    github: "https://github.com/phosphor-icons/react",
    npm: "@phosphor-icons/react",
    stars: 8000,
    iconCount: 1248,
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
    description: "Open-source neutral-style system symbols for designers and developers. Over 2800 icons in line and fill styles.",
    website: "https://remixicon.com",
    github: "https://github.com/Remix-Design/RemixIcon",
    npm: "remixicon",
    stars: 6000,
    iconCount: 2800,
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
    description: "Free, high quality, open source icon library with over 1800 icons. Designed by the Bootstrap team.",
    website: "https://icons.getbootstrap.com",
    github: "https://github.com/twbs/icons",
    npm: "bootstrap-icons",
    stars: 7000,
    iconCount: 1800,
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
    description: 'One package, 40,000+ icons. Aggregates Font Awesome, Material Design, Heroicons, Tabler, Feather, Bootstrap Icons, and 20+ more icon sets under a single unified React API.',
    website: 'https://react-icons.github.io/react-icons/',
    github: 'https://github.com/react-icons/react-icons',
    npm: 'react-icons',
    stars: 11500,
    iconCount: 40000,
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