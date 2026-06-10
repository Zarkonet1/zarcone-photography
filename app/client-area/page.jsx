import Link from 'next/link';
import PageHero from '@/components/PageHero';
import styles from './page.module.css';

export const metadata = {
  title: 'Client Area — Zarcone Photography',
  description: 'Access your private photo gallery from Zarcone Photography.',
};

export default function ClientAreaPage() {
  return (
    <>
      <PageHero
        eyebrow="Client Area"
        title="Your Gallery"
        description="Your photos are ready. Use the links below to access, download, and order prints from your session."
        imageSrc="/photos/PORTRAIT-Zarcone-Photography-0002.jpg"
      />

      <div className={styles.wrap}>

        {/* New galleries — PicTime */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={`eyebrow ${styles.eyebrow}`}>New Galleries</span>
            <div className="section-rule" />
          </div>
          <div className={styles.card}>
            <div className={styles.cardText}>
              <h2 className={styles.cardTitle}>Recent Sessions</h2>
              <p className={styles.cardDesc}>
                Galleries from 2025 onward are delivered through Pic‑Time — a private, password-protected portal where you can view, favorite, download, and order prints from your session.
              </p>
              <ul className={styles.featureList}>
                <li>Private & password protected</li>
                <li>High-resolution downloads</li>
                <li>Print & product ordering</li>
                <li>Mobile friendly</li>
              </ul>
            </div>
            <div className={styles.cardAction}>
              <a
                href="https://zarconephotographyllc.pic-time.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`btn ${styles.primaryBtn}`}
              >
                Open My Gallery →
              </a>
              <p className={styles.hint}>You'll need the access link sent to your email.</p>
            </div>
          </div>
        </div>

        {/* Archive galleries — SmugMug */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={`eyebrow ${styles.eyebrow}`}>Archive Galleries</span>
            <div className="section-rule" />
          </div>
          <div className={styles.card}>
            <div className={styles.cardText}>
              <h2 className={styles.cardTitle}>Previous Sessions</h2>
              <p className={styles.cardDesc}>
                Galleries from sessions prior to 2025 are hosted on SmugMug. If you were provided a direct gallery link, use that. Otherwise, browse the archive below.
              </p>
              <ul className={styles.featureList}>
                <li>All sessions prior to 2025</li>
                <li>High-resolution downloads</li>
                <li>Print ordering available</li>
              </ul>
            </div>
            <div className={styles.cardAction}>
              <a
                href="https://zarconephotography.smugmug.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`btn`}
              >
                Browse Archive →
              </a>
              <p className={styles.hint}>Use the direct link from your delivery email if you have one.</p>
            </div>
          </div>
        </div>

        {/* Help strip */}
        <div className={styles.helpStrip}>
          <p>Can't find your gallery or need help accessing your photos?</p>
          <Link href="/about#contact" className="btn">Contact Tom →</Link>
        </div>

      </div>
    </>
  );
}
