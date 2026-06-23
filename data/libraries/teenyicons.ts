export const teenyiconsData = {
  name: "Teenyicons",
  slug: "teenyicons",
  tagline: "Tiny, minimalist 1px-stroke vector icons designed to fit beautifully in the smallest spaces.",
  description: {
    intro: "Teenyicons is a minimalist, open-source SVG icon library designed specifically for high-density interfaces, small utility menus, and mobile screen designs. Created with a unified 1px stroke weight on a compact 15x15 pixel grid, these icons remain perfectly sharp and highly legible even when scaled down to tiny sizes.",
    detail: "Every vector inside Teenyicons is meticulously structured to prevent anti-aliasing blur when rendered at small resolutions. The library is balanced cleanly between Outline (linear) and Solid variants. Because of its geometric simplicity, it serves as an excellent companion set for modern minimalist websites, clean dashboard components, or developer portfolio layouts.",
    technical: "Teenyicons is fully open-source under the MIT license. It is distributed via npm ('teenyicons'), standard CDNs, and as standard SVG paths. Since it is extremely lightweight, icons can be directly imported as inline SVG components, used with React wrappers, or loaded using Iconify's API using the 'teenyicons' prefix.",
    verdict: "If you need a highly visual, playful, or organic branding look, Teenyicons may feel too simple. However, for dense developer tools, sidebar layouts, command bars (such as cmd+K menus), or settings grids where space is at an absolute premium, Teenyicons is unmatched in its crisp minimalist layout."
  },
  stats: {
    iconCount: 1200,
    stars: 2100,
    weeklyDownloads: 15000,
    license: "MIT",
    firstRelease: "2020",
    latestVersion: "0.4.1",
    bundleSize: "Ultralight (<1kb per icon)",
    openIssues: 12,
  },
  installation: {
    react: {
      package: "teenyicons-react (or standard SVGs)",
      command: "npm install teenyicons",
      yarn: "yarn add teenyicons",
      pnpm: "pnpm add teenyicons",
    },
    nextjs: {
      package: "teenyicons",
      command: "npm install teenyicons",
      note: "Teenyicons works perfectly with next/image or by embedding SVGs directly into React components to ensure zero client-side bundle bloat.",
    },
    vue: {
      package: "teenyicons",
      command: "// Import raw SVG strings or use unplugin-icons with Teenyicons support",
    },
    svelte: {
      package: "teenyicons",
      command: "// Import SVG source files directly into Svelte templates",
    },
    vanilla: {
      package: "teenyicons",
      command: "<!-- Grab individual SVGs from jsDelivr CDN -->\n<img src=\"https://cdn.jsdelivr.net/npm/teenyicons@latest/outline/home.svg\" width=\"15\" height=\"15\" />",
    }
  },
  codeExamples: {
    basic: `// Using raw SVG markup directly or custom SVG wrapper
export function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 15 15" width="15" height="15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7.5L6.5 10L11 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}`,
    withTailwind: `// Tailwind integration with fixed 15x15 container alignment
export function MiniStatusBadge() {
  return (
    <div className="flex items-center gap-1 text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
      <span className="w-[15px] h-[15px] flex items-center justify-center">
        <svg viewBox="0 0 15 15" fill="none" className="w-[15px] h-[15px] stroke-current" strokeWidth="1">
          <path d="M4 7.5L6.5 10L11 4.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <span>Active</span>
    </div>
  );
}`,
    vanillaJS: `<!-- Import a Teenyicon directly via standard CDN -->
<img src="https://cdn.jsdelivr.net/npm/teenyicons@latest/outline/user.svg"
     width="15"
     height="15"
     alt="User" />`,
  },
  pros: [
    { title: "Designed for small spaces", detail: "Optimized specifically for a 15x15 grid, ensuring elements do not blur when scaled down." },
    { title: "Consistent 1px stroke weight", detail: "Maintains a highly unified visual language across all 1,200 icons without thick or uneven lines." },
    { title: "Both Solid & Outline variants", detail: "Features matching filled and outline versions for interactive selected/unselected states." },
    { title: "Completely MIT licensed", detail: "No licensing friction; completely free for commercial design systems and commercial apps." },
    { title: "Ultralight SVG footprint", detail: "Minimal node paths mean tiny file sizes and lightning-fast web render speeds." },
  ],
  cons: [
    { title: "Extremely simple aesthetic", detail: "Lacks detail or expressive characteristics, making them unsuitable for large hero graphics." },
    { title: "Limited framework wrappers", detail: "Requires importing SVGs directly or using standard loaders since there is no official custom component ecosystem." },
    { title: "Fixed stroke weight limitations", detail: "Designed natively at 1px stroke; scaling lines thicker in CSS may require adjusting vector viewport properties." },
  ],
  whoShouldUse: [
    "Developers building highly dense admin panels, tables, and settings dashboards",
    "Interfaces with compact navigation lists, context menus, and hover card panels",
    "Minimalist designers seeking an understated, visual signature that stays out of the user's way",
    "Mobile interfaces where screen space and visual clutter are primary design constraints",
  ],
  whoShouldNot: [
    "Websites needing highly illustrative, playful, or complex visual icons",
    "Design systems expecting pre-bundled, custom-typed React packages for every single icon wrapper",
    "Banners and landing pages where large, stylized graphic details are required",
  ],
  faqs: [
    {
      q: "What makes Teenyicons different from Lucide or Feather Icons?",
      a: "Lucide and Feather are designed on a 24x24 grid with a thicker 2px default stroke. Teenyicons are built on a tiny 15x15 grid with a thin 1px stroke, making them look significantly sharper when displayed at small sizes (e.g. 12px - 16px)."
    },
    {
      q: "How do I change the color of Teenyicons?",
      a: "Since the SVGs are configured with 'stroke=\"currentColor\"', they automatically inherit the parent element's CSS color value. You can change colors easily using Tailwind classes like 'text-red-500' or standard CSS styles."
    },
    {
      q: "Can I use Teenyicons in commercial projects?",
      a: "Yes. Teenyicons are licensed under the MIT License, which permits free use in both commercial and personal software."
    },
    {
      q: "What is the grid layout size?",
      a: "Every icon is built on a 15x15 pixel viewBox grid for pixel-perfect screen alignment."
    },
  ],
  alternatives: ["lucide-icons", "feather-icons", "radix-icons", "iconoir"],
  links: {
    github: "https://github.com/teenyicons/teenyicons",
    website: "https://teenyicons.com",
    npm: "https://www.npmjs.com/package/teenyicons",
    figma: "https://www.figma.com/community/file/857502446700684718",
  }
}
