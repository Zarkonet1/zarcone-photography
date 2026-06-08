'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

const sm = (id, hash) => `https://photos.smugmug.com/photos/${id}/0/${hash}/XL/${id}-XL.jpg`;

// Real SmugMug photos
const SM = {
  footballTeam:    sm('i-s7zBdzk','KJ5D24NzNT4NNP8B7PK33Wb3XrZqpbxxNjhchx7tW'),
  footballCatch:   sm('i-HkmJPk8','LGPB3Mm22vMVCp6qD8g3DbxWL8BhdTfJJSDRK6rqh'),
  wrestlingStates: sm('i-Lv2PXKm','Km8qgRtmpGqNCM3qd369qMLkjgQGgbfDVPsbwsNwh'),
  wrestlingThrow:  sm('i-dkcFTnj','KtfSs8mzbdf5khV9ZzQbLSHRCXFKh9LrvSCCnrggd'),
  wrestlingGrapple:sm('i-wBrCNrq','L5wpZjwGwZRK3hjkQ5rjnFMRfx8P22tQqgVJmQTZD'),
  portrait:        sm('i-rvRX82g','MJzr4MQDSkdG6K45b5RNpvHFgPwCtGRsDbv4wdHKm'),
  barnSwallows:    'https://photos.smugmug.com/Beneath-the-Barn-Swallows-2/i-q7LzKSb/0/NdJQsVfjpscZGKBPc72XtsSxxWkhmb3K6NW5GhW8P/XL/Zarcone%20Photography-2-Final-sharpen-XL.jpg',
  designPoster:    sm('i-hdjLNfF','KrP5DD9cF983RPDmp33B3xngwdk27GZXLC2gpLbvH'),
  lacrosse:        sm('i-TSHFjz3','KZMCdHKVVchnrbNwJHLhVCRDHfLCs79zvpDtR8rnn'),
  portrait2:       sm('i-4mMh8Gp','KWRFxQtqFCNLDPBZWLSwKnLLSHpQB9bxWgFH6w3nW'),
};

const DISCIPLINES = [
  {
    num: '01',
    slug: 'sports',
    title: 'Sports',
    desc: 'Football. Wrestling. The moments athletes and families remember for life — captured with the speed and precision each one demands.',
    img: SM.footballTeam,
  },
  {
    num: '02',
    slug: 'portraits',
    title: 'Portraits',
    desc: 'Seniors, individuals, and headshots. Sessions designed to reveal character, not just a smile.',
    img: SM.portrait,
  },
  {
    num: '03',
    slug: 'events',
    title: 'Events',
    desc: 'Music, milestones, and celebrations documented with authenticity and intention.',
    img: SM.barnSwallows,
  },
  {
    num: '04',
    slug: 'design',
    title: 'Design',
    desc: 'Senior poster composites, sports graphics, and branded imagery. Photography meets design.',
    img: SM.designPoster,
  },
];

const WORK_GRID = [
  { src: SM.footballCatch,    tall: true },
  { src: SM.wrestlingStates },
  { src: SM.portrait2 },
  { src: SM.barnSwallows,     tall: true },
  { src: SM.lacrosse },
  { src: SM.designPoster },
];

export default function Home() {
  const heroRef = useRef(null);

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
        <div
          className={styles.heroImg}
          style={{ backgroundImage: `url('${SM.footballTeam}')` }}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={`eyebrow ${styles.heroEyebrow}`}>
            Somerville, NJ &nbsp;·&nbsp; Sports · Portraits · Events · Design
          </p>
          <h1 className={styles.heroTitle}>
            The moments<br />athletes <em>remember.</em>
          </h1>
          <p className={styles.heroSub}>
            High school sports, senior portraits, events, and design — photographed with the precision that makes images worth keeping for life.
          </p>
          <Link href="/sports" className="btn">View the Work</Link>
        </div>
        <div className={styles.scrollHint}>
          <div className={styles.scrollLine} />
          <span className={styles.scrollLabel}>Scroll</span>
        </div>
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
          <Link href="/portraits" className={styles.sectionLink}>View All →</Link>
        </div>
        <div className={styles.workGrid}>
          {WORK_GRID.map((item, i) => (
            <div key={i} className={`${styles.workItem} ${item.tall ? styles.tall : ''}`}>
              <div className={styles.workImg} style={{ backgroundImage: `url('${item.src}')` }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── About Preview ─────────────────────────────────────── */}
      <section className={styles.aboutStrip}>
        <div className={`${styles.aboutImgWrap} reveal`}>
          <div
            className={styles.aboutImg}
            style={{ backgroundImage: `url('${SM.wrestlingThrow}')` }}
          />
          <span className={styles.aboutImgLabel}>Tom Zarcone</span>
        </div>
        <div className={`${styles.aboutText} reveal`}>
          <p className="eyebrow">About</p>
          <h2 className={styles.aboutH2}>Photography is about<br /><em>being present.</em></h2>
          <p className={styles.aboutP}>
            I've spent over three decades with a camera, learning that the best images aren't made — they're discovered. Whether I'm trackside at a sports event or in a quiet studio session, my approach is the same: slow down, observe, and wait for the real moment.
          </p>
          <p className={styles.aboutP}>
            Based in Somerville, NJ — serving New Jersey, New York City, and Philadelphia.
          </p>
          <div className={styles.statRow}>
            <div><div className={styles.statNum}>30+</div><div className={styles.statLabel}>Years Experience</div></div>
            <div><div className={styles.statNum}>NJ · NYC · PHL</div><div className={styles.statLabel}>Coverage Area</div></div>
          </div>
          <Link href="/about" className="btn">Learn More</Link>
        </div>
      </section>

      {/* ── Testimonial ───────────────────────────────────────── */}
      <div className={styles.testimonial}>
        <blockquote className={styles.quote}>
          "Tom has a gift for making you forget the camera is there. The images he captured felt completely natural — like he'd somehow frozen our real life."
        </blockquote>
        <cite className={styles.cite}>— Sarah &amp; Michael R. &nbsp;·&nbsp; Portrait Session</cite>
      </div>

      {/* ── Contact CTA ───────────────────────────────────────── */}
      <div className={styles.contactStrip}>
        <div className={styles.contactImg} />
        <div className={styles.contactBody}>
          <p className="eyebrow">Get In Touch</p>
          <h2 className={styles.contactH2}>Let's make something<br />worth keeping.</h2>
          <p className={styles.contactP}>
            Every project starts with a conversation. Tell me what you're working on and I'll get back to you within 24 hours.
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
