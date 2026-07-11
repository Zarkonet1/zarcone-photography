'use client';

import { useState } from 'react';
import styles from './GalleryAlertSignup.module.css';

/**
 * Inline "notify me when new galleries post" capture.
 *
 * Deliberately NOT a score/schedule alert (see CLAUDE.md project notes,
 * 2026-07-11) — this ties the opt-in to something Zarcone Photography
 * actually controls and delivers: gallery publish, not live game results.
 *
 * Colors are passed as CSS var() strings so the component inherits each
 * hub page's own theme (e.g. --bp-navy on wrestling, --br-red on football)
 * without needing its own palette.
 */
export default function GalleryAlertSignup({
  team,           // "Wrestling" | "Football" — used in copy + backend routing
  source,         // e.g. "BRHS Panther Wrestling — Gallery Alert"
  colors = {},
}) {
  const {
    accent = 'currentColor',
    accentDark = 'currentColor',
    text = 'currentColor',
    textSoft = 'currentColor',
    bg = 'transparent',
    border = 'currentColor',
    btnText = '#fff',
  } = colors;

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, team, source }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div
      className={styles.card}
      style={{ '--gr-accent': accent, '--gr-accent-dark': accentDark, '--gr-text': text, '--gr-text-soft': textSoft, '--gr-bg': bg, '--gr-border': border, '--gr-btn-text': btnText }}
    >
      <div className={styles.copy}>
        <span className={styles.dot} />
        <div>
          <p className={styles.headline}>Get notified when new galleries post</p>
          <p className={styles.sub}>One email, right when {team.toLowerCase()} photos go live — no spam, unsubscribe anytime.</p>
        </div>
      </div>

      {status === 'success' ? (
        <p className={styles.success}>You&rsquo;re in — watch your inbox after the next gallery drop.</p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles.input}
            aria-label="Email address"
          />
          <button type="submit" className={styles.btn} disabled={status === 'sending'}>
            {status === 'sending' ? 'Joining…' : 'Notify Me'}
          </button>
        </form>
      )}
      {status === 'error' && <p className={styles.error}>Something went wrong — please try again.</p>}
    </div>
  );
}
