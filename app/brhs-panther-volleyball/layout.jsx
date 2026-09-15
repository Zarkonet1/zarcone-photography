export const metadata = {
  title: 'Bridgewater-Raritan Panther Volleyball Photos | Zarcone Photography',
  description: 'Zarcone Photography — photography partner of Bridgewater-Raritan Panther Girls Volleyball — match day galleries, Media Day portraits, Senior Night, and photo ordering.',
  alternates: {
    canonical: '/brhs-panther-volleyball',
  },
  keywords: [
    'Bridgewater-Raritan Volleyball Photos',
    'Bridgewater Volleyball Photographer',
    'NJ High School Volleyball Photographer',
    'Bridgewater Sports Photography',
    'Panther Volleyball Photography',
    'Media Day Photography NJ',
    'High School Sports Photographer NJ',
    'Bridgewater-Raritan Panthers',
    'Bridgewater Volleyball Pictures',
    'Senior Sports Portraits NJ',
  ],
  openGraph: {
    title: 'Bridgewater-Raritan Panther Volleyball — Zarcone Photography',
    description: 'Match day galleries, Media Day portraits, and Senior Night coverage for BRHS Panther Girls Volleyball — a Zarcone Photography partnership.',
    url: 'https://www.zarconephotography.com/brhs-panther-volleyball',
    type: 'website',
    images: [
      {
        // Updated 2026-09-15 — same hero photo now used on the page itself
        // (2026-09-08 vs. Mt. Saint Mary Academy). Dimensions match the
        // actual file's ~5:4 aspect (2200x1760) rather than the old fixed
        // 1200x800, so social crawlers don't letterbox/crop it oddly.
        url: 'https://www.zarconephotography.com/photos/BRHS-Volleyball-2026-MSM-Kill.jpg',
        width: 1200,
        height: 960,
        alt: 'Bridgewater-Raritan Panther Girls Volleyball photography — Zarcone Photography',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://www.zarconephotography.com/photos/BRHS-Volleyball-2026-MSM-Kill.jpg'],
  },
};

export default function BRHSPantherVolleyballLayout({ children }) {
  return children;
}
