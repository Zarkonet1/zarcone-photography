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
    { href: '/sports',           label: 'Sports'          },
    { href: '/portraits',        label: 'Portraits'       },
    { href: '/portrait-parties', label: 'Portrait Parties' },
    { href: '/events',           label: 'Events'          },
    { href: '/design',        label: 'Design'    },
    { href: '/blog',          label: 'Blog'      },
    { href: '/news',          label: 'News'      },
    { href: '/pricing',       label: 'Pricing'      },
    { href: '/about',         label: 'About'        },
    { href: '/client-area',   label: 'View Your Gallery'  },
  ];

  // Prospect Trigger pages (/high_school/...) render as a standalone,
  // single-purpose experience — no site nav. Mirrors the existing
  // government-contracting exclusion pattern already used on
  // AnnouncementBar/ChatWidget below. Hook order preserved: this check
  // runs after all hooks above.
  if (pathname?.startsWith('/high_school')) return null;

  // BRHS team hub pages (football pilot, 2026-08-25): logo-only header —
  // no marketing links/Inquire button. These pages are dashboards for a
  // specific team's parents/fans, not top-of-funnel marketing pages, and
  // the full ZP nav read as clutter (direct feedback from BRHS PAC
  // president). The team page's own in-page quick-nav pills (Schedule,
  // Standings, Stats, Roster, etc.) are the primary navigation instead.
  // Scoped to football only for now — expand to wrestling/volleyball once
  // the pilot is validated. Hook order preserved: runs after all hooks above.
  if (pathname === '/brhs-panther-football') {
    return (
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <Link href="/" className={styles.logo} aria-label="Zarcone Photography — home">
          <Image
            src="/assets/logo-white.png"
            alt="Zarcone Photography"
            width={160}
            height={52}
            style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
            priority
          />
        </Link>
      </nav>
    );
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <Link href="/" className={styles.logo} aria-label="Zarcone Photography — home">
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
