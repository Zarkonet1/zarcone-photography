import Link from 'next/link';
import styles from './not-found.module.css';

export const metadata = {
  title: '404 — Zarcone Photography',
};

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <p className={`eyebrow ${styles.eyebrow}`}>404</p>
        <h1 className={styles.title}>Lost in the frame.</h1>
        <p className={styles.desc}>
          That page doesn't exist — but the rest of the work does.
        </p>
        <div className={styles.links}>
          <Link href="/" className="btn btn-solid">Back to Home</Link>
          <Link href="/about#contact" className="btn">Get In Touch</Link>
        </div>
      </div>
    </div>
  );
}
