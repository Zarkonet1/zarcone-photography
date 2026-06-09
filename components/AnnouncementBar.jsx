'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EVENTS } from '@/lib/events';
import styles from './AnnouncementBar.module.css';

export default function AnnouncementBar() {
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
      }, 400);
    }, 4000);
    return () => clearInterval(t);
  }, [upcoming.length]);

  if (upcoming.length === 0) return null;

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
