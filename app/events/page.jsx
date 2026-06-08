'use client';

import { useState, useEffect } from 'react';
import PageHero from '@/components/PageHero';
import Link from 'next/link';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Music', 'Prom', 'Celebration'];

const BARN_SWALLOWS = 'https://photos.smugmug.com/Beneath-the-Barn-Swallows-2/i-q7LzKSb/0/NdJQsVfjpscZGKBPc72XtsSxxWkhmb3K6NW5GhW8P/XL/Zarcone%20Photography-2-Final-sharpen-XL.jpg';
const SM = (id, hash) => `https://photos.smugmug.com/photos/${id}/0/${hash}/XL/${id}-XL.jpg`;

const EVENTS = [
  {
    category: 'Music',
    title: 'Beneath the Barn Swallows',
    desc: 'Live outdoor performance photography that captures both the intimacy of the musicians and the spirit of the crowd. Every note has a visual.',
    images: [BARN_SWALLOWS],
    layout: 'single',
  },
  {
    category: 'Prom',
    title: 'BRHS Prom 2026',
    desc: 'Before the limo, at the venue, in the moment. Prom coverage that captures the energy, the outfits, and the faces that make these nights unforgettable.',
    images: [
      SM('i-zNvJJ9F','KDcpqZk9zCWkSfX4dv8g6kPgGMPLmbcbfc4qQq3HF'),
      SM('i-H5zGXVk','M2c5Q68t4zRd7z7hkWGBkWpHK4nkHnRbB6Xf4HXNs'),
    ],
    layout: 'double',
    reverse: true,
  },
  {
    category: 'Celebration',
    title: 'Milestone Events',
    desc: 'Award ceremonies, signings, retirements, and personal milestones. These moments deserve to be documented with care and intention.',
    images: [
      SM('i-TpwgjhG','LpNB5RXQrGJjVsfzdSKGnXWr6DpVmmBVfjmDLLkLK'),
    ],
    layout: 'single',
  },
];

export default function EventsPage() {
  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? EVENTS : EVENTS.filter(e => e.category === active);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [filtered]);

  return (
    <>
      <PageHero
        eyebrow="03 / Events"
        title="Events"
        description="Live music, milestone celebrations, and corporate gatherings. Every event has a story — I'm there to capture the moments that make yours worth remembering."
        imageSrc={BARN_SWALLOWS}
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
        {filtered.map((event, i) => (
          <div key={i} className={`${styles.row} ${event.reverse ? styles.reverse : ''} reveal`}>
            <div className={`${styles.imgSide} ${event.layout === 'double' ? styles.double : ''}`}>
              {event.images.map((src, j) => (
                <div key={j} className={styles.imgWrap}>
                  <div className={styles.img} style={{ backgroundImage: `url('${src}')` }} />
                </div>
              ))}
            </div>
            <div className={styles.info}>
              <p className={`eyebrow ${styles.cat}`}>{event.category}</p>
              <h2 className={styles.title}>{event.title}</h2>
              <p className={styles.desc}>{event.desc}</p>
              <Link href="/about#contact" className={styles.evLink}>Book Coverage →</Link>
            </div>
          </div>
        ))}
      </div>

      <div className="cta-strip">
        <h2>Have an event coming up? Let's <em>talk coverage.</em></h2>
        <Link href="/about#contact" className="btn">Get In Touch</Link>
      </div>
    </>
  );
}
