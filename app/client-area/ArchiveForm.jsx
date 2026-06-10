'use client';

import { useState } from 'react';
import styles from './ArchiveForm.module.css';

// ─── Replace this with your Formspree form ID ────────────────────────────────
// 1. Go to https://formspree.io and sign up (free)
// 2. Create a new form — set the email to tom.zarcone@mac.com
// 3. Copy the form ID (looks like "xabc1234") and paste it below
const FORMSPREE_ID = 'mlgklzvy';
// ─────────────────────────────────────────────────────────────────────────────

export default function ArchiveForm() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [form, setForm] = useState({ name: '', email: '', session: '', message: '' });

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          _subject: `Archive Gallery Request — ${form.name}`,
          session: form.session,
          message: form.message,
        }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', session: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  function close() {
    setOpen(false);
    setTimeout(() => setStatus('idle'), 300);
  }

  return (
    <>
      <button className={`btn ${styles.trigger}`} onClick={() => setOpen(true)}>
        Request My Gallery Link →
      </button>

      {open && (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) close(); }}>
          <div className={styles.modal}>

            <button className={styles.close} onClick={close} aria-label="Close">✕</button>

            {status === 'success' ? (
              <div className={styles.successState}>
                <p className={`eyebrow ${styles.eyebrow}`}>Request Sent</p>
                <h2 className={styles.title}>Got it.</h2>
                <p className={styles.successMsg}>
                  I'll track down your gallery link and send it to your email within 24 hours.
                </p>
                <button className="btn" onClick={close}>Close</button>
              </div>
            ) : (
              <>
                <p className={`eyebrow ${styles.eyebrow}`}>Archive Gallery</p>
                <h2 className={styles.title}>Request Your Link</h2>
                <p className={styles.subtitle}>
                  Fill in a few details and I'll resend your private gallery link within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label}>Your Name</label>
                      <input
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Email Address</label>
                      <input
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="jane@email.com"
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Session Description & Date</label>
                    <input
                      name="session"
                      type="text"
                      required
                      value={form.session}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="e.g. Senior portraits · May 2024 · Bridgewater NJ"
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Anything else? <span className={styles.optional}>(optional)</span></label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      className={`${styles.input} ${styles.textarea}`}
                      placeholder="Any additional details that might help me find your session..."
                      rows={3}
                    />
                  </div>

                  {status === 'error' && (
                    <p className={styles.errorMsg}>Something went wrong. Please try again or email directly.</p>
                  )}

                  <button
                    type="submit"
                    className={`btn ${styles.submitBtn}`}
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Sending…' : 'Send Request →'}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}
