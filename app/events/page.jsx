'use client';

import { useState } from 'react';
import PageHero from '@/components/PageHero';
import Lightbox from '@/components/Lightbox';
import Link from 'next/link';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Music', 'Prom', 'Celebration', 'Events'];

const PHOTOS = [
  { src: '/photos/i-q7LzKSb.jpg',                                          category: 'Music' },
  { src: '/photos/EVENT - Zarcone Photography-35.jpg',                      category: 'Music' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-73.jpg',                     category: 'Prom' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-83.jpg',                     category: 'Prom' },
  { src: '/photos/EVENT-ELLA-BAPTISM.jpg',                                  category: 'Celebration' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-00085.jpg',                  category: 'Celebration' },
  { src: '/photos/EVENT-Zarcone-Photography-0008.jpg',                      category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-047.jpg',                       category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-043.jpg',                       category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-0073.jpg',                      category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-11.jpg',                        category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-13.jpg',                        category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-201.jpg',                       category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-28.jpg',                        category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-65.jpg',                        category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-74-topaz.jpg',                  category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-79.jpg',                        category: 'Events' },
  { src: '/photos/EVENT-Zarcone-PhotographyZarcone-Photography-38-Motion.jpg', category: 'Events' },
];

export default function EventsPage() {
  const [active, setActive] = useState('All');
  const [lbIndex, setLbIndex] = useState(null);

  const filtered = active === 'All' ? PHOTOS : PHOTOS.filter(p => p.category === active);

  return (
    <>
      <PageHero
        eyebrow="03 / Events"
        title="Events"
        description="Live music, milestone celebrations, and corporate gatherings. Every event has a story — I'm there to capture the moments that make yours worth remembering."
        imageSrc="/photos/i-q7LzKSb.jpg"
      />

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

      <div className={styles.grid}>
        {filtered.map((photo, i) => (
          <div
            key={i}
            className={styles.item}
            onClick={() => setLbIndex(i)}
          >
            <img src={photo.src} alt={photo.category} loading="lazy" decoding="async" />
            <div className={styles.overlay}>
              <span className={styles.label}>{photo.category}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="cta-strip">
        <h2>Have an event coming up? Let's <em>talk coverage.</em></h2>
        <Link href="/about#contact" className="btn">Get In Touch</Link>
      </div>

      {lbIndex !== null && (
        <Lightbox
          images={filtered.map(p => p.src)}
          currentIndex={lbIndex}
          onClose={() => setLbIndex(null)}
          onPrev={() => setLbIndex((lbIndex - 1 + filtered.length) % filtered.length)}
          onNext={() => setLbIndex((lbIndex + 1) % filtered.length)}
        />
      )}
    </>
  );
}
