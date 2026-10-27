// BRHS Panther Girls Basketball — player stats, 2026-27.
//
// Feeds components/team-dashboard/StatsSection.jsx, the same generic
// component football and volleyball use. Shapes are identical:
//   TEAM_LEADERS_2026_27:  { category, name, number, value, detail, photo }
//   BOX_SCORES_2026_27:    { week, opponent, date, result, categories, sources }
//     where categories = [{ label, columns, rows: [{ cells: [...] }] }]
//
// Basketball columns to use when box scores publish (only what the source
// actually reports — drop a column rather than fill it with zeros):
//   ['Player', 'PTS', 'REB', 'AST', 'STL', 'BLK', '3PM']
// Leader categories: Points, Rebounds, Assists, Steals, Blocks (add 3-Pointers
// or Free Throws later with no code change — StatsSection renders whatever
// categories it is given).
//
// SOURCE: NJ Record Book publishes per-game girls basketball box scores
// (njrecordbook.com/girls-basketball/...). MaxPreps' 2025-26 page says
// "Player Stats have not been entered" for this team, so do not count on
// MaxPreps for individual stats. BRRSD Athletics recaps cite individual
// lines for some games and can corroborate.
//
// Team-level stats (record, PPG, points allowed, streak) are NOT stored here —
// they derive from lib/girlsBasketballSchedule.js via lib/teamStats.js.
//
// Empty as of 2026-10-27 (no games played). StatsSection shows its built-in
// "Stats will appear here once games are played" state.
export const TEAM_LEADERS_2026_27 = [];

export const BOX_SCORES_2026_27 = [];
