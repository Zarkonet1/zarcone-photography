export const metadata = {
  title: 'About Tom Zarcone | NJ Portrait & Sports Photographer',
  description: 'Meet Tom Zarcone — a professional photographer based in Bridgewater, NJ with a passion for portraits, high school sports, and events. Learn about his approach and experience.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Tom Zarcone | NJ Portrait & Sports Photographer',
    description: 'Meet Tom Zarcone — a professional photographer based in Bridgewater, NJ with a passion for portraits, high school sports, and events.',
    url: 'https://zarconephotography.com/about',
    images: [
      {
        url: 'https://zarconephotography.com/photos/tz-headshot.jpg',
        width: 1200,
        height: 800,
        alt: 'Tom Zarcone — NJ Photographer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://zarconephotography.com/photos/tz-headshot.jpg'],
  },
};

export default function AboutLayout({ children }) {
  return children;
}
