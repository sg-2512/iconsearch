export const deviconsData = {
  name: "Devicons",
  slug: "devicons",
  tagline: "Developer & technology brand icons — logos for every language, framework, and tool",
  description: {
    intro: "Devicon is a specialized open-source icon set representing programming languages, design & development tools, and popular technology brands. With 800+ technology logos available as clean SVG files, it's the go-to library for developer portfolios, tech stack displays, and documentation.",
    detail: "Unlike general-purpose icon libraries (Lucide, Heroicons), Devicon focuses exclusively on technology branding. Each icon comes in multiple variants — original (full color), plain (monochrome), and line (outline) — with optional wordmark versions. This makes it ideal for skills sections, README badges, and tech stack showcases.",
    technical: "Devicon distributes icons via a CDN-hosted font and individual SVG files on GitHub/jsDelivr. There is no official React component package, but SVGs can be used directly via img tags or imported as React components using SVGR. The devicon.json manifest provides structured metadata including tags, alt names, and available variants for each icon.",
    verdict: "Devicon is essential for any developer-facing product that needs to display technology logos. It complements general-purpose icon sets perfectly — use Lucide or Heroicons for UI chrome, and Devicon for technology branding. The library is actively maintained with new technologies added regularly."
  },
  stats: {
    iconCount: 800,
    stars: 9500,
    weeklyDownloads: 120000,
    license: "MIT",
    firstRelease: "2015",
    latestVersion: "2.16.0",
    bundleSize: "~2kb per SVG icon",
    openIssues: 150,
  },
  installation: {
    react: {
      package: "devicon (CDN)",
      command: "// No npm install needed — use the CDN link\n// Add to your HTML <head>:\n<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css\" />",
      yarn: "// Or download SVGs directly from GitHub:\n// https://github.com/devicons/devicon/tree/master/icons",
      pnpm: "// Or use individual SVG imports with SVGR",
    },
    nextjs: {
      package: "devicon (CDN)",
      command: "// In your layout.tsx or _document.tsx, add the CDN link.\n// Or download specific SVGs and import them as components.",
      note: "For Next.js, consider downloading only the SVGs you need rather than loading the full font to optimize performance.",
    },
    vue: {
      package: "devicon (CDN)",
      command: "// Add CDN link to index.html or use SVG files directly in Vue components",
    },
    svelte: {
      package: "devicon (CDN)",
      command: "// Add CDN link to app.html or import SVGs directly",
    },
    vanilla: {
      package: "devicon",
      command: '<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />',
    }
  },
  codeExamples: {
    basic: `{/* Using the Devicon font via CDN class names */}
<i className="devicon-react-original colored"></i>
<i className="devicon-nextjs-plain"></i>
<i className="devicon-typescript-plain colored"></i>
<i className="devicon-python-plain colored"></i>`,
    withTailwind: `{/* Tech stack display with Tailwind */}
export function TechStack() {
  const techs = [
    'react', 'nextjs', 'typescript',
    'tailwindcss', 'postgresql', 'docker'
  ]
  return (
    <div className="flex items-center gap-4">
      {techs.map(tech => (
        <img
          key={tech}
          src={\`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/\${tech}/\${tech}-original.svg\`}
          alt={tech}
          className="w-8 h-8 hover:scale-110 transition-transform"
        />
      ))}
    </div>
  )
}`,
    vanillaJS: `<!-- Vanilla HTML usage with font classes -->
<link rel="stylesheet" type="text/css"
  href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />

<!-- Colored original logos -->
<i class="devicon-javascript-plain colored" style="font-size: 48px;"></i>
<i class="devicon-docker-plain colored" style="font-size: 48px;"></i>

<!-- Or use SVG files directly -->
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
     alt="React" width="48" height="48" />`,
  },
  pros: [
    { title: "800+ technology logos", detail: "Covers virtually every programming language, framework, database, cloud provider, and developer tool. From React to Rust, Docker to Django, PostgreSQL to Prisma." },
    { title: "Multiple variants per icon", detail: "Each icon comes in original (full color), plain (monochrome), and line (outline) variants, with optional wordmark versions for text-included logos." },
    { title: "Actively maintained", detail: "New technology icons are added regularly as new tools emerge. The community actively contributes new icons through pull requests." },
    { title: "CDN-ready", detail: "Available via jsDelivr CDN with zero npm install required. Just add a link tag or use SVG URLs directly." },
    { title: "Perfect for portfolios", detail: "The most popular choice for developer portfolios, README files, GitHub profiles, and tech stack showcases." },
    { title: "MIT licensed", detail: "Free for any use — personal, commercial, open source. No attribution required." },
  ],
  cons: [
    { title: "Technology logos only", detail: "No general-purpose UI icons (arrows, menus, settings). Must pair with Lucide, Heroicons, or similar for UI chrome." },
    { title: "No official React package", detail: "Unlike Lucide or Heroicons, there's no npm package with typed React components. You use CSS classes or SVG img tags." },
    { title: "No tree-shaking", detail: "The CSS font loads all icons. For optimal performance, download only the specific SVGs you need." },
    { title: "Inconsistent sizing", detail: "Some icons have different aspect ratios due to original brand guidelines, which can make alignment tricky." },
  ],
  whoShouldUse: [
    "Developer portfolios and personal websites showcasing tech stacks",
    "Documentation sites that need to display supported technologies",
    "GitHub README files and profile pages",
    "Job boards and hiring platforms showing required technologies",
    "Course platforms displaying technology curricula",
    "SaaS products with integration pages showing supported platforms",
  ],
  whoShouldNot: [
    "Projects needing general UI icons — use Lucide, Heroicons, or Tabler instead",
    "Applications where a typed React component API is essential",
    "Performance-critical apps that can't afford loading the full font file",
    "Projects needing custom icon coloring — original variants have fixed brand colors",
  ],
  faqs: [
    {
      q: "Is Devicon free for commercial use?",
      a: "Yes. Devicon uses the MIT license which allows free use in any commercial project without attribution. However, the individual brand logos remain trademarks of their respective owners."
    },
    {
      q: "How do I use Devicon in React or Next.js?",
      a: "Three approaches: (1) Add the CDN stylesheet and use <i className='devicon-react-original colored'> class names. (2) Use SVG URLs in <img> tags. (3) Download specific SVGs and import them as React components using SVGR or next/image."
    },
    {
      q: "What icon variants are available?",
      a: "Most icons come in: original (full color logo), plain (single-color silhouette), and line (outline only). Many also have -wordmark versions that include the technology name text beneath the logo."
    },
    {
      q: "How do I request a new technology icon?",
      a: "Open an issue on the Devicon GitHub repository (github.com/devicons/devicon) with the technology name and reference logo. The community regularly adds new icons through pull requests."
    },
    {
      q: "What is the difference between Devicon and Simple Icons?",
      a: "Simple Icons focuses on brand logos broadly (social media, companies, products) with 3,200+ monochrome icons. Devicon focuses specifically on developer tools and programming languages with 800+ icons in multiple color variants. For a tech stack display, Devicon's colored originals are usually better."
    },
  ],
  alternatives: ["simple-icons", "material-icons", "iconify-carbon", "font-awesome"],
  links: {
    github: "https://github.com/devicons/devicon",
    website: "https://devicon.dev",
    npm: "https://www.npmjs.com/package/devicon",
    figma: "",
  }
}
