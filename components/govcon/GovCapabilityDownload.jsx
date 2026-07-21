'use client';

import { CAPABILITY_STATEMENT } from '@/lib/govconData';
import { trackGovEvent, GOV_EVENTS } from '@/lib/govconAnalytics';
import styles from './govcon.module.css';

export default function GovCapabilityDownload() {
  return (
    <section
      id="capability-statement"
      className={`${styles.downloadBand} ${styles.anchorOffset}`}
      aria-labelledby="capability-statement-heading"
    >
      <div className={`${styles.container} ${styles.downloadInner}`}>
        <div className={styles.downloadText}>
          <h2 id="capability-statement-heading" className={styles.h2}>
            {CAPABILITY_STATEMENT.headline}
          </h2>
          <p>{CAPABILITY_STATEMENT.body}</p>
        </div>
        <a
          href={CAPABILITY_STATEMENT.fileHref}
          className={styles.downloadCta}
          download
          onClick={() => trackGovEvent(GOV_EVENTS.CAPABILITY_STATEMENT_DOWNLOAD, { location: 'download-band' })}
        >
          {CAPABILITY_STATEMENT.ctaLabel}
        </a>
      </div>
    </section>
  );
}
