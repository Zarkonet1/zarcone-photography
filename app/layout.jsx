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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <AnnouncementBar />
        <main style={{ paddingTop: 'var(--bar-h)' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
