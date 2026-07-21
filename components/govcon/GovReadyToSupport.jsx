import { READY_TO_SUPPORT } from '@/lib/govconData';
import styles from './govcon.module.css';

// Small, understated closing section — a gentle transition from FAQ into
// the Contact form. Deliberately brief; see lib/govconData.js for the
// readiness-framing note (no experience claims here).
export default function GovReadyToSupport() {
  return (
    <section className={`${styles.section} ${styles.readySection}`} aria-labelledby="ready-to-support-heading">
      <div className={`${styles.container} ${styles.narrow}`}>
        <div className={styles.readyRule} />
        <div className={`${styles.sectionHead} ${styles.center}`} style={{ marginBottom: 0 }}>
          <h2 id="ready-to-support-heading" className={styles.h2}>{READY_TO_SUPPORT.headline}</h2>
        </div>
        <div className={styles.body} style={{ textAlign: 'center' }}>
          {READY_TO_SUPPORT.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
