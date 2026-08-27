// Shared Mahwah Thunderbirds Football schedule data — single source of truth
// for the Mahwah Football Hub concept build (app/mahwah-thunderbirds-football).
// Same pattern as lib/footballSchedule.js (BRHS) — see that file's header
// comment for the full rationale on why `result` is the single source of
// truth Record/Next Game/Latest Result all derive from.
//
// SOURCED 2026-08-27, via MaxPreps' own Mahwah schedule page (the only
// source with a complete, internally-consistent 2026 slate — see note
// below on the conflicting/stale On3 listing from the original Prospect
// Trigger research on 2026-08-14):
//   https://www.maxpreps.com/nj/mahwah/mahwah-thunderbirds/football/schedule/
// Page metadata: "League: Super - American Red · Record: 0-0", last updated
// August 26, 2026 — one day before this file was built. All 8 games show
// "Upcoming" with no scores posted; nothing has been played yet.
//
// IMPORTANT — supersedes the Trigger data: lib/prospectTriggers/data/
// mahwah-football.js (built 2026-08-14) states the 2026 opener is "August
// 28 — at Morristown-Beard," sourced to a since-superseded MaxPreps
// snapshot. The current MaxPreps schedule (this file, fetched 2026-08-27)
// shows NO Morristown-Beard game anywhere on the slate — the real opener is
// Thu, Sep 3 at home vs Pequannock. This is very likely a schedule change
// made between 8/14 and 8/26 (not a research error) but was not
// independently re-confirmed against a second source before this file was
// built, given how recently the MaxPreps page itself was updated (8/26) and
// the lack of any second public source with a full slate. Flagged to Tom —
// the Trigger page's "2026 season opens August 28 — at Morristown-Beard"
// line is now stale and should be corrected there too before that page is
// shown to anyone; out of scope for this file, which only feeds the Hub.
//
// League flag: MaxPreps' page marks league games with an asterisk but the
// fetched page text didn't preserve which rows carried one. Rather than
// guess, `league: true` here is derived independently from each member's
// own MaxPreps schedule page (all listing "League: Super - American Red",
// cross-checked 2026-08-27): Dumont, Lakeland, Mahwah, Ramsey, Westwood.
// Of Mahwah's 8 opponents, four are American Red members — Dumont,
// Lakeland Regional, Ramsey, Westwood — and are flagged `league: true`
// below; the other four (Pequannock, New Milford, Hanover Park, Fair Lawn)
// are Super Football Conference crossover games from other divisions, not
// flagged. Same division-membership-inference method BRHS's own
// footballSchedule.js/page.jsx already uses for its non-schedule-derived
// standings rows — see OTHER_STANDINGS in that file.
//
// Corrected 2026-08-27 (per Tom, cross-checked against MaxPreps): the
// division is Dumont / Lakeland / Mahwah / Ramsey / Westwood, not the
// earlier Dumont / Pascack Hills / Ramsey / Ridgefield Park / Westwood
// Regional list this file originally shipped with — that also means the
// Sep 18 Lakeland Regional game is a league game and is now flagged
// accordingly below.
//
// Home field: Mahwah's own stadium/turf name was not verified via public
// search (searched directly, no result) — home games are listed simply as
// "Mahwah High School, Mahwah, NJ" rather than guessing a stadium name. Away
// venues follow BRHS's own convention exactly: 'TBD — confirm venue
// (Opponent HS)' rather than guessing.
const HOME_FIELD = 'Mahwah High School, Mahwah, NJ';

export const MAHWAH_SCHEDULE_2026 = [
  { date: 'Thu, Sep 3', time: '7:00 PM', opponent: 'vs Pequannock', home: true, location: HOME_FIELD, result: null },
  { date: 'Thu, Sep 10', time: '6:00 PM', opponent: 'at Dumont', home: false, league: true, location: 'TBD — confirm venue (Dumont HS)', result: null },
  { date: 'Fri, Sep 18', time: '7:00 PM', opponent: 'vs Lakeland Regional', home: true, league: true, location: HOME_FIELD, result: null },
  { date: 'Fri, Sep 25', time: '7:00 PM', opponent: 'vs New Milford', home: true, location: HOME_FIELD, result: null },
  { date: 'Fri, Oct 2', time: '6:30 PM', opponent: 'at Ramsey', home: false, league: true, location: 'TBD — confirm venue (Ramsey HS)', result: null },
  { date: 'Fri, Oct 9', time: '7:00 PM', opponent: 'vs Hanover Park', home: true, location: HOME_FIELD, result: null },
  { date: 'Fri, Oct 16', time: '6:30 PM', opponent: 'at Fair Lawn', home: false, location: 'TBD — confirm venue (Fair Lawn HS)', result: null },
  { date: 'Fri, Oct 23', time: '7:00 PM', opponent: 'at Westwood', home: false, league: true, location: 'TBD — confirm venue (Westwood HS)', result: null },
];
