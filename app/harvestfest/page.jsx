import styles from './page.module.css';
import HarvestFestExperience from '@/components/HarvestFest/HarvestFestExperience';

// /harvestfest — QR landing page for the Zarcone Photography booth at the
// Wagner Farm Arboretum Harvest Festival (Sept 26, 2026). Printed QR code
// points only at this permanent URL; everything downstream (copy, offer,
// categories) can change without touching the code or reprinting anything.
//
// Deliberately a plain server component for the hero/header — no client
// JS needed for a static image + text block, keeps first paint fast for
// someone scanning a QR code outdoors on cellular. All interactivity
// (category selection, the giveaway/lead form) lives in the
// HarvestFestExperience client-component island below.
export default function HarvestFestPage() {
  return (
    <div className={styles.page}>
      <header className={styles.microHeader}>
        <img src="/assets/logo-white.png" alt="Zarcone Photography" className={styles.logo} />
      </header>

      <section className={styles.hero}>
        <img
          src="/photos/i-HkmJPk8.jpg"
          alt="Zarcone Photography"
          className={styles.heroImg}
          fetchpriority="high"
          loading="eager"
          decoding="async"
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Zarcone Photography</p>
          <h1 className={styles.heroHeadline}>More Than Game Day.</h1>
          <p className={styles.heroSubhead}>
            Sports. Seniors. Families. Schools &amp; teams. Events. See the work, or enter to win a session below.
          </p>
          <p className={styles.heroAnchor}>Wagner Farm Harvest Festival · Sept 26 · Warren, NJ</p>
        </div>
      </section>

      <HarvestFestExperience />
    </div>
  );
}
