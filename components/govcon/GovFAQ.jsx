'use client';

import { useState } from 'react';
import { FAQ_GROUPS } from '@/lib/govconData';
import { trackGovEvent, GOV_EVENTS } from '@/lib/govconAnalytics';
import styles from './govcon.module.css';

function PlusIcon({ open }) {
  return (
    <svg className={`${styles.faqIcon} ${open ? styles.open : ''}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 2v12M2 8h12" strokeLinecap="round" />
    </svg>
  );
}

export default function GovFAQ() {
  const [openKey, setOpenKey] = useState(null);

  function toggle(key, question) {
    const next = openKey === key ? null : key;
    setOpenKey(next);
    if (next) {
      trackGovEvent(GOV_EVENTS.FAQ_EXPAND, { question });
    }
  }

  return (
    <section id="faq" className={`${styles.section} ${styles.anchorOffset}`} aria-labelledby="faq-heading">
      <div className={`${styles.container} ${styles.narrow}`}>
        <div className={styles.sectionHead}>
          <h2 id="faq-heading" className={styles.h2}>Frequently Asked Questions</h2>
        </div>

        {FAQ_GROUPS.map((group) => {
          const groupSlug = group.group.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return (
          <div key={group.group} className={styles.faqGroup}>
            <p className={styles.faqGroupTitle}>{group.group}</p>
            {group.items.map((item, i) => {
              const key = `${groupSlug}-${i}`;
              const open = openKey === key;
              const panelId = `faq-panel-${key}`;
              const buttonId = `faq-button-${key}`;
              return (
                <div key={key} className={styles.faqItem}>
                  <button
                    id={buttonId}
                    type="button"
                    className={styles.faqButton}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggle(key, item.q)}
                  >
                    <span>{item.q}</span>
                    <PlusIcon open={open} />
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`${styles.faqPanel} ${open ? styles.open : ''}`}
                  >
                    <p className={styles.faqAnswer}>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
          );
        })}
      </div>
    </section>
  );
}
