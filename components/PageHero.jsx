import styles from './PageHero.module.css';

export default function PageHero({ eyebrow, title, description, imageSrc, imagePosition = 'center', strongDesc = false, strongOverlay = false, children }) {
  return (
    <div className={styles.hero}>
      <img
        src={imageSrc}
        alt=""
        className={styles.img}
        style={{ objectPosition: imagePosition }}
        fetchpriority="high"
        loading="eager"
        decoding="async"
      />
      <div className={`${styles.overlay} ${strongOverlay ? styles.overlayStrong : ''}`} />
      <div className={styles.content}>
        <p className={`eyebrow ${styles.eyebrow} ${strongOverlay ? styles.eyebrowStrong : ''}`}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={`${styles.desc} ${strongDesc ? styles.descStrong : ''}`}>{description}</p>}
        {children}
      </div>
    </div>
  );
}
