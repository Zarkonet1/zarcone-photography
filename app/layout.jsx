import './globals.css';
import Nav from '@/components/Nav';
import AnnouncementBar from '@/components/AnnouncementBar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Zarcone Photography',
  description: 'Portraits, Sports & Events Photography — Bridgewater, NJ · New York City · Philadelphia',
  openGraph: {
    title: 'Zarcone Photography',
    description: 'Portraits, Sports & Events Photography — Bridgewater, NJ · New York City · Philadelphia',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://zarconephotography.com',
  name: 'Zarcone Photography',
  description: 'Professional photographer and videographer specializing in portraits, sports, and events. Based in Bridgewater, NJ — serving New Jersey, New York City, and Philadelphia.',
  url: 'https://zarconephotography.com',
  telephone: '',
  email: 'tom.zarcone@mac.com',
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
  sameAs: [],
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
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Nav />
        <AnnouncementBar />
        <main style={{ paddingTop: 'var(--bar-h)' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
