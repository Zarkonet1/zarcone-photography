import { CERTIFICATION_BADGES, QUICK_REFERENCE, COMPANY_DATA } from '@/lib/govconData';
import styles from './govcon.module.css';

// Houses both the trust-badge row and the "Frequently Requested Company
// Information" Resource Center entry — same underlying facts (see
// lib/govconData.js COMPANY_DATA), formatted for fast scanning.
export default function GovCertifications() {
  return (
    <section id="certifications" className={`${styles.section} ${styles.sectionAlt} ${styles.anchorOffset}`} aria-labelledby="certifications-heading">
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2 id="certifications-heading" className={styles.h2}>Certifications, Registration &amp; Company Data</h2>
        </div>

        <div className={styles.badgeRow}>
          {CERTIFICATION_BADGES.map((b) => (
            <div key={b.label} className={styles.badge}>
              <p className={styles.badgeLabel}>{b.label}</p>
              <p className={styles.badgeValue}>{b.value}</p>
              {b.verifyHref && (
                <a href={b.verifyHref} className={styles.badgeVerify} target="_blank" rel="noopener noreferrer">
                  Verify →
                </a>
              )}
            </div>
          ))}
        </div>

        <p className={styles.serviceAreaNote}>Service Area: {COMPANY_DATA.serviceArea}</p>

        <div className={styles.quickRefTable}>
          {QUICK_REFERENCE.map((row) => (
            <div key={row.label} className={styles.quickRefRow}>
              <span className={styles.quickRefLabel}>{row.label}</span>
              <span className={styles.quickRefValue}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
