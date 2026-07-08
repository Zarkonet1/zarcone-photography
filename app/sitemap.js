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
  ];

  return staticRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : route === '/brhs-panther-football' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route === '/portrait-parties' ? 0.9 : route === '/brhs-panther-football' ? 0.9 : 0.8,
  }));
}
