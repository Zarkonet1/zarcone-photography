// BRHS Panther Girls Volleyball — player stats, single source of truth.
//
// Feeds components/team-dashboard/StatsSection.jsx, the same generic
// component football's lib/footballStats.js feeds — see that file's header
// for the full rationale on why this component makes no sport-specific
// assumptions. Nothing here is football-specific; the shape is identical:
// TEAM_LEADERS_2026 ({ category, name, number, value, detail, photo }) and
// WEEKLY_BOX_SCORES_2026 ({ week, opponent, date, result, categories, sources }).
//
// TIER 1: every number here is pulled from NJRecordBook.com's published box
// scores (njrecordbook.com/girls-volleyball/game/{id}/) — never estimated.
// NJRecordBook (NJRB) is a real, established NJ HS sports stats site (every
// season since 2010; box scores, AdjEM power rankings, season leaders) —
// added to VOLLEYBALL-SOURCES.md 2026-09-08 after Tom flagged a screenshot
// of its Daily Leaders page showing real BR player stat lines (Krizan 27
// assists, Hilton 5 assists/11 digs on Sat Sep 5) that matched this exact
// source's Jefferson Township box score exactly, confirming it's accurate
// and worth building a Stats section around — this file is the result.
//
// Columns are K (kills), A (assists), D (digs), B (blocks — NJRB reports
// some block totals as half-points, e.g. 0.5/3.5, for shared/assisted
// blocks; left as-is rather than rounded), and Ace (service aces). NJRB's
// box scores don't report a serve-receive or hitting-percentage column, so
// none is included here — same no-fabrication rule as football's stats
// file: only what the source actually publishes.
//
// Built 2026-09-08 covering all 5 matches played so far this season. Add
// one entry to WEEKLY_BOX_SCORES_2026 per match as NJRB (or another sourced
// box score) publishes one, then re-check TEAM_LEADERS_2026 the same
// session — same hand-curated, not-auto-derived pattern as football's file.
// TEAM_LEADERS_2026 values below are NJRB's own season-to-date totals from
// the team stats page (njrecordbook.com/girls-volleyball/bridgewater-raritan/),
// not hand-summed across the per-match box scores, though both should agree.
//
// `photo` intentionally omitted on every leader below — unlike football,
// volleyball has no jersey-number-portraits-on-file convention yet
// (PORTRAIT_NUMBERS in page.jsx is still empty pending a Media Day shoot).
// StatsSection renders a jersey-number fallback tile when `photo` is absent.

export const TEAM_LEADERS_2026 = [
  {
    category: 'Kills',
    name: 'Margarita Silvar',
    number: 7,
    value: '50',
    detail: '17 in the Sep 2 five-set loss to Westfield',
  },
  {
    category: 'Assists',
    name: 'Brooke Krizan',
    number: 14,
    value: '118',
    detail: '39 vs. Westfield, 27 in the Sep 5 win over Jefferson Township',
  },
  {
    category: 'Digs',
    name: 'Camille Hilton',
    number: 5,
    value: '102',
    detail: '31 in the Sep 2 loss to Westfield',
  },
  {
    category: 'Aces',
    name: 'Klaudia Swider',
    number: 21,
    value: '13',
    detail: '8 alone in the Sep 5 win over Jefferson Township',
  },
  {
    category: 'Blocks',
    name: 'Viktoria Borodkin',
    number: 19,
    value: '13.5',
    detail: '5 in the Sep 2 loss to Westfield',
  },
];

// Per-match box scores — BR's own stat lines only (not the opponent's),
// same convention as football's file. `categories` uses a single generic
// "Box Score" table since NJRB reports one unified stat line per player
// (K/A/D/B/Ace) rather than football's split passing/rushing/receiving
// tables. Only players with at least one nonzero stat in a given match are
// listed, matching what NJRB itself displays.
export const WEEKLY_BOX_SCORES_2026 = [
  {
    week: 'Sep 1',
    opponent: 'at Hillsborough',
    date: 'Sep 1, 2026',
    result: 'W, 2-1 (25-13, 25-27, 25-18)',
    categories: [
      {
        label: 'Box Score',
        columns: ['Player', 'K', 'A', 'D', 'B', 'Ace'],
        rows: [
          { cells: ['Reese Albano (#2)', 8, 0, 0, 0, 1] },
          { cells: ['Margarita Silvar (#7)', 8, 0, 6, 0, 6] },
          { cells: ['Klaudia Swider (#21)', 6, 0, 3, 2, 1] },
          { cells: ['Viktoria Borodkin (#19)', 5, 1, 1, 1, 0] },
          { cells: ['Riley Romanak (#8)', 3, 0, 0, 0, 0] },
          { cells: ['Eleana Dai (#11)', 1, 0, 0, 0, 0] },
          { cells: ['Brooke Krizan (#14)', 1, 25, 10, 0, 1] },
          { cells: ['Autumn Sachs (#16)', 0, 0, 1, 0, 1] },
          { cells: ['Bellina Locrotondo (#3)', 0, 0, 1, 0, 0] },
          { cells: ['Camille Hilton (#5)', 0, 3, 25, 0, 3] },
          { cells: ['Clare Amalfitano (#6)', 0, 0, 1, 0, 0] },
        ],
      },
    ],
    sources: [
      { label: 'NJ Record Book', url: 'https://njrecordbook.com/girls-volleyball/game/18571/' },
    ],
  },
  {
    week: 'Sep 2',
    opponent: 'vs Westfield',
    date: 'Sep 2, 2026',
    result: 'L, 2-3 (25-21, 25-21, 14-25, 20-25, 9-15)',
    categories: [
      {
        label: 'Box Score',
        columns: ['Player', 'K', 'A', 'D', 'B', 'Ace'],
        rows: [
          { cells: ['Margarita Silvar (#7)', 17, 0, 8, 1, 0] },
          { cells: ['Reese Albano (#2)', 14, 0, 18, 1, 4] },
          { cells: ['Viktoria Borodkin (#19)', 5, 1, 2, 5, 0] },
          { cells: ['Klaudia Swider (#21)', 3, 0, 5, 2, 1] },
          { cells: ['Eleana Dai (#11)', 2, 0, 1, 0, 0] },
          { cells: ['Camille Hilton (#5)', 1, 1, 31, 0, 3] },
          { cells: ['Arielle Wang (#28)', 1, 0, 0, 0, 0] },
          { cells: ['Brooke Krizan (#14)', 0, 39, 17, 0, 1] },
          { cells: ['Jackie Oram (#25)', 0, 0, 6, 0, 0] },
          { cells: ['Autumn Sachs (#16)', 0, 0, 1, 0, 1] },
          { cells: ['Riley Romanak (#8)', 0, 0, 2, 0, 3] },
          { cells: ['Clare Amalfitano (#6)', 0, 0, 7, 0, 0] },
        ],
      },
    ],
    sources: [
      { label: 'NJ Record Book', url: 'https://njrecordbook.com/girls-volleyball/game/19107/' },
    ],
  },
  {
    week: 'Sep 3',
    opponent: 'vs North Hunterdon',
    date: 'Sep 3, 2026',
    result: 'W, 2-0 (25-19, 25-15)',
    categories: [
      {
        label: 'Box Score',
        columns: ['Player', 'K', 'A', 'D', 'B', 'Ace'],
        rows: [
          { cells: ['Margarita Silvar (#7)', 7, 0, 4, 0.5, 3] },
          { cells: ['Eleana Dai (#11)', 5, 0, 0, 0, 0] },
          { cells: ['Viktoria Borodkin (#19)', 3, 0, 2, 3.5, 0] },
          { cells: ['Klaudia Swider (#21)', 3, 0, 4, 1, 1] },
          { cells: ['Jackie Oram (#25)', 3, 0, 7, 0, 2] },
          { cells: ['Arielle Wang (#28)', 1, 0, 0, 0, 0] },
          { cells: ['Brooke Krizan (#14)', 0, 14, 7, 0, 2] },
          { cells: ['Autumn Sachs (#16)', 0, 0, 1, 0, 0] },
          { cells: ['Bellina Locrotondo (#3)', 0, 1, 0, 0, 0] },
          { cells: ['Camille Hilton (#5)', 0, 1, 18, 0, 0] },
          { cells: ['Riley Romanak (#8)', 0, 0, 1, 0, 1] },
        ],
      },
    ],
    sources: [
      { label: 'NJ Record Book', url: 'https://njrecordbook.com/girls-volleyball/game/19155/' },
    ],
  },
  {
    week: 'Sep 5',
    opponent: 'vs Jefferson Township',
    date: 'Sep 5, 2026',
    result: 'W, 3-0 (27-25, 25-14, 25-15)',
    categories: [
      {
        label: 'Box Score',
        columns: ['Player', 'K', 'A', 'D', 'B', 'Ace'],
        rows: [
          { cells: ['Viktoria Borodkin (#19)', 14, 0, 2, 1, 0] },
          { cells: ['Margarita Silvar (#7)', 12, 0, 3, 1, 2] },
          { cells: ['Jackie Oram (#25)', 5, 0, 5, 0, 4] },
          { cells: ['Brooke Krizan (#14)', 4, 27, 5, 1, 2] },
          { cells: ['Riley Romanak (#8)', 1, 0, 1, 0, 1] },
          { cells: ['Camille Hilton (#5)', 1, 5, 11, 0, 6] },
          { cells: ['Arielle Wang (#28)', 1, 0, 0, 0, 0] },
          { cells: ['Klaudia Swider (#21)', 0, 0, 6, 1, 8] },
          { cells: ['Bellina Locrotondo (#3)', 0, 0, 1, 0, 0] },
          { cells: ['Clare Amalfitano (#6)', 0, 0, 1, 0, 0] },
        ],
      },
    ],
    sources: [
      { label: 'NJ Record Book', url: 'https://njrecordbook.com/girls-volleyball/game/20743/' },
    ],
  },
  {
    week: 'Sep 5',
    opponent: 'vs Old Bridge',
    date: 'Sep 5, 2026',
    result: 'L, 0-3 (15-25, 10-25, 22-25)',
    categories: [
      {
        label: 'Box Score',
        columns: ['Player', 'K', 'A', 'D', 'B', 'Ace'],
        rows: [
          { cells: ['Jackie Oram (#25)', 6, 0, 5, 0, 1] },
          { cells: ['Margarita Silvar (#7)', 6, 1, 6, 0, 0] },
          { cells: ['Viktoria Borodkin (#19)', 4, 1, 1, 3, 0] },
          { cells: ['Brooke Krizan (#14)', 3, 13, 8, 0, 1] },
          { cells: ['Klaudia Swider (#21)', 1, 0, 4, 1, 2] },
          { cells: ['Riley Romanak (#8)', 1, 0, 1, 0, 2] },
          { cells: ['Camille Hilton (#5)', 0, 5, 17, 0, 0] },
          { cells: ['Sara Abbaszadeh (#12)', 0, 0, 1, 0, 0] },
        ],
      },
    ],
    sources: [
      { label: 'NJ Record Book', url: 'https://njrecordbook.com/girls-volleyball/game/19162/' },
    ],
  },
];
