export const materialIconsData = {
  name: 'Material Icons',
  slug: 'material-icons',
  tagline: "Google's official Material Design icons — 2,100+ icons in 5 styles, 5.1M weekly downloads",
  description: {
    intro: "Material Icons is Google's official icon library, implementing the Material Design visual language. Distributed as @mui/icons-material, it wraps Google's complete Material Icons SVG set as typed React components via MUI's SvgIcon system. With over 5.1 million weekly npm downloads, it is one of the most widely used icon libraries in the entire React ecosystem.",
    detail: "The defining feature of Material Icons is its five style variants — Filled, Outlined, Rounded, Sharp, and TwoTone — covering every icon at every expressiveness level. Filled icons are bold and high-contrast for primary actions. Outlined icons are minimal for supporting UI. Rounded softens sharp edges for consumer apps. Sharp is geometric and clinical for data-heavy tools. TwoTone adds visual depth for marketing surfaces. Each variant ships as a separate React component, all from the same package.",
    technical: "The package requires @mui/material as a peer dependency, along with @emotion/styled and @emotion/react. If your project does not already use MUI, this adds approximately 300KB gzip to your bundle — a significant consideration versus lighter alternatives. When MUI is already installed, the marginal icon cost is ~1KB per icon (gzip). Tree-shaking works correctly in production with modern bundlers. However named barrel imports are up to 6x slower in Vite/webpack development mode — path-based imports are strongly recommended to avoid slow dev server startup.",
    verdict: "Material Icons is the correct choice for projects already using MUI component library — the peer dependency cost is already paid and the design language is consistent. For projects not on MUI, the peer dependency overhead makes Lucide, Heroicons, or Tabler significantly more practical. The five-variant system is genuinely powerful for design-system-driven teams, but it comes with real architectural decisions that need to be made upfront."
  },
  stats: {
    iconCount: 2100,
    stars: 98300,
    weeklyDownloads: 5174834,
    license: 'MIT',
    firstRelease: '2014',
    latestVersion: "5.16.14",
    bundleSize: '~1KB per icon (tree-shaken) + ~300KB peer deps if not on MUI',
    openIssues: 1700,
  },
  installation: {
    react: {
      package: '@mui/icons-material',
      command: 'npm install @mui/icons-material @mui/material @emotion/styled @emotion/react',
      yarn: 'yarn add @mui/icons-material @mui/material @emotion/styled @emotion/react',
      pnpm: 'pnpm add @mui/icons-material @mui/material @emotion/styled @emotion/react',
      note: 'All four packages are required. @mui/material, @emotion/styled, and @emotion/react are peer dependencies that must be installed alongside the icons package.',
    },
    nextjs: {
      package: '@mui/icons-material',
      command: 'npm install @mui/icons-material @mui/material @emotion/styled @emotion/react',
      note: 'Works with Next.js App Router. Icons render in Server Components without use client. For dev performance, use path imports (import HomeIcon from "@mui/icons-material/Home") instead of barrel imports — up to 6x faster dev server startup.',
    },
    vue: {
      package: 'N/A',
      command: '// No official Vue package. @mui/icons-material is React-only.\n// For Vue, use Material Design Icons community package:\n// npm install @mdi/vue3 @mdi/js',
    },
    vanilla: {
      package: 'N/A',
      command: '// No vanilla JS package. Use Google Material Icons web font for non-React projects:\n// <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">\n// <span class="material-icons">home</span>',
    },
  },
  codeExamples: {
    basic: `import HomeIcon from '@mui/icons-material/Home'
import SearchIcon from '@mui/icons-material/Search'
import SettingsIcon from '@mui/icons-material/Settings'

// ✅ Path imports — recommended for dev performance
export default function App() {
  return (
    <div>
      <HomeIcon />
      <SearchIcon sx={{ fontSize: 24, color: 'primary.main' }} />
      <SettingsIcon sx={{ fontSize: 24, color: 'text.secondary' }} />
    </div>
  )
}`,
    fiveVariants: `// Every icon ships in 5 style variants
// Append the variant name to the icon name (Filled has no suffix)

import HomeIcon from '@mui/icons-material/Home'              // Filled (default)
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'       // Outlined
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'         // Rounded
import HomeSharpIcon from '@mui/icons-material/HomeSharp'             // Sharp
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone'         // TwoTone

export function IconVariants() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <HomeIcon />          {/* bold, solid */}
      <HomeOutlinedIcon />  {/* minimal, stroke-style */}
      <HomeRoundedIcon />   {/* friendly, rounded */}
      <HomeSharpIcon />     {/* geometric, clinical */}
      <HomeTwoToneIcon />   {/* two-color depth */}
    </div>
  )
}`,
    withTailwind: `// Material Icons work with Tailwind className — avoid sx prop in Tailwind projects
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'

export function Navbar() {
  return (
    <nav className="flex items-center gap-4">
      <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900">
        <SearchIcon className="h-5 w-5" />
        <span>Search</span>
      </button>
      <button aria-label="Notifications">
        <NotificationsIcon className="h-6 w-6 text-gray-600" />
      </button>
    </nav>
  )
}`,
    sizingAndColor: `import DeleteIcon from '@mui/icons-material/Delete'
import StarIcon from '@mui/icons-material/Star'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// Sizing — use fontSize prop or sx
<DeleteIcon fontSize="small" />    // 20px
<DeleteIcon fontSize="medium" />   // 24px (default)
<DeleteIcon fontSize="large" />    // 35px
<DeleteIcon sx={{ fontSize: 48 }} />  // custom pixel value

// Color — use color prop or sx
<StarIcon color="primary" />      // theme primary color
<StarIcon color="error" />        // theme error (red)
<StarIcon color="warning" />      // theme warning (orange)
<StarIcon color="disabled" />     // muted gray
<StarIcon sx={{ color: '#6366f1' }} />  // custom hex

// Combining size and color
<CheckCircleIcon
  sx={{ fontSize: 32, color: 'success.main' }}
/>`,
    barrelVsPathImports: `// ❌ Barrel import — named import from package root
// Works in production but 6x slower in development mode
import { Home, Delete, Search, Star } from '@mui/icons-material'

// ✅ Path import — direct file import (recommended by MUI)
// Same bundle size in production, 6x faster dev startup
import Home from '@mui/icons-material/Home'
import Delete from '@mui/icons-material/Delete'
import Search from '@mui/icons-material/Search'
import Star from '@mui/icons-material/Star'

// For TypeScript — both patterns are fully typed, no difference`,
    serverComponents: `// Material Icons work in Next.js Server Components — no 'use client' needed
// They render as static SVG HTML on the server

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'

// This is a Server Component — no 'use client' directive
export function StatusBadge({ status }: { status: 'ok' | 'info' }) {
  return (
    <div className="flex items-center gap-2">
      {status === 'ok'
        ? <CheckCircleOutlinedIcon sx={{ color: 'success.main' }} />
        : <InfoOutlinedIcon sx={{ color: 'info.main' }} />
      }
    </div>
  )
}`,
  },
  pros: [
    {
      title: "5 style variants per icon",
      detail: "Filled, Outlined, Rounded, Sharp, and TwoTone ship from one package. No other free library offers this breadth from a single install — this is the single biggest advantage over Lucide, Heroicons, and Tabler."
    },
    {
      title: "Largest React icon download volume",
      detail: "Over 5.1 million weekly npm downloads makes @mui/icons-material the most-downloaded React icon package. This translates to unmatched community support, StackOverflow answers, and long-term maintenance certainty."
    },
    {
      title: "Perfect MUI design system integration",
      detail: "Icons accept the sx prop, theme color tokens (primary.main, error, warning), and fontSize props that align with MUI's spacing scale. For MUI projects this is native — no adapter layer, no styling conflicts."
    },
    {
      title: "Google's official Material Design language",
      detail: "Used across all Google products — Gmail, Google Drive, Google Maps, Android. Users recognize these icons from daily life, which reduces cognitive load in consumer-facing applications."
    },
    {
      title: "Works in Next.js Server Components",
      detail: "Icons render as static SVG HTML on the server with no client-side JavaScript. No use client directive needed, zero runtime overhead in Server Components."
    },
    {
      title: "Full TypeScript support",
      detail: "Every icon component is fully typed. The SvgIconProps interface covers all props including sx, color, fontSize, and custom className. Works cleanly with strict TypeScript configurations."
    },
  ],
  cons: [
    {
      title: "Heavy peer dependency cost without MUI",
      detail: "@mui/material, @emotion/styled, and @emotion/react are required peer dependencies. If your project does not already use MUI, this adds approximately 300KB gzip to your bundle — making Lucide or Heroicons a dramatically better choice for non-MUI projects."
    },
    {
      title: "6x slower dev server with barrel imports",
      detail: "Named imports from @mui/icons-material barrel file make development startup up to 6x slower in Vite and webpack. MUI themselves strongly recommend path imports. This is a known issue that trips up most developers who use the intuitive named import pattern."
    },
    {
      title: "React-only — no Vue or Svelte packages",
      detail: "Unlike Lucide, Heroicons, or Tabler, there are no official Vue, Svelte, or vanilla JS packages. Non-React projects need community alternatives or the web font approach, which has accessibility drawbacks."
    },
    {
      title: "Older Material Design aesthetic",
      detail: "Material Design's visual language dates from 2014 and has been iterated since, but it remains distinctively Google. In 2026 it reads as enterprise or Android-influenced, not modern minimal SaaS — which can work for or against you depending on your product context."
    },
    {
      title: "No Lucide-style strokeWidth control",
      detail: "Unlike Lucide's strokeWidth prop, Material Icons do not offer stroke weight customization within a single variant. You switch between the 5 style variants to change visual weight — a coarser control than Lucide's continuous strokeWidth scale."
    },
    {
      title: "Material Symbols successor is not yet supported",
      detail: "Google has released Material Symbols as the next-generation replacement for Material Icons, offering variable font weight control. @mui/icons-material does not yet support Material Symbols. Teams building new products may be investing in a library that Google has already superseded."
    },
  ],
  whoShouldUse: [
    "Projects already using MUI (@mui/material) — peer dependency is already installed, design language is consistent, sx prop integration is native",
    "Teams building enterprise or internal tools where Google's Material Design aesthetic signals familiarity and trust",
    "Applications targeting users with Android backgrounds where Material Design shapes feel intuitive",
    "Design systems that need multiple icon styles (Outlined for navigation, Filled for active states, TwoTone for marketing) from a single library",
    "Projects where the 5.1M weekly download count and Google backing provide confidence in long-term maintenance",
  ],
  whoShouldNot: [
    "Projects not using MUI — the 300KB+ peer dependency cost makes Lucide, Heroicons, or Tabler far more practical at zero additional overhead",
    "New Next.js projects in 2026 without an existing MUI dependency — shadcn/ui and lucide-react is the standard stack with better bundle characteristics",
    "Vue, Svelte, or vanilla HTML projects — no official packages exist for these frameworks",
    "Products aiming for a minimal, modern stroke-based aesthetic — Material Design's visual language is distinctive and immediately recognizable as Google",
    "Teams that want Figma-to-code parity without committing to the full MUI design system",
  ],
  faqs: [
    {
      q: "Do I need to install @mui/material to use Material Icons?",
      a: "Yes. @mui/material, @emotion/styled, and @emotion/react are required peer dependencies. The installation command is: npm install @mui/icons-material @mui/material @emotion/styled @emotion/react. If your project does not already use MUI, this adds approximately 300KB gzip to your bundle. For projects not on MUI, Lucide React (ISC, ~5KB for 50 icons) is a dramatically lighter choice."
    },
    {
      q: "What are the 5 Material Icons style variants and when should I use each?",
      a: "Filled (default, no suffix) — bold and solid for primary interactive elements. Outlined (suffix: Outlined) — minimal stroke-style for supporting UI and secondary actions. Rounded (suffix: Rounded) — softer rounded corners for consumer-facing and friendly interfaces. Sharp (suffix: Sharp) — hard geometric edges for clinical, technical, and data-heavy UIs. TwoTone (suffix: TwoTone) — two-color depth for marketing sections and visual hierarchy. Use one variant consistently per context — mixing variants within the same UI section looks inconsistent."
    },
    {
      q: "Why is my dev server slow after installing @mui/icons-material?",
      a: "Named barrel imports from @mui/icons-material are up to 6x slower in Vite and webpack development mode. Switch to path imports: instead of import { Home, Delete } from '@mui/icons-material', use import Home from '@mui/icons-material/Home' and import Delete from '@mui/icons-material/Delete'. Production bundle size is identical either way — only development startup is affected."
    },
    {
      q: "Do Material Icons work in Next.js App Router Server Components?",
      a: "Yes. Material Icon components render to static SVG HTML on the server with no client JavaScript required. You can import and use them in any Server Component without the use client directive. The icons work identically in Server and Client Components."
    },
    {
      q: "What is the difference between Material Icons and Material Symbols?",
      a: "Material Icons is the original Google icon set, shipped as individual SVG files for each icon variant. Material Symbols is Google's newer replacement, using a variable font system where weight, fill, optical size, and grade can be controlled with CSS variables — one font file replaces 5 variant files. @mui/icons-material currently covers Material Icons only. Material Symbols support in MUI is in development. For new projects, be aware that Material Icons is technically the legacy system."
    },
    {
      q: "Can I use Material Icons without the MUI design system (without sx prop)?",
      a: "Yes. While @mui/icons-material depends on @mui/material as a peer, you can use the icons with className and style props like any other SVG component — you do not have to use the sx prop or MUI theming. The peer dependency just needs to be installed; you do not need to use MUI components in your application."
    },
    {
      q: "Material Icons vs Lucide React — which should I choose?",
      a: "If you are already on MUI: Material Icons. Zero additional cost, consistent design language. If you are not on MUI: Lucide React. Single npm install, no peer dependencies, ~5KB for 50 icons vs ~300KB+ for Material's peer dep overhead. Lucide also has a cleaner modern aesthetic for SaaS and developer tools. The only advantage Material Icons has over Lucide for non-MUI projects is the five style variants — if you specifically need Outlined and Filled from one library, that may justify the cost."
    },
  ],
  alternatives: ['lucide-icons', 'heroicons', 'phosphor-icons', 'tabler-icons', 'font-awesome'],
  links: {
    github: 'https://github.com/mui/material-ui/tree/master/packages/mui-icons-material',
    website: 'https://mui.com/material-ui/material-icons/',
    npm: 'https://www.npmjs.com/package/@mui/icons-material',
    figma: 'https://www.figma.com/community/plugin/740272380439725040',
  },
}