'use client';

// BRHS Panther Girls Varsity Basketball — 2026-27 Media Hub (built 2026-10-27).
//
// Same family as the football/volleyball hubs: same team-dashboard components
// (DashboardHeader, NextGameHero, StatCards, MediaCenterGrid,
// LatestFromPanthers, CompactSchedule, StatsSection), same Panther design
// tokens (imports the volleyball hub's CSS module rather than copying it a
// fourth time), same lib/teamSchedule.js derivations. New, reusable pieces:
// components/team-dashboard/PhotoSlot.jsx and lib/teamStats.js.
//
// Data lives in lib/girlsBasketball*.js. This file holds layout only — the
// daily sweep never needs to edit it. Every section has an empty state, so
// the page renders correctly with zero schedule/roster/stats/galleries,
// which is exactly its state at launch (no 2026-27 data published yet).
//
// POSITIONING (brief §7): independent media resource developed and
// maintained by Zarcone Photography. Never "official", never "partner",
// never "exclusive". No official BRHS crest is used — typographic badge
// only — until BRHS/BRRSD authorizes use of its marks.

import { useState } from 'react';
import Link from 'next/link';
import Lightbox from '@/components/Lightbox';
import Testimonials from '@/components/Testimonials';
import GalleryAlertSignup from '@/components/GalleryAlertSignup';
import GalleryAlertToast from '@/components/GalleryAlertToast';
import DashboardHeader from '@/components/team-dashboard/DashboardHeader';
import NextGameHero from '@/components/team-dashboard/NextGameHero';
import StatCards from '@/components/team-dashboard/StatCards';
import MediaCenterGrid from '@/components/team-dashboard/MediaCenterGrid';
import LatestFromPanthers from '@/components/team-dashboard/LatestFromPanthers';
import CompactSchedule from '@/components/team-dashboard/CompactSchedule';
import StatsSection from '@/components/team-dashboard/StatsSection';
import PhotoSlot from '@/components/team-dashboard/PhotoSlot';
import vb from '../brhs-panther-volleyball/page.module.css';
import styles from './page.module.css';
import { getRecord, getNextGame, getLastPlayedGame, resolveScheduleDate, ordinal } from '@/lib/teamSchedule';
import { sortArticlesByDate, isRecentArticle } from '@/lib/articles';
import { slugifyPlayerName, jumpToPlayerAnchor } from '@/lib/players';
import { deriveTeamStats } from '@/lib/teamStats';
import { SCHEDULE_2026_27, countedGames } from '@/lib/girlsBasketballSchedule';
import { GALLERIES_2026_27, getLatestGallery } from '@/lib/girlsBasketballGalleries';
import { TEAM_LEADERS_2026_27, BOX_SCORES_2026_27 } from '@/lib/girlsBasketballStats';
import { IMAGE_SLOTS, portraitSrc } from '@/lib/girlsBasketballImages';
import {
  SEASON_LABEL,
  HEAD_COACH,
  COACH_FIRST_SEASON_START,
  CURRENT_SEASON_START,
  CONFERENCE,
  ROSTER_2026_27,
  PORTRAIT_NUMBERS,
  ASSISTANT_COACHES,
  OTHER_DIVISION_TEAMS_2026_27,
  STANDINGS_AS_OF,
  ARTICLES,
  LAST_SEASON,
  HIGHLIGHTS_2026_27,
  DATA_STATUS,
} from '@/lib/girlsBasketballContent';

const PAGE_PATH = '/brhs-panther-girls-basketball';
const TEAM = 'Bridgewater-Raritan Panthers Girls Basketball';
const PAGE_TITLE = 'BRHS Panthers Girls Varsity Basketball — 2026–27 Season';

// ── Formatting helpers ────────────────────────────────────────────────
// ISO 'YYYY-MM-DD' -> 'Oct 27, 2026'. Parsed at UTC noon so the day never
// shifts between Vercel (UTC) and a visitor's timezone (no hydration drift).
function fmtIso(iso, withYear = true) {
  if (!iso) return '';
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', withYear ? { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' } : { month: 'short', day: 'numeric', timeZone: 'UTC' });
}
function checkedLine(key) {
  const s = DATA_STATUS[key];
  if (!s) return '';
  return `Checked ${fmtIso(s.lastChecked)} against ${s.sources.join(', ')}.`;
}
function resultLabel(r) {
  if (!r) return '';
  return `${r.win == null ? 'T' : r.win ? 'W' : 'L'} ${r.score}`;
}

// ── Derived data (no hand-typed duplicates) ───────────────────────────
const COUNTED = countedGames(SCHEDULE_2026_27);
const HAS_SCHEDULE = SCHEDULE_2026_27.length > 0;
const NEXT_GAME = getNextGame(COUNTED);
const LAST_PLAYED = getLastPlayedGame(COUNTED);
const RECORD = getRecord(COUNTED, '0-0');
const TEAM_STATS = deriveTeamStats(COUNTED);
const LATEST_GALLERY = getLatestGallery(GALLERIES_2026_27);
const GALLERIES_BY_DATE = [...GALLERIES_2026_27].sort((a, b) => new Date(b.date) - new Date(a.date));
const SENIOR_NIGHT_GALLERY = GALLERIES_2026_27.find((g) => g.kind === 'senior-night') || null;
const GALLERY_BY_ID = Object.fromEntries(GALLERIES_2026_27.map((g) => [g.id, g]));
const COACH_SEASON = CURRENT_SEASON_START - COACH_FIRST_SEASON_START + 1;

const ROSTER = ROSTER_2026_27.map((p) => ({ ...p, slug: slugifyPlayerName(`${p.first} ${p.last}`) }))
  .sort((a, b) => (a.number ?? 999) - (b.number ?? 999));
const ROSTER_HAS_HEIGHT = ROSTER.some((p) => p.height);
const ROSTER_HAS_POSITION = ROSTER.some((p) => p.position);
const ROSTER_HAS_STATS = ROSTER.some((p) => p.stats && p.stats.ppg != null);

const LEAGUE_PLAYED = COUNTED.filter((g) => g.league && g.result);
const BR_STANDINGS_ROW = {
  team: 'Bridgewater-Raritan',
  current: true,
  confWins: LEAGUE_PLAYED.filter((g) => g.result.win === true).length,
  confLosses: LEAGUE_PLAYED.filter((g) => g.result.win === false).length,
  wins: TEAM_STATS ? TEAM_STATS.wins : 0,
  losses: TEAM_STATS ? TEAM_STATS.losses : 0,
};
const STANDINGS_READY = OTHER_DIVISION_TEAMS_2026_27.length > 0 && LEAGUE_PLAYED.length > 0;
const STANDINGS = [BR_STANDINGS_ROW, ...OTHER_DIVISION_TEAMS_2026_27].sort(
  (a, b) => b.confWins - b.confLosses - (a.confWins - a.confLosses) || b.wins - a.wins
);
const DIVISION_TEXT = CONFERENCE.divisionConfirmedFor === '2026-27'
  ? `${CONFERENCE.conference} · ${CONFERENCE.division}`
  : CONFERENCE.conference;

const NEWS = sortArticlesByDate(ARTICLES);
const NEWS_THIS_SEASON = NEWS.some((a) => a.season === '2026-27');
const EDITORIAL_ITEMS = NEWS.slice(0, 3).map((a) => ({ ...a, img: null }));
const NEWS_HAS_NEW = NEWS.length > 0 && isRecentArticle(NEWS[0].date);

// Season highlights: derived from the schedule (postseason games, Senior
// Night) plus sourced milestones. Nothing is inferred beyond what the row says.
const DERIVED_HIGHLIGHTS = [
  ...COUNTED.filter((g) => g.seniorNight).map((g) => ({
    key: `sn-${g.date}`,
    eyebrow: 'Senior Night',
    title: `${g.date} — ${g.opponent}`,
    body: g.result ? `Final: ${resultLabel(g.result)}.` : `Scheduled ${g.time}.`,
    href: g.galleryId && GALLERY_BY_ID[g.galleryId] ? GALLERY_BY_ID[g.galleryId].href : null,
  })),
  ...COUNTED.filter((g) => g.postseason && g.result).map((g) => ({
    key: `ps-${g.date}`,
    eyebrow: 'Postseason',
    title: g.postseason,
    body: `${g.date} — ${g.opponent}: ${resultLabel(g.result)}.`,
    href: g.galleryId && GALLERY_BY_ID[g.galleryId] ? GALLERY_BY_ID[g.galleryId].href : null,
  })),
  ...HIGHLIGHTS_2026_27.map((h) => ({
    key: `h-${h.date}-${h.title}`,
    eyebrow: fmtIso(h.date),
    title: h.title,
    body: h.body,
    href: h.source,
  })),
];

const MEDIA_TILES = [
  { label: 'Game Galleries', sub: 'View Photos', href: '#gallery-alert', img: IMAGE_SLOTS.tiles.galleries },
  { label: 'Meet the Team', sub: 'Roster & Coach', href: '#roster', img: IMAGE_SLOTS.tiles.team },
  { label: 'Schedule', sub: 'Games & Results', href: '#schedule', img: IMAGE_SLOTS.tiles.schedule },
  { label: 'Stats', sub: 'Team & Players', href: '#team-stats', img: IMAGE_SLOTS.tiles.stats },
  { label: 'News', sub: 'Latest Coverage', href: '#news', img: IMAGE_SLOTS.tiles.news },
];

const HERO_GRADIENT =
  'radial-gradient(90% 120% at 85% 110%, rgba(200,16,46,0.35) 0%, rgba(200,16,46,0) 55%), linear-gradient(160deg, #1a1a1d 0%, #070708 70%)';

const FAQ = [
  {
    q: 'Is this an official Bridgewater-Raritan website?',
    a: 'No. This is an independent media hub built and maintained by Zarcone Photography. It is not operated or endorsed by Bridgewater-Raritan High School or the Bridgewater-Raritan Regional School District. For official team information, use BRHS Athletics.',
  },
  {
    q: 'Where does the schedule, roster and stats information come from?',
    a: 'Public sources only: BRHS Athletics, MaxPreps and NJ Record Book. Zarcone Photography checks them daily during the season and posts updates here. Nothing is entered by coaches, players or parents.',
  },
  {
    q: 'Why is the schedule or roster empty?',
    a: 'Because it has not been published yet. We post the 2026–27 schedule and varsity roster once they appear on a public source, and we never fill in last season’s information as a placeholder.',
  },
  {
    q: 'How do I find photos from a game?',
    a: 'Game galleries are listed in the Photography section once they post. Sign up for a gallery alert to get an email when new photos go live.',
  },
  {
    q: 'Can I ask for a photo or a name to be removed?',
    a: 'Yes. Use the contact form below and we will take it down promptly — no explanation needed.',
  },
];

export default function BRHSPantherGirlsBasketballPage() {
  const [portrait, setPortrait] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', interestedIn: 'Game Photos', message: '' });
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fname: form.name,
          email: form.email,
          phone: form.phone,
          sport: 'Girls Basketball',
          type: form.interestedIn,
          message: form.message,
          source: 'BRHS Panther Girls Basketball hub',
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setForm({ name: '', email: '', phone: '', interestedIn: 'Game Photos', message: '' });
    } catch {
      setStatus('error');
    }
  }

  // Structured data: a WebPage *about* the team, published by ZP. Not a
  // SportsTeam entity published as if by the school.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'BRHS Panther Girls Basketball Media Hub 2026–27',
    url: `https://www.zarconephotography.com${PAGE_PATH}`,
    description: 'Independent media hub for Bridgewater-Raritan Panther Girls Varsity Basketball, maintained by Zarcone Photography.',
    publisher: {
      '@type': 'LocalBusiness',
      name: 'Zarcone Photography',
      url: 'https://www.zarconephotography.com',
      telephone: '(908) 777-0631',
      address: { '@type': 'PostalAddress', addressLocality: 'Bridgewater', addressRegion: 'NJ', addressCountry: 'US' },
    },
    about: {
      '@type': 'SportsTeam',
      name: 'Bridgewater-Raritan High School Girls Varsity Basketball',
      sport: 'Basketball',
      coach: { '@type': 'Person', name: HEAD_COACH },
    },
  };

  const alertColors = {
    accent: 'var(--br-red)',
    accentDark: 'var(--br-red-dark)',
    text: 'var(--br-silver)',
    textSoft: 'var(--br-silver-dim)',
    btnText: '#fff',
  };

  return (
    <div className={vb.wrap}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <GalleryAlertToast
        team="Girls Basketball"
        source="BRHS Panther Girls Basketball — Gallery Alert Toast"
        dismissKey="gr-alert-dismissed-girls-basketball"
        colors={{ ...alertColors, bg: '#141414', border: 'rgba(200,16,46,0.45)' }}
      />

      <DashboardHeader
        teamName={TEAM}
        season={`${SEASON_LABEL} Season`}
        logoText="BR"
        logoBadgeColor="var(--br-silver, #b9bec7)"
        links={[
          { href: '#gallery-alert', label: 'Galleries' },
          { href: '#roster', label: 'Team' },
          { href: '#schedule', label: 'Schedule' },
          { href: '#team-stats', label: 'Stats' },
        ]}
        creditLine="Zarcone Photography"
        creditSuffix="Independent Media Hub"
      />

      {/* Preseason (no schedule published): branded season lockup with the
          hero photo slot. Once the schedule exists, the shared dynamic
          NextGameHero takes over (next game / final / gallery / postponed). */}
      {!HAS_SCHEDULE ? (
        <section className={styles.seasonHero} aria-labelledby="gb-title">
          {IMAGE_SLOTS.hero.src ? (
            <div className={styles.seasonHeroBg} aria-hidden="true">
              <PhotoSlot slot={IMAGE_SLOTS.hero} sizes="100vw" priority className={styles.seasonHeroPhoto} />
            </div>
          ) : (
            <div className={styles.seasonHeroCourt} aria-hidden="true" />
          )}
          <div className={styles.seasonHeroScrim} aria-hidden="true" />
          <div className={styles.seasonHeroContent}>
            <h1 id="gb-title" className={styles.seasonHeroTitle}>
              <span className={styles.seasonHeroKicker}>BRHS Panthers</span>
              <span className={styles.seasonHeroMain}>Girls Varsity <em>Basketball</em></span>
              <span className={styles.seasonHeroSeason}>2026–2027 Season</span>
            </h1>
            <p className={styles.seasonHeroSub}>
              Schedule, results, stats, news and game photography — in one place, updated from public sources throughout the season.
            </p>
            <div className={styles.seasonHeroCtas}>
              <a href="#gallery-alert" className={vb.btnRed}>Get Gallery Alerts</a>
              <a href="#schedule" className={vb.btnGhost}>Schedule Status →</a>
            </div>
          </div>
        </section>
      ) : (
      <NextGameHero
        nextGame={NEXT_GAME}
        lastPlayedGame={LAST_PLAYED}
        latestGallery={LATEST_GALLERY}
        bgPhotoSrc={IMAGE_SLOTS.hero.src}
        bgObjectPosition={IMAGE_SLOTS.hero.position}
        fallbackGradient={HERO_GRADIENT}
        teamName={TEAM}
        teamMatchupName="Bridgewater-Raritan Panthers"
        teamShortLabel="BRHS"
        pageTitle={PAGE_TITLE}
        resolveGameDate={resolveScheduleDate}
        noGameLabel={`${SEASON_LABEL} Season Complete`}
      />
      )}

      <StatCards
        record={RECORD}
        nextGameDate={NEXT_GAME ? NEXT_GAME.date : HAS_SCHEDULE ? 'Season Complete' : 'TBA'}
        nextGameOpponent={NEXT_GAME ? NEXT_GAME.opponent : HAS_SCHEDULE ? null : 'Schedule not yet published'}
        latestResult={LAST_PLAYED ? `${resultLabel(LAST_PLAYED.result)} ${LAST_PLAYED.opponent}` : null}
        seasonYear={SEASON_LABEL}
        seasonSub={`Head Coach ${HEAD_COACH}`}
      />

      {/* ── Team Overview ─────────────────────────────────────────── */}
      <section id="overview" style={{ scrollMarginTop: 120 }}>
        <div className={styles.overview}>
          <div>
            <span className={vb.eyebrowRed}>Team Overview</span>
            <h2 className={vb.sectionH2} style={{ marginTop: 12 }}>Panther <em>Girls Basketball</em></h2>
            <dl className={styles.factList}>
              <div><dt>School</dt><dd>Bridgewater-Raritan High School</dd></div>
              <div><dt>Team</dt><dd>Girls Varsity Basketball</dd></div>
              <div><dt>Season</dt><dd>{SEASON_LABEL}</dd></div>
              <div><dt>Head Coach</dt><dd>{HEAD_COACH} <span className={styles.muted}>· {ordinal(COACH_SEASON)} season</span></dd></div>
              <div>
                <dt>Conference</dt>
                <dd>
                  {CONFERENCE.conference}
                  {CONFERENCE.divisionConfirmedFor === '2026-27'
                    ? ` · ${CONFERENCE.division}`
                    : <span className={styles.muted}> · {CONFERENCE.division} in {CONFERENCE.divisionConfirmedFor}</span>}
                </dd>
              </div>
              <div><dt>Record</dt><dd>{TEAM_STATS ? RECORD : <span className={styles.muted}>Season not started</span>}</dd></div>
              <div><dt>Last Result</dt><dd>{LAST_PLAYED ? `${resultLabel(LAST_PLAYED.result)} ${LAST_PLAYED.opponent}` : <span className={styles.muted}>—</span>}</dd></div>
              <div><dt>Next Game</dt><dd>{NEXT_GAME ? `${NEXT_GAME.date} · ${NEXT_GAME.opponent} · ${NEXT_GAME.time}` : <span className={styles.muted}>{HAS_SCHEDULE ? 'Season complete' : 'Schedule not yet published'}</span>}</dd></div>
              <div><dt>Last Season</dt><dd>{LAST_SEASON.record} ({LAST_SEASON.season})</dd></div>
            </dl>
          </div>
          <div className={styles.overviewPhotos}>
            <PhotoSlot slot={IMAGE_SLOTS.team} caption="Team photo coming this season" sizes="(max-width: 900px) 100vw, 45vw" />
            <PhotoSlot slot={IMAGE_SLOTS.feature} caption="Game-day feature coming this season" sizes="(max-width: 900px) 60vw, 25vw" className={styles.featureSlot} />
          </div>
        </div>
      </section>

      <MediaCenterGrid tiles={MEDIA_TILES} newsHasNew={NEWS_HAS_NEW} />

      <LatestFromPanthers items={EDITORIAL_ITEMS} heading={NEWS_THIS_SEASON ? 'Latest From The Panthers' : 'From Last Season'} />

      <CompactSchedule games={SCHEDULE_2026_27} emptyMessage="The 2026–27 schedule will post here once it is published." />

      {/* ── Schedule & Results ───────────────────────────────────── */}
      <section id="schedule" style={{ scrollMarginTop: 120 }}>
        <div className={vb.sectionHead}>
          <div>
            <span className={vb.eyebrowRed}>{SEASON_LABEL} Season</span>
            <h2 className={vb.sectionH2} style={{ marginTop: 12 }}>Schedule <em>&amp; Results</em></h2>
          </div>
          <p className={vb.sectionSub}>
            {HAS_SCHEDULE
              ? `${RECORD} overall${TEAM_STATS && TEAM_STATS.leagueRecord ? `, ${TEAM_STATS.leagueRecord} in the ${CONFERENCE.conference}` : ''}. League games are marked.`
              : 'Every game, home or away, with results and galleries as the season goes.'}
          </p>
        </div>

        {HAS_SCHEDULE ? (
          <>
            <table className={vb.scheduleTable}>
              <thead>
                <tr><th>Date</th><th>Time</th><th>Opponent</th><th>Location</th><th>Result</th><th>Photos</th></tr>
              </thead>
              <tbody>
                {SCHEDULE_2026_27.map((g, i) => {
                  const gallery = g.galleryId ? GALLERY_BY_ID[g.galleryId] : null;
                  const rowClass = [g.league ? vb.leagueRow : '', g.status === 'canceled' ? styles.canceledRow : ''].join(' ');
                  return (
                    <tr key={i} className={rowClass}>
                      <td data-label="Date">{g.date}</td>
                      <td data-label="Time">{g.time}</td>
                      <td data-label="Opponent">
                        {g.opponent}
                        {g.league && <span className={vb.leagueTag}>League</span>}
                        {g.seniorNight && <span className={styles.tag}>Senior Night</span>}
                        {g.postseason && <span className={styles.tag}>{g.postseason}</span>}
                      </td>
                      <td data-label="Location">{g.home ? 'Home' : 'Away'}{g.location ? ` · ${g.location}` : ''}</td>
                      <td className={vb.resultCell} data-label="Result">
                        {g.status === 'canceled' ? <span className={styles.statusCanceled}>Canceled</span>
                          : g.status === 'postponed' ? <span className={styles.statusPostponed}>Postponed{g.postponedFrom ? ` (was ${g.postponedFrom})` : ''}</span>
                          : g.result ? resultLabel(g.result) : 'Upcoming'}
                      </td>
                      <td data-label="Photos">
                        {gallery ? <a href={gallery.href} target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>Gallery →</a> : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className={vb.sampleCaption}>{checkedLine('schedule')} Dates and times can change — confirm with BRHS Athletics before heading to a game.</p>
          </>
        ) : (
          <div className={styles.emptyPanel}>
            <span className={styles.emptyKicker}>2026–27 Schedule</span>
            <p className={styles.emptyTitle}>Not published yet</p>
            <p className={styles.emptyBody}>
              No 2026–27 girls basketball schedule has been posted on a public source. It will appear here — dates, opponents,
              home or away, start times and results — as soon as it is. Last season’s schedule went public in early December.
            </p>
            <p className={styles.emptyMeta}>{checkedLine('schedule')}</p>
          </div>
        )}
      </section>

      {/* ── Standings ─────────────────────────────────────────────── */}
      <section id="standings" style={{ background: 'rgba(255,255,255,0.02)', scrollMarginTop: 120 }}>
        <div className={vb.sectionHead}>
          <div>
            <span className={vb.eyebrowRed}>{DIVISION_TEXT}</span>
            <h2 className={vb.sectionH2} style={{ marginTop: 12 }}>Conference <em>Standings</em></h2>
          </div>
          <p className={vb.sectionSub}>
            Bridgewater-Raritan plays in the {CONFERENCE.conference}
            {CONFERENCE.divisionConfirmedFor === '2026-27'
              ? `'s ${CONFERENCE.division}.`
              : ` (${CONFERENCE.division} in ${CONFERENCE.divisionConfirmedFor}; the 2026–27 alignment hasn't been published).`}
          </p>
        </div>
        {STANDINGS_READY ? (
          <>
            <table className={vb.scheduleTable}>
              <thead><tr><th>Team</th><th>Conference</th><th>Overall</th></tr></thead>
              <tbody>
                {STANDINGS.map((t, i) => (
                  <tr key={i} className={t.current ? vb.standingsActive : ''}>
                    <td data-label="Team" className={t.current ? vb.standingsTeamActive : vb.standingsTeam}>{t.team}</td>
                    <td data-label="Conference" className={vb.standingsRecord}>{t.confWins}-{t.confLosses}</td>
                    <td data-label="Overall" className={vb.standingsRecord}>{t.wins}-{t.losses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={vb.sampleCaption}>
              Standings as of {fmtIso(STANDINGS_AS_OF)}. Bridgewater-Raritan’s record is computed from the schedule above; other teams’ records are from MaxPreps and NJ Record Book.
            </p>
          </>
        ) : (
          <div className={styles.emptyPanel}>
            <span className={styles.emptyKicker}>Standings</span>
            <p className={styles.emptyTitle}>Posted once conference play begins</p>
            <p className={styles.emptyBody}>We only show standings that can be checked against a public source. They will fill in after the first league games are played.</p>
            <p className={styles.emptyMeta}>{checkedLine('standings')}</p>
          </div>
        )}
      </section>

      {/* ── Team Statistics ───────────────────────────────────────── */}
      <section id="team-stats" style={{ scrollMarginTop: 120 }}>
        <div className={vb.sectionHead}>
          <div>
            <span className={vb.eyebrowRed}>{SEASON_LABEL} Season</span>
            <h2 className={vb.sectionH2} style={{ marginTop: 12 }}>Team <em>Stats</em></h2>
          </div>
          <p className={vb.sectionSub}>Computed directly from final scores, so they always match the results above.</p>
        </div>
        {TEAM_STATS ? (
          <div className={styles.teamStatGrid}>
            {[
              { label: 'Record', value: `${TEAM_STATS.wins}-${TEAM_STATS.losses}` },
              { label: 'Points / Game', value: TEAM_STATS.ppg },
              { label: 'Allowed / Game', value: TEAM_STATS.oppg },
              { label: 'Avg. Margin', value: TEAM_STATS.margin != null ? (Number(TEAM_STATS.margin) > 0 ? `+${TEAM_STATS.margin}` : TEAM_STATS.margin) : null },
              { label: 'Points Scored', value: TEAM_STATS.pointsFor },
              { label: 'Points Allowed', value: TEAM_STATS.pointsAgainst },
              { label: 'Conference', value: TEAM_STATS.leagueRecord },
              { label: 'Home', value: TEAM_STATS.homeRecord },
              { label: 'Away', value: TEAM_STATS.awayRecord },
              { label: 'Streak', value: TEAM_STATS.streak },
            ]
              .filter((c) => c.value != null)
              .map((c) => (
                <div key={c.label} className={styles.teamStat}>
                  <span className={styles.teamStatValue}>{c.value}</span>
                  <span className={styles.teamStatLabel}>{c.label}</span>
                </div>
              ))}
          </div>
        ) : (
          <div className={styles.emptyPanel}>
            <span className={styles.emptyKicker}>Team Stats</span>
            <p className={styles.emptyTitle}>Available once games are played</p>
            <p className={styles.emptyBody}>Record, points per game, points allowed, home/away splits and streaks will calculate automatically from each final score.</p>
          </div>
        )}
      </section>

      <StatsSection
        id="player-stats"
        eyebrow={`${SEASON_LABEL} Season`}
        title="Player"
        titleAccent="Stats"
        subtitle={TEAM_LEADERS_2026_27.length || BOX_SCORES_2026_27.length
          ? 'Points, rebounds, assists, steals and blocks from published box scores. Updated after each game.'
          : 'Points, rebounds, assists, steals and blocks will appear here only where a published box score reports them.'}
        leaders={TEAM_LEADERS_2026_27}
        boxScores={BOX_SCORES_2026_27}
        roster={ROSTER}
        onPlayerLinkClick={(entry, anchorId, e) => { e?.preventDefault(); jumpToPlayerAnchor(anchorId); }}
      />

      {/* ── News ──────────────────────────────────────────────────── */}
      <section id="news" style={{ background: 'rgba(255,255,255,0.02)', scrollMarginTop: 120 }}>
        <div className={vb.sectionHead}>
          <div>
            <span className={vb.eyebrowRed}>Coverage</span>
            <h2 className={vb.sectionH2} style={{ marginTop: 12 }}>News <em>&amp; Updates</em></h2>
          </div>
          <p className={vb.sectionSub}>
            {NEWS_THIS_SEASON
              ? 'Recaps and team news from the school and local press. Each card links to the original story.'
              : 'No 2026–27 coverage has been published yet. Below: last season’s coverage from BRHS Athletics. Each card links to the original story.'}
          </p>
        </div>
        {NEWS.length > 0 ? (
          <div className={`${vb.newsGrid} ${styles.newsGrid}`}>
            {NEWS.map((a) => (
              <a key={a.url} href={a.url} target="_blank" rel="noopener noreferrer" className={`${vb.newsCard} ${styles.newsCard}`}>
                <span className={vb.newsBadgeRow}>
                  <span className={vb.newsSource}>{a.source}</span>
                  {isRecentArticle(a.date) && <span className={vb.newsNew}>New</span>}
                </span>
                <span className={styles.newsDate}>{fmtIso(a.date)}{a.season !== '2026-27' ? ` · ${a.season} season` : ''}</span>
                <span className={vb.newsTitle}>{a.title}</span>
                {a.summary && <span className={styles.newsSummary}>{a.summary}</span>}
                <span className={vb.newsLink}>Read Article →</span>
              </a>
            ))}
          </div>
        ) : (
          <div className={styles.emptyPanel}>
            <span className={styles.emptyKicker}>News</span>
            <p className={styles.emptyTitle}>No coverage yet</p>
            <p className={styles.emptyBody}>Game recaps and team news will be linked here as they are published.</p>
          </div>
        )}
        <p className={vb.sampleCaption}>{checkedLine('news')}</p>
      </section>

      {/* ── Roster & Coaching Staff ──────────────────────────────── */}
      <section id="roster" style={{ scrollMarginTop: 120 }}>
        <div className={vb.sectionHead}>
          <div>
            <span className={vb.eyebrowRed}>Varsity Roster</span>
            <h2 className={vb.sectionH2} style={{ marginTop: 12 }}>{SEASON_LABEL} <em>Roster</em></h2>
          </div>
          {ROSTER.length > 0 && <p className={vb.sectionSub}>{ROSTER.length} players, per the published varsity roster.{PORTRAIT_NUMBERS.size > 0 ? ' Tap a highlighted number to see that player’s portrait.' : ''}</p>}
        </div>

        {ROSTER.length > 0 ? (
          <>
            <table className={vb.scheduleTable}>
              <thead>
                <tr>
                  <th>#</th><th>Player</th><th>Grade</th>
                  {ROSTER_HAS_POSITION && <th>Pos</th>}
                  {ROSTER_HAS_HEIGHT && <th>Ht</th>}
                  {ROSTER_HAS_STATS && <th>PPG</th>}
                </tr>
              </thead>
              <tbody>
                {ROSTER.map((p) => (
                  <tr key={p.slug} id={`roster-${p.slug}`}>
                    <td data-label="#">
                      {PORTRAIT_NUMBERS.has(p.number) ? (
                        <button type="button" className={vb.rosterPortraitBtn} onClick={() => setPortrait(p)} aria-label={`View ${p.first} ${p.last}'s portrait`}>
                          {p.number}
                        </button>
                      ) : p.number}
                    </td>
                    <td data-label="Player">{p.first} {p.last}</td>
                    <td data-label="Grade">{p.grade}</td>
                    {ROSTER_HAS_POSITION && <td data-label="Pos">{p.position || '—'}</td>}
                    {ROSTER_HAS_HEIGHT && <td data-label="Ht">{p.height || '—'}</td>}
                    {ROSTER_HAS_STATS && <td data-label="PPG">{p.stats?.ppg ?? '—'}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={vb.sampleCaption}>{checkedLine('roster')}</p>
          </>
        ) : (
          <div className={styles.rosterSoon}>
            <div className={styles.rosterSoonText}>
              <span className={styles.emptyKicker}>Varsity Roster</span>
              <p className={styles.emptyTitle}>2026–27 Roster Coming Soon</p>
              <p className={styles.emptyBody}>
                The roster posts here once BRHS Athletics or MaxPreps publishes it — numbers, names, grades and positions,
                plus player portraits from Zarcone Photography as they are taken.
              </p>
              <p className={styles.emptyMeta}>{checkedLine('roster')}</p>
            </div>
            <div className={styles.rosterGhost} aria-hidden="true">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={styles.ghostCard}>
                  <span className={styles.ghostNum}>#</span>
                  <span className={styles.ghostLine} />
                  <span className={styles.ghostLineShort} />
                </div>
              ))}
            </div>
          </div>
        )}

        {portrait && (
          <Lightbox
            images={[{ src: portraitSrc(portrait.number), alt: `${portrait.first} ${portrait.last} (#${portrait.number}) — Bridgewater-Raritan Panther Girls Basketball, Zarcone Photography` }]}
            currentIndex={0}
            onClose={() => setPortrait(null)}
            onPrev={() => {}}
            onNext={() => {}}
          />
        )}

        <div className={styles.coachRow}>
          <div className={vb.coachCard}>
            <div className={vb.coachAvatar}>{HEAD_COACH.split(' ').map((n) => n[0]).join('')}</div>
            <div>
              <div className={vb.coachName}>{HEAD_COACH}</div>
              <div className={vb.coachTitle}>Head Coach · {ordinal(COACH_SEASON)} season</div>
              <p className={vb.coachBio}>Led the Panthers to a 14-13 winning season and an NJSIAA North 2, Group 4 berth in 2025–26, per BRHS Athletics.</p>
            </div>
          </div>
          {ASSISTANT_COACHES.map((c) => (
            <div key={c.name} className={vb.coachCard}>
              <div className={vb.coachAvatar}>{c.name.split(' ').map((n) => n[0]).join('')}</div>
              <div>
                <div className={vb.coachName}>{c.name}</div>
                <div className={vb.coachTitle}>{c.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Season Highlights ─────────────────────────────────────── */}
      <section id="highlights" style={{ background: 'rgba(255,255,255,0.02)', scrollMarginTop: 120 }}>
        <div className={vb.sectionHead}>
          <div>
            <span className={vb.eyebrowRed}>{SEASON_LABEL} Season</span>
            <h2 className={vb.sectionH2} style={{ marginTop: 12 }}>Season <em>Highlights</em></h2>
          </div>
          <p className={vb.sectionSub}>Big wins, milestones, Senior Night and the postseason — added as they happen, from published results.</p>
        </div>

        {DERIVED_HIGHLIGHTS.length > 0 ? (
          <div className={styles.highlightGrid}>
            {DERIVED_HIGHLIGHTS.map((h) => {
              const body = (
                <>
                  <span className={styles.highlightEyebrow}>{h.eyebrow}</span>
                  <span className={styles.highlightTitle}>{h.title}</span>
                  {h.body && <span className={styles.highlightBody}>{h.body}</span>}
                </>
              );
              return h.href
                ? <a key={h.key} href={h.href} target="_blank" rel="noopener noreferrer" className={styles.highlightCard}>{body}</a>
                : <div key={h.key} className={styles.highlightCard}>{body}</div>;
            })}
          </div>
        ) : (
          <div className={styles.highlightsEmpty}>
            <PhotoSlot slot={IMAGE_SLOTS.highlights} caption="2026–27 highlights begin with the season opener" sizes="(max-width: 900px) 100vw, 50vw" />
            <div>
              <span className={styles.emptyKicker}>Last Season · {LAST_SEASON.season}</span>
              <p className={styles.emptyTitle}>Where the Panthers left off</p>
              <div className={styles.lastSeasonGrid}>
                {LAST_SEASON.items.map((it) => (
                  <a key={it.label} href={it.source} target="_blank" rel="noopener noreferrer" className={styles.lastSeasonItem}>
                    <span className={styles.lastSeasonStat}>{it.stat}</span>
                    <span className={styles.lastSeasonLabel}>{it.label}</span>
                    <span className={styles.lastSeasonNote}>{it.note}</span>
                  </a>
                ))}
              </div>
              <p className={styles.emptyMeta}>Source: BRHS Athletics recaps, 2025–26.</p>
            </div>
          </div>
        )}
      </section>

      {/* ── Photography ───────────────────────────────────────────── */}
      <span id="gallery" style={{ position: 'relative', top: -120, display: 'block' }} aria-hidden="true" />
      <section className={vb.gallery} id="gallery-alert" style={{ scrollMarginTop: 120 }}>
        <div className={vb.sectionHead}>
          <div>
            <span className={vb.eyebrowRed}>From The Court</span>
            <h2 className={vb.sectionH2} style={{ marginTop: 12 }}>Photography <em>&amp; Galleries</em></h2>
          </div>
          <p className={vb.sectionSub}>Game action, Senior Night and team photography by Zarcone Photography. Galleries are listed here as they post.</p>
        </div>

        <div className={styles.actionGrid}>
          <PhotoSlot slot={IMAGE_SLOTS.featuredGame} caption="Featured game photography" sizes="(max-width: 900px) 100vw, 50vw" className={styles.actionWide} />
          {IMAGE_SLOTS.action.map((slot, i) => (
            <PhotoSlot key={i} slot={slot} caption="Game action" sizes="(max-width: 700px) 50vw, 25vw" />
          ))}
        </div>

        {GALLERIES_BY_DATE.length > 0 ? (
          <div className={vb.seasonPills}>
            {GALLERIES_BY_DATE.map((g) => (
              <a key={g.id} href={g.href} target="_blank" rel="noopener noreferrer" className={`${vb.seasonPill} ${vb.seasonPillActive}`}>
                {fmtIso(g.date, false)} · {g.label}
              </a>
            ))}
          </div>
        ) : null}

        <div className={vb.noticeBar}>
          <span className={vb.noticeDot} />
          {LATEST_GALLERY
            ? `Newest gallery: ${LATEST_GALLERY.label} (${fmtIso(LATEST_GALLERY.date, false)}). `
            : 'No 2026–27 galleries yet — the first ones post after the season opens. '}
          Sign up below to get an email when new photos go live.
        </div>

        <div className={styles.seniorNight}>
          <PhotoSlot slot={IMAGE_SLOTS.seniorNight} caption="Senior Night gallery" sizes="(max-width: 900px) 100vw, 45vw" />
          <div>
            <span className={styles.emptyKicker}>Senior Night</span>
            <p className={styles.emptyTitle}>{SENIOR_NIGHT_GALLERY ? 'Senior Night gallery is live' : 'Senior Night'}</p>
            <p className={styles.emptyBody}>
              {SENIOR_NIGHT_GALLERY
                ? `Photos from ${SENIOR_NIGHT_GALLERY.label}, ${fmtIso(SENIOR_NIGHT_GALLERY.date)}.`
                : 'The Senior Night date will be listed once the schedule is published, and the gallery will post here afterward.'}
            </p>
            {SENIOR_NIGHT_GALLERY && (
              <a href={SENIOR_NIGHT_GALLERY.href} target="_blank" rel="noopener noreferrer" className={vb.partnershipLink}>View Senior Night Gallery →</a>
            )}
          </div>
        </div>

        <GalleryAlertSignup
          team="Girls Basketball"
          source="BRHS Panther Girls Basketball — Gallery Alert"
          colors={{ ...alertColors, bg: 'rgba(255,255,255,0.03)', border: 'rgba(200,16,46,0.35)' }}
        />
      </section>

      {/* ── Official team information ─────────────────────────────── */}
      <div className={vb.officialResource}>
        <div className={vb.officialResourceInner}>
          <span className={vb.eyebrowRed}>Official Team Information</span>
          <h3 className={vb.officialResourceTitle}>Bridgewater-Raritan Athletics</h3>
          <p className={vb.officialResourceBody}>
            For official schedules, announcements and forms, go to BRHS Athletics. This hub is independent and is not run by the school.
          </p>
          <a href="https://www.brrsd.org/o/brrhs/page/team-sports" target="_blank" rel="noopener noreferrer" className={vb.partnershipLink}>
            Visit Bridgewater-Raritan Athletics →
          </a>
        </div>
      </div>

      {/* ── About this hub ────────────────────────────────────────── */}
      <section className={vb.trustNote} style={{ '--accent': 'var(--br-red)' }}>
        <div className={vb.sectionHead}>
          <div>
            <span className={vb.eyebrowRed}>About This Hub</span>
            <h2 className={vb.sectionH2} style={{ marginTop: 12 }}>Built By <em>Zarcone Photography</em></h2>
          </div>
        </div>
        <p style={{ color: 'var(--br-silver)', fontSize: 16, lineHeight: 1.8, maxWidth: 760 }}>
          This hub is an independent media resource developed and maintained by Zarcone Photography, a{' '}
          <Link href="/sports-photographer-nj">sports photographer in NJ</Link> based in Bridgewater. It collects the team’s public
          schedule, results, stats and news in one place, alongside our game photography. Zarcone Photography also covers{' '}
          <Link href="/brhs-panther-football">Panther Football</Link>, <Link href="/brhs-panther-volleyball">Panther Girls Volleyball</Link> and{' '}
          <Link href="/brhs-panther-wrestling">Panther Wrestling</Link>. Private <Link href="/senior-portrait-photographer-nj">senior portrait sessions</Link> and{' '}
          <Link href="/event-photographer-nj">team event coverage</Link> are available — <a href="#inquire">get in touch</a>.
        </p>
        <div style={{ marginTop: 40 }}>
          <span className={vb.eyebrowRed}>What Clients Say</span>
          <Testimonials />
        </div>
        <div className={vb.socialLinks} style={{ marginTop: 24 }}>
          <a href="https://instagram.com/zarconephotography" target="_blank" rel="noopener noreferrer">Instagram →</a>
          <a href="https://facebook.com/zarconephotography" target="_blank" rel="noopener noreferrer">Facebook →</a>
          <Link href="/">zarconephotography.com →</Link>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section>
        <div className={vb.sectionHead}>
          <div>
            <span className={vb.eyebrowRed}>Questions</span>
            <h2 className={vb.sectionH2} style={{ marginTop: 12 }}>Frequently <em>Asked</em></h2>
          </div>
        </div>
        <div className={vb.faqGrid}>
          {FAQ.map((item) => (
            <div key={item.q} className={vb.faqItem}>
              <p className={vb.faqQ}>{item.q}</p>
              <p className={vb.faqA}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────────── */}
      <section id="inquire" style={{ scrollMarginTop: 120 }}>
        <div className={vb.sectionHead}>
          <div>
            <span className={vb.eyebrowRed}>Get In Touch</span>
            <h2 className={vb.sectionH2} style={{ marginTop: 12 }}>Contact <em>Zarcone Photography</em></h2>
          </div>
        </div>
        <div className={vb.contactWrap}>
          <div>
            <p style={{ color: 'var(--br-silver)', fontSize: 16, lineHeight: 1.8 }}>
              Questions about game photos, prints, senior portraits — or a correction or removal request for this page.
              We respond within 24 hours.
            </p>
          </div>
          <form className={vb.form} onSubmit={handleSubmit}>
            <div className={vb.field}>
              <label htmlFor="gb-name">Name</label>
              <input id="gb-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className={vb.field}>
              <label htmlFor="gb-email">Email</label>
              <input id="gb-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className={vb.field}>
              <label htmlFor="gb-phone">Phone (optional)</label>
              <input id="gb-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className={vb.field}>
              <label htmlFor="gb-interest">Topic</label>
              <select id="gb-interest" value={form.interestedIn} onChange={(e) => setForm({ ...form, interestedIn: e.target.value })}>
                <option>Game Photos</option>
                <option>Prints &amp; Downloads</option>
                <option>Senior Portraits</option>
                <option>Team Photography</option>
                <option>Correction or Removal Request</option>
                <option>Other</option>
              </select>
            </div>
            <div className={`${vb.field} ${vb.formFull}`}>
              <label htmlFor="gb-message">Message</label>
              <textarea id="gb-message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            {status === 'success' && <p className={vb.formSuccess}>Thanks — your message is in. We’ll respond within 24 hours.</p>}
            {status === 'error' && <p className={vb.formError}>Something went wrong. Please call (908) 777-0631 or try again.</p>}
            <button type="submit" className={`${vb.btnRed} ${vb.submitBtn}`} disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      <p className={styles.disclaimer}>
        Independent media hub developed and maintained by Zarcone Photography. Not an official Bridgewater-Raritan High School or
        Bridgewater-Raritan Regional School District website, and not endorsed by either. Schedule, roster and statistics are drawn
        from public sources and may change.
      </p>

      {LATEST_GALLERY && (
        <a href={LATEST_GALLERY.href} target="_blank" rel="noopener noreferrer" className={vb.floatCta}>
          <span className={vb.floatCtaLong}>View Latest Photos</span>
          <span className={vb.floatCtaShort}>Photos</span>
        </a>
      )}
    </div>
  );
}
