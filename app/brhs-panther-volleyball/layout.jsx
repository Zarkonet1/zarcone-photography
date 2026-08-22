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
        url: 'https://www.zarconephotography.com/photos/BRHS-Volleyball-0213.jpg',
        width: 1200,
        height: 800,
        alt: 'Bridgewater-Raritan Panther Girls Volleyball photography — Zarcone Photography',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://www.zarconephotography.com/photos/BRHS-Volleyball-0213.jpg'],
  },
};

export default function BRHSPantherVolleyballLayout({ children }) {
  return children;
}
