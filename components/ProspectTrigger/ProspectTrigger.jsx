import styles from './ProspectTrigger.module.css';

// The single shared shell for every Prospect Trigger page. This file should
// never contain a school name, a stat, a color value, or any copy specific
// to one program — all of that lives in lib/prospectTriggers/data/*.js.
// Producing Prospect #2 should mean writing a new data file, never editing
// this component.
//
// Deliberately a plain server component — no 'use client', no state, no
// client JS at all. The whole page is static markup plus two <a> links
// (mailto:/tel:), which keeps it as fast as possible to load and matches
// the "understood in 10-20 seconds" design goal.
export default function ProspectTrigger({ data }) {
  const { colors, wordmark, headlineLines, seasonAnchor, disclosure, proof, possibility, cta } = data;

  const mailtoHref =
    `mailto:${cta.email}?subject=${encodeURIComponent(cta.subject)}&body=${encodeURIComponent(cta.body)}`;

  const [heroImage, ...supportingImages] = proof.images;

  return (
    <div
      className={styles.page}
      style={{ '--zpt-primary': colors.primary, '--zpt-secondary': colors.secondary }}
    >
      <div className={styles.zpMark}>ZARCONE PHOTOGRAPHY</div>

      {/* RECOGNITION + CURIOSITY */}
      <section className={styles.hero}>
        <p className={styles.wordmark}>{wordmark}</p>
        <h1 className={styles.headline}>
          {headlineLines.map((line, i) => (
            <span key={i} className={styles.headlineLine}>{line}</span>
          ))}
        </h1>
        <p className={styles.anchor}>{seasonAnchor}</p>
      </section>

      <p className={styles.disclosure}>{disclosure}</p>

      {/* FLAGSHIP PROOF — "we're already doing this, for real" */}
      <section className={styles.proof}>
        {proof.heading && <h2 className={styles.proofHeading}>{proof.heading}</h2>}
        {heroImage && (
          <div className={styles.proofHero}>
            <img src={heroImage.src} alt={heroImage.alt} className={styles.proofImg} />
          </div>
        )}
        {supportingImages.length > 0 && (
          <div className={styles.proofRow}>
            {supportingImages.map((img, i) => (
              <div key={i} className={styles.proofSupport}>
                <img src={img.src} alt={img.alt} className={styles.proofImg} />
              </div>
            ))}
          </div>
        )}
        <p className={styles.credibility}>{proof.identityLine}</p>
        <p className={styles.credibilitySub}>{proof.credibilityLine}</p>
        <p className={styles.credibilityNote}>{proof.disclaimerNote}</p>
        {proof.hub && (
          <a href={proof.hub.href} className={styles.hubLink}>{proof.hub.label}</a>
        )}
      </section>

      {/* POSSIBILITY */}
      <section className={styles.possibility}>
        <p className={styles.possibilityLead}>{possibility.lead}</p>
        <p className={styles.possibilityBody}>{possibility.body}</p>
        <p className={styles.possibilityTags}>{possibility.tags.join(' · ')}</p>
      </section>

      {/* ACTION */}
      <section className={styles.cta}>
        <a href={mailtoHref} className={styles.ctaBtn}>{cta.primary}</a>
        <p className={styles.ctaSupport}>
          Reply to my email, or call/text Tom at{' '}
          <a href={`tel:${cta.tel}`} className={styles.ctaTel}>{cta.telDisplay}</a>.
        </p>
      </section>

      <div className={styles.footer}>Zarcone Photography · zarconephotography.com</div>
    </div>
  );
}
