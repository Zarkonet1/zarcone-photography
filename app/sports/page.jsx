'use client';

import { useState } from 'react';
import PageHero from '@/components/PageHero';
import Lightbox from '@/components/Lightbox';
import Link from 'next/link';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Football', 'Wrestling', 'Lacrosse'];

const SM = (id, hash) => `https://photos.smugmug.com/photos/${id}/0/${hash}/XL/${id}-XL.jpg`;

// All real SmugMug sports photos
const PHOTOS = [
  { src: SM('i-s7zBdzk','KJ5D24NzNT4NNP8B7PK33Wb3XrZqpbxxNjhchx7tW'), category: 'Football',  size: 'wide' },
  { src: SM('i-HkmJPk8','LGPB3Mm22vMVCp6qD8g3DbxWL8BhdTfJJSDRK6rqh'), category: 'Football',  size: 'half' },
  { src: SM('i-dkcFTnj','KtfSs8mzbdf5khV9ZzQbLSHRCXFKh9LrvSCCnrggd'), category: 'Wrestling', size: 'half' },
  { src: SM('i-wBrCNrq','L5wpZjwGwZRK3hjkQ5rjnFMRfx8P22tQqgVJmQTZD'), category: 'Wrestling', size: 'half' },
  { src: SM('i-Lv2PXKm','Km8qgRtmpGqNCM3qd369qMLkjgQGgbfDVPsbwsNwh'), category: 'Wrestling', size: 'wide' },
  { src: SM('i-mhgq9Xp','K3dqbv75fgQxgT45bMJMrRWgN48LqphH8t65vJJVZ'), category: 'Wrestling', size: 'half' },
  { src: SM('i-zshvpsK','MTp5nrLcqhcFKnd9gwdk4CbLjXL7HFDPbxbfJDzfG'), category: 'Wrestling', size: 'half' },
  { src: SM('i-kRHbmsg','LfFfphmgdFgPZbzz9J2fF62Qzh5tFq9pRBGjQb4wR'), category: 'Wrestling', size: 'half' },
  { src: SM('i-TSHFjz3','KZMCdHKVVchnrbNwJHLhVCRDHfLCs79zvpDtR8rnn'), category: 'Lacrosse',  size: 'wide' },
  { src: SM('i-J8KsnKp','LVDXbxxmKb9sBKdRSWLDrhxjDWzPKcSvCqK3f44Rz'), category: 'Lacrosse',  size: 'half' },
  { src: SM('i-mkM2LBS','KvW79zsG5DRRffz5Vw9QNQRndB26MTLncmgTzv5tB'), category: 'Lacrosse',  size: 'half' },
  { src: SM('i-DDRrCRz','K9Wb3mp5mZ6N9fvXC2nhDG3XpjsXtPWjw9Mm7xxhk'), category: 'Lacrosse',  size: 'half' },
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
        imageSrc="https://photos.smugmug.com/photos/i-s7zBdzk/0/KJ5D24NzNT4NNP8B7PK33Wb3XrZqpbxxNjhchx7tW/XL/i-s7zBdzk-XL.jpg"
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
            className={`${styles.item} ${styles[photo.size] || ''}`}
            onClick={() => setLbIndex(i)}
          >
            <div
              className={styles.img}
              style={{ backgroundImage: `url('${photo.src}')` }}
            />
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
