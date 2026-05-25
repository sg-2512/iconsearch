---
title: "Iconify in React — The Complete Guide for 2026 (294,000+ Icons, One API)"
slug: iconify-react-complete-guide-2026
date: "2026-05-25"
author: IconSearch Team
category: GUIDE
featured: true
description: "Everything you need to know about using Iconify in React and Next.js in 2026. Installation, tree-shaking, offline bundles, SSR, performance benchmarks, and when to use Iconify over Lucide, Heroicons, or react-icons."
tags:
  - iconify
  - react
  - nextjs
  - icons
  - performance
  - typescript
  - svg
  - bundle-size
canonical: https://iconsearch.info/blog/iconify-react-complete-guide-2026
meta-og:title: "Iconify in React — The Complete Guide for 2026"
meta-og:description: "294,000+ icons, one API. Learn how to install, configure, and ship Iconify in React and Next.js with zero render-blocking, offline support, and full TypeScript coverage."
---

# Iconify in React — The Complete Guide for 2026 (294,000+ Icons, One API)

Most React developers pick one icon library and live with its limitations. Heroicons gives you 292 clean icons but nothing else. Tabler gives you 5,500 but a single visual style. react-icons bundles everything into one enormous package that requires discipline to keep lean.

Iconify takes a different position entirely: **294,000+ icons from 211 open-source sets, accessed through a single unified component, with no lock-in to any one visual style.**

This guide covers everything — how Iconify works under the hood, the four different ways to install it, how to avoid the runtime API fetch pitfall that kills offline apps, real bundle-size numbers, SSR behaviour in Next.js App Router, and when Iconify is the wrong choice. No filler, no padding.

---

## What Is Iconify?

Iconify is an open-source icon framework created by Vjacheslav Tratsevski (cyberalien). It is not an icon library itself. It is a **delivery system and unified API** for icons from other libraries.

The core concept is simple: every icon in every supported set (Lucide, Material Design, Font Awesome Free, Tabler, Heroicons, Phosphor, Bootstrap Icons, Simple Icons, and 200+ more) gets a `prefix:name` identifier. You use that identifier with the `<Icon>` component, and Iconify resolves it.

```tsx
import { Icon } from "@iconify/react";

// Lucide's camera icon
<Icon icon="lucide:camera" />

// Material Design's home icon
<Icon icon="mdi:home" />

// Tabler's brand-github icon
<Icon icon="tabler:brand-github" />

// Heroicons solid check-circle
<Icon icon="heroicons-solid:check-circle" />
```

One import. Four different icon sets. No additional packages.

---

## How Iconify Loads Icons

Understanding the loading mechanism is the most important thing to get right before you ship Iconify in production.

### Mode 1 — Runtime API (Default, Avoid in Production)

Out of the box, `@iconify/react` fetches missing icon data from `api.iconify.design` the first time a component renders an icon it hasn't seen before. The fetch is cached globally in the browser session, so each icon only downloads once.

This works fine in prototypes. It is a problem in production for three reasons:

1. **Render flash.** The icon slot is empty for the duration of the fetch (~50–200ms depending on geography). This is visible to users.
2. **Offline failure.** Icons do not render in offline or poor-connectivity environments.
3. **Privacy.** Requests go to an external server, which some compliance contexts prohibit.

Do not use runtime API mode in production unless your app genuinely runs in an always-connected environment and render flashes are acceptable.

### Mode 2 — Offline Bundle (Recommended)

Iconify provides pre-built JSON data packages for every icon set:

```bash
npm install @iconify/react @iconify-json/lucide @iconify-json/mdi @iconify-json/tabler
```

Then register icon data once, at app entry:

```tsx
// app/layout.tsx or _app.tsx
import { addCollection } from "@iconify/react";
import lucideIcons from "@iconify-json/lucide/icons.json";
import mdiIcons from "@iconify-json/mdi/icons.json";

addCollection(lucideIcons);
addCollection(mdiIcons);
```

After this, every `<Icon icon="lucide:camera" />` or `<Icon icon="mdi:home" />` renders synchronously with zero network requests. This is the correct production pattern.

### Mode 3 — Icon-Level Imports (Best for Bundle Size)

If you use only a handful of icons from a set, import them individually using Iconify's icon data objects:

```tsx
import { Icon } from "@iconify/react";
import cameraIcon from "@iconify-json/lucide/icons/camera.json";
import homeIcon from "@iconify-json/mdi/icons/home.json";

// Inline the data directly — no fetch, no full JSON bundle
<Icon icon={cameraIcon} />
<Icon icon={homeIcon} />
```

This approach gives you perfect tree-shaking. Only the icons you import end up in your bundle.

### Mode 4 — SVG Framework (Non-React)

For vanilla HTML or server-rendered pages, Iconify provides a JavaScript framework that scans the DOM for `data-icon` attributes and replaces them. This guide focuses on React, so Mode 4 is out of scope — but know it exists for multi-stack setups.

---

## Installation

### React (Vite, CRA, or any bundler)

```bash
npm install @iconify/react
```

That's all you need to start. For production, add the icon set JSON packages you plan to use:

```bash
# Common starter set
npm install @iconify-json/lucide @iconify-json/heroicons @iconify-json/tabler
```

### Next.js App Router

```bash
npm install @iconify/react @iconify-json/lucide
```

Create a client component for icon registration to keep server components clean:

```tsx
// components/IconProvider.tsx
"use client";

import { useEffect } from "react";
import { addCollection } from "@iconify/react";
import lucideData from "@iconify-json/lucide/icons.json";

export function IconProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    addCollection(lucideData);
  }, []);

  return <>{children}</>;
}
```

Wrap your root layout:

```tsx
// app/layout.tsx
import { IconProvider } from "@/components/IconProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <IconProvider>{children}</IconProvider>
      </body>
    </html>
  );
}
```

---

## TypeScript Support

`@iconify/react` ships with full TypeScript definitions. The `Icon` component accepts the `IconifyIcon` type for inline icon data or a string for `prefix:name` identifiers.

```tsx
import type { IconifyIcon } from "@iconify/types";
import { Icon } from "@iconify/react";

interface ButtonProps {
  label: string;
  icon: string | IconifyIcon;
}

function IconButton({ label, icon }: ButtonProps) {
  return (
    <button className="flex items-center gap-2">
      <Icon icon={icon} width={20} height={20} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
```

For stricter typing, you can narrow the `icon` prop to a union of literal string prefixes using a custom type guard, though most teams leave it as `string` for flexibility.

---

## Styling Iconify Icons

Iconify icons inherit `currentColor` for their stroke and fill by default, meaning they respond to CSS `color` the same as text.

```tsx
// Color via Tailwind
<Icon icon="lucide:heart" className="text-red-500" width={24} height={24} />

// Color via inline style
<Icon icon="mdi:home" style={{ color: "#6366f1" }} width={24} />

// Color via CSS variable
<Icon icon="tabler:settings" style={{ color: "var(--icon-color)" }} />
```

### Sizing

Set `width` and `height` props directly on `<Icon>`. Avoid controlling size through CSS `font-size` as you would with icon fonts — Iconify renders SVG, not a glyph.

```tsx
// Explicit size
<Icon icon="lucide:search" width={16} height={16} />

// Square shorthand — width only, height matches
<Icon icon="lucide:search" width={20} />
```

---

## Accessibility

Every icon needs an accessibility treatment. There are two cases:

**Decorative icon (has adjacent label text):**

```tsx
<button>
  <Icon icon="lucide:trash-2" width={20} aria-hidden="true" />
  <span>Delete file</span>
</button>
```

**Standalone icon (no visible label):**

```tsx
<button aria-label="Delete file">
  <Icon icon="lucide:trash-2" width={20} />
</button>
```

Iconify renders clean `<svg>` elements with no extra wrappers. You can add `role="img"` and `aria-label` directly to `<Icon>` and they pass through to the SVG:

```tsx
<Icon
  icon="lucide:alert-triangle"
  width={24}
  role="img"
  aria-label="Warning"
/>
```

---

## Bundle Size — Real Numbers

This is the question that matters most for production apps. Here is what actually ends up in your bundle under each approach.

| Approach | Icons Used | Gzipped Bundle Addition |
|---|---|---|
| `@iconify/react` only (runtime mode, no JSON) | 0 icons bundled | ~8 KB |
| `@iconify-json/lucide` full collection | 1,400 icons | ~210 KB |
| Icon-level imports (individual JSON files) | 10 icons | ~12 KB |
| `react-icons` (all FA icons, no tree-shaking) | 50 icons | ~81 KB |
| `lucide-react` (tree-shaken, 50 icons) | 50 icons | ~5 KB |

**The verdict:** If you need icons from a single set like Lucide, `lucide-react` with tree-shaking wins on bundle size. If you need icons from multiple libraries simultaneously — say Lucide for UI, Simple Icons for brand logos, and Tabler for data visualisation — Iconify's icon-level imports become the most efficient option.

The full `@iconify-json/lucide` package is 210 KB gzipped. That is brutal if you only use 20 icons. Always use icon-level imports or manual `addCollection` with subsetting when bundle size matters.

---

## Subsetting Icon Collections

Rather than registering an entire `icons.json` collection, build a subset at import time:

```tsx
import { addCollection } from "@iconify/react";

// Only register the icons your app uses
addCollection({
  prefix: "lucide",
  icons: {
    camera: (await import("@iconify-json/lucide/icons/camera.json")).default.body,
    home: (await import("@iconify-json/lucide/icons/home.json")).default.body,
    settings: (await import("@iconify-json/lucide/icons/settings.json")).default.body,
  },
  width: 24,
  height: 24,
});
```

For larger projects, generate this subset file at build time using a script that scans your codebase for `icon="lucide:*"` strings and extracts only those entries from the JSON. This technique can reduce your icon payload from 210 KB to under 15 KB for a typical app.

---

## Server-Side Rendering in Next.js

`@iconify/react` version 4+ renders icons synchronously on the server when icon data is available. If you register collections before rendering (see the `addCollection` pattern above), icons appear in the initial HTML with no hydration gap.

The common mistake is calling `addCollection` inside a `useEffect` — this runs client-side only, causing a flash on first render identical to the runtime API problem.

**Correct SSR pattern for App Router:**

```tsx
// app/icons.ts — server-safe, no "use client"
import { addCollection } from "@iconify/react/dist/offline";
import lucideData from "@iconify-json/lucide/icons.json";

addCollection(lucideData);
```

Note the `/dist/offline` import path. This variant of `@iconify/react` does not include the runtime API fetch code, making it safe to import in server components without bundling fetch logic into the server bundle.

---

## When to Use Iconify Over Dedicated Libraries

Iconify is the right choice when:

- **You need icons from multiple visual styles.** A SaaS dashboard that uses Lucide for navigation, Simple Icons for tech-stack logos, and Phosphor for decorative illustration cannot be served by any single-library solution cleanly.
- **You are building a component library or design system.** Iconify's prefix-based API lets consumers bring their preferred icon set without you hard-coding a dependency.
- **You prototype rapidly across multiple projects.** One package, all icon sets, no per-project decision fatigue.
- **You use Iconify's search tooling.** [iconsearch.info/icon-search](https://iconsearch.info/icon-search) lets you find an icon, copy its `prefix:name`, and paste it directly.

Iconify is **not** the right choice when:

- **Bundle size is your primary constraint and you use one set.** `lucide-react` tree-shaken to 20 icons is smaller than any Iconify setup.
- **You need guaranteed visual consistency.** Mixing icon sets is Iconify's strength and its design risk. Heroicons and Tabler look nothing alike — using both in one UI creates visual incoherence unless you are deliberate.
- **Your runtime environment restricts network access.** The default mode's API fetch is a red flag in locked-down environments — though the offline bundle pattern resolves this.

---

## Comparing Iconify to react-icons

Both solve the multi-library problem. The differences matter.

| | Iconify | react-icons |
|---|---|---|
| Icon sets | 211 | 40+ |
| Total icons | 294,000+ | 40,000+ |
| Default loading | Runtime API fetch | All bundled |
| Tree-shaking | Excellent (icon-level) | Good (named exports) |
| SSR support | Yes (offline mode) | Yes |
| TypeScript | Full | Full |
| Bundle size (50 icons, 3 sets) | ~18 KB | ~45 KB |
| License | MIT (framework) | MIT |

react-icons bundles icon data statically. There is no network request. The downside is that even with tree-shaking, each icon import pulls in the entire react-icons library's runtime wrapper, which adds overhead that Iconify avoids with its leaner core.

For teams that already know react-icons and use 1–2 libraries from it, switching is rarely worth the effort. For new projects or projects that need rare icon sets (Cryptocurrency icons, Game icons, Weather icons), Iconify's breadth wins.

---

## Animating Iconify Icons

Iconify icons are standard SVGs, so any CSS or JavaScript animation technique works on them.

### CSS Spin Animation

```tsx
import { Icon } from "@iconify/react";
import styles from "./spinner.module.css";

<Icon icon="lucide:loader-2" className={styles.spin} width={24} />
```

```css
/* spinner.module.css */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Framer Motion

```tsx
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const AnimatedIcon = motion(Icon);

<AnimatedIcon
  icon="lucide:heart"
  width={32}
  whileHover={{ scale: 1.3 }}
  whileTap={{ scale: 0.9 }}
  transition={{ type: "spring", stiffness: 400 }}
/>
```

---

## Dark Mode

Iconify icons use `currentColor` by default, so dark mode is handled entirely by your colour tokens — no special treatment needed.

```css
/* Light mode */
:root {
  --icon-primary: #1e293b;
}

/* Dark mode */
.dark {
  --icon-primary: #f1f5f9;
}
```

```tsx
<Icon icon="lucide:moon" style={{ color: "var(--icon-primary)" }} width={20} />
```

If you use Tailwind CSS with the `dark:` variant, `text-slate-800 dark:text-slate-100` on the `<Icon>` component works identically to how it works on text elements.

---

## Common Mistakes to Avoid

**1. Registering collections on every render.**  
Call `addCollection` once at app entry, not inside a component body or `useEffect` that runs repeatedly.

**2. Importing the full icon set JSON for a few icons.**  
`@iconify-json/mdi/icons.json` is over 2 MB uncompressed. Importing it to get 5 icons is a costly mistake. Use per-icon JSON imports.

**3. Forgetting `aria-hidden` on decorative icons.**  
Screen readers announce SVG elements by default in some browsers. Decorative icons that sit next to text labels should always carry `aria-hidden="true"`.

**4. Using string `prefix:name` without registering data in SSR.**  
String identifiers trigger a runtime lookup. If the icon data isn't registered server-side, the SSR output will be empty and the client will flash on hydration.

**5. Mixing incompatible visual styles without a clear system.**  
Iconify makes mixing easy. That doesn't mean it's always a good idea. Document which icon sets your project uses and for what purpose, so future contributors don't add a fourth style.

---

## Frequently Asked Questions

### Is Iconify free to use commercially?

The `@iconify/react` framework is MIT licensed. The icon sets themselves retain their original licenses — Lucide is ISC, Font Awesome Free is CC BY 4.0, and so on. Check [iconsearch.info/licenses](https://iconsearch.info/licenses) for a full breakdown of every set's license terms.

### Does Iconify work with Tailwind CSS v4?

Yes. Since Iconify renders standard SVG elements, Tailwind utility classes like `text-blue-500`, `size-6`, and `dark:text-white` work without any configuration.

### Can I use Iconify with shadcn/ui?

Yes. shadcn/ui defaults to `lucide-react`, but it does not enforce it. Replace Lucide imports with Iconify components using `icon="lucide:..."` identifiers and the visual result is identical. See [iconsearch.info/blog/best-icons-for-shadcn-ui-2026](https://iconsearch.info/blog/best-icons-for-shadcn-ui-2026) for the full shadcn/ui guide.

### How do I find the correct `prefix:name` for an icon?

Use [iconsearch.info/icon-search](https://iconsearch.info/icon-search). Search by concept, filter by icon set, and copy the Iconify identifier directly. Every library page on IconSearch includes the Iconify prefix for that set.

### What happens if Iconify's API is down (in runtime mode)?

Icons render as empty space. This is the primary reason to use offline bundle mode in production. The API is reliable, but depending on an external service for UI rendering is an unnecessary risk.

### Does Iconify support Vue and Svelte?

Yes. `@iconify/vue` and `@iconify/svelte` follow identical API conventions. Everything in this guide applies — different package name, same mental model.

---

## Quick Reference

```tsx
// Installation
npm install @iconify/react @iconify-json/lucide @iconify-json/tabler

// Register at app entry (once)
import { addCollection } from "@iconify/react";
import lucideData from "@iconify-json/lucide/icons.json";
addCollection(lucideData);

// Basic usage
import { Icon } from "@iconify/react";
<Icon icon="lucide:home" width={24} />

// With Tailwind
<Icon icon="lucide:search" className="text-slate-600 dark:text-slate-300" width={20} />

// Accessible, decorative
<Icon icon="lucide:check" width={16} aria-hidden="true" />

// Accessible, standalone
<button aria-label="Close dialog">
  <Icon icon="lucide:x" width={20} />
</button>

// Per-icon import (best tree-shaking)
import cameraIcon from "@iconify-json/lucide/icons/camera.json";
<Icon icon={cameraIcon} width={24} />
```

---

## Summary

Iconify is the most versatile icon solution available for React in 2026. Its 294,000-icon breadth and unified `prefix:name` API eliminate the library-switching overhead that fragments large codebases. The catch is setup discipline: use offline bundles or per-icon imports, register collections at app entry rather than in components, and pick icon sets intentionally rather than mixing them arbitrarily.

For projects that need one well-curated set, `lucide-react` or `@heroicons/react` remain leaner choices. For everything else — multi-style design systems, icon-heavy dashboards, component libraries meant to be shared — Iconify is the right tool and worth the additional setup investment.

**Related reading:**
- [Iconify library overview on IconSearch →](https://iconsearch.info/icons/iconify)
- [react-icons vs lucide-react comparison →](https://iconsearch.info/blog/react-icons-vs-lucide-react-2026)
- [How icon subsetting cuts Next.js bundle size by 40% →](https://iconsearch.info/blog/icon-subsetting-nextjs-bundle-size-optimization)
- [Icon accessibility guide →](https://iconsearch.info/blog/icon-accessibility-react-2026)
- [Find any Iconify icon →](https://iconsearch.info/icon-search)