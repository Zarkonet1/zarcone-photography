import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Zarcone Photography',
  description: 'Portraits, Sports & Events Photography — Somerville, NJ · New York City · Philadelphia',
  openGraph: {
    title: 'Zarcone Photography',
    description: 'Portraits, Sports & Events Photography — Somerville, NJ · New York City · Philadelphia',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
