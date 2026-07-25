'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EVENTS } from '@/lib/events';
import { SCHEDULE_2026 as FOOTBALL_SCHEDULE } from '@/lib/footballSchedule';
import { DUAL_SCHEDULE_2026_27 as WRESTLING_SCHEDULE } from '@/lib/wrestlingSchedule';
import { getNextMatch } from '@/lib/teamSchedule';
import styles from './AnnouncementBar.module.css';

// Zarcone Photography Main banner — the sitewide default (mini sessions,
// charity events, etc.) — is just EVENTS.filter(upcoming) at the bottom of
// this component, unchanged from before. Don't touch that path.
//
// On a team hub page, the bar instead narrows to that team's own content —
// its Media/Kickoff Day event (if tagged in lib/events.js) plus a derived
// Season Opener/Next Game-or-Match — instead of cycling in sitewide promos
// that don't belong on a team page. To give another team page the same
// treatment, add one entry below; nothing else needs to change.
const TEAM_BANNERS = [
  {
    pathPrefix: '/brhs-panther-football',
    team: 'football',
    schedule: FOOTBALL_SCHEDULE,
    scheduleHref: '/brhs-panther-football#schedule',
    nextLabel: 'Next Game',
  },
  {
    pathPrefix: '/brhs-panther-wrestling',
    team: 'wrestling',
    schedule: WRESTLING_SCHEDULE,
    scheduleHref: '/brhs-panther-wrestling#results',
    nextLabel: 'Next Match',
    // WRESTLING_SCHEDULE (lib/wrestlingSchedule.js) is empty as of this
    // writing — MaxPreps hasn't published 2026-27 dual dates yet — so until
    // it fills in, this banner shows only wrestling-tagged EVENTS entries
    // (currently none) and may render nothing at all on that page. Expected,
    // not a bug; same honesty-over-fake-content call as the football
    // standings table. Add wrestling dates to that file, or a
    // `team: 'wrestling'` event to lib/events.js, and it activates on its own.
  },
];

function getTeamBannerItems(config) {
  const items = EVENTS
    .filter((e) => e.status === 'upcoming' && e.team === config.team)
    .map((e) => ({ title: e.title, date: e.date, href: e.link?.startsWith('/') ? e.link : '/news' }));

  // Derived from the same schedule the team page itself reads — don't
  // hand-type a duplicate "Next Game/Match" entry in lib/events.js, that's
  // exactly the kind of duplication that goes stale (see
  // lib/footballSchedule.js / lib/wrestlingSchedule.js).
  const nextDate = getNextMatch(config.schedule, null);
  if (nextDate) {
    const seasonUnderway = config.schedule.some((g) => g.result);
    items.push({
      title: seasonUnderway ? config.nextLabel : 'Season Opener',
      date: nextDate,
      href: config.scheduleHref,
    });
  }
  return items;
}

export default function AnnouncementBar() {
  const pathname = usePathname();
  const activeBanner = TEAM_BANNERS.find((b) => pathname?.startsWith(b.pathPrefix));
  const upcoming = activeBanner ? getTeamBannerItems(activeBanner) : EVENTS.filter(e => e.status === 'upcoming');
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  // Reset the cycle position whenever the active banner swaps (e.g.
  // navigating between the football page, the wrestling page, and
  // everywhere else) so idx never points past the new list's end.
  useEffect(() => {
    setIdx(0);
  }, [activeBanner?.team]);

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
