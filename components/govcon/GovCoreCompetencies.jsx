import { CORE_COMPETENCIES } from '@/lib/govconData';
import styles from './govcon.module.css';

// Simple outline-style mark — deliberately not an illustrative icon set.
// Keeps the section register aligned with the "quiet competence" brief
// (no oversized/decorative iconography).
function Mark() {
  return (
    <svg className={styles.competencyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 12h10M7 8h10M7 16h6" />
    </svg>
  );
}

export default function GovCoreCompetencies() {
  return (
    <section id="core-competencies" className={`${styles.section} ${styles.sectionAlt} ${styles.anchorOffset}`} aria-labelledby="core-competencies-heading">
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2 id="core-competencies-heading" className={styles.h2}>Core Competencies</h2>
        </div>
        <div className={styles.competencyGrid}>
          {CORE_COMPETENCIES.map((c) => (
            <div key={c.title}>
              <Mark />
              <h3 className={styles.competencyTitle}>{c.title}</h3>
              <p className={styles.competencyBody}>{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
