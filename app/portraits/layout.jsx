export const metadata = {
  title: 'Portrait Photography — Family, Individual & Headshots | Bridgewater NJ',
  description: 'Unhurried family, individual and headshot portrait sessions in Bridgewater, NJ, on location or in the studio. Seniors and lifestyle sessions too.',
  alternates: {
    canonical: '/portraits',
  },
  openGraph: {
    title: 'Portrait Photography — Family, Individual & Headshots | Bridgewater NJ',
    description: 'Unhurried family, individual and headshot portrait sessions in Bridgewater, NJ, on location or in the studio.',
    url: 'https://www.zarconephotography.com/portraits',
    images: [
      {
        url: 'https://www.zarconephotography.com/photos/PORTRAIT-Zarcone-Photography-0002.jpg',
        width: 1200,
        height: 800,
        alt: 'Portrait photography NJ — Zarcone Photography',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://www.zarconephotography.com/photos/PORTRAIT-Zarcone-Photography-0002.jpg'],
  },
};

export default function PortraitsLayout({ children }) {
  return children;
}
