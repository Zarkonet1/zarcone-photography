'use client';

import Link from 'next/link';
import { EVENTS } from '@/lib/events';
import styles from './page.module.css';

// ─── ADD / EDIT STUDIO NOTES HERE ────────────────────────────────────────────
const NOTES = [
  // Example — uncomment and edit to add a note:
  // {
  //   title: 'BRHS Panther Wrestling Charity Match',
  //   date:  'March 2026',
  //   body:  'Proud to have donated photography coverage to the annual charity wrestling match benefiting ...',
  // },
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
          Pop-up sessions, partnerships, charity events, and announcements — here's where to find me next.
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

      {/* Studio Notes */}
      {NOTES.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span className="eyebrow">From the Studio</span>
            <span className={styles.rule} />
          </div>
          <div className={styles.noteGrid}>
            {NOTES.map((note, i) => (
              <div key={i} className={styles.noteCard}>
                <p className={styles.noteDate}>{note.date}</p>
                <h3 className={styles.noteTitle}>{note.title}</h3>
                <p className={styles.noteBody}>{note.body}</p>
              </div>
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
