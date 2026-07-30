export const metadata = {
  title: 'NJ High School Sports Photographer | Zarcone Photography',
  description: 'Action sports photography for NJ high school athletes — football, wrestling, lacrosse, basketball, and more. Bridgewater, NJ.',
  alternates: {
    canonical: '/sports',
  },
  openGraph: {
    title: 'NJ High School Sports Photographer | Zarcone Photography',
    description: 'Action sports photography for NJ high school athletes — football, wrestling, lacrosse, basketball, gymnastics, baseball, and more.',
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
