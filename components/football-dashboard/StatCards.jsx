'use client';

// Four compact dashboard cards directly below the hero — replaces the old
// 5-tile Live Season Tracker + separate Program Stat Bar (2026-08-25
// rebuild). Deliberately just 4 numbers, matching the brief exactly:
// Record | Next Game | Last Result | Season. Everything the old Program
// Stat Bar showed (playoff record, sectional-finalist history, coach
// tenure) is still on the page in full further down — this row is a
// summary, not a replacement.
import styles from './StatCards.module.css';

export default function StatCards({ record, nextGameDate, nextGameOpponent, latestResult, seasonYear, seasonSub }) {
  const cards = [
    { label: 'Record', value: record },
    { label: 'Next Game', value: nextGameDate, sub: nextGameOpponent },
    { label: 'Last Result', value: latestResult || '—' },
    { label: 'Season', value: seasonYear, sub: seasonSub },
  ];
  return (
    <div className={styles.grid}>
      {cards.map((c, i) => (
        <div key={i} className={styles.card}>
          <span className={styles.label}>{c.label}</span>
          <span className={styles.value}>{c.value}</span>
          {c.sub && <span className={styles.sub}>{c.sub}</span>}
        </div>
      ))}
    </div>
  );
}
