import styles from './PageHero.module.css';

export default function PageHero({ eyebrow, title, description, imageSrc, imagePosition = 'center' }) {
  return (
    <div className={styles.hero}>
      <div
        className={styles.img}
        style={{ backgroundImage: `url('${imageSrc}')`, backgroundPosition: imagePosition }}
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={`eyebrow ${styles.eyebrow}`}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.desc}>{description}</p>}
      </div>
    </div>
  );
}
