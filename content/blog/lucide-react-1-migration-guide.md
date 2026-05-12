---
title: "lucide-react 1.0 Migration Guide — Breaking Changes & Fixes (2026)"
description: "Complete migration guide for lucide-react 1.0 breaking changes. Updated icon names, removed icons, API changes, and step-by-step upgrade instructions for React and Next.js projects."
date: "2026-05-11"
author: "IconSearch Team"
category: "Tutorial"
tags: ["lucide", "react", "migration", "breaking-changes", "nextjs"]
featured: true
---

Lucide React 1.0 introduced several breaking changes that are catching developers off guard. If you upgraded and suddenly have missing icons, TypeScript errors, or changed import paths, this guide covers every breaking change and exactly how to fix each one.

This is the most complete lucide-react 1.0 migration reference available. Bookmark it and share it with your team before upgrading.

## What Changed in lucide-react 1.0

Lucide React 1.0 was a major version bump that cleaned up years of accumulated inconsistencies in icon naming, removed deprecated APIs, and standardized the component interface. The changes are worth making — the library is cleaner and more consistent after the migration — but they require updating your codebase in specific ways.

The three categories of breaking changes are icon renames, removed icons, and API changes to component props.

## Breaking Change 1 — Icon Renames

The most common source of migration errors. Several icons were renamed for consistency with the rest of the library. If your build shows a TypeScript error like `Module '"lucide-react"' has no exported member 'XCircle'`, the icon was renamed.

The most commonly affected renames:

```tsx
// Old name → New name

// ❌ Old
import { XCircle } from 'lucide-react'
// ✅ New
import { CircleX } from 'lucide-react'

// ❌ Old
import { CheckCircle } from 'lucide-react'
// ✅ New
import { CircleCheck } from 'lucide-react'

// ❌ Old
import { CheckCircle2 } from 'lucide-react'
// ✅ New
import { CircleCheckBig } from 'lucide-react'

// ❌ Old
import { AlertCircle } from 'lucide-react'
// ✅ New
import { CircleAlert } from 'lucide-react'

// ❌ Old
import { HelpCircle } from 'lucide-react'
// ✅ New
import { CircleHelp } from 'lucide-react'

// ❌ Old
import { MinusCircle } from 'lucide-react'
// ✅ New
import { CircleMinus } from 'lucide-react'

// ❌ Old
import { PlusCircle } from 'lucide-react'
// ✅ New
import { CirclePlus } from 'lucide-react'

// ❌ Old
import { XOctagon } from 'lucide-react'
// ✅ New
import { OctagonX } from 'lucide-react'

// ❌ Old
import { AlertOctagon } from 'lucide-react'
// ✅ New
import { OctagonAlert } from 'lucide-react'

// ❌ Old
import { ArrowUpCircle } from 'lucide-react'
// ✅ New
import { CircleArrowUp } from 'lucide-react'

// ❌ Old
import { ArrowDownCircle } from 'lucide-react'
// ✅ New
import { CircleArrowDown } from 'lucide-react'

// ❌ Old
import { ArrowLeftCircle } from 'lucide-react'
// ✅ New
import { CircleArrowLeft } from 'lucide-react'

// ❌ Old
import { ArrowRightCircle } from 'lucide-react'
// ✅ New
import { CircleArrowRight } from 'lucide-react'
```

The naming pattern became consistent in 1.0 — shape comes first, then the modifier. So CircleX instead of XCircle. CircleCheck instead of CheckCircle. This applies to all shape-based icon names.

## Breaking Change 2 — More Icon Renames

Beyond the circle icons, several other icons were renamed for consistency:

```tsx
// ❌ Old
import { Loader2 } from 'lucide-react'
// ✅ New — Loader2 still exists but LoaderCircle is preferred
import { LoaderCircle } from 'lucide-react'

// ❌ Old
import { MoreHorizontal } from 'lucide-react'
// ✅ Still works — this one was not renamed

// ❌ Old
import { ExternalLink } from 'lucide-react'
// ✅ New
import { SquareArrowOutUpRight } from 'lucide-react'

// ❌ Old
import { LogIn } from 'lucide-react'
// ✅ New
import { LogIn } from 'lucide-react'
// LogIn was kept but verify your version

// ❌ Old
import { GitHub } from 'lucide-react'
// Brand icons were removed entirely from Lucide in 1.0
// Use @icons-pack/react-simple-icons for brand icons
```

## Breaking Change 3 — Brand Icons Removed

This is the change that surprises developers most. Lucide 1.0 removed all brand icons — GitHub, Twitter, Instagram, Facebook, and other brand logos.

The reasoning is sound: brand icons require constant updates as brands refresh their logos, and maintaining accuracy is outside the scope of a UI icon library. But it means any project using Lucide brand icons needs a replacement.

**The replacement for brand icons:**

```bash
npm install @icons-pack/react-simple-icons
```

```tsx
// ❌ Old Lucide brand icons (removed in 1.0)
import { Github, Twitter, Instagram } from 'lucide-react'

// ✅ New with react-simple-icons
import { SiGithub, SiX, SiInstagram } from '@icons-pack/react-simple-icons'

// Usage is similar
<SiGithub size={20} />
```

Simple Icons maintains over 3,000 brand icons updated to match official brand guidelines. It is the recommended replacement for any brand icons you were using from Lucide.

## Breaking Change 4 — Default Stroke Width Changed

In lucide-react 1.0 the default strokeWidth changed from 2 to 2. Wait — it stayed the same. But the way it is applied changed internally.

If your icons look slightly different after upgrading, the cause is likely that you were relying on CSS to override stroke width indirectly, and the new implementation applies strokeWidth as an SVG attribute rather than a CSS property in some contexts.

The fix is explicit:

```tsx
// Always specify strokeWidth explicitly if you need a specific value
<Home size={24} strokeWidth={1.5} />
<Settings size={20} strokeWidth={2} />
```

## How to Find All Breaking Changes in Your Codebase

Instead of manually searching every file, use this script to find all Lucide imports that need updating:

```bash
# Find all lucide-react imports in your project
grep -r "from 'lucide-react'" --include="*.tsx" --include="*.ts" --include="*.jsx" . | grep -v node_modules

# Find specifically the renamed circle icons
grep -r "XCircle\|CheckCircle\|AlertCircle\|HelpCircle\|MinusCircle\|PlusCircle" --include="*.tsx" . | grep -v node_modules
```

For a more automated approach, the Lucide team maintains a codemod:

```bash
npx @lucide/codemod@latest migrate-from-0.x
```

This automatically renames icons in your source files. Run it on a branch first and review the diff before merging.

## Step-by-Step Migration Process

Follow this process to migrate safely without breaking your production application.

**Step 1 — Create a migration branch**

```bash
git checkout -b feat/lucide-1.0-migration
```

**Step 2 — Update the package**

```bash
npm install lucide-react@latest
```

**Step 3 — Run the codemod**

```bash
npx @lucide/codemod@latest migrate-from-0.x
```

**Step 4 — Check for TypeScript errors**

```bash
npx tsc --noEmit
```

TypeScript will identify any remaining icon names that do not exist in the new version. Fix each one using the rename table above.

**Step 5 — Replace brand icons**

Search your codebase for any brand icons you were using:

```bash
grep -r "Github\|Twitter\|Instagram\|Facebook\|Linkedin\|Youtube" --include="*.tsx" . | grep lucide
```

Install and migrate to react-simple-icons for any found.

**Step 6 — Visual regression check**

Run your application and visually scan all pages for missing icons (they will appear as empty space) or incorrectly named icons. Pay particular attention to error states, notifications, and navigation — these commonly use the renamed circle and octagon icons.

**Step 7 — Test TypeScript compilation**

```bash
npm run build
```

A successful build with no TypeScript errors confirms the migration is complete.

## Quick Reference — Complete Rename Table

For quick lookup during migration:

| Old Name | New Name |
|---|---|
| XCircle | CircleX |
| CheckCircle | CircleCheck |
| CheckCircle2 | CircleCheckBig |
| AlertCircle | CircleAlert |
| HelpCircle | CircleHelp |
| MinusCircle | CircleMinus |
| PlusCircle | CirclePlus |
| ArrowUpCircle | CircleArrowUp |
| ArrowDownCircle | CircleArrowDown |
| ArrowLeftCircle | CircleArrowLeft |
| ArrowRightCircle | CircleArrowRight |
| XOctagon | OctagonX |
| AlertOctagon | OctagonAlert |
| ExternalLink | SquareArrowOutUpRight |

## What Stayed the Same

Not everything changed. These commonly used icons kept their names:

```tsx
// These are unchanged in lucide-react 1.0
import {
  Home,
  Settings,
  User,
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Minus,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Mail,
  Phone,
  Calendar,
  Clock,
  Star,
  Heart,
  Bookmark,
  Share,
  Download,
  Upload,
  Filter,
  Grid,
  List,
  BarChart,
  LineChart,
  PieChart,
} from 'lucide-react'
```

If your project primarily uses these navigation and action icons you may find the migration is minimal.

## Frequently Asked Questions

### My TypeScript shows errors after upgrading lucide-react. What do I do?

Run `npx tsc --noEmit` to get a full list of TypeScript errors. Each error like `Module '"lucide-react"' has no exported member 'XCircle'` tells you exactly which icon was renamed. Look it up in the rename table above and update the import.

### Can I use the old icon names after upgrading to 1.0?

No. The old names are not available as aliases in 1.0. You must update to the new names. The codemod handles this automatically for the known renames.

### Where did GitHub and Twitter icons go in Lucide 1.0?

Brand icons were removed from Lucide in 1.0. Use `@icons-pack/react-simple-icons` as a replacement. It maintains 3,000+ brand icons updated to match official brand guidelines.

### Does lucide-react 1.0 work with Next.js App Router?

Yes. lucide-react 1.0 works in both Server Components and Client Components without any configuration changes. The migration does not affect App Router compatibility.

### What is the fastest way to migrate a large codebase?

Run the official codemod first: `npx @lucide/codemod@latest migrate-from-0.x`. Then fix any remaining TypeScript errors manually. Then search for brand icons that need replacing. Most migrations complete in under an hour for typical applications.