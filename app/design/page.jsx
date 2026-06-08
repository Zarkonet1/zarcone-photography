'use client';

import { useState } from 'react';
import PageHero from '@/components/PageHero';
import Lightbox from '@/components/Lightbox';
import Link from 'next/link';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Senior Posters', 'Wrestling', 'Lacrosse', 'Track'];

// Local design / poster photos
const PIECES = [
  // Track Senior Posters
  { src: '/photos/i-hdjLNfF.jpg', category: 'Track',     title: 'Track — Senior Poster',        size: 'wide' },
  { src: '/photos/i-CjRtd4L.jpg', category: 'Track',     title: 'Track — Senior Composite',     size: 'half' },
  { src: '/photos/i-GRNTs87.jpg', category: 'Track',     title: 'Track — Senior Design',        size: 'half' },
  { src: '/photos/i-JdzdDzw.jpg', category: 'Track',     title: 'Track — Senior Poster',        size: 'half' },
  { src: '/photos/i-2bzMvNC.jpg', category: 'Track',     title: 'Track — Senior Composite',     size: 'half' },
  // Wrestling Senior Posters
  { src: '/photos/i-L2f9FWq.jpg', category: 'Wrestling', title: 'Wrestling — Senior Design',    size: 'wide' },
  { src: '/photos/i-JgVQLHd.jpg', category: 'Wrestling', title: 'Wrestling — Senior Composite', size: 'half' },
  { src: '/photos/i-h4PXdgk.jpg', category: 'Wrestling', title: 'Wrestling — Senior Poster',    size: 'half' },
  { src: '/photos/i-rgvSB9k.jpg', category: 'Wrestling', title: 'Wrestling — Senior Design',    size: 'half' },
  // Girls Lacrosse Senior Posters
  { src: '/photos/i-4VRDpGg.jpg', category: 'Lacrosse',  title: 'Lacrosse — Senior Poster',     size: 'wide' },
  { src: '/photos/i-2CHdSJx.jpg', category: 'Lacrosse',  title: 'Lacrosse — Senior Design',     size: 'half' },
  { src: '/photos/i-Cf5RqJt.jpg', category: 'Lacrosse',  title: 'Lacrosse — Senior Composite',  size: 'half' },
];

export default function DesignPage() {
  const [active, setActive] = useState('All');
  const [lbIndex, setLbIndex] = useState(null);

  const filtered = active === 'All' ? PIECES : PIECES.filter(p => p.category === active);

  return (
    <>
      <PageHero
        eyebrow="04 / Design"
        title="Design"
        description="Senior poster composites, sports graphics, and branded imagery — where photography meets design. Built for athletes who want something worth hanging on a wall."
        imageSrc="/photos/i-hdjLNfF.jpg"
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
        {filtered.map((piece, i) => (
          <div
            key={i}
            className={`${styles.item} ${styles[piece.size] || ''}`}
            onClick={() => setLbIndex(i)}
          >
            <div
              className={styles.img}
              style={{ backgroundImage: `url('${piece.src}')` }}
            />
            <div className={styles.overlay}>
              <div className={styles.overlayContent}>
                <span className={styles.label}>{piece.category}</span>
                <span className={styles.title}>{piece.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cta-strip">
        <h2>Want a poster for your <em>athlete?</em></h2>
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
