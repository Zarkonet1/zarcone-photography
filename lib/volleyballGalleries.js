// Shared BRHS Panther Girls Volleyball Pic-Time gallery list — same pattern
// as lib/footballGalleries.js. See that file's header comment for the full
// convention (id/label/date/href/photoCount).
//
// First entry added 2026-08-26: the Aug 25 scrimmage vs. Piscataway. Per Tom,
// this was a PRE-SEASON SCRIMMAGE, not the counted regular-season opener.
// RESOLVED same day: `lib/volleyballSchedule.js`'s SCHEDULE_2026 row for
// this game now carries `scrimmage: true`, and `lib/teamSchedule.js`'s
// getRecord/getNextGame/getNextMatch/getLastPlayedGame all skip
// scrimmage-flagged rows — this is what fixed the dashboard's "Next Game"
// hero incorrectly showing the already-played Aug 25 scrimmage instead of
// the real Sep 1 opener at Hillsborough. Gallery entry stays here regardless
// (it's real, dated content), just excluded from record/schedule math.
export const GALLERIES_2026 = [
  {
    id: 'scrimmage-piscataway',
    label: 'Preseason Scrimmage vs. Piscataway',
    date: '2026-08-25', // event date, not gallery-creation date
    href: 'https://galleries.zarconephotography.com/client/20250825-brhs-volleyball-v-piscataway',
    photoCount: null, // TBD — fill in real count once known
  },
];

// Most recent gallery by event date — powers the "Latest Gallery" stat.
// Returns null if the list is empty. Mirrors lib/footballGalleries.js exactly
// so both pages can share this behavior without importing across sports.
export function getLatestGallery(galleries) {
  if (!galleries || !galleries.length) return null;
  return [...galleries].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
}
