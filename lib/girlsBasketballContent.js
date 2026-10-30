// BRHS Panther Girls Basketball hub — roster, news, standings, highlights
// and data-freshness records. Everything here is either sourced (URL + date
// in a comment) or deliberately empty. Updated by the daily
// brhs-daily-source-sweep task per BASKETBALL-SOURCES.md; validated by
// tests/girlsBasketball.test.mjs.

// ── Relationship status ────────────────────────────────────────────────
// 'independent' = no signed agreement (launch state, 2026-10-27).
// 'pilot'       = Coach Brooks has signed the 5-game pilot package. Flip this
//                 ONE line the day the agreement is signed; the header credit,
//                 About section, FAQ and footer disclaimer all switch wording.
// Either way the page never claims to be an official school/district site,
// never says "exclusive", and uses no BRHS crest without BRRSD's OK.
export const HUB_STATUS = 'independent';

// ── Season identity ────────────────────────────────────────────────────
export const SEASON_LABEL = '2026–27';
export const HEAD_COACH = 'Xavier Brooks';
// BRRSD Athletics, Dec 10, 2025 (article/2592287) and Feb 1, 2026
// (article/2671822): 2025-26 was Brooks' fourth season. 2026-27 = fifth.
// Derived, not hand-typed — bump CURRENT_SEASON_START each year.
export const COACH_FIRST_SEASON_START = 2022; // 2022-23 season
export const CURRENT_SEASON_START = 2026; // 2026-27 season

// Conference: BRRSD Athletics (Dec 26, 2025, article/2612991) says BR plays
// in the Skyland Conference, Raritan Division, for 2025-26. The 2026-27
// division alignment has not been published; the page says "Skyland
// Conference" and labels the division as the 2025-26 alignment until a
// 2026-27 source confirms it. Set divisionConfirmedFor to '2026-27' then.
export const CONFERENCE = {
  conference: 'Skyland Conference',
  division: 'Raritan Division',
  divisionConfirmedFor: '2025-26',
  source: 'https://www.brrsd.org/o/brrhs/article/2612991',
};

// ── Roster ─────────────────────────────────────────────────────────────
// EMPTY until BRHS Athletics, MaxPreps or NJ Record Book publishes the
// 2026-27 varsity roster. Do NOT carry over the 2025-26 roster.
// Row shape: { number: 3, first: 'Jane', last: 'Doe', grade: 'Junior',
//              position: 'G', height: "5'8\"" (only if published), source: 'MaxPreps' }
// Grade must be one of Senior | Junior | Sophomore | Freshman.
// Never add contact info, birthdates, hometowns or anything not on the
// published roster.
export const ROSTER_2026_27 = [];

// Jersey numbers that have an approved portrait on file at
// public/photos/girls-basketball-portraits/{number}.jpg. Add a number only
// after Tom supplies and approves that athlete's photo.
export const PORTRAIT_NUMBERS = new Set([]);

// ── Coaching staff ─────────────────────────────────────────────────────
// Head coach per Tom (brief, 2026-10-27) and BRRSD Athletics 2025-26
// coverage. Assistants: none published — add only from a public source.
export const ASSISTANT_COACHES = [];

// ── Standings ──────────────────────────────────────────────────────────
// Other division teams' records, 2026-27. BR's own row derives from the
// schedule. Leave EMPTY until (a) the 2026-27 division membership is
// confirmed and (b) conference games have been played. Shape:
//   { team: 'Hunterdon Central', confWins: 0, confLosses: 0, wins: 0, losses: 0, asOf: '2027-01-10', source: 'MaxPreps' }
export const OTHER_DIVISION_TEAMS_2026_27 = [];
export const STANDINGS_AS_OF = null; // 'YYYY-MM-DD' of the last standings pull

// ── News ───────────────────────────────────────────────────────────────
// Real coverage only. `date` = publish date (YYYY-MM-DD). `summary` is our
// own one-line description, never copied article text. `season` lets the
// page label last season's coverage as such.
export const ARTICLES = [
  {
    title: "Boys' and girls' basketball teams both ended with a winning season at Bridgewater-Raritan High School",
    source: 'BRRSD Athletics',
    url: 'https://www.brrsd.org/o/brrhs/article/2740267',
    date: '2026-03-02',
    season: '2025-26',
    summary: 'Season wrap: the girls finished 14-13 after a first-round NJSIAA North 2, Group 4 loss to Watchung Hills.',
  },
  {
    title: "Class of 2026 graduate Bri Cacchio honored during Senior Day for the Bridgewater-Raritan High School girls' basketball team",
    source: 'BRRSD Athletics',
    url: 'https://www.brrsd.org/o/brrhs/article/2710896',
    date: '2026-02-16',
    season: '2025-26',
    summary: "Senior Day coverage, including a junior's 1,000th career point, ahead of the state tournament.",
  },
  {
    title: "Bridgewater-Raritan High School girls' basketball team opened the Somerset County Tournament with a victory over Manville High School",
    source: 'BRRSD Athletics',
    url: 'https://www.brrsd.org/o/brrhs/article/2671822',
    date: '2026-02-01',
    season: '2025-26',
    summary: 'The No. 10 seed opened the county tournament with a 57-14 first-round win.',
  },
  {
    title: "Bridgewater-Raritan High School girls' basketball team rolled past Allentown High School",
    source: 'BRRSD Athletics',
    url: 'https://www.brrsd.org/o/brrhs/article/2612991',
    date: '2025-12-26',
    season: '2025-26',
    summary: 'A 40-18 road win that moved the Panthers to 2-1.',
  },
  {
    title: "A confident girls' basketball team will hit the court this winter for Bridgewater-Raritan High School",
    source: 'BRRSD Athletics',
    url: 'https://www.brrsd.org/o/brrhs/article/2592287',
    date: '2025-12-10',
    season: '2025-26',
    summary: "Preseason preview: the coach called it the deepest roster of his tenure, with a 15-win goal.",
  },
];

// ── Last season in review (2025-26) ─────────────────────────────────────
// Team-level facts only, each from a BRRSD Athletics article above.
export const LAST_SEASON = {
  season: '2025-26',
  record: '14-13',
  items: [
    { stat: '14-13', label: 'Final record', note: 'A winning season under Coach Brooks', source: 'https://www.brrsd.org/o/brrhs/article/2740267' },
    { stat: 'No. 7', label: 'NJSIAA seed', note: 'North 2, Group 4 — lost 46-40 to No. 10 Watchung Hills in Round 1', source: 'https://www.brrsd.org/o/brrhs/article/2740267' },
    { stat: '57-14', label: 'County tournament opener', note: 'Round 1 win over Manville as the No. 10 seed', source: 'https://www.brrsd.org/o/brrhs/article/2671822' },
    { stat: '1,000', label: 'Career-points milestone', note: 'Reached by a junior during the Feb 2026 Senior Day game', source: 'https://www.brrsd.org/o/brrhs/article/2710896' },
  ],
};

// ── 2026-27 season highlights ───────────────────────────────────────────
// Sourced milestones only (1,000-point games, tournament titles, records).
// Wins, Senior Night and postseason games are derived automatically from
// the schedule; list here only what the schedule can't express.
// Shape: { date: '2027-01-20', title: '...', body: '...', source: 'https://...' }
export const HIGHLIGHTS_2026_27 = [];

// ── Data freshness ──────────────────────────────────────────────────────
// The sweep updates lastChecked every run (whether or not anything changed)
// and lastChanged when data actually changes. The page shows lastChecked
// next to each section so a visitor never mistakes stale data for current.
// state: 'not-published' | 'partial' | 'current' | 'source-unavailable'
export const DATA_STATUS = {
  schedule: { state: 'not-published', lastChecked: '2026-10-30', lastChanged: null, sources: ['MaxPreps', 'NJ Record Book', 'BRRSD Athletics'] },
  roster: { state: 'not-published', lastChecked: '2026-10-30', lastChanged: null, sources: ['MaxPreps', 'NJ Record Book', 'BRRSD Athletics'] },
  results: { state: 'not-published', lastChecked: '2026-10-30', lastChanged: null, sources: ['MaxPreps', 'NJ Record Book'] },
  stats: { state: 'not-published', lastChecked: '2026-10-30', lastChanged: null, sources: ['NJ Record Book'] },
  standings: { state: 'not-published', lastChecked: '2026-10-30', lastChanged: null, sources: ['MaxPreps', 'NJ Record Book'] },
  news: { state: 'current', lastChecked: '2026-10-30', lastChanged: '2026-10-27', sources: ['BRRSD Athletics', 'TAPinto', 'CJ Sports Radio', 'MaxPreps', 'NJ.com'] },
};
