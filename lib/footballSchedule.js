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
  { date: 'Thu, Sep 10', time: '6:00 PM', opponent: 'vs Hillsborough', home: true, league: true, result: null },
  { date: 'Fri, Sep 18', time: '6:00 PM', opponent: 'vs Ridge', home: true, league: true, result: null },
  { date: 'Fri, Oct 2', time: '6:00 PM', opponent: 'vs Hunterdon Central', home: true, result: null },
  { date: 'Fri, Oct 9', time: '7:00 PM', opponent: 'at Union', home: false, result: null },
  { date: 'Fri, Oct 16', time: '7:00 PM', opponent: 'at Phillipsburg', home: false, league: true, result: null },
];
