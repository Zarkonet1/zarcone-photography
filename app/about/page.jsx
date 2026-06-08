'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const APPROACH = [
  {
    num: '01',
    title: 'Listen First',
    body: 'Every shoot starts with understanding what you actually need — not just the deliverables, but the feeling. What matters about this moment? Who needs to be seen?',
  },
  {
    num: '02',
    title: 'Disappear Into the Room',
    body: 'The best version of me on a shoot is one you barely notice. I move quietly, anticipate beats, and avoid the stiffness that comes from over-directing.',
  },
  {
    num: '03',
    title: 'Edit with Restraint',
    body: 'Post-processing should serve the image, not overpower it. My edits are clean, consistent, and built to age well — no heavy-handed filters, no trendy looks.',
  },
];

const GEAR = [
  { name: 'Canon EOS R5',        type: 'Primary Body'     },
  { name: 'Canon EOS R6 Mark II', type: 'Secondary Body'  },
  { name: 'RF 24–70mm f/2.8L',   type: 'Workhorse Zoom'  },
  { name: 'RF 70–200mm f/2.8L',  type: 'Sports / Events' },
  { name: 'RF 85mm f/1.2L',      type: 'Portraits'       },
  { name: 'Profoto B10 Plus',     type: 'Studio Lighting' },
];

const TESTIMONIALS = [
  {
    text: 'Tom has a gift for making you forget the camera is there. The images he captured felt completely natural — like he\'d somehow frozen our real life, not a performance of it.',
    name: 'Sarah & Michael R.',
    project: 'Portrait Session',
  },
  {
    text: 'We hired Tom to cover our youth football league for the season. The action shots were incredible — he understood the sport, knew where to be, and delivered images the kids and families absolutely loved.',
    name: 'Coach D. Williams',
    project: 'Youth Football',
  },
  {
    text: 'Our annual gala has never been so well documented. Tom blended into the event seamlessly and the images captured the energy of the evening perfectly.',
    name: 'Jennifer M.',
    project: 'Corporate Gala',
  },
];

export default function AboutPage() {
  const parallaxRef = useRef(null);

  // Load HoneyBook widget
  useEffect(() => {
    window._HB_ = window._HB_ || {};
    window._HB_.pid = '5f380abc6556542c7717ad80';
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://widget.honeybook.com/assets_users_production/websiteplacements/placement-controller.min.js';
    document.head.appendChild(s);
  }, []);

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
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Parallax
  useEffect(() => {
    const el = parallaxRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onScroll = () => {
      const rect = el.parentElement.getBoundingClientRect();
      const pct = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      el.style.transform = `translateY(${(pct - 0.5) * -60}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <div className={styles.hero}>
        <div
          className={styles.heroImg}
          style={{ backgroundImage: "url('/photos/tom-portrait.jpg')" }}
        />
        <div className={styles.heroText}>
          <p className="eyebrow">About Tom Zarcone</p>
          <h1 className={styles.h1}>Three decades behind<br />the <em>lens.</em></h1>
          <p className={styles.lead}>What's stayed constant through every format change and every gear upgrade is the same thing that drew me to photography in the first place — the moment just before everything changes.</p>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────── */}
      <div className={styles.statsBar}>
        {[
          { num: '30+', label: 'Years Experience' },
          { num: '4',   label: 'Disciplines' },
          { num: 'NJ',  label: 'Based in Somerville' },
          { num: 'NYC · PHL', label: 'Service Area' },
        ].map(s => (
          <div key={s.label} className={`${styles.statCell} reveal`}>
            <div className={styles.statNum}>{s.num}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Story ──────────────────────────────────────────── */}
      <section className={styles.story}>
        <div className={styles.storyLabel}>
          <h2 className={styles.storyH2}>The<br /><em>story</em></h2>
        </div>
        <div className={`${styles.storyBody} reveal`}>
          <p>Photography found me early. What started as curiosity turned into craft, and craft turned into a career that has taken me trackside at youth championships, into quiet studio sessions, and across ballrooms full of people celebrating the biggest moments of their lives.</p>
          <p><strong>I photograph three things: people, athletes, and events.</strong> They sound different, but they share the same core challenge — something true is happening in front of you, and you have a fraction of a second to decide if you're ready for it.</p>
          <p>Over 30 years, I've learned that the best images don't come from controlling the situation. They come from understanding it — knowing where to stand, when to wait, and when to move.</p>
          <p>I'm based in Somerville, NJ and work regularly throughout New Jersey, New York City, and the Philadelphia area.</p>
        </div>
      </section>

      {/* ── Pullquote ──────────────────────────────────────── */}
      <div className={styles.imgBreak}>
        <div
          className={styles.imgBreakInner}
          ref={parallaxRef}
          style={{ backgroundImage: "url('/photos/tom-portrait.jpg')" }}
        />
        <div className={styles.imgBreakOverlay}>
          <p className={`${styles.blockQuote} reveal`}>
            "The best photographs don't show you what happened —<br />they show you how it <em>felt.</em>"
          </p>
        </div>
      </div>

      {/* ── Approach ───────────────────────────────────────── */}
      <section className={styles.approach}>
        <div className={`${styles.approachHeader} reveal`}>
          <h2 className={styles.approachH2}>How I Work</h2>
          <span className="section-rule" />
        </div>
        <div className={styles.approachGrid}>
          {APPROACH.map(a => (
            <div key={a.num} className={`${styles.approachCard} reveal`}>
              <p className={styles.cardNum}>{a.num}</p>
              <h3 className={styles.cardTitle}>{a.title}</h3>
              <p className={styles.cardBody}>{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gear ───────────────────────────────────────────── */}
      <section className={styles.gearSection}>
        <div className="reveal">
          <h2 className={styles.gearH2}>The <em>gear.</em></h2>
          <p className={styles.gearDesc}>Professional Canon equipment capable of delivering in any light or pace — because reliability should never be a question on a shoot.</p>
        </div>
        <div className={`${styles.gearList} reveal`}>
          {GEAR.map(g => (
            <div key={g.name} className={styles.gearItem}>
              <span className={styles.gearName}>{g.name}</span>
              <span className={styles.gearType}>{g.type}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────── */}
      <section className={styles.testimonials}>
        <div className={`${styles.testimonialsHeader} reveal`}>
          <h2 className={styles.testimonialsH2}>What Clients Say</h2>
          <span className="section-rule" />
        </div>
        <div className={styles.testimonialsGrid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`${styles.tCard} reveal`}>
              <div className={styles.tMark}>"</div>
              <p className={styles.tText}>{t.text}</p>
              <div className={styles.tRule} />
              <p className={styles.tName}>{t.name} &nbsp;·&nbsp; {t.project}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact Form ───────────────────────────────────── */}
      <div className={styles.contactSection} id="contact">
        <div className={styles.contactImgSide}>
          <div
            className={styles.contactImg}
            style={{ backgroundImage: "url('/photos/tom-portrait.jpg')" }}
          />
          <div className={styles.contactImgText}>
            <p className="eyebrow">Based in Somerville, NJ</p>
            <h3 className={styles.contactImgH3}>Serving New Jersey,<br />New York City &amp; Philadelphia</h3>
          </div>
        </div>

        <div className={styles.contactFormSide}>
          <p className="eyebrow" style={{ marginBottom: '20px' }}>Get In Touch</p>
          <h2 className={styles.contactH2}>Let's make something<br /><em>worth keeping.</em></h2>
          {/* HoneyBook lead form */}
          <div className="hb-p-5f380abc6556542c7717ad80-4" />
          <img height="1" width="1" style={{ display: 'none' }} src="https://www.honeybook.com/p.png?pid=5f380abc6556542c7717ad80" alt="" />
        </div>
      </div>
    </>
  );
}
