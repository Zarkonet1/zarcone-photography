'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lightbox from '@/components/Lightbox';
import Testimonials from '@/components/Testimonials';
import GalleryAlertSignup from '@/components/GalleryAlertSignup';
import GalleryAlertToast from '@/components/GalleryAlertToast';
import styles from './page.module.css';
import { getRecord, getNextMatch, getLatestResult, getCoachTenure, ordinal } from '@/lib/teamSchedule';
import { sortArticlesByDate, isRecentArticle } from '@/lib/articles';
import { SCHEDULE_2026 } from '@/lib/footballSchedule';
import { GALLERIES_2026, getLatestGallery } from '@/lib/footballGalleries';

const GALLERY_URL = 'https://galleries.zarconephotography.com';
const SEASON_GALLERY_URL = 'https://zarconephotography.smugmug.com/2025-2026-BRHS-Football';

// Derived from lib/footballGalleries.js — don't hand-edit galleries here.
// Add new weeks to GALLERIES_2026 in that file; this page just reads it.
const LATEST_GALLERY = getLatestGallery(GALLERIES_2026);
const MEDIA_DAY_GALLERY = GALLERIES_2026.find((g) => g.id === 'media-day');

// Bump CURRENT_SEASON_YEAR once a year — coach tenure (STAT_BAR + COACHES
// title below) derives from these instead of being hand-typed in two places,
// which is exactly how the "3rd Season" stat went stale last time.
const HEAD_COACH_START_YEAR = 2023; // Catalano's first season as head coach
const JOINED_PROGRAM_YEAR = 2022;   // Catalano's first year at BRHS (as DC)
const CURRENT_SEASON_YEAR = 2026;
const COACH_TENURE = getCoachTenure({
  headCoachStartYear: HEAD_COACH_START_YEAR,
  joinedProgramYear: JOINED_PROGRAM_YEAR,
  currentSeasonYear: CURRENT_SEASON_YEAR,
});

// Only genuine football action photos — no cross-sport placeholders.
const PHOTOS = [
  { src: '/photos/i-s7zBdzk.jpg', width: 2400, height: 1600, size: 'wide' },
  { src: '/photos/SPORTS-FB100.jpg', width: 1600, height: 1066, size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-45.jpg', width: 1600, height: 1066 },
  { src: '/photos/SPORTS-Zarcone-Photography-0136-2.jpg', width: 1600, height: 1066, size: 'wide' },
  { src: '/photos/SPORTS-DSC_5128-1.jpg', width: 1600, height: 1059 },
  { src: '/photos/i-HkmJPk8.jpg', width: 1600, height: 2400 },
  { src: '/photos/SPORTS-Zarcone-Photography-0006.jpg', width: 1066, height: 1600 },
  { src: '/photos/SPORTS-Zarcone-Photography-0016.jpg', width: 1066, height: 1600 },
  { src: '/photos/SPORTS-Zarcone-Photography-0025-2.jpg', width: 1600, height: 1066 },
  { src: '/photos/SPORTS-Zarcone-Photography-0072.jpg', width: 1066, height: 1600 },
  { src: '/photos/SPORTS-Zarcone-Photography-0073-2.jpg', width: 1066, height: 1600 },
  { src: '/photos/SPORTS-Zarcone-Photography-0088.jpg', width: 1600, height: 1066 },
  { src: '/photos/SPORTS-Zarcone-Photography-0133.jpg', width: 1066, height: 1600 },
];

const CAROUSEL = [
  { src: '/photos/i-s7zBdzk.jpg', width: 2400, height: 1600, caption: 'Friday Night Lights' },
  { src: '/photos/SPORTS-FB100.jpg', width: 1600, height: 1066, caption: 'Every Snap Tells A Story' },
  { src: '/photos/SPORTS-Zarcone-Photography-45.jpg', width: 1600, height: 1066, caption: 'Game Day, Every Week' },
  { src: '/photos/i-HkmJPk8.jpg', width: 1600, height: 2400, caption: 'This Is Panther Football' },
  { src: '/photos/SPORTS-Zarcone-Photography-0088.jpg', width: 1600, height: 1066, caption: '2025: A Season For The Record Books' },
];

// SCHEDULE_2026 now lives in lib/footballSchedule.js (imported above) so
// components/AnnouncementBar.jsx can share it — see that file's header
// comment for why. Don't redeclare it here.

// Real coverage of the program — no invented headlines. `date` is the
// article's real publish date, confirmed against the source where possible;
// a couple (marked below) are close estimates where an exact publish date
// wasn't available but the event date was. This field drives both the sort
// order and the "NEW" badge — see lib/articles.js — so the array below does
// NOT need to be kept in manual chronological order.
const ARTICLES = [
  { title: 'Six Panthers, Coach Catalano Represent Bridgewater-Raritan At Big Central Conference Media Day', source: 'Patch', url: 'https://patch.com/new-jersey/bridgewater/bridgewater-raritan-football-team-appear-big-central-media-day', date: '2026-08-05' /* added 2026-08-06 via routine source sweep — article:published_time confirmed 2026-08-05T14:38:16Z, current-year and legitimate (cross-checked against a same-topic TAPinto piece and an older unionnewsdaily "BCC Media Day" article that both turned out to be stale prior-year copies — see the FOOTBALL-SOURCES.md stale-year-trap note; this Patch piece and unionnewsdaily's separate "Fourth annual BCC Media Day" recap, published 2026-08-06, corroborate each other on date/division alignment). Coach D.J. Catalano and six seniors — Jahmier Black, James Locrotondo, Jack Ritch, Nick Crovelli, Jasper Schwamberger, and Jamelle Jones — represented BRHS at the Big Central Conference's fourth annual Media Day, Aug. 5 at Kean University's Harwood Arena; all six are on the current roster above (all Class of '27). Notable: Black is also the page's Featured Player, so this independently reinforces that pick. */ },
  { title: 'Panther Alum Joe Spirra (Class of 2024) Named AP Second Team All-American At Ithaca College', source: 'Ithaca College Athletics', url: 'https://athletics.ithaca.edu/news/2025/12/18/football-spirra-named-second-team-all-american-by-the-associated-press.aspx', date: '2025-12-18' /* added 2026-08-01 via brhs-alumni-watch — first discovery of this alum, found while cross-checking the tracker's 2026 signees against Ithaca's roster page and noticing a second, unrelated Bridgewater-Raritan name already on the active roster. Spirra graduated BRHS in 2024 (captain, 1st Team All-Area/All-Division, led team in tackles), redshirt/backup as a freshman, then broke out as a sophomore starter in 2025: AP Second Team All-American, D3football.com Fourth Team, First Team All-Region 2, All-Liberty League First Team, and Liberty League Defensive Player of the Year — led the team in tackles for loss and interceptions. Corroborated by Liberty League's own site and a BRHS Prowler alumnus profile; see PANTHER-ALUMNI.md Class of 2024 for full detail. */ },
  { title: '2026 Signing Day: Four More Panthers Join Justin Simpson In College Football — Amoafo (Saint Anselm), Pizzelanti (Hamilton), Zeiman (Lafayette), Antunes (Ithaca)', source: 'PJR Sports Report', url: 'https://www.pjrsportsreport.com/uncategorized/post-1725-team-preview-2026-bridgewater-raritan-panthers/', date: '2026-07-11' /* consolidated 2026-07-24 per Tom's call: single entry covering all 4 additional signees (flagged 2026-07-22, independently corroborated by PJR's team preview 2026-07-23) rather than 4 separate cards. Sourced to PJR since it's the citable public article confirming all 4 school destinations; original tip was a BRHSPantherFB team social post. Simpson keeps his own earlier, more detailed entry below. */ },
  { title: 'Panther Plans: Three Grads Commit To College Lacrosse — Kurdyla (Rutgers), Cifuentes (Air Force), Bratus (NJIT) — Plus Army & Brown Interest In Evan Woodring', source: 'PJR Sports Report', url: 'https://www.pjrsportsreport.com/uncategorized/post-1725-team-preview-2026-bridgewater-raritan-panthers/', date: '2026-07-11' /* added 2026-07-24 per Tom's call, title "Panther Plans": both items flagged 2026-07-23 from PJR's team preview — Kurdyla/Cifuentes/Bratus are 2026 football alumni moving on to play lacrosse in college (not football), and Woodring (offense/roster still active) has recruiting offers from Army and Brown per the same PJR article. Consolidated into one card since neither is a standalone news story. */ },
  { title: 'Team Preview 2026: Bridgewater-Raritan Panthers', source: 'PJR Sports Report', url: 'https://www.pjrsportsreport.com/uncategorized/post-1725-team-preview-2026-bridgewater-raritan-panthers/', date: '2026-07-11' /* corrected 2026-07-23: article:published_time metadata is 2026-07-11T18:47:44Z; the in-article byline reads "July 10" but per the array's stated convention (real publish date over event/write date), 07-11 is correct */ },
  { title: 'Bridgewater-Raritan Football State Champions Honored By Board Of Education', source: 'Patch', url: 'https://patch.com/new-jersey/bridgewater/bridgewater-raritan-football-state-champions-honored-board-education', date: '2026-02-19' },
  { title: 'Bridgewater-Raritan Football Coach Named Coach Of Year For Historic Season', source: 'Patch', url: 'https://patch.com/new-jersey/bridgewater/bridgewater-raritan-football-coach-named-coach-year-historic-season', date: '2026-02-04' },
  { title: 'Standout Tackle Justin Simpson Of The Record-Setting Bridgewater-Raritan Football Team Is Headed To Bucknell', source: 'BRRSD Athletics', url: 'https://www.brrsd.org/o/brrhs/article/2580305', date: '2025-12-04' },
  { title: 'Football: Bridgewater-Raritan Wins First Sectional Championship, 21-14, Over Bayonne', source: 'TAPinto', url: 'https://www.tapinto.net/towns/bayonne/sections/sports/articles/football-bridgewater-raritan-wins-first-sectional-championship-21-14-over-bayonne', date: '2025-11-15' },
  { title: 'North 2, Group 5 Final Preview: Bridgewater-Raritan Panthers vs. Bayonne Bees', source: 'CJ Sports Radio', url: 'https://cjsportsradio.com/2025/11/14/north-2-group-5-final-preview-bridgewater-raritan-panthers-vs-bayonne-bees/', date: '2025-11-14' },
  { title: 'History On The Line: Bridgewater-Raritan HS Seeks To Win 1st Ever State Sectional Football Championship', source: 'Patch', url: 'https://patch.com/new-jersey/bridgewater/history-line-bridgewater-raritan-hs-seeks-win-1st-ever-state-sectional', date: '2025-11-12' /* estimate — between the Nov 7 semifinal win and Nov 14 final; exact publish date not confirmed */ },
  { title: "Bridgewater-Raritan Tops Union City At Home, 22-7, To Clinch First Sectional Finals Berth Since '17", source: 'CJ Sports Radio', url: 'https://cjsportsradio.com/2025/11/07/bridgewater-raritan-tops-union-city-at-home-22-7-to-clinch-first-sectional-finals-berth-since-17/', date: '2025-11-07' },
  { title: 'Bridgewater-Raritan Cruised Past Linden In State Football Playoff Opener', source: 'The Prowler (BRHS Student News)', url: 'https://brhsprowler.org/5012/sports/bridgewater-raritan-cruised-past-linden-in-state-football-playoff-opener/', date: '2025-11-01' /* estimate — game was Oct 31; exact Prowler publish date not confirmed */ },
  { title: 'Athletes In Focus: Denzel Amoafo', source: 'TAPinto', url: 'https://www.tapinto.net/towns/bridgewater-slash-raritan/columns/athletes-in-focus/articles/denzel-amoafo', date: '2025-09-17' },
];

const FAQ = [
  {
    q: 'Where do I order photos?',
    a: <>The 2025–26 season gallery is live now on <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer">SmugMug</a>, where you can view, download, and order prints directly. 2026 season galleries will be delivered through <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer">Pic-Time</a>, our current client gallery platform.</>,
  },
  {
    q: 'How quickly are galleries posted?',
    a: 'Game galleries are professionally edited and delivered within days of each game, not weeks — so photos are ready while the moment is still fresh.',
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
    q: 'Do you photograph all home games?',
    a: 'Regular season home games are covered in full as part of the season partnership, along with Senior Night and postseason play if the Panthers advance.',
  },
  {
    q: 'Can I request a specific athlete?',
    a: 'Every effort is made to capture the full roster across a game. If you\'re looking for a specific athlete or moment, reach out after a gallery is posted and we\'ll help you find it.',
  },
  {
    q: 'How do senior banners work?',
    a: 'Every graduating senior receives a custom commemorative poster design as part of the partnership — coordinated directly with the program ahead of Senior Night.',
  },
];

const WHY_US = [
  { num: '01', title: '30+ Years Experience', body: 'Three decades behind the camera across NJ high school and collegiate sports.' },
  { num: '02', title: 'Pro Nikon Z-System', body: 'Nikon Z9 and Z8 bodies built to deliver in any light, at game speed.' },
  { num: '03', title: 'Fast Turnaround', body: 'Edited galleries delivered within days of the final whistle.' },
  { num: '04', title: 'Professional Editing', body: 'Every image color-corrected and finished before it reaches your gallery.' },
  { num: '05', title: 'Official Media Partner', body: 'The exclusive 2026 season media partner and a Gold Level Sponsor of Panther Football.' },
  { num: '06', title: 'Prints & Downloads', body: 'High-resolution downloads and print products, ordered directly from your private gallery.' },
];

// Real program history and 2025 season facts — sourced from CJ Sports Radio,
// TAPinto, The Prowler (BRHS student news), and BRRSD athletics. No invented stats.
const STAT_BAR = [
  { num: "'25", label: 'Sectional Champions', sub: 'North 2, Group 5 — first title in program history' },
  { num: '3-1', label: '2025 Playoff Record', sub: 'Linden · Union City · Bayonne · Passaic Co. Tech' },
  { num: '4×', label: 'Sectional Finalists', sub: '2015 · 2016 · 2017 · 2025' },
  { num: ordinal(COACH_TENURE.seasonNumber), label: 'Season As Head Coach', sub: `D.J. Catalano, entering his ${ordinal(COACH_TENURE.yearsAtSchool)} year at BRHS` },
];

// Big Central Conference — American Silver Division for 2026 (per Union News
// Daily / Yahoo Sports division-alignment coverage, July 2026): Bridgewater-
// Raritan, Hillsborough, Phillipsburg, Ridge. This matches the three games
// already flagged `league: true` in SCHEDULE_2026 above — don't add a 4th
// conference opponent here without also flagging it there, or the two will
// disagree.
//
// Bridgewater-Raritan's own row is NOT hand-typed — it derives from
// SCHEDULE_2026 below, the same single-source-of-truth pattern as Record /
// Next Game / Latest Result in SEASON_TRACKER. The other three teams have no
// schedule data in this codebase, so THEIR wins/losses are manual and need a
// weekly touch-up once the season starts (Aug 27 opener) — update from
// MaxPreps' Big Central standings page or NJ.com's weekly Big Central
// roundup. All four start 0-0-0 in the preseason, which is accurate, not a
// bug — the table will fill in as games are played.
const OTHER_STANDINGS_2026 = [
  { team: 'Hillsborough', wins: 0, losses: 0, confWins: 0, confLosses: 0 },
  { team: 'Phillipsburg', wins: 0, losses: 0, confWins: 0, confLosses: 0 },
  { team: 'Ridge', wins: 0, losses: 0, confWins: 0, confLosses: 0 },
];

// BRHS's own standings row derives from SCHEDULE_2026 — see the comment on
// OTHER_STANDINGS_2026 above for why the other three teams are hand-entered.
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

// Sorted by conference record, then overall record, then alphabetically —
// all ties (e.g. the 0-0-0 preseason state) fall back to alphabetical, so
// the order is stable and never implies a rank that hasn't been earned yet.
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

const SEASON_TRACKER = [
  { label: 'Record', value: getRecord(SCHEDULE_2026), href: '#schedule' },
  { label: 'Next Game', value: getNextMatch(SCHEDULE_2026, 'Season Complete'), href: '#schedule' },
  { label: 'Latest Result', value: getLatestResult(SCHEDULE_2026, '2025: Sectional Champions'), href: '#results' },
  {
    label: 'Division Standing',
    value: DIVISION_GAMES_PLAYED
      ? `${BRHS_STANDINGS_ROW.confWins}-${BRHS_STANDINGS_ROW.confLosses} — Am. Silver`
      : 'Am. Silver — Preseason',
    href: '#standings',
  },
  {
    label: 'Latest Gallery',
    value: LATEST_GALLERY ? `${LATEST_GALLERY.label} — Live` : '2025–26 Season — Live',
    href: LATEST_GALLERY ? LATEST_GALLERY.href : SEASON_GALLERY_URL,
    external: true,
  },
];

const COACHES = [
  {
    name: 'D.J. Catalano',
    title: `Head Varsity Football Coach · ${ordinal(COACH_TENURE.seasonNumber)} Season · ${ordinal(COACH_TENURE.yearsAtSchool)} Year at BRHS`,
    bio: 'Catalano joined the Bridgewater-Raritan program four years ago, spending his first season under then-head coach Rick Mantz before taking over as head coach. Entering his third year leading the program in 2025, he guided the Panthers to their first sectional championship in school history.',
  },
];

// Full assistant coaching staff — sourced directly from BRHS Football's own
// coach bio deck (provided by Tom, July 2026). Condensed to one line each;
// "TEST Football Academy" (Puleio) is a real NJ combine-training facility
// headquartered in Bridgewater, not a placeholder — verified, not a typo.
const STAFF = [
  { name: 'Paul Day', title: 'Assistant Coach: OL/DL', note: 'Entering his 27th year coaching high school football; won 58 games in 8 years at North Brunswick (2017-2024) before joining Bridgewater-Raritan.' },
  { name: 'Dominic Mulieri', title: 'Special Teams Coordinator', note: 'Former head football coach at Indian Hills High School (2019-2023), after four years as an assistant there.' },
  { name: 'Joe Cahill', title: 'Offensive Coordinator', note: 'With the program since 2020 in various roles; a Bridgewater-Raritan alum (2002-2005) who played college football at Wilkes University.' },
  { name: 'Joe Puleio', title: 'Assistant Coach: WRs/DBs', note: 'Joined Bridgewater-Raritan in 2024 after coaching stops at Towson and Randolph, plus internships with Rutgers and TEST Football Academy.' },
  { name: 'Kyle Paustian', title: 'Defensive Coordinator', note: "A Bridgewater-Raritan alum (2007-2010) returning for his second stint as the Panthers' defensive coordinator, after two years in the role at Franklin." },
  { name: 'Brett Stibitz', title: 'Assistant Coach: CBs/RBs', note: 'Former head coach and defensive coordinator at Manville and Middlesex High Schools, and a 5-year NFL High School Player Development Coach.' },
  { name: 'Nick Costanzo', title: 'Head Freshman Coach', note: "Bridgewater-Raritan's freshman coach since 2021 — and a Panther alum himself (2013-2017)." },
  { name: 'Chris Anderson', title: 'Assistant Freshman Coach', note: 'Played offensive line at Lock Haven University; coached at Franklin and North Brunswick before joining the staff.' },
  { name: 'Evan Fromberg', title: 'Assistant Coach · Director of Operations', note: 'On staff since 2022, following eight years coaching in the Bridgewater Football League (2011-2018).' },
  { name: 'Brandon T. Myers', title: 'Assistant Coach: TEs', note: 'A Rutgers tight end and 2021 Big Ten Distinguished Scholar; a 3x state finalist (31-5) and 2x conference champion at Bridgewater-Raritan.' },
  { name: 'Mark Szczecina', title: 'Assistant Coach', note: 'Joined the staff in 2022 after coaching in the Hillsborough Junior Raiders program (2014-2016).' },
];

const FEATURED_PLAYER = {
  name: 'Jahmier Black',
  detail: 'Senior · Running Back',
  bio: "Black steps in as the full-time starter at running back for his senior season, after rushing for 978 yards and 7 touchdowns as a co-starter in 2025 — a season that ended with Bridgewater-Raritan's first sectional championship in program history. He's drawing FCS interest from programs including Stony Brook and LIU, per PJR Sports Report's 2026 team preview.",
};

// 2025 playoff run only — the confirmed, sourced portion of the season.
// Full regular-season game log is not yet compiled; shown honestly rather than guessed.
const RESULTS_2025 = [
  { date: 'Oct 31, 2025', opponent: 'vs Linden', round: 'NJSIAA North 2, Group 5 Playoffs — First Round', result: 'W 35–6', win: true },
  { date: 'Nov 7, 2025', opponent: 'vs Union City', round: 'NJSIAA North 2, Group 5 Playoffs — Sectional Semifinal', result: 'W 22–7', win: true },
  { date: 'Nov 14, 2025', opponent: 'vs Bayonne', round: 'NJSIAA North 2, Group 5 Sectional Final', result: 'W 21–14', win: true },
  { date: 'Nov 21, 2025', opponent: 'vs Passaic County Tech', round: 'NJSIAA Group 5 State Tournament', result: 'L 14–23', win: false },
];

// 2026 is no longer a single pending placeholder — each week's Pic-Time
// gallery (GALLERIES_2026, imported above) gets its own pill, rendered
// alongside this archive entry. See the seasonPills render below.
const SEASONS = [
  { label: '2025–26', status: 'live', href: SEASON_GALLERY_URL },
];

// Preseason roster as of June 27, 2026, per BRHS Football Ops. Class year is
// the player's graduation year (e.g. 27 = Class of 2027 = senior for the
// 2026 fall season). Grade label derives from CURRENT_SEASON_YEAR so this
// doesn't need hand-editing every year.
function gradeFromClassYear(classYear, seasonYear = CURRENT_SEASON_YEAR) {
  const fullYear = 2000 + classYear;
  const diff = fullYear - (seasonYear + 1);
  const labels = { 0: 'Senior', 1: 'Junior', 2: 'Sophomore', 3: 'Freshman' };
  return labels[diff] || `Class of ${fullYear}`;
}

// Off Pos drives the position-group bucket shown on the roster; Def Pos is
// shown alongside since most of the roster plays both ways at this level.
const OFF_POS_GROUP = {
  QB: 'Quarterbacks',
  RB: 'Running Backs',
  WR: 'Wide Receivers',
  'WR/TE': 'Wide Receivers',
  TE: 'Tight Ends',
  OL: 'Offensive Line',
  K: 'Specialists',
};
const ROSTER_GROUP_ORDER = ['Quarterbacks', 'Running Backs', 'Wide Receivers', 'Tight Ends', 'Offensive Line', 'Specialists'];
// "All" is the only view long enough to need collapsing — individual position
// groups are already short. Collapsed to this many rows until expanded.
const ROSTER_PREVIEW_COUNT = 15;

// Shared by the player table and the managers table — falls back to a stable
// no-op (returns 0) for keys a row doesn't have, e.g. sorting managers by
// "number" or "offPos", which they don't carry.
function compareRosterRows(a, b, key, dir) {
  const mul = dir === 'desc' ? -1 : 1;
  let av, bv;
  if (key === 'number' || key === 'classYear') {
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

const ROSTER_RAW_2026 = [
  { number: 74, first: 'Andrew', last: 'Arndt', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 1, first: 'Jeremiah', last: 'Baker', classYear: 29, defPos: 'DB', offPos: 'RB' },
  { number: 10, first: 'JB', last: 'Baxter', classYear: 29, defPos: 'DB', offPos: 'QB' },
  { number: 31, first: 'Tyler', last: 'Baxter', classYear: 29, defPos: 'DB', offPos: 'WR' },
  { number: 11, first: 'Jahmier', last: 'Black', classYear: 27, defPos: 'LB', offPos: 'RB' },
  { number: 51, first: 'Nick', last: 'Bogolashvili', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 60, first: 'Alex', last: 'Budelmann', classYear: 28, defPos: 'DL', offPos: 'OL' },
  { number: 57, first: 'Derek', last: 'Carranza', classYear: 27, defPos: 'LB', offPos: 'TE' },
  { number: 56, first: 'Maseone', last: 'Christian', classYear: 29, defPos: 'DL', offPos: 'OL' },
  { number: 29, first: 'Messiah', last: 'Cole', classYear: 29, defPos: 'DB', offPos: 'WR' },
  { number: 27, first: 'Nick', last: 'Crovelli', classYear: 27, defPos: 'LB', offPos: 'WR' },
  { number: 79, first: 'Joseph', last: 'Day', classYear: 28, defPos: 'DL', offPos: 'OL' },
  { number: 15, first: 'Branden', last: 'De Matos', classYear: 27, defPos: 'DB', offPos: 'WR' },
  { number: 23, first: 'Francesco', last: 'DiMaria', classYear: 27, defPos: 'DB', offPos: 'WR' },
  { number: 44, first: 'Maximus', last: 'Dorsey', classYear: 27, defPos: 'DL', offPos: 'TE' },
  { number: 18, first: 'Kenneth', last: 'Graham', classYear: 27, defPos: 'DB', offPos: 'WR' },
  { number: 35, first: 'Hassan', last: 'Higgins', classYear: 27, defPos: 'DB', offPos: 'WR' },
  { number: 68, first: 'Colton', last: 'Hisko', classYear: 29, defPos: 'DL', offPos: 'OL' },
  { number: 21, first: 'Michael', last: 'Ianniciello', classYear: 28, defPos: 'DB', offPos: 'WR' },
  { number: 63, first: 'Nicholas', last: 'Iovine', classYear: 29, defPos: 'DL', offPos: 'OL' },
  { number: 64, first: 'AJ', last: 'Jimenez', classYear: 29, defPos: 'DL', offPos: 'OL' },
  { number: 41, first: 'Jamelle', last: 'Jones', classYear: 27, defPos: 'DL', offPos: 'RB' },
  { number: 86, first: 'Gizo', last: 'Kalandadze', classYear: 28, defPos: 'DB', offPos: 'WR' },
  { number: 26, first: 'Chase', last: 'Kedziora', classYear: 28, defPos: 'DB', offPos: 'WR' },
  { number: 32, first: 'Mason', last: 'Kowalik', classYear: 29, defPos: 'P', offPos: 'K' },
  { number: 30, first: 'Myles', last: 'Krihak', classYear: 28, defPos: 'DB', offPos: 'WR' },
  { number: 2, first: 'DJ', last: 'Krizan', classYear: 27, defPos: 'DB', offPos: 'WR' },
  { number: 80, first: 'Andrew', last: 'Kronengold', classYear: 29, defPos: 'DL', offPos: 'TE' },
  { number: 28, first: 'Justin', last: 'Lavender', classYear: 28, defPos: 'DL/LB', offPos: 'WR/TE' },
  { number: 55, first: 'Trent', last: 'Levash', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 4, first: 'James', last: 'Locrotondo', classYear: 27, defPos: 'DB', offPos: 'WR' },
  { number: 17, first: 'Anthony', last: 'Lorino', classYear: 27, defPos: 'LB', offPos: 'TE' },
  { number: 65, first: 'Neil', last: 'Luis', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 20, first: 'Parker', last: 'Lyons', classYear: 28, defPos: 'DB', offPos: 'WR' },
  { number: 8, first: 'Jack', last: 'Madsen', classYear: 27, defPos: 'LB', offPos: 'TE' },
  { number: 40, first: 'Dante', last: 'Markovitch', classYear: 28, defPos: 'LB', offPos: 'WR' },
  { number: 90, first: 'Jake', last: 'Markovitch', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 45, first: 'Robert', last: 'Matos', classYear: 29, defPos: 'LB', offPos: 'TE' },
  { number: 67, first: 'Martino', last: 'Nguyen', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 16, first: 'Tyler', last: "O'Hare", classYear: 28, defPos: 'DB', offPos: 'WR' },
  { number: 3, first: 'Jonathan', last: 'Okolo', classYear: 27, defPos: 'LB', offPos: 'RB' },
  { number: 77, first: 'Hugo', last: 'Ortega', classYear: 29, defPos: 'DL', offPos: 'OL' },
  { number: 7, first: 'Cole', last: 'Pello', classYear: 27, defPos: 'DB', offPos: 'WR' },
  { number: 33, first: 'Jake', last: 'Petrillo', classYear: 29, defPos: 'DB', offPos: 'WR' },
  { number: 34, first: 'Tyler', last: 'Plank', classYear: 29, defPos: 'LB', offPos: 'WR' },
  { number: 25, first: 'Sebastian', last: 'Redyk', classYear: 27, defPos: 'DL', offPos: 'TE' },
  { number: 19, first: 'Zach', last: 'Rinehimer', classYear: 29, defPos: 'DB', offPos: 'WR' },
  { number: 6, first: 'Sebastian', last: 'Risco', classYear: 28, defPos: 'DB', offPos: 'WR' },
  { number: 72, first: 'Jack', last: 'Ritch', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 49, first: 'Nathan', last: 'Robles', classYear: 29, defPos: 'LB', offPos: 'RB' },
  { number: 22, first: 'Chase', last: 'Rutherford', classYear: 29, defPos: 'DB', offPos: 'WR' },
  { number: 53, first: 'Alex', last: 'Rutkowski', classYear: 29, defPos: 'DL', offPos: 'OL' },
  { number: 61, first: 'Ethan', last: 'Sainte', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 24, first: 'Freddie', last: 'Schenk', classYear: 28, defPos: 'LB', offPos: 'WR' },
  { number: 13, first: 'Jasper', last: 'Schwamberger', classYear: 27, defPos: 'DB', offPos: 'WR' },
  { number: 48, first: 'Mason', last: 'Smalls', classYear: 29, defPos: 'DB', offPos: 'WR' },
  { number: 36, first: 'Damian', last: 'Stadnick', classYear: 29, defPos: 'DB', offPos: 'WR' },
  { number: 52, first: 'Trent', last: 'Thiry', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 47, first: 'Austin', last: 'Totten', classYear: 29, defPos: 'LB', offPos: 'TE' },
  { number: 81, first: 'Jack', last: 'Winchock', classYear: 29, defPos: 'DL', offPos: 'WR' },
  { number: 9, first: 'Jack', last: 'Winne', classYear: 28, defPos: 'DB', offPos: 'WR' },
  { number: 5, first: 'Evan', last: 'Woodring', classYear: 27, defPos: 'DB', offPos: 'QB' },
  { number: 76, first: 'Alex', last: 'Zimmerman', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 54, first: 'Ben', last: 'Zimmerman', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 14, first: 'Nathan', last: 'Zuckerman', classYear: 27, defPos: 'DB', offPos: 'TE' },
];

const ROSTER_2026 = ROSTER_RAW_2026
  .map((p) => ({
    ...p,
    grade: gradeFromClassYear(p.classYear),
    group: OFF_POS_GROUP[p.offPos] || 'Wide Receivers',
    slug: `${p.first}-${p.last}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  }))
  .sort((a, b) => a.number - b.number);

// Team managers, per BRHS Football Ops (received 2026-07-22). Source sheet
// columns read "First Name / Last Name" but the raw order looked backwards
// against known family names (e.g. "Locrotondo, Bellina" — James Locrotondo
// is on the player roster above, same surname) — flipped to read naturally.
// Confirm with Ops if any of these look wrong.
const MANAGERS_RAW_2026 = [
  { first: 'Nolan', last: 'Brown', classYear: 27 },
  { first: 'Ryan', last: 'Dobkin', classYear: 30 },
  { first: 'Ethan', last: 'Dobkin', classYear: 30 },
  { first: 'Patrick', last: 'Gonzalez', classYear: 29 },
  { first: 'Serena', last: 'Grasso', classYear: 27 },
  { first: 'Bellina', last: 'Locrotondo', classYear: 27 },
  { first: 'Jamie', last: 'McGeechan', classYear: 29 },
  { first: 'Amelia', last: 'Pan', classYear: 27 },
  { first: 'Rohan', last: 'Venugopal', classYear: 27 },
];

const MANAGERS_2026 = MANAGERS_RAW_2026
  .map((p) => ({
    ...p,
    grade: gradeFromClassYear(p.classYear),
    slug: `${p.first}-${p.last}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  }))
  .sort((a, b) => a.last.localeCompare(b.last));

const SERVICES = [
  { title: 'Game Day Coverage', body: 'Full home-game photography — action, sidelines, celebrations, and crowd.' },
  { title: 'Media Day Portraits', body: 'Individual and team portraits, graphics-ready and recruiting-ready.' },
  { title: 'Senior Night & Banners', body: 'Dedicated coverage and a custom poster design for every senior.' },
  { title: 'Social & Schedule Graphics', body: 'Branded graphics built for the program\'s social channels.' },
  { title: 'Recruiting Content', body: 'Imagery built to represent athletes well to college programs.' },
  { title: 'Private Sessions', body: 'Individual senior portraits, family sessions, and headshots by request.' },
];

export default function BRHSPantherFootballPage() {
  const [lbIndex, setLbIndex] = useState(null);
  const [slide, setSlide] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', athleteName: '', sport: 'Football', interestedIn: 'Prints', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [rosterFilter, setRosterFilter] = useState('All');
  const [rosterExpanded, setRosterExpanded] = useState(false);
  const [rosterSortKey, setRosterSortKey] = useState('number');
  const [rosterSortDir, setRosterSortDir] = useState('asc');
  const handleRosterSort = (key) => {
    if (rosterSortKey === key) {
      setRosterSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setRosterSortKey(key);
      setRosterSortDir('asc');
    }
  };
  const rosterSortArrow = (key) => (rosterSortKey === key ? (rosterSortDir === 'asc' ? ' ▲' : ' ▼') : '');

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % CAROUSEL.length), 5000);
    return () => clearInterval(t);
  }, []);

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
          source: 'BRHS Panther Football landing page',
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setForm({ name: '', email: '', phone: '', athleteName: '', sport: 'Football', interestedIn: 'Prints', message: '' });
    } catch {
      setStatus('error');
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Bridgewater-Raritan Panther Football — 2026 Season Media Partnership',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Zarcone Photography',
      url: 'https://www.zarconephotography.com',
      telephone: '(908) 777-0631',
      address: { '@type': 'PostalAddress', addressLocality: 'Bridgewater', addressRegion: 'NJ', addressCountry: 'US' },
    },
    areaServed: { '@type': 'City', name: 'Bridgewater, NJ' },
    description: 'Official 2026 season media partner and Gold Level Sponsor of Bridgewater-Raritan Panther Football — full game day coverage, Media Day portraits, Senior Night, and photo ordering.',
  };

  const eventLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'BRHS Panther Football Media Day 2026',
    startDate: '2026-07-29',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'Place', name: 'Bridgewater-Raritan High School', address: { '@type': 'PostalAddress', addressLocality: 'Bridgewater', addressRegion: 'NJ', addressCountry: 'US' } },
    organizer: { '@type': 'Organization', name: 'Zarcone Photography', url: 'https://www.zarconephotography.com' },
  };

  return (
    <div className={styles.wrap}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }} />

      <GalleryAlertToast
        team="Football"
        source="BRHS Panther Football — Gallery Alert Toast"
        dismissKey="gr-alert-dismissed-football"
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

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <Image src="/photos/i-s7zBdzk.jpg" alt="Bridgewater-Raritan Panther Football" fill priority sizes="100vw" className={styles.heroImg} />
        <div className={styles.heroScrim} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadgeRow}>
            <span className={styles.heroBadge}>2026 Season</span>
            <span className={styles.heroBadgeOutline}>Gold Level Sponsor</span>
          </div>
          <h1 className={styles.heroTitle}>Three Finals.<br /><span>Then History.</span></h1>
          <p className={styles.heroSub}>Three straight trips to the sectional final. Three losses. Then in 2025, Bridgewater-Raritan refused to let it happen again.</p>
          <p className={styles.heroWelcome}>Welcome to Bridgewater-Raritan Panther Football.</p>
          <div className={styles.heroCtas}>
            <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnRed}>View Season Galleries</a>
            <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnSilver}>Order Photos</a>
            <a href="#inquire" className={styles.btnGhost}>Book Zarcone Photography</a>
          </div>
        </div>
      </section>

      {/* ── Live Season Tracker ──────────────────────────────────── */}
      <section className={styles.latestBar}>
        <div className={styles.latestHead}>
          <span className={styles.latestDot} />
          <span className={styles.eyebrowRed}>2026 Season Tracker</span>
        </div>
        <div className={styles.latestGrid}>
          {SEASON_TRACKER.map((item, i) => {
            const Tag = item.external ? 'a' : Link;
            const linkProps = item.external
              ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
              : { href: item.href };
            return (
              <Tag key={i} className={styles.latestItem} {...linkProps}>
                <span className={styles.latestItemLabel}>{item.label}</span>
                <span className={styles.latestItemValue}>{item.value}</span>
              </Tag>
            );
          })}
        </div>
      </section>

      {/* ── Official credibility strip ──────────────────────────── */}
      <div className={styles.supportLine}>
        Official 2026 Season Media Partner &amp; Gold Level Sponsor of Bridgewater-Raritan Panther Football
      </div>

      {/* ── Program stat bar ─────────────────────────────────────── */}
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
        <p className={styles.statBarNote}>Program history and 2025 results per TAPinto, CJ Sports Radio, The Prowler (BRHS student news), and BRRSD Athletics.</p>
      </section>

      {/* ── Partnership ─────────────────────────────────────────── */}
      <section className={styles.partnership}>
        <div className={styles.logoBlock}>
          <Image src="/photos/brhs-panther-athletics-logo.png" alt="Bridgewater-Raritan Panther Athletics" width={1024} height={1024} sizes="220px" style={{ width: '100%', height: 'auto' }} />
          <span className={styles.sponsorTag}>Gold Level Sponsor · 2026 Season</span>
        </div>
        <div className={styles.partnershipBody}>
          <span className={styles.eyebrowRed}>Proud Partnership</span>
          <p style={{ marginTop: 18 }}>
            Zarcone Photography is the <strong>official media partner</strong> of BRHS Panther Football for the 2026 season — full home-game coverage,
            Media Day portraits, and a custom Senior Night poster for every graduating senior.
          </p>
          <p>
            This builds on a longer history with Bridgewater athletics, including an ongoing role as the official photography &amp; social media partner of{' '}
            <Link href="/brhs-panther-wrestling">BRHS Panther Wrestling</Link>. The goal is the same across every program: professional photography, real storytelling, and a visual record
            worth keeping — not just a highlight reel.
          </p>
          <p>
            Beyond the field, that commitment shows up in the community too — from sponsoring local charity events to showing up consistently,
            season after season, for the programs that trust us with their story.
          </p>
          <div className={styles.partnershipStats}>
            <div><div className={styles.statNum}>30+</div><div className={styles.statLabel}>Years Experience</div></div>
            <div><div className={styles.statNum}>'25 Champs</div><div className={styles.statLabel}>1st Sectional Title Ever</div></div>
            <div><div className={styles.statNum}>Jul 29</div><div className={styles.statLabel}>Media Day</div></div>
          </div>
          <Link href="/blog/brhs-panther-football-2026-media-partnership" className={styles.partnershipLink}>Read the Full Partnership Announcement →</Link>
        </div>
      </section>

      {/* ── Schedule & Results ───────────────────────────────────── */}
      <section id="schedule">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>2026 Season</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Schedule <em>&amp; Results</em></h2>
          </div>
          <p className={styles.sectionSub}>Coming off the program's first-ever NJSIAA sectional championship. Here's what's next.</p>
        </div>

        <div className={styles.championBanner}>
          <div className={styles.championBannerNum}>21–14</div>
          <div>
            <div className={styles.championBannerTitle}>North 2, Group 5 Sectional Champions</div>
            <div className={styles.championBannerBody}>
              Defeated Bayonne 21–14 on Nov. 14, 2025 at Basilone Memorial Field — the first sectional title in program history, after three straight finals losses in 2015–2017.
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
          Schedule per <a href="https://www.maxpreps.com/nj/bridgewater/bridgewater-raritan-panthers/football/schedule/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--br-red)' }}>MaxPreps</a> as of early August 2026 — additional games and playoff dates are added as the season is finalized. Kickoff times are subject to change; confirm before heading to a game via <a href="https://brhspantherfb.org/schedules/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--br-red)' }}>the official team site</a>. Results post here after each game.
        </p>
      </section>

      {/* ── Division Standings ───────────────────────────────────── */}
      <section id="standings" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Big Central Conference</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>American Silver <em>Standings</em></h2>
          </div>
          <p className={styles.sectionSub}>
            Bridgewater-Raritan plays in the American Silver Division of the Big Central Conference, alongside Hillsborough, Phillipsburg, and Ridge.
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
            ? 'Standings update as Big Central Conference games are reported.'
            : 'All four teams open the season 0-0 — the 2026 opener is Thu, Aug 27. Standings fill in as conference games are played.'}
          {' '}Bridgewater-Raritan's record is drawn automatically from the schedule above; other teams' records are tracked from{' '}
          <a href="https://www.maxpreps.com/nj/bridgewater/bridgewater-raritan-panthers/football/standings/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--br-red)' }}>MaxPreps</a> and NJ.com's weekly Big Central Conference roundup.
        </p>
      </section>

      {/* ── 2025 Playoff Run Results ─────────────────────────────── */}
      <section id="results" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>2025 Playoff Run</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>The Road <em>To The Title</em></h2>
          </div>
          <p className={styles.sectionSub}>Four games, three wins, and the first sectional championship in program history. The full regular-season log is still being compiled — this is the sourced playoff record.</p>
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
          <div className={styles.spotlightBadge}>RB</div>
          <div>
            <div className={styles.spotlightName}>{FEATURED_PLAYER.name}</div>
            <div className={styles.spotlightClass}>{FEATURED_PLAYER.detail}</div>
            <p className={styles.spotlightBio}>{FEATURED_PLAYER.bio}</p>
            <p className={styles.spotlightNote}>Per CJ Sports Radio, August 2025 preseason preview.</p>
          </div>
        </div>
      </section>

      {/* ── Roster ───────────────────────────────────────────────── */}
      <section id="roster" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Preseason Roster</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>2026 <em>Roster</em></h2>
          </div>
          <p className={styles.sectionSub}>
            {ROSTER_2026.length} players and {MANAGERS_2026.length} team managers as of July 2026, per BRHS Football Ops.{' '}
            {MEDIA_DAY_GALLERY ? (
              <>Everyone here is photographed at Media Day — <a href={MEDIA_DAY_GALLERY.href} target="_blank" rel="noopener noreferrer">browse the gallery</a>, updated with individual portraits this weekend.</>
            ) : (
              'Everyone here is photographed at Media Day on Jul 29 — the gallery posts here once portraits are ready.'
            )}
          </p>
        </div>
        <div className={styles.rosterFilterRow}>
          {['All', ...ROSTER_GROUP_ORDER, 'Managers'].map((g) => (
            <button
              key={g}
              type="button"
              className={rosterFilter === g ? styles.rosterFilterBtnActive : styles.rosterFilterBtn}
              onClick={() => {
                setRosterFilter(g);
                // Number/Off/Def don't exist on managers — fall back to a sort that does.
                if (g === 'Managers' && ['number', 'offPos', 'defPos'].includes(rosterSortKey)) {
                  setRosterSortKey('last');
                  setRosterSortDir('asc');
                }
              }}
            >
              {g}
            </button>
          ))}
        </div>
        {/* Mobile fallback — the table's <thead> (where the sort buttons live) is hidden below 640px, same as the schedule/results tables, so sorting needs its own control there. */}
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
          {rosterFilter === 'Managers' ? (
            <>
              <option value="last:asc">Sort: Name (A–Z)</option>
              <option value="last:desc">Sort: Name (Z–A)</option>
              <option value="classYear:asc">Sort: Grade (Senior–Freshman)</option>
            </>
          ) : (
            <>
              <option value="number:asc">Sort: Number (Low–High)</option>
              <option value="last:asc">Sort: Name (A–Z)</option>
              <option value="last:desc">Sort: Name (Z–A)</option>
              <option value="classYear:asc">Sort: Grade (Senior–Freshman)</option>
              <option value="offPos:asc">Sort: Position (A–Z)</option>
            </>
          )}
        </select>
        {rosterFilter === 'Managers' ? (
          <table className={`${styles.scheduleTable} ${styles.rosterTable}`}>
            <thead>
              <tr>
                <th><button type="button" className={styles.sortBtn} onClick={() => handleRosterSort('last')}>Name{rosterSortArrow('last')}</button></th>
                <th><button type="button" className={styles.sortBtn} onClick={() => handleRosterSort('classYear')}>Grade{rosterSortArrow('classYear')}</button></th>
              </tr>
            </thead>
            <tbody>
              {[...MANAGERS_2026].sort((a, b) => compareRosterRows(a, b, rosterSortKey, rosterSortDir)).map((p) => (
                <tr key={p.slug} id={`roster-${p.slug}`}>
                  <td data-label="Name">{p.first} {p.last}</td>
                  <td data-label="Grade">{p.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (() => {
          const filtered = ROSTER_2026.filter((p) => rosterFilter === 'All' || p.group === rosterFilter);
          const sorted = [...filtered].sort((a, b) => compareRosterRows(a, b, rosterSortKey, rosterSortDir));
          const isTruncated = rosterFilter === 'All' && !rosterExpanded && sorted.length > ROSTER_PREVIEW_COUNT;
          const visible = isTruncated ? sorted.slice(0, ROSTER_PREVIEW_COUNT) : sorted;
          return (
            <>
              <table className={`${styles.scheduleTable} ${styles.rosterTable}`}>
                <thead>
                  <tr>
                    <th><button type="button" className={styles.sortBtn} onClick={() => handleRosterSort('number')}>#{rosterSortArrow('number')}</button></th>
                    <th><button type="button" className={styles.sortBtn} onClick={() => handleRosterSort('last')}>Player{rosterSortArrow('last')}</button></th>
                    <th><button type="button" className={styles.sortBtn} onClick={() => handleRosterSort('classYear')}>Grade{rosterSortArrow('classYear')}</button></th>
                    <th><button type="button" className={styles.sortBtn} onClick={() => handleRosterSort('offPos')}>Off{rosterSortArrow('offPos')}</button></th>
                    <th><button type="button" className={styles.sortBtn} onClick={() => handleRosterSort('defPos')}>Def{rosterSortArrow('defPos')}</button></th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p) => (
                    <tr key={p.slug} id={`roster-${p.slug}`}>
                      <td data-label="#">{p.number}</td>
                      <td data-label="Player">{p.first} {p.last}</td>
                      <td data-label="Grade">{p.grade}</td>
                      <td data-label="Off">{p.offPos}</td>
                      <td data-label="Def">{p.defPos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rosterFilter === 'All' && sorted.length > ROSTER_PREVIEW_COUNT && (
                <button
                  type="button"
                  className={styles.rosterExpandBtn}
                  onClick={() => setRosterExpanded((v) => !v)}
                >
                  {rosterExpanded ? 'Show Fewer ↑' : `Show All ${sorted.length} Players ↓`}
                </button>
              )}
            </>
          );
        })()}
        <p className={styles.sampleCaption}>
          {rosterFilter === 'Managers'
            ? 'Team managers support the program on game days and at practice. Roster subject to change before the season opener.'
            : "Most players at this level go both ways — Off/Def columns show each player's primary alignment on both sides of the ball. Roster subject to change before the season opener."}
        </p>
      </section>

      {/* ── In The News ──────────────────────────────────────────── */}
      <section style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Coverage</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>In The <em>News</em></h2>
          </div>
          <p className={styles.sectionSub}>Real coverage of the team, the championship run, and the players — from local press and the school itself.</p>
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

      {/* ── Gallery Preview ─────────────────────────────────────── */}
      <section className={styles.gallery} id="gallery-alert">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>From The Sidelines</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Season <em>Gallery</em></h2>
          </div>
          <p className={styles.sectionSub}>Game action from Panther Football, shot by Zarcone Photography.</p>
        </div>

        <div className={styles.seasonPills}>
          {SEASONS.map((s, i) => (
            <a key={`season-${i}`} href={s.href} target="_blank" rel="noopener noreferrer" className={`${styles.seasonPill} ${styles.seasonPillActive}`}>{s.label} — Live</a>
          ))}
          {GALLERIES_2026.map((g, i) => (
            <a key={`gallery-${i}`} href={g.href} target="_blank" rel="noopener noreferrer" className={`${styles.seasonPill} ${styles.seasonPillActive}`}>{g.label} — Live</a>
          ))}
          <span className={`${styles.seasonPill} ${styles.seasonPillPending}`}>Future Weeks — Added As Posted</span>
        </div>

        <div className={styles.noticeBar}>
          <span className={styles.noticeDot} />
          Looking for a specific game? The full <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>2025–26 season gallery</a> is live now. 2026 season galleries post here after each game.
        </div>

        <GalleryAlertSignup
          team="Football"
          source="BRHS Panther Football — Gallery Alert"
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

        <div className={styles.galleryFooter} style={{ marginTop: 0, marginBottom: 36, justifyContent: 'flex-start', gap: 14 }}>
          <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnRed}>Browse 2025–26 Season Gallery</a>
          <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnGhost}>Order Prints &amp; Downloads</a>
        </div>

        <div className={styles.masonry}>
          {PHOTOS.map((photo, i) => (
            <div key={i} className={styles.tile} onClick={() => setLbIndex(i)}>
              <Image
                src={photo.src}
                alt="Bridgewater-Raritan Panther Football — Zarcone Photography, New Jersey"
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
            images={PHOTOS.map(p => ({ src: p.src, alt: 'Bridgewater-Raritan Panther Football — Zarcone Photography, New Jersey' }))}
            currentIndex={lbIndex}
            onClose={() => setLbIndex(null)}
            onPrev={() => setLbIndex((lbIndex - 1 + PHOTOS.length) % PHOTOS.length)}
            onNext={() => setLbIndex((lbIndex + 1) % PHOTOS.length)}
          />
        )}
      </section>

      {/* ── Media Day ────────────────────────────────────────────── */}
      <div className={styles.featureRow}>
        <div className={styles.featurePanel}>
          <span className={styles.featurePanelDate}>Jul 29</span>
          <span className={styles.featurePanelLabel}>Media Day</span>
        </div>
        <div className={styles.featureText}>
          <span className={styles.featureDate}>July 29, 2026</span>
          <h2 className={styles.featureTitle}>Media Day</h2>
          <p className={styles.featureLead}>Before a single snap is played, every athlete gets the professional treatment — clean portraits built for banners, programs, and recruiting profiles.</p>
          <ul className={styles.checklist}>
            <li>Individual portraits</li>
            <li>Team photos</li>
            <li>Social media graphics</li>
            <li>Schedule graphics</li>
            <li>Senior banners</li>
            <li>Player graphics</li>
            <li>Coach portraits</li>
            <li>Recruiting content</li>
          </ul>
          <p className={styles.sampleCaption}>Photos and graphics from Media Day are added here starting July 29.</p>
          <div style={{ marginTop: 28 }}>
            <a href="#inquire" className={styles.btnRed}>Book Media Day</a>
          </div>
        </div>
      </div>

      {/* ── Senior Experience ────────────────────────────────────── */}
      <div className={`${styles.featureRow} ${styles.reverse}`}>
        <div className={styles.featurePanel}>
          <span className={styles.featurePanelDate}>Senior</span>
          <span className={styles.featurePanelLabel}>Night</span>
        </div>
        <div className={styles.featureText}>
          <span className={styles.featureDate}>Senior Night</span>
          <h2 className={styles.featureTitle}>The Senior Experience</h2>
          <p className={styles.featureLead}>Four years end in one night. Every graduating senior gets a custom commemorative poster and a session built around who they are — not a rushed lineup photo.</p>
          <ul className={styles.checklist}>
            <li>Senior banners</li>
            <li>Senior portraits</li>
            <li>Family photos</li>
            <li>Buddy photos</li>
            <li>Locker graphics</li>
            <li>Social graphics</li>
            <li>Print packages</li>
          </ul>
          <div style={{ marginTop: 8 }}>
            <a href="#inquire" className={styles.btnRed}>Reserve Senior Night Coverage</a>
          </div>
        </div>
      </div>

      {/* ── Game Day Coverage ────────────────────────────────────── */}
      <div className={styles.featureRow}>
        <div className={styles.featureMedia}>
          <Image src="/photos/SPORTS-FB100.jpg" alt="Game day football coverage" fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'cover', filter: 'brightness(0.8)' }} />
        </div>
        <div className={styles.featureText}>
          <span className={styles.featureDate}>Every Home Game</span>
          <h2 className={styles.featureTitle}>Game Day Coverage</h2>
          <p className={styles.featureLead}>Full coverage, shot the way a photojournalist works a sideline — moving continuously, staying out of the way, never missing the play that mattered.</p>
          <ul className={styles.checklist}>
            <li>Action photography</li>
            <li>Sidelines</li>
            <li>Celebrations</li>
            <li>Coach interactions</li>
            <li>Crowd &amp; band</li>
            <li>Cheerleaders</li>
            <li>Feature images</li>
            <li>Fast gallery turnaround</li>
          </ul>
          <p style={{ fontSize: 14, color: 'var(--br-silver)' }}>Professionally edited · High-resolution downloads · Print ordering built in</p>
          <div style={{ marginTop: 20 }}>
            <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnRed}>View Game Galleries</a>
          </div>
        </div>
      </div>

      {/* ── Why Zarcone Photography ──────────────────────────────── */}
      <section>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Why Zarcone Photography</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Trusted <em>Behind the Lens</em></h2>
          </div>
        </div>
        <div className={styles.grid3col}>
          {WHY_US.map(w => (
            <div key={w.num} className={styles.iconCard}>
              <div className={styles.num}>{w.num}</div>
              <h3>{w.title}</h3>
              <p>{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────── */}
      <section>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Services</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Built For <em>This Program</em></h2>
          </div>
        </div>
        <div className={styles.grid3col}>
          {SERVICES.map(s => (
            <div key={s.title} className={styles.iconCard}>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Carousel ────────────────────────────────────── */}
      <section className={styles.carousel}>
        {CAROUSEL.map((c, i) => (
          <div key={i} className={`${styles.carouselSlide} ${i === slide ? styles.active : ''}`}>
            <Image src={c.src} alt={c.caption} fill sizes="100vw" priority={i === 0} />
          </div>
        ))}
        <div className={styles.carouselCaption}>{CAROUSEL[slide].caption}</div>
        <div className={styles.carouselDots}>
          {CAROUSEL.map((_, i) => (
            <button key={i} className={`${styles.carouselDot} ${i === slide ? styles.carouselDotActive : ''}`} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      </section>

      {/* ── Trust note (real testimonials, not fabricated) ───────── */}
      <section className={styles.trustNote} style={{ '--accent': 'var(--br-red)' }}>
        <span className={styles.eyebrowRed}>What Clients Say</span>
        <p style={{ marginTop: 16 }}>Season testimonials from Panther Football families, players, and coaches will be added here as the 2026 season unfolds. In the meantime, here's what clients across our programs have to say:</p>
        <Testimonials />
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
      <section id="inquire">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Get In Touch</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Let's Talk <em>Panther Football</em></h2>
          </div>
        </div>
        <div className={styles.contactWrap}>
          <div>
            <p style={{ color: 'var(--br-silver)', fontSize: 16, lineHeight: 1.8 }}>
              Questions about ordering photos, booking Media Day, reserving Senior Night coverage, or hiring Zarcone Photography privately —
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

      {/* ── Social ───────────────────────────────────────────────── */}
      <section className={styles.socialWrap}>
        <div>
          <span className={styles.eyebrowRed}>Follow Along All Season</span>
          <div className={styles.socialLinks} style={{ marginTop: 20 }}>
            <a href="https://instagram.com/zarconephotography" target="_blank" rel="noopener noreferrer">Instagram →</a>
            <a href="https://facebook.com/zarconephotography" target="_blank" rel="noopener noreferrer">Facebook →</a>
            <Link href="/">zarconephotography.com →</Link>
          </div>
        </div>
        <div className={styles.qrBlock}>
          <Image src="/assets/qr-brhs-panther-football.png" alt="QR code to this page" width={240} height={240} style={{ width: 120, height: 120 }} />
          <span>Scan to Return Here</span>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className={styles.finalCta}>
        <h2 className={styles.finalCtaTitle}>Every Season Has A Story.<br /><span>We're Honored To Preserve Yours.</span></h2>
        <p className={styles.finalCtaSub}>Official media partner of Bridgewater-Raritan Panther Football — 2026 season.</p>
        <div className={styles.finalCtaBtns}>
          <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnRed}>View Galleries</a>
          <a href="#inquire" className={styles.btnSilver}>Book Photography</a>
          <Link href="/about#contact" className={styles.btnGhost}>Contact Us</Link>
        </div>
      </section>

      <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.floatCta}>
        <span className={styles.floatCtaLong}>View Latest Photos</span>
        <span className={styles.floatCtaShort}>Photos</span>
      </a>
    </div>
  );
}
