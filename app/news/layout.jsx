export const metadata = {
  title: 'News & Updates | Zarcone Photography — Bridgewater, NJ',
  description: 'Latest news and announcements from Zarcone Photography — NJ portrait, sports, and event photographer based in Bridgewater, NJ.',
  alternates: {
    canonical: '/news',
  },
  openGraph: {
    title: 'News & Updates | Zarcone Photography',
    description: 'Latest news and announcements from Zarcone Photography — NJ portrait, sports, and event photographer.',
    url: 'https://www.zarconephotography.com/news',
    images: [
      {
        url: 'https://www.zarconephotography.com/photos/tz-headshot.jpg',
        width: 1200,
        height: 800,
        alt: 'Zarcone Photography — NJ Photographer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://www.zarconephotography.com/photos/tz-headshot.jpg'],
  },
};

export default function NewsLayout({ children }) {
  return children;
}
