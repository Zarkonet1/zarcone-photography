// BRHS Panther Girls Basketball — Pic-Time game galleries, 2026-27.
// Same convention as lib/footballGalleries.js / lib/volleyballGalleries.js:
//
//   {
//     id: 'pingry',                       // short slug, unique
//     label: 'vs. Pingry',                // shown on the gallery pills
//     date: '2026-12-16',                 // EVENT date (ISO), not upload date
//     href: 'https://galleries.zarconephotography.com/client/20261216-brhs-girls-basketball-vs-pingry',
//     photoCount: 120,                    // optional — omit until Tom confirms
//     kind: 'game',                       // 'game' | 'senior-night' | 'team' | 'media-day'
//   }
//
// ADDING A GALLERY: publish it in Pic-Time, copy the client URL, add one entry
// below. The hub's "Latest Gallery" hero state, gallery pills, Senior Night
// card and floating "View Latest Photos" button all update from this array.
// Never add a URL that doesn't exist yet — tests/girlsBasketball.test.mjs
// requires every href to be a galleries.zarconephotography.com client link.
//
// Empty as of 2026-10-27: no 2026-27 games have been played or photographed.
export const GALLERIES_2026_27 = [];

export function getLatestGallery(galleries) {
  if (!galleries || !galleries.length) return null;
  return [...galleries].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
}
