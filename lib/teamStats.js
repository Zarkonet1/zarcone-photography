// Shared team-level stat derivation for any hub whose schedule rows carry
// result.usScore / result.themScore (basketball first, 2026-10-27; works for
// football or any points-based sport too). Pure functions over the schedule
// array — nothing is stored or hand-typed, so team stats can never drift from
// the results they're computed from.
//
// Returns null when no scored games exist, so callers render an "available
// once games are played" state instead of a row of zeros.
export function deriveTeamStats(games) {
  const played = (games || []).filter(
    (g) => g.result && !g.scrimmage && g.status !== 'canceled'
  );
  if (played.length === 0) return null;

  const wins = played.filter((g) => g.result.win === true).length;
  const losses = played.filter((g) => g.result.win === false).length;
  const scored = played.filter(
    (g) => Number.isFinite(g.result.usScore) && Number.isFinite(g.result.themScore)
  );
  const pointsFor = scored.reduce((n, g) => n + g.result.usScore, 0);
  const pointsAgainst = scored.reduce((n, g) => n + g.result.themScore, 0);
  const league = played.filter((g) => g.league);
  const homeGames = played.filter((g) => g.home);
  const awayGames = played.filter((g) => !g.home);

  // Current streak, newest game first (schedule arrays are chronological).
  let streak = null;
  const newestFirst = [...played].reverse();
  if (newestFirst.length && newestFirst[0].result.win != null) {
    const kind = newestFirst[0].result.win;
    let n = 0;
    for (const g of newestFirst) {
      if (g.result.win === kind) n += 1;
      else break;
    }
    streak = `${kind ? 'W' : 'L'}${n}`;
  }

  const record = (list) =>
    `${list.filter((g) => g.result.win === true).length}-${list.filter((g) => g.result.win === false).length}`;

  return {
    gamesPlayed: played.length,
    wins,
    losses,
    leagueRecord: league.length ? record(league) : null,
    homeRecord: homeGames.length ? record(homeGames) : null,
    awayRecord: awayGames.length ? record(awayGames) : null,
    scoredGames: scored.length,
    pointsFor: scored.length ? pointsFor : null,
    pointsAgainst: scored.length ? pointsAgainst : null,
    ppg: scored.length ? (pointsFor / scored.length).toFixed(1) : null,
    oppg: scored.length ? (pointsAgainst / scored.length).toFixed(1) : null,
    margin: scored.length ? ((pointsFor - pointsAgainst) / scored.length).toFixed(1) : null,
    streak,
  };
}
