import JSZip from 'jszip'
import { getCleanSvgUrl } from './icon-preview'

export type FrameShape = 'none' | 'circle' | 'rounded' | 'squircle'

export interface ExportOptions {
  size?: number
  strokeWidth?: number
  color?: string
  padding?: number
  frameShape?: FrameShape
  frameColor?: string
  frameStroke?: string
  frameStrokeWidth?: number
  secondaryColor?: string
  secondaryOpacity?: number
  rotate?: number
  flipHorizontal?: boolean
  flipVertical?: boolean
  className?: string
}

export type Icon = {
  id: string
  name: string
  displayName: string
  library: string
  libraryName: string
  npmPackage: string
  license: string
  tags: string[]
  reactImport: string
  reactUsage: string
  svgUrl: string
  legalSafe?: boolean
  licenseUrl?: string
}

export type CartItem = {
  key: string
  icon: Icon
  size: number
  stroke: number
  color: string
}

export interface ExportIconItem {
  id?: string
  name: string
  displayName?: string
  library?: string
  libraryName?: string
  npmPackage?: string
  license?: string
  tags?: string[]
  reactImport?: string
  reactUsage?: string
  svgUrl?: string
  legalSafe?: boolean
  svg?: string
  size?: number
  stroke?: number
  color?: string
  options?: ExportOptions
}

export interface ZipConfig {
  packageName?: string
  formats?: {
    svg?: boolean
    png?: boolean
    react?: boolean
    vue?: boolean
    svelte?: boolean
    tailwind?: boolean
    sprite?: boolean
  }
  pngScale?: number
  usePreset?: boolean
  presetSize?: number
  presetStroke?: number
  presetColor?: string
  padding?: number
  frameShape?: FrameShape
  frameColor?: string
  frameStroke?: string
  frameStrokeWidth?: number
}

export type ExportConfig = {
  packageName: string
  items: CartItem[]
  formats: {
    svg: boolean
    png: boolean
    react: boolean
    vue: boolean
    svelte?: boolean
    tailwind: boolean
    sprite: boolean
  }
  pngScale: number
  usePreset: boolean
  presetSize: number
  presetStroke: number
  presetColor: string
}

type ExportMetadata = {
  id: string
  name: string
  library: string
  libraryName: string
  license: string
  legalSafe: boolean
  exportedConfig: {
    size: number
    stroke: number
    color: string
  }
}

/**
 * Extract or infer the viewBox from an SVG string.
 */
function parseViewBox(svg: string): { minX: number; minY: number; width: number; height: number; raw: string } {
  const match = svg.match(/viewBox=["']([-\d.]+)[,\s]+([-\d.]+)[,\s]+([-\d.]+)[,\s]+([-\d.]+)["']/)
  if (match) {
    return {
      minX: parseFloat(match[1]),
      minY: parseFloat(match[2]),
      width: parseFloat(match[3]),
      height: parseFloat(match[4]),
      raw: `${match[1]} ${match[2]} ${match[3]} ${match[4]}`
    }
  }

  // Fallback if width and height are present on root
  const wMatch = svg.match(/(?:^|[\s<])width=["']([\d.]+)["']/)
  const hMatch = svg.match(/(?:^|[\s<])height=["']([\d.]+)["']/)
  const w = wMatch ? parseFloat(wMatch[1]) : 24
  const h = hMatch ? parseFloat(hMatch[1]) : 24
  return { minX: 0, minY: 0, width: w, height: h, raw: `0 0 ${w} ${h}` }
}

/**
 * Customizes an SVG with size, stroke width, color, canvas padding, container frames, and duotone options.
 * Overloaded to accept either positional args (size, stroke, color) or an ExportOptions object.
 */
export function customizeSvg(
  rawSvg: string,
  sizeOrOptions?: number | ExportOptions,
  strokeParam?: number,
  colorParam?: string
): string {
  if (!rawSvg) return ''

  let size = 24
  let stroke = 2
  let color = 'currentColor'
  let padding = 0
  let frameShape: FrameShape = 'none'
  let frameColor = 'rgba(129, 140, 248, 0.15)'
  let frameStroke = 'none'
  let frameStrokeWidth = 1
  let secondaryColor: string | undefined
  let secondaryOpacity: number | undefined
  let rotate = 0
  let flipHorizontal = false
  let flipVertical = false

  if (typeof sizeOrOptions === 'object' && sizeOrOptions !== null) {
    if (sizeOrOptions.size !== undefined) size = sizeOrOptions.size
    if (sizeOrOptions.strokeWidth !== undefined) stroke = sizeOrOptions.strokeWidth
    if (sizeOrOptions.color !== undefined) color = sizeOrOptions.color
    if (sizeOrOptions.padding !== undefined) padding = sizeOrOptions.padding
    if (sizeOrOptions.frameShape !== undefined) frameShape = sizeOrOptions.frameShape
    if (sizeOrOptions.frameColor !== undefined) frameColor = sizeOrOptions.frameColor
    if (sizeOrOptions.frameStroke !== undefined) frameStroke = sizeOrOptions.frameStroke
    if (sizeOrOptions.frameStrokeWidth !== undefined) frameStrokeWidth = sizeOrOptions.frameStrokeWidth
    if (sizeOrOptions.secondaryColor !== undefined) secondaryColor = sizeOrOptions.secondaryColor
    if (sizeOrOptions.secondaryOpacity !== undefined) secondaryOpacity = sizeOrOptions.secondaryOpacity
    if (sizeOrOptions.rotate !== undefined) rotate = sizeOrOptions.rotate
    if (sizeOrOptions.flipHorizontal !== undefined) flipHorizontal = sizeOrOptions.flipHorizontal
    if (sizeOrOptions.flipVertical !== undefined) flipVertical = sizeOrOptions.flipVertical
  } else {
    if (typeof sizeOrOptions === 'number') size = sizeOrOptions
    if (strokeParam !== undefined) stroke = strokeParam
    if (colorParam !== undefined) color = colorParam
  }

  let parsed = rawSvg

  // 1. Dimension replacement / injection
  parsed = parsed.replace(/(?<=[\s<])width="[^"]*"/g, `width="${size}"`)
  parsed = parsed.replace(/(?<=[\s<])height="[^"]*"/g, `height="${size}"`)
  if (!/(?:^|[\s<])width=/.test(parsed)) parsed = parsed.replace('<svg', `<svg width="${size}"`)
  if (!/(?:^|[\s<])height=/.test(parsed)) parsed = parsed.replace('<svg', `<svg height="${size}"`)

  // 2. Stroke width replacement / injection
  parsed = parsed.replace(/stroke-width="[^"]*"/g, `stroke-width="${stroke}"`)
  if (!parsed.includes('stroke-width=')) parsed = parsed.replace('<svg', `<svg stroke-width="${stroke}"`)

  // 3. Primary Color replacement
  parsed = parsed.replace(/stroke="currentColor"/g, `stroke="${color}"`)
  parsed = parsed.replace(/fill="currentColor"/g, `fill="${color}"`)

  // 4. Secondary Duotone Tinting & Opacity
  if (secondaryOpacity !== undefined) {
    parsed = parsed.replace(/opacity=["'][0-9.]+["']/g, `opacity="${secondaryOpacity}"`)
    parsed = parsed.replace(/fill-opacity=["'][0-9.]+["']/g, `fill-opacity="${secondaryOpacity}"`)
    parsed = parsed.replace(/stroke-opacity=["'][0-9.]+["']/g, `stroke-opacity="${secondaryOpacity}"`)
  }
  if (secondaryColor) {
    // Replace secondary classes or secondary opacity elements' fill/stroke if designated
    parsed = parsed.replace(/class=["'][^"']*duotone-secondary[^"']*["']/g, (match) => {
      return `${match} fill="${secondaryColor}"`
    })
  }

  // 5. Canvas Padding (viewBox expansion while preserving coordinates)
  let vb = parseViewBox(parsed)
  if (padding > 0) {
    const scaleFactor = vb.width / (size > 0 ? size : 24)
    const padCoordX = parseFloat((padding * scaleFactor).toFixed(2))
    const padCoordY = parseFloat((padding * scaleFactor).toFixed(2))
    const newMinX = parseFloat((vb.minX - padCoordX).toFixed(2))
    const newMinY = parseFloat((vb.minY - padCoordY).toFixed(2))
    const newWidth = parseFloat((vb.width + 2 * padCoordX).toFixed(2))
    const newHeight = parseFloat((vb.height + 2 * padCoordY).toFixed(2))
    const newViewBox = `${newMinX} ${newMinY} ${newWidth} ${newHeight}`

    if (/viewBox="[^"]*"/.test(parsed)) {
      parsed = parsed.replace(/viewBox="[^"]*"/, `viewBox="${newViewBox}"`)
    } else {
      parsed = parsed.replace('<svg', `<svg viewBox="${newViewBox}"`)
    }
    vb = { minX: newMinX, minY: newMinY, width: newWidth, height: newHeight, raw: newViewBox }
  } else if (!/viewBox="[^"]*"/.test(parsed)) {
    parsed = parsed.replace('<svg', `<svg viewBox="${vb.raw}"`)
  }

  // 6. Vector Transformations (Rotate and Flip)
  if (rotate !== 0 || flipHorizontal || flipVertical) {
    const cx = parseFloat((vb.minX + vb.width / 2).toFixed(2))
    const cy = parseFloat((vb.minY + vb.height / 2).toFixed(2))
    const transforms: string[] = []
    if (rotate) transforms.push(`rotate(${rotate} ${cx} ${cy})`)
    if (flipHorizontal) transforms.push(`translate(${2 * cx} 0) scale(-1 1)`)
    if (flipVertical) transforms.push(`translate(0 ${2 * cy}) scale(1 -1)`)

    if (transforms.length > 0) {
      const transformAttr = `transform="${transforms.join(' ')}"`
      parsed = parsed.replace(/(<svg[^>]*>)([\s\S]*)(<\/svg>)/, (_, openTag, inner, closeTag) => {
        return `${openTag}\n  <g ${transformAttr}>\n${inner}\n  </g>\n${closeTag}`
      })
    }
  }

  // 7. Container Frame Shapes
  if (frameShape && frameShape !== 'none') {
    let frameElement = ''
    const strokeAttr = frameStroke && frameStroke !== 'none' && frameStroke !== 'transparent' ? ` stroke="${frameStroke}" stroke-width="${frameStrokeWidth}"` : ''
    
    if (frameShape === 'circle') {
      const cx = parseFloat((vb.minX + vb.width / 2).toFixed(2))
      const cy = parseFloat((vb.minY + vb.height / 2).toFixed(2))
      const r = parseFloat((Math.min(vb.width, vb.height) / 2).toFixed(2))
      frameElement = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${frameColor}"${strokeAttr} />`
    } else if (frameShape === 'rounded') {
      const rx = parseFloat((vb.width * 0.2).toFixed(2))
      const ry = parseFloat((vb.height * 0.2).toFixed(2))
      frameElement = `<rect x="${vb.minX}" y="${vb.minY}" width="${vb.width}" height="${vb.height}" rx="${rx}" ry="${ry}" fill="${frameColor}"${strokeAttr} />`
    } else if (frameShape === 'squircle') {
      const rx = parseFloat((vb.width * 0.35).toFixed(2))
      const ry = parseFloat((vb.height * 0.35).toFixed(2))
      frameElement = `<rect x="${vb.minX}" y="${vb.minY}" width="${vb.width}" height="${vb.height}" rx="${rx}" ry="${ry}" fill="${frameColor}"${strokeAttr} />`
    }

    if (frameElement) {
      // Inject inside <svg> right after opening tag
      parsed = parsed.replace(/(<svg[^>]*>)/, (_, openTag) => `${openTag}\n  ${frameElement}`)
    }
  }

  return parsed
}

/**
 * Generates clean, customized raw SVG snippet.
 */
export function generateSvgSnippet(svg: string, options?: ExportOptions): string {
  if (!svg) return ''
  return customizeSvg(svg, options)
}

/**
 * Generates Base64 Data URI from customized SVG.
 */
export function generateBase64Snippet(svg: string, options?: ExportOptions): string {
  if (!svg) return ''
  const customized = customizeSvg(svg, options)
  const base64 = typeof Buffer !== 'undefined'
    ? Buffer.from(customized, 'utf-8').toString('base64')
    : btoa(unescape(encodeURIComponent(customized)))
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Rasterizes SVG to PNG Blob via Canvas in browser environments.
 */
export function renderSvgToPng(
  svgString: string,
  targetSize: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Canvas rendering is only supported in browser environments.'))
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = targetSize
    canvas.height = targetSize
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('Failed to get 2d canvas context'))
      return
    }

    const img = new Image()
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      ctx.clearRect(0, 0, targetSize, targetSize)
      ctx.drawImage(img, 0, 0, targetSize, targetSize)
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url)
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to convert canvas to PNG blob'))
        }
      }, 'image/png')
    }

    img.onerror = (e) => {
      URL.revokeObjectURL(url)
      reject(e)
    }

    img.src = url
  })
}

/**
 * Convenience wrapper to customize and rasterize SVG directly to PNG blob.
 */
export function renderSvgToPngBlob(
  svg: string,
  size: number,
  padding: number = 0
): Promise<Blob> {
  const customized = customizeSvg(svg, { size, padding })
  return renderSvgToPng(customized, size)
}

/**
 * Compiles a set of SVGs into a single unified <svg> sprite sheet with <symbol> tags.
 */
export function compileSvgSprite(
  items: { item: CartItem; svg: string }[],
  usePreset: boolean,
  presetStroke: number,
  presetColor: string
): string {
  let symbols = ''
  for (const { item, svg } of items) {
    if (!svg) continue

    const stroke = usePreset ? presetStroke : item.stroke
    const color = usePreset ? presetColor : item.color
    const styledSvg = customizeSvg(svg, 24, stroke, color)

    const innerContent = styledSvg
      .replace(/<svg[^>]*>/, '')
      .replace(/<\/svg>/, '')
      .trim()

    const viewBoxMatch = styledSvg.match(/viewBox="([^"]*)"/)
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24'
    const symbolId = `icon-${item.icon.library}-${item.icon.name}`

    symbols += `  <symbol id="${symbolId}" viewBox="${viewBox}">\n    ${innerContent}\n  </symbol>\n`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\n${symbols}</svg>`
}

/**
 * Convert an icon name to PascalCase with standard formatting.
 */
export function toPascalCase(name: string): string {
  return name
    .split(/[-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * Generates a production-ready React TSX component.
 */
export function generateReactComponent(
  name: string,
  svgContent: string,
  options?: ExportOptions
): string {
  const componentName = toPascalCase(name)
  const customized = options ? customizeSvg(svgContent, options) : svgContent

  let jsxSvg = customized
    .replace(/class=/g, 'className=')
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/stroke-linecap=/g, 'strokeLinecap=')
    .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/fill-rule=/g, 'fillRule=')
    .replace(/clip-rule=/g, 'clipRule=')
    .replace(/stroke-dasharray=/g, 'strokeDasharray=')
    .replace(/stroke-dashoffset=/g, 'strokeDashoffset=')
    .replace(/fill-opacity=/g, 'fillOpacity=')
    .replace(/stroke-opacity=/g, 'strokeOpacity=')
    .replace(/(?<=[\s<])width="[^"]*"/, 'width={size}')
    .replace(/(?<=[\s<])height="[^"]*"/, 'height={size}')

  if (!jsxSvg.includes('width={size}')) {
    jsxSvg = jsxSvg.replace('<svg', '<svg width={size}')
  }
  if (!jsxSvg.includes('height={size}')) {
    jsxSvg = jsxSvg.replace('<svg', '<svg height={size}')
  }

  return `import React from 'react'

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
}

export default function Icon${componentName}({ size = 24, ...props }: IconProps) {
  return (
    ${jsxSvg.replace('<svg', '<svg {...props}')}
  )
}
`
}

/**
 * Alias for React snippet generation.
 */
export function generateReactSnippet(
  name: string,
  svg: string,
  options?: ExportOptions
): string {
  return generateReactComponent(name, svg, options)
}

/**
 * Generates a production-ready Vue 3 SFC component with <script setup lang="ts">.
 */
export function generateVueComponent(
  svgContent: string,
  options?: ExportOptions
): string {
  const customized = options ? customizeSvg(svgContent, options) : svgContent

  let vueSvg = customized
    .replace(/(?<=[\s<])width="[^"]*"/, ':width="size"')
    .replace(/(?<=[\s<])height="[^"]*"/, ':height="size"')

  if (!vueSvg.includes(':width=')) {
    vueSvg = vueSvg.replace('<svg', '<svg :width="size"')
  }
  if (!vueSvg.includes(':height=')) {
    vueSvg = vueSvg.replace('<svg', '<svg :height="size"')
  }

  return `<template>
  ${vueSvg}
</template>

<script setup>
defineProps({
  size: {
    type: [Number, String],
    default: 24
  }
})
</script>
`
}

/**
 * Alias for Vue snippet generation.
 */
export function generateVueSnippet(
  name: string,
  svg: string,
  options?: ExportOptions
): string {
  return generateVueComponent(svg, options)
}

/**
 * Generates a valid Svelte 4/5 component snippet with typed props and restProps forwarding.
 */
export function generateSvelteComponent(
  name: string,
  svgContent: string,
  options?: ExportOptions
): string {
  const customized = options ? customizeSvg(svgContent, options) : svgContent

  let svelteSvg = customized
    .replace(/(?<=[\s<])width="[^"]*"/, 'width={size}')
    .replace(/(?<=[\s<])height="[^"]*"/, 'height={size}')

  if (!svelteSvg.includes('width={size}')) {
    svelteSvg = svelteSvg.replace('<svg', '<svg width={size}')
  }
  if (!svelteSvg.includes('height={size}')) {
    svelteSvg = svelteSvg.replace('<svg', '<svg height={size}')
  }

  // Add $$restProps forwarding to the root svg tag using replacer function
  svelteSvg = svelteSvg.replace('<svg', () => '<svg {...$$restProps}')

  return `<script lang="ts">
  export let size: number | string = 24
  export let color: string = 'currentColor'
  export let strokeWidth: number | string = 2
</script>

${svelteSvg}
`
}

/**
 * Alias for Svelte snippet generation.
 */
export function generateSvelteSnippet(
  name: string,
  svg: string,
  options?: ExportOptions
): string {
  return generateSvelteComponent(name, svg, options)
}

/**
 * Generates an inline Tailwind CSS ready <svg className="..." ...> snippet.
 */
export function generateTailwindInlineSnippet(
  svgContent: string,
  options?: ExportOptions
): string {
  const customized = options ? customizeSvg(svgContent, options) : svgContent
  const className = options?.className || 'w-6 h-6 text-current'

  let tailwindSvg = customized
    .replace(/class="[^"]*"/g, `className="${className}"`)
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/stroke-linecap=/g, 'strokeLinecap=')
    .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/fill-rule=/g, 'fillRule=')
    .replace(/clip-rule=/g, 'clipRule=')

  if (!tailwindSvg.includes('className=')) {
    tailwindSvg = tailwindSvg.replace('<svg', `<svg className="${className}"`)
  }

  return tailwindSvg
}

/**
 * Fetches all SVGs in a cart in parallel.
 */
export async function fetchAllCartSvgs(
  items: CartItem[],
  onProgress?: (text: string) => void
): Promise<{ item: CartItem; svg: string }[]> {
  if (onProgress) onProgress('Fetching SVG sources...')
  const promises = items.map(async (item) => {
    try {
      const url = getCleanSvgUrl(item.icon.svgUrl, item.icon.library)
      const res = await fetch(url)
      const svg = await res.text()
      return { item, svg }
    } catch (e) {
      console.error(`Failed to fetch SVG for ${item.icon.name}`, e)
      return { item, svg: '' }
    }
  })
  return Promise.all(promises)
}

/**
 * Generates a full multi-format ZIP archive bundle.
 */
export async function generateZipPackage(
  config: ExportConfig,
  onProgress?: (text: string) => void
): Promise<void> {
  const { packageName, items, formats, pngScale, usePreset, presetSize, presetStroke, presetColor } = config
  if (items.length === 0) return

  // 1. Fetch all raw SVGs in parallel
  const fetched = await fetchAllCartSvgs(items, onProgress)

  // 2. Initialize JSZip
  if (onProgress) onProgress('Compiling workspace files...')
  const zip = new JSZip()
  const metadataList: ExportMetadata[] = []

  const svgFolder = formats.svg ? zip.folder('svg') : null
  const pngFolder = formats.png ? zip.folder('png') : null
  const reactFolder = formats.react ? zip.folder('react') : null
  const vueFolder = formats.vue ? zip.folder('vue') : null
  const svelteFolder = formats.svelte ? zip.folder('svelte') : null
  const tailwindFolder = formats.tailwind ? zip.folder('tailwind-html') : null

  // 3. Loop through fetched assets and customize
  for (const { item, svg } of fetched) {
    if (!svg) continue

    const size = usePreset ? presetSize : item.size
    const stroke = usePreset ? presetStroke : item.stroke
    const color = usePreset ? presetColor : item.color

    const customizedSvg = customizeSvg(svg, size, stroke, color)
    const componentName = toPascalCase(item.icon.name)

    // A. SVG Format
    if (svgFolder) {
      svgFolder.file(`${item.icon.name}.svg`, customizedSvg)
    }

    // B. React Format
    if (reactFolder) {
      reactFolder.file(`Icon${componentName}.tsx`, generateReactComponent(item.icon.name, customizedSvg))
    }

    // C. Vue Format
    if (vueFolder) {
      vueFolder.file(`Icon${componentName}.vue`, generateVueComponent(customizedSvg))
    }

    // D. Svelte Format
    if (svelteFolder) {
      svelteFolder.file(`Icon${componentName}.svelte`, generateSvelteComponent(item.icon.name, customizedSvg))
    }

    // E. HTML/Tailwind Format
    if (tailwindFolder) {
      tailwindFolder.file(`${item.icon.name}.html`, generateTailwindInlineSnippet(customizedSvg))
    }

    // F. PNG Format (batch render via canvas)
    if (pngFolder) {
      if (onProgress) onProgress(`Rasterizing ${item.icon.name} to PNG...`)
      try {
        const targetSize = size * pngScale
        const pngBlob = await renderSvgToPng(customizedSvg, targetSize)
        pngFolder.file(`${item.icon.name}.png`, pngBlob)
      } catch (e) {
        console.error(`Failed to render PNG for ${item.icon.name}`, e)
      }
    }

    metadataList.push({
      id: item.icon.id,
      name: item.icon.name,
      library: item.icon.library,
      libraryName: item.icon.libraryName,
      license: item.icon.license,
      legalSafe: Boolean(item.icon.legalSafe),
      exportedConfig: { size, stroke, color }
    })
  }

  // 4. Combined SVG Sprite Sheet
  if (formats.sprite) {
    if (onProgress) onProgress('Compiling SVG Sprite sheet...')
    const spriteContent = compileSvgSprite(fetched, usePreset, presetStroke, presetColor)
    zip.file('sprite.svg', spriteContent)
  }

  // 5. Package Metadata
  zip.file('metadata.json', JSON.stringify({
    packageName: packageName || 'icon-hub-package',
    exportedAt: new Date().toISOString(),
    totalIcons: items.length,
    configUsed: {
      usePreset,
      presetSize: usePreset ? presetSize : 'custom',
      presetStroke: usePreset ? presetStroke : 'custom',
      presetColor: usePreset ? presetColor : 'custom',
      pngScale: formats.png ? pngScale : 'N/A'
    },
    icons: metadataList
  }, null, 2))

  // 6. Generate and download ZIP
  if (onProgress) onProgress('Compressing package ZIP archive...')
  const zipBlob = await zip.generateAsync({ type: 'blob' })

  if (onProgress) onProgress('Triggering download...')
  const downloadUrl = URL.createObjectURL(zipBlob)
  const downloadLink = document.createElement('a')
  downloadLink.href = downloadUrl
  downloadLink.download = `${packageName || 'icon-hub-package'}.zip`
  document.body.appendChild(downloadLink)
  downloadLink.click()
  downloadLink.remove()
  URL.revokeObjectURL(downloadUrl)
}
