'use client';

import { useState, useEffect, useMemo } from 'react';
import PageHero from '@/components/PageHero';
import Lightbox from '@/components/Lightbox';
import Link from 'next/link';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Individual', 'Family', 'Senior', 'Headshot'];

// All real SmugMug portraits
const SM_BASE = 'https://photos.smugmug.com/photos';
const xl = (id, hash, ext = 'jpg') => `${SM_BASE}/${id}/0/${hash}/XL/${id}-XL.${ext}`;

const PHOTOS = [
  // Seniors
  { src: '/photos/i-rvRX82g.jpg', category: 'Senior' },

  { src: '/photos/GiadaField.jpg', category: 'Senior' },
  // Individuals / headshots
  { src: '/photos/i-LdgcRk9.jpg', category: 'Individual' },
  { src: '/photos/i-rkggQ5F.jpg', category: 'Headshot' },
  { src: '/photos/MonicaAsh.jpg', category: 'Individual' },
  // Families
  { src: '/photos/i-pnGfzmw.jpg', category: 'Family' },
  { src: '/photos/i-3JzdPqR.jpg', category: 'Family' },
  { src: '/photos/Reedxmas1.jpg', category: 'Family' },
  { src: '/photos/Reedxmas2.jpg', category: 'Family' },
  // Additional portraits
  { src: '/photos/PORTRAIT-Pics-11.jpg',                                          category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photograph-013.jpg',                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-DeBoer0006.jpg',                   category: 'Family' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0002.jpg',                         category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0007-2.jpg',                       category: 'Senior' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-00072.jpg',                        category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-00085.jpg',                        category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0013.jpg',                         category: 'Senior' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0014-2.jpg',                       category: 'Senior' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0020.jpg',                         category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-003.jpg',                          category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0035-2.jpg',                       category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0076.jpg',                         category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-012.jpg',                          category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0127.jpg',                         category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0137.jpg',                         category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-015.jpg',                          category: 'Senior' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-019.jpg',                          category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-020.jpg',                          category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-045.jpg',                          category: 'Senior' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-093-2.jpg',                        category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-36.jpg',                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-65.jpg',                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-1-2.jpg',                          category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-1-8_pp.jpg',                       category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-1-SharpenAI-softness.jpg',         category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-21.jpg',                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-3.jpg',                            category: 'Senior' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-39.jpg',                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-42.jpg',                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-48.jpg',                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-67.jpg',                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-7.jpg',                            category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-73.jpg',                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-83-2.jpg',                         category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-83.jpg',                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-87.jpg',                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-92-SharpenAI-softness.jpg',        category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography54.jpg',                            category: 'Headshot' },
  { src: '/photos/PORTRAIT-Zarcone-PhotographyZarcone-Photography-21-smb-1.jpg',  category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-PhotographyZarcone-Photography-61-Standard.jpg', category: 'Headshot' },
  { src: '/photos/PORTRAIT-Zarcone-PhotographyZarcone-Photography-63-Motion.jpg', category: 'Individual' },
  { src: '/photos/chloe-portrait.jpg',    category: 'Individual' },
  { src: '/photos/danielle-portrait.jpg', category: 'Individual' },
  { src: '/photos/courtney-portrait.jpg', category: 'Individual' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PortraitsPage() {
  const [active, setActive] = useState('All');
  const [lbIndex, setLbIndex] = useState(null);

  const shuffled = useMemo(() => shuffle(PHOTOS), []);
  const filtered = active === 'All' ? shuffled : shuffled.filter(p => p.category === active);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <PageHero
        eyebrow="02 / Portraits"
        title="Portraits"
        description="Senior year. Your daughter at 17, exactly as she is right now. You won't get this version of her back — but you can have a photograph that does it justice."
        imageSrc="/photos/PORTRAIT-Zarcone-Photography-0002.jpg"
      />

      <p className={styles.painLine}>
        Most portrait sessions feel rushed, generic, and forgettable. These don't. Every session is unhurried and built around the person in front of the camera — not a pose checklist.
      </p>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${active === cat ? styles.filterActive : ''}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Gallery */}
      <div className={styles.gallery}>
        {filtered.map((photo, i) => (
          <div key={i} className={`${styles.item} reveal`} onClick={() => setLbIndex(i)}>
            <img src={photo.src} alt={`${photo.category} portrait photography — Zarcone Photography, New Jersey`} className={styles.img} loading="lazy" decoding="async" />
            <div className={styles.itemOverlay}>
              <span className={styles.itemLabel}>{photo.category}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="cta-strip">
        <h2>Ready to have something <em>worth keeping?</em></h2>
        <p>Let's make it happen.</p>
        <Link href="/about#contact" className="btn">Get In Touch</Link>
      </div>

      {/* Lightbox */}
      {lbIndex !== null && (
        <Lightbox
          images={filtered.map(p => ({ src: p.src, alt: `${p.category} portrait photography — Zarcone Photography, New Jersey` }))}
          currentIndex={lbIndex}
          onClose={() => setLbIndex(null)}
          onPrev={() => setLbIndex((lbIndex - 1 + filtered.length) % filtered.length)}
          onNext={() => setLbIndex((lbIndex + 1) % filtered.length)}
        />
      )}
    </>
  );
}
