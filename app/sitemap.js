export default function sitemap() {
  const base = 'https://zarconephotography.com';

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

  return staticRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : weeklyPages.includes(route) ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route === '/portrait-parties' ? 0.9 : weeklyPages.includes(route) ? 0.9 : 0.8,
  }));
}
