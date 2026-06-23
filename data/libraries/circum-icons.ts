export const circumIconsData = {
  name: "Circum Icons",
  slug: "circum-icons",
  tagline: "Consistent, ultra-minimalist line icons featuring simple visual geometry and rounded outlines.",
  description: {
    intro: "Circum Icons is a beautifully refined, modern open-source line icon set built for high-end minimalist interfaces. Featuring rounded vertices, balanced empty space, and thin visual styling, these icons offer a highly consistent visual framework across 288 everyday UI concepts.",
    detail: "Unlike dense sets that contain variations for multiple visual weights, Circum Icons dedicates itself exclusively to a singular, thin line aesthetic. The design focuses heavily on uniform rounded corners and simple geometry, preventing icons from cluttering text or pulling too much focus from adjacent interface components.",
    technical: "Circum Icons is licensed under the Mozilla Public License 2.0 (MPL-2.0), making it free to use in proprietary and commercial applications. The library is distributed via standard npm packages ('circum-icons'), direct SVG routes, and via Iconify using the 'circum' collection prefix.",
    verdict: "Circum Icons is an exceptional fit for clean mobile layouts, elegant lifestyle apps, and SaaS platforms that prioritize design aesthetics and minimal screen noise. Due to its limited concept count (288 icons), it may occasionally need to be paired with other libraries for highly specialized enterprise niches."
  },
  stats: {
    iconCount: 288,
    stars: 800,
    weeklyDownloads: 8000,
    license: "MPL-2.0",
    firstRelease: "2022",
    latestVersion: "2.0.0",
    bundleSize: "Extremely lightweight (~1.2kb per icon)",
    openIssues: 5,
  },
  installation: {
    react: {
      package: "circum-icons",
      command: "npm install circum-icons",
      yarn: "yarn add circum-icons",
      pnpm: "pnpm add circum-icons",
    },
    nextjs: {
      package: "circum-icons",
      command: "npm install circum-icons",
      note: "Standard ESM layout supports tree-shaking natively in Next.js applications.",
    },
    vue: {
      package: "circum-icons",
      command: "// Fetch raw SVGs or use iconify/vue integration with 'circum:' prefix",
    },
    svelte: {
      package: "circum-icons",
      command: "// Integrate via standard Iconify Svelte wrapper or direct inline SVGs",
    },
    vanilla: {
      package: "circum-icons",
      command: "<!-- CDN access to SVGs -->\n<img src=\"https://raw.githubusercontent.com/klaufel/circum-icons/main/svg/home.svg\" width=\"24\" height=\"24\" />",
    }
  },
  codeExamples: {
    basic: `import { Home } from 'circum-icons'

export function Layout() {
  return (
    <div>
      <Home size={24} />
      <span>Dashboard</span>
    </div>
  )
}`,
    withTailwind: `import { Settings } from 'circum-icons'

export function SidebarButton() {
  return (
    <button className="flex items-center gap-3 p-2 text-zinc-600 hover:text-indigo-600 transition-colors">
      <Settings className="w-6 h-6 stroke-[1.5]" />
      <span className="text-sm font-medium">Settings</span>
    </button>
  )
}`,
    vanillaJS: `<!-- Render Circum icon using Iconify component -->
<iconify-icon icon="circum:home" style="font-size: 24px; color: #4f46e5;"></iconify-icon>`,
  },
  pros: [
    { title: "Superb design consistency", detail: "Every icon maintains identical line weight, corner radii, and grid alignment." },
    { title: "Elegant minimalist design", detail: "Provides a lightweight visual signature that works perfectly on clean lifestyle products and portfolios." },
    { title: "MIT & commercial friendly", detail: "MPL-2.0 license grants permissive rights for commercial applications." },
  ],
  cons: [
    { title: "Small selection size", detail: "Contains only 288 core concepts. Might require fallback sets for niche actions." },
    { title: "No built-in filled variants", detail: "Designed strictly as outline icons; no filled versions exist for selected UI states." },
  ],
  whoShouldUse: [
    "Designers building minimalist portfolio sites, agency landing pages, and lifestyle products",
    "Mobile layouts requiring consistent, low-noise outlines that balance with small typography",
    "Projects that require a clean line look similar to linear Lucide design but with rounded vertices",
  ],
  whoShouldNot: [
    "Complex dashboard software or developer consoles requiring hundreds of highly descriptive indicators",
    "Interfaces that require dual-state outline/filled sets for action states",
  ],
  faqs: [
    {
      q: "What license does Circum Icons use?",
      a: "Circum Icons is licensed under the Mozilla Public License 2.0 (MPL-2.0), which allows commercial usage, modification, and distribution."
    },
    {
      q: "Are the icons stroke or path based?",
      a: "They are path-based outline icons. You can scale their size, and change their color via the color property or Tailwind text classes."
    },
    {
      q: "Can I use Circum Icons in Figma?",
      a: "Yes. Circum Icons is available as a Figma community file or directly searchable via the Icon Search plugin."
    },
  ],
  alternatives: ["lucide-icons", "feather-icons", "teenyicons"],
  links: {
    github: "https://github.com/klaufel/circum-icons",
    website: "https://circumicons.com",
    npm: "https://www.npmjs.com/package/circum-icons",
    figma: "https://www.figma.com/community/file/1151608404558298717",
  }
}
