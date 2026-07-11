'use client';

import { useEffect, useState } from 'react';
import GalleryAlertSignup from './GalleryAlertSignup';
import styles from './GalleryAlertToast.module.css';

/**
 * Non-blocking corner card — surfaces the gallery-alert opt-in near the top
 * of the viewport early in a visit, without a full-screen modal takeover.
 *
 * Deliberately NOT a blocking popup (see project memory,
 * project_gallery_ready_alerts_feature, 2026-07-11 follow-up): a Diib-style
 * interstitial fights the site's non-interruptive, sales-psychology-tuned
 * design. This slides in, can be dismissed, and won't re-show for the rest
 * of the browser session once closed or submitted.
 */
export default function GalleryAlertToast({ team, source, colors, dismissKey }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(dismissKey) === '1') return;

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setVisible(true);
    };

    const timer = setTimeout(show, 4000);
    const onScroll = () => {
      if (window.scrollY > 500) show();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [dismissKey]);

  function handleClose() {
    setVisible(false);
    if (typeof window !== 'undefined') sessionStorage.setItem(dismissKey, '1');
  }

  if (!visible) return null;

  return (
    <div className={styles.toastWrap}>
      <button className={styles.close} onClick={handleClose} aria-label="Dismiss">×</button>
      <GalleryAlertSignup team={team} source={source} colors={colors} compact />
    </div>
  );
}
