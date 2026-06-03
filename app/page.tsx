import { icons } from '../lib/icons'
import { getAllPosts } from '../lib/blog'
import { staticPages } from '../data/static-pages'
import DynamicHome from './components/DynamicHome'

export const metadata = {
  title: 'IconSearch — Find & Compare Free SVG Icon Libraries (2026)',
  description: 'Search 350,000+ free SVG icons across Lucide, Heroicons, Tabler, Phosphor, Bootstrap, Remix, Feather, Radix, Iconoir, IonIcons, Octicons, and Iconify. Compare 16 React icon libraries by size, stars, and license.',
  keywords: 'free svg icons, react icons, icon library comparison, lucide icons, heroicons, tabler icons, phosphor icons, open source icons, bootstrap icons, remix icons, feather icons, iconoir icons, iconify',
  openGraph: {
    title: 'IconSearch — Find & Compare Free SVG Icon Libraries',
    description: 'Search 350,000+ free SVG icons across Lucide, Heroicons, Tabler, Phosphor, Bootstrap, Remix, Feather, Radix, Iconoir, IonIcons, Octicons, and Iconify.',
    url: 'https://iconsearch.info',
    siteName: 'IconSearch',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IconSearch — Find & Compare Free SVG Icon Libraries',
    description: 'Search 350,000+ free SVG icons across Lucide, Heroicons, Tabler, Phosphor, Bootstrap, Remix, Feather, Radix, Iconoir, IonIcons, Octicons, and Iconify.',
  },
  alternates: {
    canonical: 'https://iconsearch.info',
  },
}

export default function HomePage() {
  const posts = getAllPosts()
  
  const blogItems = posts.map(post => ({
    label: post.title,
    href: `/blog/${post.slug}`,
    date: post.date,
  }))

  const allRecentItems = [...blogItems, ...staticPages]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div>
      {/* FAQ Schema Markup for Search Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "What is the best free icon library for React?", "acceptedAnswer": { "@type": "Answer", "text": "Lucide Icons, Heroicons, and Iconoir are highly popular outline choices for React." }},
            { "@type": "Question", "name": "Are these icon libraries free to use commercially?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — all libraries use MIT or ISC licenses which allow free commercial use." }},
            { "@type": "Question", "name": "Which icon library has the most icons?", "acceptedAnswer": { "@type": "Answer", "text": "Iconify aggregates 350,000+ icons across 211 icon sets. React Icons aggregates 52,000+ icons. For single-system libraries, Tabler Icons has the largest collection with 6,100+ icons." }},
            { "@type": "Question", "name": "Can I use these icons with Next.js?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — all listed libraries ship as React components and work with Next.js App Router." }},
          ]
        })}}
      />

      {/* Render the core visual and interactive premium layout */}
      <DynamicHome initialLibraries={icons} recentItems={allRecentItems} />

      {/* Statically Rendered FAQ Section for Crawler Discovery */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '60px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Inter, sans-serif', marginBottom: '32px', letterSpacing: '-0.02em', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                q: 'What is the best free icon library for React?',
                a: 'Lucide Icons and Heroicons are the most popular choices. Lucide has 1,900+ outline icons with a beautiful visual balance, while Heroicons is handcrafted by the Tailwind CSS team and integrates seamlessly into Tailwind setups. Iconoir is another fantastic outline library with over 1,500 highly consistent items.',
              },
              {
                q: 'Are these icon libraries free to use commercially?',
                a: 'Yes. All libraries cataloged on IconSearch utilize highly permissive open-source licenses (MIT, CC0, or ISC), enabling unlimited commercial and private usage without mandatory attribution.',
              },
              {
                q: 'Which icon library has the most icons?',
                a: 'React Icons has the largest aggregate footprint with 52,000+ icons (bundling Font Awesome, Material, Tabler, Lucide, etc. in a single package). For single, visually cohesive packs, Tabler Icons contains over 6,100 high-quality outline and filled SVG components.',
              },
              {
                q: 'Can I use these icons with Next.js App Router?',
                a: 'Absolutely. All indexed libraries distribute React components that are fully tree-shakable. They render perfectly as Next.js Server Components, generating static SVG tags without needing any client-side JavaScript execution overhead.',
              },
              {
                q: 'What is the difference between Lucide, Heroicons, and Iconoir?',
                a: 'Lucide offers a vast, modern neutral outline vocabulary (1,900+ icons) based on Feather. Heroicons is solid/outline optimized for Tailwind with a tighter, heavier design style (320+ icons). Iconoir is an exceptionally elegant alternative focus with 1,500+ outline icons and rich custom stroke-width flexibility.',
              }
            ].map(({ q, a }, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: 'rgba(24,24,27,0.3)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '12px', 
                  padding: '24px',
                  transition: 'border-color 0.2s'
                }}
              >
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px', lineHeight: 1.4, color: 'var(--text)' }}>{q}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
