'use client';

// Compact schedule preview — next (or most recent) 3-4 games, per the
// brief. The full schedule table (all 9 games, MaxPreps sourcing note,
// standings, playoff history) stays exactly where it is further down the
// page — this is a preview layer on top of it, not a replacement, so
// nothing here should be treated as the source of truth.
import styles from './CompactSchedule.module.css';

export default function CompactSchedule({ games }) {
  // Show the next 4 unplayed games; if fewer than 4 remain, backfill with
  // the most recent played game(s) so the widget doesn't look sparse late
  // in the season.
  const upcoming = games.filter((g) => !g.result).slice(0, 4);
  const needed = 4 - upcoming.length;
  const recentPlayed = needed > 0
    ? [...games].filter((g) => g.result).slice(-needed).reverse()
    : [];
  const rows = [...recentPlayed.reverse(), ...upcoming];

  return (
    <div className={styles.wrap}>
      <div className={styles.headRow}>
        <span className={styles.heading}>Schedule</span>
        <a href="#schedule" className={styles.link}>Full Schedule →</a>
      </div>
      <div className={styles.list}>
        {rows.map((g, i) => (
          <div key={i} className={styles.row}>
            <span className={styles.date}>{g.date}</span>
            <span className={styles.opponent}>{g.opponent}</span>
            <span className={styles.badge}>{g.home ? 'Home' : 'Away'}</span>
            <span className={styles.time}>{g.time}</span>
            <span className={g.result ? (g.result.win ? styles.win : styles.loss) : styles.pending}>
              {g.result ? `${g.result.win ? 'W' : 'L'} ${g.result.score}` : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
