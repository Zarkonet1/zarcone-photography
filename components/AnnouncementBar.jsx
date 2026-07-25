'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EVENTS } from '@/lib/events';
import { SCHEDULE_2026 as FOOTBALL_SCHEDULE_2026 } from '@/lib/footballSchedule';
import { getNextMatch } from '@/lib/teamSchedule';
import styles from './AnnouncementBar.module.css';

// On the football hub page, the bar narrows to football-only content —
// Media Day, then the Season Opener, then Next Game once the season's
// underway — instead of cycling in sitewide mini-session/charity promos
// that don't belong on a team page. Everywhere else, behavior is unchanged.
function getFootballItems() {
  const items = EVENTS
    .filter((e) => e.status === 'upcoming' && e.team === 'football')
    .map((e) => ({ title: e.title, date: e.date, href: e.link?.startsWith('/') ? e.link : '/news' }));

  // Derived from the same SCHEDULE_2026 the football page itself reads —
  // don't hand-type a duplicate "Next Game" entry in lib/events.js, that's
  // exactly the kind of duplication that goes stale (see lib/footballSchedule.js).
  const nextGameDate = getNextMatch(FOOTBALL_SCHEDULE_2026, null);
  if (nextGameDate) {
    const seasonUnderway = FOOTBALL_SCHEDULE_2026.some((g) => g.result);
    items.push({
      title: seasonUnderway ? 'Next Game' : 'Season Opener',
      date: nextGameDate,
      href: '/brhs-panther-football#schedule',
    });
  }
  return items;
}

export default function AnnouncementBar() {
  const pathname = usePathname();
  const onFootballPage = pathname?.startsWith('/brhs-panther-football');
  const upcoming = onFootballPage ? getFootballItems() : EVENTS.filter(e => e.status === 'upcoming');
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  // Reset the cycle position whenever the active list swaps (e.g. navigating
  // onto/off the football page) so idx never points past the new list's end.
  useEffect(() => {
    setIdx(0);
  }, [onFootballPage]);

  useEffect(() => {
    if (upcoming.length <= 1) return;
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % upcoming.length);
        setVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(t);
  }, [upcoming.length]);

  // The Government Practice page is deliberately kept free of consumer
  // promotional content (mini sessions, seasonal events) — it undercuts
  // the "quiet competence, not marketing" positioning that page is built
  // around. Hook order is preserved: this check runs after all hooks.
  if (upcoming.length === 0 || pathname?.startsWith('/government-contracting')) return null;

  const event = upcoming[idx] || upcoming[0];

  return (
    <div className={styles.bar}>
      <Link href={event.href || '/news'} className={`${styles.inner} ${visible ? styles.show : styles.hide}`}>
        <span className={styles.label}>Upcoming</span>
        <span className={styles.divider}>·</span>
        <span className={styles.title}>{event.title}</span>
        <span className={styles.divider}>·</span>
        <span className={styles.date}>{event.date}</span>
        <span className={styles.arrow}>→</span>
      </Link>
    </div>
  );
}
