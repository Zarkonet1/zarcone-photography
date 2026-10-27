// BRHS Panther Girls Basketball Media Hub — metadata.
// Positioning (brief, 2026-10-27): an independent media resource developed
// and maintained by Zarcone Photography. Not an official BRHS/BRRSD page,
// not an endorsed or exclusive partnership — keep every string here
// consistent with that. No og:image yet: no approved basketball photo exists,
// and the brief rules out reusing other sports' photos, so the site default
// applies. Set one here when IMAGE_SLOTS.hero gets a real photo.
export const metadata = {
  title: 'BRHS Panther Girls Basketball Media Hub 2026–27 | Zarcone Photography',
  description:
    'Independent media hub for Bridgewater-Raritan Panther Girls Varsity Basketball, 2026–27: schedule, results, stats, news and game photography by Zarcone Photography.',
  alternates: {
    canonical: '/brhs-panther-girls-basketball',
  },
  keywords: [
    'Bridgewater-Raritan Girls Basketball',
    'BRHS Girls Basketball',
    'Bridgewater-Raritan Panthers Basketball',
    'Bridgewater Girls Basketball Photos',
    'NJ High School Basketball Photographer',
    'Skyland Conference Girls Basketball',
    'Somerset County Girls Basketball',
  ],
  openGraph: {
    title: 'BRHS Panther Girls Basketball Media Hub 2026–27 | Zarcone Photography',
    description:
      'Schedule, results, stats, news and game photography for Bridgewater-Raritan Panther Girls Varsity Basketball — an independent media hub by Zarcone Photography.',
    url: 'https://www.zarconephotography.com/brhs-panther-girls-basketball',
    type: 'website',
  },
};

export default function BRHSPantherGirlsBasketballLayout({ children }) {
  return children;
}
