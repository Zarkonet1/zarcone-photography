'use client';

// Media Center — the primary in-page navigation grid (introduced for
// football, 2026-08-25; generalized same day for reuse across team pages).
// This replaces the old sticky pill-nav bar entirely; having both would be
// exactly the "competing CTAs" the original brief said to avoid. Each tile
// does one thing: jump to that section further down the page.
//
// `tiles` is optional — defaults to football's original 5-tile array, so
// football's existing `<MediaCenterGrid newsHasNew={...} />` call keeps
// rendering exactly as before. Other team pages pass their own `tiles`
// array; grid CSS uses auto-fit so it reflows cleanly at any tile count.
import Image from 'next/image';
import styles from './MediaCenterGrid.module.css';

const DEFAULT_TILES = [
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
// the page — no separate rule invented here). Only a tile labeled "News"
// reads this prop; every other tile ignores it.
export default function MediaCenterGrid({ tiles = DEFAULT_TILES, newsHasNew }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.heading}>Media Center</span>
      <div className={styles.grid}>
        {tiles.map((t) => (
          <a key={t.href} href={t.href} className={styles.tile}>
            <div className={styles.imgWrap}>
              {t.img ? (
                <Image src={t.img} alt="" fill sizes="(max-width: 700px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
              ) : (
                // No real photo on file yet for this tile (generalized
                // 2026-08-27) — plain gradient block instead of a stock or
                // fabricated image.
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: t.fallbackGradient || 'linear-gradient(160deg, #202024 0%, #0a0a0a 100%)' }} />
              )}
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
