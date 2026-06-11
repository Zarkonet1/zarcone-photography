import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <Link href="/" className={styles.logo}>
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
        <span className={styles.copy}>© {new Date().getFullYear()} Zarcone Photography, LLC &nbsp;·&nbsp; Service-Disabled Veteran-Owned Small Business &nbsp;·&nbsp; <a href="tel:9087770631" style={{color:'inherit'}}>(908) 777-0631</a> &nbsp;·&nbsp; <a href="mailto:info@zarconephotography.com" style={{color:'inherit'}}>info@zarconephotography.com</a></span>
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
