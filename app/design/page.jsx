'use client';

import { useState } from 'react';
import PageHero from '@/components/PageHero';
import Lightbox from '@/components/Lightbox';
import Link from 'next/link';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Senior Posters', 'Wrestling', 'Lacrosse', 'Track'];

const SM = (id, hash, ver = '0', ext = 'jpg') =>
  `https://photos.smugmug.com/photos/${id}/${ver}/${hash}/XL/${id}-XL.${ext}`;

// Real SmugMug composite / poster designs
const PIECES = [
  // Track Senior Posters
  { src: SM('i-hdjLNfF','KrP5DD9cF983RPDmp33B3xngwdk27GZXLC2gpLbvH'), category: 'Track',         title: 'Track — Senior Poster',       size: 'wide' },
  { src: SM('i-CjRtd4L','NZcjN6V6F22RhrCjbgDH7hjXQHvkTL3fJ8Q7qwqvk'), category: 'Track',         title: 'Track — Senior Composite',    size: 'half' },
  { src: SM('i-GRNTs87','LNTvwx4CvQdBbKTdz84L2qQDshfLW7LvvnvkvRSkw'), category: 'Track',         title: 'Track — Senior Design',       size: 'half' },
  { src: SM('i-JdzdDzw','M4HQ65Dr75qvQtpZkXdcS9RgsqDM7HVcLvn66SpwG'), category: 'Track',         title: 'Track — Senior Poster',       size: 'half' },
  { src: SM('i-2bzMvNC','MtWkxFPNvjt738zBFtwpr2wVX2HVZWkk47G5Qt3zP'), category: 'Track',         title: 'Track — Senior Composite',    size: 'half' },
  // Wrestling Senior Posters
  { src: SM('i-mV3z6gK','LvFmmrHMg9VmZ3pbLrXWCNcLjjTFSm3K28j2PwcSX'), category: 'Wrestling',     title: 'Wrestling — Senior Poster',   size: 'wide' },
  { src: SM('i-L2f9FWq','LtKpXNdmpwqSf9q2fDvMmkvbPx5BspRXTN6TLh5v2'), category: 'Wrestling',     title: 'Wrestling — Senior Design',   size: 'half' },
  { src: SM('i-JgVQLHd','NGLSDnJT9bHP5SLmw7GJsC4DKPDVBcP7KF3vC8GPr'), category: 'Wrestling',     title: 'Wrestling — Senior Composite', size: 'half' },
  { src: SM('i-h4PXdgk','LjdWPCVT6k7W8xMWCvTJhwKB94NwJT2bPLKTt9TCK'), category: 'Wrestling',     title: 'Wrestling — Senior Poster',   size: 'half' },
  { src: SM('i-rgvSB9k','LhkGRtmpm4LhxSkcq4ncPqLbJDZ9zjmX7pw5M2WXp'), category: 'Wrestling',     title: 'Wrestling — Senior Design',   size: 'half' },
  // Girls Lacrosse Senior Posters
  { src: SM('i-4VRDpGg','LmWWfpk578SCkwSf6kTZ7cMW7xH3CxXKZGbRMs4Pv','1'), category: 'Lacrosse', title: 'Lacrosse — Senior Poster',    size: 'wide' },
  { src: SM('i-2CHdSJx','KnwcgkxJwHCmvxGGGTgpgQ4LghG4h6B3XMwbSRwPB'), category: 'Lacrosse',     title: 'Lacrosse — Senior Design',    size: 'half' },
  { src: SM('i-Cf5RqJt','LZs4VQG5D7rg22qF7GQw5vkxbkHgDp7KWkQ4qfKRN'), category: 'Lacrosse',     title: 'Lacrosse — Senior Composite', size: 'half' },
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
        imageSrc="https://photos.smugmug.com/photos/i-mV3z6gK/0/LvFmmrHMg9VmZ3pbLrXWCNcLjjTFSm3K28j2PwcSX/XL/i-mV3z6gK-XL.jpg"
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
