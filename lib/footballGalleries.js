// Shared BRHS Panther Football Pic-Time gallery list — single source of truth.
//
// Tom runs one Pic-Time gallery per week (Media Day, then one per game)
// rather than a single season gallery with scenes — per-game pricing and
// expiration deadlines aren't possible inside Pic-Time scenes, only at the
// gallery level, so separate galleries were the deliberate choice
// (decided 2026-08-06).
//
// To add a new week: append an entry below with a real `href`. `label` and
// `href` drive the season-gallery pill row AND the "Latest Gallery" stat on
// the football page (via getLatestGallery) — nothing else needs to be
// touched. Give each entry a stable `id` if page copy needs to link to that
// specific gallery by name (see MEDIA_DAY_GALLERY in page.jsx) rather than
// "whatever's newest," since newest will change every week during the
// season.
//
// `photoCount` added 2026-08-25 for the dashboard rebuild's dynamic hero
// ("WOODBRIDGE GAME GALLERY — 147 Photos"). Pic-Time doesn't expose a count
// via this hardcoded href, so it's manual — pull the real number from the
// gallery itself after uploading and set it here. Left `null` (renders
// without a count) until filled in; don't guess a number.
//
// The 2025–26 season gallery (SmugMug) is a separate, older archive and is
// intentionally NOT part of this list — it's hardcoded as SEASON_GALLERY_URL
// directly in page.jsx and stays there per Tom (2026-08-06): "SmugMug link
// stays...it was last season."
export const GALLERIES_2026 = [
  {
    id: 'media-day',
    label: 'Media Day',
    date: '2026-07-29', // event date, not gallery-creation date — used for sort order below
    href: 'https://galleries.zarconephotography.com/client/2026-brhs-football-media-day',
    photoCount: null, // TBD — fill in real count from the gallery
  },
  {
    id: 'woodbridge',
    label: 'vs. Woodbridge',
    date: '2026-08-28', // season opener, played at Woodbridge HS — see SCHEDULE_2026 in lib/footballSchedule.js
    href: 'https://galleries.zarconephotography.com/client/20260828-brhs-football-v-woodbridge',
    photoCount: null, // TBD — fill in real count from the gallery
  },
];

// Most recent gallery by event date — powers the "Latest Gallery" stat.
// Returns null if the list is ever empty (shouldn't happen once Media Day
// is added, but callers should still guard for it — see SEASON_TRACKER's
// fallback to SEASON_GALLERY_URL in page.jsx).
export function getLatestGallery(galleries) {
  if (!galleries || !galleries.length) return null;
  return [...galleries].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
}
