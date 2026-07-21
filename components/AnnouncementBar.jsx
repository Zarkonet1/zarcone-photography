'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EVENTS } from '@/lib/events';
import styles from './AnnouncementBar.module.css';

export default function AnnouncementBar() {
  const pathname = usePathname();
  const upcoming = EVENTS.filter(e => e.status === 'upcoming');
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

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

  const event = upcoming[idx];

  return (
    <div className={styles.bar}>
      <Link href="/news" className={`${styles.inner} ${visible ? styles.show : styles.hide}`}>
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
