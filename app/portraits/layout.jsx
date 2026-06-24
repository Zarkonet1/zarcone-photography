export const metadata = {
  title: 'Portrait Photography NJ | Senior & Family Portraits | Zarcone Photography',
  description: 'Professional portrait photography in New Jersey — senior portraits, family portraits, headshots, and lifestyle sessions. Based in Bridgewater, NJ, serving NJ, NYC & Philadelphia.',
  alternates: {
    canonical: '/portraits',
  },
  openGraph: {
    title: 'Portrait Photography NJ | Senior & Family Portraits | Zarcone Photography',
    description: 'Professional portrait photography in New Jersey — senior portraits, family portraits, headshots, and lifestyle sessions.',
    url: 'https://zarconephotography.com/portraits',
    images: [
      {
        url: 'https://zarconephotography.com/photos/PORTRAIT-Zarcone-Photography-0002.jpg',
        width: 1200,
        height: 800,
        alt: 'Portrait photography NJ — Zarcone Photography',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://zarconephotography.com/photos/PORTRAIT-Zarcone-Photography-0002.jpg'],
  },
};

export default function PortraitsLayout({ children }) {
  return children;
}
