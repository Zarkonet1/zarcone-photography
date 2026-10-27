'use client';

import { useState } from 'react';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import Lightbox from '@/components/Lightbox';
import Link from 'next/link';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Football', 'Wrestling', 'Volleyball', 'Softball', 'Lacrosse', 'Basketball', 'Gymnastics', 'Baseball', 'Track', 'More Sports'];

// Curated sports portfolio (2026-10-27): 36 picks in a fixed order, best first.
// PHOTOS is in reading order; toColumns() deals it into 3 height-balanced
// columns so the grid reads left-to-right, best first (phones stack the
// columns). The lightbox keeps reading order. To add or swap
// a photo, keep `sport` (alt text) and `category` (filter button) in sync with
// CATEGORIES; sports with one photo use category 'More Sports'.
const PHOTOS = [
  { src: '/photos/SPORTS-card-catch-5.jpg', width: 1800, height: 1503, sport: 'Football', category: 'Football' },
  { src: '/photos/ZP Web - 99.jpg', width: 3062, height: 2450, sport: 'Lacrosse', category: 'Lacrosse' },
  { src: '/photos/SPORTS-Zarcone-Photography-0073-2.jpg', width: 1066, height: 1600, sport: 'Football', category: 'Football' },
  { src: '/photos/SPORTS-Zarcone-Photography-0125.jpg', width: 1066, height: 1600, sport: 'Volleyball', category: 'Volleyball' },
  { src: '/photos/ZP Web - 102.jpg', width: 3140, height: 2512, sport: 'Wrestling', category: 'Wrestling' },
  { src: '/photos/SPORTS-Zarcone-Photography-123.jpg', width: 1600, height: 1279, sport: 'Gymnastics', category: 'Gymnastics' },
  { src: '/photos/i-HkmJPk8.jpg', width: 1600, height: 2400, sport: 'Football', category: 'Football' },
  { src: '/photos/SPORTS-Zarcone-Photography-270.jpg', width: 1600, height: 1280, sport: 'Wrestling', category: 'Wrestling' },
  { src: '/photos/ZP Web - 110.jpg', width: 2817, height: 3521, sport: 'Softball', category: 'Softball' },
  { src: '/photos/SPORTS-Zarcone-Photography-0048-2.jpg', width: 1600, height: 1279, sport: 'Basketball', category: 'Basketball' },
  { src: '/photos/ZP Web - 9.jpg', width: 3879, height: 3104, sport: 'Softball', category: 'Softball' },
  { src: '/photos/SPORTS-Zarcone-Photography-0136-2.jpg', width: 1600, height: 1066, sport: 'Football', category: 'Football' },
  { src: '/photos/SPORTS-Zarcone-Photography-0007.jpg', width: 1599, height: 1280, sport: 'Wrestling', category: 'Wrestling' },
  { src: '/photos/SPORTS-Zarcone-Photography-0055.jpg', width: 1279, height: 1600, sport: 'Volleyball', category: 'Volleyball' },
  { src: '/photos/ZP Web - 123.jpg', width: 2742, height: 2194, sport: 'Baseball', category: 'Baseball' },
  { src: '/photos/SPORTS-Zarcone-Photography-0133.jpg', width: 1066, height: 1600, sport: 'Football', category: 'Football' },
  { src: '/photos/ZP Web - 90.jpg', width: 3706, height: 2471, sport: 'Gymnastics', category: 'Gymnastics' },
  { src: '/photos/ZP Web - 2.jpg', width: 3087, height: 3859, sport: 'Track', category: 'Track' },
  { src: '/photos/ZP Web - 104.jpg', width: 3237, height: 2590, sport: 'Wrestling', category: 'Wrestling' },
  { src: '/photos/SPORTS-Zarcone-Photography-45.jpg', width: 1600, height: 1066, sport: 'Football', category: 'Football' },
  { src: '/photos/SPORTS-Zarcone-Photography-0024.jpg', width: 1279, height: 1600, sport: 'Lacrosse', category: 'Lacrosse' },
  { src: '/photos/SPORTS-softball-home-plate-dust.jpg', width: 2576, height: 2061, sport: 'Softball', category: 'Softball' },
  { src: '/photos/SPORTS-Zarcone-Photography-0074.jpg', width: 1280, height: 1600, sport: 'Basketball', category: 'Basketball' },
  { src: '/photos/SPORTS-Zarcone-Photography-0363.jpg', width: 1066, height: 1600, sport: 'Gymnastics', category: 'Gymnastics' },
  { src: '/photos/ZP Web - 38.jpg', width: 4899, height: 3919, sport: 'Wrestling', category: 'Wrestling' },
  { src: '/photos/SPORTS-Zarcone-Photography-0016.jpg', width: 1066, height: 1600, sport: 'Football', category: 'Football' },
  { src: '/photos/SPORTS-softball-slide-second.jpg', width: 2576, height: 2061, sport: 'Softball', category: 'Softball' },
  { src: '/photos/SPORTS-Zarcone-Photography-093.jpg', width: 1600, height: 1280, sport: 'Baseball', category: 'Baseball' },
  { src: '/photos/ZP Web - 4.jpg', width: 2305, height: 2881, sport: 'Track', category: 'Track' },
  { src: '/photos/SPORTS-Zarcone-Photography-0018.jpg', width: 1600, height: 1280, sport: 'Ice Hockey', category: 'More Sports' },
  { src: '/photos/i-Lv2PXKm.jpg', width: 2400, height: 1600, sport: 'Wrestling', category: 'Wrestling' },
  { src: '/photos/SPORTS-Zarcone-Photography-0029.jpg', width: 1600, height: 1279, sport: 'Lacrosse', category: 'Lacrosse' },
  { src: '/photos/SPORTS-Zarcone-Photography-0003.jpg', width: 1280, height: 1600, sport: 'Basketball', category: 'Basketball' },
  { src: '/photos/ZP Web - 1.jpg', width: 1988, height: 2982, sport: 'Field Hockey', category: 'More Sports' },
  { src: '/photos/SPORTS-Zarcone-Photography-0132.jpg', width: 1600, height: 1280, sport: 'Soccer', category: 'More Sports' },
  { src: '/photos/SPORTS-Zarcone-Photography-0075-2.jpg', width: 1279, height: 1600, sport: 'Cheer', category: 'More Sports' },
];


// Deal photos (in reading order) into `n` height-balanced columns so the grid
// reads left-to-right, best first. Keeps each photo's reading index for the
// lightbox.
function toColumns(list, n = 3) {
  const cols = Array.from({ length: n }, () => []);
  const heights = new Array(n).fill(0);
  list.forEach((photo, idx) => {
    const c = heights.indexOf(Math.min(...heights));
    cols[c].push({ photo, idx });
    heights[c] += photo.height / photo.width;
  });
  return cols;
}

export default function SportsPage() {
  const [active, setActive] = useState('All');
  const [lbIndex, setLbIndex] = useState(null);

  const filtered = active === 'All' ? PHOTOS : PHOTOS.filter(p => p.category === active);
  const columns = toColumns(filtered);

  return (
    <>
      <PageHero
        eyebrow="01 / Sports"
        title="Sports Photography Portfolio"
        description="Four years of early mornings, weight rooms, and Friday nights — and it ends in a single season. Your athlete gave everything. The photos should prove it."
        imageSrc="/photos/i-s7zBdzk.jpg"
        strongOverlay
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
        <strong style={{ color: 'var(--text)' }}>As Featured in Patch:</strong> a recent profile on Tom Zarcone's three-decade career photographing local student-athletes — the same standard behind every gallery below.{' '}
        <a
          href="https://patch.com/new-jersey/bridgewater/bridgewater-photographer-focuses-lens-local-student-athletes"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent)', textDecoration: 'underline' }}
        >
          Read the feature →
        </a>
      </p>

      <p className={styles.painLine} style={{ paddingTop: 0 }}>
        Currently covering the 2026 season as official media partner of{' '}
        <Link href="/brhs-panther-football" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
          Bridgewater Raritan Panthers football →
        </Link>
        {', '}the 2026-27 season as official photography &amp; social media partner of{' '}
        <Link href="/brhs-panther-wrestling" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
          BRHS Panther Wrestling →
        </Link>
        {', and the 2026 season as official media partner of '}
        <Link href="/brhs-panther-volleyball" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
          BRHS Panther volleyball photography →
        </Link>
      </p>

      <p className={styles.painLine} style={{ paddingTop: 0 }}>
        Looking for a{' '}
        <Link href="/sports-photographer-nj" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
          sports photographer NJ
        </Link>
        {' '}teams and families actually trust for game-day coverage? Every gallery below is a real example of that work.
      </p>

      <p className={styles.painLine} style={{ paddingTop: 0 }}>
        Booking a season, a team or a program? See how{' '}
        <Link href="/schools-athletic-programs-nj" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
          season media partnerships for NJ schools
        </Link>
        {' '}work, or check{' '}
        <Link href="/pricing" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
          pricing
        </Link>
        .
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
        {columns.map((col, c) => (
          <div key={c} className={styles.col}>
            {col.map(({ photo, idx }) => (
            <div
              key={photo.src}
              className={styles.item}
              onClick={() => setLbIndex(idx)}
            >
              <Image
                src={photo.src}
                alt={`${photo.sport} photography — Zarcone Photography, New Jersey`}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 560px) 100vw, 33vw"
                style={{ width: '100%', height: 'auto' }}
              />
              <div className={styles.overlay}>
                <span className={styles.label}>{photo.sport}</span>
              </div>
            </div>
            ))}
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
        <div className={styles.testimonialCard}>
          <blockquote className={styles.testimonialText}>"I had the pleasure of using Tom's services many times over the course of 4 years during my son's wrestling career. Tom has a knack for capturing just the right moment in whatever type of lighting, no matter the subject speed, and always getting an excellent shot."</blockquote>
          <cite className={styles.testimonialCite}>— Anthony D., Wrestling Parent</cite>
        </div>
        <div className={styles.testimonialCard}>
          <blockquote className={styles.testimonialText}>"He covered an array of action shots from every angle around the field of our daughter catching and hitting with her club team and also her D1 college softball team. He also covered a couple of our son's AAU basketball games. A true master of his craft!"</blockquote>
          <cite className={styles.testimonialCite}>— Brian M., Sports Parent</cite>
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
          images={filtered.map(p => ({ src: p.src, alt: `${p.sport} photography — Zarcone Photography, New Jersey` }))}
          currentIndex={lbIndex}
          onClose={() => setLbIndex(null)}
          onPrev={() => setLbIndex((lbIndex - 1 + filtered.length) % filtered.length)}
          onNext={() => setLbIndex((lbIndex + 1) % filtered.length)}
        />
      )}
    </>
  );
}
