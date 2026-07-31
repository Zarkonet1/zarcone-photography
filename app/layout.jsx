import './globals.css';
import Script from 'next/script';
import Nav from '@/components/Nav';
import AnnouncementBar from '@/components/AnnouncementBar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import ImageProtection from '@/components/ImageProtection';
import InlineImageLightbox from '@/components/InlineImageLightbox';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  metadataBase: new URL('https://www.zarconephotography.com'),
  title: 'Zarcone Photography — NJ Portrait & Sports Photographer',
  description: 'Professional photographer based in Bridgewater, NJ specializing in portraits, high school sports, and events across NJ, NYC & Philly.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Zarcone Photography — NJ Portrait & Sports Photographer',
    description: 'Professional photographer based in Bridgewater, NJ specializing in portraits, high school sports, and events across NJ, NYC & Philly.',
    type: 'website',
    url: 'https://www.zarconephotography.com',
    images: [
      {
        url: 'https://www.zarconephotography.com/photos/tz-headshot.jpg',
        width: 1200,
        height: 800,
        alt: 'Zarcone Photography — NJ Photographer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zarcone Photography — NJ Portrait & Sports Photographer',
    description: 'Professional photographer based in Bridgewater, NJ specializing in portraits, high school sports, and events across NJ, NYC & Philly.',
    images: ['https://www.zarconephotography.com/photos/tz-headshot.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.zarconephotography.com',
  name: 'Zarcone Photography',
  description: 'Professional photographer and videographer specializing in portraits, sports, and events. Based in Bridgewater, NJ — serving New Jersey, New York City, and Philadelphia.',
  url: 'https://www.zarconephotography.com',
  telephone: '(908) 777-0631',
  email: 'info@zarconephotography.com',
  image: 'https://www.zarconephotography.com/photos/tz-headshot.jpg',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '726 Route 202 South, Suite 320 #369',
    addressLocality: 'Bridgewater',
    addressRegion: 'NJ',
    postalCode: '08807',
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
        <ChatWidget />
        <ImageProtection />
        <InlineImageLightbox />
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QN40GY3478"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QN40GY3478');
          `}
        </Script>
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <Script id="clarity-init" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");

              (function() {
                try {
                  var ref = document.referrer || '';
                  var entryReferrer = 'other';
                  if (!ref) {
                    entryReferrer = 'direct';
                  } else if (ref.indexOf('instagram') !== -1) {
                    entryReferrer = 'instagram';
                  } else if (ref.indexOf('facebook') !== -1) {
                    entryReferrer = 'facebook';
                  }
                  window.clarity('set', 'entry_referrer', entryReferrer);
                  window.clarity('set', 'entry_page', window.location.pathname);
                } catch (e) {}
              })();
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
