export const metadata = {
  title: 'About Tom Zarcone | NJ Portrait & Sports Photographer',
  description: 'Meet Tom Zarcone — a professional photographer based in Bridgewater, NJ specializing in portraits, high school sports, and events.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Tom Zarcone | NJ Portrait & Sports Photographer',
    description: 'Meet Tom Zarcone — a professional photographer based in Bridgewater, NJ with a passion for portraits, high school sports, and events.',
    url: 'https://www.zarconephotography.com/about',
    images: [
      {
        url: 'https://www.zarconephotography.com/photos/tz-headshot.jpg',
        width: 1200,
        height: 800,
        alt: 'Tom Zarcone — NJ Photographer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://www.zarconephotography.com/photos/tz-headshot.jpg'],
  },
};

export default function AboutLayout({ children }) {
  return children;
}
