'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Nav.module.css';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  const links = [
    { href: '/sports',        label: 'Sports'    },
    { href: '/portraits',     label: 'Portraits' },
    { href: '/events',        label: 'Events'    },
    { href: '/design',        label: 'Design'    },
    { href: '/blog',          label: 'Blog'      },
    { href: '/news',          label: 'News'      },
    { href: '/pricing',       label: 'Pricing'      },
    { href: '/about',         label: 'About'        },
    { href: '/client-area',   label: 'View Your Gallery'  },
  ];

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <Link href="/" className={styles.logo}>
        <Image
          src="/assets/logo-white.png"
          alt="Zarcone Photography"
          width={160}
          height={52}
          style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
          priority
        />
      </Link>

      {/* Desktop links */}
      <ul className={styles.links}>
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`${styles.link} ${pathname === href ? styles.active : ''}`}
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/about#contact" className={styles.inquireBtn}>
            Inquire
          </Link>
        </li>
      </ul>

      {/* Mobile hamburger */}
      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`} />
        <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`} />
        <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.mobileLink} ${pathname === href ? styles.active : ''}`}
            >
              {label}
            </Link>
          ))}
          <Link href="/about#contact" className={styles.mobileInquireBtn}>
            Inquire
          </Link>
        </div>
      )}
    </nav>
  );
}
