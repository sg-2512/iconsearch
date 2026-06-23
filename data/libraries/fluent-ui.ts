export const fluentUiData = {
  name: "Fluent UI Icons",
  slug: "iconify-fluent",
  tagline: "Microsoft's official Fluent Design System icon set, featuring clean outline and filled variants optimized for modern product design.",
  description: {
    intro: "Fluent UI System Icons are Microsoft's official open-source icon set designed for the Fluent design language. Used across Windows, Office, and Microsoft 365, these icons provide a consistent, modern visual language for desktop, mobile, and web applications. The library is highly optimized for clean display at specific pixel grid dimensions.",
    detail: "Unlike most generic icon sets, Fluent System Icons are designed and aligned individually for multiple grid sizes (such as 16x16, 20x20, 24x24, 28x28, 32x32, and 48x48) to guarantee pixel-perfection. The icons are divided cleanly into Regular (outline) and Filled variants, ensuring visual parity across user interface states, dark modes, and interactive actions.",
    technical: "The set is distributed as individual SVG source files, a web font, and official React (@fluentui/react-icons) and React Native component wrappers. It offers native TypeScript definitions, complete treeshaking support, and includes accessibility attributes (aria-hidden) by default. The design follows Microsoft's Fluent Design System specifications closely, offering unified line weights, border radii, and visual weights.",
    verdict: "Fluent UI Icons are the ultimate choice for developers building enterprise software, productivity applications, or any product aiming to feel native to Windows 11 and Microsoft 365. They combine professional, understated design with exceptional quality, though they may feel overly corporate in highly casual or creative branding projects."
  },
  stats: {
    iconCount: 4000,
    stars: 3200,
    weeklyDownloads: 450000,
    license: "MIT",
    firstRelease: "2020",
    latestVersion: "1.1.230",
    bundleSize: "Highly tree-shakable (individual imports < 1kb)",
    openIssues: 45,
  },
  installation: {
    react: {
      package: "@fluentui/react-icons",
      command: "npm install @fluentui/react-icons",
      yarn: "yarn add @fluentui/react-icons",
      pnpm: "pnpm add @fluentui/react-icons",
    },
    nextjs: {
      package: "@fluentui/react-icons",
      command: "npm install @fluentui/react-icons",
      note: "Fluent UI React Icons supports tree shaking out of the box in Next.js App Router. Use specific imports to minimize bundle size.",
    },
    vue: {
      package: "fluent-ui-icons (Community wrappers)",
      command: "// No official Vue wrapper exists, but SVG files can be imported directly or used via standard Iconify packages.",
    },
    svelte: {
      package: "fluent-ui-icons (Community wrappers)",
      command: "// Import raw SVGs directly or use through the Iconify Svelte integration.",
    },
    vanilla: {
      package: "@fluentui/react-icons",
      command: "<!-- Import raw SVGs or use a font-based CDN bundle -->",
    }
  },
  codeExamples: {
    basic: `import { Home24Regular, Home24Filled } from '@fluentui/react-icons'

export function NavigationItem({ active }) {
  return (
    <button className="flex items-center gap-2">
      {active ? <Home24Filled /> : <Home24Regular />}
      <span>Home</span>
    </button>
  )
}`,
    withTailwind: `import { Settings24Regular } from '@fluentui/react-icons'

export function SettingsButton() {
  return (
    <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors group">
      <Settings24Regular className="w-6 h-6 text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors" />
    </button>
  )
}`,
    vanillaJS: `// Using Fluent UI icons via Iconify component in HTML
import 'iconify-icon';

// Render Fluent Home Regular
const element = document.createElement('iconify-icon');
element.setAttribute('icon', 'fluent:home-24-regular');
document.body.appendChild(element);`,
  },
  pros: [
    { title: "Designed for specific sizes", detail: "Unlike SVGs that are just scaled up or down, Microsoft designs distinct variants for 16px, 20px, 24px, etc., ensuring maximum legibility on screen." },
    { title: "Clean Filled & Regular styles", detail: "Provides a perfect 1:1 match between outline and filled states, making interactive states (like tab bars or sidebar selection) highly intuitive." },
    { title: "Professional enterprise aesthetic", detail: "Understated, reliable, and corporate-friendly design that instantly elevates the professionalism of dashboards, SaaS platforms, and admin panels." },
    { title: "First-party React wrapper", detail: "Microsoft provides an exceptionally well-maintained, fully-typed React package featuring tree-shakable ES modules." },
    { title: "Accessibility included", detail: "Designed with modern software accessibility requirements in mind, using standard vector coordinates and structures." },
    { title: "Massive selection", detail: "Over 4,000 unique icon concepts covering productivity, cloud infrastructure, file types, device states, and user interactions." },
  ],
  cons: [
    { title: "Microsoft-centric identity", detail: "Highly customized to Windows 11 / Office styling, which can make your application look like a Microsoft clone if not designed carefully." },
    { title: "Strict size naming conventions", detail: "React exports are named with sizes explicitly included (e.g., Home24Regular), which can make swapping sizes or dynamic scaling in code slightly verbose." },
    { title: "No official Vue/Svelte components", detail: "While SVGs and Iconify options exist, non-React framework users don't benefit from Microsoft's first-party wrapper packages." },
    { title: "Very clean but low playfulness", detail: "Strictly functional and geometric design. Lacks the playful character or custom design flourishes of sets like Phosphor or Solar." },
  ],
  whoShouldUse: [
    "Enterprise web applications, SaaS dashboards, and administrative software",
    "Apps aiming for high alignment with Microsoft 365, Teams, or Windows 11 integrations",
    "Cross-platform products requiring pixel-perfect legibility on low-resolution displays",
    "Developer tools and utility interfaces where functional clarity takes priority over branding",
    "Teams requiring high visual consistency across mobile, desktop, and web clients",
  ],
  whoShouldNot: [
    "Playful, consumer-facing mobile apps, game launchers, or highly creative web concepts",
    "Brand sites requiring extremely stylized, rounded, or custom-themed icons",
    "Projects leveraging Vue or Svelte where official React components add unnecessary integration friction",
    "Small landing pages where Lucide or Heroicons offer faster, lighter, and more versatile setups",
  ],
  faqs: [
    {
      q: "What do the numbers in Fluent UI React Icons mean (e.g., Home24Regular)?",
      a: "The number refers to the custom-designed pixel grid size (e.g., 20, 24, 28). Each size is manually aligned to pixels for crisp display. For standard layouts, the 24px variant is the default recommendation."
    },
    {
      q: "Are filled and regular variants matched 1:1?",
      a: "Yes. Every concept in the Fluent UI System set features matching outline (Regular) and filled (Filled) visual styles to represent active/inactive or default/hover actions."
    },
    {
      q: "Who maintains the library?",
      a: "Microsoft's design and engineering teams actively maintain this repository on GitHub. Updates containing new icons and improvements are released frequently."
    },
    {
      q: "Is there an official Figma file available?",
      a: "Yes. Microsoft publishes the official Fluent UI System Icons Figma file in the Figma Community, complete with component variants for sizes and weights."
    },
    {
      q: "Can I customize the color and size of these icons?",
      a: "Yes. The React components render SVGs, meaning you can easily change colors using the CSS 'color' property or tailwind classes like 'text-blue-500'. Size can be customized, but it is best to import the design closest to your target size for optimal rendering."
    },
  ],
  alternatives: ["lucide-icons", "iconify-carbon", "tabler-icons", "material-symbols"],
  links: {
    github: "https://github.com/microsoft/fluentui-system-icons",
    website: "https://fluenticons.co",
    npm: "https://www.npmjs.com/package/@fluentui/react-icons",
    figma: "https://www.figma.com/community/file/836826225992454529",
  }
}
