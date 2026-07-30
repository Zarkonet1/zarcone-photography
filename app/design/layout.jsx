export const metadata = {
  title: 'Graphic Design Services NJ | Zarcone Photography',
  description: 'Professional graphic design alongside photography — print materials, digital assets, and visual branding. Based in Bridgewater, NJ.',
  alternates: {
    canonical: '/design',
  },
  openGraph: {
    title: 'Graphic Design Services NJ | Zarcone Photography',
    description: 'Professional graphic design services — print materials, digital assets, and visual branding. Based in Bridgewater, NJ.',
    url: 'https://www.zarconephotography.com/design',
    images: [
      {
        url: 'https://www.zarconephotography.com/photos/tz-headshot.jpg',
        width: 1200,
        height: 800,
        alt: 'Graphic design services NJ — Zarcone Photography',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://www.zarconephotography.com/photos/tz-headshot.jpg'],
  },
};

export default function DesignLayout({ children }) {
  return children;
}
