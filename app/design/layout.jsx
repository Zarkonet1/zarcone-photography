export const metadata = {
  title: 'Graphic Design Services NJ | Print & Digital | Zarcone Photography',
  description: 'Professional graphic design services alongside photography — print materials, digital assets, and visual branding. Based in Bridgewater, NJ, serving New Jersey, NYC, and Philadelphia.',
  alternates: {
    canonical: '/design',
  },
  openGraph: {
    title: 'Graphic Design Services NJ | Print & Digital | Zarcone Photography',
    description: 'Professional graphic design services — print materials, digital assets, and visual branding. Based in Bridgewater, NJ.',
    url: 'https://zarconephotography.com/design',
    images: [
      {
        url: 'https://zarconephotography.com/photos/tz-headshot.jpg',
        width: 1200,
        height: 800,
        alt: 'Graphic design services NJ — Zarcone Photography',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://zarconephotography.com/photos/tz-headshot.jpg'],
  },
};

export default function DesignLayout({ children }) {
  return children;
}
