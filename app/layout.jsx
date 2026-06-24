import './globals.css';
import Nav from '@/components/Nav';
import AnnouncementBar from '@/components/AnnouncementBar';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  metadataBase: new URL('https://zarconephotography.com'),
  title: 'Zarcone Photography | NJ Photographer — Portraits, Sports & Events',
  description: 'Professional photographer based in Bridgewater, NJ specializing in portraits, high school sports, and events. Serving New Jersey, New York City, and Philadelphia.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Zarcone Photography | NJ Photographer — Portraits, Sports & Events',
    description: 'Professional photographer based in Bridgewater, NJ specializing in portraits, high school sports, and events. Serving New Jersey, New York City, and Philadelphia.',
    type: 'website',
    url: 'https://zarconephotography.com',
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
    title: 'Zarcone Photography | NJ Photographer — Portraits, Sports & Events',
    description: 'Professional photographer based in Bridgewater, NJ specializing in portraits, high school sports, and events. Serving New Jersey, New York City, and Philadelphia.',
    images: ['https://zarconephotography.com/photos/tz-headshot.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://zarconephotography.com',
  name: 'Zarcone Photography',
  description: 'Professional photographer and videographer specializing in portraits, sports, and events. Based in Bridgewater, NJ — serving New Jersey, New York City, and Philadelphia.',
  url: 'https://zarconephotography.com',
  telephone: '(908) 777-0631',
  email: 'info@zarconephotography.com',
  image: 'https://zarconephotography.com/photos/tz-headshot.jpg',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bridgewater',
    addressRegion: 'NJ',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 40.5896,
    longitude: -74.6032,
  },
  areaServed: [
    { '@type': 'State', name: 'New Jersey' },
    { '@type': 'City', name: 'New York City' },
    { '@type': 'City', name: 'Philadelphia' },
  ],
  sameAs: [
    'https://www.instagram.com/zarconephotography',
    'https://www.facebook.com/zarconephotography',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Photography Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Portrait Photography' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sports Photography' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Event Photography' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Graphic Design' } },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preload first hero image for LCP */}
        <link rel="preload" as="image" href="/photos/i-s7zBdzk-hero.jpg" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Nav />
        <AnnouncementBar />
        <main style={{ paddingTop: 'var(--bar-h)' }}>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
