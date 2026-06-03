export const octiconsData = {
  name: "Octicons",
  slug: "octicons",
  tagline: "GitHub's official icon set for developer dashboards and code utilities",
  description: {
    intro: "Octicons is GitHub's official open-source icon library, designed specifically to support developer-centric UI patterns, code workflows, and technical dashboard interfaces. Used daily by millions of developers on github.com, it is the ultimate standard for clean, technical iconography.",
    detail: "Unlike general icon packs, Octicons features specialized coding symbols such as repositories, branches, pull requests, git commits, code tags, issues, and terminal symbols. The layout is optimized across two grid designs (16px and 24px), ensuring that tiny text inline elements remain perfectly legible without blurriness.",
    technical: "Octicons provides first-class support for React, Vue, and Jekyll through official NPM wrappers like @primer/octicons-react. It includes built-in TypeScript definitions, handles SVGs with semantic accessibility properties, and fully supports modern build system tree-shaking.",
    verdict: "Octicons is the absolute best choice if you are building developer tools, cloud dashboards, deployment trackers, or git-related interfaces. Because developers interact with GitHub daily, using Octicons in your product creates instant, subconscious familiarity, making your UI feel reliable and intuitive."
  },
  stats: {
    iconCount: 280,
    stars: 10400,
    weeklyDownloads: 1200000,
    license: "MIT",
    firstRelease: "2012",
    latestVersion: "19.8.0",
    bundleSize: "~0.8kb per icon",
    openIssues: 54,
  },
  installation: {
    react: {
      package: "@primer/octicons-react",
      command: "npm install @primer/octicons-react",
      yarn: "yarn add @primer/octicons-react",
      pnpm: "pnpm add @primer/octicons-react",
    },
    nextjs: {
      package: "@primer/octicons-react",
      command: "npm install @primer/octicons-react",
      note: "Octicons React components are fully compatible with Next.js App Router. They render natively as lightweight Server Components without hydration overhead.",
    },
    vue: {
      package: "@primer/octicons-vue",
      command: "npm install @primer/octicons-vue",
    },
    svelte: {
      package: "N/A",
      command: "// No official Svelte package — use raw SVG or Iconify prefix 'octicon:'",
    },
    vanilla: {
      package: "@primer/octicons",
      command: "npm install @primer/octicons\n\n// Access individual SVG data programmatically in Node.js:\nconst octicons = require('@primer/octicons')",
    }
  },
  codeExamples: {
    basic: `import { RepoIcon, GitPullRequestIcon, IssueOpenedIcon } from '@primer/octicons-react'
 
export default function App() {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <RepoIcon size={24} className="text-gray-500" />
      <GitPullRequestIcon size={16} className="text-green-500" />
      <IssueOpenedIcon size={16} className="text-red-500" />
    </div>
  )
}`,
    sizingAndAccessibility: `// Octicons support strict size scales and built-in accessibility descriptions
import { ShieldCheckIcon } from '@primer/octicons-react'
 
export default function SecurityStatus() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <ShieldCheckIcon 
        size="medium" // 'small' (16px), 'medium' (24px)
        aria-label="Security check passed" 
        className="text-green-400" 
      />
      <span>Your connection is secure</span>
    </div>
  )
}`,
    technicalStats: `// Git workflow representation in code
import { GitCommitIcon, GitBranchIcon } from '@primer/octicons-react'
 
export default function DeploymentSummary({ commitHash, branchName }) {
  return (
    <div style={{ fontFamily: 'monospace', fontSize: '13px' }}>
      <div>
        <GitBranchIcon size={16} style={{ marginRight: '6px' }} />
        Branch: {branchName}
      </div>
      <div>
        <GitCommitIcon size={16} style={{ marginRight: '6px' }} />
        Commit: {commitHash}
      </div>
    </div>
  )
}`,
  },
  pros: [
    { title: "Designed for developers", detail: "Contains specialized git, terminal, and dashboard icons not found in typical design libraries." },
    { title: "Dual grid alignment", detail: "Optimized specifically for 16px and 24px screens, avoiding blurry pixel layout rendering at small sizes." },
    { title: "Robust React & Vue support", detail: "Maintained directly by GitHub's Primer design systems team, ensuring high-quality official NPM packages." },
    { title: "Permissive MIT license", detail: "Free to use in commercial tools, SaaS dashboards, and closed-source enterprise projects." },
    { title: "Accessible design standards", detail: "Built-in accessibility support with custom aria properties and semantic SVG tags." },
  ],
  cons: [
    { title: "Limited icon variety", detail: "With only 280 icons, it is focused on developer tools and lacks generic UI/SaaS lifestyle elements." },
    { title: "Strict design language", detail: "Highly specific aesthetic that may feel too technical or rigid for consumer-facing landing pages." },
    { title: "No Svelte package", detail: "No official Svelte bindings are maintained by the Primer team." },
    { title: "No colored/duotone options", detail: "All icons are strictly monochrome, single-stroke SVGs." },
  ],
  whoShouldUse: [
    "Developers building developer tooling, cloud consoles, or git dashboards",
    "Projects requiring high legibility at tiny font sizes (like 14px sidebar lists)",
    "Teams looking for instant visual trust from technical users familiar with GitHub",
    "React and Next.js developers who need first-class TypeScript autocomplete support",
  ],
  whoShouldNot: [
    "Lifestyle, e-commerce, or creative agencies looking for highly artistic styles",
    "Projects requiring colorful, multitone, or complex 3D icons",
    "Mobile apps targeting non-technical consumer demographics",
  ],
  faqs: [
    {
      q: "Can I use GitHub Octicons on commercial products?",
      a: "Yes. Octicons is licensed under the MIT License, which means you are legally allowed to use, copy, modify, and distribute these icons in any commercial software, SaaS, or website without paying licensing fees."
    },
    {
      q: "How does Octicons handle scaling and sizes in React?",
      a: "The React package allows you to pass a numeric 'size' prop (e.g. size={16}) or string keywords ('small' for 16px, 'medium' for 24px) to ensure sharp rendering. It loads specific pixel-grid variations under the hood to prevent subpixel scaling issues."
    },
    {
      q: "Does @primer/octicons-react work with Next.js Server Components?",
      a: "Yes, absolutely. The Octicons React component outputs static SVG elements, making it 100% compatible with Next.js App Router and Server Components without requiring client-side JS."
    },
    {
      q: "What license covers Octicons icons vs Octicons code?",
      a: "Both the SVG icon files and the NPM code wrappers are released under the MIT License. The GitHub trademark itself remains protected, but the icons can be used freely."
    },
  ],
  alternatives: ["lucide-icons", "radix-icons", "feather-icons", "tabler-icons"],
  links: {
    github: "https://github.com/primer/octicons",
    website: "https://primer.style/octicons/",
    npm: "https://www.npmjs.com/package/@primer/octicons-react",
    figma: "",
  }
}
