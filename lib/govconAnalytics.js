// Lightweight analytics helper for the Government Practice page.
// Wraps @vercel/analytics' `track()` (already a site dependency — no new
// package added) so every component can fire a named event without
// importing/handling the analytics SDK directly. Fails silently if
// analytics hasn't loaded (e.g. local dev, ad blockers) so it never
// breaks the page. Swap the implementation here if a different
// analytics provider is added later — components never need to change.
import { track } from '@vercel/analytics';

export function trackGovEvent(name, properties = {}) {
  try {
    track(name, properties);
  } catch (err) {
    // Analytics should never break the page.
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[govcon analytics]', name, err);
    }
  }
}

// Named events used across components/govcon/*. Centralized here so the
// event vocabulary is consistent and discoverable in one place, ready to
// wire into a dashboard once analytics review begins.
export const GOV_EVENTS = {
  CAPABILITY_STATEMENT_DOWNLOAD: 'gov_capability_statement_download',
  QUOTE_REQUEST_SUBMIT: 'gov_quote_request_submit',
  BRIEFING_CLICK: 'gov_briefing_click',
  RESOURCE_CARD_CLICK: 'gov_resource_card_click',
  FAQ_EXPAND: 'gov_faq_expand',
  CONTACT_PHONE_CLICK: 'gov_contact_phone_click',
  CONTACT_EMAIL_CLICK: 'gov_contact_email_click',
  SCROLL_DEPTH: 'gov_scroll_depth',
};
