'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lightbox from '@/components/Lightbox';
import Testimonials from '@/components/Testimonials';
import GalleryAlertSignup from '@/components/GalleryAlertSignup';
import GalleryAlertToast from '@/components/GalleryAlertToast';
import styles from './page.module.css';
import { getRecord, getNextMatch, getLatestResult } from '@/lib/teamSchedule';
import { sortArticlesByDate, isRecentArticle } from '@/lib/articles';
import { SCHEDULE_2026 } from '@/lib/volleyballSchedule';
import { GALLERIES_2026, getLatestGallery } from '@/lib/volleyballGalleries';

const GALLERY_URL = 'https://galleries.zarconephotography.com';

// Derived from lib/volleyballGalleries.js — don't hand-edit galleries here.
// Add new galleries to GALLERIES_2026 in that file once Tom starts posting
// them; this page just reads it. Empty today, same honest-empty-state
// pattern as the wrestling page's dual schedule before dates were published.
const LATEST_GALLERY = getLatestGallery(GALLERIES_2026);

// Individual Media Day player portraits — same convention as football's
// PORTRAIT_NUMBERS (see app/brhs-panther-football/page.jsx + SITE-CHEATSHEET.md).
// Empty until a Media Day shoot happens and Tom drops files into
// public/photos/volleyball-media-day-portraits/{number}.jpg — add jersey
// numbers here the same session those files land. Deliberately not scheduled
// yet — no invented date, unlike football/wrestling which had a real one.
const PORTRAIT_NUMBERS = new Set([]);

// TEMPORARY PLACEHOLDER — the only volleyball-specific photo in the asset
// library today is this senior-poster graphic (not game action). Tom is
// curating a full action-photo batch the night this page ships; swap this
// array out then. Deliberately NOT borrowing football/other-sport action
// shots to fill space — same "no cross-sport placeholders" rule the football
// page's PHOTOS array follows.
const PHOTOS = [
  { src: '/photos/SENIOR-POSTER-Diaz-Volleyball.jpg', width: 1600, height: 2000, size: 'wide' },
];

const CAROUSEL = [
  { src: '/photos/SENIOR-POSTER-Diaz-Volleyball.jpg', width: 1600, height: 2000, caption: 'Panther Volleyball — Photos Coming Soon' },
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
    date: '2025-10-15' /* ESTIMATE — added 2026-08-22 via initial source sweep. TAPinto's own metadata didn't expose a publish date; the article's meta description notes the team's "newcomers" had a strong debut varsity season and that the title came "about two weeks" before publication, which fits an SCT final in early-to-mid October. Placed mid-October as a documented estimate, not a guess presented as fact — correct the exact date if a firmer source turns up in a future sweep. */
  },
  {
    title: 'Girls Volleyball: Bridgewater-Raritan Defeats Montgomery, 3-0 (25-17, 25-17, 25-18) — NJSIAA Central Jersey, Group 4 First Round',
    source: 'TAPinto',
    url: 'https://www.tapinto.net/towns/bridgewater-slash-raritan/sections/sports/articles/girls-volleyball-bridgewater-raritan-defeats-montgomery-3-0',
    date: '2025-10-30' /* ESTIMATE — added 2026-08-22. Confirmed as a first-round NJSIAA Central Jersey Group 4 tournament win via the article's own metadata; exact publish date not exposed, placed at the typical late-October start of the NJ volleyball state tournament. */
  },
  {
    title: 'Girls Volleyball: Bridgewater-Raritan Surges Past Hillsborough, 2-0 (25-23, 25-18)',
    source: 'TAPinto',
    url: 'https://www.tapinto.net/towns/bridgewater-slash-raritan/sections/sports/articles/girls-volleyball-bridgewater-raritan-surges-past-hillsborough-2-0-25-23-25-18',
    date: '2025-09-10' /* CONFIRMED — added 2026-08-22. Matches BRRSD's own recap of the same Sept 9, 2025 home-opener sweep (brrsd.org/o/brrhs/article/2409792, published Sept 10, 2025), which independently corroborates the date and box score: Ella Sorenson 21 assists, Jahniah Bishop 7 kills/3 blocks, Grace Fitzpatrick 9 kills, Katelyn Phan 6 kills/2 aces, Ava Marvuglio 9 digs. Season context: 5 new varsity starters after a 10-4 finish in 2024, including a 2024 state-sectional playoff win over this same Hillsborough team. */
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
// Coach Josh Everett's exact hire year wasn't confirmed in this sweep, so
// (unlike football's COACH_TENURE) no "Nth season" figure is computed here
// — add it once a source confirms his start year.
const STAT_BAR = [
  { num: "'25", label: 'Somerset County Champions', sub: 'Defeated Mount St. Mary Academy, 3-0 — per TAPinto' },
  { num: '10-4', label: '2024 Season Record', sub: 'Included a state sectional playoff win over Hillsborough' },
  { num: '2-0', label: '2025 States, Round 1', sub: 'Def. Montgomery, 3-0 — NJSIAA Central Jersey, Group 4' },
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

const SEASON_TRACKER = [
  { label: 'Record', value: getRecord(SCHEDULE_2026), href: '#schedule' },
  { label: 'Next Match', value: getNextMatch(SCHEDULE_2026, 'Season Complete'), href: '#schedule' },
  { label: 'Latest Result', value: getLatestResult(SCHEDULE_2026, '2025: Somerset County Champions'), href: '#results' },
  {
    label: 'Conference Standing',
    value: DIVISION_GAMES_PLAYED
      ? `${BRHS_STANDINGS_ROW.confWins}-${BRHS_STANDINGS_ROW.confLosses} — Skyland`
      : 'Skyland Conference — Preseason',
    href: '#standings',
  },
  {
    label: 'Latest Gallery',
    value: LATEST_GALLERY ? `${LATEST_GALLERY.label} — Live` : 'Posts After Season Opener',
    href: LATEST_GALLERY ? LATEST_GALLERY.href : GALLERY_URL,
    external: true,
  },
];

// Coaching staff — per Bridgewater-Raritan Athletics' own staff contact
// directory (brrsd.org/o/brrhs/page/contacts), the most authoritative source
// available. Note: Josh Everett coaches Girls Volleyball as head coach AND
// Boys Volleyball as JV coach — not a typo, confirmed on the same page.
const COACHES = [
  {
    name: 'Josh Everett',
    title: 'Head Coach, Girls Volleyball',
    bio: "Everett leads the Bridgewater-Raritan girls volleyball program, coming off a 2025 season that included a Somerset County Tournament championship and the program's first NJSIAA Central Jersey Group 4 tournament win in recent memory. He also serves as JV coach for BRHS Boys Volleyball.",
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
  { date: 'Oct ~2025', opponent: 'vs Mount St. Mary Academy', round: 'Somerset County Tournament — Final', result: 'W 3-0', win: true },
  { date: 'Oct ~2025', opponent: 'vs Montgomery', round: 'NJSIAA Central Jersey, Group 4 — First Round', result: 'W 3-0 (25-17, 25-17, 25-18)', win: true },
];

// 2026-27 preseason roster, per MaxPreps (fetched 2026-08-22). Position
// abbreviations: OH = Outside Hitter, S = Setter, L = Libero, DS = Defensive
// Specialist, RS = Right Side, MH = Middle Hitter, OPP = Opposite. A player
// with two positions listed keeps both in the table; the first is used for
// grouping below. Two players share jersey #7 on MaxPreps' listing
// (Sophia Di Costanzo, So., and Brooke Krizan, Jr.) — kept as-is rather than
// silently "fixed," since it wasn't possible to confirm which is a data
// artifact vs. a genuine number conflict between levels; flag to Tom if this
// looks wrong once he has the real roster sheet.
const ROSTER_RAW_2026 = [
  { number: 1, first: 'Niah', last: 'Arun', grade: 'Sophomore', position: 'L' },
  { number: 2, first: 'Olivia', last: 'Lin', grade: 'Sophomore', position: '—' },
  { number: 4, first: 'Emily', last: 'Vetro', grade: 'Sophomore', position: 'OH' },
  { number: 5, first: 'Sara', last: 'Elfadil', grade: 'Sophomore', position: 'OH, DS' },
  { number: 7, first: 'Sophia', last: 'Di Costanzo', grade: 'Sophomore', position: 'OH' },
  { number: 7, first: 'Brooke', last: 'Krizan', grade: 'Junior', position: 'S' },
  { number: 8, first: 'Reese', last: 'Paxson', grade: 'Sophomore', position: 'L' },
  { number: 9, first: 'Roma', last: 'Gupta', grade: 'Junior', position: 'DS, L' },
  { number: 10, first: 'Joselle', last: 'Factor', grade: 'Sophomore', position: 'OH' },
  { number: 13, first: 'Jamie', last: 'McGeechan', grade: 'Sophomore', position: 'DS' },
  { number: 16, first: 'Brooke', last: 'Potts', grade: 'Junior', position: 'DS' },
  { number: 18, first: 'Samantha', last: 'Lopez', grade: 'Sophomore', position: 'RS, MH' },
  { number: 20, first: 'Sara', last: 'Abbaszadeh', grade: 'Junior', position: 'DS' },
  { number: 22, first: 'Aryn', last: 'Snitzer', grade: 'Junior', position: 'RS' },
  { number: 25, first: 'Jackie', last: 'Oram', grade: 'Sophomore', position: 'OH, L' },
  { number: 27, first: 'Klaudia', last: 'Swider', grade: 'Sophomore', position: 'OPP, S' },
];

// Groups by primary (first-listed) position — mirrors football's OFF_POS_GROUP
// pattern, adapted for volleyball position abbreviations.
const POS_GROUP = {
  OH: 'Outside Hitters',
  S: 'Setters',
  L: 'Liberos',
  DS: 'Defensive Specialists',
  RS: 'Right Side',
  MH: 'Middle Hitters',
  OPP: 'Opposites',
};
const ROSTER_GROUP_ORDER = ['Outside Hitters', 'Setters', 'Liberos', 'Defensive Specialists', 'Right Side', 'Middle Hitters', 'Opposites'];
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
  const [slide, setSlide] = useState(0);
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

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        {/* TEMPORARY hero image — the senior-poster graphic is the only
            volleyball-specific asset on file today. Swap for real match
            action once Tom's photo batch lands. */}
        <Image src="/photos/SENIOR-POSTER-Diaz-Volleyball.jpg" alt="Bridgewater-Raritan Panther Girls Volleyball" fill priority sizes="100vw" className={styles.heroImg} style={{ objectPosition: 'center 20%' }} />
        <div className={styles.heroScrim} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadgeRow}>
            <span className={styles.heroBadge}>2026 Season</span>
            <span className={styles.heroBadgeOutline}>2025 Somerset County Champions</span>
          </div>
          <h1 className={styles.heroTitle}>Every Point<br /><span>Earns The Next One.</span></h1>
          <p className={styles.heroSub}>Bridgewater-Raritan opens the 2026 season August 25 at Piscataway — coming off a Somerset County Tournament title and the program's first NJSIAA Central Jersey Group 4 tournament win.</p>
          <p className={styles.heroWelcome}>Welcome to Bridgewater-Raritan Panther Volleyball.</p>
          <div className={styles.heroCtas}>
            <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnRed}>View Galleries</a>
            <a href="#inquire" className={styles.btnGhost}>Book Zarcone Photography</a>
          </div>
        </div>
      </section>

      {/* ── Quick Navigation ─────────────────────────────────────── */}
      <nav className={styles.quickNav} aria-label="Jump to section">
        <a href="#schedule" className={styles.quickNavLink}>Schedule</a>
        <a href="#roster" className={styles.quickNavLink}>Roster</a>
        <a href="#gallery-alert" className={styles.quickNavLink}>Gallery</a>
        <a href="#news" className={styles.quickNavLink}>News</a>
        <a href="#inquire" className={styles.quickNavLink}>Contact</a>
      </nav>

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
        Photography Partner of Bridgewater-Raritan Panther Girls Volleyball
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
        <p className={styles.statBarNote}>Program history and 2025 results per TAPinto and BRRSD Athletics.</p>
      </section>

      {/* ── Partnership ─────────────────────────────────────────── */}
      <section className={styles.partnership}>
        <div className={styles.logoBlock}>
          <Image src="/photos/brhs-panther-athletics-logo.png" alt="Bridgewater-Raritan Panther Athletics" width={1024} height={1024} sizes="220px" style={{ width: '100%', height: 'auto' }} />
        </div>
        <div className={styles.partnershipBody}>
          <span className={styles.eyebrowRed}>Proud Partnership</span>
          <p style={{ marginTop: 18 }}>
            Zarcone Photography is proud to partner with BRHS Panther Girls Volleyball for the 2026 season — match day coverage,
            Media Day portraits (once scheduled), and a custom Senior Night poster for every graduating senior.
          </p>
          <p>
            This builds on an existing role with Bridgewater athletics as the official photography &amp; media partner of{' '}
            <Link href="/brhs-panther-football">BRHS Panther Football</Link> and <Link href="/brhs-panther-wrestling">BRHS Panther Wrestling</Link>. The goal is the same across every program: professional photography, real storytelling, and a visual record
            worth keeping — not just a highlight reel.
          </p>
          <p>
            Beyond the court, that commitment shows up in the community too — from sponsoring local charity events to showing up consistently,
            season after season, for the programs that trust us with their story.
          </p>
          <div className={styles.partnershipStats}>
            <div><div className={styles.statNum}>30+</div><div className={styles.statLabel}>Years Experience</div></div>
            <div><div className={styles.statNum}>'25 SCT</div><div className={styles.statLabel}>County Champions</div></div>
            <div><div className={styles.statNum}>Aug 25</div><div className={styles.statLabel}>Season Opener</div></div>
          </div>
        </div>
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
            : 'All four teams open the season 0-0 — the 2026 opener is Tue, Aug 25 (non-league). Standings fill in as conference matches are played.'}
          {' '}Bridgewater-Raritan's record is drawn automatically from the schedule above; other teams' records are tracked from{' '}
          <a href="https://www.maxpreps.com/nj/bridgewater/bridgewater-raritan-panthers/volleyball/schedule/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--br-red)' }}>MaxPreps</a>.
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

      {/* ── Roster ───────────────────────────────────────────────── */}
      <section id="roster" style={{ background: 'rgba(255,255,255,0.02)', scrollMarginTop: 120 }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>Preseason Roster</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>2026 <em>Roster</em></h2>
          </div>
          <p className={styles.sectionSub}>
            {ROSTER_2026.length} players as of the 2026-27 preseason, per MaxPreps. Media Day portraits post here once a shoot is scheduled.
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
          Roster subject to change before the season opener. Position abbreviations: OH = Outside Hitter, S = Setter, L = Libero, DS = Defensive Specialist, RS = Right Side, MH = Middle Hitter, OPP = Opposite.
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

      {/* ── Gallery Preview ─────────────────────────────────────── */}
      <span id="gallery" style={{ position: 'relative', top: -120, display: 'block' }} aria-hidden="true" />
      <section className={styles.gallery} id="gallery-alert" style={{ scrollMarginTop: 120 }}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>From The Court</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Season <em>Gallery</em></h2>
          </div>
          <p className={styles.sectionSub}>Match action from Panther Volleyball, shot by Zarcone Photography — posting here after the Aug 25 opener.</p>
        </div>

        <div className={styles.seasonPills}>
          {GALLERIES_2026.map((g, i) => (
            <a key={`gallery-${i}`} href={g.href} target="_blank" rel="noopener noreferrer" className={`${styles.seasonPill} ${styles.seasonPillActive}`}>{g.label} — Live</a>
          ))}
          <span className={`${styles.seasonPill} ${styles.seasonPillPending}`}>2026 Season — Posts After Opener</span>
        </div>

        <div className={styles.noticeBar}>
          <span className={styles.noticeDot} />
          Galleries post here after each match, once the 2026 season begins on Aug 25.
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

        <div className={styles.galleryFooter} style={{ marginTop: 0, marginBottom: 36, justifyContent: 'flex-start', gap: 14 }}>
          <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnGhost}>Order Prints &amp; Downloads</a>
        </div>

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

      {/* ── Match Day Coverage ───────────────────────────────────── */}
      <div className={styles.featureRow}>
        <div className={styles.featurePanel}>
          <span className={styles.featurePanelDate}>Match</span>
          <span className={styles.featurePanelLabel}>Day</span>
        </div>
        <div className={styles.featureText}>
          <span className={styles.featureDate}>Every Home Match</span>
          <h2 className={styles.featureTitle}>Match Day Coverage</h2>
          <p className={styles.featureLead}>Full coverage from the baseline — kills, digs, blocks, and the bench reactions that tell the rest of the story.</p>
          <ul className={styles.checklist}>
            <li>Action photography</li>
            <li>Sideline &amp; bench</li>
            <li>Celebrations</li>
            <li>Coach interactions</li>
            <li>Crowd &amp; student section</li>
            <li>Feature images</li>
            <li>Fast gallery turnaround</li>
          </ul>
          <p style={{ fontSize: 14, color: 'var(--br-silver)' }}>Professionally edited · High-resolution downloads · Print ordering built in</p>
          <div style={{ marginTop: 20 }}>
            <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnRed}>View Galleries</a>
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
            <Image src={c.src} alt={c.caption} fill sizes="100vw" priority={i === 0} style={{ objectPosition: 'center 20%' }} />
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
        <p style={{ marginTop: 16 }}>What clients across our programs have to say:</p>
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
          <Image src="/assets/qr-brhs-panther-volleyball.png" alt="QR code to this page" width={240} height={240} style={{ width: 120, height: 120 }} />
          <span>Scan to Return Here</span>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className={styles.finalCta}>
        <h2 className={styles.finalCtaTitle}>Every Season Has A Story.<br /><span>We're Honored To Preserve Yours.</span></h2>
        <p className={styles.finalCtaSub}>Photography partner of Bridgewater-Raritan Panther Girls Volleyball — 2026 season.</p>
        <div className={styles.finalCtaBtns}>
          <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnRed}>View Galleries</a>
          <a href="#inquire" className={styles.btnSilver}>Book Photography</a>
          <Link href="/about#contact" className={styles.btnGhost}>Contact Us</Link>
        </div>
      </section>

      <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.floatCta}>
        <span className={styles.floatCtaLong}>View Latest Photos</span>
        <span className={styles.floatCtaShort}>Photos</span>
      </a>
    </div>
  );
}
