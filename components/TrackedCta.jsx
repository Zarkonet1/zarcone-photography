'use client';

import Link from 'next/link';

/**
 * Link/button that reports a GA4 `cta_click` event with the CTA's location on the page.
 * - location: where the CTA sits (e.g. 'hero', 'hero_phone', 'procurement', 'final')
 * - label: stable, human-readable label for reports (does not depend on visible text)
 * Uses the existing global gtag (loaded in app/layout.jsx). Fails silently if gtag is
 * unavailable (ad blockers, consent tools) so it can never block navigation.
 * In GA4, register `cta_location` and `cta_label` as event-scoped custom dimensions
 * to break the event down by location in reports.
 */
export default function TrackedCta({ href, location, label, className, style, children }) {
  const report = () => {
    try {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'cta_click', {
          cta_location: location,
          cta_label: label,
          cta_destination: href,
          page_path: window.location.pathname,
          transport_type: 'beacon',
        });
      }
    } catch (e) {
      /* never block navigation */
    }
  };

  if (href.startsWith('tel:') || href.startsWith('mailto:')) {
    return (
      <a href={href} className={className} style={style} onClick={report}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} style={style} onClick={report}>
      {children}
    </Link>
  );
}
