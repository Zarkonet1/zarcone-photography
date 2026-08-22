// Shared BRHS Panther Girls Volleyball Pic-Time gallery list — same pattern
// as lib/footballGalleries.js. Empty until Tom sets up the first gallery
// (Media Day and/or the season opener) — see SITE-CHEATSHEET.md for the
// steps to add a weekly entry once galleries start posting. Leaving this
// empty is expected, not a bug — the volleyball page's Season Tracker and
// gallery-pill row both fall back gracefully when this array is empty.
export const GALLERIES_2026 = [];

// Most recent gallery by event date — powers the "Latest Gallery" stat.
// Returns null if the list is empty. Mirrors lib/footballGalleries.js exactly
// so both pages can share this behavior without importing across sports.
export function getLatestGallery(galleries) {
  if (!galleries || !galleries.length) return null;
  return [...galleries].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
}
