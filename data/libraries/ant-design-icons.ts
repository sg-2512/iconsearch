export const antDesignIconsData = {
  name: "Ant Design Icons",
  slug: "ant-design-icons",
  tagline: "The definitive enterprise-grade icon system for complex React applications",
  description: {
    intro: "Ant Design Icons is the official, meticulously crafted icon set powering Ant Design (AntD), one of the world's most dominant and battle-tested React UI frameworks. Originally developed by Alibaba for their massive internal enterprise platforms, this library provides an incredibly comprehensive collection of icons designed specifically for data-dense dashboards, complex B2B SaaS applications, financial interfaces, and administrative panels where clarity and consistency are absolutely paramount.",
    history: "<strong>Origin & History:</strong> The Ant Design iconography system was first introduced in 2018 alongside the Ant Design component library by Alibaba's Ant Financial (now Ant Group) division. It was born out of sheer necessity: Alibaba needed a unified, massively scalable design language capable of supporting thousands of discrete, highly complex enterprise applications. Prior to its creation, enterprise dashboards were plagued by inconsistent icons stitched together from disparate libraries. Ant Design solved this by engineering a comprehensive icon system that mapped directly to specific data visualization and administrative needs.",
    focus: "<strong>Core Iconography Focus:</strong> Unlike consumer-focused libraries (like Heroicons) that prioritize friendly, rounded UI elements, Ant Design Icons is aggressively focused on B2B utility. A massive portion of the library is dedicated to data visualization (charts, funnels, projections), financial symbols (currencies, banking, transactions), and deep administrative controls (user roles, complex permissions, file management). It includes highly specific markers that other libraries ignore, making it the premier choice for complex data grids and dense control panels.",
    detail: "What truly separates Ant Design Icons from the vast sea of generic icon libraries is its strict adherence to a unified visual language and its unique tri-thematic approach. The library includes over 840 distinct icons, but almost every icon is offered in three highly polished stylistic themes: Outlined, Filled, and TwoTone. The 'Outlined' style provides a clinical, precise, and airy feel perfect for modern minimalist interfaces. The 'Filled' style offers visual weight and prominence, ideal for active states or primary navigation elements. However, the crown jewel is the 'TwoTone' variant—a rare feature in open-source libraries that allows developers to define both a primary and secondary color palette via props, enabling the creation of beautiful, illustrative micro-graphics without the overhead of custom SVGs. Every single icon is constructed on a strict, mathematically precise grid, ensuring pixel-perfect alignment when placed alongside typography and other Ant Design UI components.",
    technical: "From an engineering perspective, the official `@ant-design/icons` package is an exemplar of modern React library architecture. Unlike older monolithic libraries that bloat your application, Ant Design Icons provides individual, self-contained React components for every icon (e.g., `HomeOutlined`, `SettingFilled`). This guarantees optimal tree-shaking performance—your bundler will only include the precise SVGs you actually import, keeping your production JavaScript bundle lean. Furthermore, the library offers dynamic icon loading capabilities, SVG symbol generation for advanced performance use-cases, and ships with comprehensive TypeScript definitions out of the box. While the icons were architected specifically to integrate seamlessly with the Ant Design component library, they are fundamentally framework-agnostic SVGs wrapped in React components, meaning they perform flawlessly in any React, Next.js, or Remix application, regardless of whether you use Tailwind CSS, Styled Components, or plain CSS modules.",
    verdict: "If your project is already utilizing the Ant Design UI framework, adopting `@ant-design/icons` is the undeniable default choice to maintain visual harmony. However, even if you are building a custom UI from scratch, Ant Design Icons remains a top-tier contender for enterprise SaaS products, analytics dashboards, and any application that demands a massive, unified iconography system with multiple stylistic weights. The clinical precision of the designs and the incredible flexibility of the TwoTone variants make it a robust, professional-grade solution that scales effortlessly from rapid prototypes to global enterprise platforms."
  },
  stats: {
    iconCount: 840,
    stars: 8700,
    weeklyDownloads: 1900000,
    license: "MIT",
    firstRelease: "2018",
    latestVersion: "5.14.0",
    bundleSize: "~1.5kb per icon",
    openIssues: 45,
  },
  installation: {
    react: {
      package: "@ant-design/icons",
      command: "npm install @ant-design/icons",
      yarn: "yarn add @ant-design/icons",
      pnpm: "pnpm add @ant-design/icons",
    },
    nextjs: {
      package: "@ant-design/icons",
      command: "npm install @ant-design/icons",
      note: "Fully compatible with Next.js App Router and Server Components. For Server-Side Rendering (SSR), ensure you are using named imports to prevent layout shifts and maximize tree-shaking efficiency.",
    },
    vue: {
      package: "@ant-design/icons-vue",
      command: "npm install @ant-design/icons-vue",
    },
    vanilla: {
      package: "@ant-design/icons-svg",
      command: "npm install @ant-design/icons-svg",
    }
  },
  codeExamples: {
    basic: `import { HomeOutlined, SettingFilled, SmileTwoTone } from '@ant-design/icons'

export default function DashboardHeader() {
  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      {/* Standard outline style for neutral UI elements */}
      <HomeOutlined style={{ fontSize: '24px', color: '#595959' }} />
      
      {/* Filled style for active or highly prominent states */}
      <SettingFilled style={{ fontSize: '24px', color: '#1890ff' }} />
      
      {/* TwoTone allows for beautiful primary/secondary color combinations */}
      <SmileTwoTone 
        style={{ fontSize: '32px' }} 
        twoToneColor={['#1890ff', '#e6f7ff']} 
      />
    </div>
  )
}`,
    withTailwind: `import { BellOutlined, SearchOutlined } from '@ant-design/icons'

export default function GlobalNav() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="relative">
        <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input 
          type="text" 
          placeholder="Search records..." 
          className="pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
        <BellOutlined className="text-2xl" />
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
    </nav>
  )
}`,
    nextjs: `// app/analytics/page.tsx
import { BarChartOutlined, FallOutlined, RiseOutlined } from '@ant-design/icons'

export default function AnalyticsDashboard() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-3">
        <BarChartOutlined className="text-blue-600" />
        Performance Metrics
      </h1>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 bg-green-50 rounded-lg border border-green-100">
          <p className="text-green-800 font-medium flex items-center gap-2">
            <RiseOutlined /> Revenue Up 24%
          </p>
        </div>
        <div className="p-6 bg-red-50 rounded-lg border border-red-100">
          <p className="text-red-800 font-medium flex items-center gap-2">
            <FallOutlined /> Churn Increased 2%
          </p>
        </div>
      </div>
    </main>
  )
}`,
  },
  pros: [
    { title: "Three Distinct Visual Themes", detail: "The inclusion of Outlined, Filled, and TwoTone variants gives you incredible design flexibility. You can use Outlined for standard states, Filled for active states, and TwoTone for empty states or illustrations, all without ever needing to mix disparate icon libraries." },
    { title: "Battle-Tested Enterprise Grade", detail: "These icons have been rigorously tested and refined across thousands of massive, data-dense enterprise products by Alibaba and the global AntD community. They are designed specifically to remain legible in highly complex interfaces." },
    { title: "Incredibly Comprehensive Coverage", detail: "From basic UI actions (arrows, settings) to highly specific data visualization symbols, financial icons, e-commerce symbols, and obscure technical markers, Ant Design offers an exceptionally deep vocabulary." },
    { title: "Highly Optimized React Components", detail: "The library provides highly optimized, standalone React components that natively support custom styling via standard `style` and `className` props, ensuring smooth integration with any CSS methodology." },
    { title: "Unmatched TwoTone Capabilities", detail: "The TwoTone icons are a standout feature. They allow you to define primary and secondary colors dynamically via the `twoToneColor` prop, creating beautiful, brand-aligned micro-illustrations instantly." },
  ],
  cons: [
    { title: "Highly Opinionated Clinical Aesthetic", detail: "The icons are specifically tailored for the strict, geometric Ant Design visual language. They can look overly rigid or out of place if your application's UI leans heavily into rounded corners, playful typography, or soft, organic shapes." },
    { title: "No Explicit Mini Variants", detail: "Unlike Heroicons which offers explicitly redrawn 20x20 and 24x24 grids for different scales, Ant Design relies entirely on mathematical CSS scaling for smaller contexts, which can occasionally impact pixel-perfection at ultra-small sizes." },
    { title: "Potential Bundle Bloat on Misuse", detail: "Because the library is so massive, if you fail to configure your bundler correctly and utilize wildcard imports (e.g., `import * as Icons`), you risk pulling the entire massive SVG library into your client bundle." },
  ],
  whoShouldUse: [
    "Teams building complex enterprise software, B2B SaaS platforms, or data-heavy administrative dashboards.",
    "Any engineering team already utilizing the Ant Design (AntD) React component library.",
    "Developers who require the illustrative power of TwoTone icons that can be colored dynamically via React props.",
    "Projects that demand a highly consistent, clinical, geometric, and rigorously professional aesthetic.",
  ],
  whoShouldNot: [
    "Consumer-facing applications aiming for a playful, friendly, organic, or heavily rounded design language.",
    "Minimalist marketing websites where ultra-lightweight outline icons (like Lucide or Feather) would feel more appropriate.",
    "Mobile-first applications that require extremely thick, chunky iconography for tap targets.",
  ],
  faqs: [
    {
      q: "Are Ant Design Icons completely free for commercial use?",
      a: "Yes, absolutely. The Ant Design Icons library is fully open-source and released under the highly permissive MIT license. This makes them entirely free for both personal and commercial projects, with no attribution required in the UI."
    },
    {
      q: "Do I have to use the Ant Design UI framework to use these icons?",
      a: "No, not at all! The `@ant-design/icons` package is completely standalone and isolated from the main AntD component library. You can use it in any React project regardless of whether you use Tailwind, Material UI, Bootstrap, or plain CSS."
    },
    {
      q: "How do I color the TwoTone icons properly?",
      a: "TwoTone icons accept a special `twoToneColor` prop. For a single primary color, pass a string: `<SmileTwoTone twoToneColor=\"#eb2f96\" />`. If you want full control over both colors, pass an array: `twoToneColor={['#1890ff', '#e6f7ff']}` where the first is primary and second is the secondary fill."
    },
    {
      q: "How do I make Ant Design Icons bigger or smaller?",
      a: "Unlike some libraries that use a specific `size` prop, Ant Design Icons natively scale with the CSS `font-size` property. You can adjust their size using inline styles like `style={{ fontSize: '32px' }}` or by using utility classes like Tailwind's `text-3xl` or `text-[40px]`."
    },
    {
      q: "Why are my Ant Design icons not tree-shaking, making my bundle huge?",
      a: "This is almost always due to incorrect import syntax. Ensure you are using specific named imports from the root package, like `import { HomeOutlined } from '@ant-design/icons'`. Do not use default wildcard imports, as that instructs your bundler to evaluate the entire library."
    },
    {
      q: "Can I use Ant Design Icons in Vue or vanilla HTML?",
      a: "Yes! While the React package is the most popular, there are official companion packages: `@ant-design/icons-vue` for Vue 3 applications, and `@ant-design/icons-svg` which provides the raw SVG definitions for vanilla HTML/JS usage."
    }
  ],
  alternatives: ["lucide-icons", "heroicons", "tabler-icons", "material-icons"],
  links: {
    github: "https://github.com/ant-design/ant-design-icons",
    website: "https://ant.design/components/icon",
    npm: "https://www.npmjs.com/package/@ant-design/icons",
    figma: "https://www.figma.com/community/plugin/830634676504289839/ant-design-icons",
  }
}
