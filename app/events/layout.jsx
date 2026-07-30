export const metadata = {
  title: 'Event Photographer NJ | Corporate & Charity | Zarcone',
  description: 'Professional event photographer in New Jersey — corporate events, charity fundraisers, galas, and celebrations. Bridgewater, NJ.',
  alternates: {
    canonical: '/events',
  },
  openGraph: {
    title: 'Event Photographer NJ | Corporate & Charity | Zarcone',
    description: 'Professional event photographer in New Jersey — corporate events, charity fundraisers, galas, and celebrations.',
    url: 'https://www.zarconephotography.com/events',
    images: [
      {
        url: 'https://www.zarconephotography.com/photos/EVENT-Zarcone-Photography-28.jpg',
        width: 1200,
        height: 800,
        alt: 'Event photography New Jersey — Zarcone Photography',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://www.zarconephotography.com/photos/EVENT-Zarcone-Photography-28.jpg'],
  },
};

export default function EventsLayout({ children }) {
  return children;
}
