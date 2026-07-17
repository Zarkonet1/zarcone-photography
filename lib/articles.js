// Shared helpers for the team-hub "In The News" article lists
// (app/brhs-panther-football, app/brhs-panther-wrestling).
//
// Every article object carries a `date` field: 'YYYY-MM-DD', the article's
// real publish date (verified via the source, or a documented estimate when
// no exact date could be found — never invented). That single field is what
// makes both of these problems solve themselves instead of needing manual
// upkeep:
//
//   1. Ordering — sortArticlesByDate() sorts newest-first automatically, so
//      whoever adds an article next doesn't have to figure out where in the
//      array it belongs.
//   2. "New" flagging — isRecentArticle() derives a boolean from that same
//      date instead of a hand-set flag someone has to remember to remove.
//      This is the same "derive it, don't duplicate it" pattern as
//      lib/teamSchedule.js (see the COACHES[0].title staleness note there) —
//      a manually-set isNew: true is exactly the kind of thing that goes
//      stale silently.

export function sortArticlesByDate(articles) {
  return [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));
}

// An article counts as "new" for `days` days after its publish date (default
// 21 — roughly one news cycle for this kind of local sports coverage).
export function isRecentArticle(dateStr, days = 21) {
  if (!dateStr) return false;
  const published = new Date(dateStr);
  if (Number.isNaN(published.getTime())) return false;
  const diffDays = (Date.now() - published.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
}
