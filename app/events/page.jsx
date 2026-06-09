'use client';

import { useState, useEffect } from 'react';
import PageHero from '@/components/PageHero';
import Link from 'next/link';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Music', 'Prom', 'Celebration', 'Events'];

const BARN_SWALLOWS = '/photos/i-q7LzKSb.jpg';
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
      { src: '/photos/PORTRAIT-Zarcone-Photography-73.jpg', pos: 'center 20%' },
      { src: '/photos/PORTRAIT-Zarcone-Photography-83.jpg', pos: 'center 10%' },
    ],
    layout: 'double',
    reverse: true,
  },
  {
    category: 'Celebration',
    title: 'Milestone Events',
    desc: 'Award ceremonies, signings, retirements, and personal milestones. These moments deserve to be documented with care and intention.',
    images: [
      {src: '/photos/EVENT-ELLA-BAPTISM.jpg', pos: 'center 20%' },
    ],
    layout: 'single',
  },
  {
    category: 'Celebration',
    title: "Family Celebrations",
    desc: "Baptisms, birthdays, and family gatherings — the moments that bring everyone together and deserve to be remembered.",
    images: [
         {src: '/photos/PORTRAIT-Zarcone-Photography-00085.jpg', pos: 'center 20%' }
    ],
    layout: 'single',
  },
  {
    category: 'Music',
    title: "Live Performances",
    desc: "The energy of live music captured in motion — the stage, the crowd, the emotion before it fades.",
    images: [
      {src: '/photos/EVENT - Zarcone Photography-35.jpg', pos: 'center' }
    ],
    layout: 'single',
  },
  {
    category: 'Events',
    title: "Event Coverage",
    desc: "Professional documentation of the gatherings, ceremonies, and community events that define the moments people remember.",
    images: [
{src: '/photos/EVENT-Zarcone-Photography-043.jpg', pos: 'center 20%' },
{src: '/photos/EVENT-Zarcone-Photography-047.jpg', pos: 'center 20%' },
    ],
    layout: 'double',
  },
  {
    category: 'Events',
    title: "More Coverage",
    desc: "Every event tells a story. From the quiet moments between action to the big celebrations worth framing.",
    images: [
      '/photos/EVENT-Zarcone-Photography-0008.jpg',
      '/photos/EVENT-Zarcone-Photography-0073.jpg',
    ],
    layout: 'double',
  },
  {
    category: 'Events',
    title: "On Location",
    desc: "Candid documentation of people and gatherings in their element — natural light, real moments, no staging.",
    images: [
      '/photos/EVENT-Zarcone-Photography-11.jpg',
      '/photos/EVENT-Zarcone-Photography-13.jpg',
    ],
    layout: 'double',
  },
  {
    category: 'Events',
    title: "Additional Events",
    desc: "Ceremonies, receptions, and special occasions — photographed with the same attention given to every assignment.",
    images: [
      '/photos/EVENT-Zarcone-Photography-201.jpg',
      '/photos/EVENT-Zarcone-Photography-28.jpg',
    ],
    layout: 'double',
    reverse: true,
  },
  {
    category: 'Events',
    title: "Recent Work",
    desc: "A selection of recent event coverage spanning celebrations, community gatherings, and milestone moments.",
    images: [
      '/photos/EVENT-Zarcone-Photography-65.jpg',
      '/photos/EVENT-Zarcone-Photography-74-topaz.jpg',
    ],
    layout: 'double',
  },
  {
    category: 'Events',
    title: "In Motion",
    desc: "Movement, energy, and atmosphere — event photography that captures the feeling of being there.",
    images: [
      '/photos/EVENT-Zarcone-Photography-79.jpg',
      '/photos/EVENT-Zarcone-PhotographyZarcone-Photography-38-Motion.jpg',
    ],
    layout: 'double',
    reverse: true,
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
              {event.images.map((img, j) => {
                const src = typeof img === 'string' ? img : img.src;
                const pos = typeof img === 'string' ? 'center' : (img.pos || 'center');
                return (
                  <div key={j} className={styles.imgWrap}>
                    <div className={styles.img} style={{ backgroundImage: `url('${src}')`, backgroundPosition: pos }} />
                  </div>
                );
              })}
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
