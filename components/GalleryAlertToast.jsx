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
    // localStorage, not sessionStorage — sessionStorage is scoped to one
    // browser tab/session, so a dismissal never survives closing the tab
    // or (critically, per real user report 2026-08-25) opening the link
    // again from an in-app browser like Messages, which frequently gets a
    // fresh session per tap even for the "same" site. localStorage is
    // scoped to the origin/device instead, so a real dismissal actually
    // sticks. Falls back to sessionStorage read (best-effort) so anyone
    // who dismissed under the old code doesn't immediately see it pop
    // back up the moment this ships.
    if (localStorage.getItem(dismissKey) === '1') return;
    if (sessionStorage.getItem(dismissKey) === '1') return;

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setVisible(true);
    };

    // Scroll-triggered only — no blind timer. A flat setTimeout used to fire
    // this at 4s regardless of scroll position, which meant on a fresh page
    // load it could pop up and sit directly on top of a hero's primary CTA
    // before the visitor had scrolled at all (real bug reported by BRHS
    // Booster Club president, 2026-08-25: toast covered the football
    // dashboard's "Game Day Info" button). Scroll > 500px means the visitor
    // has moved past the top of the page/hero on every team page this
    // renders on, so the toast only ever appears over content they've
    // already scrolled by, never over the hero itself.
    const onScroll = () => {
      if (window.scrollY > 500) show();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [dismissKey]);

  // Writes the flag without hiding the card — used on successful submit,
  // where the visitor should still see the "you're in" confirmation for a
  // moment rather than have the card vanish out from under them.
  function persistDismiss() {
    if (typeof window !== 'undefined') localStorage.setItem(dismissKey, '1');
  }

  function handleClose() {
    persistDismiss();
    setVisible(false);
  }

  // onSuccess also writes the dismiss flag, not just the X button —
  // previously a submitted signup showed a "you're in" message that never
  // persisted anywhere, so the card could pop back up on the next visit
  // as if nothing had happened. Submitting now counts as permanently
  // dismissed, same as closing it, but the card stays up briefly so the
  // confirmation is actually readable before it goes away.
  function handleSuccess() {
    persistDismiss();
    setTimeout(() => setVisible(false), 3000);
  }

  if (!visible) return null;

  return (
    <div className={styles.toastWrap}>
      <button className={styles.close} onClick={handleClose} aria-label="Dismiss">×</button>
      <GalleryAlertSignup team={team} source={source} colors={colors} compact onSuccess={handleSuccess} />
    </div>
  );
}
