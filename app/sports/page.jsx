'use client';

import { useState } from 'react';
import PageHero from '@/components/PageHero';
import Lightbox from '@/components/Lightbox';
import Link from 'next/link';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Football', 'Wrestling', 'Lacrosse', 'Softball', 'Basketball', 'Gymnastics', 'Baseball', 'Soccer', 'Track', 'Other'];

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
  // Additional sports photos — recategorize as needed
  { src: '/photos/SPORTS-AFC-Gold-Classic-13JUL19-51.jpg', category: 'Other', size: 'wide' },
  { src: '/photos/SPORTS-DSC_5128-1.jpg', category: 'Football', size: 'half' },
  { src: '/photos/SPORTS-FB100.jpg', category: 'Football', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0003.jpg', category: 'Basketball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0004.jpg', category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0006.jpg', category: 'Football', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0007.jpg', category: 'Wrestling', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0016.jpg', category: 'Football', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0017.jpg', category: 'Track', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0018.jpg', category: 'Other', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0024.jpg', category: 'Lacrosse', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0025-2.jpg', category: 'Football', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0025-3.jpg', category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0029.jpg', category: 'Lacrosse', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0030.jpg', category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0035.jpg', category: 'Basketball', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0048-2.jpg', category: 'Basketball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0055.jpg', category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0058-2.jpg', category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0058.jpg', category: 'Track', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0066.jpg', category: 'Wrestling', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0067.jpg', category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0068.jpg', category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0072.jpg', category: 'Football', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0073-2.jpg', category: 'Football', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0074.jpg', category: 'Basketball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0075-2.jpg', category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0075.jpg', category: 'Basketball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0085.jpg', category: 'Softball', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0086.jpg', category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0088.jpg', category: 'Football', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0103.jpg', category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0107.jpg', category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0108.jpg', category: 'Track', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0110.jpg', category: 'Other', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0125.jpg', category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0126.jpg', category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0132.jpg', category: 'Soccer', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0133.jpg', category: 'Football', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0135.jpg', category: 'Softball', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0136-2.jpg', category: 'Football', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0155.jpg', category: 'Basketball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0284.jpg', category: 'Gymnastics', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-030.jpg', category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0300.jpg', category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-032.jpg', category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0363.jpg', category: 'Gymnastics', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0431.jpg', category: 'Wrestling', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-061.jpg', category: 'Wrestling', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-062.jpg', category: 'Lacrosse', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-093.jpg', category: 'Baseball', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-100.jpg', category: 'Gymnastics', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-123.jpg', category: 'Gymnastics', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-209.jpg', category: 'Basketball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-270.jpg', category: 'Wrestling', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-41.jpg', category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-45.jpg', category: 'Football', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-50.jpg', category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography0056.jpg', category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography0057.jpg', category: 'Softball', size: 'half' },
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
