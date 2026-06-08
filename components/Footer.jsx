import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Link href="/" className={styles.logo}>
        <Image
          src="/assets/logo-white.png"
          alt="Zarcone Photography"
          width={120}
          height={40}
          style={{ height: '28px', width: 'auto', objectFit: 'contain', opacity: 0.45 }}
        />
      </Link>
      <nav className={styles.nav}>
        <Link href="/portraits">Portraits</Link>
        <Link href="/sports">Sports</Link>
        <Link href="/events">Events</Link>
        <Link href="/about">About</Link>
        <Link href="/about#contact">Inquire</Link>
      </nav>
      <span className={styles.copy}>© {new Date().getFullYear()} Zarcone Photography, LLC</span>
    </footer>
  );
}
