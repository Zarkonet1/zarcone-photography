import { WORKFLOW_STEPS } from '@/lib/govconData';
import styles from './govcon.module.css';

// Also serves as the "Sample Project Workflow" Resource Center entry —
// no separate content needed (see GOVCON-LANDING-PAGE-SPEC.md §3.8).
export default function GovHowWeWork() {
  return (
    <section id="how-we-work" className={`${styles.section} ${styles.sectionAlt} ${styles.anchorOffset}`} aria-labelledby="how-we-work-heading">
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2 id="how-we-work-heading" className={styles.h2}>How We Work</h2>
        </div>
        <div className={styles.workflow}>
          {WORKFLOW_STEPS.map((s) => (
            <div key={s.step} className={styles.workflowStep}>
              <span className={styles.workflowNum}>{s.step}</span>
              <h3 className={styles.workflowTitle}>{s.title}</h3>
              <p className={styles.workflowBody}>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
