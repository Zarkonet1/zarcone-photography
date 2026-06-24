export const metadata = {
  title: 'Event Photographer New Jersey | Corporate & Charity Events | Zarcone Photography',
  description: 'Professional event photographer in New Jersey — corporate events, charity fundraisers, galas, and celebrations. Based in Bridgewater, NJ, serving NJ, NYC, and Philadelphia.',
  alternates: {
    canonical: '/events',
  },
  openGraph: {
    title: 'Event Photographer New Jersey | Corporate & Charity Events | Zarcone Photography',
    description: 'Professional event photographer in New Jersey — corporate events, charity fundraisers, galas, and celebrations.',
    url: 'https://zarconephotography.com/events',
    images: [
      {
        url: 'https://zarconephotography.com/photos/EVENT-Zarcone-Photography-28.jpg',
        width: 1200,
        height: 800,
        alt: 'Event photography New Jersey — Zarcone Photography',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://zarconephotography.com/photos/EVENT-Zarcone-Photography-28.jpg'],
  },
};

export default function EventsLayout({ children }) {
  return children;
}
