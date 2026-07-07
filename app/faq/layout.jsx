export const metadata = {
  title: 'FAQ | Zarcone Photography — Bridgewater, NJ',
  description: 'Answers to common questions about booking, sessions, turnaround times, and galleries. Bridgewater, NJ photographer.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'FAQ | Zarcone Photography',
    description: 'Answers to common questions about booking, sessions, turnaround times, galleries, and more.',
    url: 'https://zarconephotography.com/faq',
    images: [
      {
        url: 'https://zarconephotography.com/photos/tz-headshot.jpg',
        width: 1200,
        height: 800,
        alt: 'Zarcone Photography — NJ Photographer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://zarconephotography.com/photos/tz-headshot.jpg'],
  },
};

export default function FaqLayout({ children }) {
  return children;
}
