'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import Lightbox from '@/components/Lightbox';
import Link from 'next/link';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Senior Posters', 'Wrestling', 'Lacrosse', 'Track', 'Baseball', 'Softball', 'Custom'];

// Local design / poster photos
const PIECES = [
  // Track Senior Posters
  { src: '/photos/i-hdjLNfF.jpg', width: 1600, height: 2400, category: 'Track',     title: 'Track — Senior Poster',        size: 'wide' },
  { src: '/photos/i-CjRtd4L.jpg', width: 1600, height: 2400, category: 'Track',     title: 'Track — Senior Composite',     size: 'half' },
  { src: '/photos/i-GRNTs87.jpg', width: 1600, height: 2400, category: 'Track',     title: 'Track — Senior Design',        size: 'half' },
  { src: '/photos/i-JdzdDzw.jpg', width: 1600, height: 2400, category: 'Track',     title: 'Track — Senior Poster',        size: 'half' },
  { src: '/photos/i-2bzMvNC.jpg', width: 1600, height: 2400, category: 'Track',     title: 'Track — Senior Composite',     size: 'half' },
  // Wrestling Senior Posters
  { src: '/photos/i-L2f9FWq.jpg', width: 1600, height: 2400, category: 'Wrestling', title: 'Wrestling — Senior Design',    size: 'wide' },
  { src: '/photos/i-JgVQLHd.jpg', width: 1600, height: 2400, category: 'Wrestling', title: 'Wrestling — Senior Composite', size: 'half' },
  { src: '/photos/i-h4PXdgk.jpg', width: 1600, height: 2400, category: 'Wrestling', title: 'Wrestling — Senior Poster',    size: 'half' },
  { src: '/photos/i-rgvSB9k.jpg', width: 1600, height: 2400, category: 'Wrestling', title: 'Wrestling — Senior Design',    size: 'half' },
  // Girls Lacrosse Senior Posters
  { src: '/photos/i-4VRDpGg.jpg', width: 1600, height: 2400, category: 'Lacrosse',  title: 'Lacrosse — Senior Poster',     size: 'wide' },
  { src: '/photos/i-2CHdSJx.jpg', width: 1600, height: 2400, category: 'Lacrosse',  title: 'Lacrosse — Senior Design',     size: 'half' },
  { src: '/photos/i-Cf5RqJt.jpg', width: 1600, height: 2400, category: 'Lacrosse',  title: 'Lacrosse — Senior Composite',  size: 'half' },
  // Baseball / Team Posters
  { src: '/photos/DESIGN-20WinsPoster.jpg', width: 2400, height: 1920,              category: 'Baseball',      title: 'Baseball — 20 Wins Celebration',   size: 'wide' },
  { src: '/photos/DESIGN-PanthersElite18U-Team-Poster.jpg', width: 2400, height: 1200, category: 'Baseball',  title: 'Baseball — Panthers Elite 18U',    size: 'wide' },
  // Softball Designs
  { src: '/photos/DESIGN-BR16USoftballPanthers.jpg', width: 2400, height: 1920,     category: 'Softball',     title: 'Softball — BR Panthers 16U',       size: 'wide' },
  { src: '/photos/DESIGN-SoftballTeamActionFigures.jpg', width: 2400, height: 1200, category: 'Softball',     title: 'Softball — Team Action Figures',   size: 'wide' },
  // Senior Posters (additional)
  { src: '/photos/DESIGN-Kayla_FinalWeb.jpg', width: 1800, height: 2400,            category: 'Senior Posters', title: 'Senior — Kayla',                 size: 'half' },
  { src: '/photos/DESIGN-LeapPoster.jpg', width: 1920, height: 2400,                category: 'Senior Posters', title: 'Senior — Leap Poster',           size: 'half' },
  { src: '/photos/DESIGN-SENIOR-PANO.jpg', width: 2400, height: 800,               category: 'Senior Posters', title: 'Senior — Panorama Composite',    size: 'wide' },
  // Custom Work
  { src: '/photos/DESIGN-JackieFlag1_pp.jpg', width: 2400, height: 1600,            category: 'Custom',       title: 'Custom — Flag Tribute',            size: 'wide' },
  { src: '/photos/DESIGN-Example10v1.jpg', width: 1920, height: 2400,               category: 'Custom',       title: 'Custom — Design Portfolio',        size: 'half' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DesignPage() {
  const [active, setActive] = useState('All');
  const [lbIndex, setLbIndex] = useState(null);

  const shuffled = useMemo(() => shuffle(PIECES), []);
  const filtered = active === 'All' ? shuffled : shuffled.filter(p => p.category === active);

  return (
    <>
      <PageHero
        eyebrow="04 / Design"
        title="Design"
        description="Senior poster composites, sports graphics, and branded imagery — where photography meets design. Built for athletes who want something worth hanging on a wall."
        imageSrc="/photos/DESIGN-Kayla_FinalWeb.jpg"
        imagePosition="center top"
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
            className={styles.item}
            onClick={() => setLbIndex(i)}
          >
            <Image
              src={piece.src}
              alt={piece.title}
              width={piece.width}
              height={piece.height}
              sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
              style={{ width: '100%', height: 'auto' }}
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

      <div className={styles.testimonial}>
        <blockquote className={styles.testimonialText}>
          "The quality of his photography and graphic design work has taken BRHS Wrestling's social media presence to another level — his graphics consistently look sharp, professional, and engaging."
        </blockquote>
        <cite className={styles.testimonialCite}>— Kyle Murphy, Head Wrestling Coach, BRHS</cite>
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
