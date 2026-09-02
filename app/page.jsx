'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import Testimonials from '@/components/Testimonials';
import VideoReel from '@/components/VideoReel';
import InstagramFeed from '@/components/InstagramFeed';
import NewsletterCapture from '@/components/NewsletterCapture';
import TrustStrip from '@/components/TrustStrip';

// Hero rotation — one per discipline, warm-graded 1920×1080 crops
const HERO_PHOTOS = [
  '/photos/i-s7zBdzk-hero.jpg',        // football
  '/photos/i-rvRX82g-hero.jpg',        // senior portrait
  '/photos/softball-action-hero.jpg',   // softball
  '/photos/i-q7LzKSb-hero.jpg',        // Barn Swallows band — events/music
  '/photos/gymnastics-bars-hero.jpg',   // gymnastics
  '/photos/wrestling-reaction-hero.jpg', // wrestling — post-pin reaction, swapped in 2026-08-04 (stronger than prior throw shot)
  '/photos/i-hdjLNfF-hero.jpg',        // design — senior track graphic, first design rep in hero
  '/photos/grad-carry-hero.jpg',        // graduation celebration — Union Catholic, added 2026-08-04
  '/photos/Ironman_Bike_Dylan.jpg',     // triathlon
];

// Local photos
const SM = {
  footballTeam:    '/photos/i-s7zBdzk.jpg',
  footballCatch:   '/photos/i-HkmJPk8.jpg',
  wrestlingStates: '/photos/i-Lv2PXKm.jpg',
  wrestlingThrow:  '/photos/i-dkcFTnj.jpg',
  wrestlingGrapple:'/photos/i-wBrCNrq.jpg',
  portrait:        '/photos/i-rvRX82g.jpg',
  barnSwallows:    '/photos/i-q7LzKSb.jpg',
  designPoster:    '/photos/i-hdjLNfF.jpg',
  lacrosse:        '/photos/i-TSHFjz3.jpg',

};

const DISCIPLINES = [
  {
    num: '01',
    slug: 'sports',
    title: 'Sports',
    desc: 'Your athlete has been putting in the work for years. The photos should show it. High school sports end faster than anyone expects — these are the images that prove it happened.',
    img: SM.footballTeam,
  },
  {
    num: '02',
    slug: 'portraits',
    title: 'Portraits',
    desc: 'There\'s a version of you — right now, in this season of your life — that won\'t exist next year. Sessions built to capture who you actually are before this moment passes.',
    img: '/photos/chloe-portrait.jpg',
  },
  {
    num: '03',
    slug: 'events',
    title: 'Events',
    desc: 'Quinceañeras, graduations, galas, concerts — every room has a story worth documenting properly.',
    img: SM.barnSwallows,
  },
  {
    num: '04',
    slug: 'design',
    title: 'Design',
    desc: 'Senior posters, team graphics, and memory books — custom-built around your photos from the same session.',
    img: '/photos/DESIGN-20WinsPoster.jpg',
  },
];

const WORK_GRID = [
  { src: '/photos/Ironman_Bike_Dylan.jpg', objPos: '35% center', alt: 'Triathlon cyclist at IRONMAN 70.3 Eagleman — Zarcone Photography NJ' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0035-2.jpg', alt: 'Portrait photography session — Zarcone Photography, Bridgewater NJ' },
  { src: '/photos/Ironman_Run_Dante.jpg', alt: 'Triathlon runner at IRONMAN 70.3 Eagleman — Zarcone Photography NJ' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-83.jpg', alt: 'Portrait photographer New Jersey — Zarcone Photography' },
  { src: '/photos/EVENT-Zarcone-Photography-28.jpg', alt: 'Event photography New Jersey — Zarcone Photography' },
  { src: '/photos/danielle-portrait.jpg', alt: 'Senior portrait session — Zarcone Photography, Bridgewater NJ' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Home() {
  const heroRef = useRef(null);
  const [heroIdx, setHeroIdx] = useState(0);
  // Starts as the fixed order (matches server-rendered HTML, avoids hydration
  // mismatch on the LCP element), then shuffles client-side right after mount
  // so repeat visitors don't see the same fixed sequence.
  const [heroOrder, setHeroOrder] = useState(HERO_PHOTOS);

  useEffect(() => {
    setHeroOrder(shuffle(HERO_PHOTOS));
  }, []);

  // Hero rotation — 6s per slide
  useEffect(() => {
    const t = setInterval(() => {
      setHeroIdx(i => (i + 1) % heroOrder.length);
    }, 6000);
    return () => clearInterval(t);
  }, [heroOrder]);

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 60);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        {heroOrder.map((src, i) => {
          const nextIdx = (heroIdx + 1) % heroOrder.length;
          const shouldLoad = i === heroIdx || i === nextIdx || i === 0;
          return (
            <div
              key={src}
              className={styles.heroImg}
              style={{
                backgroundImage: shouldLoad ? `url('${src}')` : undefined,
                opacity: i === heroIdx ? 1 : 0,
                transition: 'opacity 1.8s ease-in-out',
              }}
            />
          );
        })}
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={`eyebrow ${styles.heroEyebrow}`}>
            Serving New Jersey, New York City &amp; Philadelphia
          </p>
          <h1 className={styles.heroTitle}>
            New Jersey's sports,<br />portrait &amp; event<br /><em>photography.</em>
          </h1>
          <p className={styles.heroSub}>
            Senior year doesn't slow down. Game day doesn't replay. The moments that define this season are happening right now — and they deserve more than a phone shot from the bleachers.
          </p>
          <Link href="/sports" className="btn">View the Work</Link>
        </div>
        <div className={styles.scrollHint}>
          <div className={styles.scrollLine} />
          <span className={styles.scrollLabel}>Scroll</span>
        </div>
      </section>

      {/* ── Pain Intro ───────────────────────────────────────── */}
      <section className={styles.painIntro}>
        <p>Most families end up with the same story: a milestone passes, the phone photos don't do it justice, and the moment is gone. That's what this is for — photography built for the seasons, people, and events that are actually worth documenting properly. It's also why schools and athletic programs across New Jersey partner with Zarcone Photography as their official media partner, not just their photographer — including full-season coverage as the official media partner of <Link href="/brhs-panther-football" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Bridgewater Raritan football</Link>, <Link href="/brhs-panther-wrestling" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Bridgewater Raritan wrestling</Link>, and <Link href="/brhs-panther-volleyball" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Bridgewater Raritan volleyball</Link> — and why families across the state turn to Zarcone as the <Link href="/sports-photographer-nj" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>sports photographer NJ</Link> teams trust for game-day coverage.</p>
      </section>

      {/* ── Disciplines ──────────────────────────────────────── */}
      <div className={styles.disciplines}>
        {DISCIPLINES.map(({ num, slug, title, desc, img }) => (
          <Link key={slug} href={`/${slug}`} className={styles.card}>
            <div className={styles.cardImg} style={{ backgroundImage: `url('${img}')` }} />
            <div className={styles.cardOverlay} />
            <div className={styles.cardContent}>
              <p className={styles.cardNum}>{num} &nbsp;/&nbsp; {title}</p>
              <h2 className={styles.cardTitle}>{title}</h2>
              <p className={styles.cardDesc}>{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Selected Work ────────────────────────────────────── */}
      <section className={styles.workSection}>
        <div className={styles.sectionHeader}>
          <span className="eyebrow">Selected Work</span>
          <h2 className={styles.sectionTitle}>Recent Images</h2>
          <span className="section-rule" />
          <Link href="/portraits" className={styles.sectionLink} aria-label="View all portrait photos">View All →</Link>
        </div>
        <div className={styles.workGrid}>
          {WORK_GRID.map((item, i) => (
            <div key={i} className={styles.workItem}>
              <img src={item.src} alt={item.alt} loading="lazy" decoding="async" className={styles.workImg} style={item.objPos ? { objectPosition: item.objPos } : undefined} />
            </div>
          ))}
        </div>
      </section>

      {/* ── About Preview ─────────────────────────────────────── */}
      <section className={styles.aboutStrip}>
        <div className={`${styles.aboutImgWrap} reveal`}>
          <div
            className={styles.aboutImg}
            style={{ backgroundImage: `url('/photos/tz-headshot.jpg')` }}
          />
          <span className={styles.aboutImgLabel}>Tom Zarcone</span>
        </div>
        <div className={`${styles.aboutText} reveal`}>
          <p className="eyebrow">About</p>
          <h2 className={styles.aboutH2}>These are the photos<br /><em>she'll still have at 40.</em></h2>
          <p className={styles.aboutP}>
            Thirty years of experience means you don't have to worry about direction, lighting, or whether you're going to like the results. You just show up. I take care of the rest.
          </p>
          <p className={styles.aboutP}>
            One of the only NJ studios offering sports photography, portraits, and graphic design under one roof — so your athlete can walk away with the action shots and the senior poster from the same session. Based in Bridgewater, NJ. Serving NJ, NYC, and Philadelphia.
          </p>
          <div className={styles.statRow}>
            <div><div className={styles.statNum}>30+</div><div className={styles.statLabel}>Years Experience</div></div>
            <div><div className={styles.statNum}>500+</div><div className={styles.statLabel}>Client Galleries</div></div>
            <div><div className={styles.statNum}>NJ · NYC · PHL</div><div className={styles.statLabel}>Coverage Area</div></div>
          </div>
          <Link href="/about" className="btn">Learn More</Link>
        </div>
      </section>

      {/* ── Video Reel ────────────────────────────────────────── */}
      <VideoReel />

      {/* ── Trust Strip ───────────────────────────────────────── */}
      <TrustStrip />

      {/* ── Google Rating + Press ─────────────────────────────── */}
      <div className={styles.googleBadge}>
        <a
          href="https://g.page/r/Ca6PJ5ScxSapEAI/review"
          target="_blank"
          rel="noreferrer"
          className={styles.googleBadgeLink}
        >
          <span className={styles.googleStars}>★★★★★</span>
          <span className={styles.googleRating}>4.9</span>
          <span className={styles.googleLabel}>on Google · 28 Reviews</span>
        </a>
        <span className={styles.badgeDivider} />
        <a
          href="https://patch.com/new-jersey/bridgewater/bridgewater-photographer-focuses-lens-local-student-athletes"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.googleBadgeLink}
        >
          <span className={styles.pressLabel}>As Featured In</span>
          <span className={styles.pressName}>Patch</span>
        </a>
      </div>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <Testimonials />

      {/* ── Newsletter Capture ────────────────────────────────── */}
      <NewsletterCapture />

      {/* ── Instagram Feed ────────────────────────────────────── */}
      <InstagramFeed />

      {/* ── Contact CTA ───────────────────────────────────────── */}
      <div className={styles.contactStrip}>
        <div className={styles.contactImg} />
        <div className={styles.contactBody}>
          <p className="eyebrow">Get In Touch</p>
          <h2 className={styles.contactH2}>Let's make something<br />worth keeping.</h2>
          <p className={styles.contactP}>
            You describe the moment you want captured. I'll handle everything else — location, timing, and a gallery turnaround built around the project: days for sports and portraits, a few weeks for full event coverage. Response guaranteed within 24 hours.
          </p>
          <Link href="/about#contact" className="btn btn-solid">Send a Message</Link>
          <div className={styles.contactMeta}>
            <a href="tel:9087770631">(908) 777-0631</a>
            <a href="https://instagram.com/zarconephotography" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://facebook.com/zarconephotography" target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>
      </div>
    </>
  );
}
