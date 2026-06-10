'use client';

import { useEffect } from 'react';
import styles from './InstagramFeed.module.css';

// ─── Paste your Elfsight widget ID here ──────────────────────────────────────
// After creating your widget in Elfsight, copy the script tag they give you.
// It looks like: <script src="https://static.elfsight.com/platform/platform.js"></script>
//                <div class="elfsight-app-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"></div>
// Paste just the ID (the part after "elfsight-app-") below:
const ELFSIGHT_WIDGET_ID = 'b843682f-a9c3-4e3c-baef-345f2b522f95';
// ─────────────────────────────────────────────────────────────────────────────

export default function InstagramFeed() {
  useEffect(() => {
    if (!ELFSIGHT_WIDGET_ID) return;
    if (document.querySelector('script[src*="elfsight"]')) return;
    const script = document.createElement('script');
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (!ELFSIGHT_WIDGET_ID) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className="eyebrow">On Instagram</p>
        <h2 className={styles.title}>Follow Along</h2>
        <a
          href="https://instagram.com/zarconephotography"
          target="_blank"
          rel="noreferrer"
          className={styles.handle}
        >
          @zarconephotography
        </a>
      </div>
      <div className={`elfsight-app-${ELFSIGHT_WIDGET_ID}`} data-elfsight-app-lazy />
    </section>
  );
}
