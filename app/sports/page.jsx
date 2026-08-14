'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import Lightbox from '@/components/Lightbox';
import Link from 'next/link';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Football', 'Wrestling', 'Lacrosse', 'Softball', 'Basketball', 'Gymnastics', 'Baseball', 'Soccer', 'Track', 'Field Hockey', 'Other'];

// Local sports photos
const PHOTOS = [
  { src: '/photos/i-s7zBdzk.jpg', width: 2400, height: 1600, category: 'Football',  size: 'wide' },
  { src: '/photos/i-HkmJPk8.jpg', width: 1600, height: 2400, category: 'Football',  size: 'half' },
  { src: '/photos/i-dkcFTnj.jpg', width: 2400, height: 1920, category: 'Wrestling', size: 'half' },
  { src: '/photos/i-wBrCNrq.jpg', width: 2400, height: 1920, category: 'Wrestling', size: 'half' },
  { src: '/photos/i-Lv2PXKm.jpg', width: 2400, height: 1600, category: 'Wrestling', size: 'wide' },
  { src: '/photos/i-mhgq9Xp.jpg', width: 2400, height: 1350, category: 'Wrestling', size: 'half' },
  { src: '/photos/i-zshvpsK.jpg', width: 2400, height: 1350, category: 'Wrestling', size: 'half' },
  { src: '/photos/i-kRHbmsg.jpg', width: 1920, height: 2400, category: 'Wrestling', size: 'half' },
  { src: '/photos/i-TSHFjz3.jpg', width: 2400, height: 1350, category: 'Lacrosse',  size: 'wide' },
  { src: '/photos/i-J8KsnKp.jpg', width: 2400, height: 1350, category: 'Lacrosse',  size: 'half' },
  { src: '/photos/i-mkM2LBS.jpg', width: 1920, height: 2400, category: 'Lacrosse',  size: 'half' },
  { src: '/photos/i-DDRrCRz.jpg', width: 1920, height: 2400, category: 'Lacrosse',  size: 'half' },
  // Additional sports photos — recategorize as needed
  { src: '/photos/Ironman_Bike_Dylan.jpg', width: 2400, height: 1600, category: 'Other', size: 'wide' },
  { src: '/photos/Ironman_Run_Dante.jpg', width: 1600, height: 2400, category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-AFC-Gold-Classic-13JUL19-51.jpg', width: 1600, height: 1142, category: 'Other', size: 'wide' },
  { src: '/photos/SPORTS-DSC_5128-1.jpg', width: 1600, height: 1059, category: 'Football', size: 'half' },
  { src: '/photos/SPORTS-FB100.jpg', width: 1600, height: 1066, category: 'Football', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0003.jpg', width: 1280, height: 1600, category: 'Basketball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0004.jpg', width: 1600, height: 1279, category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0006.jpg', width: 1066, height: 1600, category: 'Football', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0007.jpg', width: 1599, height: 1280, category: 'Wrestling', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0016.jpg', width: 1066, height: 1600, category: 'Football', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0017.jpg', width: 1279, height: 1600, category: 'Track', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0018.jpg', width: 1600, height: 1280, category: 'Other', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0024.jpg', width: 1279, height: 1600, category: 'Lacrosse', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0025-2.jpg', width: 1600, height: 1066, category: 'Football', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0025-3.jpg', width: 1600, height: 1279, category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0029.jpg', width: 1600, height: 1279, category: 'Lacrosse', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0030.jpg', width: 1600, height: 1280, category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0035.jpg', width: 1600, height: 1279, category: 'Basketball', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0048-2.jpg', width: 1600, height: 1279, category: 'Basketball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0055.jpg', width: 1279, height: 1600, category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0058-2.jpg', width: 1600, height: 1279, category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0058.jpg', width: 1280, height: 1599, category: 'Track', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0066.jpg', width: 1599, height: 1280, category: 'Wrestling', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0067.jpg', width: 1600, height: 1280, category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0068.jpg', width: 1066, height: 1600, category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0072.jpg', width: 1066, height: 1600, category: 'Football', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0073-2.jpg', width: 1066, height: 1600, category: 'Football', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0074.jpg', width: 1280, height: 1600, category: 'Basketball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0075-2.jpg', width: 1279, height: 1600, category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0075.jpg', width: 1280, height: 1600, category: 'Basketball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0085.jpg', width: 1600, height: 1279, category: 'Softball', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0086.jpg', width: 1600, height: 1280, category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0088.jpg', width: 1600, height: 1066, category: 'Football', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0103.jpg', width: 1066, height: 1600, category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0107.jpg', width: 1279, height: 1600, category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0108.jpg', width: 1280, height: 1600, category: 'Track', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0110.jpg', width: 1600, height: 1066, category: 'Other', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0125.jpg', width: 1066, height: 1600, category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0126.jpg', width: 1279, height: 1600, category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0132.jpg', width: 1600, height: 1280, category: 'Soccer', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0133.jpg', width: 1066, height: 1600, category: 'Football', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0135.jpg', width: 1600, height: 1280, category: 'Softball', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0136-2.jpg', width: 1600, height: 1066, category: 'Football', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0155.jpg', width: 1279, height: 1600, category: 'Basketball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0284.jpg', width: 1600, height: 1280, category: 'Gymnastics', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-030.jpg', width: 1279, height: 1600, category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0300.jpg', width: 1279, height: 1600, category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-032.jpg', width: 1279, height: 1600, category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0363.jpg', width: 1066, height: 1600, category: 'Gymnastics', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-0431.jpg', width: 1600, height: 1280, category: 'Wrestling', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-061.jpg', width: 1280, height: 1600, category: 'Wrestling', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-062.jpg', width: 1600, height: 1280, category: 'Lacrosse', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-093.jpg', width: 1600, height: 1280, category: 'Baseball', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-100.jpg', width: 1600, height: 1280, category: 'Gymnastics', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-123.jpg', width: 1600, height: 1279, category: 'Gymnastics', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-209.jpg', width: 1600, height: 1280, category: 'Basketball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-270.jpg', width: 1600, height: 1280, category: 'Wrestling', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-41.jpg', width: 1066, height: 1600, category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography-45.jpg', width: 1600, height: 1066, category: 'Football', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-50.jpg', width: 1280, height: 1600, category: 'Other', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography0056.jpg', width: 1600, height: 1066, category: 'Softball', size: 'half' },
  { src: '/photos/SPORTS-Zarcone-Photography0057.jpg', width: 1600, height: 1066, category: 'Softball', size: 'half' },
  // New intake, 2026-08-03 — verified action shots, cleared (no client-consent question, BRHS team photography)
  { src: '/photos/ZP Web - 1.jpg', width: 1988, height: 2982, category: 'Field Hockey', size: 'half' },
  { src: '/photos/ZP Web - 2.jpg', width: 3087, height: 3859, category: 'Track', size: 'half' },
  { src: '/photos/ZP Web - 4.jpg', width: 2305, height: 2881, category: 'Track', size: 'half' },
  { src: '/photos/ZP Web - 9.jpg', width: 3879, height: 3104, category: 'Softball', size: 'wide' },
  { src: '/photos/ZP Web - 38.jpg', width: 4899, height: 3919, category: 'Wrestling', size: 'wide' },
  { src: '/photos/ZP Web - 90.jpg', width: 3706, height: 2471, category: 'Gymnastics', size: 'wide' },
  { src: '/photos/ZP Web - 101.jpg', width: 2938, height: 2350, category: 'Lacrosse', size: 'wide' },
  { src: '/photos/ZP Web - 99.jpg', width: 3062, height: 2450, category: 'Lacrosse', size: 'wide' },
  { src: '/photos/ZP Web - 104.jpg', width: 3237, height: 2590, category: 'Wrestling', size: 'wide' },
  { src: '/photos/ZP Web - 110.jpg', width: 2817, height: 3521, category: 'Softball', size: 'half' },
  { src: '/photos/ZP Web - 100.jpg', width: 2525, height: 2020, category: 'Lacrosse', size: 'wide' },
  { src: '/photos/ZP Web - 102.jpg', width: 3140, height: 2512, category: 'Wrestling', size: 'wide' },
  { src: '/photos/ZP Web - 109.jpg', width: 1978, height: 2472, category: 'Softball', size: 'half' },
  { src: '/photos/ZP Web - 122.jpg', width: 1318, height: 1648, category: 'Baseball', size: 'half' },
  { src: '/photos/ZP Web - 123.jpg', width: 2742, height: 2194, category: 'Baseball', size: 'wide' },
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

  // Server render and the client's first render must produce identical output,
  // or React throws a hydration mismatch. Math.random() inside useMemo() broke
  // that — the server-rendered HTML had one shuffle order, the client's first
  // pass computed a different one. Fix: render PHOTOS in its stable, unshuffled
  // order on first paint (matches SSR exactly), then shuffle client-only after
  // mount via useEffect, which never runs during server rendering.
  const [shuffled, setShuffled] = useState(PHOTOS);
  useEffect(() => {
    setShuffled(shuffle(PHOTOS));
  }, []);
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

      <div className={styles.pullQuote}>
        <blockquote className={styles.pullQuoteText}>
          "The quality of his photography and graphic design work has taken BRHS Wrestling's social media presence to another level — his graphics consistently look sharp, professional, and engaging."
        </blockquote>
        <cite className={styles.pullQuoteCite}>— Kyle Murphy, Head Wrestling Coach, BRHS</cite>
      </div>

      <p className={styles.painLine} style={{ paddingTop: 0 }}>
        Currently covering the 2026 season as official media partner of{' '}
        <Link href="/brhs-panther-football" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
          BRHS Panther Football →
        </Link>
        {' '}and the 2026-27 season as official photography &amp; social media partner of{' '}
        <Link href="/brhs-panther-wrestling" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
          BRHS Panther Wrestling →
        </Link>
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

      <div className={styles.testimonials}>
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
