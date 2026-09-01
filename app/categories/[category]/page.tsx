import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  getAllCategories,
  getCategoryBySlug,
  type CategoryDefinition,
} from '../../../lib/categories'
import {
  createPageMetadata,
  generateCategoryPageSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '../../../lib/seo'
import CategoryClient from './CategoryClient'

interface CategoryPageProps {
  params: Promise<{ category: string }> | { category: string }
}

export async function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((cat) => ({
    category: cat.slug,
  }))
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const category = getCategoryBySlug(resolvedParams.category)
  if (!category) {
    return {
      title: 'Category Not Found — IconSearch',
    }
  }

  return createPageMetadata({
    title: `${category.title} (2026) — IconSearch`,
    description: `${category.description} Free for commercial and personal web development with one-click React, Vue, Svelte, and SVG export.`,
    path: `/categories/${category.slug}`,
    keywords: [
      `${category.name.toLowerCase()} icons`,
      `free ${category.slug} svg`,
      ...category.keywords.map((k) => `${k} icons`),
      'open source vector icons',
      'react icons',
    ],
  })
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const category = getCategoryBySlug(resolvedParams.category)

  if (!category) {
    notFound()
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories' },
    { name: category.name, url: `/categories/${category.slug}` },
  ]

  const categorySchema = generateCategoryPageSchema({
    name: category.title,
    description: category.description,
    path: `/categories/${category.slug}`,
    count: 1000,
    icons: category.iconSampleNames.map((s) => ({
      name: s.displayName,
      url: `/api/svg/${s.library}/${s.name}`,
    })),
  })

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs)
  const faqSchema = generateFAQSchema(category.faqs)

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [categorySchema, breadcrumbSchema, faqSchema],
  }

  const relatedCats = category.relatedCategories
    .map((slug) => getCategoryBySlug(slug))
    .filter(Boolean) as CategoryDefinition[]

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 48px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaGraph).replace(/</g, '\\u003c'),
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumbs"
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          fontSize: '13px',
          fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--text-dim)',
          marginBottom: '28px',
        }}
      >
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
          Home
        </Link>
        <span>/</span>
        <Link href="/categories" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
          Categories
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--accent)' }}>{category.name}</span>
      </nav>

      {/* Hero Header */}
      <header
        style={{
          marginBottom: '40px',
          paddingBottom: '32px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: 'var(--accent)',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '2px',
            marginBottom: '12px',
            textTransform: 'uppercase',
          }}
        >
          CATEGORY TAXONOMY
        </div>
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '16px',
            color: 'var(--text)',
          }}
        >
          {category.title}
        </h1>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '16px',
            maxWidth: '820px',
            lineHeight: 1.8,
            marginBottom: '24px',
          }}
        >
          {category.description}
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link
            href={`/icon-search?category=${category.slug}`}
            style={{
              background: 'var(--accent)',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '13px',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 600,
            }}
          >
            Search All {category.name} Icons →
          </Link>
          <span
            style={{
              fontSize: '13px',
              color: 'var(--text-dim)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            Over 229 open-source libraries indexed
          </span>
        </div>
      </header>

      {/* Interactive Icon Explorer Client */}
      <section style={{ marginBottom: '56px' }}>
        <CategoryClient category={category} />
      </section>

      {/* FAQs Section with Structured Data */}
      {category.faqs.length > 0 && (
        <section
          style={{
            marginBottom: '56px',
            borderTop: '1px solid var(--border)',
            paddingTop: '40px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: 'var(--accent)',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '2px',
              marginBottom: '12px',
            }}
          >
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2
            style={{
              fontSize: '22px',
              fontWeight: 800,
              marginBottom: '20px',
              color: 'var(--text)',
            }}
          >
            {category.name} Icon Integration FAQ
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {category.faqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '20px 24px',
                }}
              >
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    marginBottom: '8px',
                    color: 'var(--text)',
                  }}
                >
                  {faq.q}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Categories Navigation */}
      {relatedCats.length > 0 && (
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '40px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>
            Explore Related Icon Categories
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {relatedCats.map((rel) => (
              <Link
                key={rel.slug}
                href={`/categories/${rel.slug}`}
                style={{
                  display: 'block',
                  background: 'var(--code-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '16px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: '6px',
                  }}
                >
                  {rel.name} →
                </h3>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {rel.shortTitle} vector icons & snippets
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
