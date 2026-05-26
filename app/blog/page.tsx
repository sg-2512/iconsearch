import { getAllPosts } from '../../lib/blog'
import BlogContent from './BlogContent'

export const metadata = {
  title: 'Blog — Icon Library Guides, Tutorials & Updates | IconSearch',
  description: 'Guides, tutorials, comparisons and updates about open source icon libraries for React, Next.js and Vue developers.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main>
      <BlogContent posts={posts} />
    </main>
  )
}