'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lightbox from '@/components/Lightbox';
import GalleryAlertSignup from '@/components/GalleryAlertSignup';
import GalleryAlertToast from '@/components/GalleryAlertToast';
import styles from './page.module.css';
import { getRecord, getNextGame, getLastPlayedGame, getLatestResult, resolveScheduleDate } from '@/lib/teamSchedule';
import { EVENTS } from '@/lib/events';
import DashboardHeader from '@/components/team-dashboard/DashboardHeader';
import NextGameHero from '@/components/team-dashboard/NextGameHero';
import StatCards from '@/components/team-dashboard/StatCards';
import MediaCenterGrid from '@/components/team-dashboard/MediaCenterGrid';
import LatestFromPanthers from '@/components/team-dashboard/LatestFromPanthers';
import CompactSchedule from '@/components/team-dashboard/CompactSchedule';
import { sortArticlesByDate, isRecentArticle } from '@/lib/articles';
import { DUAL_SCHEDULE_2026_27 } from '@/lib/wrestlingSchedule';

const GALLERY_URL = 'https://galleries.zarconephotography.com';
const SEASON_GALLERY_URL = 'https://zarconephotography.smugmug.com/2025-2026-BRHS-Wrestling';

// DUAL_SCHEDULE_2026_27 now lives in lib/wrestlingSchedule.js (imported
// above) so components/AnnouncementBar.jsx can share it — see that file's
// header comment for why. Don't redeclare it here.

// Only genuine wrestling action photos — no cross-sport placeholders.
const PHOTOS = [
  { src: '/photos/wrestling-throw-hero.jpg', width: 1920, height: 1080, size: 'wide' },
  { src: '/photos/i-dkcFTnj.jpg', width: 2400, height: 1920 },
  { src: '/photos/i-wBrCNrq.jpg', width: 2400, height: 1920 },
  { src: '/photos/i-Lv2PXKm.jpg', width: 2400, height: 1600, size: 'wide' },
  { src: '/photos/i-mhgq9Xp.jpg', width: 2400, height: 1350 },
  { src: '/photos/i-zshvpsK.jpg', width: 2400, height: 1350 },
  { src: '/photos/i-kRHbmsg.jpg', width: 1920, height: 2400 },
  { src: '/photos/SPORTS-Zarcone-Photography-0007.jpg', width: 1599, height: 1280, size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0066.jpg', width: 1599, height: 1280, size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0431.jpg', width: 1600, height: 1280, size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-061.jpg', width: 1280, height: 1600 },
  { src: '/photos/SPORTS-Zarcone-Photography-270.jpg', width: 1600, height: 1280, size: 'wide' },
];

const CAROUSEL = [
  { src: '/photos/wrestling-throw-hero.jpg', width: 1920, height: 1080, caption: 'Built Different' },
  { src: '/photos/i-kRHbmsg.jpg', width: 1920, height: 2400, caption: 'Every Match Tells A Story' },
  { src: '/photos/SPORTS-Zarcone-Photography-0431.jpg', width: 1600, height: 1280, caption: 'Back-to-Back Sectional Champions' },
  { src: '/photos/i-Lv2PXKm.jpg', width: 2400, height: 1600, caption: 'This Is Panther Wrestling' },
  { src: '/photos/SPORTS-Zarcone-Photography-270.jpg', width: 1600, height: 1280, caption: '2026-27: Building Toward A Third Title' },
];

// Real 2025-26 season milestones — MaxPreps had not yet published a 2026-27
// dual-meet schedule as of this writing, so results (not a game-by-game
// schedule) are shown here until next season's dates are released.
const RESULTS_2025_26 = [
  { date: 'Dec 13, 2025', event: 'Mike Dessino Invitational — Middlesex', result: 'Season Opener' },
  { date: 'Feb 18, 2026', event: 'NJSIAA North 2, Group 5 Sectional Final vs. Union', result: 'W, 33–29', league: true },
  { date: 'Feb 20, 2026', event: 'NJSIAA Group 5 State Semifinal at Old Bridge', result: 'L, 37–30' },
  { date: 'Feb 28, 2026', event: 'NJSIAA District 14 Tournament — South Plainfield', result: '3 Champions: McCann, Levash, Vella' },
  { date: 'Mar 6–7, 2026', event: 'NJSIAA Region 4 Tournament — Union HS', result: 'Levash Wins Region 4 (HWT)' },
  { date: 'Mar 12–14, 2026', event: 'NJSIAA Individual State Tournament — Boardwalk Hall, AC', result: '2 State Medalists', league: true },
];

// Real coverage of the program — no invented headlines. `date` is the
// article's real publish date, confirmed against the source where possible;
// a couple (marked below) are close estimates tied to the confirmed event
// date. This field drives both the sort order and the "NEW" badge — see
// lib/articles.js — so the array below does NOT need to be kept in manual
// chronological order.
const ARTICLES = [
  { title: 'Two Bridgewater-Raritan Wrestlers Earn State Medals At 2026 Tournament', source: 'Patch', url: 'https://patch.com/new-jersey/bridgewater/two-bridgewater-raritan-wrestlers-earn-state-medals-2026-tournament', date: '2026-03-16' /* corrected 2026-08-18: article:published_time metadata + byline both read Mon, Mar 16 2026 4:37pm ET; page previously had 03-17 */ },
  { title: 'Bridgewater-Raritan Wrestlers Advance To Quarterfinals Of State Wrestling Tournament', source: 'Patch', url: 'https://patch.com/new-jersey/bridgewater/bridgewater-raritan-wrestlers-advance-quarterfinals-state-wrestling', date: '2026-03-13' },
  { title: 'Three Bridgewater-Raritan High School Wrestlers Advance To State Tournament', source: 'TAPinto', url: 'https://www.tapinto.net/towns/bridgewater-slash-raritan/sections/sports/articles/three-bridgewater-raritan-high-school-wrestlers-advance-to-state-tournament', date: '2026-03-08' },
  { title: 'Bridgewater-Raritan Wrestlers Secure 3 District Titles, 7 Qualify For Regionals', source: 'Patch', url: 'https://patch.com/new-jersey/bridgewater/bridgewater-raritan-wrestlers-secure-3-district-titles-7-qualify-regionals', date: '2026-03-07' },
  { title: 'Bridgewater-Raritan Panther Wrestlers Capture NJSIAA Group 5 North 2 Sectional Championship', source: 'TAPinto', url: 'https://www.tapinto.net/towns/bridgewater-slash-raritan/sections/sports/articles/bridgewater-raritan-panther-wrestlers-capture-njsiaa-group-5-north-2-sectional-championship', date: '2025-02-13' /* corrected 2026-08-20 via routine source sweep — this article's own text ("defeating Bayonne in a decisive 57-13 victory... Wednesday, February 12... first since 2016") confirms it covers the FIRST sectional title (2024-25 season), not the second (Union 33-29, Feb 18 2026) as the prior 2026-02-19 date/placement implied. Estimate date = day after the Feb 12, 2025 final. Kept for program history alongside the BRRSD "runner-up" article below (2025-02-16, same 2024-25 season). The actual second-title article is the next entry. */ },
  { title: 'Bridgewater-Raritan High School Is A State Sectional Wrestling Champion For The Second Straight Year', source: 'BRHS Athletics', url: 'https://www.brrsd.org/o/brrhs/article/2721263', date: '2026-02-20' /* corrected 2026-08-20 via routine source sweep — article byline confirmed via direct fetch: "February 20, 2026." Covers the actual Union 33-29 sectional final, Wed Feb 18 2026, at Vaughn Stapleton Gymnasium; previously an estimate of 02-19. */ },
  { title: "Bridgewater-Raritan's Wrestling Team Confident After Historical Season", source: 'The Prowler (BRHS Student News)', url: 'https://brhsprowler.org/5067/sports/bridgewater-raritans-wrestling-team-confident-for-the-season/', date: '2025-11-12' },
  { title: 'Bridgewater-Raritan Ended As Group 5 State Wrestling Runner-Up To Conclude A Memorable Dual Season', source: 'BRHS Athletics', url: 'https://www.brrsd.org/o/brhs/article/2033205', date: '2025-02-16' /* prior (2024-25) season, kept for program history */ },
  { title: 'Hunger Was Pinned Down By Bridgewater-Raritan High School Wrestlers', source: 'Patch', url: 'https://patch.com/new-jersey/bridgewater/hunger-was-pinned-down-bridgewater-raritan-high-school-wrestlers', date: '2025-12-04' /* added 2026-08-08 via routine source sweep — flagged 2026-08-07, added per Tom's go-ahead 2026-08-08. article:published_time confirmed 2025-12-04T15:00:41Z. Covers "Team Bonding with a Purpose," a two-day volunteer effort (Nov 19-20, 2025) where 32 varsity/JV wrestlers worked 6.5-hour shifts at the Food Bank Network of Somerset County, plus a team-sponsored food drive that collected 683 lbs of food and $102.53 in donations — community-service content, not a competitive result. */ },
];

// Program numbers — only figures confirmed via primary sources (BRRSD athletics
// site, TAPinto, Patch, MaxPreps). Individual state/district/region titles are
// intentionally omitted: the program has not won one yet, so a "0" isn't a
// stat worth leading with. Add those rows the moment one is earned.
const STAT_BAR = [
  { num: '2×', label: 'Sectional Champions', sub: '2024-25 & 2025-26 seasons' },
  { num: '21-8', label: 'School-Record Season', sub: '2024-25 dual meet record' },
  { num: '20-9', label: '2025-26 Dual Record', sub: 'Second straight sectional title season' },
  { num: '3', label: '2026 State Qualifiers', sub: 'Levash · McCann · Adell' },
  { num: '2', label: '2026 State Medalists', sub: 'Levash (6th) · McCann (8th)' },
  // Added 2026-08-24 per Tom — the page previously had no conference
  // designation anywhere (unlike football's "American Silver Standings" and
  // volleyball's "Skyland Conference Standings" sections), even though
  // WRESTLING-SOURCES.md has documented BRHS wrestling as a Skyland Conference
  // program since 2026-07-18. A full standings table isn't possible yet —
  // DUAL_SCHEDULE_2026_27 is still genuinely empty (MaxPreps hasn't published
  // a 2026-27 dual schedule) — so this is a label-only stat, same wording
  // pattern as volleyball's STAT_BAR conference row, until real matches exist
  // to derive a table from.
  { num: 'Skyland', label: 'Conference', sub: 'Big Central for football, Skyland for every other BRHS program' },
];

// ── Dashboard data (2026-11-12 restructure to mirror football's hub) ──
// Record / Next / Last Result derive from DUAL_SCHEDULE_2026_27 the moment
// dates are added there. Until the first dual meet is on the schedule, the
// "Next Up" slot falls back to the next upcoming wrestling-tagged event in
// lib/events.js (Media Day, Dec 8-9) — status flips automatically, no edit.
const DASHBOARD_NEXT_GAME = getNextGame(DUAL_SCHEDULE_2026_27);
const DASHBOARD_LAST_PLAYED = getLastPlayedGame(DUAL_SCHEDULE_2026_27);
const NEXT_WRESTLING_EVENT = EVENTS.find((e) => e.team === 'wrestling' && e.status === 'upcoming') || null;
const DASHBOARD_RECORD = getRecord(DUAL_SCHEDULE_2026_27, '0–0');
// Last team result of 2025-26 until the first 2026-27 dual is wrestled.
const DASHBOARD_LATEST_RESULT = getLatestResult(DUAL_SCHEDULE_2026_27, 'L 30–37 · State Semi');
const DASHBOARD_NO_GAME_LABEL = NEXT_WRESTLING_EVENT
  ? `Next Up · ${NEXT_WRESTLING_EVENT.title.replace('BRHS Panther Wrestling ', '')} · ${NEXT_WRESTLING_EVENT.date}`
  : '2026-27 Schedule Coming Soon';

const DASHBOARD_EDITORIAL_ITEMS = sortArticlesByDate(ARTICLES)
  .slice(0, 3)
  .map((a, i) => ({ ...a, img: CAROUSEL[i % CAROUSEL.length].src }));
const DASHBOARD_NEWS_HAS_NEW = DASHBOARD_EDITORIAL_ITEMS.length > 0 && isRecentArticle(DASHBOARD_EDITORIAL_ITEMS[0].date);

const MEDIA_CENTER_TILES = [
  { label: 'Season Gallery', sub: 'View Photos', href: '#gallery', img: '/photos/i-dkcFTnj.jpg' },
  { label: 'Meet the Team', sub: 'Coaches & Wrestlers', href: '#coaches', img: '/photos/i-wBrCNrq.jpg' },
  // Season Kickoff / Senior Night marketing panels removed 2026-11-12 (Tom); Media Day
  // tile points at the gallery section, where the Dec 8-9 Media Day gallery will land.
  { label: 'Media Day', sub: 'Dec 8–9', href: '#gallery', img: '/photos/i-Lv2PXKm.jpg' },
  { label: 'Schedule', sub: 'Results & Outlook', href: '#schedule', img: '/photos/i-mhgq9Xp.jpg' },
  { label: 'Stats', sub: 'Program Records', href: '#stats', img: '/photos/i-zshvpsK.jpg' },
  { label: 'News', sub: 'Latest Coverage', href: '#news', img: '/photos/SPORTS-Zarcone-Photography-0007.jpg' },
];

// 2026-27 coaching staff — bios supplied by Tom Zarcone (2026-11-12), in staff order.
const COACHES = [
  {
    name: 'Kyle Murphy',
    title: 'Head Coach',
    bio: 'Kyle Murphy stood on the New Jersey state podium as a Panther and has since coached his alma mater to back-to-back North Jersey, Section 2, Group 5 championships. The 2016 Bridgewater-Raritan graduate earned District 14 Coach of the Year honors in 2026.',
    philosophy: 'Murphy’s program is built on one word — grit: facing adversity, not giving up, and wrestling for the guy next to you, not just yourself.',
  },
  {
    name: 'Kevin McCann',
    title: 'Varsity Assistant Coach',
    bio: 'Kevin McCann made his mark at South Plainfield as both a wrestler and a coach, winning the 1991 New Jersey state title at 135 pounds before leading the Tigers to seven NJSIAA group championships. His coaching career earned him a place in the New Jersey Scholastic Coaches Association Hall of Fame in 2016.',
  },
  {
    name: 'Ray Jazikoff',
    title: 'Varsity Assistant Coach',
    bio: 'Ray Jazikoff went from the mats at South Plainfield to the NCAA Division III podium, placing seventh at 157 pounds in 2018 to earn All-America honors for NYU. He capped his college career with a program-record 149 wins.',
  },
  {
    name: 'Robert Saum',
    title: 'JV Coach',
    bio: 'Robert Saum piled up 120 wins at Watchung Hills Regional High School, capturing three Somerset County titles and qualifying for the New Jersey state championships. He went on to wrestle at Millersville University and now brings that competitive experience to the Panthers’ JV squad.',
  },
  {
    name: 'Shane Raymond',
    title: 'Assistant Coach',
    bio: 'The newest addition to the Panthers’ coaching staff, Shane Raymond spent several seasons as the lead varsity assistant for South Plainfield’s boys’ and girls’ wrestling programs. He comes to Bridgewater-Raritan after earning District 14 Assistant Coach of the Year honors in 2026.',
  },
];

// Real, sourced returning wrestler — rotates weekly once dual meets begin.
const FEATURED_WRESTLER = {
  name: 'Trent Levash',
  detail: 'Senior · Heavyweight',
  bio: 'A two-time District 14 champion (215 lbs in 2025, heavyweight in 2026) who won the Region 4 title at heavyweight to improve to 29-1 this season, then placed 6th at the 2026 NJSIAA Individual Tournament at Boardwalk Hall. "We get Trent back for two more years," Coach Murphy said in March 2025, after Levash\'s sophomore season — those two seasons were 2025-26 and the upcoming 2026-27 campaign, which will be his senior year and last shot at a state title.',
};

// Mirrors football's gallery pills (2026-11-12): last season's SmugMug archive
// as a live pill, then a pending pill until 2026-27 Pic-Time galleries post.
// When the Media Day gallery (Dec 8-9) is up, add it here as
// { label: '2026-27 Media Day', status: 'live', href: '<Pic-Time URL>' }.
const SEASONS = [
  { label: '2025–26 Matches', status: 'live', href: SEASON_GALLERY_URL },
];

const FAQ = [
  {
    q: 'Where do I order photos?',
    a: <>The 2025–26 season gallery is live now on <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer">SmugMug</a>, where you can view, download, and order prints directly. 2026-27 season galleries will be delivered through <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer">Pic-Time</a>, our current client gallery platform.</>,
  },
  {
    q: 'How quickly are galleries posted?',
    a: 'Match and tournament galleries are professionally edited and delivered within days, not weeks — so photos are ready while the moment is still fresh.',
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
    a: <>Yes. Outside of the season partnership, Zarcone Photography is available for individual <Link href="/senior-portrait-photographer-nj">senior portrait sessions</Link>, family photos, and private <Link href="/event-photographer-nj">event bookings</Link> — <Link href="/about#contact">reach out here</Link>.</>,
  },
  {
    q: 'Do you cover all dual meets and tournaments?',
    a: 'Home dual meets are covered in full as part of the season partnership, along with Senior Night and postseason competition — Districts, Regions, and States — whenever Panther wrestlers qualify.',
  },
  {
    q: 'Can I request a specific wrestler?',
    a: 'Every effort is made to capture the full roster across a meet or tournament. If you\'re looking for a specific wrestler or moment, reach out after a gallery is posted and we\'ll help you find it.',
  },
  {
    q: 'How do senior banners work?',
    a: 'Every graduating senior receives a custom commemorative poster design as part of the partnership — coordinated directly with the program ahead of Senior Night.',
  },
];

const WHY_US = [
  { num: '01', title: '30+ Years Experience', body: '30+ years of photography experience, applied to NJ high school and collegiate sports.' },
  { num: '02', title: 'Pro Nikon Z-System', body: 'Nikon Z9 and Z8 bodies built to freeze the action at mat speed, in any gym lighting.' },
  { num: '03', title: 'Fast Turnaround', body: 'Edited galleries delivered within days of the final whistle.' },
  { num: '04', title: 'Professional Editing', body: 'Every image color-corrected and finished before it reaches your gallery.' },
  { num: '05', title: 'Official Media Partner', body: 'The official photography and social media graphics partner of BRHS Panther Wrestling for 2026-27.' },
  { num: '06', title: 'Prints & Downloads', body: 'High-resolution downloads and print products, ordered directly from your private gallery.' },
];

const SERVICES = [
  { title: 'Dual Meet & Tournament Coverage', body: 'Full coverage of home dual meets and postseason tournament competition.' },
  { title: 'Season Kickoff Portraits', body: 'Individual and team portraits at the start of the season, graphics-ready and recruiting-ready.' },
  { title: 'Senior Night & Banners', body: 'Dedicated coverage and a custom poster design for every senior.' },
  { title: '"Built Different" Campaign Graphics', body: 'Branded social media graphics built for the program\'s Instagram and Facebook channels.' },
  { title: 'Recruiting Content', body: 'Imagery built to represent wrestlers well to college programs.' },
  { title: 'Private Sessions', body: 'Individual senior portraits, family sessions, and headshots by request.' },
];

// Real Google reviews from wrestling families (verified on the Google Business
// Profile 2026-10-06). Trimmed for length only — no words changed. Full text
// also runs in components/Testimonials.jsx.
const FAMILY_QUOTES = [
  {
    text: "I had the pleasure of using Tom\u2019s services many times over the course of 4 years during my son\u2019s wrestling career. Tom has a knack for capturing just the right moment in whatever type of lighting, no matter the subject speed.",
    name: 'Anthony D.',
    role: 'Wrestling Parent · 4 Seasons',
  },
  {
    text: "Amazing action photography and highlight videos. He\u2019s been doing both my son\u2019s wrestling seasons for the last 5 years. Highly recommended!",
    name: 'Gabe P.',
    role: 'Wrestling Parent · 5 Seasons',
  },
  {
    text: "Some of my absolute favorite pictures of my daughter are the wrestling match photos he took. If you need someone who genuinely cares about their craft and delivers unforgettable images, Zarcone Photography is your guy!",
    name: 'Katie K.',
    role: 'Wrestling Parent',
  },
];

export default function BRHSPantherWrestlingPage() {
  const [lbIndex, setLbIndex] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', athleteName: '', sport: 'Wrestling', interestedIn: 'Prints', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error


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
          source: 'BRHS Panther Wrestling landing page',
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setForm({ name: '', email: '', phone: '', athleteName: '', sport: 'Wrestling', interestedIn: 'Prints', message: '' });
    } catch {
      setStatus('error');
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Bridgewater-Raritan Panther Wrestling — 2026-27 Season Media Partnership',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Zarcone Photography',
      url: 'https://www.zarconephotography.com',
      telephone: '(908) 777-0631',
      address: { '@type': 'PostalAddress', addressLocality: 'Bridgewater', addressRegion: 'NJ', addressCountry: 'US' },
    },
    areaServed: { '@type': 'City', name: 'Bridgewater, NJ' },
    description: 'Official photography and social media graphics partner of Bridgewater-Raritan Panther Wrestling for the 2026-27 season — dual meet and tournament coverage, season kickoff portraits, Senior Night, and photo ordering.',
  };

  return (
    <div className={styles.wrap}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <GalleryAlertToast
        team="Wrestling"
        source="BRHS Panther Wrestling — Gallery Alert Toast"
        dismissKey="gr-alert-dismissed-wrestling"
        colors={{
          accent: 'var(--bp-navy)',
          accentDark: 'var(--bp-navy-deep)',
          text: 'var(--bp-navy-deep)',
          textSoft: 'var(--bp-navy-soft)',
          bg: 'var(--bp-white)',
          border: 'var(--bp-navy)',
          btnText: 'var(--bp-white)',
        }}
      />

      {/* ── Dashboard (2026-11-12) ─────────────────────────────────
          Mirrors the football hub's structure: restrained header, dynamic
          Next-Up hero, 4 stat cards, Media Center grid, latest coverage,
          compact schedule. Replaces the marketing hero (and its Order
          Photos / Book Zarcone Photography buttons), the quick-nav pills,
          and the 5-tile Season Tracker. Same navy/cream "Built Different"
          palette via the .dash vars in page.module.css. ── */}
      <div className={styles.dash}>
        <DashboardHeader
          teamName="Bridgewater-Raritan Panther Wrestling"
          season="2026–27 Season"
          links={[
            { href: '#gallery', label: 'Galleries' },
            { href: '#coaches', label: 'Team' },
            { href: '#schedule', label: 'Schedule' },
          ]}
          creditSuffix="Official Photography & Social Media Partner"
        />

        <NextGameHero
          nextGame={DASHBOARD_NEXT_GAME}
          lastPlayedGame={DASHBOARD_LAST_PLAYED}
          latestGallery={null}
          bgPhotoSrc="/photos/wrestling-throw-hero.jpg"
          teamName="Bridgewater-Raritan Panther Wrestling"
          teamMatchupName="Bridgewater-Raritan Panthers"
          pageTitle="Bridgewater-Raritan Panther Wrestling 2026–27"
          resolveGameDate={resolveScheduleDate}
          noGameLabel={DASHBOARD_NO_GAME_LABEL}
        />

        <StatCards
          record={DASHBOARD_RECORD}
          nextLabel={DASHBOARD_NEXT_GAME ? 'Next Match' : 'Next Up'}
          nextGameDate={DASHBOARD_NEXT_GAME ? DASHBOARD_NEXT_GAME.date : (NEXT_WRESTLING_EVENT ? (NEXT_WRESTLING_EVENT.bannerShort || NEXT_WRESTLING_EVENT.date) : 'TBA')}
          nextGameOpponent={DASHBOARD_NEXT_GAME ? DASHBOARD_NEXT_GAME.opponent : (NEXT_WRESTLING_EVENT ? 'Media Day' : null)}
          latestResult={DASHBOARD_LATEST_RESULT}
          seasonYear="2026–27"
          seasonSub="'25 & '26 Sectional Champions"
        />

        <MediaCenterGrid newsHasNew={DASHBOARD_NEWS_HAS_NEW} tiles={MEDIA_CENTER_TILES} />

        <LatestFromPanthers items={DASHBOARD_EDITORIAL_ITEMS} />

        <CompactSchedule
          games={DUAL_SCHEDULE_2026_27}
          emptyMessage="2026-27 dual-meet schedule not yet published. Media Day is Dec 8–9; the season traditionally opens at the Mike Dessino Invitational in mid-December."
        />
      </div>

      {/* ── Program stat bar ─────────────────────────────────────── */}
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
        <p className={styles.statBarNote}>
          The program is still chasing its first individual state, district, or region title — those rows go up here the moment one is won.
        </p>
      </section>

      {/* ── Results & Season Outlook ─────────────────────────────── */}
      <span id="schedule" style={{ position: 'relative', top: -120, display: 'block' }} aria-hidden="true" />
      <section id="results" style={{ scrollMarginTop: 120 }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>2025-26 Season</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Results <em>&amp; Outlook</em></h2>
          </div>
          <p className={styles.sectionSub}>Coming off the program&rsquo;s first-ever back-to-back sectional championship. Here&rsquo;s the road that got them there — and what&rsquo;s next.</p>
        </div>

        <div className={styles.championBanner}>
          <div className={styles.championBannerNum}>33–29</div>
          <div>
            <div className={styles.championBannerTitle}>Back-to-Back North 2, Group 5 Sectional Champions</div>
            <div className={styles.championBannerBody}>
              Defended the sectional title with a 33-29 win over Union on Feb. 18, 2026, at home — the first repeat sectional championship in program history, and the fourth sectional title in Bridgewater-Raritan history overall.
            </div>
          </div>
        </div>

        <table className={styles.scheduleTable}>
          <thead>
            <tr><th>Date</th><th>Event</th><th>Result</th></tr>
          </thead>
          <tbody>
            {RESULTS_2025_26.map((g, i) => (
              <tr key={i} className={g.league ? styles.leagueRow : ''}>
                <td data-label="Date">{g.date}</td>
                <td data-label="Event">{g.event}</td>
                <td className={styles.resultCell} data-label="Result">{g.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.sampleCaption}>
          Juniors Trent Levash (6th, heavyweight) and Matt McCann (8th, 165 lbs) both medaled at the 2026 NJSIAA Individual State Tournament and are confirmed to return for 2026-27, aiming for a third straight sectional title.
          A full 2026-27 dual-meet schedule had not yet been published by <a href="https://www.maxpreps.com/nj/bridgewater/bridgewater-raritan-panthers/wrestling/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--bp-navy)' }}>MaxPreps</a> as of this writing — practice is expected to begin in late November 2026, mirroring last year&rsquo;s Nov. 24 start, with the season traditionally opening at the Mike Dessino Invitational in mid-December. Dates will be added here once released.
        </p>
      </section>

      {/* ── In The News ──────────────────────────────────────────── */}
      <section id="news" style={{ background: 'var(--bp-paper-deep)', scrollMarginTop: 120 }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Coverage</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>In The <em>News</em></h2>
          </div>
          <p className={styles.sectionSub}>Real coverage of the team, the sectional title defense, and the wrestlers — from local press and the school itself.</p>
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

      {/* ── Featured Wrestler ─────────────────────────────────────── */}
      <section id="featured-wrestler" style={{ background: 'var(--bp-paper-deep)' }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Season Spotlight</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Featured <em>Wrestler</em></h2>
          </div>
          <p className={styles.sectionSub}>One athlete, one story — rotating weekly once dual meets begin. Heading into 2026-27:</p>
        </div>
        <div className={styles.spotlightWrap}>
          <div className={styles.spotlightBadge}>{FEATURED_WRESTLER.name.split(' ').map(n => n[0]).join('')}</div>
          <div>
            <div className={styles.spotlightName}>{FEATURED_WRESTLER.name}</div>
            <div className={styles.spotlightClass}>{FEATURED_WRESTLER.detail}</div>
            <p className={styles.spotlightBio}>{FEATURED_WRESTLER.bio}</p>
            <p className={styles.spotlightNote}>Spotlight rotates to a new wrestler each week once the season is underway.</p>
          </div>
        </div>
      </section>

      {/* ── Coaches ──────────────────────────────────────────────── */}
      <section id="coaches" style={{ scrollMarginTop: 120 }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Leadership</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Meet The <em>Coaches</em></h2>
          </div>
        </div>
        <div className={styles.coachGrid}>
          {COACHES.map((c, i) => (
            <div key={i} className={styles.coachCard}>
              <div className={styles.coachAvatar}>{c.name.split(' ').map(n => n[0]).join('')}</div>
              <div>
                <div className={styles.coachName}>{c.name}</div>
                <div className={styles.coachTitle}>{c.title}</div>
                <p className={styles.coachBio} style={{ marginBottom: c.philosophy ? undefined : 0 }}>{c.bio}</p>
                {c.philosophy && <p className={styles.coachBio} style={{ marginBottom: 0 }}>{c.philosophy}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gallery Preview ─────────────────────────────────────── */}
      <section className={styles.gallery} id="gallery" style={{ scrollMarginTop: 120 }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>On The Mat</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Season <em>Gallery</em></h2>
          </div>
          <p className={styles.sectionSub}>Match action from Panther Wrestling, shot by Zarcone Photography.</p>
        </div>

        <div className={styles.seasonPills}>
          {SEASONS.map((s, i) => (
            s.status === 'live' ? (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className={`${styles.seasonPill} ${styles.seasonPillActive}`}>{s.label} — Live</a>
            ) : (
              <span key={i} className={`${styles.seasonPill} ${styles.seasonPillPending}`}>{s.label} — Pending</span>
            )
          ))}
          <span className={`${styles.seasonPill} ${styles.seasonPillPending}`}>2026–27 Meets — Added As Posted</span>
        </div>

        <div className={styles.noticeBar}>
          <span className={styles.noticeDot} />
          Looking for a specific meet? The full <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>2025–26 season gallery</a> is live now. 2026-27 season galleries post here after each meet.
        </div>

        <GalleryAlertSignup
          team="Wrestling"
          source="BRHS Panther Wrestling — Gallery Alert"
          colors={{
            accent: 'var(--bp-navy)',
            accentDark: 'var(--bp-navy-deep)',
            text: 'var(--bp-navy-deep)',
            textSoft: 'var(--bp-navy-soft)',
            bg: 'var(--bp-white)',
            border: 'var(--bp-navy)',
            btnText: 'var(--bp-white)',
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
                alt="Bridgewater-Raritan Panther Wrestling — Zarcone Photography, New Jersey"
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
            images={PHOTOS.map(p => ({ src: p.src, alt: 'Bridgewater-Raritan Panther Wrestling — Zarcone Photography, New Jersey' }))}
            currentIndex={lbIndex}
            onClose={() => setLbIndex(null)}
            onPrev={() => setLbIndex((lbIndex - 1 + PHOTOS.length) % PHOTOS.length)}
            onNext={() => setLbIndex((lbIndex + 1) % PHOTOS.length)}
          />
        )}
      </section>

      {/* ── Built Different campaign banner ─────────────────────── */}
      <section className={styles.campaignBanner}>
        <Image src="/photos/BRHSWrestling2026-2027FBCOVER_C.png" alt="BRHS Panther Wrestling — Built Different, 2026-27 campaign graphic" width={1942} height={809} sizes="100vw" />
        <div className={styles.campaignBar}>
          <span className={styles.eyebrowLight}>2026-27 Campaign Graphic</span>
          <span className={styles.eyebrowLight} style={{ opacity: 0.6 }}>Designed by Zarcone Photography</span>
        </div>
      </section>

      {/* ── Partnership ─────────────────────────────────────────── */}
      <section className={styles.partnership}>
        <div className={styles.logoBlock}>
          <Image src="/photos/BRHSWrestling2026-2027FBProfile_C_transparent.png" alt="BRHS Panther Wrestling — Built Different, 2026-27" width={1568} height={1568} sizes="220px" style={{ width: '100%', height: 'auto' }} />
          <span className={styles.sponsorTag}>Official Partner · 2026-27 Season</span>
        </div>
        <div className={styles.partnershipBody}>
          <span className={styles.eyebrowRed}>Proud Partnership</span>
          <p style={{ marginTop: 18 }}>
            Zarcone Photography is the <strong>official photography and social media graphics partner</strong> of BRHS Panther Wrestling for the 2026-27 season —
            full dual meet and tournament coverage, season kickoff portraits, and the campaign graphics (including the &ldquo;Built Different&rdquo; series) that run across the program&rsquo;s social channels all year.
          </p>
          <p>
            This builds on a growing partnership across Bridgewater-Raritan athletics, including an ongoing role as the official media partner of{' '}
            <Link href="/brhs-panther-football">BRHS Panther Football</Link> and <Link href="/brhs-panther-volleyball">BRHS Panther Girls Volleyball</Link> — the same <Link href="/sports-photographer-nj">sports photographer NJ</Link>, with 30+ years of photography experience. The goal is the same across every program: professional photography, real storytelling, and a visual record worth keeping. Athletic directors and booster clubs can see how a <Link href="/schools-athletic-programs-nj">school sports media partnership</Link> works.
          </p>
          <p>
            Coming off a season that saw the program defend its North 2, Group 5 sectional title for the first time in school history and send two wrestlers to the state medal stand, there&rsquo;s real momentum heading into 2026-27.
          </p>
          <div className={styles.partnershipStats}>
            <div><div className={styles.statNum}>30+</div><div className={styles.statLabel}>Years Experience</div></div>
            <div><div className={styles.statNum}>2x</div><div className={styles.statLabel}>Back-to-Back Sectional Champs</div></div>
            <div><div className={styles.statNum}>2</div><div className={styles.statLabel}>2026 State Medalists</div></div>
          </div>
        </div>
      </section>

      {/* ── Trust note (real Coach Murphy quote) ─────────────────── */}
      <section className={styles.trustNote}>
        <span className={styles.eyebrowRed}>What The Program &amp; Families Say</span>
        <div className={styles.pullQuote}>
          <p className={styles.pullQuoteText}>
            &ldquo;The quality of his photography and graphic design work has taken BRHS Wrestling&rsquo;s social media presence to another level — his graphics consistently look sharp, professional, and engaging.&rdquo;
          </p>
          <cite className={styles.pullQuoteCite}>— Kyle Murphy, Head Wrestling Coach, BRHS</cite>
        </div>
        <div className={styles.familyQuotes}>
          {FAMILY_QUOTES.map(q => (
            <figure key={q.name} className={styles.familyQuote}>
              <div className={styles.familyStars} aria-label="5 out of 5 stars">★★★★★</div>
              <blockquote className={styles.familyQuoteText}>&ldquo;{q.text}&rdquo;</blockquote>
              <figcaption className={styles.familyQuoteCite}>
                <span>{q.name}</span>
                {q.role}
              </figcaption>
            </figure>
          ))}
        </div>
        <a href="https://g.page/r/Ca6PJ5ScxSapEAI/review" target="_blank" rel="noopener noreferrer" className={styles.familyQuotesLink}>
          4.9 ★ on Google · Read all reviews &rarr;
        </a>
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
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Let&rsquo;s Talk <em>Panther Wrestling</em></h2>
          </div>
        </div>
        <div className={styles.contactWrap}>
          <div>
            <p style={{ color: 'var(--bp-navy-soft)', fontSize: 16, lineHeight: 1.8 }}>
              Questions about ordering photos, booking season kickoff, reserving Senior Night coverage, or hiring Zarcone Photography privately —
              send a message and we&rsquo;ll respond within 24 hours.
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
              <label htmlFor="athleteName">Wrestler Name</label>
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
                <option>Season Kickoff</option>
                <option>Team Photography</option>
                <option>Event Coverage</option>
                <option>Other</option>
              </select>
            </div>
            <div className={`${styles.field} ${styles.formFull}`}>
              <label htmlFor="message">Message</label>
              <textarea id="message" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </div>
            {status === 'success' && <p className={styles.formSuccess}>Thanks — your message is in. We&rsquo;ll respond within 24 hours.</p>}
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
          <span className={styles.eyebrowLight}>Follow Along All Season</span>
          <div className={styles.socialLinks} style={{ marginTop: 20 }}>
            <a href="https://instagram.com/zarconephotography" target="_blank" rel="noopener noreferrer">Instagram →</a>
            <a href="https://facebook.com/zarconephotography" target="_blank" rel="noopener noreferrer">Facebook →</a>
            <Link href="/">zarconephotography.com →</Link>
          </div>
        </div>
        <div className={styles.qrBlock}>
          <Image src="/assets/qr-brhs-panther-wrestling.png" alt="QR code to this page" width={410} height={410} style={{ width: 120, height: 120 }} />
          <span>Scan to Return Here</span>
        </div>
      </section>

      {/* ── Persistent CTA — photos are always one click away ────── */}
      <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.floatCta}>
        <span className={styles.floatCtaLong}>View Latest Photos</span>
        <span className={styles.floatCtaShort}>Photos</span>
      </a>
    </div>
  );
}
