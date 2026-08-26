// Shared BRHS Panther Girls Volleyball Pic-Time gallery list — same pattern
// as lib/footballGalleries.js. See that file's header comment for the full
// convention (id/label/date/href/photoCount).
//
// First entry added 2026-08-26: the Aug 25 scrimmage vs. Piscataway. Per Tom,
// this was a PRE-SEASON SCRIMMAGE, not the counted regular-season opener —
// worth noting because `lib/volleyballSchedule.js`'s SCHEDULE_2026 currently
// lists "Tue, Aug 25 ... at Piscataway" as a normal schedule row with no
// scrimmage flag. `result` is still `null` there (MaxPreps hasn't posted a
// score either), so nothing is displaying wrong yet, but if a real score
// ever gets entered on that row it would incorrectly count toward the
// season record. Flagged for Tom — not resolved here, since it's a schema/
// display decision (add a `scrimmage: true` flag? drop the row? leave it?),
// not a pure factual fix.
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
