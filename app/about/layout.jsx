export const metadata = {
  title: 'About Tom Zarcone — Veteran-Owned NJ Photographer',
  description: 'SDVOSB-certified photographer with 30 years behind the camera. Portraits, high school sports & events across NJ, NYC & Philadelphia — meet Tom.',
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
