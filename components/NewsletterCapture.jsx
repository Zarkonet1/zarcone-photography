'use client';

import { useState } from 'react';
import styles from './NewsletterCapture.module.css';

export default function NewsletterCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus('submitting');

    // Use Mailchimp JSONP endpoint (no API key / no CORS issues)
    const callbackName = '_mc_cb_' + Date.now();
    const url =
      `https://zarconephotography.us2.list-manage.com/subscribe/post-json` +
      `?u=2f558ed24ee358ab87bfca777&id=3cf2a2a124` +
      `&EMAIL=${encodeURIComponent(email)}&c=${callbackName}`;

    const timeout = setTimeout(() => {
      setStatus('error');
      cleanup();
    }, 8000);

    function cleanup() {
      clearTimeout(timeout);
      delete window[callbackName];
      const s = document.getElementById(callbackName);
      if (s) s.remove();
    }

    window[callbackName] = (data) => {
      cleanup();
      if (data.result === 'success') {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    };

    const script = document.createElement('script');
    script.id = callbackName;
    script.src = url;
    document.body.appendChild(script);
  }

  return (
    <section className={styles.wrap}>
      <div className={styles.inner}>
        {status === 'success' ? (
          <div className={styles.success}>
            <p className={styles.successMark}>✓</p>
            <h3 className={styles.successH}>You're in.</h3>
            <p className={styles.successP}>Watch your inbox for upcoming sessions, events, and coverage from the field.</p>
          </div>
        ) : (
          <>
            <div className={styles.copy}>
              <p className="eyebrow">Stay In The Loop</p>
              <h2 className={styles.heading}>
                Upcoming portrait sessions,<br />events, and local news.
              </h2>
              <p className={styles.sub}>
                No spam — just occasional updates when something worth seeing is happening.
              </p>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={styles.input}
                disabled={status === 'submitting'}
              />
              <button
                type="submit"
                className={styles.btn}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending…' : 'Subscribe'}
              </button>
              {status === 'error' && (
                <p className={styles.errorMsg}>Something went wrong — please try again.</p>
              )}
            </form>
          </>
        )}
      </div>
    </section>
  );
}
