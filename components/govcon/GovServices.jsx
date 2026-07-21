import { GOVERNMENT_SERVICES } from '@/lib/govconData';
import styles from './govcon.module.css';

function CheckMark() {
  return (
    <svg className={styles.serviceCheck} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function GovServices() {
  return (
    <section id="government-services" className={`${styles.section} ${styles.anchorOffset}`} aria-labelledby="government-services-heading">
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2 id="government-services-heading" className={styles.h2}>Government Services</h2>
        </div>
        <ul className={styles.serviceList} style={{ listStyle: 'none' }}>
          {GOVERNMENT_SERVICES.map((service) => (
            <li key={service} className={styles.serviceItem}>
              <CheckMark />
              <span>{service}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
