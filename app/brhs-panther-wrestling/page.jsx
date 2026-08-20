'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lightbox from '@/components/Lightbox';
import GalleryAlertSignup from '@/components/GalleryAlertSignup';
import GalleryAlertToast from '@/components/GalleryAlertToast';
import styles from './page.module.css';
import { getRecord, getNextMatch } from '@/lib/teamSchedule';
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
];

// Live season tracker. Record and Next Match now derive from
// DUAL_SCHEDULE_2026_27 above (Tier 1 refactor, 2026-07-10) — add matches to
// that array as they're scheduled/wrestled and these two update themselves.
// Latest Result stays manual: RESULTS_2025_26 is a curated highlights list,
// not a full dual-meet log, so "most recent entry" isn't reliably derivable
// the way it is for football's game-by-game schedule. Current Rankings stays
// manual until NJ's preseason polls publish in the fall.
const SEASON_TRACKER = [
  { label: 'Record', value: getRecord(DUAL_SCHEDULE_2026_27), href: '#results' },
  { label: 'Next Match', value: getNextMatch(DUAL_SCHEDULE_2026_27, 'TBA — Opens Late Nov 2026'), href: '#results' },
  { label: 'Latest Result', value: '2026 States: 2 Medalists', href: '#results' },
  { label: 'Current Rankings', value: 'Not Yet Released', href: '#results' },
  { label: 'Latest Gallery', value: '2025-26 Season — Live', href: 'https://zarconephotography.smugmug.com/2025-2026-BRHS-Wrestling', external: true },
];

const COACHES = [
  {
    name: 'Kyle Murphy',
    title: 'Head Varsity Wrestling Coach · Since 2021-22',
    bio: 'A 2016 Bridgewater-Raritan graduate, Murphy wrestled Division I at Bloomsburg University before returning home to lead the program he came up in. He also teaches special education at BRHS and coaches freshman football. Murphy was named the District 14 Coach of the Year for 2026 after guiding the Panthers to a second straight North 2, Group 5 sectional title with a rebuilt lineup of eight new starters.',
    philosophy: 'Murphy’s program is built on one word — grit: facing adversity, not giving up, and wrestling for the guy next to you, not just yourself.',
  },
  {
    name: 'Sammy Alvarez',
    title: 'Assistant Coach · Joined December 2025',
    bio: 'A 2025 NCAA All-America wrestler at Rider University (7th at 149 lbs) and the Mid-American Conference Wrestler of the Year, Alvarez joined Coach Murphy\'s staff after his bid for a fifth year of college eligibility was denied. A 2019 NJ state champion at 126 lbs for St. Joseph Regional, he also wrestled at Rutgers and Oklahoma State, training under coaches John Smith and Scott Goodale. He now works full-time at BRHS as an Instructional Assistant.',
    philosophy: '',
  },
];

// Source: BRRSD staff directory (vh.brrsd.org/o/brhs/article/2590786).
// Full bios/headshots pending — names and titles only for now.
const ASSISTANT_COACHES = [
  { name: 'Ray Jazikoff', title: 'Varsity Assistant Coach' },
  { name: 'Kevin McCann', title: 'Varsity Assistant Coach' },
  { name: 'Rob Saum', title: 'JV Coach' },
];

// Real, sourced returning wrestler — rotates weekly once dual meets begin.
const FEATURED_WRESTLER = {
  name: 'Trent Levash',
  detail: 'Junior · Heavyweight',
  bio: 'A two-time District 14 champion (215 lbs in 2025, heavyweight in 2026) who won the Region 4 title at heavyweight to improve to 29-1 this season, then placed 6th at the 2026 NJSIAA Individual Tournament at Boardwalk Hall. "We get Trent back for two more years," Coach Murphy said in March 2025, after Levash\'s sophomore season — those two seasons were 2025-26 and the upcoming 2026-27 campaign, which will be his senior year and last shot at a state title.',
};

const SEASONS = [
  { label: '2025-26', status: 'live', href: 'https://zarconephotography.smugmug.com/2025-2026-BRHS-Wrestling' },
  { label: '2026-27', status: 'pending' },
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
    a: <>Yes. Outside of the season partnership, Zarcone Photography is available for individual senior sessions, family photos, and private bookings — <Link href="/about#contact">reach out here</Link>.</>,
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
  { num: '01', title: '30+ Years Experience', body: 'Three decades behind the camera across NJ high school and collegiate sports.' },
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

export default function BRHSPantherWrestlingPage() {
  const [lbIndex, setLbIndex] = useState(null);
  const [slide, setSlide] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', athleteName: '', sport: 'Wrestling', interestedIn: 'Prints', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

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

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <Image src="/photos/wrestling-throw-hero.jpg" alt="Bridgewater-Raritan Panther Wrestling" fill priority sizes="100vw" className={styles.heroImg} />
        <div className={styles.heroScrim} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadgeRow}>
            <span className={styles.heroBadge}>2026-27 Season</span>
            <span className={styles.heroBadgeOutline}>Official Photography &amp; Social Media Partner</span>
          </div>
          <h1 className={styles.heroTitle}>Built<br /><span>Different</span></h1>
          <p className={styles.heroSub}>Every championship starts with discipline. Every champion is forged through relentless work.</p>
          <p className={styles.heroWelcome}>Welcome to Bridgewater-Raritan Panther Wrestling.</p>
          <div className={styles.heroCtas}>
            <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnRed}>View Season Gallery</a>
            <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnSilver}>Order Photos</a>
            <a href="#inquire" className={styles.btnGhost}>Book Zarcone Photography</a>
          </div>
        </div>
      </section>

      {/* ── Quick Navigation ─────────────────────────────────────── */}
      <nav className={styles.quickNav} aria-label="Jump to section">
        <a href="#results" className={styles.quickNavLink}>Results</a>
        <a href="#season-kickoff" className={styles.quickNavLink}>Kickoff</a>
        <a href="#gallery" className={styles.quickNavLink}>Gallery</a>
        <a href="#news" className={styles.quickNavLink}>News</a>
        <a href="#inquire" className={styles.quickNavLink}>Contact</a>
      </nav>

      {/* ── Live Season Tracker — the page's weekly-update engine ─── */}
      <section className={styles.latestBar}>
        <div className={styles.latestHead}>
          <span className={styles.latestDot} />
          <span className={styles.eyebrowLight}>2026-27 Season Tracker</span>
        </div>
        <div className={styles.latestGrid}>
          {SEASON_TRACKER.map((item, i) => {
            const Tag = item.external ? 'a' : Link;
            const props = item.external
              ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
              : { href: item.href };
            return (
              <Tag key={i} className={styles.latestItem} {...props}>
                <span className={styles.latestItemLabel}>{item.label}</span>
                <span className={styles.latestItemValue}>{item.value}</span>
              </Tag>
            );
          })}
        </div>
      </section>

      {/* ── Official support line ────────────────────────────────── */}
      <section className={styles.supportLine}>
        Proudly supporting Bridgewater-Raritan Wrestling through photography, storytelling, and season-long media coverage.
      </section>

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
        <p className={styles.statBarNote}>
          The program is still chasing its first individual state, district, or region title — those rows go up here the moment one is won.
        </p>
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
            <Link href="/brhs-panther-football">BRHS Panther Football</Link>. The goal is the same across every program: professional photography, real storytelling, and a visual record worth keeping.
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

      {/* ── Results & Season Outlook ─────────────────────────────── */}
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

      {/* ── Coaches ──────────────────────────────────────────────── */}
      <section>
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
          {ASSISTANT_COACHES.map((c, i) => (
            <div key={i} className={styles.coachCard}>
              <div className={styles.coachAvatar}>{c.name.split(' ').map(n => n[0]).join('')}</div>
              <div>
                <div className={styles.coachName}>{c.name}</div>
                <div className={styles.coachTitle}>{c.title}</div>
                <p className={styles.coachStub}>Full bio and headshot coming as part of the season kickoff shoot.</p>
              </div>
            </div>
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
          <span className={`${styles.seasonPill} ${styles.seasonPillPending}`}>Future Seasons — Archive Grows Here</span>
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
          <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnGhost}>Order Prints &amp; Downloads</a>
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

      {/* ── Season Kickoff ───────────────────────────────────────── */}
      <div id="season-kickoff" className={styles.featureRow} style={{ scrollMarginTop: 120 }}>
        <div className={styles.featurePanel}>
          <Image src="/photos/BRHSWrestling2026-2027FBCOVER_C.png" alt="BRHS Panther Wrestling — Built Different, 2026-27" fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'contain', background: 'var(--bp-navy-deep)' }} />
        </div>
        <div className={styles.featureText}>
          <span className={styles.featureDate}>Late November 2026</span>
          <h2 className={styles.featureTitle}>Season Kickoff</h2>
          <p className={styles.featureLead}>Before the first whistle blows, every wrestler gets the professional treatment — clean portraits and the &ldquo;Built Different&rdquo; campaign graphics built for social media, programs, and recruiting profiles.</p>
          <ul className={styles.checklist}>
            <li>Individual portraits</li>
            <li>Team photos</li>
            <li>Social media graphics</li>
            <li>Schedule graphics</li>
            <li>Senior banners</li>
            <li>Wrestler spotlight graphics</li>
            <li>Coach portraits</li>
            <li>Recruiting content</li>
          </ul>
          <p className={styles.sampleCaption}>Photos and graphics from season kickoff are added here once the 2026-27 season begins.</p>
          <div style={{ marginTop: 28 }}>
            <a href="#inquire" className={styles.btnRed}>Book Season Kickoff</a>
          </div>
        </div>
      </div>

      {/* ── Senior Night ─────────────────────────────────────────── */}
      <div className={`${styles.featureRow} ${styles.reverse}`}>
        <div className={styles.featurePanel}>
          <Image src="/photos/BRHSWrestling2026-2027FBProfile_C_transparent.png" alt="BRHS Panther Wrestling badge" fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'contain', background: 'var(--bp-navy-deep)' }} />
        </div>
        <div className={styles.featureText}>
          <span className={styles.featureDate}>Senior Night</span>
          <h2 className={styles.featureTitle}>The Senior Experience</h2>
          <p className={styles.featureLead}>Four years end on one mat. Every graduating senior gets a custom commemorative poster and a session built around who they are — not a rushed lineup photo.</p>
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

      {/* ── Match Coverage ───────────────────────────────────────── */}
      <div className={styles.featureRow}>
        <div className={styles.featureMedia}>
          <Image src="/photos/SPORTS-Zarcone-Photography-0007.jpg" alt="Dual meet wrestling coverage" fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
        </div>
        <div className={styles.featureText}>
          <span className={styles.featureDate}>Every Home Dual Meet</span>
          <h2 className={styles.featureTitle}>Every Match, Every Mat</h2>
          <p className={styles.featureLead}>Full coverage, shot the way a photojournalist works a mat-side — moving continuously, staying out of the way, never missing the takedown that mattered.</p>
          <ul className={styles.checklist}>
            <li>Action photography</li>
            <li>Mat-side coverage</li>
            <li>Celebrations</li>
            <li>Coach interactions</li>
            <li>Crowd &amp; team bench</li>
            <li>Tournament coverage</li>
            <li>Feature images</li>
            <li>Fast gallery turnaround</li>
          </ul>
          <p style={{ fontSize: 14, color: 'var(--bp-navy-soft)' }}>Professionally edited · High-resolution downloads · Print ordering built in</p>
          <div style={{ marginTop: 20 }}>
            <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnRed}>View Match Galleries</a>
          </div>
        </div>
      </div>

      {/* ── Why Zarcone Photography ──────────────────────────────── */}
      <section>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Why Zarcone Photography</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Trusted <em>On The Mat</em></h2>
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

      {/* ── Trust note (real Coach Murphy quote) ─────────────────── */}
      <section className={styles.trustNote}>
        <span className={styles.eyebrowRed}>What The Program Says</span>
        <div className={styles.pullQuote}>
          <p className={styles.pullQuoteText}>
            &ldquo;The quality of his photography and graphic design work has taken BRHS Wrestling&rsquo;s social media presence to another level — his graphics consistently look sharp, professional, and engaging.&rdquo;
          </p>
          <cite className={styles.pullQuoteCite}>— Kyle Murphy, Head Wrestling Coach, BRHS</cite>
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

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className={styles.finalCta}>
        <h2 className={styles.finalCtaTitle}>Every Season Has A Story.<br /><span>We&rsquo;re Honored To Preserve Yours.</span></h2>
        <p className={styles.finalCtaSub}>Official photography &amp; social media partner of Bridgewater-Raritan Panther Wrestling — 2026-27 season.</p>
        <div className={styles.finalCtaBtns}>
          <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnRed}>View Galleries</a>
          <a href="#inquire" className={styles.btnSilver}>Book Photography</a>
          <Link href="/about#contact" className={styles.btnGhost}>Contact Us</Link>
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
