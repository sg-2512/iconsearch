export const elusiveIconsData = {
  name: "Elusive Icons",
  slug: "elusive-icons",
  tagline: "A clean, customisable web font and SVG vector icon set optimized for Bootstrap layouts.",
  description: {
    intro: "Elusive Icons is a classic web-focused icon set containing 304 slick, pictographic vectors originally designed to complement the Bootstrap framework. Maintained by Team Redux, it provides a balance of core interface elements, social media networks, and platform branding options.",
    detail: "The design language of Elusive Icons favors solid, visually weighted pictograms over light line weights. This makes them highly legible at small resolutions and standard interface dimensions, providing strong visual anchors for buttons, alert boxes, and navigation sidebars.",
    technical: "Elusive Icons is licensed under the SIL Open Font License 1.1 (OFL-1.1) for its font resources and the MIT License for its code implementation. It is fully integrated with the Iconify runtime under the 'el' collection prefix, enabling tree-shakable web component integration in modern frameworks.",
    verdict: "Elusive Icons is an ideal fit for legacy migrations, projects leveraging Bootstrap grids, or applications requiring bold, high-contrast visual signifiers. For modern minimalist designs requiring 1px layouts, pairing it with Feather or Lucide is recommended."
  },
  stats: {
    iconCount: 304,
    stars: 1200,
    weeklyDownloads: 5000,
    license: "OFL-1.1 / MIT",
    firstRelease: "2013",
    latestVersion: "2.0.0",
    bundleSize: "Highly lightweight (~1.5kb per icon)",
    openIssues: 10,
  },
  installation: {
    react: {
      package: "elusive-icons",
      command: "npm install elusive-icons",
      yarn: "yarn add elusive-icons",
      pnpm: "pnpm add elusive-icons",
    },
    nextjs: {
      package: "elusive-icons",
      command: "npm install elusive-icons",
      note: "Import raw SVG components or link the CDN font-face stylesheet inside Next.js layout structures.",
    },
    vue: {
      package: "elusive-icons",
      command: "// Load using Iconify Vue wrapper with 'el:' prefix",
    },
    svelte: {
      package: "elusive-icons",
      command: "// Fetch via standard Iconify Svelte interface",
    },
    vanilla: {
      package: "elusive-icons",
      command: "<!-- Import CSS from CDN -->\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/elusive-icons@latest/css/elusive-icons.min.css\">",
    }
  },
  codeExamples: {
    basic: `// Using standard font-icon classes
export function DashboardItem() {
  return (
    <div className="flex items-center gap-2">
      <i className="el el-home"></i>
      <span>Dashboard</span>
    </div>
  )
}`,
    withTailwind: `// Tailwind integration with size classes
export function AlertBox() {
  return (
    <div className="flex gap-3 p-4 bg-amber-500/10 text-amber-500 rounded-lg">
      <i className="el el-warning text-xl leading-none"></i>
      <div>Warning details...</div>
    </div>
  )
}`,
    vanillaJS: `<!-- Render Elusive icon via Iconify component -->
<iconify-icon icon="el:home" style="font-size: 24px; color: #3b82f6;"></iconify-icon>`,
  },
  pros: [
    { title: "Bootstrap native structure", detail: "Perfect drop-in alignment for Bootstrap projects and legacy grid layouts." },
    { title: "High-contrast designs", detail: "Bold, filled pictograms offer excellent visual anchors for calls-to-action." },
    { title: "Permissive licensing", detail: "OFL-1.1 and MIT allow worry-free integration in commercial software systems." },
  ],
  cons: [
    { title: "Legacy aesthetic style", detail: "Visual elements match older 2010s corporate layouts and may feel dated on ultra-modern sites." },
    { title: "No line/outline options", detail: "Designed strictly as solid glyphs; lacks linear variations for thin border designs." },
  ],
  whoShouldUse: [
    "Developers working on legacy Bootstrap migrations, admin dashboards, and corporate portals",
    "Products where bold, solid visual weight is preferred over thin outline configurations",
    "Teams requiring solid corporate indicators and platform branding marks",
  ],
  whoShouldNot: [
    "Modern, minimalist interfaces looking for 1px lines or rounded outline frameworks",
    "Projects requiring extensive sets containing thousands of highly specialized indicators",
  ],
  faqs: [
    {
      q: "What is the official prefix for Elusive Icons?",
      a: "The CSS prefix is 'el' (e.g. 'el el-home'). In the Iconify database, it is mapped using the 'el' prefix."
    },
    {
      q: "Who maintains the library?",
      a: "Elusive Icons is maintained by Team Redux (developers of the Redux Framework for WordPress)."
    },
    {
      q: "Can I customize the color and size?",
      a: "Yes. When used as a font, customize size via font-size and color via CSS color. When used as SVGs, standard fill/stroke styling applies."
    },
  ],
  alternatives: ["bootstrap-icons", "font-awesome", "material-icons"],
  links: {
    github: "https://github.com/dovy/elusive-icons",
    website: "https://redux.io/",
    npm: "https://www.npmjs.com/package/elusive-icons",
    figma: "",
  }
}
