'use client';

import { useState } from 'react';
import PageHero from '@/components/PageHero';
import Lightbox from '@/components/Lightbox';
import Link from 'next/link';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Football', 'Wrestling', 'Lacrosse'];

// Local sports photos
const PHOTOS = [
  { src: '/photos/i-s7zBdzk.jpg', category: 'Football',  size: 'wide' },
  { src: '/photos/i-HkmJPk8.jpg', category: 'Football',  size: 'half' },
  { src: '/photos/i-dkcFTnj.jpg', category: 'Wrestling', size: 'half' },
  { src: '/photos/i-wBrCNrq.jpg', category: 'Wrestling', size: 'half' },
  { src: '/photos/i-Lv2PXKm.jpg', category: 'Wrestling', size: 'wide' },
  { src: '/photos/i-mhgq9Xp.jpg', category: 'Wrestling', size: 'half' },
  { src: '/photos/i-zshvpsK.jpg', category: 'Wrestling', size: 'half' },
  { src: '/photos/i-kRHbmsg.jpg', category: 'Wrestling', size: 'half' },
  { src: '/photos/i-TSHFjz3.jpg', category: 'Lacrosse',  size: 'wide' },
  { src: '/photos/i-J8KsnKp.jpg', category: 'Lacrosse',  size: 'half' },
  { src: '/photos/i-mkM2LBS.jpg', category: 'Lacrosse',  size: 'half' },
  { src: '/photos/i-DDRrCRz.jpg', category: 'Lacrosse',  size: 'half' },
];

export default function SportsPage() {
  const [active, setActive] = useState('All');
  const [lbIndex, setLbIndex] = useState(null);

  const filtered = active === 'All' ? PHOTOS : PHOTOS.filter(p => p.category === active);

  return (
    <>
      <PageHero
        eyebrow="01 / Sports"
        title="Sports"
        description="Football. Wrestling. Tournament stages and Friday night lights. High school athletes deserve photos that match the effort they put in — captured with the speed and precision each moment demands."
        imageSrc="/photos/i-s7zBdzk.jpg"
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
            className={`${styles.item} ${styles[photo.size] || ''}`}
            onClick={() => setLbIndex(i)}
          >
            <div
              className={styles.img}
              style={{ backgroundImage: `url('${photo.src}')` }}
            />
            <div className={styles.overlay}>
              <span className={styles.label}>{photo.category}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="cta-strip">
        <h2>Ready to document <em>your season?</em></h2>
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
