import type { MetadataRoute } from 'next'
import { SITE_URL } from '../lib/seo'

const allowPaths = ['/', '/api/icon-search', '/api/icons', '/api/svg/']
const disallowPaths = ['/api/', '/auth/', '/account/', '/oauth/', '/connect']

const searchEngineBots = [
  'Googlebot',
  'Bingbot',
  'bingbot',
  'MSNBot',
  'DuckDuckBot',
  'Baiduspider',
  'YandexBot',
]

const aiCrawlerBots = [
  'GPTBot',
  'ClaudeBot',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'Anthropic-AI',
  'Bytespider',
  'cohere-ai',
  'DuckAssistBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: searchEngineBots,
        allow: allowPaths,
        disallow: disallowPaths,
      },
      {
        userAgent: aiCrawlerBots,
        allow: allowPaths,
        disallow: disallowPaths,
      },
      {
        userAgent: '*',
        allow: allowPaths,
        disallow: disallowPaths,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    other: {
      'llms-txt': `${SITE_URL}/llms.txt`,
    },
  } as MetadataRoute.Robots & { other?: Record<string, string> }
}


