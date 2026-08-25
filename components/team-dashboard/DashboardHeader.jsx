'use client';

// Restrained page-level header for the BRHS team dashboard pattern
// (introduced for football, 2026-08-25; generalized 2026-08-25 same day for
// reuse across team pages — folder renamed football-dashboard → team-dashboard
// at the same time). Sits below the sitewide logo-only Nav + AnnouncementBar,
// giving the page its own team identity strip without repeating the full
// marketing nav. Deliberately minimal per the original brief: team name,
// season, ZP credit line (small, not competing with the team branding), and
// a handful of anchor links into the retained detail sections below.
//
// All props are optional with football's original values as defaults, so
// football's existing `<DashboardHeader />` call (no props) keeps rendering
// exactly as before — this generalization is purely additive, zero behavior
// change for football.
import Image from 'next/image';
import styles from './DashboardHeader.module.css';

const DEFAULT_LINKS = [
  { href: '#gallery-alert', label: 'Galleries' },
  { href: '#roster', label: 'Team' },
  { href: '#schedule', label: 'Schedule' },
];

export default function DashboardHeader({
  teamName = 'Bridgewater-Raritan Panthers Football',
  season = '2026 Season',
  logoSrc = '/photos/brhs-panther-athletics-logo.png',
  logoAlt = 'Bridgewater-Raritan Panther Athletics',
  links = DEFAULT_LINKS,
  creditLine = 'Zarcone Photography',
  creditSuffix = 'Official Media Partner',
}) {
  return (
    <div className={styles.header}>
      <div className={styles.identity}>
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={56}
          height={56}
          style={{ width: 44, height: 44, objectFit: 'contain' }}
        />
        <div className={styles.identityText}>
          <span className={styles.teamName}>{teamName}</span>
          <span className={styles.season}>{season}</span>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Dashboard sections">
        {links.map((l) => (
          <a key={l.href} href={l.href} className={styles.navLink}>{l.label}</a>
        ))}
      </nav>

      <span className={styles.credit}>
        {creditLine} <em>{creditSuffix}</em>
      </span>
    </div>
  );
}
