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
  // FINAL 2026-08-28 (confirmed via CJ Sports Radio recap, published 2026-08-29T00:48:57Z —
  // https://cjsportsradio.com/2026/08/28/sophomore-qb-baxter-shines-as-no-6-bridgewater-raritan-opens-26-with-28-7-win-at-no-8-woodbridge/):
  // BR won 28-7. Sophomore J.B. Baxter (not senior Evan Woodring) won the starting QB job —
  // 13/20, 253 yds, 3 TD, 1 INT, including a 48-yd TD pass to Woodring (moved to a receiving
  // role). Jahmier Black: 118 rush yds, 1 TD (3-yd, 3rd quarter). BR ranked No. 6, Woodbridge
  // No. 8. Team totaled 448 yards of offense.
  // Additional coverage found 2026-08-29 (Tom's call: publish the additional sources rather
  // than pick a winner on this detail) — TAPinto's Woodbridge/Carteret edition and
  // MyCentralJersey (Andy Mendlowitz) both independently put the Woodring TD pass at 47 yds,
  // not 48, and agree with each other on the fuller scoring sequence: Woodbridge tied it 7-7
  // in the 2nd quarter on a Dylan Stephen 28-yd TD run before Baxter's 64-yd TD pass to Jack
  // Winne put BR ahead for good; Baxter's 3rd TD pass went 30 yds to Jasper Schwamberger.
  // CJSR's 48-yd figure is left as-is above rather than "corrected" — three outlets, minor
  // disagreement on one play's exact yardage, not resolved. Both new articles added to
  // ARTICLES in page.jsx so readers can see all the coverage directly. Not rendered anywhere
  // on the live site itself — this comment is sourcing detail only.
  { date: 'Fri, Aug 28', time: '6:00 PM', opponent: 'at Woodbridge', home: false, location: 'Woodbridge HS', result: { win: true, score: '28-7', usScore: 28, themScore: 7 }, postponedFrom: 'Thu, Aug 27' },
  // Added 2026-07-30: newly confirmed on MaxPreps as of a Jul 29 update on
  // both BR's own schedule page AND St. Joseph's own schedule page (mutual
  // cross-listing) — this is the same game PJR's team preview had listed as
  // an extra since 2026-07-17, which had gone unconfirmed by MaxPreps/On3
  // every sweep since. On3 hasn't picked it up yet; not held back on that
  // basis since both sides of the MaxPreps listing agree with each other.
  // Result added 2026-09-05 (2nd sweep run): confirmed L 36-43 via CJ Sports
  // Radio's game recap (published 2026-09-05, high-scoring back-and-forth —
  // BR led 29-28 in the 4th before St. Joseph (No. 2, undefeated in openers
  // under coach Bill Tracy since 2023) answered with 15 unanswered points)
  // and independently corroborated by the MaxPreps box score (PF 36/PA 43).
  // No TAPinto/MyCentralJersey recap had published yet as of this sweep —
  // same-day publish lag, consistent with pattern.
  { date: 'Sat, Sep 5', time: '1:00 PM', opponent: 'at St. Joseph (Metuchen)', home: false, location: 'Brenner Family Field, Metuchen, NJ', result: { win: false, score: '36-43', usScore: 36, themScore: 43 } },
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
  // Result added 2026-09-12 sweep: confirmed W 40-14 via MaxPreps box score/
  // recap (final Bridgewater-Raritan 40, Hillsborough 14, first Big Central -
  // American Silver league game of the season for both) and independently
  // corroborated by SI's Sep 11 NJ final-scores roundup. BR advances to 2-1
  // overall / 1-0 league; Hillsborough drops to 1-2. No press recap (CJSR/
  // TAPinto/MyCentralJersey) had published as of this sweep — same publish
  // lag as prior same-night results — so individual player stats for this
  // game aren't yet reflected in lib/footballStats.js; pick up next sweep.
  { date: 'Fri, Sep 11', time: '4:00 PM', opponent: 'vs Hillsborough', home: true, league: true, location: HOME_FIELD, result: { win: true, score: '40-14', usScore: 40, themScore: 14 } },
  // Result added 2026-09-18 sweep (2nd run, post-game): confirmed W 7-3 via
  // MaxPreps box score/recap and independently corroborated by CJ Sports
  // Radio's full game recap (published 2026-09-19T02:26 GMT, "Panthers'
  // pick up long-awaited win over Red Devils" — BR's first win over Ridge
  // since 2015, snapping an 8-game Ridge win streak dating to 2018).
  // Jahmier Black scored the game's only TD (7-yd run, 1:19 left in the
  // 2nd); Ridge's only points were a 29-yd Herik Villalba-Ozuna field goal
  // with 8:55 left in the 4th; Jack Winne's 2nd INT of the game sealed it.
  // BR advances to 3-1 overall / 2-0 league; Ridge drops to 2-1 overall / 0-1 league.
  { date: 'Fri, Sep 18', time: '6:00 PM', opponent: 'vs Ridge', home: true, league: true, location: HOME_FIELD, result: { win: true, score: '7-3', usScore: 7, themScore: 3 } },
  // Added 2026-08-01: newly confirmed on MaxPreps (BR's own schedule page
  // jumped from 7 to 9 games as of the Aug 1 update) — same mutual
  // cross-listing corroboration technique used for St. Joseph on 2026-07-30:
  // Westfield's own MaxPreps page independently lists this identical game
  // (9/26, 1:00 PM @ Bridgewater-Raritan). Not a league/division opponent
  // (Westfield plays Big Central American Gold, not BR's American Silver),
  // so no league: true flag.
  // CORRECTED 2026-09-23 sweep: home -> AWAY, at Gary Kehler Stadium,
  // Westfield. Conflict first flagged 2026-09-21 (Todoist 6hXrwfW86554FJ29):
  // Evan Fromberg's Sep 21 family email (Tier 1a, direct program
  // correspondence) says "Saturday at Westfield 1 PM... Gary Kehler stadium
  // at 751 Rahway Ave, Westfield." A second, independent source now agrees:
  // Hi's Eye Sports (hiseyesports.org — Westfield HS's student sports outlet)
  // lists this game's venue as Gary Kehler Stadium on both its 2026-27
  // football schedule table and the game's own event page. Two more
  // independent sources, same sweep: NJRecordBook's BR team page lists it
  // "Sat Sep 26 · Westfield · Away · 1 PM", and CJ Sports Radio's Week 4
  // Top Ten (2026-09-21) says the Panthers "visit Westfield for a 1:00 kick
  // Saturday afternoon." 4 sources vs. MaxPreps. That clears the
  // two-independent-source bar and matches the Woodbridge-kickoff precedent
  // (direct program correspondence beat lagging aggregators). BR's and
  // Westfield's own MaxPreps pages both STILL show BR hosting as of
  // 2026-09-23 (BR's last updated Sep 21) — treated as stale, same as
  // Woodbridge's 7pm listing was. Re-check MaxPreps next sweep.
  { date: 'Sat, Sep 26', time: '1:00 PM', opponent: 'at Westfield', home: false, location: 'Gary Kehler Stadium, 751 Rahway Ave, Westfield, NJ', result: null },
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
  // CORRECTED 2026-09-23 sweep: away -> HOME. The Aug 1 note above read
  // Watchung Hills' listing as "BR travels," but as of today two
  // independent sources both say BR hosts: (1) BR's own MaxPreps schedule
  // ("10/23 7:00pm vs Watchung Hills Regional") and the shared MaxPreps
  // game page ("WHRHS Varsity Football @ Bridgewater-Raritan... Game
  // Details: Bridgewater-Raritan High School," GoFan tickets sold by BR);
  // (2) NJRecordBook's BR team page ("Fri Oct 23 · Watchung Hills · Home").
  // KICKOFF DISCREPANCY, flagged not resolved: MaxPreps says 7:00 PM, NJRB
  // says 6 PM. Kept MaxPreps' 7:00 PM (unchanged from before); re-check
  // both next sweep and confirm with Fromberg closer to the date.
  { date: 'Fri, Oct 23', time: '7:00 PM', opponent: 'vs Watchung Hills Regional', home: true, location: HOME_FIELD, result: null },
];
