'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const TIERS = [
  {
    name: 'Standard',
    price: '$99',
    tag: 'Per Guest',
    includes: [
      'Portrait session (5–10 min)',
      'Complimentary headshot',
      '3 professionally edited images',
      'Private online gallery delivery',
    ],
    note: null,
    featured: false,
  },
  {
    name: 'Upgrade Collection',
    price: '$249',
    tag: 'Per Guest',
    includes: [
      'Portrait session (5–10 min)',
      'Complimentary headshot',
      '10 professionally edited images',
      'Enhanced retouching',
      '$50 print credit — wall art, desk prints & more',
      'Private online gallery delivery',
    ],
    note: 'Most popular upgrade',
    featured: true,
  },
];

const HOST_REWARDS = [
  { guests: '5 Guests',  reward: 'Complimentary portrait session + 3 edited images' },
  { guests: '8 Guests',  reward: 'Full portrait collection — 10 images + retouching' },
  { guests: '10+ Guests',reward: 'Complete Zarcone Photography portrait session — a $350+ value' },
];

const THEMES = [
  { title: 'Girls Night Out',           desc: 'Wine, portraits, and an evening worth remembering.' },
  { title: 'Book Club Portrait Night',  desc: 'Perfect for literary communities and reading groups.' },
  { title: 'Sip & Shoot',              desc: 'Social and relaxed — ideal for friend groups or wine nights.' },
  { title: 'Dark Academia',             desc: 'Moody, literary aesthetic. Strong visual identity.' },
  { title: 'Holiday Portrait Party',    desc: 'Fall or winter seasonal event — easy to make annual.' },
  { title: 'High Tea & Headshots',      desc: 'Elevated afternoon event for professionals.' },
];

const FLOW = [
  {
    num: '01',
    title: 'You Host a Great Evening',
    body: 'Your guest list. Your vibe. Your refreshments. A normal fun night with people you like — the kind of evening that would have happened with or without a photographer in the room.',
  },
  {
    num: '02',
    title: 'Everyone Gets a Few Minutes',
    body: 'Throughout the evening, each guest takes a quick turn in front of the camera — 5 to 10 minutes, right there in the room. Relaxed, low-key, no big production. Then straight back to the party.',
  },
  {
    num: '03',
    title: 'Photos Show Up a Few Days Later',
    body: 'Everyone gets a private gallery — and most are genuinely surprised by how good they look. That\'s the point. Leave with photos you\'re actually proud to post.',
  },
];

export default function PortraitPartiesPage() {
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

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <div className={styles.hero}>
        <div
          className={styles.heroImg}
          style={{ backgroundImage: "url('/photos/chloe-portrait.jpg')" }}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroText}>
          <p className="eyebrow">Zarcone Photography</p>
          <h1 className={styles.h1}>Portrait <em>Parties</em></h1>
          <p className={styles.lead}>Professional portraits woven into an evening worth having. You host. I handle everything else.</p>
          <a href="#book" className={`btn btn-solid ${styles.heroCta}`}>Inquire About a Party →</a>
        </div>
      </div>

      {/* ── Concept ────────────────────────────────────────── */}
      <section className={styles.concept}>
        <div className={styles.conceptInner}>
          <div className={styles.conceptLabel}>
            <p className="eyebrow">The Concept</p>
          </div>
          <div className={styles.conceptBody}>
            <h2 className={styles.conceptH2}>The event becomes<br />the <em>product.</em></h2>
            <p className={styles.conceptText}>
              A Portrait Party isn't a mini session. It isn't a photo booth. It's a premium social experience
              where your guests gather, enjoy the evening, and each leave with portraits they'll actually use —
              headshots, lifestyle images, social media portraits.
            </p>
            <p className={styles.conceptText}>
              The photography fits around the party, not the other way around.
            </p>
            <p className={styles.conceptQuote}>"We aren't the reason for the party. We just make it more memorable."</p>
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────── */}
      <section className={styles.flow}>
        <div className={styles.flowHeader}>
          <p className="eyebrow">How It Works</p>
          <h2 className={styles.flowH2}>Here's how it actually works</h2>
          <span className="section-rule" />
        </div>
        <div className={styles.flowGrid}>
          {FLOW.map(f => (
            <div key={f.num} className={styles.flowStep}>
              <p className={styles.flowNum}>{f.num}</p>
              <h3 className={styles.flowTitle}>{f.title}</h3>
              <p className={styles.flowBody}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────── */}
      <section className={styles.pricing} id="pricing">
        <div className={styles.pricingHeader}>
          <p className="eyebrow">Pricing</p>
          <h2 className={styles.pricingH2}>Every guest chooses<br />their <em>experience.</em></h2>
        </div>
        <div className={styles.pricingGrid}>
          {TIERS.map(t => (
            <div key={t.name} className={`${styles.tier} ${t.featured ? styles.tierFeatured : ''}`}>
              {t.note && <div className={styles.tierBadge}>{t.note}</div>}
              <div className={styles.tierHead}>
                <h3 className={styles.tierName}>{t.name}</h3>
                <div className={styles.tierPrice}>
                  <span className={styles.tierAmount}>{t.price}</span>
                  <span className={styles.tierTag}>{t.tag}</span>
                </div>
              </div>
              <div className={styles.tierRule} />
              <ul className={styles.tierIncludes}>
                {t.includes.map((item, i) => (
                  <li key={i} className={styles.tierItem}>
                    <span className={styles.tierDot} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className={styles.pricingNote}>Minimum 5 guests per event. Events typically run 2–3 hours.</p>
      </section>

      {/* ── Host Rewards ───────────────────────────────────── */}
      <section className={styles.hostSection}>
        <div className={styles.hostInner}>
          <div className={styles.hostLeft}>
            <p className="eyebrow">Host Rewards</p>
            <h2 className={styles.hostH2}>Host the party.<br /><em>Keep the portraits.</em></h2>
            <p className={styles.hostDesc}>
              As the host, your session is on us. The more guests you bring, the more you receive.
              Your job is to invite people you like — everything else is handled.
            </p>
          </div>
          <div className={styles.hostRight}>
            {HOST_REWARDS.map((r, i) => (
              <div key={i} className={styles.rewardRow}>
                <div className={styles.rewardGuests}>{r.guests}</div>
                <div className={styles.rewardArrow}>→</div>
                <div className={styles.rewardDesc}>{r.reward}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Themes ─────────────────────────────────────────── */}
      <section className={styles.themes}>
        <div className={styles.themesHeader}>
          <p className="eyebrow">Themes</p>
          <h2 className={styles.themesH2}>Every party has a <em>story.</em></h2>
        </div>
        <div className={styles.themesGrid}>
          {THEMES.map(t => (
            <div key={t.title} className={styles.themeCard}>
              <h3 className={styles.themeTitle}>{t.title}</h3>
              <p className={styles.themeDesc}>{t.desc}</p>
            </div>
          ))}
        </div>
        <p className={styles.themesNote}>Don't see your idea here? Bring it. The best parties are the ones that feel personal.</p>
      </section>

      {/* ── Venues ─────────────────────────────────────────── */}
      <section className={styles.venues}>
        <div className={styles.venuesInner}>
          <div className={styles.venueCol}>
            <p className="eyebrow">At Your Home</p>
            <h3 className={styles.venueTitle}>Your space,<br />your guests.</h3>
            <p className={styles.venueBody}>
              The most personal format. You provide the space and the guest list —
              I bring a complete mobile studio setup: professional lighting, backdrop, and everything needed
              for polished portraits in your living room.
            </p>
          </div>
          <div className={styles.venueDivider} />
          <div className={styles.venueCol}>
            <p className="eyebrow">Partner Venues</p>
            <h3 className={styles.venueTitle}>Bookstores, boutiques,<br />and beyond.</h3>
            <p className={styles.venueBody}>
              Portrait Parties work beautifully in partnership with local businesses — bookstores,
              wine bars, salons, boutiques, and community spaces. If you have a venue in mind, let's talk.
            </p>
          </div>
        </div>
      </section>

      {/* ── Book ───────────────────────────────────────────── */}
      <section className={styles.bookSection} id="book">
        <div className={styles.bookInner}>
          <div className={styles.bookLeft}>
            <p className="eyebrow">Get In Touch</p>
            <h2 className={styles.bookH2}>Ready to host<br />something <em>worth keeping?</em></h2>
            <p className={styles.bookDesc}>
              Tell me about your group — the size, the vibe, and what kind of evening you have in mind.
              I'll get back to you within 24 hours with availability and next steps.
            </p>
            <div className={styles.bookDetails}>
              <p className={styles.bookDetail}><strong>Minimum:</strong> 5 guests</p>
              <p className={styles.bookDetail}><strong>Duration:</strong> 2–3 hours</p>
              <p className={styles.bookDetail}><strong>Location:</strong> Your home or a partner venue</p>
              <p className={styles.bookDetail}><strong>Service area:</strong> NJ · NYC · Philadelphia</p>
            </div>
          </div>
          <div className={styles.bookRight}>
            {/* HoneyBook Portrait Party lead form */}
            <div className="hb-p-5f380abc6556542c7717ad80-6" />
            <img height="1" width="1" style={{ display: 'none' }} src="https://www.honeybook.com/p.png?pid=5f380abc6556542c7717ad80" alt="" />
          </div>
        </div>
      </section>
    </>
  );
}
