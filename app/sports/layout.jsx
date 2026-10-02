export const metadata = {
  title: 'Sports Photography Portfolio | Zarcone Photography, Bridgewater NJ',
  description: 'Portfolio of game-day and athlete sports photography by Zarcone Photography in Bridgewater, NJ: football, wrestling, volleyball, lacrosse, basketball and more.',
  alternates: {
    canonical: '/sports',
  },
  openGraph: {
    title: 'Sports Photography Portfolio | Zarcone Photography, Bridgewater NJ',
    description: 'Portfolio of game-day and athlete sports photography from Bridgewater, NJ: football, wrestling, volleyball, lacrosse, basketball and more.',
    url: 'https://www.zarconephotography.com/sports',
    images: [
      {
        url: 'https://www.zarconephotography.com/photos/i-s7zBdzk.jpg',
        width: 1200,
        height: 800,
        alt: 'NJ high school sports photography — Zarcone Photography',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://www.zarconephotography.com/photos/i-s7zBdzk.jpg'],
  },
};

export default function SportsLayout({ children }) {
  return children;
}
