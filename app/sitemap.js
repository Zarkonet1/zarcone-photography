import { getAllPosts } from '@/lib/posts';

export default function sitemap() {
  // Canonical host is www — the apex domain 301s here. Sitemap URLs must
  // point straight at the canonical host so crawlers don't have to follow
  // an extra redirect hop to reach the indexable page.
  const base = 'https://www.zarconephotography.com';

  const staticRoutes = [
    '',
    '/about',
    '/portraits',
    '/sports',
    '/events',
    '/design',
    '/pricing',
    '/portrait-parties',
    '/faq',
    '/client-area',
    '/blog',
    '/news',
    '/sports-photographer-nj',
    '/senior-portrait-photographer-nj',
    '/event-photographer-nj',
    '/schools-athletic-programs-nj',
    '/brhs-panther-football',
    '/brhs-panther-wrestling',
  ];

  const weeklyPages = ['/brhs-panther-football', '/brhs-panther-wrestling'];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : weeklyPages.includes(route) ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route === '/portrait-parties' ? 0.9 : weeklyPages.includes(route) ? 0.9 : 0.8,
  }));

  // Individual blog posts were missing from the sitemap entirely, which was
  // one reason several posts sat in Google's "crawled, not indexed" queue.
  const postEntries = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries];
}
