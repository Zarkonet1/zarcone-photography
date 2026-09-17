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
  // Confirmed by Tom (2026-08-26): this was a PRESEASON SCRIMMAGE, not a
  // counted regular-season match — flagged `scrimmage: true` so
  // getNextGame/getRecord/etc. (lib/teamSchedule.js) skip it. Without this
  // flag it stayed stuck as "Next Game" on the dashboard through Aug 26,
  // since those helpers only checked for a missing result, never whether
  // the date had already passed. Kept in the array (not deleted) since the
  // gallery from this scrimmage is real, dated content — just excluded from
  // record/next-game/latest-result math.
  { date: 'Tue, Aug 25', time: '10:00 AM', opponent: 'at Piscataway', home: false, location: 'TBD — confirm venue (Piscataway)', result: null, scrimmage: true },
  // Result added 2026-09-04 sweep: confirmed via MaxPreps box score
  // (BR won the away conference match 2-1) — genuinely unreported for 3
  // days after the match, closing out the "still unreported" note tracked
  // across the 09-01/09-02/09-03 sweep entries.
  { date: 'Tue, Sep 1', time: '5:30 PM', opponent: 'at Hillsborough', home: false, league: true, location: 'TBD — confirm venue (Hillsborough)', result: { win: true, score: '2-1', usScore: 2, themScore: 1 } },
  // Added 2026-08-27 sweep: missing from this array since it was first built
  // (2026-08-22) despite being on MaxPreps the whole time (BR's own schedule
  // page shows "Schedule last updated on Aug 18, 2026" — predates the array).
  // Confirmed via the same mutual cross-listing technique used for football's
  // Westfield addition: Westfield's own MaxPreps volleyball page independently
  // lists this identical match ("Wed, 9/2 vs Bridgewater-Raritan 4:00pm").
  // Not a Skyland Conference opponent (Westfield plays Union County/Watchung
  // Conference, not Skyland) — no league flag, same pattern as football's
  // non-league Westfield/Watchung Hills entries.
  // Result added 2026-09-04 sweep: confirmed via MaxPreps box score — BR
  // won sets 1-2 (25-21, 25-21) then lost sets 3-5 (14-25, 20-25, 9-15),
  // final 2-3, a 5-set non-conference road loss to Westfield.
  { date: 'Wed, Sep 2', time: '4:00 PM', opponent: 'at Westfield', home: false, location: 'TBD — confirm venue (Westfield HS)', result: { win: false, score: '2-3', usScore: 2, themScore: 3 } },
  // Result added 2026-09-04 sweep: confirmed via MaxPreps box score (BR won
  // the home conference match 2-0).
  { date: 'Thu, Sep 3', time: '5:30 PM', opponent: 'vs North Hunterdon', home: true, league: true, location: HOME_VENUE, result: { win: true, score: '2-0', usScore: 2, themScore: 0 } },
  // Result added 2026-09-08 — MaxPreps still hadn't posted a score 3 days
  // after this match (the "still unreported" gap tracked across the
  // 09-06/09-07 sweep entries). Tom flagged a screenshot of NJRecordBook.com's
  // Daily Leaders page showing real BR player stat lines for this date,
  // which led to finding NJRB's own box score for this exact match — a
  // legitimate, established NJ HS stats site (every season since 2010),
  // added to VOLLEYBALL-SOURCES.md the same day. 15-25, 10-25, 22-25 — a
  // three-set sweep loss to Old Bridge (5-0, NJ #2 at the time).
  { date: 'Sat, Sep 5', time: '9:00 AM', opponent: 'vs Old Bridge', home: true, location: HOME_VENUE, result: { win: false, score: '0-3', usScore: 0, themScore: 3 } },
  // Result added 2026-09-08, same NJRecordBook.com discovery as Old Bridge
  // above. 27-25, 25-14, 25-15 — a straight-set win over Jefferson Township.
  { date: 'Sat, Sep 5', time: '12:00 PM', opponent: 'vs Jefferson Township', home: true, location: HOME_VENUE, result: { win: true, score: '3-0', usScore: 3, themScore: 0 } },
  // Result added 2026-09-11 sweep: confirmed via MaxPreps match page/recap —
  // Mount St. Mary Academy won 2-0 in a non-conference match. Set-by-set
  // score not available via NJRB or general search as of this sweep.
  { date: 'Tue, Sep 8', time: '5:30 PM', opponent: 'vs Mount St. Mary Academy', home: true, location: HOME_VENUE, result: { win: false, score: '0-2', usScore: 0, themScore: 2 } },
  { date: 'Thu, Sep 10', time: '4:30 PM', opponent: 'at Rutgers Prep', home: false, location: 'TBD — confirm venue (Rutgers Prep)', result: { win: false, score: '1-2', usScore: 1, themScore: 2 } }, // Updated 2026-09-15 — NJRecordBook box score (25-19, 18-25, 20-25)
  { date: 'Tue, Sep 15', time: '5:30 PM', opponent: 'vs Hunterdon Central', home: true, league: true, location: HOME_VENUE, result: null },
  // REMOVED 2026-09-15 sweep, RESOLVED 2026-09-16 sweep: this array
  // previously had a 'Wed, Sep 16 at Delaware Valley' entry here, pulled
  // 2026-09-15 after fresh fetches of both teams' own MaxPreps schedules
  // showed no Sep 16 meeting anywhere. Re-checked today (Sep 16 itself —
  // confirmed via MaxPreps/NJRB, no BR match today, the removal was
  // correct), and the real Oct 22 date is now independently confirmed by
  // TWO sources: Delaware Valley's own MaxPreps schedule (still lists it as
  // "@Bridgewater-Raritan," i.e. DV traveling to BR) AND NJRecordBook.com's
  // BR team page (njrecordbook.com/girls-volleyball/bridgewater-raritan/,
  // game preview id 19325) — satisfies the standing two-source rule even
  // though BR's own MaxPreps page (last updated Sep 10) still hasn't picked
  // it up. Added below as a real scheduled match. Note: NJRB's own home/away
  // column for this same match actually reads "Away" for BR (implying DV
  // hosts) — the opposite of what DV's own MaxPreps page says. Went with
  // DV's own page (explicit "@Bridgewater-Raritan," the same mutual
  // cross-listing convention already used for Westfield/Phillipsburg below)
  // over NJRB's home/away column, which is a secondary-source convenience
  // field, not a school's own schedule listing — flagging the conflict here
  // in case it turns out to matter (e.g. if NJRB corrects itself later).
  { date: 'Thu, Sep 17', time: '4:00 PM', opponent: 'vs Roxbury', home: true, location: HOME_VENUE, result: null },
  { date: 'Fri, Sep 18', time: '5:30 PM', opponent: 'vs Hillsborough', home: true, league: true, location: HOME_VENUE, result: null },
  { date: 'Tue, Sep 29', time: '4:00 PM', opponent: 'vs Rutgers Prep', home: true, location: HOME_VENUE, result: null },
  { date: 'Wed, Sep 30', time: 'TBA', opponent: 'vs Governor Livingston', home: true, location: HOME_VENUE, result: null },
  { date: 'Thu, Oct 1', time: '4:00 PM', opponent: 'vs Sparta', home: true, location: HOME_VENUE, result: null },
  { date: 'Fri, Oct 2', time: '4:00 PM', opponent: 'vs Hopewell Valley Central', home: true, location: HOME_VENUE, result: null },
  { date: 'Tue, Oct 6', time: '5:30 PM', opponent: 'at Hunterdon Central', home: false, league: true, location: 'TBD — confirm venue (Hunterdon Central)', result: null },
  { date: 'Wed, Oct 7', time: '4:00 PM', opponent: 'vs Colonia', home: true, location: HOME_VENUE, result: null },
  { date: 'Fri, Oct 9', time: '5:30 PM', opponent: 'at Montgomery', home: false, location: 'TBD — confirm venue (Montgomery)', result: null },
  // Added 2026-08-28 sweep: missing from this array since 2026-08-22 despite
  // being on MaxPreps the whole time. Confirmed via mutual cross-listing —
  // Phillipsburg's own MaxPreps volleyball schedule independently lists
  // "10/12 5:15pm @ Bridgewater-Raritan" (BR hosts). Phillipsburg plays
  // Skyland Delaware West, BR plays Skyland Delaware East — not a league
  // opponent for BR, so no `league` flag, same pattern as the Westfield entry.
  { date: 'Mon, Oct 12', time: '5:15 PM', opponent: 'vs Phillipsburg', home: true, location: HOME_VENUE, result: null },
  { date: 'Tue, Oct 13', time: '4:00 PM', opponent: 'at Mount St. Mary Academy', home: false, location: 'TBD — confirm venue (Mount St. Mary Academy)', result: null },
  { date: 'Tue, Oct 13', time: '4:00 PM', opponent: 'at Union Catholic', home: false, location: 'TBD — confirm venue (Union Catholic)', result: null },
  { date: 'Wed, Oct 14', time: '4:00 PM', opponent: 'vs Piscataway', home: true, location: HOME_VENUE, result: null },
  // Added 2026-09-16 sweep — missing from this array despite being on both
  // MaxPreps and NJRB the whole time (same never-actually-added gap as the
  // Delaware Valley entry above; the checklist's prior "reconfirmed accurate"
  // note on 2026-09-15 referred to the underlying MaxPreps listing, not this
  // array, which never had the row). Confirmed via BR's own MaxPreps
  // schedule ("10/19 5:30pm @ Voorhees") AND NJRecordBook.com's BR team page
  // (game preview id 20887), which both independently agree BR travels to
  // Voorhees. Voorhees is a Skyland Conference member (per NJRB) but not in
  // BR's own Delaware East division — no `league` flag, same pattern as
  // Montgomery/Phillipsburg above.
  { date: 'Mon, Oct 19', time: '5:30 PM', opponent: 'at Voorhees', home: false, location: 'TBD — confirm venue (Voorhees)', result: null },
  // Added 2026-09-16 sweep — see the sourcing note above (before the Sep 17
  // Roxbury entry) for how this date was confirmed.
  { date: 'Thu, Oct 22', time: '5:30 PM', opponent: 'vs Delaware Valley', home: true, location: HOME_VENUE, result: null },
];
