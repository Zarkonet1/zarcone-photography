import { DELIVERY_STANDARDS } from '@/lib/govconData';
import styles from './govcon.module.css';

export default function GovDeliveryStandards() {
  return (
    <section id="delivery-standards" className={`${styles.section} ${styles.anchorOffset}`} aria-labelledby="delivery-standards-heading">
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2 id="delivery-standards-heading" className={styles.h2}>Image Delivery Standards</h2>
        </div>
        <div className={styles.deliveryList}>
          {DELIVERY_STANDARDS.map((d) => (
            <div key={d.label} className={styles.deliveryItem}>
              <span className={styles.deliveryLabel}>{d.label}</span>
              <span className={styles.deliveryDescription}>{d.description}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
