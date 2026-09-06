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
// TIER 1: every number here is pulled from a published box score / recap
// (CJ Sports Radio, TAPinto, MyCentralJersey) — never estimated or
// projected. If a category isn't publicly reported for a given week (e.g.
// full-game receiving yardage totals, which none of the three Week 1
// recaps published — only each touchdown catch's own play yardage), it's
// left out or clearly labeled as play-level detail rather than guessed at
// as a season/game total. Same no-fabrication rule as the rest of this
// site (see CLAUDE.md).
//
// Add one entry to WEEKLY_BOX_SCORES_2026 per game as a recap publishes,
// then re-check TEAM_LEADERS_2026 the same session — it's hand-curated
// (whichever stat line is currently the team's best in each category), not
// auto-derived, since the source data isn't structured enough to aggregate
// automatically across weeks. Bump a leader only when a new game's box
// score actually overtakes the existing one.
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
    value: '253',
    detail: '13/20, 3 TD, 1 INT — vs. Woodbridge',
    photo: '/photos/media-day-portraits/10.jpg',
  },
  {
    category: 'Rushing Yards',
    name: 'Jahmier Black',
    number: 11,
    value: '118',
    detail: '1 TD — vs. Woodbridge',
    photo: '/photos/media-day-portraits/11.jpg',
  },
  {
    category: 'TD Passes',
    name: 'JB Baxter',
    number: 10,
    value: '3',
    detail: 'Woodring, Winne, Schwamberger',
    photo: '/photos/media-day-portraits/10.jpg',
  },
  {
    category: 'Sacks',
    name: 'Jamelle Jones',
    number: 41,
    value: '1',
    detail: '-8 yds, 3rd quarter — vs. Woodbridge',
    photo: '/photos/media-day-portraits/41.jpg',
  },
];

// Per-week box scores, one entry per game as recaps publish. `categories`
// is a generic { label, columns, rows } list — StatsSection renders
// whatever's here without assuming football-specific fields, so a
// receiving table can use "TD Play (Yds)" instead of "Yds" the week only
// touchdown-play yardage is publicly sourced (Week 1, below), and a future
// week with full receiving totals can use "Yds" instead without any
// component change.
export const WEEKLY_BOX_SCORES_2026 = [
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
          { cells: ['JB Baxter (#10)', '13/20', 253, 3, 1] },
        ],
      },
      {
        label: 'Rushing',
        columns: ['Player', 'Yds', 'TD'],
        rows: [
          { cells: ['Jahmier Black (#11)', 118, 1] },
        ],
      },
      {
        label: 'Receiving',
        columns: ['Player', 'TD Play (Yds)', 'TD'],
        rows: [
          { cells: ['Evan Woodring (#5)', 47, 1] },
          { cells: ['Jack Winne (#9)', 64, 1] },
          { cells: ['Jasper Schwamberger (#13)', 30, 1] },
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
      { label: 'CJ Sports Radio', url: 'https://cjsportsradio.com/2026/08/28/sophomore-qb-baxter-shines-as-no-6-bridgewater-raritan-opens-26-with-28-7-win-at-no-8-woodbridge/' },
      { label: 'TAPinto', url: 'https://www.tapinto.net/towns/woodbridge-slash-carteret/sections/sports/articles/football-bridgewater-raritan-beats-woodbridge-28-7-in-opening-game' },
      { label: 'MyCentralJersey', url: 'https://www.mycentraljersey.com/story/sports/high-school/football/2026/08/28/nj-high-school-football-scores-bridgewater-raritan-vs-woodbridge-2026/91399589007/' },
    ],
  },
  // Week 2, added 2026-09-05 (2nd sweep run). Only categories/rows CJSR's
  // recap explicitly attributed to a named BR player are included — same
  // no-fabrication rule as Week 1. The recap credits a 5th BR touchdown to
  // Jonathan Okolo (following a James LoCrotondo interception) but doesn't
  // specify whether it was a run or a catch, so it's deliberately left out
  // of the Rushing/Receiving tables rather than guessed into either one; his
  // score is still real and reflected in the final margin. No full-game
  // rushing/passing yardage totals were published — only each TD run's own
  // play yardage — so Rushing again uses "TD Play (Yds)" rather than a
  // game total, and TEAM_LEADERS_2026 was left unchanged this week (Black's
  // documented Week 2 yardage is TD-play-only, not a full-game total, so it
  // can't be compared against his existing 118-yard Week 1 leader entry).
  {
    week: 'Week 2',
    opponent: 'at St. Joseph (Metuchen)',
    date: 'Sep 5, 2026',
    result: 'L, 36-43',
    categories: [
      {
        label: 'Rushing',
        columns: ['Player', 'TD Play (Yds)', 'TD'],
        rows: [
          { cells: ['Jahmier Black (#11)', '1, 9, 26, 1 (4 TDs)', 4] },
        ],
      },
      {
        label: 'Defense',
        columns: ['Player', 'Notes'],
        rows: [
          { cells: ['Evan Woodring (#5)', 'INT, 0:51 into 1st quarter'] },
          { cells: ['James LoCrotondo', 'INT, mid-3rd quarter, set up an Okolo TD'] },
        ],
      },
    ],
    sources: [
      { label: 'CJ Sports Radio', url: 'https://cjsportsradio.com/2026/09/05/no-2-st-joseph-metuchen-takes-lead-early-lead-then-rallies-for-43-36-win-over-no-6-bridgewater-raritan/' },
    ],
  },
];
