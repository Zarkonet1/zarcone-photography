// Shared helpers for BRHS team hub pages (wrestling, football, and any future
// team page built the same way).
//
// TIER 1 REFACTOR (2026-07-10): these functions turn a single schedule/results
// array into the derived facts that used to be separately hand-typed in each
// page's SEASON_TRACKER array (Record, Next Match/Game, Latest Result). Enter
// a game/match once — as { date, opponent, result } — and these compute the
// rest. No database, no API, no server — pure functions over static data,
// evaluated at render time like everything else on these pages.
//
// Scope, on purpose: this only covers dual meets / games, where "result" is a
// clean win/loss. Tournament placements (Districts, Regions, States, sectional
// brackets) stay hand-written result strings in their own results array —
// "3 Champions: McCann, Levash, Vella" isn't a derivable win/loss, and trying
// to model full brackets here would mean rebuilding Trackwrestling. Not doing
// that. See project memory project_content_tier_framework_2026-07-09.

/**
 * A schedule entry looks like:
 *   { date: 'Thu, Aug 27', opponent: 'at Woodbridge', home: false, result: null }
 * Once played:
 *   { date: 'Thu, Aug 27', opponent: 'at Woodbridge', home: false,
 *     result: { win: true, score: '21–14' } }
 */

// Strips a leading "Thu, " / "Fri, " weekday prefix for the compact tracker
// display, matching the existing hand-written style ("Aug 27 — at Woodbridge").
function shortDate(date) {
  return date.replace(/^[A-Za-z]+,\s*/, '');
}

export function getRecord(games, fallback = 'Preseason · 0–0') {
  const played = games.filter((g) => g.result);
  if (played.length === 0) return fallback;
  const wins = played.filter((g) => g.result.win).length;
  const losses = played.length - wins;
  return `${wins}-${losses}`;
}

export function getNextMatch(games, fallback = 'TBA') {
  const upcoming = games.find((g) => !g.result);
  if (!upcoming) return fallback;
  return `${shortDate(upcoming.date)} — ${upcoming.opponent}`;
}

export function getLatestResult(games, fallback) {
  const played = [...games].reverse().find((g) => g.result);
  if (!played) return fallback;
  return `${shortDate(played.date)}: ${played.result.win ? 'W' : 'L'} ${played.result.score} ${played.opponent}`;
}

// Raw next-game object (not a formatted string) — added 2026-08-25 for the
// football dashboard rebuild's dynamic hero, which needs opponent/date/time/
// home/location as separate fields to lay out, not one pre-joined string
// like getNextMatch() above returns. Returns null once the schedule is
// exhausted (season complete) — callers should handle that themselves,
// same pattern as getNextMatch's fallback.
export function getNextGame(games) {
  return games.find((g) => !g.result) || null;
}

// Raw most-recently-played game object — same rationale as getNextGame,
// for the hero's "Final" state (needs opponent/date/result.usScore/
// result.themScore separately, not getLatestResult()'s joined string).
// Returns null before the season's first result posts.
export function getLastPlayedGame(games) {
  return [...games].reverse().find((g) => g.result) || null;
}

// Ordinal suffix for small positive integers (4 -> "4th", 5 -> "5th", ...).
// Used for coach tenure so "Nth season" / "Nth year at BRHS" stop being
// separately hand-typed strings that silently go stale every offseason —
// exactly what happened to the football coach-tenure stat in July 2026.
export function ordinal(n) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]}`;
}

/**
 * Computes a coach's season number and years-at-school from two start years
 * and the current season year — bump CURRENT_SEASON_YEAR once a year on each
 * page and both figures (and every place that quotes them) update together.
 */
export function getCoachTenure({ headCoachStartYear, joinedProgramYear, currentSeasonYear }) {
  return {
    seasonNumber: currentSeasonYear - headCoachStartYear + 1,
    yearsAtSchool: currentSeasonYear - joinedProgramYear + 1,
  };
}
