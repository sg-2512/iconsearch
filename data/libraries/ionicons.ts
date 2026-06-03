export const ioniconsData = {
  name: "IonIcons",
  slug: "ionicons",
  tagline: "Premium, carefully designed icons for mobile, desktop, and web applications",
  description: {
    intro: "IonIcons is an exceptionally polished, open-source icon pack designed by the Ionic Framework team. Built primarily for developers creating premium mobile and web interfaces, it contains over 1,300 icons that feel right at home in modern iOS, Android, and web products.",
    detail: "The library is unique in providing three distinct design styles for every single icon: Outline, Filled, and Sharp. Outline icons use thin strokes, Filled icons provide bold visual weight for active tabs or selections, and Sharp icons feature crisp, non-rounded edges suitable for technical dashboards and heavy-contrast visual grids.",
    technical: "Although maintained by the Ionic team, IonIcons is entirely framework-agnostic. The official react-ionicons and ionicons NPM libraries provide full tree-shaking and modern TypeScript typings, rendering clean inline SVGs without layout blocking. SVGs use the standard currentColor attribute to inherit styling colors dynamically.",
    verdict: "IonIcons is a top-tier alternative to Google's Material Icons. It delivers a cleaner, more contemporary look. The presence of iOS-inspired rounded outlines and Android-inspired sharp options makes it the ultimate library if you are building responsive, multi-platform hybrid React Native or web applications."
  },
  stats: {
    iconCount: 1300,
    stars: 17200,
    weeklyDownloads: 480000,
    license: "MIT",
    firstRelease: "2015",
    latestVersion: "7.4.0",
    bundleSize: "~1.2kb per icon",
    openIssues: 120,
  },
  installation: {
    react: {
      package: "react-ionicons",
      command: "npm install react-ionicons",
      yarn: "yarn add react-ionicons",
      pnpm: "pnpm add react-ionicons",
    },
    nextjs: {
      package: "react-ionicons",
      command: "npm install react-ionicons",
      note: "Fully compatible with Next.js Server Components. Can be dynamically imported to eliminate layout shift or used natively in client wrappers for interactive hover effects.",
    },
    vue: {
      package: "N/A",
      command: "// No official Vue wrapper — render raw SVGs or use Iconify prefix 'ion:' instead",
    },
    svelte: {
      package: "N/A",
      command: "// No official Svelte package — use raw SVG or Iconify component",
    },
    vanilla: {
      package: "ionicons",
      command: "npm install ionicons\n\n// Load directly via CDN in HTML:\n<script type='module' src='https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js'></script>",
    }
  },
  codeExamples: {
    basic: `import { HomeOutline, BellOutline, PersonOutline } from 'react-ionicons'
 
export default function App() {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <HomeOutline color={'#000000'} height="24px" width="24px" />
      <BellOutline color={'#6366f1'} height="24px" width="24px" />
      <PersonOutline color={'#6b7280'} height="24px" width="24px" />
    </div>
  )
}`,
    solidVariant: `// Filled variants are ideal for navigation active states
import { Home, HomeOutline } from 'react-ionicons'
 
export default function Tab({ isActive }) {
  return (
    <button>
      {isActive ? (
        <Home color={'#818cf8'} height="24px" width="24px" />
      ) : (
        <HomeOutline color={'#6b7280'} height="24px" width="24px" />
      )}
      <span>Home</span>
    </button>
  )
}`,
    sharpVariant: `// Use Sharp variants for rigid layouts or technical grids
import { BarChartSharp, SettingsSharp } from 'react-ionicons'
 
export default function TechnicalDashboard() {
  return (
    <div>
      <BarChartSharp color={'#10b981'} height="20px" width="20px" />
      <SettingsSharp color={'#ec4899'} height="20px" width="20px" />
    </div>
  )
}`,
  },
  pros: [
    { title: "Three styles per icon", detail: "Provides Outline, Filled, and Sharp styles for all icons, enabling smooth active/inactive transitions in tab bars." },
    { title: "Excellent iOS & Android styles", detail: "Visual language mimics native Apple and Google system icons perfectly, making it ideal for mobile/hybrid apps." },
    { title: "Commercially safe MIT license", detail: "100% free for use in commercial SaaS apps, web templates, and client projects without royalties or attribution." },
    { title: "High-quality vector balance", detail: "Perfect curve rendering and clean paths ensure icons remain crisp even at tiny sizes like 16px." },
    { title: "Clean React wrapper", detail: "Official react-ionicons NPM package offers individual exports supporting custom height, width, and color props." },
  ],
  cons: [
    { title: "Inconsistent React wrapper updates", detail: "The react-ionicons React package is sometimes updated slower than the core HTML package." },
    { title: "No native Vue/Svelte bindings", detail: "Unlike Lucide, there are no official bindings for Vue or Svelte. Developers must use CDN or raw SVGs." },
    { title: "Height/Width props are strings", detail: "The React package accepts height/width as strings (e.g., '24px') instead of numbers, which can cause minor style quirks." },
    { title: "Larger bundle if not tree-shaken", detail: "Must be bundled via modern tools (Vite, Webpack 5, Turbopack) to prevent compiling the entire pack into code." },
  ],
  whoShouldUse: [
    "Developers building cross-platform hybrid mobile apps (React Native, Capacitor, Cordova)",
    "Projects needing explicit outline, solid, and sharp style options",
    "Teams looking for a clean, modern alternative to Material Design",
    "React developers who want quick custom color and height/width props on components",
    "SaaS apps that require a premium, iOS-like clean interface look",
  ],
  whoShouldNot: [
    "Pure Vue or Svelte projects wanting official package wrappers",
    "Technical developers who prefer numeric size props instead of string dimensions",
    "Applications looking for sketchy, hand-drawn, or playful icon designs",
    "Legacy websites that cannot use ES Modules or modern JS bundlers",
  ],
  faqs: [
    {
      q: "Can I use IonIcons on commercial SaaS platforms for free?",
      a: "Yes. IonIcons operates under the highly permissive MIT License. You are legally allowed to use it for personal, commercial, and enterprise SaaS systems without paying any fees or including mandatory attribution."
    },
    {
      q: "What is the difference between IonIcons Outline, Filled, and Sharp?",
      a: "Outline uses simple lines (perfect for default states). Filled uses bold filled areas (great for selected tabs or emphasis). Sharp features non-rounded corners (ideal for modern sharp grids and geometric dashboard UIs)."
    },
    {
      q: "Does react-ionicons support Next.js Server Components?",
      a: "Yes. IonIcons SVG exports are fully compatible with Next.js App Router and render as static SVG markup directly from server builds, minimizing client-side javascript overhead."
    },
    {
      q: "How do I change the color of an IonIcon component in React?",
      a: "You can change it directly by passing the 'color' prop with any valid hex or CSS color token: <HomeOutline color='#6366f1' />. Alternatively, you can use parent text color classes if you render the raw SVGs."
    },
  ],
  alternatives: ["material-icons", "lucide-icons", "phosphor-icons", "tabler-icons"],
  links: {
    github: "https://github.com/ionic-team/ionicons",
    website: "https://ionic.io/ionicons",
    npm: "https://www.npmjs.com/package/ionicons",
    figma: "",
  }
}
