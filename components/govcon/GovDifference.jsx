import { ZARCONE_DIFFERENCE } from '@/lib/govconData';
import styles from './govcon.module.css';

export default function GovDifference() {
  return (
    <section
      id="zarcone-difference"
      className={`${styles.section} ${styles.differenceSection} ${styles.anchorOffset}`}
      aria-labelledby="zarcone-difference-heading"
    >
      <div className={`${styles.container} ${styles.narrow}`}>
        <div className={`${styles.sectionHead} ${styles.center}`}>
          <span className={styles.kicker}>{ZARCONE_DIFFERENCE.subhead}</span>
          <h2 id="zarcone-difference-heading" className={styles.h2}>{ZARCONE_DIFFERENCE.headline}</h2>
        </div>

        <p className={styles.pullLine} style={{ textAlign: 'center' }}>
          {ZARCONE_DIFFERENCE.pullLine}
        </p>

        <div className={styles.body}>
          {ZARCONE_DIFFERENCE.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
