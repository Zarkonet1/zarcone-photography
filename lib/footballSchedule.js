// Shared BRHS Panther Football schedule data — single source of truth.
//
// Lives here (not inline in app/brhs-panther-football/page.jsx) so both the
// football page itself AND components/AnnouncementBar.jsx (which narrows its
// "Upcoming" content to football-only on the football page — Media Day,
// Season Opener / Next Game) can derive the same Record / Next Game / Latest
// Result without duplicating data. Don't hand-edit a second copy anywhere —
// that duplication is exactly what caused the coach-tenure stat to go stale
// before (see CLAUDE.md "Known issues").
//
// 2026 schedule as published by MaxPreps / Big Central Conference (subject to
// change — confirm kickoff times before heading to games).
// TIER 1: `result` is the single source of truth for this season. Leave it
// `null` until the game is played, then set it to { win: true/false, score:
// '21–14' } — Record, Next Game, and Latest Result (in the football page's
// SEASON_TRACKER, and the AnnouncementBar's football-only feed) all derive
// from this array automatically. Don't also hand-edit those; that
// duplication is what goes stale.
export const SCHEDULE_2026 = [
  { date: 'Thu, Aug 27', time: '7:00 PM', opponent: 'at Woodbridge', home: false, result: null },
  // Added 2026-07-30: newly confirmed on MaxPreps as of a Jul 29 update on
  // both BR's own schedule page AND St. Joseph's own schedule page (mutual
  // cross-listing) — this is the same game PJR's team preview had listed as
  // an extra since 2026-07-17, which had gone unconfirmed by MaxPreps/On3
  // every sweep since. On3 hasn't picked it up yet; not held back on that
  // basis since both sides of the MaxPreps listing agree with each other.
  { date: 'Sat, Sep 5', time: '1:00 PM', opponent: 'at St. Joseph (Metuchen)', home: false, result: null },
  { date: 'Thu, Sep 10', time: '6:00 PM', opponent: 'vs Hillsborough', home: true, league: true, result: null },
  { date: 'Fri, Sep 18', time: '6:00 PM', opponent: 'vs Ridge', home: true, league: true, result: null },
  { date: 'Fri, Oct 2', time: '6:00 PM', opponent: 'vs Hunterdon Central', home: true, result: null },
  { date: 'Fri, Oct 9', time: '7:00 PM', opponent: 'at Union', home: false, result: null },
  { date: 'Fri, Oct 16', time: '7:00 PM', opponent: 'at Phillipsburg', home: false, league: true, result: null },
];
