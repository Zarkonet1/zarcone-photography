import { WHY_ZARCONE } from '@/lib/govconData';
import styles from './govcon.module.css';

export default function GovWhyUs() {
  return (
    <section id="why-zarcone" className={`${styles.section} ${styles.anchorOffset}`} aria-labelledby="why-zarcone-heading">
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2 id="why-zarcone-heading" className={styles.h2}>{WHY_ZARCONE.headline}</h2>
        </div>
        <div className={styles.body} style={{ maxWidth: 780 }}>
          {WHY_ZARCONE.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <blockquote className={styles.pullLine} style={{ maxWidth: 700 }}>
          &ldquo;{WHY_ZARCONE.pullQuote}&rdquo;
        </blockquote>
      </div>
    </section>
  );
}
