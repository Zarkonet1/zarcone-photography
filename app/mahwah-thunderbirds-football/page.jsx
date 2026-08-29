// Mahwah Thunderbirds Football — Media Hub concept build.
//
// NOT an official Mahwah High School or Mahwah Athletics page. Built by
// Zarcone Photography as a concept for Roger Pelletier (Director of
// Athletics) and the Mahwah football coaching staff — see
// app/mahwah-thunderbirds-football/layout.jsx for the noindex/nofollow
// posture (same as every Prospect Trigger page under app/high_school/).
//
// Architecture: deliberately mirrors app/brhs-panther-football/page.jsx
// section-for-section (same shared team-dashboard components, same CSS
// module class names, same helper libs) — see project memory /
// CLAUDE.md for why. Sections BRHS has that this page does NOT include
// (2025 playoff game log, a named Featured Player, a populated Roster, a
// real Media Day recap, "Official Media Partner" claims, a booking form)
// are omitted deliberately because no verified 2026 Mahwah data exists for
// them yet — per Tom's explicit instruction, this page never fabricates
// stats, names, or claims to fill a section. Each omission is called out
// inline below with what would need to exist to add it back in, using the
// exact same structure BRHS already proves out.
import Link from 'next/link';
import styles from './page.module.css';
import { getRecord, getNextGame, getLastPlayedGame } from '@/lib/teamSchedule';
import { sortArticlesByDate, isRecentArticle } from '@/lib/articles';
import { MAHWAH_SCHEDULE_2026 } from '@/lib/mahwahFootballSchedule';
import { MAHWAH_GALLERIES_2026 } from '@/lib/mahwahFootballGalleries';
import { getLatestGallery } from '@/lib/footballGalleries';
import DashboardHeader from '@/components/team-dashboard/DashboardHeader';
import NextGameHero from '@/components/team-dashboard/NextGameHero';
import StatCards from '@/components/team-dashboard/StatCards';
import MediaCenterGrid from '@/components/team-dashboard/MediaCenterGrid';
import LatestFromPanthers from '@/components/team-dashboard/LatestFromPanthers';
import CompactSchedule from '@/components/team-dashboard/CompactSchedule';

// ─── Verified program facts (sourced 2026-08-27) ─────────────────────────
// Five sectional titles — Wikipedia (Mahwah High School) + independently
// corroborated by a Dec. 2016 Patch.com recap explicitly calling the 2016
// win the program's "second consecutive" and "fifth" state championship.
// Same sourcing already used in lib/prospectTriggers/data/mahwah-football.js,
// re-verified directly against Wikipedia again today.
const TITLE_YEARS = ['1978', '1979', '1981', '2015', '2016'];

// American Red division of the Super Football Conference for 2026 (per
// each member's own MaxPreps schedule page, all listing "League: Super -
// American Red", cross-checked 2026-08-27): Dumont, Lakeland, Mahwah,
// Ramsey, Westwood. Mahwah competes in the Big North Conference for most
// sports, but football plays in this separate Super Football Conference
// structure.
// Updated 2026-08-29 sweep (now part of the daily sweep's standard checks,
// not just weekly — per Tom, 2026-08-29): Lakeland Regional and Ramsey each
// opened 1-0 (Lakeland over an unnamed opponent 50-20; Ramsey beat Verona
// 27-21), Westwood opened 0-1 (lost to Manasquan 19-20) — all non-league
// results, so confWins/confLosses stay 0-0 for all. Dumont and Mahwah
// haven't played yet. Source: MaxPreps' Super - American Red standings page,
// last updated Aug 28, 2026 @ 11:40pm GMT.
const OTHER_DIVISION_TEAMS_2026 = [
  { team: 'Dumont', wins: 0, losses: 0, confWins: 0, confLosses: 0 },
  { team: 'Lakeland', wins: 1, losses: 0, confWins: 0, confLosses: 0 },
  { team: 'Ramsey', wins: 1, losses: 0, confWins: 0, confLosses: 0 },
  { team: 'Westwood', wins: 0, losses: 1, confWins: 0, confLosses: 0 },
];

// Mahwah's own standings row derives from MAHWAH_SCHEDULE_2026 — identical
// single-source-of-truth pattern as BRHS's BRHS_STANDINGS_ROW. As of
// 2026-08-27 nothing has been played, so this computes to 0-0/0-0, matching
// every other team in the division (also unplayed as of this date).
const MAHWAH_PLAYED = MAHWAH_SCHEDULE_2026.filter((g) => g.result);
const MAHWAH_CONF_PLAYED = MAHWAH_SCHEDULE_2026.filter((g) => g.league && g.result);
const MAHWAH_STANDINGS_ROW = {
  team: 'Mahwah',
  current: true,
  wins: MAHWAH_PLAYED.filter((g) => g.result.win).length,
  losses: MAHWAH_PLAYED.length - MAHWAH_PLAYED.filter((g) => g.result.win).length,
  confWins: MAHWAH_CONF_PLAYED.filter((g) => g.result.win).length,
  confLosses: MAHWAH_CONF_PLAYED.length - MAHWAH_CONF_PLAYED.filter((g) => g.result.win).length,
};
const DIVISION_STANDINGS_2026 = [MAHWAH_STANDINGS_ROW, ...OTHER_DIVISION_TEAMS_2026]
  .slice()
  .sort((a, b) => {
    const confDiff = (b.confWins - b.confLosses) - (a.confWins - a.confLosses);
    if (confDiff !== 0) return confDiff;
    const overallDiff = (b.wins - b.losses) - (a.wins - a.losses);
    if (overallDiff !== 0) return overallDiff;
    return a.team.localeCompare(b.team);
  });
const DIVISION_GAMES_PLAYED = DIVISION_STANDINGS_2026.some((t) => t.confWins + t.confLosses > 0);

// Real, dated coverage only — both pieces independently verified 2026-08-27.
// Deliberately labeled "Program History" below, not "2026 Season," since
// neither is current-season news; no current 2026 Mahwah football press
// coverage could be found via search as of this date (checked Patch,
// MahwahPost, NJ.com-style aggregators — see the delivery report for the
// full list of what was searched). This section is wired to sort/badge
// automatically the moment real 2026 coverage is added — see lib/articles.js.
const ARTICLES = [
  {
    title: 'Mahwah Beats Westwood To Win Its Second Consecutive North 1, Group 2 Football Championship',
    source: 'Patch',
    url: 'https://patch.com/new-jersey/mahwah/mahwah-beats-westwood-win-its-second-consecutive-north-1-group-2-football',
    date: '2016-12-04',
  },
  {
    title: 'Jeff Remo Retiring As Mahwah Football Coach After 20 Years',
    source: 'Patch',
    url: 'https://patch.com/new-jersey/mahwah/jeff-remo-retiring-mahwah-football-coach-after-20-years',
    date: '2017-01-10',
  },
];

// Dashboard derivations — identical pattern to BRHS (lib/teamSchedule.js is
// shared, not BRHS-specific). getRecord's fallback covers the honest
// preseason state; getLastPlayedGame returns null all season until a
// result posts, which is accurate as of 2026-08-27 (nothing played yet).
const DASHBOARD_NEXT_GAME = getNextGame(MAHWAH_SCHEDULE_2026);
const DASHBOARD_LAST_PLAYED = getLastPlayedGame(MAHWAH_SCHEDULE_2026);
const DASHBOARD_RECORD = getRecord(MAHWAH_SCHEDULE_2026);
const DASHBOARD_LATEST_RESULT_LABEL = DASHBOARD_LAST_PLAYED
  ? `${DASHBOARD_LAST_PLAYED.opponent}: ${DASHBOARD_LAST_PLAYED.result.win ? 'W' : 'L'} ${DASHBOARD_LAST_PLAYED.result.score}`
  : null;
const LATEST_GALLERY = getLatestGallery(MAHWAH_GALLERIES_2026); // null — no galleries yet, see lib/mahwahFootballGalleries.js

// "Latest" editorial teaser intentionally left empty — the only two real
// articles found (above) are program history from 2016/2017, not current
// news, and presenting them as "Latest" would misrepresent how active
// coverage is right now. LatestFromPanthers renders nothing when items is
// empty, so this section simply doesn't appear — the full, honestly-labeled
// "Program History" section further down the page still shows both pieces.
const DASHBOARD_EDITORIAL_ITEMS = [];
const DASHBOARD_NEWS_HAS_NEW = false;

const MEDIA_CENTER_TILES = [
  { label: 'Team & Coaches', sub: 'Roster & Staff', href: '#roster' },
  { label: 'Schedule', sub: 'Full Season', href: '#schedule' },
  { label: 'News', sub: 'Program Coverage', href: '#news' },
  { label: 'Media & Galleries', sub: 'How It Would Work', href: '#gallery' },
  { label: 'Program', sub: 'History & Facts', href: '#program' },
];

const DASHBOARD_HEADER_LINKS = [
  { href: '#program', label: 'Program' },
  { href: '#roster', label: 'Team' },
  { href: '#schedule', label: 'Schedule' },
  { href: '#news', label: 'News' },
];

// Program-at-a-glance facts — every value below is independently sourced;
// see the delivery report for the full source list. Nothing here is a
// guess or an estimate framed as fact.
const PROGRAM_FACTS = [
  { label: 'Mascot', value: 'Thunderbirds' },
  { label: 'Colors', value: 'Columbia Blue & Black' },
  { label: 'Conference', value: 'Super Football Conference — American Red' },
  { label: 'Athletic Director', value: 'Roger Pelletier' },
  { label: 'Location', value: '50 Ridge Road, Mahwah, NJ 07430' },
  { label: 'Enrollment', value: '~880 students (2023–24, per Wikipedia)' },
];

const FAQ = [
  {
    q: 'Is this an official Mahwah Athletics or Mahwah High School page?',
    a: "No. This is a concept built by Zarcone Photography — a working preview of what a Mahwah Thunderbirds Football Media Hub could look like, using the same platform already running for Bridgewater-Raritan. It's not affiliated with or published by Mahwah High School, and isn't indexed or linked from anywhere public.",
  },
  {
    q: 'What is a "Media Hub," exactly?',
    a: 'One destination for everything a program’s players, families, and fans currently have to hunt for across MaxPreps, Hudl, the district site, social media, and group texts — schedule, results, standings, roster, news, and photography, kept current automatically wherever the data supports it.',
  },
  {
    q: 'Does photography have to be part of it?',
    a: "No — photography is one optional piece, not the product. The Hub itself (schedule, roster, news, standings) works the same whether Zarcone Photography, the program's own volunteers, or nobody is providing photos.",
  },
  {
    q: 'How does the data stay current without someone updating it by hand every week?',
    a: 'Schedule, record, next game, standings, and "new" news badges all compute automatically from a small set of source files — a coach or AD updates one line when a game is played, and every dependent number on the page (record, next opponent, standings row) updates itself. That’s exactly how the live BRHS Football Hub already runs today.',
  },
  {
    q: 'Could this extend beyond football?',
    a: 'Yes — nothing about the underlying platform is football-specific. The same model already runs separately for BRHS Wrestling and BRHS Girls Volleyball. For Mahwah, the natural long-term shape is a Mahwah Athletics hub with football as the first program built out, not the only one.',
  },
];

export const dynamic = 'force-static';

export default function MahwahThunderbirdsFootballPage() {
  return (
    <div className={styles.wrap}>
      {/* Discreet-but-visible concept designation — Tom's explicit request
          2026-08-27, so nobody watching the walkthrough mistakes this for
          a live official page. Kept out of DashboardHeader itself (shared
          with BRHS/volleyball) so it's Mahwah-only and easy to strip the
          moment this becomes a real partnership. */}
      <div className={styles.conceptBanner}>
        Media Hub Concept — Prepared For MHS Athletic Director
      </div>

      <DashboardHeader
        teamName="Mahwah Thunderbirds Football"
        season="2026 Season · Concept Preview"
        logoSrc="/photos/mahwah-thunderbirds-logo.png"
        logoAlt="Mahwah Thunderbirds"
        logoRound
        links={DASHBOARD_HEADER_LINKS}
        creditLine="Zarcone Photography"
        creditSuffix="Concept — Not An Official Partnership"
      />

      <NextGameHero
        nextGame={DASHBOARD_NEXT_GAME}
        lastPlayedGame={DASHBOARD_LAST_PLAYED}
        latestGallery={LATEST_GALLERY}
        bgPhotoSrc={null}
        fallbackGradient="linear-gradient(160deg, rgba(185,217,235,0.16) 0%, #0a0a0a 62%)"
        teamName="Mahwah Thunderbirds Football"
        teamMatchupName="Mahwah Thunderbirds"
        teamShortLabel="MAHWAH"
        watermarkSrc="/photos/mahwah-thunderbird-mark.png"
        watermarkAlt=""
      />

      <StatCards
        record={DASHBOARD_RECORD}
        nextGameDate={DASHBOARD_NEXT_GAME ? DASHBOARD_NEXT_GAME.date : 'Season Complete'}
        nextGameOpponent={DASHBOARD_NEXT_GAME ? DASHBOARD_NEXT_GAME.opponent : null}
        latestResult={DASHBOARD_LATEST_RESULT_LABEL}
        seasonYear="2026"
        seasonSub="5 Sectional Titles"
      />

      <MediaCenterGrid tiles={MEDIA_CENTER_TILES} newsHasNew={DASHBOARD_NEWS_HAS_NEW} />

      <LatestFromPanthers items={DASHBOARD_EDITORIAL_ITEMS} heading="Latest On The Thunderbirds" />

      <CompactSchedule games={MAHWAH_SCHEDULE_2026} />

      {/* ── Program Stat Bar ─────────────────────────────────────── */}
      <section id="stats" className={styles.statBar} style={{ scrollMarginTop: 120 }}>
        <div className={styles.statBarGrid}>
          <div className={styles.statBarItem}>
            <div className={styles.statBarNum}>5</div>
            <div className={styles.statBarLabel}>Sectional Titles</div>
            <div className={styles.statBarSub}>{TITLE_YEARS.join(' · ')}</div>
          </div>
          <div className={styles.statBarItem}>
            <div className={styles.statBarNum}>2×</div>
            <div className={styles.statBarLabel}>Back-To-Back Champions</div>
            <div className={styles.statBarSub}>2015 &amp; 2016 — both at MetLife Stadium</div>
          </div>
          <div className={styles.statBarItem}>
            <div className={styles.statBarNum}>SFC</div>
            <div className={styles.statBarLabel}>American Red Division</div>
            <div className={styles.statBarSub}>Dumont · Lakeland · Ramsey · Westwood</div>
          </div>
          <div className={styles.statBarItem}>
            <div className={styles.statBarNum}>AS</div>
            <div className={styles.statBarLabel}>Head Coach</div>
            <div className={styles.statBarSub}>Adam Szuch</div>
          </div>
        </div>
        <p className={styles.statBarNote}>
          Program history per Wikipedia ("Mahwah High School") and Patch.com; 2026 schedule and conference per MaxPreps, last updated Aug. 26, 2026.
        </p>
      </section>

      {/* ── Schedule & Results ───────────────────────────────────── */}
      <section id="schedule" style={{ scrollMarginTop: 120 }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>2026 Season</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Schedule <em>&amp; Results</em></h2>
          </div>
          <p className={styles.sectionSub}>Eight games, American Red Division play, opening Thursday, Sept. 3 at home.</p>
        </div>

        <div className={styles.championBanner}>
          <div className={styles.championBannerNum}>5</div>
          <div>
            <div className={styles.championBannerTitle}>Sectional Championships In Program History</div>
            <div className={styles.championBannerBody}>
              1978, 1979, 1981, and back-to-back titles in 2015 and 2016 — the last two won at MetLife Stadium. Per Wikipedia, corroborated by Patch.com’s Dec. 2016 recap of the 2016 title game.
            </div>
          </div>
        </div>

        <table className={styles.scheduleTable}>
          <thead>
            <tr><th>Date</th><th>Time</th><th>Opponent</th><th>Result</th></tr>
          </thead>
          <tbody>
            {MAHWAH_SCHEDULE_2026.map((g, i) => (
              <tr key={i} className={g.league ? styles.leagueRow : ''}>
                <td data-label="Date">{g.date}</td>
                <td data-label="Time">{g.time}</td>
                <td data-label="Opponent">{g.opponent}{g.league && <span className={styles.leagueTag}>League</span>}</td>
                <td className={styles.resultCell} data-label="Result">{g.result ? `${g.result.win ? 'W' : 'L'} ${g.result.score}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.sampleCaption}>
          Schedule per <a href="https://www.maxpreps.com/nj/mahwah/mahwah-thunderbirds/football/schedule/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--mw-blue)' }}>MaxPreps</a>, last updated Aug. 26, 2026 — an earlier version of this concept (built Aug. 14) showed a different opener (at Morristown-Beard); that game no longer appears on MaxPreps’ current schedule and has been corrected here. Confirm times directly with the program before attending. Results will post here automatically once games are played — no rebuild required.
        </p>
      </section>

      {/* ── Division Standings ───────────────────────────────────── */}
      <section id="standings" style={{ background: 'rgba(255,255,255,0.02)', scrollMarginTop: 120 }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Super Football Conference</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>American Red <em>Standings</em></h2>
          </div>
          <p className={styles.sectionSub}>
            Mahwah plays in the American Red Division alongside Dumont, Lakeland, Ramsey, and Westwood.
          </p>
        </div>
        <table className={styles.scheduleTable}>
          <thead>
            <tr><th>Team</th><th>Conference</th><th>Overall</th></tr>
          </thead>
          <tbody>
            {DIVISION_STANDINGS_2026.map((t, i) => (
              <tr key={i} className={t.current ? styles.standingsActive : ''}>
                <td data-label="Team" className={t.current ? styles.standingsTeamActive : styles.standingsTeam}>{t.team}</td>
                <td data-label="Conference" className={styles.standingsRecord}>{t.confWins}-{t.confLosses}</td>
                <td data-label="Overall" className={styles.standingsRecord}>{t.wins}-{t.losses}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.sampleCaption}>
          {DIVISION_GAMES_PLAYED
            ? 'Standings update as American Red Division games are reported.'
            : 'All five teams open the season 0-0 — nothing has been played yet as of Aug. 27, 2026. Standings fill in the same way Mahwah’s own row does: automatically, from the schedule above, once results post.'}
        </p>
      </section>

      {/* ── Program History (News) ──────────────────────────────── */}
      <section id="news" style={{ background: 'rgba(255,255,255,0.02)', scrollMarginTop: 120 }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Program History</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>In The <em>News</em></h2>
          </div>
          <p className={styles.sectionSub}>
            No current 2026-season coverage of Mahwah Football turned up in a direct search as of Aug. 27, 2026 — shown honestly rather than filled with older stories dressed up as new. What follows is real, dated program history. This section badges and sorts new coverage automatically the moment it's added — the same mechanism already running on the BRHS Hub.
          </p>
        </div>
        <div className={styles.newsGrid}>
          {sortArticlesByDate(ARTICLES).map((a, i) => (
            <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className={styles.newsCard}>
              <span className={styles.newsBadgeRow}>
                <span className={styles.newsSource}>{a.source}</span>
                {isRecentArticle(a.date) && <span className={styles.newsNew}>New</span>}
              </span>
              <span className={styles.newsTitle}>{a.title}</span>
              <span className={styles.newsLink}>Read Article →</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── Roster ───────────────────────────────────────────────── */}
      <section id="roster" style={{ background: 'rgba(255,255,255,0.02)', scrollMarginTop: 120 }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>2026 Roster</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>2026 <em>Roster</em></h2>
          </div>
          <p className={styles.sectionSub}>
            Mahwah’s official 2026 varsity roster has not yet been publicly posted. The Media Hub is ready to populate the moment verified roster information becomes available — the table below is the exact same structure BRHS’s live roster uses (sortable by number, name, grade, position; filterable by class and position group), with no rebuild needed.
          </p>
        </div>
        <table className={`${styles.scheduleTable} ${styles.rosterTable}`}>
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Grade</th>
              <th>Off</th>
              <th>Def</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--mw-silver-dim)' }}>
                Roster not yet published for the 2026 season. This table is fully wired for filtering, sorting, and (once Media Day photography exists) a jersey-number portrait lightbox — identical to the live BRHS roster.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── Coaching Staff & Program ────────────────────────────── */}
      {/* Corrected 2026-08-28 sweep: bio previously said Szuch "succeeded"
          Jeff Remo directly — false. Remo retired 2017; Chris Diaz was head
          coach 2017-2022 (3 playoff appearances, 2019 NJSFC title per
          bergenpassaicfootball.com); Szuch took over in 2022 per Mahwah
          Post's "State of the Program" piece (published 2022-07-25, i.e.
          when he was introduced as the new coach). Fixed to name Diaz as
          the actual predecessor rather than skip straight to Remo. */}
      <section id="program">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Leadership &amp; Program</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Coaching <em>Staff</em></h2>
          </div>
        </div>
        <div className={styles.coachGrid}>
          <div className={styles.coachCard}>
            <div className={styles.coachAvatar}>AS</div>
            <div>
              <div className={styles.coachName}>Adam Szuch</div>
              <div className={styles.coachTitle}>Head Coach, Since 2022</div>
              <p className={styles.coachBio}>
                Leads the Thunderbirds football program into the 2026 season, a role he&apos;s held since 2022 after succeeding Chris Diaz. The program&apos;s last sustained sectional run came under longtime coach Jeff Remo, who won back-to-back sectional championships in 2015 and 2016 before retiring in 2017 after 20 years at the helm.
              </p>
            </div>
          </div>
        </div>
        <p className={styles.staffLabel}>Program At A Glance</p>
        <div className={styles.staffGrid}>
          {PROGRAM_FACTS.map((f, i) => (
            <div key={i} className={styles.staffCard}>
              <div className={styles.staffName}>{f.label}</div>
              <p className={styles.staffNote}>{f.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Media & Galleries ────────────────────────────────────── */}
      <span id="gallery" style={{ position: 'relative', top: -120, display: 'block' }} aria-hidden="true" />
      <section className={styles.gallery} id="gallery-preview" style={{ scrollMarginTop: 120 }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>How It Would Work</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Media &amp; <em>Galleries</em></h2>
          </div>
          <p className={styles.sectionSub}>
            Zarcone Photography doesn’t have a Mahwah photography library yet — there’s no season partnership in place. This section shows the architecture, not invented content.
          </p>
        </div>

        <div className={styles.seasonPills}>
          <span className={`${styles.seasonPill} ${styles.seasonPillPending}`}>Media Day — Added When Scheduled</span>
          <span className={`${styles.seasonPill} ${styles.seasonPillPending}`}>Game Galleries — Added As Posted</span>
          <span className={`${styles.seasonPill} ${styles.seasonPillPending}`}>Season Highlights — Added As Posted</span>
        </div>

        <div className={styles.noticeBar}>
          <span className={styles.noticeDot} />
          Once photography begins, each week gets its own gallery here — the exact same weekly-gallery structure (and the "latest gallery" logic on the dashboard above) already running live for BRHS. See below for what that looks like in production today.
        </div>

        <div className={styles.officialResource} style={{ marginTop: 8 }}>
          <div className={styles.officialResourceInner}>
            <span className={styles.eyebrowRed}>Live Example</span>
            <h3 className={styles.officialResourceTitle}>See A Media Hub Gallery In Production</h3>
            <p className={styles.officialResourceBody}>
              Bridgewater-Raritan Panther Football’s live gallery — real Zarcone Photography work for a different program, shown here only as an example of what this section becomes once photography is in place.
            </p>
            <Link href="/brhs-panther-football#gallery-alert" className={styles.partnershipLink}>
              View The Live BRHS Gallery →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Official Program Resource ───────────────────────────── */}
      <div className={styles.officialResource}>
        <div className={styles.officialResourceInner}>
          <span className={styles.eyebrowRed}>Official Program Resource</span>
          <h3 className={styles.officialResourceTitle}>Official Mahwah Athletics Website</h3>
          <p className={styles.officialResourceBody}>
            Visit Mahwah Athletics’ own official site for registration, forms, schedules, and program announcements directly from the district.
          </p>
          <a href="https://www.mahwahathletics.com/" target="_blank" rel="noopener noreferrer" className={styles.partnershipLink}>
            Visit Mahwah Athletics →
          </a>
        </div>
      </div>

      {/* ── About This Concept ──────────────────────────────────── */}
      <section className={styles.trustNote} style={{ '--accent': 'var(--mw-blue)' }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>About This Page</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>What This <em>Is</em></h2>
          </div>
        </div>
        <p style={{ color: 'var(--mw-silver)', fontSize: 16, lineHeight: 1.8, maxWidth: 720 }}>
          This is a concept built by Tom Zarcone of Zarcone Photography — a Mahwah alum — for Roger Pelletier and the Mahwah football coaching staff.
          It is not an official Mahwah page, and Zarcone Photography does not currently have a media partnership with the program. It's built on the
          same Media Hub platform already running live for <Link href="/brhs-panther-football">Bridgewater-Raritan Panther Football</Link>,{' '}
          <Link href="/brhs-panther-wrestling">Panther Wrestling</Link>, and <Link href="/brhs-panther-volleyball">Panther Girls Volleyball</Link> — the
          same underlying model, a distinct look for each program. Built first for football here, but nothing about the platform is football-specific;
          the natural long-term shape for a school this size is a Mahwah Athletics hub with every program under one roof.
        </p>
        <div className={styles.grid3col} style={{ marginTop: 32 }}>
          <div className={styles.iconCard}><h3>One Destination</h3><p>Schedule, roster, standings, news, and photography — instead of scattered across five different sites.</p></div>
          <div className={styles.iconCard}><h3>Low Upkeep</h3><p>Record, next game, and standings compute themselves from a single schedule file — update one line, not five.</p></div>
          <div className={styles.iconCard}><h3>Built To Scale</h3><p>The same model already runs distinctly for three different BRHS programs — extending it to more Mahwah sports is additive, not a rebuild.</p></div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Questions</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Frequently <em>Asked</em></h2>
          </div>
        </div>
        <div className={styles.faqGrid}>
          {FAQ.map((item, i) => (
            <div key={i} className={styles.faqItem}>
              <p className={styles.faqQ}>{item.q}</p>
              <p className={styles.faqA}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────── */}
      <section id="inquire" style={{ scrollMarginTop: 120 }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Get In Touch</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Let&apos;s Talk <em>Thunderbirds Football</em></h2>
          </div>
        </div>
        <div className={styles.contactWrap}>
          <div>
            <p style={{ color: 'var(--mw-silver)', fontSize: 16, lineHeight: 1.8 }}>
              Questions about this concept, or what a Mahwah Thunderbirds Football Media Hub could look like this season — reach out directly, no form needed.
            </p>
            <div style={{ marginTop: 28, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a
                className={styles.btnRed}
                href="mailto:tom@zarconephotography.com?subject=Mahwah%20Football%20%E2%80%94%20tell%20me%20more&body=Hi%20Tom%2C%0A%0AI%20saw%20the%20page%20you%20put%20together%20for%20Mahwah%20Football%20%E2%80%94%20let%27s%20talk%20about%20what%20this%20could%20look%20like%20for%20our%20program%20this%20season."
              >
                Email Tom →
              </a>
              <a className={styles.btnGhost} href="tel:9087770631">(908) 777-0631</a>
            </div>
          </div>
        </div>
      </section>

      <a href="#inquire" className={styles.floatCta}>
        <span className={styles.floatCtaLong}>Let&apos;s Talk</span>
        <span className={styles.floatCtaShort}>Talk</span>
      </a>

      {/* Concept disclaimer footer — Tom's exact wording, 2026-08-27. */}
      <div className={styles.conceptFooter}>
        Concept demonstration prepared by Zarcone Photography. Not an official Mahwah Township Public Schools website.
      </div>
    </div>
  );
}
