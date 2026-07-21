'use client';

import { useEffect, useRef, useState } from 'react';
import { RESOURCE_CENTER } from '@/lib/govconData';
import { trackGovEvent, GOV_EVENTS } from '@/lib/govconAnalytics';
import styles from './govcon.module.css';

const SUBNAV_HEIGHT = 52;

// The Government Resource Center is the page's structural differentiator
// (see GOVCON-LANDING-PAGE-SPEC.md §1) — a grid of resource cards plus a
// persistent sticky sub-nav that keeps the "documentation portal" framing
// alive for the rest of the scroll, not just at the top of the page.
export default function GovResourceCenter() {
  const sentinelRef = useRef(null);
  const [subNavVisible, setSubNavVisible] = useState(false);
  const [activeId, setActiveId] = useState(RESOURCE_CENTER.subNavItems[0]?.id ?? '');

  // Show the sticky sub-nav once the visitor scrolls past the resource
  // grid itself — no point showing a "jump to" bar before there's
  // anything below to jump past.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setSubNavVisible(!entry.isIntersecting),
      { rootMargin: `-${SUBNAV_HEIGHT}px 0px 0px 0px` }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Lightweight active-section tracking for the sub-nav, throttled via
  // requestAnimationFrame rather than one IntersectionObserver per anchor.
  useEffect(() => {
    let ticking = false;
    const ids = [...new Set(RESOURCE_CENTER.subNavItems.map((i) => i.id))];

    function updateActive() {
      ticking = false;
      const probe = SUBNAV_HEIGHT + 24;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - probe <= 0) {
          current = id;
        }
      }
      setActiveId(current);
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateActive);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <section
        id="resource-center"
        className={`${styles.section} ${styles.anchorOffset}`}
        aria-labelledby="resource-center-heading"
      >
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 id="resource-center-heading" className={styles.h2}>
              {RESOURCE_CENTER.headline}
            </h2>
            <p className={styles.lede}>{RESOURCE_CENTER.frame}</p>
          </div>

          <div className={styles.resourceGrid}>
            {RESOURCE_CENTER.items.map((item, i) => (
              <a
                key={`${item.id}-${i}`}
                href={`#${item.id}`}
                className={styles.resourceCard}
                aria-label={`${item.label} — jump to section`}
                onClick={() =>
                  trackGovEvent(GOV_EVENTS.RESOURCE_CARD_CLICK, { resource: item.label, targetId: item.id })
                }
              >
                <span className={styles.resourceIndex}>{String(i + 1).padStart(2, '0')}</span>
                <p className={styles.resourceLabel}>{item.label}</p>
                <p className={styles.resourceDescription}>{item.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Sentinel marks the boundary after which the sticky sub-nav appears */}
      <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />

      <nav
        className={`${styles.subNav} ${subNavVisible ? styles.visible : ''}`}
        aria-label="Government Resource Center quick navigation"
      >
        <div className={styles.subNavInner}>
          {RESOURCE_CENTER.subNavItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={styles.subNavLink}
              style={
                activeId === item.id
                  ? { color: 'var(--gov-navy, #13233d)', borderBottomColor: 'var(--gov-navy, #13233d)' }
                  : undefined
              }
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
