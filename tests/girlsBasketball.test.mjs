// Data-integrity guard for the BRHS Girls Basketball hub (added 2026-10-27).
//
// The hub is refreshed by the daily sweep editing lib/girlsBasketball*.js.
// These tests run in `npm test` (and therefore in ship-website.command), so a
// malformed or fabricated-looking sweep edit stops the deploy instead of
// reaching production. They also cover the shared helpers the hub relies on.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { SCHEDULE_2026_27, countedGames } from '../lib/girlsBasketballSchedule.js';
import { GALLERIES_2026_27, getLatestGallery } from '../lib/girlsBasketballGalleries.js';
import { TEAM_LEADERS_2026_27, BOX_SCORES_2026_27 } from '../lib/girlsBasketballStats.js';
import { IMAGE_SLOTS } from '../lib/girlsBasketballImages.js';
import {
  ROSTER_2026_27, PORTRAIT_NUMBERS, ARTICLES, LAST_SEASON, HIGHLIGHTS_2026_27,
  OTHER_DIVISION_TEAMS_2026_27, STANDINGS_AS_OF, DATA_STATUS, CONFERENCE,
} from '../lib/girlsBasketballContent.js';
import { deriveTeamStats } from '../lib/teamStats.js';
import { getNextGame, getRecord, resolveScheduleDate } from '../lib/teamSchedule.js';

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const SCHED_DATE = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}$/;
const GRADES = new Set(['Senior', 'Junior', 'Sophomore', 'Freshman']);

// ── Schedule ────────────────────────────────────────────────────────────
test('schedule rows are well-formed', () => {
  for (const g of SCHEDULE_2026_27) {
    assert.match(g.date, SCHED_DATE, `bad date: ${g.date}`);
    assert.equal(typeof g.time, 'string');
    assert.match(g.opponent, /^(vs|at) \S/, `opponent must start with vs/at: ${g.opponent}`);
    assert.equal(typeof g.home, 'boolean');
    if (!g.neutral) assert.equal(g.home, g.opponent.startsWith('vs'), `home flag disagrees with opponent prefix: ${g.opponent}`);
    assert.ok(['scheduled', 'postponed', 'canceled', undefined].includes(g.status), `bad status: ${g.status}`);
    assert.ok(typeof g.source === 'string' && g.source.length > 0, `every row needs a source: ${g.date}`);
    if (g.result) {
      assert.ok([true, false, null].includes(g.result.win));
      assert.ok(Number.isInteger(g.result.usScore) && Number.isInteger(g.result.themScore), 'results need usScore/themScore');
      assert.equal(g.result.score, `${g.result.usScore}-${g.result.themScore}`);
      if (g.result.win !== null) assert.equal(g.result.win, g.result.usScore > g.result.themScore, `win flag disagrees with score on ${g.date}`);
      assert.notEqual(g.status, 'canceled', 'a canceled game cannot have a result');
    }
    if (g.galleryId) assert.ok(GALLERIES_2026_27.some((x) => x.id === g.galleryId), `galleryId ${g.galleryId} not in galleries`);
  }
});

test('schedule is chronological across New Year (Dec -> Mar)', () => {
  const now = new Date('2027-01-15T12:00:00');
  const times = SCHEDULE_2026_27.map((g) => resolveScheduleDate(g.date, now).getTime());
  for (let i = 1; i < times.length; i++) assert.ok(times[i] >= times[i - 1], `row ${i} out of order`);
});

// ── Galleries ───────────────────────────────────────────────────────────
test('galleries are real Pic-Time client links with ISO dates and unique ids', () => {
  const ids = new Set();
  for (const g of GALLERIES_2026_27) {
    assert.match(g.href, /^https:\/\/galleries\.zarconephotography\.com\/client\/[a-z0-9-]+$/);
    assert.match(g.date, ISO);
    assert.ok(!ids.has(g.id), `duplicate gallery id ${g.id}`);
    ids.add(g.id);
    if (g.kind) assert.ok(['game', 'senior-night', 'team', 'media-day'].includes(g.kind));
  }
});

// ── Roster / privacy ────────────────────────────────────────────────────
test('roster rows carry only published roster fields', () => {
  const allowed = new Set(['number', 'first', 'last', 'grade', 'position', 'height', 'stats', 'source']);
  const numbers = new Set();
  for (const p of ROSTER_2026_27) {
    for (const k of Object.keys(p)) assert.ok(allowed.has(k), `roster field "${k}" is not allowed (privacy)`);
    assert.ok(Number.isInteger(p.number));
    assert.ok(!numbers.has(p.number), `duplicate jersey #${p.number}`);
    numbers.add(p.number);
    assert.ok(GRADES.has(p.grade), `bad grade ${p.grade}`);
    assert.ok(p.first && p.last && p.source);
  }
  for (const n of PORTRAIT_NUMBERS) assert.ok(numbers.has(n), `portrait #${n} has no roster entry`);
});

// ── Stats ───────────────────────────────────────────────────────────────
test('stats entries match the StatsSection shape', () => {
  for (const l of TEAM_LEADERS_2026_27) assert.ok(l.category && l.name && l.value != null);
  for (const b of BOX_SCORES_2026_27) {
    assert.ok(b.week && b.result && Array.isArray(b.categories));
    assert.ok(Array.isArray(b.sources) && b.sources.length > 0, 'box scores need sources');
    for (const c of b.categories) for (const r of c.rows) assert.equal(r.cells.length, c.columns.length);
  }
});

// ── News / content ──────────────────────────────────────────────────────
test('articles have a real URL, ISO date, season and our own summary', () => {
  const urls = new Set();
  for (const a of ARTICLES) {
    assert.match(a.url, /^https:\/\//);
    assert.match(a.date, ISO);
    assert.ok(['2025-26', '2026-27'].includes(a.season));
    assert.ok(a.title && a.source);
    assert.ok(!urls.has(a.url), `duplicate article ${a.url}`);
    urls.add(a.url);
  }
  for (const it of LAST_SEASON.items) assert.match(it.source, /^https:\/\//);
  for (const h of HIGHLIGHTS_2026_27) { assert.match(h.date, ISO); assert.match(h.source, /^https:\/\//); }
});

test('standings only populate with an as-of date and a source', () => {
  if (OTHER_DIVISION_TEAMS_2026_27.length) {
    assert.match(STANDINGS_AS_OF || '', ISO);
    for (const t of OTHER_DIVISION_TEAMS_2026_27) assert.ok(t.team && t.source);
  }
  assert.ok(['2025-26', '2026-27'].includes(CONFERENCE.divisionConfirmedFor));
});

test('data-status records are present and dated', () => {
  for (const key of ['schedule', 'roster', 'results', 'stats', 'standings', 'news']) {
    const s = DATA_STATUS[key];
    assert.ok(s, `missing DATA_STATUS.${key}`);
    assert.match(s.lastChecked, ISO);
    assert.ok(['not-published', 'partial', 'current', 'source-unavailable'].includes(s.state));
  }
});

test('image slots point only at local Zarcone files', () => {
  const slots = [IMAGE_SLOTS.hero, IMAGE_SLOTS.team, IMAGE_SLOTS.feature, IMAGE_SLOTS.featuredGame, IMAGE_SLOTS.seniorNight, IMAGE_SLOTS.highlights, ...IMAGE_SLOTS.action];
  for (const s of slots) {
    if (s.src) {
      assert.match(s.src, /^\/photos\/girls-basketball\//, `slot src must live in public/photos/girls-basketball/: ${s.src}`);
      assert.ok(s.alt && s.alt.length > 10, 'real photos need alt text');
    }
  }
  for (const v of Object.values(IMAGE_SLOTS.tiles)) if (v) assert.match(v, /^\/photos\/girls-basketball\//);
});

// ── Shared helpers ──────────────────────────────────────────────────────
const SAMPLE = [
  { date: 'Wed, Dec 16', time: '5:30 PM', opponent: 'vs A', home: true, league: false, result: { win: true, score: '50-40', usScore: 50, themScore: 40 } },
  { date: 'Sat, Dec 19', time: '1:00 PM', opponent: 'at B', home: false, league: true, result: { win: false, score: '38-45', usScore: 38, themScore: 45 } },
  { date: 'Tue, Dec 22', time: '5:30 PM', opponent: 'vs C', home: true, league: true, status: 'canceled', result: null },
  { date: 'Tue, Jan 5', time: '5:30 PM', opponent: 'vs D', home: true, league: true, result: { win: true, score: '61-30', usScore: 61, themScore: 30 } },
  { date: 'Fri, Jan 8', time: '7:00 PM', opponent: 'at E', home: false, league: false, result: null },
];

test('deriveTeamStats computes record, PPG, splits and streak; null when nothing played', () => {
  assert.equal(deriveTeamStats([]), null);
  const s = deriveTeamStats(SAMPLE);
  assert.equal(s.wins, 2);
  assert.equal(s.losses, 1);
  assert.equal(s.pointsFor, 149);
  assert.equal(s.pointsAgainst, 115);
  assert.equal(s.ppg, '49.7');
  assert.equal(s.oppg, '38.3');
  assert.equal(s.leagueRecord, '1-1');
  assert.equal(s.homeRecord, '2-0');
  assert.equal(s.awayRecord, '0-1');
  assert.equal(s.streak, 'W1');
});

test('canceled games never count and next game crosses New Year', () => {
  const counted = countedGames(SAMPLE);
  assert.equal(counted.length, 4);
  assert.equal(getRecord(counted), '2-1');
  const next = getNextGame(counted, new Date('2027-01-06T12:00:00'));
  assert.equal(next.opponent, 'at E');
  // Before the season, with an empty schedule, there is no next game.
  assert.equal(getNextGame([]), null);
});

test('resolveScheduleDate picks the right year and never returns null', () => {
  const dec = new Date('2026-12-20T12:00:00');
  assert.equal(resolveScheduleDate('Tue, Jan 5', dec).getFullYear(), 2027);
  assert.equal(resolveScheduleDate('Wed, Dec 16', new Date('2027-01-10T12:00:00')).getFullYear(), 2026);
  assert.ok(Number.isNaN(resolveScheduleDate('').getTime()));
  assert.ok(Number.isNaN(resolveScheduleDate(null).getTime()));
});

test('getLatestGallery returns newest by event date', () => {
  assert.equal(getLatestGallery([]), null);
  const g = getLatestGallery([{ id: 'a', date: '2026-12-16' }, { id: 'b', date: '2027-01-05' }]);
  assert.equal(g.id, 'b');
});
