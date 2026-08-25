// Shared BRHS Panther Girls Volleyball schedule data — single source of truth,
// same pattern as lib/footballSchedule.js. Lives here (not inline in
// app/brhs-panther-volleyball/page.jsx) so both the volleyball page AND
// components/AnnouncementBar.jsx (team-page-specific "Upcoming" banner) can
// derive the same Record / Next Match / Latest Result without duplicating data.
//
// 2026 schedule as published on MaxPreps (fetched 2026-08-22 — confirm dates
// close to each match; high school schedules shift). Matches marked `league:
// true` are Skyland Conference opponents per MaxPreps' own "*" flag (Hillsborough,
// North Hunterdon, Hunterdon Central) — BRHS Girls Volleyball plays in the
// Skyland Conference (confirmed via a Sept 2025 TAPinto match recap citing a
// "1-1 Skyland Conference" record), unlike football, which plays Big Central.
// Don't assume the two team pages share a conference.
//
// TIER 1: `result` is the single source of truth for this season. Leave it
// `null` until the match is played, then set it to { win: true/false, score:
// '2-0' } (or '3-1' for a 5-set match) — Record, Next Match, and Latest Result
// all derive from this array automatically, same as football. Once results
// start posting, also set `usScore`/`themScore` alongside `score` (e.g.
// `result: { win: true, score: '2-0', usScore: 2, themScore: 0 }`) — the
// dashboard hero's Final state reads the split fields, same convention as
// football's SCHEDULE_2026.
//
// `location` added 2026-08-25 for the dashboard rebuild's NextGameHero,
// which needs a venue string per game the way football's does. Home venue
// verified via a real BRRSD Athletics article (brrsd.org/o/brrhs/article/2409792,
// Sept 10, 2025), which names "Vaughn Stapleton Gymnasium" directly in its
// own text describing the Sept 9, 2025 Hillsborough home opener — not
// guessed. Away venues use the same honest 'TBD — confirm venue' placeholder
// pattern as football rather than inventing gym names.
const HOME_VENUE = 'Vaughn Stapleton Gymnasium, Bridgewater, NJ';

export const SCHEDULE_2026 = [
  { date: 'Tue, Aug 25', time: '10:00 AM', opponent: 'at Piscataway', home: false, location: 'TBD — confirm venue (Piscataway)', result: null },
  { date: 'Tue, Sep 1', time: '5:30 PM', opponent: 'at Hillsborough', home: false, league: true, location: 'TBD — confirm venue (Hillsborough)', result: null },
  { date: 'Thu, Sep 3', time: '5:30 PM', opponent: 'vs North Hunterdon', home: true, league: true, location: HOME_VENUE, result: null },
  { date: 'Sat, Sep 5', time: '9:00 AM', opponent: 'vs Old Bridge', home: true, location: HOME_VENUE, result: null },
  { date: 'Sat, Sep 5', time: '12:00 PM', opponent: 'vs Jefferson Township', home: true, location: HOME_VENUE, result: null },
  { date: 'Tue, Sep 8', time: '5:30 PM', opponent: 'vs Mount St. Mary Academy', home: true, location: HOME_VENUE, result: null },
  { date: 'Thu, Sep 10', time: '4:30 PM', opponent: 'at Rutgers Prep', home: false, location: 'TBD — confirm venue (Rutgers Prep)', result: null },
  { date: 'Tue, Sep 15', time: '5:30 PM', opponent: 'vs Hunterdon Central', home: true, league: true, location: HOME_VENUE, result: null },
  { date: 'Wed, Sep 16', time: '5:30 PM', opponent: 'at Delaware Valley', home: false, location: 'TBD — confirm venue (Delaware Valley)', result: null },
  { date: 'Thu, Sep 17', time: '4:00 PM', opponent: 'vs Roxbury', home: true, location: HOME_VENUE, result: null },
  { date: 'Fri, Sep 18', time: '5:30 PM', opponent: 'vs Hillsborough', home: true, league: true, location: HOME_VENUE, result: null },
  { date: 'Tue, Sep 29', time: '4:00 PM', opponent: 'vs Rutgers Prep', home: true, location: HOME_VENUE, result: null },
  { date: 'Wed, Sep 30', time: 'TBA', opponent: 'vs Governor Livingston', home: true, location: HOME_VENUE, result: null },
  { date: 'Thu, Oct 1', time: '4:00 PM', opponent: 'vs Sparta', home: true, location: HOME_VENUE, result: null },
  { date: 'Fri, Oct 2', time: '4:00 PM', opponent: 'vs Hopewell Valley Central', home: true, location: HOME_VENUE, result: null },
  { date: 'Tue, Oct 6', time: '5:30 PM', opponent: 'at Hunterdon Central', home: false, league: true, location: 'TBD — confirm venue (Hunterdon Central)', result: null },
  { date: 'Wed, Oct 7', time: '4:00 PM', opponent: 'vs Colonia', home: true, location: HOME_VENUE, result: null },
  { date: 'Fri, Oct 9', time: '5:30 PM', opponent: 'at Montgomery', home: false, location: 'TBD — confirm venue (Montgomery)', result: null },
  { date: 'Tue, Oct 13', time: '4:00 PM', opponent: 'at Mount St. Mary Academy', home: false, location: 'TBD — confirm venue (Mount St. Mary Academy)', result: null },
  { date: 'Tue, Oct 13', time: '4:00 PM', opponent: 'at Union Catholic', home: false, location: 'TBD — confirm venue (Union Catholic)', result: null },
  { date: 'Wed, Oct 14', time: '4:00 PM', opponent: 'vs Piscataway', home: true, location: HOME_VENUE, result: null },
];
