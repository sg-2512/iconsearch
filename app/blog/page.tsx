import { getAllPosts } from '../../lib/blog'
import Link from 'next/link'

export const metadata = {
  title: 'Blog — Icon Library Guides, Tutorials & Updates | IconSearch',
  description: 'Guides, tutorials, comparisons and updates about open source icon libraries for React, Next.js and Vue developers.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 48px' }}>

      {/* Header */}
      <section style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px', marginBottom: '12px' }}>
          // BLOG
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
          Guides & Tutorials
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '500px', lineHeight: 1.6 }}>
          Deep dives into icon libraries, migration guides, comparisons and best practices for React and Next.js developers.
        </p>
      </section>

      {/* Posts */}
      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
          // no posts yet — check back soon
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="blog-card-link"
              style={{
                background: 'var(--bg-card)',
                padding: '24px 28px',
                textDecoration: 'none',
                color: 'var(--text)',
                display: 'grid',
                gridTemplateColumns: '1fr 28px',
                gap: '16px',
                alignItems: 'center',
                borderBottom: index < posts.length - 1 ? '1px solid var(--border)' : 'none',
                borderLeft: post.featured ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'background 0.15s',
              }}
            >
              <div>
                {/* Meta row */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '10px',
                    color: 'var(--accent)',
                    fontFamily: 'JetBrains Mono, monospace',
                    background: 'var(--accent-muted)',
                    border: '1px solid var(--accent)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    letterSpacing: '0.5px',
                    fontWeight: 600,
                  }}>
                    {post.category?.toUpperCase()}
                  </span>

                  {post.featured && (
                    <span style={{
                      fontSize: '10px',
                      color: 'var(--accent)',
                      fontFamily: 'JetBrains Mono, monospace',
                      background: 'var(--accent-muted)',
                      border: '1px solid var(--accent)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}>
                      ★ featured
                    </span>
                  )}

                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>·</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{post.date}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>·</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{post.author}</span>
                </div>

                {/* Title */}
                <h2 style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  lineHeight: 1.35,
                  color: 'var(--text)',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  {post.title}
                </h2>

                {/* Description */}
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  lineHeight: 1.65,
                  marginBottom: '14px',
                  margin: '0 0 14px',
                }}>
                  {post.description}
                </p>

                {/* Tags */}
                {post.tags?.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {post.tags.map((tag: string) => (
                      <span key={tag} style={{
                        fontSize: '10px',
                        color: 'var(--text-muted)',
                        fontFamily: 'JetBrains Mono, monospace',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        padding: '2px 7px',
                        borderRadius: '4px',
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Arrow */}
              <span style={{
                color: 'var(--accent)',
                fontSize: '18px',
                fontFamily: 'JetBrains Mono, monospace',
                flexShrink: 0,
                alignSelf: 'center',
              }}>
                →
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Hover style injected inline */}
      <style>{`
        .blog-card-link:hover {
          background: var(--bg-secondary) !important;
        }
        .blog-card-link:hover span:last-child {
          color: var(--accent);
        }
      `}</style>

    </main>
  )
}