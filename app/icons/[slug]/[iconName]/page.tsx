import Link from 'next/link'
import { notFound } from 'next/navigation'
import { resolveLibraryMeta } from '../../../../data/library-catalog'
import { createPageMetadata, generateBreadcrumbSchema, generateImageObjectSchema, SITE_URL } from '../../../../lib/seo'
import { getIconsForLibrary } from '../page'
import IconDetailClient from './IconDetailClient'

export const dynamicParams = true

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; iconName: string }>
}) {
  const { slug, iconName } = await params
  const meta = resolveLibraryMeta(slug)
  if (!meta) return {}

  const cleanName = decodeURIComponent(iconName).replace(/\.svg$/i, '')
  const formattedName = cleanName
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')

  const title = `${formattedName} Icon SVG — Free ${meta.name} Download & React Component`
  const description = `Download free ${formattedName} vector SVG icon from ${meta.name}. Copy clean SVG, React JSX, Vue, Svelte component code, or export high-resolution PNG under ${meta.license} license.`

  return createPageMetadata({
    title,
    description,
    path: `/icons/${meta.slug}/${cleanName}`,
    imageAlt: `${formattedName} icon from ${meta.name} on IconSearch`,
    keywords: [
      cleanName,
      `${cleanName} icon`,
      `${cleanName} svg`,
      `${cleanName} react icon`,
      `${meta.name} ${cleanName}`,
      'free svg icon',
      'vector icon download',
      'react icon component',
      meta.name,
    ],
  })
}

export default async function IconDetailPage({
  params,
}: {
  params: Promise<{ slug: string; iconName: string }>
}) {
  const { slug, iconName } = await params
  const meta = resolveLibraryMeta(slug)

  if (!meta) {
    notFound()
  }

  const cleanName = decodeURIComponent(iconName).replace(/\.svg$/i, '')
  const formattedName = cleanName
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')

  const svgApiUrl = `/api/svg/${encodeURIComponent(meta.id || meta.slug)}/${encodeURIComponent(cleanName)}`

  const imageSchema = generateImageObjectSchema({
    name: `${formattedName} Icon`,
    description: `${formattedName} vector SVG icon from ${meta.name}`,
    contentUrl: `${SITE_URL}${svgApiUrl}`,
    license: meta.license,
    creator: meta.name,
    tags: [cleanName, meta.name, 'SVG', 'Vector', 'Icon', meta.license],
  })

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Free SVG Icons', url: '/free-svg-icons' },
    { name: meta.name, url: `/icons/${meta.slug}` },
    { name: formattedName, url: `/icons/${meta.slug}/${cleanName}` },
  ])

  const siblings = getIconsForLibrary(meta)
    .filter((i) => i.name.toLowerCase() !== cleanName.toLowerCase())
    .slice(0, 12)

  return (
    <main style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 24px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([imageSchema, breadcrumbsSchema]),
        }}
      />
      <IconDetailClient
        iconName={cleanName}
        displayName={formattedName}
        library={meta}
        svgApiUrl={svgApiUrl}
      />

      {/* Sibling / Related Icons Crawl Cluster */}
      {siblings.length > 0 && (
        <section
          style={{
            marginTop: '56px',
            paddingTop: '36px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text)' }}>
                Related {meta.name} Icons
              </h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>
                More open-source vector SVG icons in the {meta.name} collection
              </p>
            </div>
            <Link
              href={`/icons/${meta.slug}`}
              style={{
                fontSize: '13px',
                color: 'var(--accent)',
                textDecoration: 'none',
                fontFamily: 'var(--font-mono, monospace)',
                fontWeight: 600,
              }}
            >
              View all {meta.iconCount.toLocaleString('en-US')} icons →
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
              gap: '12px',
            }}
          >
            {siblings.map((sib) => {
              const sibHref = `/icons/${encodeURIComponent(meta.slug)}/${encodeURIComponent(sib.name)}`
              const sibPreview = sib.svgUrl || `/api/svg/${encodeURIComponent(meta.id || meta.slug)}/${encodeURIComponent(sib.name)}`

              return (
                <Link
                  key={sib.id}
                  href={sibHref}
                  title={`${sib.displayName || sib.name} vector SVG icon`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100px',
                    padding: '12px 8px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <img
                    src={sibPreview}
                    alt={`${sib.displayName || sib.name} SVG icon`}
                    width={28}
                    height={28}
                    loading="lazy"
                    style={{ objectFit: 'contain', marginBottom: '8px' }}
                  />
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      fontWeight: 500,
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontFamily: 'var(--font-mono, monospace)',
                    }}
                  >
                    {sib.displayName || sib.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}
