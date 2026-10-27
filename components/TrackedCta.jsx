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
export default function TrackedCta({ href, location, label, className, style, target, children }) {
  const report = () => {
    try {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        try {
          // Remember the last CTA so the thank-you page can credit the lead to it.
          const cta = JSON.stringify({ location, label, page: window.location.pathname, ts: Date.now() });
          window.sessionStorage.setItem('zp_last_cta', cta);
          // A form opened in a new tab doesn't inherit sessionStorage, so the
          // thank-you page in that tab falls back to this copy.
          window.localStorage.setItem('zp_last_cta', cta);
        } catch (e) { /* storage blocked: attribution simply falls back to 'unknown' */ }
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

  if (/^https?:\/\//.test(href)) {
    return (
      <a
        href={href}
        className={className}
        style={style}
        onClick={report}
        target={target}
        rel={target === '_blank' ? 'noopener' : undefined}
      >
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
