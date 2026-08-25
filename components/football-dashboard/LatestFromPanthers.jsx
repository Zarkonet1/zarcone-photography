'use client';

// Editorial section — 1 large + 2 small cards, real ZP photography, minimal
// copy per the brief ("photography should have room to breathe"). Pulls
// from the same ARTICLES array that already powers the full "In The News"
// section further down the page — no new content model, just a different
// presentation of the top 3 by date. If ARTICLES ever has fewer than 3
// entries this renders fewer cards rather than erroring.
import Image from 'next/image';
import styles from './LatestFromPanthers.module.css';

export default function LatestFromPanthers({ items }) {
  if (!items || items.length === 0) return null;
  const [featured, ...rest] = items;
  const small = rest.slice(0, 2);

  return (
    <div className={styles.wrap}>
      <span className={styles.heading}>Latest From The Panthers</span>
      <div className={styles.grid}>
        <a href={featured.url} target="_blank" rel="noopener noreferrer" className={styles.featured}>
          <div className={styles.imgWrap}>
            <Image src={featured.img} alt="" fill sizes="(max-width: 900px) 100vw, 60vw" style={{ objectFit: 'cover' }} />
            <div className={styles.scrim} />
          </div>
          <div className={styles.text}>
            <span className={styles.source}>{featured.source}</span>
            <span className={styles.title}>{featured.title}</span>
          </div>
        </a>
        <div className={styles.smallCol}>
          {small.map((a, i) => (
            <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className={styles.small}>
              <div className={styles.imgWrap}>
                <Image src={a.img} alt="" fill sizes="(max-width: 900px) 100vw, 30vw" style={{ objectFit: 'cover' }} />
                <div className={styles.scrim} />
              </div>
              <div className={styles.text}>
                <span className={styles.source}>{a.source}</span>
                <span className={styles.titleSmall}>{a.title}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
