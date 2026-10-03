// BRHS Panther Football — player stats, single source of truth.
//
// Feeds components/team-dashboard/StatsSection.jsx, a generic component
// shared across team/sport pages — nothing in this file's shape is
// football-specific beyond the actual category labels/columns chosen
// below (Passing/Rushing/etc.). A wrestling or volleyball page would
// export its own lib/*Stats.js with different category labels/columns
// but the exact same { category, name, ... } leader shape and
// { label, columns, rows } box-score shape, and pass it to the same
// component.
//
// REBUILT 2026-09-08: Tom asked whether season stats can be maintained
// by pulling them each week. Answer: not reliably from press recaps alone
// (CJ Sports Radio/TAPinto/MyCentralJersey don't report the same stat
// categories every week — Week 1 had full game lines, Week 2 had only
// touchdown-play yardage — so summing across weeks from recaps would mean
// either understating or guessing at gaps). The real fix: NJRecordBook.com
// (njrecordbook.com/football/bridgewater-raritan/) turns out to maintain
// real per-player SEASON-AGGREGATE stats for football, built from full
// team box scores per game, the same way it already does for volleyball
// (see VOLLEYBALL-SOURCES.md). Confirmed live and populated for the
// 2026-27 season — this file's stats are sourced from NJRB's team page +
// its individual game box scores (njrecordbook.com/football/game/17644/ =
// Woodbridge, .../game/18005/ = St. Joseph, .../game/18028/ = Hillsborough,
// added 2026-09-14), not hand-curated "best line so far" or CJSR-only detail.
//
// TIER 1: every number is pulled from a published box score. NJRB is now
// the season-aggregate source of record (full Passing/Rushing/Receiving/
// Defense/Returning/Kicking/Punting team box scores, both games). CJSR's
// recap remains cited alongside for play-by-play narrative context (which
// down/time/quarter a score happened) that NJRB's box score doesn't carry.
//
// KNOWN DISCREPANCY (flagged, not silently resolved): CJ Sports Radio's
// Week 1 recap (and TAPinto/MyCentralJersey, which matched it) reported
// JB Baxter at 13/20, 253 yds passing vs. Woodbridge. NJRB's structured
// box score for the same game shows 15/25, 272 yds (TD/INT match: 3/1
// either way). Since NJRB's own season total (458 yds through 2 games)
// only reconciles against its own per-game numbers (272 + 186 = 458), NJRB's
// figures are used here for internal consistency of the season totals —
// but the recap's different number is real and worth knowing about instead
// of pretending only one source ever existed. Re-check next sweep whether
// either site corrects itself.
//
// Add one entry to WEEKLY_BOX_SCORES_2026 per game once NJRB posts a box
// score (fast — same-day/next-day, faster than MaxPreps has been all
// season), then re-derive TEAM_LEADERS_2026 and SEASON_STATS_2026 from
// NJRB's own team page (which does the aggregation across games for you —
// don't hand-sum weekly lines yourself; pull the team page's own season
// totals each time to avoid compounding a transcription error).
//
// `photo` paths point at the same media-day-portraits-by-jersey-number
// files the roster/featured-player sections already use — see
// PORTRAIT_NUMBERS in app/brhs-panther-football/page.jsx for which numbers
// have a real photo on file.

// Re-pulled 2026-09-28 sweep from NJRB's team page (now through Week 5,
// Westfield box score njrecordbook.com/football/game/18499/ posted since
// the 09-27 sweep). BR shut out Westfield 20-0; NJRB's box score splits
// the 3 rushing TDs as Jonathan Okolo 2, Jahmier Black 1 — matching the
// BRRSD/NJ.com recap detail already cited in lib/footballSchedule.js
// (independent 2-source agreement on the TD split, now a 3rd: NJRB's own
// structured box score). Nick Crovelli now clearly leads both Tackles
// (43) and Sacks (2.5) outright — no tie-break needed this week, unlike
// Week 4's Locrotondo/Crovelli sack tie. Jack Winne still leads
// Interceptions (2, both from Week 4) — no one added a 2nd this week.
// Re-pulled 2026-10-03 sweep from NJRB's team page (still GP 5 — the Oct 2
// Hunterdon Central game, BR W 35-18, is on NJRB's schedule table but its
// box score (njrecordbook.com/football/game/18574/) reports NO individual BR
// stats, so BR's season totals did not move for that game). NJRB nonetheless
// revised several already-posted season lines since the 09-28 pull (e.g.
// Baxter comp% 52.7 -> 53.2, Levash 22 tkl/1.5 sk -> 26/3.5, Crovelli 43 ->
// 45 tkl, Winne punting 472 -> 482 yds) — NJRB's own re-aggregation; whole
// table replaced below rather than patched. Trent Levash (3.5) now leads
// Sacks outright over Nick Crovelli (2.5). Passing/rushing/receiving yardage
// leaders and Winne's INT lead unchanged.
export const TEAM_LEADERS_2026 = [
  {
    category: 'Passing Yards',
    name: 'JB Baxter',
    number: 10,
    value: '793',
    detail: '53.2 comp%, 4 TD, 5 INT — 5 games (NJRB season total)',
    photo: '/photos/media-day-portraits/10.jpg',
  },
  {
    category: 'Rushing Yards',
    name: 'Jahmier Black',
    number: 11,
    value: '647',
    detail: '114 att, 9 TD, 5.7 YPC — 5 games',
    photo: '/photos/media-day-portraits/11.jpg',
  },
  {
    category: 'Receiving Yards',
    name: 'Evan Woodring',
    number: 5,
    value: '269',
    detail: '21 rec, 2 TD — 5 games',
    photo: '/photos/media-day-portraits/5.jpg',
  },
  {
    category: 'Tackles',
    name: 'Nick Crovelli',
    number: 27,
    value: '45',
    detail: '9 TFL, 2.5 sacks, 1 FF — 5 games',
    photo: '/photos/media-day-portraits/27.jpg',
  },
  {
    category: 'Sacks',
    name: 'Trent Levash',
    number: 55,
    value: '3.5',
    detail: 'Outright team leader through 5 games — also 10 TFL (team high), 26 tackles, 1 INT, 1 FR',
    photo: '/photos/media-day-portraits/55.jpg',
  },
  {
    category: 'Interceptions',
    name: 'Jack Winne',
    number: 9,
    value: '2',
    detail: 'Both in Week 4 vs. Ridge — the 2nd sealed the 7-3 win late in the 4th (per CJSR). Levash, Locrotondo, Woodring, Okolo, Zuckerman and Schwamberger have 1 each.',
    photo: '/photos/media-day-portraits/9.jpg',
  },
];

// Full team season stat lines, source of record: NJRB's Bridgewater-Raritan
// football team page (njrecordbook.com/football/bridgewater-raritan/),
// which aggregates every player's numbers across all games played so far —
// re-pull this table directly from that page each sweep rather than
// summing WEEKLY_BOX_SCORES_2026 by hand.
export const SEASON_STATS_2026 = {
  gamesPlayed: 5,
  asOf: 'Oct 3, 2026 (NJRB, GP 5 — Oct 2 Hunterdon Central stats not yet reported)',
  source: { label: 'NJ Record Book — Team Stats', url: 'https://njrecordbook.com/football/bridgewater-raritan/' },
  passing: {
    columns: ['Player', 'GP', 'Comp %', 'QBR', 'Yds', 'TD', 'INT'],
    rows: [
      { cells: ['J. Baxter (#10)', 5, '53.2', '69.4', 793, 4, 5] },
      { cells: ['C. Pello', 1, '0.0', '39.6', 0, 0, 0] },
      { cells: ['J. Winne (#9)', 5, '0.0', '39.6', 0, 0, 0] },
      { cells: ['E. Woodring (#5)', 5, '0.0', '0.0', 0, 0, 1] },
    ],
  },
  rushing: {
    columns: ['Player', 'GP', 'Att', 'Yds', 'TD', 'YPC'],
    rows: [
      { cells: ['J. Black (#11)', 5, 114, 647, 9, '5.7'] },
      { cells: ['J. Okolo', 5, 45, 161, 4, '3.6'] },
      { cells: ['E. Woodring (#5)', 5, 13, 89, 1, '6.8'] },
      { cells: ['J. Baker', 3, 11, 45, 0, '4.1'] },
      { cells: ['J. Baxter (#10)', 5, 3, 26, 0, '8.7'] },
      { cells: ['J. Winne (#9)', 5, 2, 9, 0, '4.5'] },
      { cells: ['J. LoCrotondo (#4)', 5, 1, 1, 0, '1.0'] },
      { cells: ['M. Cole', 1, 1, 0, 0, '0.0'] },
    ],
  },
  receiving: {
    columns: ['Player', 'GP', 'Rec', 'Yds', 'TD', 'Y/C'],
    rows: [
      { cells: ['E. Woodring (#5)', 5, 21, 269, 2, '12.8'] },
      { cells: ['D. Krizan', 3, 12, 156, 0, '13.0'] },
      { cells: ['J. Winne (#9)', 5, 4, 101, 1, '25.3'] },
      { cells: ['A. Lorino', 5, 6, 76, 0, '12.7'] },
      { cells: ['B. Matos', 4, 5, 45, 0, '9.0'] },
      { cells: ['J. Black (#11)', 5, 4, 43, 0, '10.8'] },
      { cells: ['J. Schwamberger', 4, 1, 30, 1, '30.0'] },
      { cells: ['J. LoCrotondo (#4)', 5, 1, 27, 0, '27.0'] },
      { cells: ['J. Baker', 3, 1, 16, 0, '16.0'] },
      { cells: ['N. Crovelli (#27)', 5, 1, 12, 0, '12.0'] },
      { cells: ['M. Dorsey', 2, 1, 8, 0, '8.0'] },
      { cells: ['J. Okolo', 5, 1, 6, 0, '6.0'] },
      { cells: ['C. Rutherford', 5, 1, 4, 0, '4.0'] },
    ],
  },
  defense: {
    columns: ['Player', 'GP', 'Tkl', 'Sk', 'TFL', 'INT', 'FF', 'FR'],
    rows: [
      { cells: ['N. Crovelli (#27)', 5, 45, 2.5, 9, 0, 1, 0] },
      { cells: ['A. Lorino', 5, 33, 1.5, 5, 0, 0, 0] },
      { cells: ['T. Levash (#55)', 5, 26, 3.5, 10, 1, 0, 1] },
      { cells: ['J. Black (#11)', 5, 23, 0, 6, 0, 0, 0] },
      { cells: ['J. LoCrotondo (#4)', 5, 19, 1, 4, 1, 0, 0] },
      { cells: ['J. Winne (#9)', 5, 19, 0.5, 1, 2, 0, 0] },
      { cells: ['E. Woodring (#5)', 5, 18, 0, 2, 1, 0, 0] },
      { cells: ['J. Jones (#41)', 5, 17, 1, 4, 0, 0, 0] },
      { cells: ['J. Markovitch', 5, 16, 0, 3, 0, 0, 1] },
      { cells: ['J. Okolo', 5, 15, 0.5, 2, 1, 0, 0] },
      { cells: ['N. Zuckerman', 5, 14, 0, 0, 1, 0, 0] },
      { cells: ['F. Schenk', 5, 13, 0, 0, 0, 0, 0] },
      { cells: ['D. Krizan', 3, 8, 0, 0, 0, 0, 0] },
      { cells: ['J. Schwamberger', 4, 8, 0, 0, 1, 0, 0] },
      { cells: ['J. Baker', 3, 7, 0, 0, 0, 0, 0] },
      { cells: ['D. Markovitch', 3, 6, 0, 0, 0, 0, 0] },
      { cells: ['J. Madsen', 1, 5, 0, 0, 0, 0, 0] },
      { cells: ['S. Risco', 3, 5, 0, 0, 0, 0, 1] },
      { cells: ['C. Rutherford', 5, 5, 0, 0, 0, 0, 0] },
      { cells: ['B. Matos', 4, 4, 0, 0, 0, 0, 0] },
      { cells: ['M. Dorsey', 2, 3, 0, 0, 0, 0, 0] },
      { cells: ['J. Lavender', 1, 2, 0, 0, 0, 0, 0] },
      { cells: ['R. Matos', 1, 2, 0, 0, 0, 0, 0] },
      { cells: ['A. Zimmerman', 2, 2, 0, 0, 0, 0, 0] },
      { cells: ['N. Bogolashvili', 3, 2, 0, 1, 0, 1, 0] },
      { cells: ['T. Thiry', 1, 1, 0, 0, 0, 0, 0] },
      { cells: ['A. Arndt', 1, 1, 0, 0, 0, 0, 0] },
      { cells: ['Z. Rinehimer', 1, 1, 0, 0, 0, 0, 0] },
    ],
  },
  returning: {
    columns: ['Player', 'GP', 'KR Att', 'KR Yds', 'PR Att', 'PR Yds'],
    rows: [
      { cells: ['D. Krizan', 3, 5, 135, 0, 0] },
      { cells: ['J. LoCrotondo (#4)', 5, 2, 30, 0, 0] },
      { cells: ['B. Matos', 4, 1, 15, 0, 0] },
      { cells: ['E. Woodring (#5)', 5, 0, 0, 6, 53] },
    ],
  },
  kicking: {
    columns: ['Player', 'GP', 'FGM', 'FGA', 'XPM', 'XPA'],
    rows: [
      { cells: ['P. Lyons', 5, 0, 0, 13, 15] },
    ],
  },
  punting: {
    columns: ['Player', 'GP', 'Punts', 'Yds', 'Avg', 'Long'],
    rows: [
      { cells: ['J. Winne (#9)', 5, 16, 482, '30.1', 46] },
    ],
  },
};

// Renders SEASON_STATS_2026 through the exact same generic
// { week, opponent, result, date, categories, sources } shape StatsSection
// already knows how to draw for a per-week box score — no component
// change needed. Built as a function (not a static export) so the
// category list always reflects SEASON_STATS_2026 above; edit that object,
// not this one, when a new week's NJRB pull updates the season totals.
export function buildSeasonTotalsEntry() {
  const s = SEASON_STATS_2026;
  return {
    week: 'Season Totals',
    opponent: `${s.gamesPlayed} games played`,
    result: null,
    date: s.asOf,
    categories: [
      { label: 'Passing', columns: s.passing.columns, rows: s.passing.rows },
      { label: 'Rushing', columns: s.rushing.columns, rows: s.rushing.rows },
      { label: 'Receiving', columns: s.receiving.columns, rows: s.receiving.rows },
      { label: 'Defense', columns: s.defense.columns, rows: s.defense.rows },
      { label: 'Returning', columns: s.returning.columns, rows: s.returning.rows },
      { label: 'Kicking', columns: s.kicking.columns, rows: s.kicking.rows },
      { label: 'Punting', columns: s.punting.columns, rows: s.punting.rows },
    ],
    sources: [s.source],
  };
}

// Per-week box scores, one entry per game as recaps/NJRB post. `categories`
// is a generic { label, columns, rows } list — StatsSection renders
// whatever's here without assuming football-specific fields.
export const WEEKLY_BOX_SCORES_2026 = [
  // Week 1 rebuilt 2026-09-08 using NJRB's full structured box score
  // (njrecordbook.com/football/game/17644/) in place of the prior
  // recap-only partial table — full team lines across every category, not
  // just touchdown plays. CJSR/TAPinto/MyCentralJersey remain cited below;
  // their passing line (13/20, 253 yds) differs slightly from NJRB's
  // (15/25, 272 yds) — see the file-level "KNOWN DISCREPANCY" note above.
  {
    week: 'Week 1',
    opponent: 'at Woodbridge',
    date: 'Aug 28, 2026',
    result: 'W, 28-7',
    categories: [
      {
        label: 'Passing',
        columns: ['Player', 'C/ATT', 'Yds', 'TD', 'INT'],
        rows: [
          { cells: ['JB Baxter (#10)', '15/25', 272, 3, 1] },
        ],
      },
      {
        label: 'Rushing',
        columns: ['Player', 'Yds', 'TD'],
        rows: [
          { cells: ['Jahmier Black (#11)', 118, 1] },
          { cells: ['Jonathan Okolo', 31, 0] },
        ],
      },
      {
        label: 'Receiving',
        columns: ['Player', 'Yds', 'TD'],
        rows: [
          { cells: ['Evan Woodring (#5)', 69, 1] },
          { cells: ['Jack Winne', 64, 1] },
          { cells: ['Jasper Schwamberger', 30, 1] },
          { cells: ['DJ Krizan', 44, 0] },
        ],
      },
      {
        label: 'Defense',
        columns: ['Player', 'Notes'],
        rows: [
          { cells: ['Jamelle Jones (#41)', '1 sack, -8 yds (3rd quarter)'] },
          { cells: ['Jahmier Black (#11)', "1 TFL, -8 yds (Woodbridge's first offensive snap)"] },
        ],
      },
    ],
    sources: [
      { label: 'NJ Record Book (box score)', url: 'https://njrecordbook.com/football/game/17644/' },
      { label: 'CJ Sports Radio', url: 'https://cjsportsradio.com/2026/08/28/sophomore-qb-baxter-shines-as-no-6-bridgewater-raritan-opens-26-with-28-7-win-at-no-8-woodbridge/' },
      { label: 'TAPinto', url: 'https://www.tapinto.net/towns/woodbridge-slash-carteret/sections/sports/articles/football-bridgewater-raritan-beats-woodbridge-28-7-in-opening-game' },
      { label: 'MyCentralJersey', url: 'https://www.mycentraljersey.com/story/sports/high-school/football/2026/08/28/nj-high-school-football-scores-bridgewater-raritan-vs-woodbridge-2026/91399589007/' },
    ],
  },
  // Week 2 rebuilt 2026-09-08 using NJRB's full box score
  // (njrecordbook.com/football/game/18005/) — now includes a real Passing
  // table (Baxter 16/32, 186 yds, 0 TD, 1 INT) that wasn't available from
  // CJSR's recap alone, since the recap only covered play-by-play detail,
  // not full-game passing totals. Play-by-play context (INT timestamps,
  // TD-run yardage, Brust's catch) still drawn from CJSR's recap, since
  // NJRB's box score doesn't carry down/time detail.
  {
    week: 'Week 2',
    opponent: 'at St. Joseph (Metuchen)',
    date: 'Sep 5, 2026',
    result: 'L, 36-43',
    categories: [
      {
        label: 'Passing',
        columns: ['Player', 'C/ATT', 'Yds', 'TD', 'INT'],
        rows: [
          { cells: ['JB Baxter (#10)', '16/32', 186, 0, 1] },
        ],
      },
      {
        label: 'Rushing',
        columns: ['Player', 'TD Play (Yds)', 'Yds', 'TD'],
        rows: [
          { cells: ['Jahmier Black (#11)', '1, 9, 26, 1 (4 TDs)', 168, 4] },
          { cells: ['Jonathan Okolo', '—', 13, 1] },
        ],
      },
      {
        label: 'Receiving',
        columns: ['Player', 'Yds', 'TD'],
        rows: [
          { cells: ['DJ Krizan', 79, 0] },
          { cells: ['Evan Woodring (#5)', 57, 0] },
        ],
      },
      {
        label: 'Defense',
        columns: ['Player', 'Notes'],
        rows: [
          { cells: ['Evan Woodring (#5)', 'INT, 0:51 into 1st quarter'] },
          { cells: ['James LoCrotondo', 'INT, mid-3rd quarter, set up an Okolo TD'] },
          { cells: ['Trent Levash', 'INT (NJRB box score; not detailed in CJSR recap)'] },
        ],
      },
    ],
    sources: [
      { label: 'NJ Record Book (box score)', url: 'https://njrecordbook.com/football/game/18005/' },
      { label: 'CJ Sports Radio', url: 'https://cjsportsradio.com/2026/09/05/no-2-st-joseph-metuchen-takes-lead-early-lead-then-rallies-for-43-36-win-over-no-6-bridgewater-raritan/' },
    ],
  },
  // Week 3 added 2026-09-14 sweep, sourced entirely from NJRB's box score
  // (njrecordbook.com/football/game/18028/) — no CJSR/TAPinto/MyCentralJersey
  // recap had published as of this pull (checked all three; none had a
  // Hillsborough writeup yet), so there's no play-by-play narrative source
  // to fold in this time, unlike Weeks 1-2. SI's Sep 11 NJ scores roundup
  // independently corroborates the 40-14 final only (no player detail).
  //
  // Notable: NJRB's box score credits BR with 1 total interception this
  // game, attributed to Jasper Schwamberger, AND flags it via a separate
  // "INT/TD" column value of 1 — i.e. an interception return for a
  // touchdown. The final-score math checks out for this: BR's 5 offensive
  // TDs (4 rushing: Black x2, Okolo, Woodring; 1 passing: Woodring) + 2 XP
  // + 1 two-point conversion = 34, and 34 + 6 (the extra TD) = 40, BR's
  // actual final score — so a 6th, non-offensive TD is real, not a parsing
  // artifact.
  //
  // RESOLVED 2026-09-17 sweep: BRRSD's own recap (published 2026-09-14,
  // added to football ARTICLES in page.jsx) independently confirms and
  // details the play — Schwamberger intercepted a heavily-pressured pass
  // and returned it 40 yards for the score, with 9:14 left in the 4th
  // quarter. Same article's other stat lines (Baxter 165 pass yds/1 TD,
  // Woodring 3 car/30 yds/1 TD rushing + 2 rec/58 yds/1 TD receiving,
  // Black 21 car/146 yds/2 TD, Okolo 21 car/87 yds/1 TD, Lorino 3 rec/53
  // yds) differ slightly from NJRB's box score numbers below — kept as-is
  // per the project's standing multi-source-discrepancy rule (flag, don't
  // reconcile), same treatment as Weeks 1-2's Baxter/Woodring variances.
  {
    week: 'Week 3',
    opponent: 'vs Hillsborough',
    date: 'Sep 11, 2026',
    result: 'W, 40-14',
    categories: [
      {
        label: 'Passing',
        columns: ['Player', 'C/ATT', 'Yds', 'TD', 'INT'],
        rows: [
          { cells: ['JB Baxter (#10)', '7/14', 173, 1, 0] },
        ],
      },
      {
        label: 'Rushing',
        columns: ['Player', 'Yds', 'TD'],
        rows: [
          { cells: ['Jahmier Black (#11)', 152, 2] },
          { cells: ['Jonathan Okolo', 88, 1] },
          { cells: ['Evan Woodring (#5)', 31, 1] },
        ],
      },
      {
        label: 'Receiving',
        columns: ['Player', 'Yds', 'TD'],
        rows: [
          { cells: ['Evan Woodring (#5)', 63, 1] },
          { cells: ['Anthony Lorino', 56, 0] },
          { cells: ['DJ Krizan', 33, 0] },
          { cells: ['Jahmier Black (#11)', 21, 0] },
        ],
      },
      {
        label: 'Defense',
        columns: ['Player', 'Notes'],
        rows: [
          { cells: ['Nick Crovelli (#27)', '9 tackles, 1 sack, 2 TFL'] },
          { cells: ['Jasper Schwamberger', "BR's lone INT of the game, returned 40 yards for a TD with 9:14 left in the 4th quarter — per BRRSD's recap"] },
        ],
      },
    ],
    sources: [
      { label: 'NJ Record Book (box score)', url: 'https://njrecordbook.com/football/game/18028/' },
      { label: 'SI — Sep 11 NJ high school football final scores', url: 'https://www.si.com/high-school/new-jersey/new-jersey-high-school-football-final-scores-september-11-01m29zf9cqxw' },
      { label: 'BRRSD Athletics (recap)', url: 'https://www.brrsd.org/o/brrhs/article/3128839' },
    ],
  },
  // Week 4 added 2026-09-23 sweep: NJRB box score (njrecordbook.com/
  // football/game/18189/) posted since the 09-22 sweep. Scoring-play
  // narrative from CJ Sports Radio's Sep 18 Big Central roundup (Black's
  // 7-yd TD on 3rd-and-goal at 1:19 of the 2nd; Ridge's only points a
  // 29-yd Herik Villalba-Ozuna FG with 8:55 left; Winne's 2nd INT late in
  // the 4th, then Black's 28-yd run to set up the kneel-down). No stat
  // discrepancies vs. the recap this week — CJSR gave no competing lines.
  {
    week: 'Week 4',
    opponent: 'vs Ridge',
    date: 'Sep 18, 2026',
    result: 'W, 7-3',
    categories: [
      {
        label: 'Passing',
        columns: ['Player', 'C/ATT', 'Yds', 'TD', 'INT'],
        rows: [
          { cells: ['JB Baxter (#10)', '12/25', 82, 0, 3] },
          { cells: ['Evan Woodring (#5)', '0/2', 0, 0, 1] },
        ],
      },
      {
        label: 'Rushing',
        columns: ['Player', 'Att', 'Yds', 'TD'],
        rows: [
          { cells: ['Jahmier Black (#11)', 30, 131, 1] },
          { cells: ['Jonathan Okolo', 5, 12, 0] },
          { cells: ['Evan Woodring (#5)', 1, 7, 0] },
        ],
      },
      {
        label: 'Receiving',
        columns: ['Player', 'Rec', 'Yds', 'TD'],
        rows: [
          { cells: ['Evan Woodring (#5)', 8, 53, 0] },
          { cells: ['Branden De Matos (#15)', 3, 23, 0] },
          { cells: ['Jack Winne (#9)', 1, 6, 0] },
        ],
      },
      {
        label: 'Defense',
        columns: ['Player', 'Notes'],
        rows: [
          { cells: ['Anthony Lorino', '10 tackles, 1 sack, 2 TFL'] },
          { cells: ['James Locrotondo (#4)', '9 tackles, 1 sack, 2 TFL'] },
          { cells: ['Jack Winne (#9)', '2 INT (the 2nd late in the 4th quarter to nearly seal it, per CJSR), 4 tackles'] },
          { cells: ['Jahmier Black (#11)', '6 tackles'] },
          { cells: ['Trent Levash', '5 tackles, 0.5 sack, 1 TFL'] },
        ],
      },
      {
        label: 'Kicking / Punting',
        columns: ['Player', 'Line'],
        rows: [
          { cells: ['Parker Lyons', '1/1 XP'] },
          { cells: ['Jack Winne (#9)', '4 punts, 134 yds, long 38'] },
        ],
      },
    ],
    sources: [
      { label: 'NJ Record Book (box score)', url: 'https://njrecordbook.com/football/game/18189/' },
      { label: 'CJ Sports Radio — Friday Night Big Central Roundup (Sep 18)', url: 'https://cjsportsradio.com/2026/09/18/friday-night-big-central-roundup-elizabeth-old-bridge-bridgewater-raritan-win-top-ten-clashes/' },
    ],
  },
  // Week 5 added 2026-09-28 sweep: NJRB box score (njrecordbook.com/
  // football/game/18499/) posted since the 09-27 sweep. TD split (Okolo 2,
  // Black 1) matches the BRRSD/NJ.com recap detail already in
  // lib/footballSchedule.js's Westfield result comment — 3-source
  // agreement now (BRRSD, NJ.com, NJRB's own structured box score).
  {
    week: 'Week 5',
    opponent: 'at Westfield',
    date: 'Sep 26, 2026',
    result: 'W, 20-0',
    categories: [
      {
        label: 'Passing',
        columns: ['Player', 'C/ATT', 'Yds', 'TD', 'INT'],
        rows: [
          { cells: ['JB Baxter (#10)', '8/14', 80, 0, 0] },
          { cells: ['Colin Pello', '0/1', 0, 0, 0] },
          { cells: ['Jack Winne (#9)', '0/1', 0, 0, 0] },
        ],
      },
      {
        label: 'Rushing',
        columns: ['Player', 'Att', 'Yds', 'TD'],
        rows: [
          { cells: ['Jahmier Black (#11)', 17, 78, 1] },
          { cells: ['Jack Baker', 5, 27, 0] },
          { cells: ['Jonathan Okolo', 5, 17, 2] },
          { cells: ['Evan Woodring (#5)', 3, 19, 0] },
          { cells: ['Jack Winne (#9)', 2, 3, 0] },
          { cells: ['JB Baxter (#10)', 1, -5, 0] },
        ],
      },
      {
        label: 'Receiving',
        columns: ['Player', 'Rec', 'Yds', 'TD'],
        rows: [
          { cells: ['Evan Woodring (#5)', 4, 27, 0] },
          { cells: ['Jack Winne (#9)', 2, 31, 0] },
          { cells: ['Jahmier Black (#11)', 1, 2, 0] },
          { cells: ['Nick Crovelli (#27)', 1, 12, 0] },
          { cells: ['Marcus Dorsey', 1, 8, 0] },
        ],
      },
      {
        label: 'Defense',
        columns: ['Player', 'Notes'],
        rows: [
          { cells: ['Nick Crovelli (#27)', '8 tackles, 1.5 sacks, 6 TFL'] },
          { cells: ['Anthony Lorino', '7 tackles'] },
          { cells: ['Jonathan Okolo', '1 interception'] },
        ],
      },
      {
        label: 'Kicking / Punting',
        columns: ['Player', 'Line'],
        rows: [
          { cells: ['Parker Lyons', '2/3 XP'] },
          { cells: ['Jack Winne (#9)', '3 punts, 44 yds'] },
        ],
      },
    ],
    sources: [
      { label: 'NJ Record Book (box score)', url: 'https://njrecordbook.com/football/game/18499/' },
      { label: 'BRRSD Athletics (recap)', url: 'https://www.brrsd.org/o/brrhs/article/3154090' },
      { label: 'NJ.com High School Sports (recap)', url: 'https://www.nj.com/highschoolsports/' },
    ],
  },
];
