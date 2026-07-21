import Image from 'next/image';
import { EXECUTIVE_BIO } from '@/lib/govconData';
import styles from './govcon.module.css';

export default function GovExecutiveBio() {
  return (
    <section
      id="executive-biography"
      className={`${styles.section} ${styles.sectionAlt} ${styles.anchorOffset}`}
      aria-labelledby="executive-biography-heading"
    >
      <div className={`${styles.container} ${EXECUTIVE_BIO.image ? styles.bioGrid : styles.bioGridNoImage}`}>
        <div>
          <div className={styles.sectionHead}>
            <h2 id="executive-biography-heading" className={styles.h2}>{EXECUTIVE_BIO.headline}</h2>
          </div>
          <div className={styles.body} style={{ maxWidth: 680 }}>
            {EXECUTIVE_BIO.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {EXECUTIVE_BIO.image && (
          <div className={styles.bioImageWrap}>
            <Image
              src={EXECUTIVE_BIO.image.src}
              alt={EXECUTIVE_BIO.image.alt}
              fill
              sizes="(max-width: 900px) 100vw, 260px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
