'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lightbox from '@/components/Lightbox';
import Testimonials from '@/components/Testimonials';
import styles from './page.module.css';

const GALLERY_URL = 'https://galleries.zarconephotography.com';

const CATEGORIES = ['All', 'Game Action', 'Sidelines', 'Team', 'Media Day', 'Senior Night', 'Championship Moments', 'Behind the Scenes'];

const PHOTOS = [
  { src: '/photos/i-s7zBdzk.jpg', width: 2400, height: 1600, category: 'Game Action', size: 'wide' },
  { src: '/photos/SPORTS-FB100.jpg', width: 1600, height: 1066, category: 'Game Action' },
  { src: '/photos/SPORTS-Zarcone-Photography-45.jpg', width: 1600, height: 1066, category: 'Game Action' },
  { src: '/photos/i-Lv2PXKm.jpg', width: 2400, height: 1600, category: 'Game Action', size: 'wide' },
  { src: '/photos/SPORTS-Zarcone-Photography-0136-2.jpg', width: 1600, height: 1066, category: 'Sidelines' },
  { src: '/photos/SPORTS-DSC_5128-1.jpg', width: 1600, height: 1059, category: 'Sidelines' },
  { src: '/photos/DESIGN-PanthersElite18U-Team-Poster.jpg', width: 2400, height: 1200, category: 'Team', size: 'wide' },
  { src: '/photos/EVENT-Zarcone-Photography-0008.jpg', width: 1600, height: 1066, category: 'Behind the Scenes' },
  { src: '/photos/i-q7LzKSb.jpg', width: 2400, height: 1599, category: 'Behind the Scenes', size: 'wide' },
  { src: '/photos/EVENT-Zarcone-Photography-047.jpg', width: 1600, height: 1065, category: 'Behind the Scenes' },
  { src: '/photos/EVENT-Zarcone-Photography-11.jpg', width: 1600, height: 1066, category: 'Behind the Scenes' },
  { src: '/photos/SPORTS-Zarcone-Photography-0007.jpg', width: 1599, height: 1280, category: 'Championship Moments' },
  { src: '/photos/SPORTS-Zarcone-Photography-0431.jpg', width: 1600, height: 1280, category: 'Championship Moments' },
  { src: '/photos/DESIGN-SENIOR-PANO.jpg', width: 2400, height: 800, category: 'Senior Night', size: 'wide' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0002.jpg', width: 1599, height: 1280, category: 'Media Day' },
];

const CAROUSEL = [
  { src: '/photos/i-s7zBdzk.jpg', width: 2400, height: 1600, caption: 'Friday Night Lights' },
  { src: '/photos/i-Lv2PXKm.jpg', width: 2400, height: 1600, caption: 'Every Snap Tells A Story' },
  { src: '/photos/SPORTS-Zarcone-Photography-45.jpg', width: 1600, height: 1066, caption: 'Game Day, Every Week' },
  { src: '/photos/DESIGN-SENIOR-PANO.jpg', width: 2400, height: 800, caption: 'Senior Night, Done Right' },
  { src: '/photos/PORTRAIT-Zarcone-Photography-0002.jpg', width: 1599, height: 1280, caption: 'Media Day — July 29' },
];

const FAQ = [
  {
    q: 'Where do I order photos?',
    a: <>Every image from Panther Football coverage is delivered to a private online gallery through <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer">Pic-Time</a>, where you can view, download, and order prints directly.</>,
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

const SERVICES = [
  { title: 'Game Day Coverage', body: 'Full home-game photography — action, sidelines, celebrations, and crowd.' },
  { title: 'Media Day Portraits', body: 'Individual and team portraits, graphics-ready and recruiting-ready.' },
  { title: 'Senior Night & Banners', body: 'Dedicated coverage and a custom poster design for every senior.' },
  { title: 'Social & Schedule Graphics', body: 'Branded graphics built for the program\'s social channels.' },
  { title: 'Recruiting Content', body: 'Imagery built to represent athletes well to college programs.' },
  { title: 'Private Sessions', body: 'Individual senior portraits, family sessions, and headshots by request.' },
];

export default function BRHSPantherFootballPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lbIndex, setLbIndex] = useState(null);
  const [slide, setSlide] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', athleteName: '', sport: 'Football', interestedIn: 'Prints', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % CAROUSEL.length), 5000);
    return () => clearInterval(t);
  }, []);

  const filtered = activeCategory === 'All' ? PHOTOS : PHOTOS.filter(p => p.category === activeCategory);

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
          <h1 className={styles.heroTitle}>Official Media Partner of<br /><span>Bridgewater-Raritan Panther Football</span></h1>
          <p className={styles.heroSub}>Capturing Every Season. Every Athlete. Every Story.</p>
          <div className={styles.heroCtas}>
            <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnRed}>View This Season's Galleries</a>
            <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnSilver}>Order Photos</a>
            <a href="#inquire" className={styles.btnGhost}>Book Zarcone Photography</a>
          </div>
        </div>
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
            This builds on a longer history with Bridgewater athletics, including an ongoing partnership with BRHS Wrestling's social media
            and game coverage. The goal is the same across every program: professional photography, real storytelling, and a visual record
            worth keeping — not just a highlight reel.
          </p>
          <p>
            Beyond the field, that commitment shows up in the community too — from sponsoring local charity events to showing up consistently,
            season after season, for the programs that trust us with their story.
          </p>
          <div className={styles.partnershipStats}>
            <div><div className={styles.statNum}>30+</div><div className={styles.statLabel}>Years Experience</div></div>
            <div><div className={styles.statNum}>2026</div><div className={styles.statLabel}>Season Partner</div></div>
            <div><div className={styles.statNum}>Jul 29</div><div className={styles.statLabel}>Media Day</div></div>
          </div>
          <Link href="/blog/brhs-panther-football-2026-media-partnership" className={styles.partnershipLink}>Read the Full Partnership Announcement →</Link>
        </div>
      </section>

      {/* ── Gallery Preview ─────────────────────────────────────── */}
      <section className={styles.gallery}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrowRed}>From The Sidelines</span>
            <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>2026 Season <em>Gallery</em></h2>
          </div>
          <p className={styles.sectionSub}>Game action, sidelines, Senior Night, Media Day, and championship moments — organized and ready to browse.</p>
        </div>

        <div className={styles.noticeBar}>
          <span className={styles.noticeDot} />
          Season galleries update live throughout 2026 — Media Day coverage begins July 29. Images below preview the categories your season gallery will include.
        </div>

        <div className={styles.filterBar}>
          {CATEGORIES.map(cat => (
            <button key={cat} className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.masonry}>
          {filtered.map((photo, i) => (
            <div key={i} className={styles.tile} onClick={() => setLbIndex(i)}>
              <Image
                src={photo.src}
                alt={`${photo.category} — Zarcone Photography, New Jersey`}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw"
                style={{ width: '100%', height: 'auto' }}
              />
              <div className={styles.tileLabel}>{photo.category}</div>
            </div>
          ))}
        </div>

        <div className={styles.galleryFooter}>
          <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnRed}>View Full Galleries</a>
        </div>

        {lbIndex !== null && (
          <Lightbox
            images={filtered.map(p => ({ src: p.src, alt: `${p.category} — Zarcone Photography, New Jersey` }))}
            currentIndex={lbIndex}
            onClose={() => setLbIndex(null)}
            onPrev={() => setLbIndex((lbIndex - 1 + filtered.length) % filtered.length)}
            onNext={() => setLbIndex((lbIndex + 1) % filtered.length)}
          />
        )}
      </section>

      {/* ── Media Day ────────────────────────────────────────────── */}
      <div className={styles.featureRow}>
        <div className={styles.featureMedia}>
          <Image src="/photos/PORTRAIT-Zarcone-Photography-0002.jpg" alt="Media Day portrait coverage" fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'cover', filter: 'brightness(0.8)' }} />
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
          <div>
            <div className={styles.sampleStrip}>
              <Image src="/photos/DESIGN-Kayla_FinalWeb.jpg" alt="Sample senior poster design" width={1800} height={2400} style={{ height: 140, width: 'auto' }} />
              <Image src="/photos/DESIGN-LeapPoster.jpg" alt="Sample poster design" width={1920} height={2400} style={{ height: 140, width: 'auto' }} />
              <Image src="/photos/DESIGN-SENIOR-PANO.jpg" alt="Sample panorama composite design" width={2400} height={800} style={{ height: 140, width: 'auto' }} />
            </div>
            <p className={styles.sampleCaption}>Sample design work from previous seasons — 2026 Panther Football Media Day graphics arrive July 29.</p>
          </div>
          <div style={{ marginTop: 28 }}>
            <a href="#inquire" className={styles.btnRed}>Book Media Day</a>
          </div>
        </div>
      </div>

      {/* ── Senior Experience ────────────────────────────────────── */}
      <div className={`${styles.featureRow} ${styles.reverse}`}>
        <div className={styles.featureMedia}>
          <Image src="/photos/DESIGN-SENIOR-PANO.jpg" alt="Senior Night composite" fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'cover', filter: 'brightness(0.8)' }} />
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
            <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnRed}>View Game Galleries</a>
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
          <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer" className={styles.btnRed}>View Galleries</a>
          <a href="#inquire" className={styles.btnSilver}>Book Photography</a>
          <Link href="/about#contact" className={styles.btnGhost}>Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
