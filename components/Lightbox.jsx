'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './Lightbox.module.css';

export default function Lightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape')     onClose();
    if (e.key === 'ArrowLeft')  onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  const src = images[currentIndex];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <button className={styles.close} onClick={onClose}>✕ &nbsp;Close</button>
      <button className={`${styles.nav} ${styles.prev}`} onClick={e => { e.stopPropagation(); onPrev(); }}>← Prev</button>

      <div className={styles.imgWrap} onClick={e => e.stopPropagation()}>
        <img src={src} alt="" className={styles.img} />
      </div>

      <button className={`${styles.nav} ${styles.next}`} onClick={e => { e.stopPropagation(); onNext(); }}>Next →</button>
    </div>
  );
}
