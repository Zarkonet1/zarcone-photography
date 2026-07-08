'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lightbox from '@/components/Lightbox';
import Testimonials from '@/components/Testimonials';
import styles from './page.module.css';

const GALLERY_URL = 'https://galleries.zarconephotography.com';
const SEASON_GALLERY_URL = 'https://zarconephotography.smugmug.com/2025-2026-BRHS-Football';

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

// 2026 schedule as published by MaxPreps / NJ Skyland Conference (subject to change — confirm kickoff times before heading to games).
const SCHEDULE_2026 = [
  { date: 'Thu, Aug 27', time: '7:00 PM', opponent: 'at Woodbridge', home: false },
  { date: 'Thu, Sep 10', time: '6:00 PM', opponent: 'vs Hillsborough', home: true, league: true },
  { date: 'Fri, Sep 18', time: '6:00 PM', opponent: 'vs Ridge', home: true, league: true },
  { date: 'Fri, Oct 2', time: '6:00 PM', opponent: 'vs Hunterdon Central', home: true },
  { date: 'Fri, Oct 9', time: '7:00 PM', opponent: 'at Union', home: false },
  { date: 'Fri, Oct 16', time: '7:00 PM', opponent: 'at Phillipsburg', home: false, league: true },
];

// Real coverage of the program — no invented headlines.
const ARTICLES = [
  { title: 'Football: Bridgewater-Raritan Wins First Sectional Championship, 21-14, Over Bayonne', source: 'TAPinto', url: 'https://www.tapinto.net/towns/bayonne/sections/sports/articles/football-bridgewater-raritan-wins-first-sectional-championship-21-14-over-bayonne' },
  { title: 'North 2, Group 5 Final Preview: Bridgewater-Raritan Panthers vs. Bayonne Bees', source: 'CJ Sports Radio', url: 'https://cjsportsradio.com/2025/11/14/north-2-group-5-final-preview-bridgewater-raritan-panthers-vs-bayonne-bees/' },
  { title: "Bridgewater-Raritan Tops Union City At Home, 22-7, To Clinch First Sectional Finals Berth Since '17", source: 'CJ Sports Radio', url: 'https://cjsportsradio.com/2025/11/07/bridgewater-raritan-tops-union-city-at-home-22-7-to-clinch-first-sectional-finals-berth-since-17/' },
  { title: 'Bridgewater-Raritan Cruised Past Linden In State Football Playoff Opener', source: 'The Prowler (BRHS Student News)', url: 'https://brhsprowler.org/5012/sports/bridgewater-raritan-cruised-past-linden-in-state-football-playoff-opener/' },
  { title: 'History On The Line: Bridgewater-Raritan HS Seeks To Win 1st Ever State Sectional Football Championship', source: 'Patch', url: 'https://patch.com/new-jersey/bridgewater/history-line-bridgewater-raritan-hs-seeks-win-1st-ever-state-sectional' },
  { title: 'Standout Tackle Justin Simpson Of The Record-Setting Bridgewater-Raritan Football Team Is Headed To Bucknell', source: 'BRRSD Athletics', url: 'https://www.brrsd.org/o/brrhs/article/2580305' },
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
  { num: '3rd', label: 'Season As Head Coach', sub: 'D.J. Catalano, entering his 4th year at BRHS' },
];

const SEASON_TRACKER = [
  { label: 'Record', value: 'Preseason · 0–0', href: '#schedule' },
  { label: 'Next Game', value: 'Aug 27 — at Woodbridge', href: '#schedule' },
  { label: 'Latest Result', value: '2025: Sectional Champions', href: '#results' },
  { label: 'Current Rankings', value: 'Not Yet Released', href: '#results' },
  { label: 'Latest Gallery', value: '2025–26 Season — Live', href: SEASON_GALLERY_URL, external: true },
];

const COACHES = [
  {
    name: 'D.J. Catalano',
    title: 'Head Varsity Football Coach · 3rd Season · 4th Year at BRHS',
    bio: 'Catalano joined the Bridgewater-Raritan program four years ago, spending his first season under then-head coach Rick Mantz before taking over as head coach. Entering his third year leading the program in 2025, he guided the Panthers to their first sectional championship in school history.',
  },
];

const FEATURED_PLAYER = {
  name: 'Denzel Amoafo',
  detail: 'Senior · Running Back',
  bio: "Amoafo returns for his senior season as the Panthers' leading returning rusher, after piling up 530 yards and 5 touchdowns as a junior in 2025 — a season that ended with Bridgewater-Raritan's first sectional championship in program history.",
};

// 2025 playoff run only — the confirmed, sourced portion of the season.
// Full regular-season game log is not yet compiled; shown honestly rather than guessed.
const RESULTS_2025 = [
  { date: 'Oct 31, 2025', opponent: 'vs Linden', round: 'NJSIAA North 2, Group 5 Playoffs — First Round', result: 'W 35–6', win: true },
  { date: 'Nov 7, 2025', opponent: 'vs Union City', round: 'NJSIAA North 2, Group 5 Playoffs — Sectional Semifinal', result: 'W 22–7', win: true },
  { date: 'Nov 14, 2025', opponent: 'vs Bayonne', round: 'NJSIAA North 2, Group 5 Sectional Final', result: 'W 21–14', win: true },
  { date: 'Nov 21, 2025', opponent: 'vs Passaic County Tech', round: 'NJSIAA Group 5 State Tournament', result: 'L 14–23', win: false },
];

const SEASONS = [
  { label: '2025–26', status: 'live', href: SEASON_GALLERY_URL },
  { label: '2026', status: 'pending' },
];

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
      url: 'https://zarconephotography.com',
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
    organizer: { '@type': 'Organization', name: 'Zarcone Photography', url: 'https://zarconephotography.com' },
  };

  return (
    <div className={styles.wrap}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }} />

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
                <td>{g.date}</td>
                <td>{g.time}</td>
                <td>{g.opponent}{g.league && <span className={styles.leagueTag}>League</span>}</td>
                <td className={styles.resultCell}>—</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.sampleCaption}>
          Schedule per <a href="https://www.maxpreps.com/nj/bridgewater/bridgewater-raritan-panthers/football/schedule/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--br-red)' }}>MaxPreps</a> as of late June 2026 — additional games and playoff dates are added as the season is finalized. Kickoff times are subject to change; confirm before heading to a game via <a href="https://brhspantherfb.org/schedules/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--br-red)' }}>the official team site</a>. Results post here after each game.
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
                <td>{g.date}</td>
                <td>{g.opponent}</td>
                <td>{g.round}</td>
                <td className={g.win ? styles.resultWin : styles.resultLoss}>{g.result}</td>
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
          <div className={styles.coachCard}>
            <div>
              <div className={styles.coachName}>Assistant Coaches</div>
              <p className={styles.coachStub} style={{ marginTop: 10 }}>Full staff bios coming as the 2026 season approaches.</p>
            </div>
          </div>
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
          {ARTICLES.map((a, i) => (
            <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className={styles.newsCard}>
              <span className={styles.newsSource}>{a.source}</span>
              <span className={styles.newsTitle}>{a.title}</span>
              <span className={styles.newsLink}>Read Article →</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── Gallery Preview ─────────────────────────────────────── */}
      <section className={styles.gallery}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>From The Sidelines</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>Season <em>Gallery</em></h2>
          </div>
          <p className={styles.sectionSub}>Game action from Panther Football, shot by Zarcone Photography.</p>
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
          Looking for a specific game? The full <a href={SEASON_GALLERY_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>2025–26 season gallery</a> is live now. 2026 season galleries post here after each game.
        </div>

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
