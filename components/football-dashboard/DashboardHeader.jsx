'use client';

// Restrained page-level header for the BRHS Football dashboard rebuild
// (2026-08-25) — sits below the sitewide logo-only Nav + AnnouncementBar,
// giving the page its own team identity strip without repeating the full
// marketing nav. Deliberately minimal per the brief: team name, season,
// ZP credit line (small, not competing with the team branding), and three
// anchor links into the retained detail sections below. Senior Night and
// Highlights are NOT linked here — no real content exists for either yet
// (Tom's call, 2026-08-25); add them back to `links` below once they do.
import Image from 'next/image';
import styles from './DashboardHeader.module.css';

const links = [
  { href: '#gallery-alert', label: 'Galleries' },
  { href: '#roster', label: 'Team' },
  { href: '#schedule', label: 'Schedule' },
];

export default function DashboardHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.identity}>
        <Image
          src="/photos/brhs-panther-athletics-logo.png"
          alt="Bridgewater-Raritan Panther Athletics"
          width={56}
          height={56}
          style={{ width: 44, height: 44, objectFit: 'contain' }}
        />
        <div className={styles.identityText}>
          <span className={styles.teamName}>Bridgewater-Raritan Panthers Football</span>
          <span className={styles.season}>2026 Season</span>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Dashboard sections">
        {links.map((l) => (
          <a key={l.href} href={l.href} className={styles.navLink}>{l.label}</a>
        ))}
      </nav>

      <span className={styles.credit}>
        Zarcone Photography <em>Official Media Partner</em>
      </span>
    </div>
  );
}
