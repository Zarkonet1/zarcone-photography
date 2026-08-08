'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import Lightbox from '@/components/Lightbox';
import Link from 'next/link';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Individual', 'Family', 'Senior', 'Headshot'];

// All real SmugMug portraits
const SM_BASE = 'https://photos.smugmug.com/photos';
const xl = (id, hash, ext = 'jpg') => `${SM_BASE}/${id}/0/${hash}/XL/${id}-XL.${ext}`;

const PHOTOS = [
  // Seniors
  { src: '/photos/i-rvRX82g.jpg', width: 1920, height: 2400, category: 'Senior' },

  { src: '/photos/GiadaField.jpg', width: 1920, height: 2400, category: 'Senior' },
{ src: '/photos/SENIOR-POSTER-Stark-Football.jpg', width: 1600, height: 2400, category: 'Senior' },
{ src: '/photos/SENIOR-POSTER-Diaz-Volleyball.jpg', width: 1600, height: 2400, category: 'Senior' },
{ src: '/photos/SENIOR-POSTER-Buniowski-Track.jpg', width: 1600, height: 2400, category: 'Senior' },
{ src: '/photos/SENIOR-POSTER-Cespedes-Wrestling.jpg', width: 1600, height: 2400, category: 'Senior' },
{ src: '/photos/SENIOR-POSTER-Giada-Lacrosse.jpg', width: 1920, height: 2400, category: 'Senior' },
  // Individuals / headshots
  { src: '/photos/i-LdgcRk9.jpg', width: 2400, height: 1920, category: 'Individual' },
  { src: '/photos/i-rkggQ5F.jpg', width: 2400, height: 1920, category: 'Headshot' },
  { src: '/photos/MonicaAsh.jpg', width: 2400, height: 1920, category: 'Individual' },
  // Families
  { src: '/photos/i-pnGfzmw.jpg', width: 2400, height: 1920, category: 'Family' },
  { src: '/photos/i-3JzdPqR.jpg', width: 2400, height: 1920, category: 'Family' },
  { src: '/photos/Reedxmas1.jpg', width: 2400, height: 1920, category: 'Family' },
  { src: '/photos/Reedxmas2.jpg', width: 2400, height: 1920, category: 'Family' },
  // Additional portraits
  { src: '/photos/PORTRAIT-Pics-11.jpg', width: 1066, height: 1600,                                          category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photograph-013.jpg', width: 1600, height: 1280,                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-DeBoer0006.jpg', width: 1600, height: 1279,                   category: 'Family' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0002.jpg', width: 1599, height: 1280,                         category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0007-2.jpg', width: 1283, height: 1600,                       category: 'Senior' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-00072.jpg', width: 1279, height: 1600,                        category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-00085.jpg', width: 1600, height: 1267,                        category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0013.jpg', width: 1280, height: 1600,                         category: 'Senior' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0014-2.jpg', width: 1280, height: 1600,                       category: 'Senior' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0020.jpg', width: 1280, height: 1600,                         category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-003.jpg', width: 1600, height: 1066,                          category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0035-2.jpg', width: 1600, height: 1280,                       category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0076.jpg', width: 1143, height: 1600,                         category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-012.jpg', width: 1280, height: 1600,                          category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0127.jpg', width: 1279, height: 1600,                         category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0137.jpg', width: 1066, height: 1600,                         category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-015.jpg', width: 1280, height: 1600,                          category: 'Senior' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-019.jpg', width: 1279, height: 1600,                          category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-020.jpg', width: 1066, height: 1600,                          category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-045.jpg', width: 1280, height: 1600,                          category: 'Senior' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-093-2.jpg', width: 1600, height: 1280,                        category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-36.jpg', width: 1280, height: 1600,                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-65.jpg', width: 1279, height: 1600,                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-1-2.jpg', width: 1600, height: 1066,                          category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-1-8_pp.jpg', width: 1280, height: 1600,                       category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-1-SharpenAI-softness.jpg', width: 1280, height: 1600,         category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-21.jpg', width: 1600, height: 900,                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-3.jpg', width: 1279, height: 1600,                            category: 'Senior' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-39.jpg', width: 1065, height: 1600,                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-42.jpg', width: 1600, height: 1280,                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-48.jpg', width: 1600, height: 1280,                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-67.jpg', width: 1599, height: 1280,                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-7.jpg', width: 1142, height: 1600,                            category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-73.jpg', width: 1600, height: 1280,                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-83-2.jpg', width: 1280, height: 1600,                         category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-83.jpg', width: 1600, height: 1280,                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-87.jpg', width: 1280, height: 1600,                           category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-92-SharpenAI-softness.jpg', width: 1280, height: 1600,        category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-Photography54.jpg', width: 1600, height: 1066,                            category: 'Headshot' },
  { src: '/photos/PORTRAIT-Zarcone-PhotographyZarcone-Photography-21-smb-1.jpg', width: 1280, height: 1600,  category: 'Individual' },
  { src: '/photos/PORTRAIT-Zarcone-PhotographyZarcone-Photography-61-Standard.jpg', width: 1041, height: 1301, category: 'Headshot' },
  { src: '/photos/PORTRAIT-Zarcone-PhotographyZarcone-Photography-63-Motion.jpg', width: 1600, height: 1066, category: 'Individual' },
  { src: '/photos/chloe-portrait.jpg', width: 1280, height: 1600,    category: 'Individual' },
  { src: '/photos/danielle-portrait.jpg', width: 1537, height: 1023, category: 'Individual' },
  { src: '/photos/courtney-portrait.jpg', width: 1537, height: 1023, category: 'Individual' },
  // New intake, 2026-08-03 — cleared for gallery use
  { src: '/photos/ZP Web - 121.jpg', width: 5404, height: 3601, category: 'Family' },
  { src: '/photos/ZP Web - 128.jpg', width: 4371, height: 3497, category: 'Family' },
  { src: '/photos/ZP Web - 35.jpg', width: 4503, height: 3602, category: 'Family' },
  { src: '/photos/ZP Web - 47.jpg', width: 4298, height: 5373, category: 'Family' },
  { src: '/photos/ZP Web - 141.jpg', width: 4429, height: 3543, category: 'Family' },
  { src: '/photos/ZP Web - 129.jpg', width: 4078, height: 5097, category: 'Family' },
  { src: '/photos/ZP Web - 133.jpg', width: 4002, height: 3202, category: 'Family' },
  { src: '/photos/ZP Web - 126.jpg', width: 4802, height: 3841, category: 'Senior' },
  { src: '/photos/ZP Web - 132.jpg', width: 3449, height: 4828, category: 'Senior' },
  { src: '/photos/ZP Web - 137.jpg', width: 2146, height: 2682, category: 'Senior' },
  { src: '/photos/ZP Web - 119.jpg', width: 3833, height: 5366, category: 'Headshot' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PortraitsPage() {
  const [active, setActive] = useState('All');
  const [lbIndex, setLbIndex] = useState(null);

  const shuffled = useMemo(() => shuffle(PHOTOS), []);
  const filtered = active === 'All' ? shuffled : shuffled.filter(p => p.category === active);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <PageHero
        eyebrow="02 / Portraits"
        title="Portraits"
        description="Senior year. Your daughter at 17, exactly as she is right now. You won't get this version of her back — but you can have a photograph that does it justice."
        imageSrc="/photos/PORTRAIT-Zarcone-Photography-0002.jpg"
      />

      <p className={styles.painLine}>
        Most portrait sessions feel rushed, generic, and forgettable. These don't. Every session is unhurried and built around the person in front of the camera — not a pose checklist.
      </p>

      {/* Filter Bar */}
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

      {/* Masonry Gallery */}
      <div className={styles.gallery}>
        {filtered.map((photo, i) => (
          <div key={i} className={`${styles.item} reveal`} onClick={() => setLbIndex(i)}>
            <Image
              src={photo.src}
              alt={`${photo.category} portrait photography — Zarcone Photography, New Jersey`}
              width={photo.width}
              height={photo.height}
              className={styles.img}
              sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
              style={{ width: '100%', height: 'auto' }}
            />
            <div className={styles.itemOverlay}>
              <span className={styles.itemLabel}>{photo.category}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className={styles.testimonials}>
        <div className={styles.testimonialCard}>
          <blockquote className={styles.testimonialText}>"Photo shoot was great and the pictures came out amazing!! Will definitely be using Zarcone Photography again. Tom was super helpful with everything from start to finish including some special editing I wanted done."</blockquote>
          <cite className={styles.testimonialCite}>— Joseph</cite>
        </div>
        <div className={styles.testimonialCard}>
          <blockquote className={styles.testimonialText}>"I had a session booked for holiday photos and we had our baby with us. Super professional and the photos were phenomenal even though the baby wasn't quite in the mood. They followed up to make sure everything went ok — I can't wait to do more with them!"</blockquote>
          <cite className={styles.testimonialCite}>— Julia</cite>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-strip">
        <h2>Ready to have something <em>worth keeping?</em></h2>
        <p>Let's make it happen.</p>
        <Link href="/about#contact" className="btn">Get In Touch</Link>
        <p style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(236,232,225,0.4)', marginTop: '16px' }}>Response within 24 hours &nbsp;·&nbsp; No booking commitment required</p>
      </div>

      {/* Lightbox */}
      {lbIndex !== null && (
        <Lightbox
          images={filtered.map(p => ({ src: p.src, alt: `${p.category} portrait photography — Zarcone Photography, New Jersey` }))}
          currentIndex={lbIndex}
          onClose={() => setLbIndex(null)}
          onPrev={() => setLbIndex((lbIndex - 1 + filtered.length) % filtered.length)}
          onNext={() => setLbIndex((lbIndex + 1) % filtered.length)}
        />
      )}
    </>
  );
}
