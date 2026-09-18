'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './HarvestFestExperience.module.css';
import { HARVESTFEST_CATEGORIES } from '@/lib/harvestfestCategories';
import { HARVESTFEST_OFFER } from '@/lib/harvestfestOffer';
import {
  trackHarvestFestEvent,
  tagHarvestFestClaritySource,
  HARVESTFEST_EVENTS,
} from '@/lib/harvestfestAnalytics';

// Everything interactive on /harvestfest lives in this one client-component
// island — the hero and header in app/harvestfest/page.jsx stay a plain
// server component for fast first paint. Two independent paths, per Tom
// (2026-09-18): browsing the five category tiles never asks for contact
// info, and the "Enter to Win" giveaway card IS the single lead-capture
// form — there is no separate generic "Connect With Us" form.
export default function HarvestFestExperience() {
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formValues, setFormValues] = useState({ name: '', email: '', phone: '', interest: '', context: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  useEffect(() => {
    tagHarvestFestClaritySource();
  }, []);

  const activeCategory = HARVESTFEST_CATEGORIES.find((c) => c.id === activeCategoryId) || null;

  function handleCategoryTap(category) {
    const next = activeCategoryId === category.id ? null : category.id;
    setActiveCategoryId(next);
    if (next) {
      trackHarvestFestEvent(HARVESTFEST_EVENTS.CATEGORY_SELECT, { category: category.id });
    }
  }

  function handleGalleryLinkClick(category) {
    trackHarvestFestEvent(HARVESTFEST_EVENTS.GALLERY_LINK_CLICK, { category: category.id });
  }

  function handleOpenForm() {
    setFormOpen(true);
    setFormValues((v) => ({
      ...v,
      interest: v.interest || activeCategory?.label || '',
    }));
    trackHarvestFestEvent(HARVESTFEST_EVENTS.ENTRY_FORM_OPEN, { category: activeCategoryId });
  }

  function handleFieldChange(field) {
    return (e) => setFormValues((v) => ({ ...v, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/harvestfest-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formValues, category: activeCategoryId }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      trackHarvestFestEvent(HARVESTFEST_EVENTS.ENTRY_FORM_SUBMIT_SUCCESS, { category: activeCategoryId });
    } catch {
      setStatus('error');
      trackHarvestFestEvent(HARVESTFEST_EVENTS.ENTRY_FORM_SUBMIT_ERROR, { category: activeCategoryId });
    }
  }

  return (
    <>
      {/* WHAT ARE YOU INTERESTED IN */}
      <section className={styles.categorySection}>
        <p className={`eyebrow ${styles.sectionEyebrow}`}>What are you interested in?</p>
        <div className={styles.grid}>
          {HARVESTFEST_CATEGORIES.map((category, i) => (
            <button
              key={category.id}
              type="button"
              className={`${styles.tile} ${i === 0 ? styles.tileWide : ''} ${activeCategoryId === category.id ? styles.tileActive : ''}`}
              style={{ backgroundImage: `url("${encodeURI(category.tileImage)}")` }}
              onClick={() => handleCategoryTap(category)}
              aria-pressed={activeCategoryId === category.id}
            >
              <span className={styles.tileOverlay} />
              <span className={styles.tileLabel}>{category.label}</span>
            </button>
          ))}
        </div>

        {activeCategory && (
          <div className={styles.reveal}>
            <p className={styles.revealBlurb}>{activeCategory.blurb}</p>
            <div className={styles.revealStrip}>
              {activeCategory.images.map((img) => (
                <img key={img.src} src={img.src} alt={img.alt} className={styles.revealImg} loading="lazy" />
              ))}
            </div>
            <Link
              href={activeCategory.exploreHref}
              className={styles.revealLink}
              onClick={() => handleGalleryLinkClick(activeCategory)}
            >
              {activeCategory.exploreLabel} →
            </Link>
          </div>
        )}
      </section>

      <div className={styles.orDivider}>
        <span className={styles.orLine} />
        <span className={styles.orText}>or</span>
        <span className={styles.orLine} />
      </div>

      {/* GIVEAWAY / LEAD CAPTURE — the single connect path */}
      <section className={styles.giveaway}>
        <p className={`eyebrow ${styles.giveawayEyebrow}`}>{HARVESTFEST_OFFER.eyebrow}</p>
        <h2 className={styles.giveawayHeadline}>{HARVESTFEST_OFFER.headline}</h2>

        {status === 'success' ? (
          <div className={styles.successBox}>
            <p className={styles.successHeadline}>{HARVESTFEST_OFFER.successHeadline}</p>
            <p className={styles.successBody}>{HARVESTFEST_OFFER.successBody}</p>
          </div>
        ) : !formOpen ? (
          <>
            <p className={styles.giveawayDesc}>{HARVESTFEST_OFFER.description}</p>
            <button type="button" className={`btn btn-solid ${styles.enterBtn}`} onClick={handleOpenForm}>
              {HARVESTFEST_OFFER.ctaLabel}
            </button>
          </>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              required
              placeholder="Name"
              value={formValues.name}
              onChange={handleFieldChange('name')}
              className={styles.input}
              aria-label="Name"
            />
            <div className={styles.inputRow}>
              <input
                type="email"
                placeholder="Email"
                value={formValues.email}
                onChange={handleFieldChange('email')}
                className={styles.input}
                aria-label="Email"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formValues.phone}
                onChange={handleFieldChange('phone')}
                className={styles.input}
                aria-label="Phone"
              />
            </div>
            <select
              required
              value={formValues.interest}
              onChange={handleFieldChange('interest')}
              className={styles.select}
              aria-label="What are you interested in?"
            >
              <option value="" disabled>What are you interested in?</option>
              {HARVESTFEST_CATEGORIES.map((c) => (
                <option key={c.id} value={c.label}>{c.label}</option>
              ))}
            </select>
            <textarea
              placeholder="Anything else we should know? (optional)"
              value={formValues.context}
              onChange={handleFieldChange('context')}
              className={styles.textarea}
              rows={2}
              aria-label="Additional context (optional)"
            />
            <button type="submit" className={`btn btn-solid ${styles.enterBtn}`} disabled={status === 'sending'}>
              {status === 'sending' ? 'Entering…' : HARVESTFEST_OFFER.ctaLabel}
            </button>
            {status === 'error' && (
              <p className={styles.formError}>Something went wrong — please try again, or find us at the booth.</p>
            )}
          </form>
        )}

        {status !== 'success' && <p className={styles.terms}>{HARVESTFEST_OFFER.terms}</p>}
      </section>

      {/* MICRO FOOTER */}
      <footer className={styles.hfFooter}>
        <a
          href="tel:9087770631"
          className={styles.hfFooterLink}
          onClick={() => trackHarvestFestEvent(HARVESTFEST_EVENTS.CONTACT_CLICK, { method: 'tel' })}
        >
          (908) 777-0631
        </a>
        <span className={styles.hfFooterDivider}>·</span>
        <a
          href="https://www.instagram.com/zarconephotography"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.hfFooterLink}
          onClick={() => trackHarvestFestEvent(HARVESTFEST_EVENTS.CONTACT_CLICK, { method: 'instagram' })}
        >
          @zarconephotography
        </a>
        <p className={styles.hfFooterBrand}>Zarcone Photography · zarconephotography.com</p>
      </footer>
    </>
  );
}
