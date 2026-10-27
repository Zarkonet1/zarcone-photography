// Reusable photo slot for team hubs (added 2026-10-27 with the Girls
// Basketball hub). Renders the real photo through next/image when `slot.src`
// is set; otherwise a designed placeholder at the same aspect ratio, so a
// page looks intentional before photography exists and swapping in a photo
// is a one-line data change (see lib/girlsBasketballImages.js).
//
// slot: { src, alt, position, aspect, label }
// caption: optional visible text under the label in the placeholder state
// sizes: next/image sizes hint
import Image from 'next/image';
import styles from './PhotoSlot.module.css';

export default function PhotoSlot({ slot, caption, sizes = '(max-width: 900px) 100vw, 50vw', className = '', priority = false }) {
  if (!slot) return null;
  const aspect = slot.aspect || '3 / 2';

  if (slot.src) {
    return (
      <div className={`${styles.frame} ${className}`} style={{ aspectRatio: aspect }}>
        <Image
          src={slot.src}
          alt={slot.alt || ''}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: 'cover', objectPosition: slot.position || 'center' }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${styles.frame} ${styles.placeholder} ${className}`}
      style={{ aspectRatio: aspect }}
      role="img"
      aria-label={`${slot.label || 'Photo'} — coming soon`}
    >
      <div className={styles.court} aria-hidden="true" />
      <div className={styles.inner}>
        <span className={styles.mark} aria-hidden="true">ZP</span>
        <span className={styles.label}>{slot.label || 'Photo'}</span>
        <span className={styles.caption}>{caption || 'Zarcone Photography coverage — coming this season'}</span>
      </div>
    </div>
  );
}
