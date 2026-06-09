'use client';

import Link from 'next/link';
import styles from './page.module.css';

// ─── ADD / EDIT EVENTS HERE ───────────────────────────────────────────────────
const EVENTS = [
  {
    title:       'Stars, Stripes & Tails',
    badge:       'Mini Sessions',
    date:        'July 4, 2026',
    location:    'The Pet Boutique · Bridgewater, NJ',
    description: 'Celebrate the 4th with a mini portrait session for you and your pet. Partnering with The Pet Boutique for a fun, patriotic shoot — indoor and outdoor setups, quick turnaround, and pre-payment handled through Calendly.',
    image:       '/photos/sst-ig-v2.jpg',
    link:        'https://bit.ly/4eiV0Su',
    linkLabel:   'Book Your Spot',
    status:      'upcoming',  // 'upcoming' or 'past'
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function NewsPage() {
  const upcoming = EVENTS.filter(e => e.status === 'upcoming');
  const past     = EVENTS.filter(e => e.status === 'past');

  return (
    <>
      {/* Hero */}
      <div className={styles.hero}>
        <p className="eyebrow">News &amp; Upcoming</p>
        <h1 className={styles.h1}>What's <em>coming up.</em></h1>
        <p className={styles.lead}>
          Pop-up sessions, partnerships, and announcements — here's where to find me next.
        </p>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span className="eyebrow">Upcoming</span>
            <span className={styles.rule} />
          </div>
          <div className={styles.list}>
            {upcoming.map((event, i) => (
              <EventCard key={i} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span className="eyebrow">Past Events</span>
            <span className={styles.rule} />
          </div>
          <div className={styles.list}>
            {past.map((event, i) => (
              <EventCard key={i} event={event} dim />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="cta-strip">
        <h2>Want to work together at an <em>upcoming event?</em></h2>
        <Link href="/about#contact" className="btn">Get In Touch</Link>
      </div>
    </>
  );
}

function EventCard({ event, dim }) {
  return (
    <div className={`${styles.card} ${dim ? styles.dim : ''}`}>
      <div
        className={styles.cardImg}
        style={{ backgroundImage: `url('${event.image}')` }}
      >
        {event.badge && <span className={styles.badge}>{event.badge}</span>}
        {event.status === 'past' && <span className={styles.pastBadge}>Past</span>}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.date}>{event.date}</span>
          <span className={styles.location}>{event.location}</span>
        </div>
        <h2 className={styles.title}>{event.title}</h2>
        <p className={styles.desc}>{event.description}</p>
        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noreferrer"
            className={`btn ${styles.cta}`}
          >
            {event.linkLabel || 'Learn More'}
          </a>
        )}
        {!event.link && event.status === 'upcoming' && (
          <p className={styles.soon}>Booking link coming soon</p>
        )}
      </div>
    </div>
  );
}
