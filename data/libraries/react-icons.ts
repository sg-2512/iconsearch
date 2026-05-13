export const reactIconsData = {
  name: 'React Icons',
  slug: 'react-icons',
  tagline: 'One package, 40,000+ icons — aggregates Font Awesome, Material Design, Heroicons, and 25+ more',
  description: {
    intro:
      'React Icons is the Swiss Army knife of icon libraries. Rather than being a standalone icon set, it bundles 25+ of the most popular icon libraries — Font Awesome, Material Design, Heroicons, Bootstrap Icons, Feather, Ionicons, and more — into a single npm package with one unified API.',
    detail:
      'Every icon set is accessible via a short prefix: fa for Font Awesome, md for Material Design, hi for Heroicons, bs for Bootstrap Icons, fi for Feather, and so on. This means you can mix icons from completely different libraries in the same project without installing multiple packages or learning multiple APIs. With over 40,000 icons across 25+ sets, you will never run out of choices.',
    technical:
      'React Icons uses ES6 named imports, so each icon is a separate export and tree-shaking works automatically — only the icons you import end up in your bundle. Every icon is a React component that accepts size, color, className, style, and title props. The library ships with TypeScript definitions for all icons across all included sets.',
    verdict:
      'React Icons is the best choice when you need maximum icon variety, are prototyping quickly, or want to pull icons from multiple design languages without managing separate packages. The trade-off is that the library does not have its own design identity — you are mixing icon sets with different visual styles. For projects requiring strict visual consistency, choose a single focused library like Lucide or Tabler instead.',
  },

  stats: {
    iconCount: 40000,
    stars: 11500,
    weeklyDownloads: 3200000,
    license: 'MIT',
    firstRelease: '2018',
    latestVersion: '5.x',
    bundleSize: '~1kb per icon',
    openIssues: 340,
  },

  installation: {
    react: {
      package: 'react-icons',
      command: 'npm install react-icons',
      yarn: 'yarn add react-icons',
      pnpm: 'pnpm add react-icons',
    },
    nextjs: {
      package: 'react-icons',
      command: 'npm install react-icons',
      note: 'Works with Next.js App Router and Server Components out of the box. No extra setup required.',
    },
    vue: {
      package: 'N/A',
      command: '// React Icons is React-only. For Vue, use unplugin-icons or install individual icon sets.',
    },
    svelte: {
      package: 'N/A',
      command: '// React Icons is React-only. For Svelte, use unplugin-icons instead.',
    },
    vanilla: {
      package: 'N/A',
      command: '// React Icons requires React. For vanilla JS, use the individual icon library SVG files directly.',
    },
  },

  codeExamples: {
    basic: `// Each icon set has a 2-3 letter prefix
import { FaHome, FaGithub } from 'react-icons/fa'      // Font Awesome
import { MdSettings, MdSearch } from 'react-icons/md'   // Material Design
import { HiUser, HiBell } from 'react-icons/hi'         // Heroicons
import { BsTwitter, BsLinkedin } from 'react-icons/bs'  // Bootstrap Icons
import { FiCode, FiPackage } from 'react-icons/fi'      // Feather Icons

export default function App() {
  return (
    <div>
      <FaHome size={24} />
      <MdSettings size={24} color="#6366f1" />
      <HiUser size={24} />
    </div>
  )
}`,

    withTailwind: `import { FaBell, FaSearch } from 'react-icons/fa'

export default function Navbar() {
  return (
    <nav className="flex items-center gap-4">
      <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900">
        <FaSearch className="h-4 w-4" />
        <span>Search</span>
      </button>
      <button className="relative text-gray-500 hover:text-gray-900">
        <FaBell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
      </button>
    </nav>
  )
}`,

    iconContext: `// Use IconContext to set default props for all icons in a subtree
import { IconContext } from 'react-icons'
import { FaHome, FaUser, FaCog } from 'react-icons/fa'

export default function Sidebar() {
  return (
    <IconContext.Provider value={{ size: '20', color: '#6b7280', className: 'flex-shrink-0' }}>
      <nav className="flex flex-col gap-2">
        <FaHome />
        <FaUser />
        <FaCog />
      </nav>
    </IconContext.Provider>
  )
}`,

    mixingSets: `// The killer feature — mix icon sets freely in one project
import { FaReact, FaNodeJs } from 'react-icons/fa'    // Font Awesome brands
import { SiTypescript, SiNextdotjs } from 'react-icons/si' // Simple Icons (tech brands)
import { VscGithub } from 'react-icons/vsc'            // VS Code Icons
import { TbBrandVercel } from 'react-icons/tb'         // Tabler Icons

export function TechStack() {
  return (
    <div className="flex gap-3">
      <FaReact size={24} className="text-cyan-400" />
      <SiTypescript size={24} className="text-blue-500" />
      <SiNextdotjs size={24} />
      <TbBrandVercel size={24} />
    </div>
  )
}`,

    allPrefixes: `// Complete prefix reference for included icon sets
// fa   — Font Awesome 5          fa6  — Font Awesome 6
// md   — Material Design         io   — Ionicons 4
// io5  — Ionicons 5              ti   — Typicons
// go   — GitHub Octicons         fi   — Feather Icons
// gi   — Game Icons              wi   — Weather Icons
// di   — Devicons                ai   — Ant Design Icons
// bs   — Bootstrap Icons         ri   — Remix Icons
// fc   — Flat Color Icons        gr   — Grommet Icons
// hi   — Heroicons               hi2  — Heroicons v2
// si   — Simple Icons (brands)   sl   — Simple Line Icons
// im   — IcoMoon Free            bi   — BoxIcons
// cg   — css.gg                  vsc  — VS Code Icons
// tb   — Tabler Icons            rx   — Radix Icons
// pi   — Phosphor Icons          lu   — Lucide Icons`,
  },

  pros: [
    {
      title: 'One package, 25+ icon sets',
      detail: 'Install a single npm package and get Font Awesome, Material Design, Heroicons, Bootstrap Icons, Feather, Ionicons, Tabler, Phosphor, Lucide, and 15+ more. No juggling multiple dependencies.',
    },
    {
      title: '40,000+ icons — you will always find what you need',
      detail: 'The largest icon vocabulary of any single package. If an icon exists anywhere in the open-source icon world, it is almost certainly in React Icons.',
    },
    {
      title: 'Unified API across all sets',
      detail: 'Every icon from every library uses the same import pattern and accepts the same props (size, color, className, style, title). Learn it once, use it everywhere.',
    },
    {
      title: 'Tree-shakable ES6 imports',
      detail: 'Each icon is a separate named export. Only the icons you import are included in your bundle — the rest are eliminated by your bundler automatically.',
    },
    {
      title: 'Full TypeScript support',
      detail: 'Complete type definitions for all 40,000+ icons across all included sets. Full autocomplete and type checking in VS Code and other IDEs.',
    },
    {
      title: 'Brand and tech logo icons via Simple Icons',
      detail: 'The si prefix gives access to 2,400+ brand logos (GitHub, Vercel, TypeScript, AWS, etc.) via Simple Icons — far more brand coverage than any standalone library.',
    },
  ],

  cons: [
    {
      title: 'No consistent visual identity',
      detail: 'Mixing icons from Font Awesome, Material Design, and Heroicons in the same UI results in mismatched visual styles. Stroke weights, grid sizes, and design languages differ significantly between sets.',
    },
    {
      title: 'Large package install size',
      detail: 'The full node_modules footprint of react-icons is large because it ships all icon sets. Tree-shaking fixes bundle size at build time, but npm install and IDE indexing are slower.',
    },
    {
      title: 'Not a library — a wrapper',
      detail: 'React Icons does not maintain any icons itself. It re-packages other libraries. Icon quality, consistency, and naming conventions vary by set. Updates depend on upstream libraries.',
    },
    {
      title: 'Icon naming is inconsistent across sets',
      detail: 'Font Awesome icons start with Fa, Material Design with Md, etc. Finding the right icon requires knowing which set it lives in. The search experience across 40k icons is harder than a curated 1,500-icon library.',
    },
  ],

  whoShouldUse: [
    'Projects that need maximum icon variety — especially brand/tech logos via Simple Icons',
    'Rapid prototyping where speed matters more than strict visual consistency',
    'Projects already using multiple icon sets that want to unify under one API',
    'Teams that want to try different icon styles without committing to one library',
    'Projects needing weather icons, game icons, or other niche sets not available elsewhere',
  ],

  whoShouldNot: [
    'Projects that require strict visual consistency across all icons — use Lucide or Tabler instead',
    'Design systems where every icon must share the same stroke weight and grid',
    'Teams who find 40,000 icon choices overwhelming — a curated library is faster to work with',
    'Projects where install size and IDE performance matter — react-icons is heavy on disk',
  ],

  faqs: [
    {
      q: 'Is React Icons free for commercial use?',
      a: 'Yes. React Icons itself is MIT licensed. Each bundled icon set retains its own license — but all included sets use permissive open-source licenses (MIT, Apache 2.0, CC BY 4.0) that allow free commercial use.',
    },
    {
      q: 'Does React Icons work with Next.js App Router and Server Components?',
      a: 'Yes. React Icons exports pure SVG React components with no client-side hooks or context requirements, so they work in Next.js Server Components without a "use client" directive.',
    },
    {
      q: 'How do I find which prefix to use for a specific icon set?',
      a: 'Visit react-icons.github.io/react-icons and search for any icon. The search results show the import path with the prefix. Alternatively, hover over the result to see the exact import: FaHome from react-icons/fa, MdSettings from react-icons/md, and so on.',
    },
    {
      q: 'How do I set default size and color for all icons without repeating props?',
      a: 'Wrap your icons in an IconContext.Provider. Set value={{ size: "20", color: "#6b7280" }} and all icons inside that subtree inherit those defaults. You can still override per-icon with explicit props.',
    },
    {
      q: 'Does tree-shaking actually work with React Icons?',
      a: 'Yes, but only when you use named imports from the specific sub-path (e.g. from react-icons/fa). If you import from react-icons directly, the bundler cannot tree-shake. Always use the sub-path import.',
    },
    {
      q: 'What is the difference between React Icons and installing individual libraries like Lucide or Heroicons?',
      a: 'React Icons is a convenience wrapper — it gives you access to many libraries through one API, but the icons themselves are from those same upstream libraries. Installing lucide-react directly gives you a smaller package footprint, first-party updates, and consistent design. React Icons is better when you need icons from multiple sets or want to avoid managing separate packages.',
    },
  ],

  alternatives: ['lucide-icons', 'heroicons', 'tabler-icons', 'phosphor-icons'],

  links: {
    github: 'https://github.com/react-icons/react-icons',
    website: 'https://react-icons.github.io/react-icons/',
    npm: 'https://www.npmjs.com/package/react-icons',
    figma: '',
  },
}