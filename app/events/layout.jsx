export const metadata = {
  title: 'Event Photography Portfolio | Galas, Fundraisers & Celebrations | Zarcone Photography',
  description: 'A portfolio of real events photographed by Zarcone Photography — charity fundraisers, galas, live music, and milestone celebrations. Booking a corporate or private event? See our NJ event photography services.',
  alternates: {
    canonical: '/events',
  },
  openGraph: {
    title: 'Event Photography Portfolio | Galas, Fundraisers & Celebrations | Zarcone Photography',
    description: 'A portfolio of real events photographed by Zarcone Photography — fundraisers, galas, live music, and celebrations.',
    url: 'https://www.zarconephotography.com/events',
    images: [
      {
        url: 'https://www.zarconephotography.com/photos/EVENT-Zarcone-Photography-28.jpg',
        width: 1200,
        height: 800,
        alt: 'Event photography portfolio — Zarcone Photography',
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
