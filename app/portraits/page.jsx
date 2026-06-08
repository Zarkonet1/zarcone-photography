'use client';

import { useState, useEffect } from 'react';
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
  { src: xl('i-rvRX82g','MJzr4MQDSkdG6K45b5RNpvHFgPwCtGRsDbv4wdHKm'), category: 'Senior' },
  { src: xl('i-4mMh8Gp','KWRFxQtqFCNLDPBZWLSwKnLLSHpQB9bxWgFH6w3nW'), category: 'Senior' },
  { src: xl('i-h8mgrwL','NRBWb4rh3HwtCcpFZBb686ZKRnQrnxcz5pb5BSwnX'), category: 'Senior' },
  { src: xl('i-MfnnVjj','LnJSMq37QPdhmhRRhkknX2w8PHG4VZ6dBPfPgkwvd'), category: 'Senior' },
  { src: xl('i-4H3CTdR','MdnC3j8Vq8PnG3WxnDj7Ccz9GSk7gBpQ2zZPxq3tb'), category: 'Senior' },
  // Individuals / headshots
  { src: xl('i-LdgcRk9','L9pL32fpZD4rrj9bM8cDBsrNWFWmtDVpdv6vsFRt5'), category: 'Individual' },
  { src: xl('i-rkggQ5F','Ncm5zMSXJ7bc7b7ZBmpP8Z37cppC93KKKkWhHtv58'), category: 'Headshot' },
  { src: xl('i-WQ3qLhx','MX4RnGQ4SKgjv2K6vkzB29WLsp3SDzNQJ6gDvKQb8'), category: 'Individual' },
  { src: xl('i-fLbtP97','NhCqGhtshBLC4NrP33RWdS265GMggvBHKhkfTG48N'), category: 'Headshot' },
  // Families
  { src: xl('i-pnGfzmw','K6s2wn36fpqhqHjJZkzP69qTQx7cgt2tSPX4ZrhXL'), category: 'Family' },
  { src: xl('i-3JzdPqR','NPfzx6KBt9g7ZKPfDwLjSGzpv9mS4RrrmZV7DVSLK'), category: 'Family' },
  { src: xl('i-V8jpQJc','Kj8C3R6FhmhcQzbwrFvKm2LHBs94bb6S7BZP82Qsk'), category: 'Family' },
  { src: xl('i-PwrWz93','KPvSkhCpXTqsXLSWSLnsQprnMZsS996HmHsX5vGTp'), category: 'Family' },
  { src: xl('i-r5WjMkh','KhBsGNpctCDrKWdmKFnpP2mRC8ZhdQFVVrJzJ3d4F'), category: 'Family' },
];

export default function PortraitsPage() {
  const [active, setActive] = useState('All');
  const [lbIndex, setLbIndex] = useState(null);

  const filtered = active === 'All' ? PHOTOS : PHOTOS.filter(p => p.category === active);

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
        description="Seniors, individuals, families, and professional headshots. Every session is relaxed, unhurried, and built around revealing who you actually are."
        imageSrc="https://photos.smugmug.com/photos/i-rvRX82g/0/MJzr4MQDSkdG6K45b5RNpvHFgPwCtGRsDbv4wdHKm/XL/i-rvRX82g-XL.jpg"
      />

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
            <img src={photo.src} alt={photo.category} className={styles.img} />
            <div className={styles.itemOverlay}>
              <span className={styles.itemLabel}>{photo.category}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="cta-strip">
        <h2>Ready to book a <em>portrait session?</em></h2>
        <Link href="/about#contact" className="btn">Get In Touch</Link>
      </div>

      {/* Lightbox */}
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
