import { WHY_BUYERS_CHOOSE_US } from '@/lib/govconData';
import styles from './govcon.module.css';

function CheckMark() {
  return (
    <svg className={styles.buyerCheck} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="10" cy="10" r="8.5" />
      <path d="M6.5 10.2l2.3 2.3 4.7-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function GovWhyBuyersChooseUs() {
  return (
    <section
      id="why-buyers-choose-us"
      className={`${styles.section} ${styles.sectionAlt} ${styles.anchorOffset}`}
      aria-labelledby="why-buyers-choose-us-heading"
    >
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2 id="why-buyers-choose-us-heading" className={styles.h2}>Why Government Buyers Choose Us</h2>
        </div>
        <div className={styles.buyerList}>
          {WHY_BUYERS_CHOOSE_US.map((b) => (
            <div key={b.title} className={styles.buyerItem}>
              <CheckMark />
              <div>
                <p className={styles.buyerTitle}>{b.title}</p>
                <p className={styles.buyerBody}>{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
