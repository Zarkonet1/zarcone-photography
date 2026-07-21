import { INSTITUTIONAL_PARTNERSHIPS } from '@/lib/govconData';
import styles from './govcon.module.css';

// Kept visually and linguistically distinct from Certifications above and
// Why Government Buyers Choose Us below — non-adjacent by design. See
// GOVCON-LANDING-PAGE-SPEC.md §0 for why this separation exists: it
// prevents a reader from inferring federal past performance that doesn't
// exist. Do not remove the framing paragraph or move this section next
// to "Why Government Buyers Choose Us."
export default function GovInstitutionalPartnerships() {
  return (
    <section
      id="institutional-experience"
      className={`${styles.section} ${styles.anchorOffset}`}
      aria-labelledby="institutional-experience-heading"
    >
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2 id="institutional-experience-heading" className={styles.h2}>{INSTITUTIONAL_PARTNERSHIPS.headline}</h2>
        </div>

        <p className={styles.partnershipsFraming}>{INSTITUTIONAL_PARTNERSHIPS.framing}</p>

        <div className={styles.partnershipList}>
          {INSTITUTIONAL_PARTNERSHIPS.items.map((item, i) => (
            <p key={i} className={styles.partnershipItem}>{item}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
