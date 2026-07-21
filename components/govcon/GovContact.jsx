'use client';

import { useState } from 'react';
import { CONTACT, CAPABILITY_STATEMENT } from '@/lib/govconData';
import { trackGovEvent, GOV_EVENTS } from '@/lib/govconAnalytics';
import styles from './govcon.module.css';

const initialForm = { name: '', organization: '', email: '', phone: '', description: '' };

export default function GovContact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/govcon-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('sent');
      trackGovEvent(GOV_EVENTS.QUOTE_REQUEST_SUBMIT, { organization: form.organization || 'unspecified' });
      setForm(initialForm);
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className={`${styles.section} ${styles.anchorOffset}`} aria-labelledby="contact-heading">
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2 id="contact-heading" className={styles.h2}>{CONTACT.headline}</h2>
        </div>

        <div className={styles.contactGrid}>
          {/* Direct contact + repeat CTAs */}
          <div>
            <div className={styles.contactDirect}>
              <p className={styles.contactLine}>
                <a href={CONTACT.phoneHref} onClick={() => trackGovEvent(GOV_EVENTS.CONTACT_PHONE_CLICK)}>
                  {CONTACT.phone}
                </a>
              </p>
              <p className={styles.contactLine}>
                <a href={CONTACT.emailHref} onClick={() => trackGovEvent(GOV_EVENTS.CONTACT_EMAIL_CLICK)}>
                  {CONTACT.email}
                </a>
              </p>
            </div>

            <div className={styles.btnRow}>
              <a
                href={CAPABILITY_STATEMENT.fileHref}
                className={styles.btnSecondary}
                download
                onClick={() => trackGovEvent(GOV_EVENTS.CAPABILITY_STATEMENT_DOWNLOAD, { location: 'contact-section' })}
              >
                Download Capability Statement
              </a>
              <a
                href={CONTACT.schedulingHref}
                className={styles.btnPrimary}
                onClick={() => trackGovEvent(GOV_EVENTS.BRIEFING_CLICK)}
              >
                Schedule a Capabilities Briefing
              </a>
            </div>
          </div>

          {/* Request a Quote */}
          <form onSubmit={handleSubmit} aria-label="Request a quote">
            <label className={styles.formLabel} htmlFor="gov-name">Name</label>
            <input id="gov-name" className={styles.formField} type="text" required value={form.name} onChange={update('name')} />

            <label className={styles.formLabel} htmlFor="gov-org">Agency / Organization</label>
            <input id="gov-org" className={styles.formField} type="text" value={form.organization} onChange={update('organization')} />

            <label className={styles.formLabel} htmlFor="gov-email">Email</label>
            <input id="gov-email" className={styles.formField} type="email" value={form.email} onChange={update('email')} />

            <label className={styles.formLabel} htmlFor="gov-phone">Phone</label>
            <input id="gov-phone" className={styles.formField} type="tel" value={form.phone} onChange={update('phone')} />

            <label className={styles.formLabel} htmlFor="gov-desc">Brief Description</label>
            <textarea
              id="gov-desc"
              className={styles.formField}
              rows={4}
              required
              value={form.description}
              onChange={update('description')}
            />

            <button type="submit" className={styles.btnPrimary} disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Request a Quote'}
            </button>

            {status === 'sent' && (
              <p role="status" style={{ marginTop: 12, fontSize: 13.5, color: 'var(--gov-navy)' }}>
                Request received — we typically respond within one business day.
              </p>
            )}
            {status === 'error' && (
              <p role="alert" style={{ marginTop: 12, fontSize: 13.5, color: '#8a1f2b' }}>
                Something went wrong. Please email {CONTACT.email} directly.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
