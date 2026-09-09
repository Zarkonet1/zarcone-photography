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
// 2026-27 season (2 games played) — this file's stats are now sourced
// from NJRB's team page + its two individual game box scores
// (njrecordbook.com/football/game/17644/ = Woodbridge, .../game/18005/ =
// St. Joseph), not hand-curated "best line so far" or CJSR-only detail.
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

export const TEAM_LEADERS_2026 = [
  {
    category: 'Passing Yards',
    name: 'JB Baxter',
    number: 10,
    value: '458',
    detail: '31/57, 3 TD, 2 INT — 2 games (NJRB season total)',
    photo: '/photos/media-day-portraits/10.jpg',
  },
  {
    category: 'Rushing Yards',
    name: 'Jahmier Black',
    number: 11,
    value: '286',
    detail: '45 att, 5 TD, 6.4 YPC — 2 games',
    photo: '/photos/media-day-portraits/11.jpg',
  },
  {
    category: 'Receiving Yards',
    name: 'Evan Woodring',
    number: 5,
    value: '126',
    detail: '7 rec, 1 TD — 2 games',
    photo: '/photos/media-day-portraits/5.jpg',
  },
  {
    category: 'Tackles',
    name: 'Nick Crovelli',
    number: 27,
    value: '22',
    detail: '2 FF — 2 games',
    photo: '/photos/media-day-portraits/27.jpg',
  },
  {
    category: 'Sacks',
    name: 'Jamelle Jones',
    number: 41,
    value: '1',
    detail: '-8 yds, 3rd quarter — vs. Woodbridge',
    photo: '/photos/media-day-portraits/41.jpg',
  },
  {
    category: 'Interceptions',
    name: 'Evan Woodring',
    number: 5,
    value: '1',
    detail: '0:51 into 1st quarter — vs. St. Joseph (Metuchen)',
    photo: '/photos/media-day-portraits/5.jpg',
  },
];

// Full team season stat lines, source of record: NJRB's Bridgewater-Raritan
// football team page (njrecordbook.com/football/bridgewater-raritan/),
// which aggregates every player's numbers across all games played so far —
// re-pull this table directly from that page each sweep rather than
// summing WEEKLY_BOX_SCORES_2026 by hand.
export const SEASON_STATS_2026 = {
  gamesPlayed: 2,
  asOf: 'Sep 8, 2026 (through Week 2, at St. Joseph/Metuchen)',
  source: { label: 'NJ Record Book — Team Stats', url: 'https://njrecordbook.com/football/bridgewater-raritan/' },
  passing: {
    columns: ['Player', 'GP', 'Comp %', 'Rating', 'Yds', 'TD', 'INT'],
    rows: [
      { cells: ['J. Baxter (#10)', 2, '54.4', '83.8', 458, 3, 2] },
    ],
  },
  rushing: {
    columns: ['Player', 'GP', 'Att', 'Yds', 'TD', 'YPC'],
    rows: [
      { cells: ['J. Black (#11)', 2, 45, 286, 5, '6.4'] },
      { cells: ['J. Okolo', 2, 14, 44, 1, '3.1'] },
      { cells: ['E. Woodring (#5)', 2, 6, 32, 0, '5.3'] },
      { cells: ['J. Baxter (#10)', 2, 2, 18, 0, '9.0'] },
      { cells: ['J. Baker', 1, 4, 13, 0, '3.3'] },
    ],
  },
  receiving: {
    columns: ['Player', 'GP', 'Rec', 'Yds', 'TD', 'Y/C'],
    rows: [
      { cells: ['E. Woodring (#5)', 2, 7, 126, 1, '18.0'] },
      { cells: ['D. Krizan', 2, 11, 123, 0, '11.2'] },
      { cells: ['J. Winne', 2, 1, 64, 1, '64.0'] },
      { cells: ['J. Schwamberger', 2, 1, 30, 1, '30.0'] },
      { cells: ['J. LoCrotondo', 2, 1, 27, 0, '27.0'] },
      { cells: ['B. Matos', 2, 2, 22, 0, '11.0'] },
      { cells: ['J. Black (#11)', 2, 2, 20, 0, '10.0'] },
      { cells: ['A. Lorino', 2, 3, 20, 0, '6.7'] },
      { cells: ['J. Baker', 1, 1, 16, 0, '16.0'] },
      { cells: ['J. Okolo', 2, 1, 6, 0, '6.0'] },
      { cells: ['C. Rutherford', 2, 1, 4, 0, '4.0'] },
    ],
  },
  defense: {
    columns: ['Player', 'GP', 'Tkl', 'Sk', 'TFL', 'INT', 'FF', 'FR'],
    rows: [
      { cells: ['N. Crovelli (#27)', 2, 22, 0, 2, 0, 1, 0] },
      { cells: ['J. Black (#11)', 2, 14, 0, 5, 0, 0, 0] },
      { cells: ['A. Lorino', 2, 11, 0, 1, 0, 0, 0] },
      { cells: ['T. Levash', 2, 10, 0, 2, 1, 0, 0] },
      { cells: ['J. Jones (#41)', 2, 9, 1, 2, 0, 0, 0] },
      { cells: ['E. Woodring (#5)', 2, 8, 0, 1, 1, 0, 0] },
      { cells: ['J. Okolo', 2, 8, 0, 0, 0, 0, 0] },
      { cells: ['D. Krizan', 2, 7, 0, 0, 0, 0, 0] },
      { cells: ['N. Zuckerman', 2, 7, 0, 0, 0, 0, 0] },
      { cells: ['J. Markovitch', 2, 7, 0, 2, 0, 0, 1] },
      { cells: ['J. Winne', 2, 6, 0, 0, 0, 0, 0] },
      { cells: ['F. Schenk', 2, 6, 0, 0, 0, 0, 0] },
      { cells: ['J. Schwamberger', 2, 5, 0, 0, 0, 0, 0] },
      { cells: ['J. LoCrotondo', 2, 5, 0, 0, 1, 0, 0] },
    ],
  },
  returning: {
    columns: ['Player', 'GP', 'KR Att', 'KR Yds', 'PR Att', 'PR Yds'],
    rows: [
      { cells: ['D. Krizan', 2, 5, 135, 0, 0] },
      { cells: ['J. LoCrotondo', 2, 1, 14, 0, 0] },
      { cells: ['E. Woodring (#5)', 2, 0, 0, 1, 9] },
    ],
  },
  kicking: {
    columns: ['Player', 'GP', 'FGM', 'FGA', 'XPM', 'XPA'],
    rows: [
      { cells: ['P. Lyons', 2, 0, 0, 8, 8] },
    ],
  },
  punting: {
    columns: ['Player', 'GP', 'Punts', 'Yds', 'Avg', 'Long'],
    rows: [
      { cells: ['J. Winne', 2, 8, 265, '33.1', 46] },
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
];
