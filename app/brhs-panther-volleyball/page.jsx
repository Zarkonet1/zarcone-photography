'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lightbox from '@/components/Lightbox';
import Testimonials from '@/components/Testimonials';
import GalleryAlertSignup from '@/components/GalleryAlertSignup';
import GalleryAlertToast from '@/components/GalleryAlertToast';
import styles from './page.module.css';
import { getRecord, getNextGame, getLastPlayedGame } from '@/lib/teamSchedule';
import { sortArticlesByDate, isRecentArticle } from '@/lib/articles';
import { SCHEDULE_2026 } from '@/lib/volleyballSchedule';
import { GALLERIES_2026, getLatestGallery } from '@/lib/volleyballGalleries';
import DashboardHeader from '@/components/team-dashboard/DashboardHeader';
import NextGameHero from '@/components/team-dashboard/NextGameHero';
import StatCards from '@/components/team-dashboard/StatCards';
import MediaCenterGrid from '@/components/team-dashboard/MediaCenterGrid';
import LatestFromPanthers from '@/components/team-dashboard/LatestFromPanthers';
import CompactSchedule from '@/components/team-dashboard/CompactSchedule';

const GALLERY_URL = 'https://galleries.zarconephotography.com';

// Derived from lib/volleyballGalleries.js — don't hand-edit galleries here.
// Add new galleries to GALLERIES_2026 in that file once Tom starts posting
// them; this page just reads it. Empty today, same honest-empty-state
// pattern as the wrestling page's dual schedule before dates were published.
const LATEST_GALLERY = getLatestGallery(GALLERIES_2026);

// Individual Media Day player portraits — same convention as football's
// PORTRAIT_NUMBERS (see app/brhs-panther-football/page.jsx + SITE-CHEATSHEET.md).
// #5 (Camille Hilton) added 2026-08-31 — a practice/warm-up photo Tom
// provided directly, not from a formal team Media Day shoot (none scheduled
// yet), used to seed the new Featured Player spotlight below. Also makes
// her roster row clickable per the same convention. Add more jersey numbers
// here the same session real Media Day files land in
// public/photos/volleyball-media-day-portraits/{number}.jpg.
const PORTRAIT_NUMBERS = new Set([5]);

// Sourced 2026-08-22 from the 20251029 BRHS Volleyball Sr Night v DelVal
// SmugMug gallery (323 shots) — the most recent match on file, so this is
// close to the current roster. Real match action + one team Senior Night
// shot; no cross-sport placeholders. Full-res originals live in that
// gallery if a wider or different crop is ever needed.
const PHOTOS = [
  { src: '/photos/BRHS-Volleyball-0213.jpg', width: 2400, height: 1600, size: 'wide' },
  { src: '/photos/BRHS-Volleyball-0064.jpg', width: 1600, height: 1280, size: 'wide' },
  { src: '/photos/BRHS-Volleyball-0193.jpg', width: 1067, height: 1600 },
  { src: '/photos/BRHS-Volleyball-0089.jpg', width: 1067, height: 1600 },
  { src: '/photos/BRHS-Volleyball-0096.jpg', width: 1067, height: 1600 },
  { src: '/photos/BRHS-Volleyball-0188.jpg', width: 1067, height: 1600 },
  { src: '/photos/BRHS-Volleyball-0104.jpg', width: 1067, height: 1600 },
  { src: '/photos/BRHS-Volleyball-0196.jpg', width: 1067, height: 1600 },
  { src: '/photos/BRHS-Volleyball-0088.jpg', width: 1067, height: 1600 },
  { src: '/photos/BRHS-Volleyball-0094.jpg', width: 1067, height: 1600 },
  { src: '/photos/BRHS-Volleyball-0102.jpg', width: 1067, height: 1600 },
  { src: '/photos/BRHS-Volleyball-0109.jpg', width: 1067, height: 1600 },
  { src: '/photos/BRHS-Volleyball-0110.jpg', width: 1067, height: 1600 },
  { src: '/photos/BRHS-Volleyball-0113.jpg', width: 1067, height: 1600 },
];

const CAROUSEL = [
  { src: '/photos/BRHS-Volleyball-0213.jpg', width: 2400, height: 1600, caption: 'Panther Volleyball — Every Point Earned' },
  { src: '/photos/BRHS-Volleyball-0193.jpg', width: 1067, height: 1600, caption: 'A Wall At The Net' },
  { src: '/photos/BRHS-Volleyball-0064.jpg', width: 1600, height: 1280, caption: 'Senior Night 2025' },
  { src: '/photos/BRHS-Volleyball-0188.jpg', width: 1067, height: 1600, caption: 'Serving Notice' },
  { src: '/photos/BRHS-Volleyball-0104.jpg', width: 1067, height: 1600, caption: 'This Is Panther Volleyball' },
];

// Real coverage of the program — no invented headlines. `date` is the
// article's real publish date where confirmed; several below are documented
// estimates (TAPinto's site doesn't expose a reliable published_time meta tag
// the way the football/wrestling sources do) — flagged inline rather than
// guessed silently. Same sortArticlesByDate/isRecentArticle pattern as
// football and wrestling.
const ARTICLES = [
  {
    title: 'Girls Volleyball: Bridgewater-Raritan Wins Somerset County Tournament, 3-0, Over Mount Saint Mary',
    source: 'TAPinto',
    url: 'https://www.tapinto.net/towns/bridgewater-slash-raritan/sections/sports/articles/girls-volleyball-bridgewater-raritan-wins-somerset-county-tournament-3-0-over-mount-saint-mary',
    date: '2025-10-23' /* corrected 2026-08-23 via routine source sweep — MaxPreps' own match log confirms the Somerset County Tournament final (3-0 over Mount St. Mary) was played Oct 23, 2025, the only 3-0 result among three Mount St. Mary matches that fall (also lost 0-2 Sep 16, won 2-1 Oct 9). Previously an estimate of 2025-10-15 based on TAPinto's "about two weeks" phrasing, which was in the right neighborhood but not exact. */
  },
  {
    title: 'Girls Volleyball: Bridgewater-Raritan Defeats Montgomery, 3-0 (25-17, 25-17, 25-18) — NJSIAA Central Jersey, Group 4 First Round',
    source: 'TAPinto',
    url: 'https://www.tapinto.net/towns/bridgewater-slash-raritan/sections/sports/articles/girls-volleyball-bridgewater-raritan-defeats-montgomery-3-0',
    date: '2025-11-03' /* corrected 2026-08-23 via routine source sweep — MaxPreps' own match log confirms this NJSIAA Central Jersey Group 4 first-round win over Montgomery (3-0) was played Nov 3, 2025. Previously an estimate of 2025-10-30. Note: BR's Group 4 run continued one more round after this win — a 2-3 loss at Hillsborough on Nov 5, 2025 (per MaxPreps; not previously reflected on this page) — now added to RESULTS_2025 below. */
  },
  {
    title: 'Girls Volleyball: Bridgewater-Raritan Surges Past Hillsborough, 2-0 (25-23, 25-18)',
    source: 'TAPinto',
    url: 'https://www.tapinto.net/towns/bridgewater-slash-raritan/sections/sports/articles/girls-volleyball-bridgewater-raritan-surges-past-hillsborough-2-0-25-23-25-18',
    date: '2025-09-10' /* CONFIRMED — added 2026-08-22. Matches BRRSD's own recap of the same Sept 9, 2025 home-opener sweep (brrsd.org/o/brrhs/article/2409792, published Sept 10, 2025), which independently corroborates the date and box score: Ella Sorenson 21 assists, Jahniah Bishop 7 kills/3 blocks, Grace Fitzpatrick 9 kills, Katelyn Phan 6 kills/2 aces, Ava Marvuglio 9 digs. Season context: 5 new varsity starters after a 10-4 finish in 2024, including a 2024 state-sectional playoff win over this same Hillsborough team. NOTE, 2026-08-28: "10-4" is this TAPinto article's own phrasing and is left as-is (a direct quote/paraphrase of the source), but per MaxPreps' own 2024-25 team page the actual full-season record was 11-12 — "10-4" looks like a late-season stretch, not the whole season. STAT_BAR below was corrected off MaxPreps' number; this citation comment is not a live stat, just documenting what the article said. */
  },
  {
    title: 'Girls Volleyball: Bridgewater-Raritan Beats Watchung Hills, 2-0 (25-19, 25-14)',
    source: 'TAPinto',
    url: 'https://www.tapinto.net/towns/bridgewater-slash-raritan/sections/sports/articles/girls-volleyball-bridgewater-raritan-beats-watchung-hills-2-0',
    date: '2025-09-24' /* ESTIMATE — added 2026-08-22. Article states BR's record was 6-3 at the time (Ava Marvuglio: 8 kills, 11 digs); placed roughly two weeks after the confirmed Sept 10 Hillsborough date, consistent with 9 matches played by that point. */
  },
];

const FAQ = [
  {
    q: 'Where do I order photos?',
    a: <>Match galleries will be delivered through <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer">Pic-Time</a>, our client gallery platform — the same system used for BRHS Panther Football and Wrestling.</>,
  },
  {
    q: 'How quickly are galleries posted?',
    a: 'Match galleries are professionally edited and delivered within days of each match — so photos are ready while the moment is still fresh.',
  },
  {
    q: 'Can I download images?',
    a: 'Yes. Every family gets high-resolution digital downloads through their private gallery, in addition to print ordering.',
  },
  {
    q: 'Can I order prints?',
    a: 'Yes — prints and photo products are available to order directly from the gallery, no separate request needed.',
  },
  {
    q: 'Can I hire Zarcone Photography privately?',
    a: <>Yes. Outside of the season partnership, Zarcone Photography is available for individual senior sessions, family photos, and private bookings — <Link href="/about#contact">reach out here</Link>.</>,
  },
  {
    q: 'Do you photograph all home matches?',
    a: 'Home matches are covered as part of the season partnership, along with Senior Night and postseason play if the Panthers advance.',
  },
  {
    q: 'Can I request a specific athlete?',
    a: "Every effort is made to capture the full roster across a match. If you're looking for a specific athlete or moment, reach out after a gallery is posted and we'll help you find it.",
  },
  {
    q: 'How do senior banners work?',
    a: 'Every graduating senior receives a custom commemorative poster design as part of the partnership — coordinated directly with the program ahead of Senior Night.',
  },
];

const WHY_US = [
  { num: '01', title: '30+ Years Experience', body: 'Three decades behind the camera across NJ high school and collegiate sports.' },
  { num: '02', title: 'Pro Nikon Z-System', body: 'Nikon Z9 and Z8 bodies built to deliver in any light, at match speed.' },
  { num: '03', title: 'Fast Turnaround', body: 'Edited galleries delivered within days of the final point.' },
  { num: '04', title: 'Professional Editing', body: 'Every image color-corrected and finished before it reaches your gallery.' },
  { num: '05', title: 'Trusted Bridgewater Partner', body: 'Already the photography partner of BRHS Panther Football and Panther Wrestling.' },
  { num: '06', title: 'Prints & Downloads', body: 'High-resolution downloads and print products, ordered directly from your private gallery.' },
];

// Real program history and 2025 season facts — sourced from TAPinto and
// BRRSD Athletics (see ARTICLES above for citations). No invented stats.
// Coach Josh Everett's hire year (2023) is now confirmed — see the sourcing
// comment above COACHES — and reflected in his title there; no separate
// "Nth season" figure is computed here, same manual-tenure pattern as
// wrestling's Murphy ("Since 2021-22") rather than football's derived
// COACH_TENURE.
//
// Corrected 2026-08-25 per Tom: the 3rd row previously read num: '2-0' /
// label: '2025 States, Round 1' / sub: 'Def. Montgomery, 3-0 — NJSIAA
// Central Jersey, Group 4' — the '2-0' was already inconsistent with its own
// sub-copy (the actual score was 3-0), and more importantly the team's 2025
// state-tournament run didn't stop at Round 1: BR won Round 1 over
// Montgomery (3-0, Nov 3, 2025) then lost Round 2 at Hillsborough (2-3, Nov
// 5, 2025) — see RESULTS_2025 below, added 2026-08-23. Reframed to state the
// actual arc honestly while still reading as forward progress ("advanced to
// Round 2" beats either an inflated clean sweep or dwelling on the loss).
const STAT_BAR = [
  { num: "'25", label: 'Somerset County Champions', sub: 'Defeated Mount St. Mary Academy, 3-0 — per TAPinto' },
  // Corrected 2026-08-28 sweep — verification spot-check found this row read
  // '10-4', which doesn't match MaxPreps' own 2024-25 team page (the
  // authoritative record source): Overall 11-12, League 2-5 (5th), confirmed
  // by tallying all 23 matches in that season's own match log (11 W / 12 L).
  // '10-4' appears to have conflated a late-season hot stretch with the full
  // season record — the state-sectional-playoff-win-over-Hillsborough claim
  // in the sub-copy is still accurate (2-1 second-round win, per the same
  // match log) and is unchanged.
  { num: '11-12', label: '2024 Season Record', sub: 'Included a state sectional playoff win over Hillsborough' },
  { num: 'Rd. 2', label: '2025 NJSIAA States', sub: 'Won Round 1 at Montgomery, fell in Round 2 at Hillsborough — Central Jersey, Group 4' },
  { num: 'Skyland', label: 'Conference', sub: 'Big Central for football, Skyland for every other BRHS program' },
];

// Skyland Conference opponents — derived from the `league: true` flags in
// SCHEDULE_2026 (Hillsborough, North Hunterdon, Hunterdon Central), same
// approach as football's OTHER_STANDINGS_2026. No official division-name
// source was found for volleyball specifically during this sweep (the
// Big Central "American Silver" naming convention is football-only) — this
// table is labeled generically as "Skyland Conference" rather than guessing
// a subdivision name. All start 0-0 preseason, same honest pattern as football.
const OTHER_STANDINGS_2026 = [
  { team: 'Hillsborough', wins: 0, losses: 0, confWins: 0, confLosses: 0 },
  { team: 'North Hunterdon', wins: 0, losses: 0, confWins: 0, confLosses: 0 },
  { team: 'Hunterdon Central', wins: 0, losses: 0, confWins: 0, confLosses: 0 },
];

const BRHS_PLAYED = SCHEDULE_2026.filter((g) => g.result);
const BRHS_CONF_PLAYED = SCHEDULE_2026.filter((g) => g.league && g.result);
const BRHS_STANDINGS_ROW = {
  team: 'Bridgewater-Raritan',
  current: true,
  wins: BRHS_PLAYED.filter((g) => g.result.win).length,
  losses: BRHS_PLAYED.length - BRHS_PLAYED.filter((g) => g.result.win).length,
  confWins: BRHS_CONF_PLAYED.filter((g) => g.result.win).length,
  confLosses: BRHS_CONF_PLAYED.length - BRHS_CONF_PLAYED.filter((g) => g.result.win).length,
};

const DIVISION_STANDINGS_2026 = [BRHS_STANDINGS_ROW, ...OTHER_STANDINGS_2026]
  .slice()
  .sort((a, b) => {
    const confDiff = (b.confWins - b.confLosses) - (a.confWins - a.confLosses);
    if (confDiff !== 0) return confDiff;
    const overallDiff = (b.wins - b.losses) - (a.wins - a.losses);
    if (overallDiff !== 0) return overallDiff;
    return a.team.localeCompare(b.team);
  });

const DIVISION_GAMES_PLAYED = DIVISION_STANDINGS_2026.some((t) => t.confWins + t.confLosses > 0);

// Dashboard rebuild (2026-08-25) — replicates football's dashboard pattern
// exactly (see app/brhs-panther-football/page.jsx for the reference
// implementation; components live in components/team-dashboard/, shared
// across team pages after that folder was generalized the same day).
// Raw next/last-game objects for NextGameHero (needs structured fields, not
// a joined string) plus the plain summary values StatCards displays.
const DASHBOARD_NEXT_GAME = getNextGame(SCHEDULE_2026);
const DASHBOARD_LAST_PLAYED = getLastPlayedGame(SCHEDULE_2026);
const DASHBOARD_RECORD = getRecord(SCHEDULE_2026);
const DASHBOARD_LATEST_RESULT_LABEL = DASHBOARD_LAST_PLAYED
  ? `${DASHBOARD_LAST_PLAYED.opponent}: ${DASHBOARD_LAST_PLAYED.result.win ? 'W' : 'L'} ${DASHBOARD_LAST_PLAYED.result.score}`
  : null;
// Season card reuses STAT_BAR[0] (2025 county-championship status) rather
// than hand-typing a second copy of the same fact — same don't-duplicate
// rule as football.
const DASHBOARD_SEASON_SUB = `${STAT_BAR[0].num} ${STAT_BAR[0].label}`;

// Latest From The Panthers editorial cards — top 3 ARTICLES by date, paired
// with real ZP photos from CAROUSEL purely for visual presentation (these
// press links have no photos of their own).
const DASHBOARD_EDITORIAL_ITEMS = sortArticlesByDate(ARTICLES)
  .slice(0, 3)
  .map((a, i) => ({ ...a, img: CAROUSEL[i % CAROUSEL.length].src }));

// Powers the "New" badge on the Media Center's News tile — same
// isRecentArticle threshold the full News section below already uses.
const DASHBOARD_NEWS_HAS_NEW = DASHBOARD_EDITORIAL_ITEMS.length > 0 && isRecentArticle(DASHBOARD_EDITORIAL_ITEMS[0].date);

// Media Center tiles — same pattern as football, adapted to volleyball's
// actual content. No "Media Day" tile — unlike football, which had a real
// scheduled shoot to hide behind a flag, volleyball has no Media Day date
// at all yet (PORTRAIT_NUMBERS above is still empty). Add a Media Day tile
// once a shoot is actually scheduled, same as football's convention.
const MEDIA_TILES_VOLLEYBALL = [
  { label: 'Game Galleries', sub: 'View Photos', href: '#gallery-alert', img: '/photos/BRHS-Volleyball-0089.jpg' },
  { label: 'Meet the Team', sub: 'Roster & Coaches', href: '#roster', img: '/photos/BRHS-Volleyball-0064.jpg' },
  { label: 'Schedule', sub: 'Full Season', href: '#schedule', img: '/photos/BRHS-Volleyball-0096.jpg' },
  { label: 'News', sub: 'Latest Coverage', href: '#news', img: '/photos/BRHS-Volleyball-0188.jpg' },
];

// "Players to Watch" — 2026 season outlook. Background/stats provided by
// Tom (2026-08-25), not sourced to a published article, so no external
// citation is attached to these cards (unlike football's FEATURED_PLAYER,
// which cites a real preseason preview) — presented as season stats rather
// than press coverage. BR graduated 10 seniors from the 2025 county-
// championship team, including its two primary kill producers (30 combined
// in the county semifinal alone) — so 2026 is about who takes over those
// touches, not just who returns. Stats below are each player's 2025
// varsity season.
const PLAYMAKERS_2026 = [
  {
    name: 'Camille Hilton',
    detail: 'Jr. · Libero/DS',
    bio: 'The most proven returning player on the roster. As a sophomore, Hilton was First Team All-Skyland Delaware — 490 digs, 58 aces, 63 assists, and a 5.83 digs/set average. With two of last year’s top back-row players graduated, she’s the obvious foundation to rebuild BR’s serve-receive and defense around.',
  },
  {
    name: 'Margarita Silvar',
    detail: 'Sr.',
    bio: 'Already a contributor as a junior — four kills, a block, and eight digs in an early win over Hillsborough, six kills against Phillipsburg, at least 81 digs on the season — and described by Coach Josh Everett as the team’s "most underrated player." On a roster replacing ten seniors, her role and leadership responsibility jump considerably in 2026.',
  },
  {
    name: 'Brooke Krizan',
    detail: 'Jr. · Setter',
    bio: 'Krizan already showed she can run the varsity offense: 46 assists, 15 digs, and 3 aces in a 3-1 win over Bloomfield last October — among New Jersey’s notable single-match assist totals — on the way to 97 varsity assists as a sophomore behind senior starter Ella Sorenson. With BR’s starting setter graduated, Krizan taking over the offense full-time would make her the player determining who gets the ball and where.',
  },
];

// Featured Player spotlight — mirrors football's FEATURED_PLAYER pattern
// (see app/brhs-panther-football/page.jsx). Seeded 2026-08-31 per Tom with
// Camille Hilton; reuses her sourced bio from PLAYMAKERS_2026 above rather
// than duplicating new copy. NOTE: Tom named her as #6 — the official BRHS
// Athletics roster (nj.com High School Sports roster sheet, fetched
// 2026-08-31) has Hilton at #5 and #6 as Clare Amalfitano. Used the sourced
// number here rather than the conflicting one; flag to Tom to confirm.
// Badge photo is a practice/warm-up shot Tom provided directly (not a
// formal Media Day headshot), saved at
// public/photos/volleyball-media-day-portraits/5.jpg — see PORTRAIT_NUMBERS
// above. Full-body source frame, so objectPosition is biased toward the
// top of the crop to keep her face in the square badge.
const FEATURED_PLAYER = {
  number: 5,
  name: 'Camille Hilton',
  detail: 'Junior · Libero',
  bio: 'The most proven returning player on the roster. As a sophomore, Hilton was First Team All-Skyland Delaware — 490 digs, 58 aces, 63 assists, and a 5.83 digs/set average. With two of last year’s top back-row players graduated, she’s the obvious foundation to rebuild BR’s serve-receive and defense around.',
};

// Coaching staff — per Bridgewater-Raritan Athletics' own staff contact
// directory (brrsd.org/o/brrhs/page/contacts), the most authoritative source
// available. Note: Josh Everett coaches Girls Volleyball as head coach AND
// Boys Volleyball as JV coach — not a typo, confirmed on the same page.
// Bio expanded 2026-08-25 per Tom — background sourced to a BRRSD press
// release republished by Patch Labs/Raritan Neighbors (raritanneighbors.town.news,
// article:published_time 2023-08-20T21:22:39Z, covering Everett's hire as head
// coach that August). "Since 2023" in the title is confirmed by that same
// article. IMPORTANT — that article also states predecessor Corey Romanak
// (25 years as girls head coach, Hall of Fame) won 3 Group 4 state
// championships and 1 Tournament of Champions title coaching the GIRLS team,
// which appears to conflict with this bio's own claim that 2025's Round 1 win
// over Montgomery was the program's "first NJSIAA Central Jersey Group 4
// tournament win in recent memory" — flagged for Tom, not resolved here;
// left as-is pending his call on how to reconcile the two.
const COACHES = [
  {
    name: 'Josh Everett',
    title: 'Head Coach, Girls Volleyball · Since 2023',
    bio: "A Bridgewater-Raritan alum who played on the Panthers' 2005 state championship boys' volleyball team, Everett spent 10 years as an assistant coach for both the girls' and boys' programs before being named girls' head coach in 2023, succeeding Hall of Fame coach Corey Romanak. He's coming off a 2025 season that included a Somerset County Tournament championship and the program's first NJSIAA Central Jersey Group 4 tournament win in recent memory. He also serves as JV coach for BRHS Boys Volleyball. \"We want to see our players grow off the court as much as on the court,\" Everett has said. \"They are student-athletes, not athlete-students.\"",
  },
];

const STAFF = [
  { name: 'Maria Cruz', title: 'JV Coach, Girls Volleyball', note: 'Per BRHS Athletics’ official staff directory.' },
  { name: 'Kristin Bonczek', title: 'Freshman Coach, Girls Volleyball', note: 'Per BRHS Athletics’ official staff directory.' },
];

// 2025 season — only the sourced, confirmed results (see ARTICLES above for
// citations). Full match-by-match log not compiled; shown honestly rather
// than guessed, same convention as football's RESULTS_2025.
const RESULTS_2025 = [
  { date: 'Sep 9, 2025', opponent: 'vs Hillsborough', round: 'Regular Season — Home Opener', result: 'W 2-0 (25-23, 25-18)', win: true },
  { date: 'Sep ~24, 2025', opponent: 'vs Watchung Hills', round: 'Regular Season', result: 'W 2-0 (25-19, 25-14)', win: true },
  { date: 'Oct 23, 2025', opponent: 'vs Mount St. Mary Academy', round: 'Somerset County Tournament — Final', result: 'W 3-0', win: true },
  { date: 'Nov 3, 2025', opponent: 'vs Montgomery', round: 'NJSIAA Central Jersey, Group 4 — First Round', result: 'W 3-0 (25-17, 25-17, 25-18)', win: true },
  { date: 'Nov 5, 2025', opponent: 'vs Hillsborough', round: 'NJSIAA Central Jersey, Group 4 — Second Round', result: 'L 2-3', win: false },
];

// 2026-27 preseason varsity roster, per BRHS Athletics' official roster
// sheet published on nj.com High School Sports (Tom-provided PDF, fetched
// 2026-08-31) — supersedes the earlier MaxPreps-sourced list, which had
// wrong names/numbers and a jersey-number conflict at #7. Position
// abbreviations, as given on the sheet: OH = Outside Hitter, O = Opposite,
// S = Setter, L = Libero, DS = Defensive Specialist, MB = Middle Blocker.
// A player with two positions listed keeps both in the table; the first is
// used for grouping below.
const ROSTER_RAW_2026 = [
  { number: 2, first: 'Reese', last: 'Albano', grade: 'Senior', position: 'OH, O' },
  { number: 3, first: 'Bellina', last: 'Locrotondo', grade: 'Senior', position: 'O, DS' },
  { number: 5, first: 'Camille', last: 'Hilton', grade: 'Junior', position: 'L' },
  { number: 6, first: 'Clare', last: 'Amalfitano', grade: 'Sophomore', position: 'L, DS' },
  { number: 7, first: 'Margarita', last: 'Silvar', grade: 'Senior', position: 'OH' },
  { number: 8, first: 'Riley', last: 'Romanak', grade: 'Sophomore', position: 'OH, O' },
  { number: 11, first: 'Eleana', last: 'Dai', grade: 'Junior', position: 'MB' },
  { number: 12, first: 'Sara', last: 'Abbaszadeh', grade: 'Junior', position: 'DS' },
  { number: 14, first: 'Brooke', last: 'Krizan', grade: 'Junior', position: 'S' },
  { number: 16, first: 'Autumn', last: 'Sachs', grade: 'Junior', position: 'O' },
  { number: 19, first: 'Viktoria', last: 'Borodkin', grade: 'Senior', position: 'MB, O' },
  { number: 20, first: 'Quinn', last: 'Levash', grade: 'Sophomore', position: 'MB' },
  { number: 21, first: 'Klaudia', last: 'Swider', grade: 'Sophomore', position: 'O, S' },
  { number: 25, first: 'Jackie', last: 'Oram', grade: 'Sophomore', position: 'L, OH' },
  { number: 28, first: 'Arielle', last: 'Wang', grade: 'Freshman', position: 'OH, O' },
];

// Groups by primary (first-listed) position — mirrors football's OFF_POS_GROUP
// pattern, adapted for volleyball position abbreviations.
const POS_GROUP = {
  OH: 'Outside Hitters',
  S: 'Setters',
  L: 'Liberos',
  DS: 'Defensive Specialists',
  MB: 'Middle Blockers',
  O: 'Opposites',
};
const ROSTER_GROUP_ORDER = ['Outside Hitters', 'Setters', 'Liberos', 'Defensive Specialists', 'Middle Blockers', 'Opposites'];
const CLASS_ORDER = ['Senior', 'Junior', 'Sophomore', 'Freshman'];

function compareRosterRows(a, b, key, dir) {
  const mul = dir === 'desc' ? -1 : 1;
  let av, bv;
  if (key === 'number') {
    av = a[key] ?? 0;
    bv = b[key] ?? 0;
  } else if (key === 'last') {
    av = `${a.last} ${a.first}`.toLowerCase();
    bv = `${b.last} ${b.first}`.toLowerCase();
  } else {
    av = (a[key] || '').toString().toLowerCase();
    bv = (b[key] || '').toString().toLowerCase();
  }
  if (av < bv) return -1 * mul;
  if (av > bv) return 1 * mul;
  return 0;
}

const ROSTER_2026 = ROSTER_RAW_2026
  .map((p) => ({
    ...p,
    group: POS_GROUP[p.position.split(',')[0].trim()] || 'Outside Hitters',
    slug: `${p.first}-${p.last}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  }))
  .sort((a, b) => a.number - b.number);

const SERVICES = [
  { title: 'Match Day Coverage', body: 'Full home-match photography — kills, digs, blocks, celebrations, and the bench.' },
  { title: 'Media Day Portraits', body: 'Individual and team portraits, graphics-ready and recruiting-ready — once scheduled.' },
  { title: 'Senior Night & Banners', body: 'Dedicated coverage and a custom poster design for every senior.' },
  { title: 'Social & Schedule Graphics', body: "Branded graphics built for the program's social channels." },
  { title: 'Recruiting Content', body: 'Imagery built to represent athletes well to college programs.' },
  { title: 'Private Sessions', body: 'Individual senior portraits, family sessions, and headshots by request.' },
];

export default function BRHSPantherVolleyballPage() {
  const [lbIndex, setLbIndex] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', athleteName: '', sport: 'Volleyball', interestedIn: 'Prints', message: '' });
  const [status, setStatus] = useState('idle');
  const [rosterPositionFilter, setRosterPositionFilter] = useState('All');
  const [rosterClassFilter, setRosterClassFilter] = useState('All');
  const [rosterSortKey, setRosterSortKey] = useState('number');
  const [rosterSortDir, setRosterSortDir] = useState('asc');
  const [portraitLightbox, setPortraitLightbox] = useState(null);
  const handleRosterSort = (key) => {
    if (rosterSortKey === key) {
      setRosterSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setRosterSortKey(key);
      setRosterSortDir('asc');
    }
  };
  const rosterSortArrow = (key) => (rosterSortKey === key ? (rosterSortDir === 'asc' ? ' ▲' : ' ▼') : '');

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
          athleteName: form.athleteName,
          sport: form.sport,
          type: form.interestedIn,
          message: form.message,
          source: 'BRHS Panther Volleyball landing page',
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setForm({ name: '', email: '', phone: '', athleteName: '', sport: 'Volleyball', interestedIn: 'Prints', message: '' });
    } catch {
      setStatus('error');
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Bridgewater-Raritan Panther Girls Volleyball — Media Partnership',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Zarcone Photography',
      url: 'https://www.zarconephotography.com',
      telephone: '(908) 777-0631',
      address: { '@type': 'PostalAddress', addressLocality: 'Bridgewater', addressRegion: 'NJ', addressCountry: 'US' },
    },
    areaServed: { '@type': 'City', name: 'Bridgewater, NJ' },
    description: "Photography partner of Bridgewater-Raritan Panther Girls Volleyball — match day coverage, Media Day portraits, Senior Night, and photo ordering.",
  };

  return (
    <div className={styles.wrap}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <GalleryAlertToast
        team="Volleyball"
        source="BRHS Panther Volleyball — Gallery Alert Toast"
        dismissKey="gr-alert-dismissed-volleyball"
        colors={{
          accent: 'var(--br-red)',
          accentDark: 'var(--br-red-dark)',
          text: 'var(--br-silver)',
          textSoft: 'var(--br-silver-dim)',
          bg: '#141414',
          border: 'rgba(200,16,46,0.45)',
          btnText: '#fff',
        }}
      />

      {/* ── Dashboard rebuild (2026-08-25) ───────────────────────────
          Replicates the football dashboard exactly, per Tom's request:
          restrained header + dynamic Next Match hero + 4 stat cards +
          Media Center grid + editorial section + compact schedule preview.
          Replaces the old marketing hero, quick-nav, and 5-tile Season
          Tracker — see app/brhs-panther-football/page.jsx for the reference
          implementation these mirror. Nothing below this block was removed
          — Schedule & Results, Standings, 2025 Results, News, Roster,
          Coaches, Players to Watch, Gallery, Official Resource, and the
          Powered-By-ZP block all still render in full further down, same
          structure as football. Program Stat Bar (full program-history
          stats) moved down to sit with that retained content — see below. ── */}
      <DashboardHeader
        teamName="Bridgewater-Raritan Panthers Girls Volleyball"
        links={[
          { href: '#gallery-alert', label: 'Galleries' },
          { href: '#roster', label: 'Team' },
          { href: '#schedule', label: 'Schedule' },
        ]}
      />

      <NextGameHero
        nextGame={DASHBOARD_NEXT_GAME}
        lastPlayedGame={DASHBOARD_LAST_PLAYED}
        latestGallery={LATEST_GALLERY}
        bgPhotoSrc="/photos/BRHS-Volleyball-0213.jpg"
      />

      <StatCards
        record={DASHBOARD_RECORD}
        nextGameDate={DASHBOARD_NEXT_GAME ? DASHBOARD_NEXT_GAME.date : 'Season Complete'}
        nextGameOpponent={DASHBOARD_NEXT_GAME ? DASHBOARD_NEXT_GAME.opponent : null}
        latestResult={DASHBOARD_LATEST_RESULT_LABEL}
        seasonYear="2026"
        seasonSub={DASHBOARD_SEASON_SUB}
      />

      <MediaCenterGrid tiles={MEDIA_TILES_VOLLEYBALL} newsHasNew={DASHBOARD_NEWS_HAS_NEW} />

      <LatestFromPanthers items={DASHBOARD_EDITORIAL_ITEMS} />

      <CompactSchedule games={SCHEDULE_2026} />

      {/* ── Program Stat Bar ──────────────────────────────────────
          Relocated from above the fold (2026-08-25), same as football —
          full program-history stats that don't fit the 4-card dashboard
          summary but shouldn't be lost either. ── */}
      <section className={styles.statBar}>
        <div className={styles.statBarGrid}>
          {STAT_BAR.map((s, i) => (
            <div key={i} className={styles.statBarItem}>
              <div className={styles.statBarNum}>{s.num}</div>
              <div className={styles.statBarLabel}>{s.label}</div>
              <div className={styles.statBarSub}>{s.sub}</div>
            </div>
          ))}
        </div>
        <p className={styles.statBarNote}>Program history and 2025 results per TAPinto and BRRSD Athletics.</p>
      </section>

      {/* ── Schedule & Results ───────────────────────────────────── */}
      <section id="schedule" style={{ scrollMarginTop: 120 }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>2026 Season</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Schedule <em>&amp; Results</em></h2>
          </div>
          <p className={styles.sectionSub}>Coming off a Somerset County Tournament championship and the program's first NJSIAA Central Jersey Group 4 tournament win. Here's what's next.</p>
        </div>

        <div className={styles.championBanner}>
          <div className={styles.championBannerNum}>3-0</div>
          <div>
            <div className={styles.championBannerTitle}>2025 Somerset County Tournament Champions</div>
            <div className={styles.championBannerBody}>
              Defeated Mount St. Mary Academy, 3-0, in the county final — per TAPinto. The Panthers also won their NJSIAA Central Jersey, Group 4 first-round match over Montgomery, 3-0.
            </div>
          </div>
        </div>

        <table className={styles.scheduleTable}>
          <thead>
            <tr><th>Date</th><th>Time</th><th>Opponent</th><th>Result</th></tr>
          </thead>
          <tbody>
            {SCHEDULE_2026.map((g, i) => (
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
          Schedule per <a href="https://www.maxpreps.com/nj/bridgewater/bridgewater-raritan-panthers/volleyball/schedule/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--br-red)' }}>MaxPreps</a> as of late August 2026 — dates and times are subject to change; confirm before heading to a match. Results post here after each match.
        </p>
      </section>

      {/* ── 2025 Season Results ──────────────────────────────────── */}
      <section id="results" style={{ background: 'rgba(255,255,255,0.02)', scrollMarginTop: 120 }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>2025 Season</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>The Road <em>To The County Title</em></h2>
          </div>
          <p className={styles.sectionSub}>A county championship and the program's first Central Jersey Group 4 tournament win. The full match-by-match log is still being compiled — this is the sourced portion.</p>
        </div>
        <table className={styles.scheduleTable}>
          <thead>
            <tr><th>Date</th><th>Opponent</th><th>Round</th><th>Result</th></tr>
          </thead>
          <tbody>
            {RESULTS_2025.map((g, i) => (
              <tr key={i}>
                <td data-label="Date">{g.date}</td>
                <td data-label="Opponent">{g.opponent}</td>
                <td data-label="Round">{g.round}</td>
                <td className={g.win ? styles.resultWin : styles.resultLoss} data-label="Result">{g.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── Conference Standings ─────────────────────────────────── */}
      <section id="standings" style={{ background: 'rgba(255,255,255,0.02)', scrollMarginTop: 120 }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Skyland Conference</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Conference <em>Standings</em></h2>
          </div>
          <p className={styles.sectionSub}>
            Bridgewater-Raritan Girls Volleyball plays in the Skyland Conference, alongside Hillsborough, North Hunterdon, and Hunterdon Central among this year's scheduled league opponents.
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
            ? 'Standings update as Skyland Conference matches are reported.'
            : 'All four teams open the season 0-0 — the 2026 opener is Tue, Sep 1 at Hillsborough. Standings fill in as conference matches are played.'}
          {' '}Bridgewater-Raritan's record is drawn automatically from the schedule above; other teams' records are tracked from{' '}
          <a href="https://www.maxpreps.com/nj/bridgewater/bridgewater-raritan-panthers/volleyball/schedule/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--br-red)' }}>MaxPreps</a>.
        </p>
      </section>

      {/* ── In The News ──────────────────────────────────────────── */}
      <section id="news" style={{ background: 'rgba(255,255,255,0.02)', scrollMarginTop: 120 }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Coverage</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>In The <em>News</em></h2>
          </div>
          <p className={styles.sectionSub}>Real coverage of the team, the county title run, and the players — from local press and the school itself.</p>
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
            <span className={styles.eyebrowRed}>Preseason Roster</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>2026 <em>Roster</em></h2>
          </div>
          <p className={styles.sectionSub}>
            {ROSTER_2026.length} players as of the 2026-27 preseason, per BRHS Athletics' official roster. Media Day portraits post here once a shoot is scheduled.
          </p>
        </div>
        <div className={styles.rosterFilterRow}>
          <select
            className={styles.rosterFilterSelect}
            value={rosterClassFilter}
            onChange={(e) => setRosterClassFilter(e.target.value)}
            aria-label="Filter roster by class"
          >
            <option value="All">All Classes</option>
            {CLASS_ORDER.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            className={styles.rosterFilterSelect}
            value={rosterPositionFilter}
            onChange={(e) => setRosterPositionFilter(e.target.value)}
            aria-label="Filter roster by position"
          >
            <option value="All">All Positions</option>
            {ROSTER_GROUP_ORDER.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <select
          className={styles.rosterMobileSort}
          value={`${rosterSortKey}:${rosterSortDir}`}
          onChange={(e) => {
            const [k, d] = e.target.value.split(':');
            setRosterSortKey(k);
            setRosterSortDir(d);
          }}
          aria-label="Sort roster"
        >
          <option value="number:asc">Sort: Number (Low–High)</option>
          <option value="last:asc">Sort: Name (A–Z)</option>
          <option value="last:desc">Sort: Name (Z–A)</option>
          <option value="grade:asc">Sort: Grade (A–Z)</option>
        </select>
        {(() => {
          const filtered = ROSTER_2026.filter((p) =>
            (rosterPositionFilter === 'All' || p.group === rosterPositionFilter) &&
            (rosterClassFilter === 'All' || p.grade === rosterClassFilter)
          );
          const sorted = [...filtered].sort((a, b) => compareRosterRows(a, b, rosterSortKey, rosterSortDir));
          return (
            <table className={`${styles.scheduleTable} ${styles.rosterTable}`}>
              <thead>
                <tr>
                  <th><button type="button" className={styles.sortBtn} onClick={() => handleRosterSort('number')}>#{rosterSortArrow('number')}</button></th>
                  <th><button type="button" className={styles.sortBtn} onClick={() => handleRosterSort('last')}>Player{rosterSortArrow('last')}</button></th>
                  <th><button type="button" className={styles.sortBtn} onClick={() => handleRosterSort('grade')}>Grade{rosterSortArrow('grade')}</button></th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p) => (
                  <tr key={p.slug} id={`roster-${p.slug}`}>
                    <td data-label="#">
                      {PORTRAIT_NUMBERS.has(p.number) ? (
                        <button type="button" className={styles.rosterPortraitBtn} onClick={() => setPortraitLightbox(p)}>
                          {p.number}
                        </button>
                      ) : p.number}
                    </td>
                    <td data-label="Player">{p.first} {p.last}</td>
                    <td data-label="Grade">{p.grade}</td>
                    <td data-label="Position">{p.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        })()}
        <p className={styles.sampleCaption}>
          Roster subject to change before the season opener. Position abbreviations: OH = Outside Hitter, O = Opposite, S = Setter, L = Libero, DS = Defensive Specialist, MB = Middle Blocker.
        </p>

        {portraitLightbox && (
          <Lightbox
            images={[{
              src: `/photos/volleyball-media-day-portraits/${portraitLightbox.number}.jpg`,
              alt: `${portraitLightbox.first} ${portraitLightbox.last} (#${portraitLightbox.number}) — Media Day portrait, Bridgewater-Raritan Panther Volleyball, Zarcone Photography`,
            }]}
            currentIndex={0}
            onClose={() => setPortraitLightbox(null)}
            onPrev={() => {}}
            onNext={() => {}}
          />
        )}
      </section>

      {/* ── Coaches ──────────────────────────────────────────────── */}
      <section>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Leadership</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Coaching <em>Staff</em></h2>
          </div>
        </div>
        <div className={styles.coachGrid}>
          {COACHES.map((c, i) => (
            <div key={i} className={styles.coachCard}>
              <div className={styles.coachAvatar}>{c.name.split(' ').map(n => n[0]).join('')}</div>
              <div>
                <div className={styles.coachName}>{c.name}</div>
                <div className={styles.coachTitle}>{c.title}</div>
                <p className={styles.coachBio}>{c.bio}</p>
              </div>
            </div>
          ))}
        </div>
        <p className={styles.staffLabel}>Assistant Coaching Staff</p>
        <div className={styles.staffGrid}>
          {STAFF.map((s, i) => (
            <div key={i} className={styles.staffCard}>
              <div className={styles.staffName}>{s.name}</div>
              <div className={styles.staffTitle}>{s.title}</div>
              <p className={styles.staffNote}>{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Player ──────────────────────────────────────── */}
      <section>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Player Spotlight</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Featured <em>Player</em></h2>
          </div>
        </div>
        <div className={styles.spotlightWrap}>
          <div className={styles.spotlightBadge}>
            {PORTRAIT_NUMBERS.has(FEATURED_PLAYER.number) ? (
              <Image src={`/photos/volleyball-media-day-portraits/${FEATURED_PLAYER.number}.jpg`} alt={`${FEATURED_PLAYER.name} — Bridgewater-Raritan Panther Volleyball, Zarcone Photography`} fill sizes="220px" style={{ objectFit: 'cover', objectPosition: 'center 12%' }} />
            ) : (
              `#${FEATURED_PLAYER.number}`
            )}
          </div>
          <div>
            <div className={styles.spotlightName}>{FEATURED_PLAYER.name}</div>
            <div className={styles.spotlightClass}>{FEATURED_PLAYER.detail}</div>
            <p className={styles.spotlightBio}>{FEATURED_PLAYER.bio}</p>
            <p className={styles.spotlightNote}>Season stats provided directly by Zarcone Photography's program contact; not sourced to a published preseason article.</p>
          </div>
        </div>
      </section>

      {/* ── Players to Watch ─────────────────────────────────────── */}
      <section style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>2026 Outlook</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Players To <em>Watch</em></h2>
          </div>
          <p className={styles.sectionSub}>
            BR graduated 10 seniors off last year's county-championship roster — including its two primary kill producers. 2026 is less about who returns and more about which returning players take over those touches.
          </p>
        </div>
        <div className={styles.coachGrid}>
          {PLAYMAKERS_2026.map((p, i) => (
            <div key={i} className={styles.coachCard}>
              <div className={styles.coachAvatar}>{p.name.split(' ').map(n => n[0]).join('')}</div>
              <div>
                <div className={styles.coachName}>{p.name}</div>
                <div className={styles.coachTitle}>{p.detail}</div>
                <p className={styles.coachBio}>{p.bio}</p>
              </div>
            </div>
          ))}
        </div>
        <p className={styles.sampleCaption}>
          BR's two leading kill producers from 2025 — Grace Marvuglio and Sydney Bishop, who combined for 30 kills in the county semifinal alone — both graduated. Reese Albano (72 digs in 2025) and the rest of the returning group inherit that gap; who steps into the kill role is the open question of the preseason.
        </p>
      </section>

      {/* ── Gallery Preview ─────────────────────────────────────── */}
      <span id="gallery" style={{ position: 'relative', top: -120, display: 'block' }} aria-hidden="true" />
      <section className={styles.gallery} id="gallery-alert" style={{ scrollMarginTop: 120 }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>From The Court</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Season <em>Gallery</em></h2>
          </div>
          <p className={styles.sectionSub}>Match action from Panther Volleyball, shot by Zarcone Photography.</p>
        </div>

        <div className={styles.seasonPills}>
          {GALLERIES_2026.map((g, i) => (
            <a key={`gallery-${i}`} href={g.href} target="_blank" rel="noopener noreferrer" className={`${styles.seasonPill} ${styles.seasonPillActive}`}>{g.label} — Live</a>
          ))}
          <span className={`${styles.seasonPill} ${styles.seasonPillPending}`}>2026 Season — Opens Sep 1</span>
        </div>

        <div className={styles.noticeBar}>
          <span className={styles.noticeDot} />
          Galleries post here after each match — the 2026 regular-season opener is Sep 1 at Hillsborough.
        </div>

        <GalleryAlertSignup
          team="Volleyball"
          source="BRHS Panther Volleyball — Gallery Alert"
          colors={{
            accent: 'var(--br-red)',
            accentDark: 'var(--br-red-dark)',
            text: 'var(--br-silver)',
            textSoft: 'var(--br-silver-dim)',
            bg: 'rgba(255,255,255,0.03)',
            border: 'rgba(200,16,46,0.35)',
            btnText: '#fff',
          }}
        />

        <div className={styles.masonry}>
          {PHOTOS.map((photo, i) => (
            <div key={i} className={styles.tile} onClick={() => setLbIndex(i)}>
              <Image
                src={photo.src}
                alt="Bridgewater-Raritan Panther Girls Volleyball — Zarcone Photography, New Jersey"
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          ))}
        </div>

        {lbIndex !== null && (
          <Lightbox
            images={PHOTOS.map(p => ({ src: p.src, alt: 'Bridgewater-Raritan Panther Girls Volleyball — Zarcone Photography, New Jersey' }))}
            currentIndex={lbIndex}
            onClose={() => setLbIndex(null)}
            onPrev={() => setLbIndex((lbIndex - 1 + PHOTOS.length) % PHOTOS.length)}
            onNext={() => setLbIndex((lbIndex + 1) % PHOTOS.length)}
          />
        )}
      </section>

      {/* ── Official Program Resource ───────────────────────────── */}
      <div className={styles.officialResource}>
        <div className={styles.officialResourceInner}>
          <span className={styles.eyebrowRed}>Official Program Resource</span>
          <h3 className={styles.officialResourceTitle}>Bridgewater-Raritan Athletics</h3>
          <p className={styles.officialResourceBody}>
            Visit Bridgewater-Raritan Athletics for official program announcements, schedules, forms, and team updates.
          </p>
          <a
            href="https://www.brrsd.org/o/brrhs/page/team-sports"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.partnershipLink}
          >
            Visit Bridgewater-Raritan Athletics →
          </a>
        </div>
      </div>

      {/* ── About Your Media Partner ─────────────────────────────────
          Consolidated 2026-08-25, same pattern as the football dashboard
          rebuild — 8 previously-separate marketing sections (Senior
          Experience, Match Day Coverage, Why Us, Services, Carousel, Trust
          Note/Testimonials) folded into one compact block below the real
          program data. No dated, sourced Instagram quote exists yet for
          volleyball the way football has one — rather than invent one, this
          keeps the general <Testimonials /> component (real, cross-program
          reviews) instead of a single attributed quote. ── */}
      <section className={styles.trustNote} style={{ '--accent': 'var(--br-red)' }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Powered By</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Your Media <em>Partner</em></h2>
          </div>
        </div>
        <p style={{ color: 'var(--br-silver)', fontSize: 16, lineHeight: 1.8, maxWidth: 720 }}>
          Zarcone Photography is the official media partner of BRHS Panther Girls Volleyball — full match-day coverage, a custom Senior
          Night poster for every graduating senior, and recruiting content, from a photographer with 30+ years shooting NJ high school sports — plus the
          same role with <Link href="/brhs-panther-football">Panther Football</Link> and <Link href="/brhs-panther-wrestling">Panther Wrestling</Link>.
          Outside the season partnership, private senior sessions, family photos, and other bookings are available too — <a href="#inquire">reach out here</a>.
        </p>
        <div className={styles.grid3col} style={{ marginTop: 32 }}>
          <div className={styles.iconCard}><h3>Every Home Match</h3><p>Full baseline coverage — kills, digs, blocks, and the bench reactions — professionally edited and posted within days.</p></div>
          <div className={styles.iconCard}><h3>Senior Night</h3><p>A custom commemorative poster and portrait session for every graduating senior.</p></div>
          <div className={styles.iconCard}><h3>Prints &amp; Downloads</h3><p>High-resolution downloads and print products, ordered directly from your gallery.</p></div>
        </div>

        <div style={{ marginTop: 40 }}>
          <span className={styles.eyebrowRed}>What Clients Say</span>
          <Testimonials />
        </div>

        <div className={styles.socialLinks} style={{ marginTop: 24 }}>
          <a href="https://instagram.com/zarconephotography" target="_blank" rel="noopener noreferrer">Instagram →</a>
          <a href="https://facebook.com/zarconephotography" target="_blank" rel="noopener noreferrer">Facebook →</a>
          <Link href="/">zarconephotography.com →</Link>
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
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Let's Talk <em>Panther Volleyball</em></h2>
          </div>
        </div>
        <div className={styles.contactWrap}>
          <div>
            <p style={{ color: 'var(--br-silver)', fontSize: 16, lineHeight: 1.8 }}>
              Questions about ordering photos, reserving Senior Night coverage, or hiring Zarcone Photography privately —
              send a message and we'll respond within 24 hours.
            </p>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="name">Name</label>
              <input id="name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label htmlFor="phone">Phone</label>
              <input id="phone" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label htmlFor="athleteName">Athlete Name</label>
              <input id="athleteName" value={form.athleteName} onChange={e => setForm({ ...form, athleteName: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label htmlFor="sport">Sport</label>
              <input id="sport" value={form.sport} onChange={e => setForm({ ...form, sport: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label htmlFor="interestedIn">Interested In</label>
              <select id="interestedIn" value={form.interestedIn} onChange={e => setForm({ ...form, interestedIn: e.target.value })}>
                <option>Prints</option>
                <option>Digital Downloads</option>
                <option>Senior Portraits</option>
                <option>Media Day</option>
                <option>Team Photography</option>
                <option>Event Coverage</option>
                <option>Other</option>
              </select>
            </div>
            <div className={`${styles.field} ${styles.formFull}`}>
              <label htmlFor="message">Message</label>
              <textarea id="message" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </div>
            {status === 'success' && <p className={styles.formSuccess}>Thanks — your message is in. We'll respond within 24 hours.</p>}
            {status === 'error' && <p className={styles.formError}>Something went wrong. Please try again or email info@zarconephotography.com directly.</p>}
            <button type="submit" className={`${styles.btnRed} ${styles.submitBtn}`} disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* ── QR (physical signage at games links back here) ───────── */}
      <div className={styles.qrBlock} style={{ margin: '0 auto 60px', textAlign: 'center' }}>
        <Image src="/assets/qr-brhs-panther-volleyball.png" alt="QR code to this page" width={240} height={240} style={{ width: 120, height: 120 }} />
        <span>Scan to Return Here</span>
      </div>

      <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.floatCta}>
        <span className={styles.floatCtaLong}>View Latest Photos</span>
        <span className={styles.floatCtaShort}>Photos</span>
      </a>
    </div>
  );
}
