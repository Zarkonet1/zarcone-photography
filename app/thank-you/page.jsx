'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '../not-found.module.css';

// Reads the last tracked CTA (set by components/TrackedCta.jsx) so a lead can be
// tied back to the button that started it. Ignored if older than 2 hours.
function lastCta() {
  try {
    const raw = window.sessionStorage.getItem('zp_last_cta');
    if (!raw) return null;
    const c = JSON.parse(raw);
    if (!c || Date.now() - c.ts > 2 * 60 * 60 * 1000) return null;
    return c;
  } catch (e) {
    return null;
  }
}

export default function ThankYouPage() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    // HoneyBook may run its redirect inside the embedded form's iframe (About
    // page #contact). If so, this page loaded inside that frame: move the whole
    // window here instead and let the top-level load count the lead, so it's
    // counted once and the visitor sees a full page, not a site-in-a-box.
    try {
      if (window.top !== window.self) {
        window.top.location.replace(window.location.href);
        return;
      }
    } catch (e) {
      /* cross-origin parent: can't break out, so count it from here */
    }

    // A refresh or back-button revisit shouldn't count a second lead.
    try {
      const last = Number(window.sessionStorage.getItem('zp_lead_counted') || 0);
      if (Date.now() - last < 30 * 60 * 1000) return;
    } catch (e) { /* storage blocked: count it */ }

    const form = new URLSearchParams(window.location.search).get('form') || 'web_contact_inquiry';

    let tries = 0;
    const send = () => {
      try {
        if (typeof window.gtag === 'function') {
          const c = lastCta();
          window.gtag('event', 'generate_lead', {
            form_name: form,
            cta_location: c ? c.location : 'unknown',
            cta_label: c ? c.label : 'unknown',
            cta_page: c ? c.page : 'unknown',
          });
          try {
            window.sessionStorage.setItem('zp_lead_counted', String(Date.now()));
            window.sessionStorage.removeItem('zp_last_cta');
          } catch (e) { /* ignore */ }
          return;
        }
      } catch (e) {
        return;
      }
      // gtag not ready yet (script still loading): retry briefly, then give up.
      if (++tries < 20) setTimeout(send, 250);
    };
    send();
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <p className="eyebrow">Inquiry received</p>
        <h1 className={styles.title}>Thank you.</h1>
        <p className={styles.desc}>
          We have your inquiry and will follow up with you directly. If it is time sensitive,
          call (908) 777-0631.
        </p>
        <div className={styles.links}>
          <Link href="/" className="btn btn-solid">Back to Home</Link>
          <Link href="/sports" className="btn">See the Work</Link>
        </div>
      </div>
    </div>
  );
}
