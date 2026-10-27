// BRHS Panther Girls Varsity Basketball — 2026-27 schedule, single source of
// truth. Same pattern as lib/footballSchedule.js / lib/volleyballSchedule.js:
// the hub page (app/brhs-panther-girls-basketball/page.jsx), the
// AnnouncementBar and the team-stat helpers (lib/teamStats.js) all derive
// Record / Next Game / Latest Result / points per game from this one array.
//
// WHO UPDATES THIS: the daily `brhs-daily-source-sweep` scheduled task, using
// BASKETBALL-SOURCES.md (project root). No coach, player or parent is asked to
// enter anything. Every row must come from a public source (MaxPreps, NJ
// Record Book, BRRSD Athletics) — never invented. tests/girlsBasketball.test.mjs
// validates the shape of every row, so a malformed sweep edit fails `npm test`
// (and therefore ship-website.command) instead of reaching production.
//
// STATUS AS OF 2026-10-27: no 2026-27 schedule is published anywhere public.
// MaxPreps' girls basketball page still shows 2025-26 (last updated Jan 26,
// 2026); NJ Record Book and BRRSD Athletics show no 2026-27 games. Last
// season BRRSD published its preseason preview on Dec 10, 2025, and the opener
// was Dec 16, so expect the 2026-27 schedule in late November or early
// December. Until then this array stays EMPTY and the page shows its
// "schedule coming soon" states. Do not seed it from last season.
//
// ROW SHAPE (dates carry no year; lib/teamSchedule.js resolves the closest
// year, which handles the Dec -> Mar New Year's crossing):
//   {
//     date: 'Wed, Dec 16',            // required, 'Ddd, Mmm D'
//     time: '5:30 PM',                // required ('TBA' if unpublished)
//     opponent: 'vs Pingry',          // required, prefix 'vs' (home) or 'at' (away)
//     home: true,                     // required boolean
//     location: 'Vaughn Stapleton Gymnasium, Bridgewater, NJ', // or 'TBD — confirm venue'
//     league: false,                  // Skyland Conference game (MaxPreps '*' flag)
//     status: 'scheduled',            // 'scheduled' | 'postponed' | 'canceled'
//     postponedFrom: null,            // original date string when status was postponed and rescheduled
//     seniorNight: false,             // true only when a public source says so
//     postseason: null,               // e.g. 'Somerset County Tournament — Round 1'
//     scrimmage: false,               // excluded from record/next game
//     result: null,                   // once final: { win: true, score: '57-14', usScore: 57, themScore: 14 }
//     galleryId: null,                // id of the matching lib/girlsBasketballGalleries.js entry
//     source: 'MaxPreps, NJRB',       // where this row was verified
//   }
//
// Home venue: BRRSD Athletics (Jan 2026 SCT recap) names Vaughn Stapleton
// Gymnasium as the home court. Use the constant below for home rows; use
// 'TBD — confirm venue' for away rows unless a source names the gym.
export const HOME_VENUE = 'Vaughn Stapleton Gymnasium, Bridgewater, NJ';

export const SCHEDULE_2026_27 = [];

// Rows that count as games for record/next-game purposes. Canceled games stay
// visible in the full schedule table (struck through) but never count.
export function countedGames(schedule = SCHEDULE_2026_27) {
  return schedule.filter((g) => g.status !== 'canceled');
}
