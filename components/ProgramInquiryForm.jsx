'use client';

import { useState } from 'react';
import styles from './ProgramInquiryForm.module.css';

export default function ProgramInquiryForm() {
  const [form, setForm] = useState({
    name: '', title: '', school: '', sport: '', email: '', phone: '', message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/program-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.success}>
        <p className="eyebrow">Message Received</p>
        <h3>We'll be in touch shortly.</h3>
        <p>Thank you for reaching out. We'll review your inquiry and respond within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <p className="eyebrow">Program Inquiries</p>
      <h3 className={styles.heading}>Let's Have That Conversation</h3>
      <p className={styles.sub}>Tell us about your program and what a season partnership could look like. We'll follow up within 24 hours.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Name *</label>
            <input className={styles.input} name="name" value={form.name} onChange={handleChange} required placeholder="Your name" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Title / Role</label>
            <input className={styles.input} name="title" value={form.title} onChange={handleChange} placeholder="Athletic Director, Head Coach…" />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>School / Program</label>
            <input className={styles.input} name="school" value={form.school} onChange={handleChange} placeholder="School or organization name" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Sport(s)</label>
            <input className={styles.input} name="sport" value={form.sport} onChange={handleChange} placeholder="Football, Wrestling, Basketball…" />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Email *</label>
            <input className={styles.input} type="email" name="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Phone</label>
            <input className={styles.input} type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="(000) 000-0000" />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Tell us about your program</label>
          <textarea className={styles.textarea} name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Season timeline, number of events, what you're looking for…" />
        </div>
        <button type="submit" className="btn btn-solid" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send Inquiry'}
        </button>
        {status === 'error' && (
          <p className={styles.error}>Something went wrong. Please try again or email us directly at info@zarconephotography.com.</p>
        )}
      </form>
    </div>
  );
}
