'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import Lightbox from '@/components/Lightbox';
import Link from 'next/link';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Triathlon', 'Music', 'Prom', 'Wedding', 'Celebration', 'Events'];

const PHOTOS = [
  { src: '/photos/Ironman_Bike_Dylan.jpg', width: 2400, height: 1600,                                  category: 'Triathlon' },
  { src: '/photos/Ironman_Run_Dante.jpg', width: 1600, height: 2400,                                   category: 'Triathlon' },
  { src: '/photos/i-q7LzKSb.jpg', width: 2400, height: 1599,                                          category: 'Music' },
  { src: '/photos/EVENT - Zarcone Photography-35.jpg', width: 2048, height: 1638,                      category: 'Music' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-73.jpg', width: 1600, height: 1280,                     category: 'Prom' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-83.jpg', width: 1600, height: 1280,                     category: 'Prom' },
  { src: '/photos/EVENT-ELLA-BAPTISM.jpg', width: 1600, height: 1280,                                  category: 'Celebration' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-00085.jpg', width: 1600, height: 1267,                  category: 'Celebration' },
  { src: '/photos/EVENT-Zarcone-Photography-0008.jpg', width: 1600, height: 1066,                      category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-047.jpg', width: 1600, height: 1065,                       category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-043.jpg', width: 1600, height: 1066,                       category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-0073.jpg', width: 1600, height: 1279,                      category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-11.jpg', width: 1600, height: 1066,                        category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-13.jpg', width: 1600, height: 1280,                        category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-201.jpg', width: 1600, height: 1279,                       category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-28.jpg', width: 1280, height: 1600,                        category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-65.jpg', width: 1600, height: 1280,                        category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-74-topaz.jpg', width: 1600, height: 1279,                  category: 'Events' },
  { src: '/photos/EVENT-Zarcone-Photography-79.jpg', width: 1600, height: 1280,                        category: 'Events' },
  { src: '/photos/EVENT-Zarcone-PhotographyZarcone-Photography-38-Motion.jpg', width: 1600, height: 1279, category: 'Events' },
  // New intake, 2026-08-03 — cleared for gallery use, excluded from hero/card per Tom
  { src: '/photos/ZP Web - 112.jpg', width: 8256, height: 5504, category: 'Wedding' },
  { src: '/photos/ZP Web - 142.jpg', width: 5209, height: 3473, category: 'Wedding' },
  { src: '/photos/ZP Web - 12.jpg', width: 4398, height: 3518, category: 'Celebration' },
  { src: '/photos/ZP Web - 78.jpg', width: 3935, height: 4919, category: 'Celebration' },
  { src: '/photos/ZP Web - 60.jpg', width: 2210, height: 2763, category: 'Celebration' },
  { src: '/photos/ZP Web - 96.jpg', width: 10522, height: 8418, category: 'Celebration' },
  { src: '/photos/ZP Web - 136.jpg', width: 4584, height: 3667, category: 'Celebration' },
  { src: '/photos/ZP Web - 15.jpg', width: 4799, height: 3839, category: 'Celebration' },
  { src: '/photos/ZP Web - 16.jpg', width: 5391, height: 4313, category: 'Celebration' },
  { src: '/photos/ZP Web - 21.jpg', width: 4875, height: 3900, category: 'Celebration' },
  { src: '/photos/ZP Web - 24.jpg', width: 2909, height: 3636, category: 'Celebration' },
  { src: '/photos/ZP Web - 41.jpg', width: 4423, height: 3538, category: 'Celebration' },
  { src: '/photos/ZP Web - 48.jpg', width: 3763, height: 3010, category: 'Celebration' },
  { src: '/photos/ZP Web - 13.jpg', width: 3105, height: 3881, category: 'Celebration' },
  { src: '/photos/ZP Web - 117.jpg', width: 3348, height: 2678, category: 'Wedding' },
  { src: '/photos/ZP Web - 98.jpg', width: 4771, height: 3817, category: 'Prom' },
  { src: '/photos/ZP Web - 127.jpg', width: 2546, height: 3184, category: 'Prom' },
  { src: '/photos/ZP Web - 135.jpg', width: 4342, height: 3474, category: 'Prom' },
  { src: '/photos/ZP Web - 107.jpg', width: 3710, height: 4638, category: 'Celebration' },
  { src: '/photos/ZP Web - 131.jpg', width: 2265, height: 2831, category: 'Celebration' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function EventsPage() {
  const [active, setActive] = useState('All');
  const [lbIndex, setLbIndex] = useState(null);

  const shuffled = useMemo(() => shuffle(PHOTOS), []);
  const filtered = active === 'All' ? shuffled : shuffled.filter(p => p.category === active);

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
            <Image
              src={photo.src}
              alt={`${photo.category} photography — Zarcone Photography, New Jersey`}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
              style={{ width: '100%', height: 'auto' }}
            />
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
          images={filtered.map(p => ({ src: p.src, alt: `${p.category} photography — Zarcone Photography, New Jersey` }))}
          currentIndex={lbIndex}
          onClose={() => setLbIndex(null)}
          onPrev={() => setLbIndex((lbIndex - 1 + filtered.length) % filtered.length)}
          onNext={() => setLbIndex((lbIndex + 1) % filtered.length)}
        />
      )}
    </>
  );
}
