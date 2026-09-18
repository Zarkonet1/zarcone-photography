// Lightweight analytics helper for the /harvestfest QR landing page.
// Mirrors lib/govconAnalytics.js's pattern: wraps @vercel/analytics'
// track() (already a site dependency) so components fire named events
// without importing/handling the SDK directly, and never lets an
// analytics failure break the page.
//
// Also mirrors every event to GA4 via the sitewide gtag() instance already
// loaded in app/layout.jsx, as a cross-check — NOT as the primary signal.
// There is an open, unresolved GA4 engagement-tracking bug (project memory,
// 2026-09-05: 100% bounce rate / zero engaged sessions sitewide, root cause
// still unconfirmed) that makes GA4's own session-quality metrics
// untrustworthy right now. Vercel Analytics custom events and Microsoft
// Clarity recordings (see the entry-tagging below) are the numbers to read
// for the HarvestFest funnel until that bug is resolved — don't build a
// go/no-go read on GA4 alone.
import { track } from '@vercel/analytics';

export function trackHarvestFestEvent(name, properties = {}) {
  try {
    track(name, properties);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[harvestfest analytics]', name, err);
    }
  }

  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', name, properties);
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[harvestfest analytics/gtag]', name, err);
    }
  }
}

// Named events — centralized so the vocabulary is consistent and
// discoverable in one place, same pattern as lib/govconAnalytics.js.
export const HARVESTFEST_EVENTS = {
  CATEGORY_SELECT: 'hf_category_select',
  GALLERY_LINK_CLICK: 'hf_gallery_link_click',
  ENTRY_FORM_OPEN: 'hf_entry_form_open',
  ENTRY_FORM_SUBMIT_SUCCESS: 'hf_entry_form_submit_success',
  ENTRY_FORM_SUBMIT_ERROR: 'hf_entry_form_submit_error',
  CONTACT_CLICK: 'hf_contact_click',
};

// Tags this session in Microsoft Clarity as HarvestFest QR traffic, so
// recordings/heatmaps for this campaign can be filtered on their own in
// the Clarity dashboard — same mechanism app/layout.jsx already uses for
// entry_referrer/entry_page, scoped here to one custom tag for this route.
export function tagHarvestFestClaritySource() {
  try {
    if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
      window.clarity('set', 'hf_source', 'harvestfest_qr');
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[harvestfest analytics/clarity]', err);
    }
  }
}
