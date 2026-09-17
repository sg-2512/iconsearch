import type { IconLibraryMeta } from '../library-catalog'
import { antDesignIconsData } from './ant-design-icons'
import { bootstrapIconsData } from './bootstrap-icons'
import { circumIconsData } from './circum-icons'
import { deviconsData } from './devicons'
import { elusiveIconsData } from './elusive-icons'
import { featherIconsData } from './feather-icons'
import { heroiconsData } from './heroicons'
import { iconifyIconsData } from './iconify-icons'
import { iconoirData } from './iconoir'
import { ioniconsData } from './ionicons'
import { lucideIconsData } from './lucide-icons'
import { octiconsData } from './octicons'
import { phosphorIconsData } from './phosphor-icons'
import { radixIconsData } from './radix-icons'
import { remixIconData } from './remix-icon'
import { tablerIconsData } from './tabler-icons'
import { teenyiconsData } from './teenyicons'
import { untitledUiIconsData } from './untitled-ui-icons'

export type LibraryDetailData = {
  name: string
  slug?: string
  tagline: string
  description: {
    intro: string
    detail: string
    technical?: string
    verdict?: string
    [key: string]: string | undefined
  }
  stats: {
    iconCount: number
    stars?: number
    weeklyDownloads?: number
    license: string
    firstRelease?: string
    latestVersion?: string
    bundleSize?: string
    openIssues?: number
  }
  installation: {
    react?: {
      package: string
      command: string
      yarn?: string
      pnpm?: string
    }
    nextjs?: {
      package: string
      command: string
      note?: string
    }
    vue?: {
      package: string
      command: string
    }
    svelte?: {
      package: string
      command: string
    }
    vanilla?: {
      package: string
      command: string
    }
    [key: string]: any
  }
  codeExamples?: {
    basic?: string
    withTailwind?: string
    nextjs?: string
    solidVariant?: string
    [key: string]: string | undefined
  }
  pros?: Array<{ title: string; detail: string }>
  cons?: Array<{ title: string; detail: string }>
  whoShouldUse?: string[]
  whoShouldNot?: string[]
  faqs: Array<{ q: string; a: string }>
  alternatives?: string[]
  links: {
    github?: string
    website?: string
    npm?: string
    figma?: string
    [key: string]: string | undefined
  }
}

export const primaryLibrariesMap: Record<string, LibraryDetailData> = {
  'ant-design-icons': antDesignIconsData as unknown as LibraryDetailData,
  'bootstrap-icons': bootstrapIconsData as unknown as LibraryDetailData,
  'circum-icons': circumIconsData as unknown as LibraryDetailData,
  devicons: deviconsData as unknown as LibraryDetailData,
  'elusive-icons': elusiveIconsData as unknown as LibraryDetailData,
  'feather-icons': featherIconsData as unknown as LibraryDetailData,
  heroicons: heroiconsData as unknown as LibraryDetailData,
  'iconify-icons': iconifyIconsData as unknown as LibraryDetailData,
  iconoir: iconoirData as unknown as LibraryDetailData,
  ionicons: ioniconsData as unknown as LibraryDetailData,
  'lucide-icons': lucideIconsData as unknown as LibraryDetailData,
  octicons: octiconsData as unknown as LibraryDetailData,
  'phosphor-icons': phosphorIconsData as unknown as LibraryDetailData,
  'radix-icons': radixIconsData as unknown as LibraryDetailData,
  'remix-icon': remixIconData as unknown as LibraryDetailData,
  'tabler-icons': tablerIconsData as unknown as LibraryDetailData,
  teenyicons: teenyiconsData as unknown as LibraryDetailData,
  'untitled-ui-icons': untitledUiIconsData as unknown as LibraryDetailData,
}

export function getLibraryDetailData(meta: IconLibraryMeta): LibraryDetailData {
  const normalizedSlug = meta.slug.toLowerCase().trim()
  const cleanId = meta.id.toLowerCase().trim()

  if (primaryLibrariesMap[normalizedSlug]) {
    return primaryLibrariesMap[normalizedSlug]
  }
  if (primaryLibrariesMap[cleanId]) {
    return primaryLibrariesMap[cleanId]
  }

  // Synthesize deterministic, high-quality fallback data for the other 211 Iconify collections
  const rawPrefix = meta.slug.replace(/^iconify-/, '')
  const npmPackage = `@iconify-json/${rawPrefix}`
  const iconCountFormatted = meta.iconCount.toLocaleString('en-US')

  return {
    name: meta.name,
    slug: meta.slug,
    tagline: `Open-source vector icons from the ${meta.name} collection`,
    description: {
      intro: `${meta.name} is an open-source vector icon collection containing ${iconCountFormatted} icons under the ${meta.license} license.`,
      detail: `Every SVG icon in ${meta.name} is optimized for web, mobile, and desktop applications, providing clean scalable vector graphics with crisp rendering across high-DPI displays.`,
      technical: `${meta.name} is distributed with full vector SVG definitions, making it compatible with React, Next.js, Vue, Svelte, Tailwind CSS, and vanilla HTML/CSS workflows.`,
      verdict: `${meta.name} is a reliable choice for developers and designers looking for high-quality ${meta.license}-licensed vector icons for modern interfaces.`,
    },
    stats: {
      iconCount: meta.iconCount,
      license: meta.license,
      bundleSize: '~1kb per icon',
      latestVersion: 'Latest',
    },
    installation: {
      react: {
        package: npmPackage,
        command: `npm install ${npmPackage}`,
        yarn: `yarn add ${npmPackage}`,
        pnpm: `pnpm add ${npmPackage}`,
      },
      nextjs: {
        package: npmPackage,
        command: `npm install ${npmPackage}`,
        note: 'Compatible with Next.js App Router Server and Client components.',
      },
      vue: {
        package: `@iconify/vue`,
        command: `npm install @iconify/vue ${npmPackage}`,
      },
      svelte: {
        package: `@iconify/svelte`,
        command: `npm install @iconify/svelte ${npmPackage}`,
      },
      vanilla: {
        package: npmPackage,
        command: `npm install ${npmPackage}`,
      },
    },
    pros: [
      {
        title: 'Open Source License',
        detail: `Distributed under the ${meta.license} license for commercial and personal development projects.`,
      },
      {
        title: 'Universal Framework Support',
        detail: 'Easily exported to React JSX, Vue SFC, Svelte 5, Tailwind CSS, and raw SVG on IconSearch.',
      },
      {
        title: 'Comprehensive Selection',
        detail: `Offers ${iconCountFormatted} icons covering core UI components, actions, and status indicators.`,
      },
    ],
    cons: [
      {
        title: 'Third-party Collection',
        detail: 'Distributed via Iconify rather than an independent single-purpose npm package.',
      },
    ],
    whoShouldUse: [
      'Developers seeking royalty-free icons for web and mobile applications',
      'UI designers building consistent application design systems',
      'Projects using React, Next.js, Vue, or Tailwind CSS',
    ],
    whoShouldNot: [
      'Projects requiring exclusive proprietary design elements',
    ],
    faqs: [
      {
        q: `How many icons does ${meta.name} have?`,
        a: `${meta.name} contains ${iconCountFormatted} open-source vector icons available in SVG format on IconSearch.`,
      },
      {
        q: `Is ${meta.name} free for commercial use?`,
        a: `Yes, ${meta.name} is licensed under the ${meta.license} license, which permits commercial and personal use in software applications, websites, and design projects without subscription fees.`,
      },
      {
        q: `How do you install and use ${meta.name} in React, Next.js, and Vue?`,
        a: `You can install the official package via \`npm install ${npmPackage}\` or copy customized React JSX, Vue 3, Svelte, or SVG code directly from IconSearch with zero runtime overhead.`,
      },
      {
        q: `Does ${meta.name} support TypeScript?`,
        a: `Yes, icon definitions and SVG React/Vue component wrappers for ${meta.name} include TypeScript type definitions for autocomplete and prop validation.`,
      },
      {
        q: `Can I customize stroke width, size, and color for ${meta.name} icons?`,
        a: `Yes, IconSearch provides an interactive customizer to modify size, hex color, stroke width, and CSS currentColor before copying code or downloading SVGs.`,
      },
    ],
    links: {
      github: 'https://github.com/iconify/icon-sets',
      website: `https://iconsearch.info/icons/${meta.slug}`,
      npm: `https://www.npmjs.com/package/${npmPackage}`,
    },
  }
}
