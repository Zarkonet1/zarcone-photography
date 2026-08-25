'use client';

// Media Center — the primary in-page navigation grid (2026-08-25 rebuild).
// This replaces the old sticky pill-nav bar entirely; having both would be
// exactly the "competing CTAs" the brief says to avoid. Each tile does one
// thing: jump to that section further down the page.
//
// Brief specifies a 3x2 grid (Game Galleries, Meet the Team, Media Day,
// Schedule, Senior Night, Highlights). Senior Night and Highlights are
// commented out below, not deleted — Tom's explicit call (2026-08-25): no
// real content exists for either yet, so don't link out to nothing. News
// added same day as a 5th tile (Tom's follow-up, after seeing the live
// preview) — grid CSS uses auto-fit so it reflows cleanly at any tile
// count and goes back to a true 3x2 the moment Senior Night/Highlights are
// uncommented.
import Image from 'next/image';
import styles from './MediaCenterGrid.module.css';

const TILES = [
  { label: 'Game Galleries', sub: 'View Photos', href: '#gallery-alert', img: '/photos/SPORTS-FB100.jpg' },
  { label: 'Meet the Team', sub: 'Roster & Coaches', href: '#roster', img: '/photos/media-day-varsity-team.jpg' },
  { label: 'Media Day', sub: 'View Portraits', href: '#media-day', img: '/photos/media-day-varsity-coaches.jpg' },
  { label: 'Schedule', sub: 'Full Season', href: '#schedule', img: '/photos/SPORTS-Zarcone-Photography-45.jpg' },
  { label: 'News', sub: 'Latest Coverage', href: '#news', img: '/photos/SPORTS-Zarcone-Photography-0088.jpg' },
  // { label: 'Senior Night', sub: 'View Gallery', href: '#senior-night', img: '' },
  // { label: 'Highlights', sub: 'Watch Videos', href: '#highlights', img: '' },
];

// newsHasNew: true if the most recent article is within the "New" window
// (same isRecentArticle threshold the full News section already uses down
// the page — no separate rule invented here). Only the News tile reads
// this prop; every other tile ignores it.
export default function MediaCenterGrid({ newsHasNew }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.heading}>Media Center</span>
      <div className={styles.grid}>
        {TILES.map((t) => (
          <a key={t.href} href={t.href} className={styles.tile}>
            <div className={styles.imgWrap}>
              <Image src={t.img} alt="" fill sizes="(max-width: 700px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
              <div className={styles.tileScrim} />
            </div>
            <div className={styles.tileText}>
              <span className={styles.tileLabel}>
                {t.label}
                {t.label === 'News' && newsHasNew && <span className={styles.newBadge}>New</span>}
              </span>
              <span className={styles.tileSub}>{t.sub} →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
