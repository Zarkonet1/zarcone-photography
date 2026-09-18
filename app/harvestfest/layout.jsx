// /harvestfest is a real, public-facing ZP marketing page — unlike the
// Prospect Trigger pages (/high_school/...) or the Mahwah concept page,
// it makes no single-prospect pitch and carries no partnership claim that
// needs to stay out of search. Per Tom (2026-09-18): leave it indexed.
// Metadata lives here (not in page.jsx) because page.jsx is a client
// component — same pattern as app/events/layout.jsx and app/sports/layout.jsx.
export const metadata = {
  title: 'Zarcone Photography at the Wagner Farm Harvest Festival | NJ Photographer',
  description: 'Visit the Zarcone Photography booth at the Wagner Farm Arboretum Harvest Festival, Sept 26, 2026 — sports, senior portraits, family portraits, schools & teams, and events photography in New Jersey.',
  alternates: {
    canonical: '/harvestfest',
  },
  openGraph: {
    title: 'Zarcone Photography at the Wagner Farm Harvest Festival',
    description: 'Sports, senior portraits, family portraits, schools & teams, and events photography — see the work, or enter to win a session.',
    type: 'website',
    url: 'https://www.zarconephotography.com/harvestfest',
    images: [
      {
        url: 'https://www.zarconephotography.com/photos/i-HkmJPk8.jpg',
        width: 1600,
        height: 2400,
        alt: 'Zarcone Photography — Wagner Farm Harvest Festival',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://www.zarconephotography.com/photos/i-HkmJPk8.jpg'],
  },
};

export default function HarvestFestLayout({ children }) {
  return children;
}
