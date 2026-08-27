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
// '21–14', usScore: 21, themScore: 14 } — Record, Next Game, and Latest
// Result (in the football page's SEASON_TRACKER, and the AnnouncementBar's
// football-only feed) all derive from this array automatically. Don't also
// hand-edit those; that duplication is what goes stale.
//
// `usScore`/`themScore` added 2026-08-25 for the dashboard rebuild's dynamic
// hero (needs BRHS's score and the opponent's score as separate numbers to
// render "BRHS 28 / WOODBRIDGE 17" — the pre-existing `score` string like
// '21-14' can't be split reliably, home/away order isn't consistent in it).
// Keep `score` too — still used by the existing schedule table's Result
// column. Fill both when a result posts.
//
// `location` added same day for the dashboard hero's venue line. Home games
// verified via web search: Bridgewater-Raritan's own field is Basilone
// Memorial Field (Bridgewater, NJ) — matches the existing RESULTS_2025 sectional-final
// copy elsewhere on the page ("Basilone Memorial Field"). Away game venues
// are NOT yet confirmed — placeholder 'TBD — confirm venue' below for each.
// Fill in from BRRSD's Game Sites page (hs.brrsd.org/athletics/game-sites)
// or each opponent's own site before these render on the live dashboard.
const HOME_FIELD = 'Basilone Memorial Field, Bridgewater, NJ';

export const SCHEDULE_2026 = [
  // Corrected 2026-08-13: had shown 7:00 PM since the game was first added,
  // matching all 3 public schedule sources (BR's own MaxPreps, Woodbridge's
  // own MaxPreps, On3) — flagged as a discrepancy 2026-08-09 when Evan
  // Fromberg's (BRHS Football Asst. Coach/Director of Ops) Aug 8 email to
  // football families stated 6 PM. Held at 7 PM for several sweeps (3-vs-1
  // against the email) pending direct confirmation. Tom confirmed directly
  // with Fromberg on 2026-08-13: both Fromberg and Head Coach D.J. Catalano
  // say 6 PM — this direct program correspondence outranks the lagging
  // public aggregators. Corrected to 6:00 PM.
  // POSTPONED 2026-08-27: Evan Fromberg emailed football families at 11:46 AM
  // ET ("BRHS Football schedule change- please share..") that the varsity
  // opener moved from tonight (Thu 8/27) to tomorrow, Fri 8/28, 6 PM, same
  // site (Woodbridge HS) — weather. Direct Tier 1a program correspondence,
  // no second source needed. Same email also moved freshman (10 AM) and JV
  // (~12 PM, following freshman) to Monday 8/31 on the "1000s field" — not
  // reflected here since this array only tracks the varsity schedule.
  //
  // `postponedFrom` drives NextGameHero's temporary "postponed" banner
  // (components/team-dashboard/NextGameHero.jsx) — it only renders on the
  // original date (today, 8/27), self-expires the moment the calendar rolls
  // to 8/28 (no redeploy needed), and is otherwise inert. Safe to leave in
  // place after the game is played; harmless dead data at that point. Remove
  // once next season's schedule replaces this array.
  { date: 'Fri, Aug 28', time: '6:00 PM', opponent: 'at Woodbridge', home: false, location: 'TBD — confirm venue (Woodbridge HS)', result: null, postponedFrom: 'Thu, Aug 27' },
  // Added 2026-07-30: newly confirmed on MaxPreps as of a Jul 29 update on
  // both BR's own schedule page AND St. Joseph's own schedule page (mutual
  // cross-listing) — this is the same game PJR's team preview had listed as
  // an extra since 2026-07-17, which had gone unconfirmed by MaxPreps/On3
  // every sweep since. On3 hasn't picked it up yet; not held back on that
  // basis since both sides of the MaxPreps listing agree with each other.
  { date: 'Sat, Sep 5', time: '1:00 PM', opponent: 'at St. Joseph (Metuchen)', home: false, location: 'TBD — confirm venue (St. Joseph HS, Metuchen)', result: null },
  // Corrected 2026-08-01: this had shown Thu, Sep 10, 6:00 PM since the game
  // was first added, but BR's own MaxPreps page began showing Fri, Sep 11,
  // 4:00 PM starting 2026-07-30 and held there for 3 straight sweeps (flagged
  // as an unresolved anomaly on 07-30 and 07-31, held back each time by a 2-1
  // read against it: Hillsborough's own MaxPreps page, last updated Jul 15 —
  // i.e. BEFORE the change appeared — plus a lagging On3 listing). Today,
  // PJR's team preview (re-fetched in full) independently states "Friday,
  // 9/11, Hillsborough at home, 4 PM" — a second, independent source agreeing
  // with the new MaxPreps date/time. Given PJR has now been vindicated on
  // all 3 of its previously-unconfirmed "extra" games this same sweep (St.
  // Joseph, Westfield, Watchung Hills), and both holdout sources are
  // demonstrably stale/lagging (same pattern as St. Joseph's slow On3
  // pickup), the weight of evidence flipped — corrected to Sep 11, 4:00 PM.
  { date: 'Fri, Sep 11', time: '4:00 PM', opponent: 'vs Hillsborough', home: true, league: true, location: HOME_FIELD, result: null },
  { date: 'Fri, Sep 18', time: '6:00 PM', opponent: 'vs Ridge', home: true, league: true, location: HOME_FIELD, result: null },
  // Added 2026-08-01: newly confirmed on MaxPreps (BR's own schedule page
  // jumped from 7 to 9 games as of the Aug 1 update) — same mutual
  // cross-listing corroboration technique used for St. Joseph on 2026-07-30:
  // Westfield's own MaxPreps page independently lists this identical game
  // (9/26, 1:00 PM @ Bridgewater-Raritan). Not a league/division opponent
  // (Westfield plays Big Central American Gold, not BR's American Silver),
  // so no league: true flag.
  { date: 'Sat, Sep 26', time: '1:00 PM', opponent: 'vs Westfield', home: true, location: HOME_FIELD, result: null },
  { date: 'Fri, Oct 2', time: '6:00 PM', opponent: 'vs Hunterdon Central', home: true, location: HOME_FIELD, result: null },
  { date: 'Fri, Oct 9', time: '7:00 PM', opponent: 'at Union', home: false, location: 'TBD — confirm venue (Union HS)', result: null },
  { date: 'Fri, Oct 16', time: '7:00 PM', opponent: 'at Phillipsburg', home: false, league: true, location: 'TBD — confirm venue (Phillipsburg HS)', result: null },
  // Added 2026-08-01: same corroboration as Westfield above — Watchung Hills
  // Regional's own MaxPreps page independently lists this identical game
  // (10/23, 7:00 PM vs Bridgewater-Raritan, i.e. BR travels). Watchung Hills
  // plays Big Central Liberty Silver, not BR's American Silver — no league
  // flag. This is the last of the 3 "extra" games PJR's team preview had
  // predicted since 2026-07-17 (St. Joseph, Westfield, Watchung Hills) —
  // all 3 are now independently confirmed via MaxPreps, closing out a
  // discrepancy tracked across 15+ sweeps.
  { date: 'Fri, Oct 23', time: '7:00 PM', opponent: 'at Watchung Hills Regional', home: false, location: 'TBD — confirm venue (Watchung Hills Regional HS)', result: null },
];
