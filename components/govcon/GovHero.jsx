import Image from 'next/image';
import { HERO } from '@/lib/govconData';
import styles from './govcon.module.css';

// Hero background image is fully configuration-driven — see
// lib/govconData.js `HERO.backgroundImage`. Changing the image requires
// editing that single value; this component never hardcodes a src.
export default function GovHero() {
  const hasImage = Boolean(HERO.backgroundImage);

  return (
    <section className={styles.hero} aria-label="Government Practice introduction">
      <div className={`${styles.container} ${hasImage ? styles.heroWithImage : ''}`}>
        <div className={styles.heroInner}>
          <span className={styles.kicker}>{HERO.kicker}</span>
          <h1 className={styles.heroH1}>{HERO.headline}</h1>
          <p className={styles.heroSub}>{HERO.subhead}</p>
          <div className={styles.btnRow}>
            <a href={HERO.primaryCta.href} className={styles.btnPrimary}>
              {HERO.primaryCta.label}
            </a>
            <a href={HERO.secondaryCta.href} className={styles.btnSecondary}>
              {HERO.secondaryCta.label}
            </a>
          </div>
        </div>

        {hasImage && (
          <div className={styles.heroImageWrap}>
            <Image
              src={HERO.backgroundImage}
              alt="Zarcone Photography institutional documentation"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
}
