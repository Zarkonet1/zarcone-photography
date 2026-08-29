'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lightbox from '@/components/Lightbox';
import GalleryAlertSignup from '@/components/GalleryAlertSignup';
import GalleryAlertToast from '@/components/GalleryAlertToast';
import styles from './page.module.css';
import { getRecord, getNextGame, getLastPlayedGame, getCoachTenure, ordinal } from '@/lib/teamSchedule';
import { sortArticlesByDate, isRecentArticle } from '@/lib/articles';
import { SCHEDULE_2026 } from '@/lib/footballSchedule';
import { GALLERIES_2026, getLatestGallery } from '@/lib/footballGalleries';
import { getSocialFeedPosts } from '@/lib/socialFeed';
import DashboardHeader from '@/components/team-dashboard/DashboardHeader';
import NextGameHero from '@/components/team-dashboard/NextGameHero';
import StatCards from '@/components/team-dashboard/StatCards';
import MediaCenterGrid from '@/components/team-dashboard/MediaCenterGrid';
import LatestFromPanthers from '@/components/team-dashboard/LatestFromPanthers';
import CompactSchedule from '@/components/team-dashboard/CompactSchedule';
import SocialFeedStrip from '@/components/team-dashboard/SocialFeedStrip';
import StatsSection from '@/components/team-dashboard/StatsSection';
import { TEAM_LEADERS_2026, WEEKLY_BOX_SCORES_2026 } from '@/lib/footballStats';

const GALLERY_URL = 'https://galleries.zarconephotography.com';
const SEASON_GALLERY_URL = 'https://zarconephotography.smugmug.com/2025-2026-BRHS-Football';

// Derived from lib/footballGalleries.js — don't hand-edit galleries here.
// Add new weeks to GALLERIES_2026 in that file; this page just reads it.
const LATEST_GALLERY = getLatestGallery(GALLERIES_2026);
const MEDIA_DAY_GALLERY = GALLERIES_2026.find((g) => g.id === 'media-day');

// Panthers Social — see lib/socialFeed.js for sourcing + the path to
// live Instagram automation. 'brhs-football' is this page's feed key;
// a future team page passes its own key/feed from the same registry.
const SOCIAL_FEED = getSocialFeedPosts('brhs-football');

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

// Media Day team/group photos — Jul 29, 2026. Kept separate from PHOTOS
// below (game action only) since these are posed group shots, not action —
// mixing them into the action masonry would dilute both. Hero renders in
// the Media Day feature row; the rest render in the grid beneath it.
const MEDIA_DAY_HERO = {
  src: '/photos/media-day-varsity-coaches.jpg', width: 2400, height: 1369,
  caption: 'Varsity Team & Coaching Staff',
};
const MEDIA_DAY_PHOTOS = [
  { src: '/photos/media-day-varsity-team.jpg', width: 1600, height: 913, caption: 'Varsity Team' },
  { src: '/photos/media-day-seniors.jpg', width: 1600, height: 1280, caption: 'Varsity Seniors' },
  { src: '/photos/media-day-seniors-coach.jpg', width: 1600, height: 1280, caption: 'Varsity Seniors & Coach' },
  { src: '/photos/media-day-coaches.jpg', width: 1600, height: 1280, caption: 'Coaching Staff' },
  { src: '/photos/media-day-freshman-team.jpg', width: 1600, height: 1280, caption: 'Freshman Team' },
];

// Individual Media Day player portraits — /photos/media-day-portraits/{number}.jpg,
// named by jersey number (Tom exports from Lightroom, drops directly into that
// folder). This Set is the single source of truth for which roster rows get a
// clickable portrait: a plain manually-maintained list rather than checking the
// filesystem, since this is a 'use client' page (can't read the filesystem at
// runtime) and it avoids ~60 wasted 404 requests for players who don't have a
// portrait uploaded yet. Add a number here the same session you drop its file in
// — see SITE-CHEATSHEET.md.
const PORTRAIT_NUMBERS = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
  24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 36, 40, 41, 44, 45, 47, 48, 49, 51, 52,
  54, 55, 56, 57, 60, 61, 63, 64, 65, 67, 68, 72, 74, 76, 79, 80, 81, 90,
]);

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
  { title: 'Sophomore QB Baxter Shines As No. 6 Bridgewater-Raritan Opens \'26 With 28-7 Win At No. 8 Woodbridge', source: 'CJ Sports Radio', url: 'https://cjsportsradio.com/2026/08/28/sophomore-qb-baxter-shines-as-no-6-bridgewater-raritan-opens-26-with-28-7-win-at-no-8-woodbridge/', date: '2026-08-28' /* added 2026-08-28, Tom-flagged, article:published_time confirmed 2026-08-29T00:48:57Z. Season-opener recap: BR 28, Woodbridge 7 (final, filled into SCHEDULE_2026 same session). Sophomore J.B. Baxter (roster #10, already listed offPos QB) won the starting job over senior Evan Woodring (#5, offPos QB) — Catalano: "it wasn't even close." Baxter went 13/20, 253 yds, 3 TD, 1 INT, incl. a 48-yd TD pass to Woodring, who moved to a receiving role for the game. Jahmier Black (page's Featured Player) had 118 rush yds and a 3rd-quarter TD — stat matches, no change needed to his feature. Note: this supersedes the framing in the 2026-08-12 CJSR preview below, which had projected Woodring (not Baxter) as the starter; left that article in place since it accurately reported the pre-season expectation at the time it was published, not a current-roster claim. */ },
  { title: 'Football: Bridgewater-Raritan Beats Woodbridge, 28-7, in Opening Game', source: 'TAPinto', url: 'https://www.tapinto.net/towns/woodbridge-slash-carteret/sections/sports/articles/football-bridgewater-raritan-beats-woodbridge-28-7-in-opening-game', date: '2026-08-29' /* added 2026-08-29, Tom-flagged (opponent-side local coverage of the same Aug 28 opener). Published via TAPinto's Woodbridge/Carteret edition, not BR's own — full scoring-play sequence: Baxter's 47-yd TD pass to Evan Woodring (1Q); Woodbridge tied it 7-7 on a Dylan Stephen 28-yd TD run (2Q); Baxter's 64-yd TD pass to Jack Winne put BR ahead for good (2Q); Jahmier Black's 3-yd TD run (3Q); Baxter's 3rd TD pass, 30 yds to Jasper Schwamberger (4Q). Kept alongside CJSR's recap above rather than reconciled — see the 47-vs-48-yd note on the Woodring TD in lib/footballSchedule.js. */ },
  { title: "Bridgewater-Raritan's New QB Throws 3 TDs In Win Over Woodbridge", source: 'MyCentralJersey', url: 'https://www.mycentraljersey.com/story/sports/high-school/football/2026/08/28/nj-high-school-football-scores-bridgewater-raritan-vs-woodbridge-2026/91399589007/', date: '2026-08-28' /* added 2026-08-29, Tom-flagged. Andy Mendlowitz byline; updated 2026-08-29T01:32 ET. Independently agrees with TAPinto above on all 3 Baxter TD passes (47 yds Woodring, 64 yds Winne, 30 yds Schwamberger) and the 7-7 second-quarter tie via Woodbridge's Dylan Stephen. Adds: BR led 14-7 at half; Jamelle Jones sack for -8 yds (3Q); Kurdyla's graduated 2025 line included 607 rushing yds in addition to the 1,371 passing yds already cited elsewhere on the page; BR was No. 10 in MyCentralJersey's own Big Central preseason Top 15 poll (Woodbridge No. 13) — a different poll than CJSR's No. 6/No. 8 cited above, not a contradiction. Some MyCentralJersey articles sit behind a metered paywall; Tom has an active subscription. */ },
  { title: 'Repeating As A State Sectional Football Playoff Champion Is The Focus This Season At Bridgewater-Raritan High School', source: 'BRRSD Athletics', url: 'https://www.brrsd.org/o/brrhs/article/3082760', date: '2026-08-19' /* added 2026-08-24, found via a direct Tom link-check — missed by the 08-23/08-24 automated sweeps, which checked BRRSD only via general web search rather than browsing its news feed directly. Season-preview piece quoting seniors Evan Woodring and DJ Krizan on the "repeat" mentality and Coach Catalano on a 4-team Aug 17 scrimmage at Basilone vs St. Peter's Prep, Hudson Catholic, and DePaul Catholic ("we played with no fear... teams that are not just ranked in the state but are nationally rated"). Confirms Catalano entering his 4th year/4th sectional-playoff appearance and explains why Hillsborough (normally a Friday) is a Friday-Sep-11-shifted-to-home game: Rosh Hashanah falls on Fri Sep 11. Schedule details match SCHEDULE_2026 exactly. NOTE: this article's own roster table is missing 4 players currently in ROSTER_RAW_2026 (Hassan Higgins #35, Myles Krihak #30, Hugo Ortega #77, Alex Rutkowski #53) and includes one not currently on the page (Nathaniel Sahadeo, #70, OL, 5'10/200) — flagged for Tom, not edited, pending 2nd-source confirmation (single-source roster changes don't meet this project's normal bar). */ },
  { title: '2026 Season Preview: Top Rusher Jahmier Black And Backup-Turned-Starter QB Evan Woodring Lead Panthers\' Bid To Repeat As Sectional Champions', source: 'CJ Sports Radio', url: 'https://cjsportsradio.com/2026/08/12/defending-sectional-champion-bridgewater-raritan-has-top-rusher-back-as-panthers-seek-repeat-after-first-title/', date: '2026-08-12' /* added 2026-08-13 via routine source sweep — article:published_time confirmed 2026-08-12T11:00:00Z. Independently confirms Evan Woodring as graduated QB Declan Kurdyla's "very capable backup," who "proved himself when Kurdyla missed some time due to injury last year" — resolves the QB/WR competition ambiguity raised by PJR's 2026-07-11 preview and flagged open since 2026-07-23; Woodring's `offPos: 'QB'` in ROSTER_2026 above is now better-sourced. Also carries 2025 stat detail not elsewhere on the page: Kurdyla threw for 1,371 yards and 13 TDs; returning senior Jamelle Jones posted 8 sacks, 12 TFLs, and a pick-six; Jasper Schwamberger had a fumble recovery. Also notes Hunterdon Central has left BR's American Silver division but still plays as a crossover game (no change to the 10/2 schedule slot). */ },
  { title: 'Six Panthers, Coach Catalano Represent Bridgewater-Raritan At Big Central Conference Media Day', source: 'Patch', url: 'https://patch.com/new-jersey/bridgewater/bridgewater-raritan-football-team-appear-big-central-media-day', date: '2026-08-05' /* added 2026-08-06 via routine source sweep — article:published_time confirmed 2026-08-05T14:38:16Z, current-year and legitimate (cross-checked against a same-topic TAPinto piece and an older unionnewsdaily "BCC Media Day" article that both turned out to be stale prior-year copies — see the FOOTBALL-SOURCES.md stale-year-trap note; this Patch piece and unionnewsdaily's separate "Fourth annual BCC Media Day" recap, published 2026-08-06, corroborate each other on date/division alignment). Coach D.J. Catalano and six seniors — Jahmier Black, James Locrotondo, Jack Ritch, Nick Crovelli, Jasper Schwamberger, and Jamelle Jones — represented BRHS at the Big Central Conference's fourth annual Media Day, Aug. 5 at Kean University's Harwood Arena; all six are on the current roster above (all Class of '27). Notable: Black is also the page's Featured Player, so this independently reinforces that pick. */ },
  { title: 'Panther Alum Joe Spirra (Class of 2024) Named AP Second Team All-American At Ithaca College', source: 'Ithaca College Athletics', url: 'https://athletics.ithaca.edu/news/2025/12/18/football-spirra-named-second-team-all-american-by-the-associated-press.aspx', date: '2025-12-18' /* added 2026-08-01 via brhs-alumni-watch — first discovery of this alum, found while cross-checking the tracker's 2026 signees against Ithaca's roster page and noticing a second, unrelated Bridgewater-Raritan name already on the active roster. Spirra graduated BRHS in 2024 (captain, 1st Team All-Area/All-Division, led team in tackles), redshirt/backup as a freshman, then broke out as a sophomore starter in 2025: AP Second Team All-American, D3football.com Fourth Team, First Team All-Region 2, All-Liberty League First Team, and Liberty League Defensive Player of the Year — led the team in tackles for loss and interceptions. Corroborated by Liberty League's own site and a BRHS Prowler alumnus profile; see PANTHER-ALUMNI.md Class of 2024 for full detail. */ },
  { title: "Panther Alum Dane Sorensen (Class of 2024) Emerges As Dickinson's Leading Rusher In Junior Season", source: 'Dickinson College Athletics', url: 'https://dickinsonathletics.com/sports/football/roster/dane-sorensen/9464', date: '2026-08-15' /* added 2026-08-15 via brhs-alumni-watch backfill — found via PJR's 2024 team preview "Graduation" section (Post 1,297), cross-checked same day against Dickinson's own site. Date reflects when this was verified/added, not a discrete article date — the source is Dickinson Athletics' own player-bio summary of his completed 2025 season: 600 rushing yards, a team-high 8 rushing touchdowns (highlighted by a 71-yard run), 15 catches for 161 yards, and 108 kick-return yards, as a junior. See PANTHER-ALUMNI.md Class of 2024 for full detail. */ },
  { title: "Panther Alum Cam Kurdyla (Class of 2024) Named America East Goalkeeper Of The Week For Third Time, Ranks Among Nation's Best At NJIT", source: 'NJIT Athletics', url: 'https://njithighlanders.com/news/2026/4/13/mens-lacrosse-kurdyla-and-piscitiello-earn-america-east-weekly-honors.aspx', date: '2026-04-13' /* added 2026-08-15 via brhs-alumni-watch backfill — same source/discovery path as Sorensen above. Kurdyla played football at BRHS (OL) but moved on to lacrosse at NJIT, where he's the starting goalkeeper: this article covers his third America East Goalkeeper of the Week honor of the 2026 season, a career-high 21 saves (tied for 6th-most in a single game in the NCAA this season) in a win over UMass Lowell, and a .724 save percentage in that game; separately, he finished the season ranked 2nd nationally in saves per game (14.69). Note this is off-sport for a football-alumni page — same precedent as the existing "Panther Plans" lacrosse-signee card below, but a first for featuring a lacrosse *achievement* rather than just a commitment. See PANTHER-ALUMNI.md Class of 2024 for full detail. */ },
  { title: 'Panther Alum Joe Spirra (Class of 2024) Named Preseason First Team All-American By D3football.com Entering Senior Season At Ithaca', source: 'Ithaca College Athletics', url: 'https://athletics.ithaca.edu/news/2026/8/13/football-spirra-tabbed-preseason-first-team-all-american-by-d3football-com.aspx', date: '2026-08-13' /* added 2026-08-26 via brhs-alumni-watch — upgrade from his Dec 2025 AP Second Team All-American entry above. D3football.com released its 2026 Preseason All-America Teams Aug 12; Spirra (career totals entering the season: 133 tackles, 18 passes defended, 6 interceptions, 9 TFL in 20 games) was named First Team. Confirmed via Ithaca's own roster page — still Bridgewater, N.J. / Bridgewater-Raritan, now a Junior DB (#2). Ithaca opens its 2026 season Sept 5 at #4 Johns Hopkins. */ },
  { title: 'Panther Alum Colin Kurdyla (Class of 2023) Breaks Out As Rutgers Lacrosse Star — Second Team All-Big Ten, National Player Of The Week', source: 'Rutgers University Athletics', url: 'https://scarletknights.com/sports/mens-lacrosse/roster/colin-kurdyla/16096', date: '2026-03-17' /* added 2026-08-26 via brhs-alumni-watch Class of 2023 backfill — first read of PJR's actual Team Preview 2023 (Post 1,134) surfaced Kurdyla as a BRHS football WR/DB grad previously unknown to this tracker. Note: a same-surname family member, Cam Kurdyla (NJIT lacrosse, Class of 2024), is already covered above; a different "Brady Kurdyla" was flagged in the 2026-08-15 log as "not a BRHS football alumnus" — that finding was about a different, older brother, not Colin. Confirmed via Rutgers' own site: Bridgewater, N.J. / Bridgewater-Raritan HS. Led the Scarlet Knights' 2026 offense with career highs of 27 goals, 23 assists, and 50 points; earned 2026 Second Team All-Big Ten (also 2025), 2026 Academic All-Big Ten, 2026 Honorable Mention All-American (Inside Lacrosse/Media), and both the USA Lacrosse/Lacrosse Network National Player of the Week and Big Ten Offensive Player of the Week on March 17. Off-sport for a football-alumni page, same precedent as the Cam Kurdyla and "Panther Plans" entries. See PANTHER-ALUMNI.md Class of 2023 for full detail. */ },
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
    a: <>The 2025–26 season gallery is live now on <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer">SmugMug</a>, where you can view, download, and order prints directly — high-resolution digital downloads are included with every gallery, no separate request needed. 2026 season galleries will be delivered through <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer">Pic-Time</a>, our current client gallery platform.</>,
  },
  {
    q: 'How quickly are galleries posted?',
    a: 'Game galleries are professionally edited and delivered within days of each game, not weeks — so photos are ready while the moment is still fresh.',
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
// weekly touch-up once the season starts (opener moved to Aug 28 due to
// weather, see footballSchedule.js) — update from
// MaxPreps' Big Central standings page or NJ.com's weekly Big Central
// roundup. All four start 0-0-0 in the preseason, which is accurate, not a
// bug — the table will fill in as games are played.
// Updated 2026-08-29 sweep (now part of the daily sweep's standard checks,
// not just weekly — per Tom, 2026-08-29): Phillipsburg opened 1-0 (beat
// Parkland, PA, 28-21, non-league — confWins/confLosses stay 0-0). Hillsborough
// and Ridge haven't played yet. Source: MaxPreps' Big Central - American
// Silver standings page, last updated Aug 29, 2026 @ 1:18am GMT.
const OTHER_STANDINGS_2026 = [
  { team: 'Hillsborough', wins: 0, losses: 0, confWins: 0, confLosses: 0 },
  { team: 'Phillipsburg', wins: 1, losses: 0, confWins: 0, confLosses: 0 },
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

// Dashboard rebuild (2026-08-25) — replaces the old SEASON_TRACKER array.
// Raw next/last-game objects for NextGameHero (needs structured fields, not
// a joined string) plus the plain summary values StatCards displays. Same
// underlying data as before (SCHEDULE_2026/GALLERIES_2026), just consumed
// two ways now instead of one.
const DASHBOARD_NEXT_GAME = getNextGame(SCHEDULE_2026);
const DASHBOARD_LAST_PLAYED = getLastPlayedGame(SCHEDULE_2026);
const DASHBOARD_RECORD = getRecord(SCHEDULE_2026);
const DASHBOARD_LATEST_RESULT_LABEL = DASHBOARD_LAST_PLAYED
  ? `${DASHBOARD_LAST_PLAYED.opponent}: ${DASHBOARD_LAST_PLAYED.result.win ? 'W' : 'L'} ${DASHBOARD_LAST_PLAYED.result.score}`
  : null;
// Season card reuses STAT_BAR[0] (sectional-champion status) rather than
// hand-typing a second copy of the same fact — STAT_BAR stays the single
// source for it, same don't-duplicate rule this file uses everywhere else.
const DASHBOARD_SEASON_SUB = `${STAT_BAR[0].num} ${STAT_BAR[0].label}`;

// Latest From The Panthers editorial cards — top 3 ARTICLES by date, paired
// with real ZP photos from CAROUSEL purely for visual presentation (these
// press links have no photos of their own; nothing here claims a photo
// depicts that specific headline's content).
const DASHBOARD_EDITORIAL_ITEMS = sortArticlesByDate(ARTICLES)
  .slice(0, 3)
  .map((a, i) => ({ ...a, img: CAROUSEL[i % CAROUSEL.length].src }));

// Powers the "New" badge on the Media Center's News tile — same
// isRecentArticle threshold the full News section below already uses, not
// a second freshness rule. True only when the single most recent article
// is within that window.
const DASHBOARD_NEWS_HAS_NEW = DASHBOARD_EDITORIAL_ITEMS.length > 0 && isRecentArticle(DASHBOARD_EDITORIAL_ITEMS[0].date);

// Football's own copy of MediaCenterGrid's tile list, plus a Stats tile —
// added 2026-08-29 alongside the new StatsSection. Passed explicitly
// (rather than editing MediaCenterGrid's shared DEFAULT_TILES) so other
// team pages that don't have a stats section yet aren't affected.
const MEDIA_CENTER_TILES = [
  { label: 'Game Galleries', sub: 'View Photos', href: '#gallery-alert', img: '/photos/SPORTS-FB100.jpg' },
  { label: 'Meet the Team', sub: 'Roster & Coaches', href: '#roster', img: '/photos/media-day-varsity-team.jpg' },
  { label: 'Media Day', sub: 'View Portraits', href: '#media-day', img: '/photos/media-day-varsity-coaches.jpg' },
  { label: 'Schedule', sub: 'Full Season', href: '#schedule', img: '/photos/SPORTS-Zarcone-Photography-45.jpg' },
  { label: 'Stats', sub: 'Leaders & Box Scores', href: '#player-stats', img: '/photos/SPORTS-Zarcone-Photography-0030.jpg' },
  { label: 'News', sub: 'Latest Coverage', href: '#news', img: '/photos/SPORTS-Zarcone-Photography-0088.jpg' },
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
// Varsity players currently span Senior/Junior/Sophomore only (classYear
// 27-29 relative to CURRENT_SEASON_YEAR) — no Freshman on this roster today.
// If that changes, add 'Freshman' here; gradeFromClassYear already supports it.
const CLASS_ORDER = ['Senior', 'Junior', 'Sophomore'];
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

// Reconciled 2026-08-25 against a full roster table Evan Fromberg (Asst.
// Coach/Director of Ops — the program's own Tier 1a source, see
// FOOTBALL-SOURCES.md) sent Tom directly. This resolved the roster
// discrepancy flagged 2026-08-24 from the BRRSD Aug 19 preview article:
// Higgins (#35), Krihak (#30), Ortega (#77), and Rutkowski (#53) are NOT on
// Fromberg's list and have been removed; Sahadeo (#70) IS on it (explicitly
// marked "added" in Fromberg's table) and has been added, along with a
// previously-untracked kicker, Paul Heinrich-Ruiz (#43). Fromberg's table
// also corrected 7 def/off-position values that had drifted from an earlier
// source: Zuckerman #14 (TE->WR), Crovelli #27 (WR->TE), Cole #29 (WR->RB),
// Carranza #57 (LB/TE->DL/OL), Totten #47 (TE->RB), Kronengold #80
// (DL->LB def), Kalandadze #86 (DB->DL def). All other 56 players matched
// exactly on name, class year, and position — a strong cross-check that the
// rest of the array was already accurate. Fromberg's table also carries
// height/weight, which this array doesn't track (no wt/ht fields exist in
// this schema), so that detail isn't reflected here.
const ROSTER_RAW_2026 = [
  { number: 74, first: 'Andrew', last: 'Arndt', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 1, first: 'Jeremiah', last: 'Baker', classYear: 29, defPos: 'DB', offPos: 'RB' },
  { number: 10, first: 'JB', last: 'Baxter', classYear: 29, defPos: 'DB', offPos: 'QB' },
  { number: 31, first: 'Tyler', last: 'Baxter', classYear: 29, defPos: 'DB', offPos: 'WR' },
  { number: 11, first: 'Jahmier', last: 'Black', classYear: 27, defPos: 'LB', offPos: 'RB' },
  { number: 51, first: 'Nick', last: 'Bogolashvili', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 60, first: 'Alex', last: 'Budelmann', classYear: 28, defPos: 'DL', offPos: 'OL' },
  { number: 57, first: 'Derek', last: 'Carranza', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 56, first: 'Maseone', last: 'Christian', classYear: 29, defPos: 'DL', offPos: 'OL' },
  { number: 29, first: 'Messiah', last: 'Cole', classYear: 29, defPos: 'DB', offPos: 'RB' },
  { number: 27, first: 'Nick', last: 'Crovelli', classYear: 27, defPos: 'LB', offPos: 'TE' },
  { number: 79, first: 'Joseph', last: 'Day', classYear: 28, defPos: 'DL', offPos: 'OL' },
  { number: 15, first: 'Branden', last: 'De Matos', classYear: 27, defPos: 'DB', offPos: 'WR' },
  { number: 23, first: 'Francesco', last: 'DiMaria', classYear: 27, defPos: 'DB', offPos: 'WR' },
  { number: 44, first: 'Maximus', last: 'Dorsey', classYear: 27, defPos: 'DL', offPos: 'TE' },
  { number: 18, first: 'Kenneth', last: 'Graham', classYear: 27, defPos: 'DB', offPos: 'WR' },
  { number: 43, first: 'Paul', last: 'Heinrich-Ruiz', classYear: 29, defPos: 'P', offPos: 'K' },
  { number: 68, first: 'Colton', last: 'Hisko', classYear: 29, defPos: 'DL', offPos: 'OL' },
  { number: 21, first: 'Michael', last: 'Ianniciello', classYear: 28, defPos: 'DB', offPos: 'WR' },
  { number: 63, first: 'Nicholas', last: 'Iovine', classYear: 29, defPos: 'DL', offPos: 'OL' },
  { number: 64, first: 'AJ', last: 'Jimenez', classYear: 29, defPos: 'DL', offPos: 'OL' },
  { number: 41, first: 'Jamelle', last: 'Jones', classYear: 27, defPos: 'DL', offPos: 'RB' },
  { number: 86, first: 'Gizo', last: 'Kalandadze', classYear: 28, defPos: 'DL', offPos: 'WR' },
  { number: 26, first: 'Chase', last: 'Kedziora', classYear: 28, defPos: 'DB', offPos: 'WR' },
  { number: 32, first: 'Mason', last: 'Kowalik', classYear: 29, defPos: 'P', offPos: 'K' },
  { number: 2, first: 'DJ', last: 'Krizan', classYear: 27, defPos: 'DB', offPos: 'WR' },
  { number: 80, first: 'Andrew', last: 'Kronengold', classYear: 29, defPos: 'LB', offPos: 'TE' },
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
  { number: 7, first: 'Cole', last: 'Pello', classYear: 27, defPos: 'DB', offPos: 'WR' },
  { number: 33, first: 'Jake', last: 'Petrillo', classYear: 29, defPos: 'DB', offPos: 'WR' },
  { number: 34, first: 'Tyler', last: 'Plank', classYear: 29, defPos: 'LB', offPos: 'WR' },
  { number: 25, first: 'Sebastian', last: 'Redyk', classYear: 27, defPos: 'DL', offPos: 'TE' },
  { number: 19, first: 'Zach', last: 'Rinehimer', classYear: 29, defPos: 'DB', offPos: 'WR' },
  { number: 6, first: 'Sebastian', last: 'Risco', classYear: 28, defPos: 'DB', offPos: 'WR' },
  { number: 72, first: 'Jack', last: 'Ritch', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 49, first: 'Nathan', last: 'Robles', classYear: 29, defPos: 'LB', offPos: 'RB' },
  { number: 22, first: 'Chase', last: 'Rutherford', classYear: 29, defPos: 'DB', offPos: 'WR' },
  { number: 70, first: 'Nathaniel', last: 'Sahadeo', classYear: 28, defPos: 'DL', offPos: 'OL' },
  { number: 61, first: 'Ethan', last: 'Sainte', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 24, first: 'Freddie', last: 'Schenk', classYear: 28, defPos: 'LB', offPos: 'WR' },
  { number: 13, first: 'Jasper', last: 'Schwamberger', classYear: 27, defPos: 'DB', offPos: 'WR' },
  { number: 48, first: 'Mason', last: 'Smalls', classYear: 29, defPos: 'DB', offPos: 'WR' },
  { number: 36, first: 'Damian', last: 'Stadnick', classYear: 29, defPos: 'DB', offPos: 'WR' },
  { number: 52, first: 'Trent', last: 'Thiry', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 47, first: 'Austin', last: 'Totten', classYear: 29, defPos: 'LB', offPos: 'RB' },
  { number: 81, first: 'Jack', last: 'Winchock', classYear: 29, defPos: 'DL', offPos: 'WR' },
  { number: 9, first: 'Jack', last: 'Winne', classYear: 28, defPos: 'DB', offPos: 'WR' },
  { number: 5, first: 'Evan', last: 'Woodring', classYear: 27, defPos: 'DB', offPos: 'QB' },
  { number: 76, first: 'Alex', last: 'Zimmerman', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 54, first: 'Ben', last: 'Zimmerman', classYear: 27, defPos: 'DL', offPos: 'OL' },
  { number: 14, first: 'Nathan', last: 'Zuckerman', classYear: 27, defPos: 'DB', offPos: 'WR' },
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
  const [form, setForm] = useState({ name: '', email: '', phone: '', athleteName: '', sport: 'Football', interestedIn: 'Prints', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [rosterPositionFilter, setRosterPositionFilter] = useState('All');
  const [rosterClassFilter, setRosterClassFilter] = useState('All');
  const [rosterExpanded, setRosterExpanded] = useState(false);
  const [rosterSortKey, setRosterSortKey] = useState('number');
  const [rosterSortDir, setRosterSortDir] = useState('asc');
  const [portraitLightbox, setPortraitLightbox] = useState(null); // player object, or null
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
    description: 'Official 2026 season Media Day for Bridgewater-Raritan Panther Football, featuring player and team portraits by Zarcone Photography, the program’s Gold Level Sponsor and official media partner.',
    startDate: '2026-07-29',
    endDate: '2026-07-29',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'Place', name: 'Bridgewater-Raritan High School', address: { '@type': 'PostalAddress', addressLocality: 'Bridgewater', addressRegion: 'NJ', addressCountry: 'US' } },
    image: ['https://www.zarconephotography.com/photos/i-s7zBdzk.jpg'],
    organizer: { '@type': 'Organization', name: 'Zarcone Photography', url: 'https://www.zarconephotography.com' },
    performer: { '@type': 'SportsTeam', name: 'Bridgewater-Raritan Panther Football' },
    offers: {
      '@type': 'Offer',
      url: 'https://www.zarconephotography.com/brhs-panther-football',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2026-07-01',
    },
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

      {/* ── Dashboard rebuild (2026-08-25) ───────────────────────────
          Restrained header + dynamic Next Game hero + 4 stat cards +
          Media Center grid + editorial section + compact schedule preview.
          Replaces the old marketing hero, sticky pill quick-nav, and
          5-tile Season Tracker — those competed with each other for
          attention (multiple navs, multiple "next game" mentions) which
          is exactly what the BRHS PAC feedback and Tom's own follow-up
          flagged. Nothing below this block was removed — Schedule &
          Results, Standings, News, Roster, Family Day, Coaches, Gallery,
          Media Day, Official Resource, and the Powered-By-ZP block all
          still render in full further down, same order as the prior
          reorder. Program Stat Bar (full playoff-history stats) moved down
          to sit with that retained content — see below. Pilot scope:
          football only, per Tom. ── */}
      <DashboardHeader />

      <NextGameHero
        nextGame={DASHBOARD_NEXT_GAME}
        lastPlayedGame={DASHBOARD_LAST_PLAYED}
        latestGallery={LATEST_GALLERY}
        bgPhotoSrc="/photos/i-s7zBdzk.jpg"
      />

      <StatCards
        record={DASHBOARD_RECORD}
        nextGameDate={DASHBOARD_NEXT_GAME ? DASHBOARD_NEXT_GAME.date : 'Season Complete'}
        nextGameOpponent={DASHBOARD_NEXT_GAME ? DASHBOARD_NEXT_GAME.opponent : null}
        latestResult={DASHBOARD_LATEST_RESULT_LABEL}
        seasonYear="2026"
        seasonSub={DASHBOARD_SEASON_SUB}
      />

      <MediaCenterGrid newsHasNew={DASHBOARD_NEWS_HAS_NEW} tiles={MEDIA_CENTER_TILES} />

      <LatestFromPanthers items={DASHBOARD_EDITORIAL_ITEMS} />

      <CompactSchedule games={SCHEDULE_2026} />

      {/* ── Program Stat Bar ──────────────────────────────────────
          Relocated from above the fold (2026-08-25) — full program-history
          stats (playoff record, sectional-finalist years, coach tenure)
          that don't fit the 4-card dashboard summary but shouldn't be lost
          either. Sits with the rest of the retained detail content now. ── */}
      <section id="stats" className={styles.statBar} style={{ scrollMarginTop: 120 }}>
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

      {/* ── Schedule & Results ───────────────────────────────────── */}
      <section id="schedule" style={{ scrollMarginTop: 120 }}>
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

      {/* ── 2025 Playoff Run Results ─────────────────────────────── */}
      <section id="results" style={{ background: 'rgba(255,255,255,0.02)', scrollMarginTop: 120 }}>
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

      {/* ── Stats ─────────────────────────────────────────────────
          Added 2026-08-29, Tom-requested — built as a generic, reusable
          component (StatsSection) rather than BRHS/football-specific
          markup, so the same framework can support other team pages and
          eventually other sports. Data lives in lib/footballStats.js;
          see that file's header for the sourcing rules. ── */}
      <StatsSection
        id="player-stats"
        eyebrow="2026 Season"
        title="Player"
        titleAccent="Stats"
        subtitle="Team leaders and box scores, updated as games are played and recaps are published. One game in, so this is a Week 1 snapshot — not a full season."
        leaders={TEAM_LEADERS_2026}
        boxScores={WEEKLY_BOX_SCORES_2026}
      />

      {/* ── Division Standings ───────────────────────────────────── */}
      <section id="standings" style={{ background: 'rgba(255,255,255,0.02)', scrollMarginTop: 120 }}>
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
            : 'All four teams open the season 0-0 — the 2026 opener is Fri, Aug 28 (moved from Thu, Aug 27 due to weather). Standings fill in as conference games are played.'}
          {' '}Bridgewater-Raritan's record is drawn automatically from the schedule above; other teams' records are tracked from{' '}
          <a href="https://www.maxpreps.com/nj/bridgewater/bridgewater-raritan-panthers/football/standings/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--br-red)' }}>MaxPreps</a> and NJ.com's weekly Big Central Conference roundup.
        </p>
      </section>

      {/* ── In The News ──────────────────────────────────────────── */}
      <section id="news" style={{ background: 'rgba(255,255,255,0.02)', scrollMarginTop: 120 }}>
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

      {/* ── Roster ───────────────────────────────────────────────── */}
      <section id="roster" style={{ background: 'rgba(255,255,255,0.02)', scrollMarginTop: 120 }}>
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
            onChange={(e) => {
              const g = e.target.value;
              setRosterPositionFilter(g);
              // Number/Off/Def don't exist on managers — fall back to a sort that does.
              if (g === 'Managers' && ['number', 'offPos', 'defPos'].includes(rosterSortKey)) {
                setRosterSortKey('last');
                setRosterSortDir('asc');
              }
            }}
            aria-label="Filter roster by position"
          >
            <option value="All">All Positions</option>
            {ROSTER_GROUP_ORDER.map((g) => <option key={g} value={g}>{g}</option>)}
            <option value="Managers">Managers</option>
          </select>
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
          {rosterPositionFilter === 'Managers' ? (
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
        {rosterPositionFilter === 'Managers' ? (
          <table className={`${styles.scheduleTable} ${styles.rosterTable}`}>
            <thead>
              <tr>
                <th><button type="button" className={styles.sortBtn} onClick={() => handleRosterSort('last')}>Name{rosterSortArrow('last')}</button></th>
                <th><button type="button" className={styles.sortBtn} onClick={() => handleRosterSort('classYear')}>Grade{rosterSortArrow('classYear')}</button></th>
              </tr>
            </thead>
            <tbody>
              {[...MANAGERS_2026]
                .filter((p) => rosterClassFilter === 'All' || p.grade === rosterClassFilter)
                .sort((a, b) => compareRosterRows(a, b, rosterSortKey, rosterSortDir))
                .map((p) => (
                <tr key={p.slug} id={`roster-${p.slug}`}>
                  <td data-label="Name">{p.first} {p.last}</td>
                  <td data-label="Grade">{p.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (() => {
          const filtered = ROSTER_2026.filter((p) =>
            (rosterPositionFilter === 'All' || p.group === rosterPositionFilter) &&
            (rosterClassFilter === 'All' || p.grade === rosterClassFilter)
          );
          const sorted = [...filtered].sort((a, b) => compareRosterRows(a, b, rosterSortKey, rosterSortDir));
          const isTruncated = rosterPositionFilter === 'All' && rosterClassFilter === 'All' && !rosterExpanded && sorted.length > ROSTER_PREVIEW_COUNT;
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
                      <td data-label="#">
                        {PORTRAIT_NUMBERS.has(p.number) ? (
                          <button type="button" className={styles.rosterPortraitBtn} onClick={() => setPortraitLightbox(p)}>
                            {p.number}
                          </button>
                        ) : p.number}
                      </td>
                      <td data-label="Player">{p.first} {p.last}</td>
                      <td data-label="Grade">{p.grade}</td>
                      <td data-label="Off">{p.offPos}</td>
                      <td data-label="Def">{p.defPos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rosterPositionFilter === 'All' && rosterClassFilter === 'All' && sorted.length > ROSTER_PREVIEW_COUNT && (
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
          {rosterPositionFilter === 'Managers'
            ? 'Team managers support the program on game days and at practice. Roster subject to change before the season opener.'
            : "Most players at this level go both ways — Off/Def columns show each player's primary alignment on both sides of the ball. Roster subject to change before the season opener."}
        </p>

        {portraitLightbox && (
          <Lightbox
            images={[{
              src: `/photos/media-day-portraits/${portraitLightbox.number}.jpg`,
              alt: `${portraitLightbox.first} ${portraitLightbox.last} (#${portraitLightbox.number}) — Media Day portrait, Bridgewater-Raritan Panther Football, Zarcone Photography`,
            }]}
            currentIndex={0}
            onClose={() => setPortraitLightbox(null)}
            onPrev={() => {}}
            onNext={() => {}}
          />
        )}
      </section>

      {/* ── Family Day ───────────────────────────────────────────── */}
      <div className={styles.featureRow}>
        <div className={styles.featureMedia}>
          <Image src="/photos/brhs-football-kickoff-2026-flyer.jpg" alt="BRHS Panther Football Family Day / Kickoff 2026 flyer — Sunday, August 30 at Green Knoll Grill" fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'contain', filter: 'none' }} />
        </div>
        <div className={styles.featureText}>
          <span className={styles.featureDate}>Sunday, August 30, 2026</span>
          <h2 className={styles.featureTitle}>Family Day</h2>
          <p className={styles.featureLead}>Come celebrate with past, present, and future football families at Green Knoll Grill — late lunch or early dinner starting 1:30 PM, live music from Black Dog 3–6 PM.</p>
          <ul className={styles.checklist}>
            <li>Green Knoll Grill</li>
            <li>Starts 1:30 PM · Band 3–6 PM</li>
            <li>$10 door fee waived for BR football families</li>
            <li>RSVP required to waive door fee</li>
          </ul>
          <div style={{ marginTop: 28 }}>
            <a href="mailto:BRfootball26@gmail.com?subject=Family%20Day%20RSVP" className={styles.btnRed}>RSVP to Attend</a>
          </div>
        </div>
      </div>

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
            <Image src="/photos/media-day-portraits/11-featured.jpg" alt={`${FEATURED_PLAYER.name} — Bridgewater-Raritan Panther Football, Zarcone Photography`} fill sizes="220px" style={{ objectFit: 'cover' }} />
          </div>
          <div>
            <div className={styles.spotlightName}>{FEATURED_PLAYER.name}</div>
            <div className={styles.spotlightClass}>{FEATURED_PLAYER.detail}</div>
            <p className={styles.spotlightBio}>{FEATURED_PLAYER.bio}</p>
            <p className={styles.spotlightNote}>Per CJ Sports Radio, August 2025 preseason preview.</p>
          </div>
        </div>
      </section>

      {/* ── Panthers Social ──────────────────────────────────────── */}
      {/* Demonstrates the platform's social-aggregation principle: real,
          verified @brhspanthersfb posts, natively styled, linking out to
          the actual Instagram post. Placed directly before Season Gallery
          per brief — "what the team is sharing now" leads into "the
          permanent visual record of the season." See lib/socialFeed.js. */}
      <SocialFeedStrip {...SOCIAL_FEED} />

      {/* ── Gallery Preview ─────────────────────────────────────── */}
      {/* #gallery is a plain alias for Linktree/social use; #gallery-alert stays live for existing blog post links */}
      <span id="gallery" style={{ position: 'relative', top: -120, display: 'block' }} aria-hidden="true" />
      <section className={styles.gallery} id="gallery-alert" style={{ scrollMarginTop: 120 }}>
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
      <div id="media-day" className={styles.featureRow} style={{ scrollMarginTop: 120 }}>
        <div className={styles.featureMedia}>
          {/* No brightness(0.8) dim here (unlike the other featureMedia
              shots below) — this is a posed team/coaches portrait, not an
              action shot, so full clarity on faces/numbers matters more
              than the moody-cinematic treatment. Per Tom, 2026-08-07. */}
          <Image src={MEDIA_DAY_HERO.src} alt={MEDIA_DAY_HERO.caption} fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'cover', filter: 'none' }} />
        </div>
        <div className={styles.featureText}>
          <span className={styles.featureDate}>July 29, 2026</span>
          <h2 className={styles.featureTitle}>Media Day</h2>
          <p className={styles.featureLead}>Every athlete's professional portraits — clean shots built for banners, programs, and recruiting profiles.</p>
          <p style={{ color: 'var(--br-silver)', fontSize: 15, lineHeight: 1.8, marginTop: -8, marginBottom: 4 }}>
            A make-up day ran Tuesday, August 11 for anyone who missed the shoot. The Panthers also appeared at the Big State Sports Media Day, Thursday, August 20, as Big State Sports gears up to broadcast every BR home game this season.
          </p>
        </div>
      </div>

      <div className={styles.mediaDayGrid}>
        {MEDIA_DAY_PHOTOS.map((photo, i) => (
          <div key={i} className={styles.mediaDayGridItem}>
            <div className={styles.mediaDayGridPhoto}>
              <Image src={photo.src} alt={`${photo.caption} — Bridgewater-Raritan Panther Football Media Day, Zarcone Photography`} fill sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
            </div>
            <p className={styles.mediaDayGridCaption}>{photo.caption}</p>
          </div>
        ))}
      </div>

      {/* ── Official Program Resource ───────────────────────────── */}
      <div className={styles.officialResource}>
        <div className={styles.officialResourceInner}>
          <span className={styles.eyebrowRed}>Official Program Resource</span>
          <h3 className={styles.officialResourceTitle}>Official BRHS Panther Football Website</h3>
          <p className={styles.officialResourceBody}>
            Visit the official BRHS Panther Football website for program announcements, schedules, forms, registration, livestream information, and team updates.
          </p>
          <a
            href="https://brhspantherfb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.partnershipLink}
          >
            Visit BRHS Panther Football →
          </a>
        </div>
      </div>

      {/* ── About Your Media Partner ─────────────────────────────────
          Consolidated 2026-08-25 from 9 previously-separate marketing
          sections (Senior Experience, Game Day Coverage, "ZP in the News"
          Patch profile, Why Us, Services, Carousel, Trust Note/Testimonials)
          per PAC president feedback that the page was "great but confusing
          to navigate" — too much Zarcone Photography marketing woven
          through the team dashboard content. Moved below all real program
          data (tracker/schedule/results/standings/news/roster/family day/
          coaches/gallery/media day) and consolidated further same day —
          the old top-of-page "Partnership" block (Gold Sponsor badge, 30+
          years/'25 Champs/Jul 29 stats, announcement link) was cut entirely
          as redundant with this block, not just relocated. See
          BRHS-SWEEP-LOG.md, 2026-08-25 entry, for the full before/after
          plan. One compact block instead of a full-page sandwich of sales
          sections. ── */}
      <section className={styles.trustNote} style={{ '--accent': 'var(--br-red)' }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Powered By</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Your Media <em>Partner</em></h2>
          </div>
        </div>
        <p style={{ color: 'var(--br-silver)', fontSize: 16, lineHeight: 1.8, maxWidth: 720 }}>
          Zarcone Photography is the official media partner of BRHS Panther Football — full home-game coverage, Media Day portraits, a custom Senior
          Night poster for every graduating senior, and recruiting content, from a photographer with 30+ years shooting NJ high school sports — plus the
          same role with <Link href="/brhs-panther-wrestling">Panther Wrestling</Link> and <Link href="/brhs-panther-volleyball">Panther Girls Volleyball</Link>.
          Outside the season partnership, private senior sessions, family photos, and other bookings are available too — <a href="#inquire">reach out here</a>.
        </p>
        <div className={styles.grid3col} style={{ marginTop: 32 }}>
          <div className={styles.iconCard}><h3>Every Home Game</h3><p>Full sideline coverage, professionally edited and posted within days.</p></div>
          <div className={styles.iconCard}><h3>Senior Night</h3><p>A custom commemorative poster and portrait session for every graduating senior.</p></div>
          <div className={styles.iconCard}><h3>Prints &amp; Downloads</h3><p>High-resolution downloads and print products, ordered directly from your gallery.</p></div>
        </div>

        <blockquote className={styles.programQuote} style={{ marginTop: 40 }}>
          <p className={styles.programQuoteText}>
            &ldquo;A huge thank you to Zarcone Photography for being a Gold Sponsor of the Bridgewater Raritan Football Program! Your generosity and commitment to supporting our student-athletes helps provide the equipment, resources, and opportunities our players need to compete at the highest level. We are incredibly grateful to have you as part of the Panther family. Thank you for investing in our program and our community. We appreciate your support!&rdquo;
          </p>
          <cite className={styles.programQuoteCite}>
            — Bridgewater-Raritan Panther Football,{' '}
            <a href="https://www.instagram.com/brhspanthersfb/p/DbTAxf5OQYf/" target="_blank" rel="noopener noreferrer">@brhspanthersfb</a>, July 27, 2026
          </cite>
        </blockquote>

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

      {/* ── QR (physical signage at games links back here) ───────── */}
      <div className={styles.qrBlock} style={{ margin: '0 auto 60px', textAlign: 'center' }}>
        <Image src="/assets/qr-brhs-panther-football.png" alt="QR code to this page" width={240} height={240} style={{ width: 120, height: 120 }} />
        <span>Scan to Return Here</span>
      </div>

      <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.floatCta}>
        <span className={styles.floatCtaLong}>View Latest Photos</span>
        <span className={styles.floatCtaShort}>Photos</span>
      </a>
    </div>
  );
}
