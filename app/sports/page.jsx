'use client';

import { useState, useMemo } from 'react';
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
  { src: '/photos/Ironman_Bike_Dylan.jpg', category: 'Other', size: 'wide' },
  { src: '/photos/Ironman_Run_Dante.jpg', category: 'Other', size: 'half' },
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

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SportsPage() {
  const [active, setActive] = useState('All');
  const [lbIndex, setLbIndex] = useState(null);

  const shuffled = useMemo(() => shuffle(PHOTOS), []);
  const filtered = active === 'All' ? shuffled : shuffled.filter(p => p.category === active);

  return (
    <>
      <PageHero
        eyebrow="01 / Sports"
        title="Sports"
        description="Four years of early mornings, weight rooms, and Friday nights — and it ends in a single season. Your athlete gave everything. The photos should prove it."
        imageSrc="/photos/i-s7zBdzk.jpg"
      />

      <p className={styles.painLine}>
        Most high school athletes finish their careers with a handful of sideline phone photos. They gave more than that. So did you.
      </p>

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
            <img src={photo.src} alt={`${photo.category} photography — Zarcone Photography, New Jersey`} loading="lazy" decoding="async" />
            <div className={styles.overlay}>
              <span className={styles.label}>{photo.category}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.testimonials}>
        <div className={styles.testimonialCard}>
          <blockquote className={styles.testimonialText}>"The quality of his photography and graphic design work has taken BRHS Wrestling's social media presence to another level. Every photo captures the intensity and emotion of the sport, and his graphics consistently look sharp, professional, and engaging."</blockquote>
          <cite className={styles.testimonialCite}>— Kyle Murphy, Head Wrestling Coach, BRHS</cite>
        </div>
        <div className={styles.testimonialCard}>
          <blockquote className={styles.testimonialText}>"Working with Zarcone Photography this season was a great experience. Tom is an excellent sports photographer who captured incredible photos that showcased the energy, emotion, and personality of our athletes. He also went beyond photography by helping create individual graphics, senior posters, postseason group graphics, and photo gifts. Looking forward to working with him again next season!"</blockquote>
          <cite className={styles.testimonialCite}>— Erika</cite>
        </div>
        <div className={styles.testimonialCard}>
          <blockquote className={styles.testimonialText}>"Tom was an absolute pleasure to work with. He was patient, clear and detailed. My team had a wonderful experience taking photos for their senior night. We had a large group and it was no challenge for him to manage. I highly recommend Tom and his team for any projects that you may have."</blockquote>
          <cite className={styles.testimonialCite}>— Coach Adam</cite>
        </div>
      </div>

      <div className="cta-strip">
        <h2>The season ends. <em>These don't.</em></h2>
        <p>Let's make sure it was documented right.</p>
        <Link href="/about#contact" className="btn">Get In Touch</Link>
        <p style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(236,232,225,0.4)', marginTop: '16px' }}>Response within 24 hours &nbsp;·&nbsp; No booking commitment required</p>
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
