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
// all derive from this array automatically, same as football.
export const SCHEDULE_2026 = [
  { date: 'Tue, Aug 25', time: '10:00 AM', opponent: 'at Piscataway', home: false, result: null },
  { date: 'Tue, Sep 1', time: '5:30 PM', opponent: 'at Hillsborough', home: false, league: true, result: null },
  { date: 'Thu, Sep 3', time: '5:30 PM', opponent: 'vs North Hunterdon', home: true, league: true, result: null },
  { date: 'Sat, Sep 5', time: '9:00 AM', opponent: 'vs Old Bridge', home: true, result: null },
  { date: 'Sat, Sep 5', time: '12:00 PM', opponent: 'vs Jefferson Township', home: true, result: null },
  { date: 'Tue, Sep 8', time: '5:30 PM', opponent: 'vs Mount St. Mary Academy', home: true, result: null },
  { date: 'Thu, Sep 10', time: '4:30 PM', opponent: 'at Rutgers Prep', home: false, result: null },
  { date: 'Tue, Sep 15', time: '5:30 PM', opponent: 'vs Hunterdon Central', home: true, league: true, result: null },
  { date: 'Wed, Sep 16', time: '5:30 PM', opponent: 'at Delaware Valley', home: false, result: null },
  { date: 'Thu, Sep 17', time: '4:00 PM', opponent: 'vs Roxbury', home: true, result: null },
  { date: 'Fri, Sep 18', time: '5:30 PM', opponent: 'vs Hillsborough', home: true, league: true, result: null },
  { date: 'Tue, Sep 29', time: '4:00 PM', opponent: 'vs Rutgers Prep', home: true, result: null },
  { date: 'Wed, Sep 30', time: 'TBA', opponent: 'vs Governor Livingston', home: true, result: null },
  { date: 'Thu, Oct 1', time: '4:00 PM', opponent: 'vs Sparta', home: true, result: null },
  { date: 'Fri, Oct 2', time: '4:00 PM', opponent: 'vs Hopewell Valley Central', home: true, result: null },
  { date: 'Tue, Oct 6', time: '5:30 PM', opponent: 'at Hunterdon Central', home: false, league: true, result: null },
  { date: 'Wed, Oct 7', time: '4:00 PM', opponent: 'vs Colonia', home: true, result: null },
  { date: 'Fri, Oct 9', time: '5:30 PM', opponent: 'at Montgomery', home: false, result: null },
  { date: 'Tue, Oct 13', time: '4:00 PM', opponent: 'at Mount St. Mary Academy', home: false, result: null },
  { date: 'Tue, Oct 13', time: '4:00 PM', opponent: 'at Union Catholic', home: false, result: null },
  { date: 'Wed, Oct 14', time: '4:00 PM', opponent: 'vs Piscataway', home: true, result: null },
];
