'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();

  // Prospect Trigger pages (/high_school/...) render as a standalone,
  // single-purpose experience — no site footer. Mirrors the existing
  // government-contracting exclusion pattern used on AnnouncementBar/
  // ChatWidget. Converted this component to a client component solely to
  // read the pathname here — no other behavior changed.
  if (pathname?.startsWith('/high_school')) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <Link href="/" className={styles.logo} aria-label="Zarcone Photography — home">
          <Image
            src="/assets/logo-white.png"
            alt="Zarcone Photography"
            width={120}
            height={40}
            style={{ height: '28px', width: 'auto', objectFit: 'contain', opacity: 0.45 }}
          />
        </Link>
        <div className={styles.navGroup}>
          <div className={styles.navColumn}>
            <span className={styles.navLabel}>Services</span>
            <Link href="/senior-portrait-photographer-nj">Senior Portraits</Link>
            <Link href="/sports-photographer-nj">Sports Coverage</Link>
            <Link href="/event-photographer-nj">Event Coverage</Link>
            <Link href="/schools-athletic-programs-nj">Schools &amp; Programs</Link>
            <Link href="/government-contracting">Government Contracting</Link>
          </div>
          <nav className={styles.navColumn}>
            <span className={styles.navLabel}>Navigation</span>
            <Link href="/portraits">Portraits</Link>
            <Link href="/sports">Sports</Link>
            <Link href="/events">Events</Link>
            <Link href="/about">About</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/about#contact">Inquire</Link>
          </nav>
        </div>
      </div>
      <div className={styles.bottom}>
        <span className={styles.copy}>© {new Date().getFullYear()} Zarcone Photography, LLC &nbsp;·&nbsp; Service-Disabled Veteran-Owned Small Business &nbsp;·&nbsp; <a href="tel:9087770631" style={{color:'inherit'}}>(908) 777-0631</a> &nbsp;·&nbsp; <a href="mailto:info@zarconephotography.com" style={{color:'inherit'}}>info@zarconephotography.com</a> &nbsp;·&nbsp; 726 Route 202 South, Suite 320 #369, Bridgewater, NJ 08807</span>
        <nav className={styles.legal}>
          <Link href="/faq">FAQ</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/acceptable-use">Acceptable Use</Link>
        </nav>
      </div>
    </footer>
  );
}
