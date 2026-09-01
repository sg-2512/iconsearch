'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  customizeSvg,
  generateSvgSnippet,
  generateReactSnippet,
  generateVueSnippet,
  generateSvelteSnippet,
  generateTailwindInlineSnippet,
  renderSvgToPng,
  type FrameShape,
  type ExportOptions,
  type Icon
} from '../../lib/exporter'
import { getBestIconPreviewUrl } from '../../lib/icon-preview'
import { trackExport } from '../../lib/analytics'

export type ExportTab = 'svg' | 'react' | 'vue' | 'svelte' | 'tailwind' | 'png'

export interface UniversalExporterModalProps {
  isOpen: boolean
  onClose: () => void
  icon: Icon | null
  initialSvgContent?: string
  initialOptions?: Partial<ExportOptions>
}

const TAILWIND_PALETTES = [
  { name: 'Current', color: 'currentColor' },
  { name: 'Slate', color: '#64748b' },
  { name: 'Red', color: '#ef4444' },
  { name: 'Emerald', color: '#10b981' },
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Violet', color: '#8b5cf6' },
  { name: 'Amber', color: '#f59e0b' },
  { name: 'Rose', color: '#f43f5e' },
  { name: 'Neutral', color: '#737373' },
]

const BRAND_PALETTES = [
  { name: 'Discord', color: '#5865f2' },
  { name: 'Twitter/X', color: '#1da1f2' },
  { name: 'GitHub', color: '#f0f6fc' },
  { name: 'React', color: '#61dafb' },
  { name: 'Figma', color: '#f24e1e' },
]

export default function UniversalExporterModal({
  isOpen,
  onClose,
  icon,
  initialSvgContent = '',
  initialOptions = {}
}: UniversalExporterModalProps) {
  const [activeTab, setActiveTab] = useState<ExportTab>('svg')
  const [rawSvg, setRawSvg] = useState(initialSvgContent)
  const [copied, setCopied] = useState(false)
  const [downloadingPng, setDownloadingPng] = useState(false)
  const [pngResolution, setPngResolution] = useState<number>(2) // 1x, 2x, 4x

  // Customizer options state
  const [size, setSize] = useState<number>(initialOptions.size ?? 24)
  const [strokeWidth, setStrokeWidth] = useState<number>(initialOptions.strokeWidth ?? 2)
  const [color, setColor] = useState<string>(initialOptions.color ?? '#818cf8')
  const [padding, setPadding] = useState<number>(initialOptions.padding ?? 0)
  const [frameShape, setFrameShape] = useState<FrameShape>(initialOptions.frameShape ?? 'none')
  const [frameColor, setFrameColor] = useState<string>(initialOptions.frameColor ?? 'rgba(129, 140, 248, 0.15)')
  const [frameStroke, setFrameStroke] = useState<string>(initialOptions.frameStroke ?? 'rgba(129, 140, 248, 0.3)')
  const [frameStrokeWidth, setFrameStrokeWidth] = useState<number>(initialOptions.frameStrokeWidth ?? 1)
  const [secondaryColor, setSecondaryColor] = useState<string>(initialOptions.secondaryColor ?? '#c084fc')
  const [secondaryOpacity, setSecondaryOpacity] = useState<number>(initialOptions.secondaryOpacity ?? 0.3)
  const [tailwindClass, setTailwindClass] = useState<string>('w-6 h-6 text-current')

  // Load SVG content when icon changes or modal opens
  useEffect(() => {
    if (!isOpen || !icon) return

    // Sync initial options
    if (initialOptions.size !== undefined) setSize(initialOptions.size)
    if (initialOptions.strokeWidth !== undefined) setStrokeWidth(initialOptions.strokeWidth)
    if (initialOptions.color !== undefined) setColor(initialOptions.color)
    if (initialOptions.padding !== undefined) setPadding(initialOptions.padding)
    if (initialOptions.frameShape !== undefined) setFrameShape(initialOptions.frameShape)
    if (initialOptions.frameColor !== undefined) setFrameColor(initialOptions.frameColor)
    if (initialOptions.frameStroke !== undefined) setFrameStroke(initialOptions.frameStroke)
    if (initialOptions.frameStrokeWidth !== undefined) setFrameStrokeWidth(initialOptions.frameStrokeWidth)

    if (initialSvgContent) {
      setRawSvg(initialSvgContent)
    } else {
      const controller = new AbortController()
      fetch(getBestIconPreviewUrl(icon), { signal: controller.signal })
        .then((res) => res.text())
        .then((text) => setRawSvg(text))
        .catch(() => setRawSvg(''))
      return () => controller.abort()
    }
  }, [isOpen, icon, initialSvgContent, initialOptions])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const exportOptions: ExportOptions = useMemo(() => ({
    size,
    strokeWidth,
    color,
    padding,
    frameShape,
    frameColor,
    frameStroke,
    frameStrokeWidth,
    secondaryColor,
    secondaryOpacity,
    className: tailwindClass
  }), [
    size,
    strokeWidth,
    color,
    padding,
    frameShape,
    frameColor,
    frameStroke,
    frameStrokeWidth,
    secondaryColor,
    secondaryOpacity,
    tailwindClass
  ])

  // Live customized SVG
  const previewSvg = useMemo(() => {
    if (!rawSvg) return ''
    return customizeSvg(rawSvg, exportOptions)
  }, [rawSvg, exportOptions])

  // Code snippets by tab
  const generatedCode = useMemo(() => {
    if (!rawSvg || !icon) return ''
    switch (activeTab) {
      case 'svg':
        return generateSvgSnippet(rawSvg, exportOptions)
      case 'react':
        return generateReactSnippet(icon.name, rawSvg, exportOptions)
      case 'vue':
        return generateVueSnippet(icon.name, rawSvg, exportOptions)
      case 'svelte':
        return generateSvelteSnippet(icon.name, rawSvg, exportOptions)
      case 'tailwind':
        return generateTailwindInlineSnippet(rawSvg, exportOptions)
      case 'png':
        return `<!-- PNG Export: ${size * pngResolution}px × ${size * pngResolution}px (@${pngResolution}x) -->`
      default:
        return ''
    }
  }, [activeTab, rawSvg, icon, exportOptions, size, pngResolution])

  const handleCopy = useCallback(() => {
    if (!generatedCode) return
    navigator.clipboard.writeText(generatedCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      if (icon) {
        trackExport({
          format: activeTab,
          iconCount: 1,
          libraries: icon.library,
          iconNames: icon.name,
        })
      }
    })
  }, [generatedCode, icon, activeTab])

  const handleDownloadPng = useCallback(async () => {
    if (!previewSvg || !icon) return
    setDownloadingPng(true)
    try {
      const targetSize = size * pngResolution
      const blob = await renderSvgToPng(previewSvg, targetSize)
      const downloadUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `${icon.name}-${targetSize}px.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(downloadUrl)

      trackExport({
        format: 'png',
        iconCount: 1,
        libraries: icon.library,
        iconNames: icon.name,
      })
    } catch (e) {
      console.error('Failed to export PNG', e)
    } finally {
      setDownloadingPng(false)
    }
  }, [previewSvg, icon, size, pngResolution])

  const handleDownloadSvg = useCallback(() => {
    if (!previewSvg || !icon) return
    const blob = new Blob([previewSvg], { type: 'image/svg+xml;charset=utf-8' })
    const downloadUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = `${icon.name}.svg`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(downloadUrl)

    trackExport({
      format: 'svg',
      iconCount: 1,
      libraries: icon.library,
      iconNames: icon.name,
    })
  }, [previewSvg, icon])

  if (!isOpen || !icon) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="universal-exporter-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.78)',
          backdropFilter: 'blur(6px)',
        }}
      />

      {/* Modal Dialog Body */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '960px',
          maxHeight: '92vh',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid var(--border)',
            background: 'rgba(24, 24, 27, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(129, 140, 248, 0.1)',
                border: '1px solid rgba(129, 140, 248, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              ⚡
            </div>
            <div>
              <h2
                id="universal-exporter-title"
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--text)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {icon.displayName || icon.name}
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(129, 140, 248, 0.15)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(129, 140, 248, 0.3)',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  {icon.libraryName}
                </span>
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                Universal 1-Click Code Exporter & Live Rasterizer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close export dialog"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.color = 'var(--text)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 24px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg)',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'svg', label: 'Raw SVG', icon: '📄' },
            { id: 'react', label: 'React (TSX)', icon: '⚛️' },
            { id: 'vue', label: 'Vue 3 SFC', icon: '💚' },
            { id: 'svelte', label: 'Svelte 4/5', icon: '🔥' },
            { id: 'tailwind', label: 'Tailwind CSS', icon: '🎨' },
            { id: 'png', label: 'PNG Download', icon: '🖼️' },
          ].map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ExportTab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                  background: isActive ? 'rgba(129, 140, 248, 0.12)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Modal Main Content Area: Grid with Controls/Preview on Left, Code/Download on Right */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 340px) 1fr',
            flex: 1,
            overflowY: 'auto',
            minHeight: '440px',
          }}
        >
          {/* LEFT COLUMN: Customizer Controls & Visual Preview */}
          <div
            style={{
              padding: '20px',
              borderRight: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: 'rgba(24, 24, 27, 0.4)',
              overflowY: 'auto',
            }}
          >
            {/* Live Interactive Preview Box */}
            <div
              style={{
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: 'radial-gradient(circle at center, rgba(30,30,36,0.8) 0%, rgba(18,18,21,0.95) 100%)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '140px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: `drop-shadow(0 4px 12px ${color === 'currentColor' ? 'rgba(129,140,248,0.2)' : `${color}33`})`,
                  transition: 'all 0.15s ease',
                }}
                dangerouslySetInnerHTML={{ __html: previewSvg }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '10px',
                  fontSize: '10px',
                  color: 'var(--text-dim)',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {size}×{size}px
              </span>
            </div>

            {/* Dimension & Stroke Sliders */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  background: 'var(--bg)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Size</label>
                  <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {size}px
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Icon size slider"
                  min={16}
                  max={96}
                  step={2}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
              </div>

              <div
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  background: 'var(--bg)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Stroke</label>
                  <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {strokeWidth.toFixed(1)}px
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Icon stroke width slider"
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Canvas Padding Slider */}
            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '10px 12px',
                background: 'var(--bg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Canvas Padding</label>
                <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {padding}px
                </span>
              </div>
              <input
                type="range"
                aria-label="Canvas viewBox padding slider"
                min={0}
                max={24}
                step={1}
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
            </div>

            {/* Container Frame Shapes */}
            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '10px 12px',
                background: 'var(--bg)',
              }}
            >
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                Frame Shape
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {[
                  { id: 'none', label: 'None' },
                  { id: 'circle', label: 'Circle' },
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'squircle', label: 'Squircle' },
                ].map((s) => {
                  const isSelected = frameShape === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setFrameShape(s.id as FrameShape)}
                      style={{
                        padding: '6px 4px',
                        borderRadius: '6px',
                        border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                        background: isSelected ? 'rgba(129, 140, 248, 0.15)' : 'transparent',
                        color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                        fontSize: '11px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontWeight: isSelected ? 700 : 500,
                      }}
                    >
                      {s.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Color Palette Selector */}
            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '10px 12px',
                background: 'var(--bg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Color Palette</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="color"
                    aria-label="Custom color picker"
                    value={color === 'currentColor' ? '#818cf8' : color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ width: '20px', height: '20px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: 'transparent' }}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {color}
                  </span>
                </div>
              </div>

              {/* Tailwind Swatches */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {TAILWIND_PALETTES.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    title={p.name}
                    onClick={() => setColor(p.color)}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: p.color === 'currentColor' ? 'linear-gradient(135deg, #fff 50%, #475569 50%)' : p.color,
                      border: color === p.color ? '2px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                      cursor: 'pointer',
                      transform: color === p.color ? 'scale(1.15)' : 'none',
                      transition: 'all 0.12s ease',
                    }}
                  />
                ))}
              </div>

              {/* Brand Swatches */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px' }}>
                {BRAND_PALETTES.map((b) => (
                  <button
                    key={b.name}
                    type="button"
                    title={b.name}
                    onClick={() => setColor(b.color)}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: b.color,
                      border: color === b.color ? '2px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                      cursor: 'pointer',
                      transform: color === b.color ? 'scale(1.15)' : 'none',
                      transition: 'all 0.12s ease',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Secondary / Duotone Opacity (Optional) */}
            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '10px 12px',
                background: 'var(--bg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Duotone Opacity</label>
                <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {secondaryOpacity.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                aria-label="Duotone secondary opacity slider"
                min={0.1}
                max={0.9}
                step={0.05}
                value={secondaryOpacity}
                onChange={(e) => setSecondaryOpacity(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Code View / PNG Actions */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '20px 24px',
              background: 'var(--bg)',
              overflowY: 'auto',
            }}
          >
            {activeTab === 'png' ? (
              /* PNG Downloader View */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '18px',
                    border: '1px solid var(--border)',
                    background: 'rgba(24, 24, 27, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
                  }}
                  dangerouslySetInnerHTML={{ __html: previewSvg }}
                />

                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px' }}>Export as Raster PNG</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    Crisp anti-aliased bitmap render with transparent alpha channel
                  </p>
                </div>

                {/* Resolution scale chips */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[
                    { scale: 1, label: '1x', desc: `${size}px` },
                    { scale: 2, label: '2x (Retina)', desc: `${size * 2}px` },
                    { scale: 4, label: '4x (Ultra HD)', desc: `${size * 4}px` },
                  ].map((res) => {
                    const isSelected = pngResolution === res.scale
                    return (
                      <button
                        key={res.scale}
                        type="button"
                        onClick={() => setPngResolution(res.scale)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '10px',
                          border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                          background: isSelected ? 'rgba(129, 140, 248, 0.15)' : 'var(--bg-secondary)',
                          color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <span style={{ fontSize: '13px', fontWeight: 700 }}>{res.label}</span>
                        <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', opacity: 0.8 }}>
                          {res.desc}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={handleDownloadPng}
                    disabled={downloadingPng}
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 24px',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 16px rgba(139, 92, 246, 0.35)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>💾</span>
                    <span>{downloadingPng ? 'Rendering PNG...' : `Download PNG (@${pngResolution}x)`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadSvg}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '12px 20px',
                      color: 'var(--text)',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>📄</span>
                    <span>Download .svg</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Code Snippet View */
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
                {activeTab === 'tailwind' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      Tailwind Classes:
                    </label>
                    <input
                      type="text"
                      value={tailwindClass}
                      onChange={(e) => setTailwindClass(e.target.value)}
                      placeholder="e.g. w-6 h-6 text-indigo-500 hover:text-indigo-400"
                      style={{
                        flex: 1,
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        color: 'var(--text)',
                        fontSize: '12px',
                        fontFamily: 'JetBrains Mono, monospace',
                        outline: 'none',
                      }}
                    />
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {activeTab === 'react' && 'React Component (.tsx)'}
                    {activeTab === 'vue' && 'Vue 3 Single File Component (.vue)'}
                    {activeTab === 'svelte' && 'Svelte Component (.svelte)'}
                    {activeTab === 'svg' && 'Clean Scalable Vector Graphics (.svg)'}
                    {activeTab === 'tailwind' && 'Inline JSX/HTML with Tailwind CSS'}
                  </span>

                  <button
                    type="button"
                    onClick={handleCopy}
                    style={{
                      background: copied ? 'rgba(52, 211, 153, 0.15)' : 'rgba(129, 140, 248, 0.12)',
                      border: copied ? '1px solid #34d399' : '1px solid rgba(129, 140, 248, 0.3)',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      color: copied ? '#34d399' : 'var(--accent)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{copied ? '✓' : '📋'}</span>
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                  </button>
                </div>

                <div
                  style={{
                    flex: 1,
                    background: 'var(--code-bg, #0d1117)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '16px',
                    overflowX: 'auto',
                    fontFamily: 'JetBrains Mono, SFMono-Regular, Consolas, monospace',
                    fontSize: '12px',
                    lineHeight: '1.6',
                    color: '#e6edf3',
                    position: 'relative',
                  }}
                >
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {generatedCode}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
