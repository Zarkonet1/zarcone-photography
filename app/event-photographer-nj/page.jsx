import Link from 'next/link';
import PageHero from '@/components/PageHero';
import styles from '@/app/seo-page.module.css';

export const metadata = {
  title: 'Event Photographer — New Jersey | Zarcone Photography',
  description: 'Professional event photographer serving New Jersey — proms, corporate events, live music, galas, and celebrations. Based in Bridgewater, NJ. Fast delivery, unobtrusive coverage.',
  openGraph: {
    title: 'Event Photographer — New Jersey | Zarcone Photography',
    description: 'Event photographer based in Bridgewater, NJ. Proms, corporate events, live music, and milestone celebrations across New Jersey.',
    url: 'https://zarconephotography.com/event-photographer-nj',
    type: 'website',
  },
  alternates: {
    canonical: 'https://zarconephotography.com/event-photographer-nj',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Event Photography',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Zarcone Photography',
    url: 'https://zarconephotography.com',
    telephone: '(908) 777-0631',
    email: 'info@zarconephotography.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bridgewater',
      addressRegion: 'NJ',
      addressCountry: 'US',
    },
  },
  areaServed: { '@type': 'State', name: 'New Jersey' },
  description: 'Event photography for proms, corporate gatherings, live music, galas, and milestone celebrations across New Jersey. Unobtrusive documentary coverage with fast delivery.',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'USD',
    price: '400',
    description: 'Event photography coverage starting at $400',
  },
};

const EVENT_TYPES = [
  'Proms & Formals', 'Corporate Events', 'Live Music', 'Charity Galas',
  'Milestone Birthdays', 'Baptisms & Communions', 'Retirement Parties', 'Fundraisers',
];

const FEATURES = [
  {
    num: '01',
    title: 'Documentary Approach',
    body: 'The goal at any event is to be the least disruptive person in the room. I move quietly, work ambient and available light whenever possible, and don\'t stop the moment to manufacture it.',
  },
  {
    num: '02',
    title: 'Proms & School Events',
    body: 'Covering New Jersey proms and school-hosted events is a longstanding specialty. From the pre-event lineup to the last dance, I know the rhythm of these nights and where the photos live.',
  },
  {
    num: '03',
    title: 'Corporate Coverage',
    body: 'Company events, conferences, award ceremonies, and corporate galas require a different kind of attention — the right mix of candid and formal, delivered efficiently. Available throughout NJ and the New York Metro area.',
  },
  {
    num: '04',
    title: 'Live Music',
    body: 'Concerts and live performances demand fast glass and faster reflexes. Whether it\'s a small venue in Somerville or a large production, the equipment and experience are there.',
  },
  {
    num: '05',
    title: 'Private Celebrations',
    body: 'Milestone birthdays, milestone anniversaries, baptisms, communions — the events that matter most to families deserve photos that hold up for decades. Not snapshots. Real photographs.',
  },
  {
    num: '06',
    title: 'Fast, Private Delivery',
    body: 'Edited galleries are delivered to a private online gallery on the agreed schedule — sometimes within 48 hours for events that need quick turnaround. High-resolution files for download and print ordering.',
  },
];

const FAQ = [
  {
    q: 'What types of events do you photograph?',
    a: 'Proms, corporate events, live music performances, charity galas, milestone birthdays, baptisms and communions, retirement parties, and fundraisers are the most common. If you\'re planning an event and want it documented well, reach out — most events are within scope.',
  },
  {
    q: 'How far in advance should I book an event photographer?',
    a: 'For proms and large corporate events, 2–3 months in advance is ideal. Smaller gatherings can often be accommodated with less lead time. Saturdays in spring (prom season) and fall book early — don\'t wait if you have a date in mind.',
  },
  {
    q: 'What areas of New Jersey do you cover?',
    a: 'Based in Bridgewater and covering events throughout New Jersey — including Somerset, Morris, Union, Warren, Middlesex, Hunterdon, and Essex counties. Also available for events in New York City and the Philadelphia area.',
  },
  {
    q: 'Do you work with venues we\'ve already booked?',
    a: 'Yes — I\'m familiar with many venues throughout New Jersey and the surrounding region, and I\'m happy to work within any venue\'s photography guidelines. Send me the venue name and I\'ll come prepared.',
  },
  {
    q: 'Can you provide photos quickly for a corporate event?',
    a: 'Rush turnaround is available. For corporate clients who need images for press, internal communications, or social media within 24–48 hours, that can be accommodated — just mention it when you reach out.',
  },
  {
    q: 'Is videography available for events?',
    a: 'Videography add-ons are available for select events. Mention it when you inquire and we\'ll discuss what makes sense for your event\'s scope.',
  },
];

const PREVIEWS = [
  '/photos/i-q7LzKSb.jpg',
  '/photos/EVENT-Zarcone-Photography-201.jpg',
  '/photos/EVENT-Zarcone-Photography-65.jpg',
  '/photos/PORTRAIT-Zarcone-Photography-73.jpg',
];

export default function EventPhotographerNJ() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Event Photography · New Jersey"
        title="Event Photographer — New Jersey"
        description="Proms, corporate events, live music, and milestone celebrations. Based in Bridgewater, NJ — unobtrusive coverage, fast delivery, throughout New Jersey."
        imageSrc="/photos/i-q7LzKSb.jpg"
      />

      {/* Intro */}
      <section className={styles.intro}>
        <div className={styles.introLabel}>
          <h2 className={styles.introH2}>Every event<br />has a <em>story.</em></h2>
        </div>
        <div className={styles.introBody}>
          <p>The best event photography is invisible during the event and essential afterward. People should be able to look back at images from their night and feel it again — not see a photographer's hand in every frame.</p>
          <p>That means moving quietly through a room, working fast in low light, and knowing when to step back and let the moment breathe. It also means knowing when to direct — a quick group pull-together, a posed shot between key people — without stopping the event to do it.</p>
          <p><strong>Three decades of event coverage across New Jersey has taught me the shape of most events before I arrive.</strong> That preparation shows in the work.</p>
          <p>Available for events throughout New Jersey — from intimate private celebrations in Somerset County to large-scale corporate galas in the New York Metro area.</p>
        </div>
      </section>

      {/* Event types */}
      <div className={styles.locations}>
        <span className={styles.locationsLabel}>Events Covered</span>
        <p className={styles.locationsList}>
          {EVENT_TYPES.join('  ·  ')}
        </p>
      </div>

      {/* Why section */}
      <section className={styles.why}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionH2}>What you can <em>expect</em></h2>
          <span className="section-rule" />
        </div>
        <div className={styles.grid3}>
          {FEATURES.map(f => (
            <div key={f.num} className={styles.feature}>
              <p className={styles.featureNum}>{f.num}</p>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureBody}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Preview */}
      <section className={styles.preview}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionH2}>From recent <em>events</em></h2>
          <span className="section-rule" />
        </div>
        <div className={styles.previewGrid}>
          {PREVIEWS.map((src, i) => (
            <div key={i} className={styles.previewImg}>
              <img src={src} alt="Event photography — New Jersey" loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
        <Link href="/events" className={styles.previewLink}>View Full Events Gallery →</Link>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionH2}>Frequently asked <em>questions</em></h2>
          <span className="section-rule" />
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

      {/* CTA */}
      <div className="cta-strip">
        <div>
          <h2>Have an event coming up? <em>Let's talk.</em></h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '12px', maxWidth: '480px', lineHeight: '1.7' }}>
            Send me the details — event type, date, location, and approximate guest count — and I'll follow up within 24 hours.
          </p>
        </div>
        <Link href="/about#contact" className="btn btn-solid">Inquire Now →</Link>
      </div>
    </>
  );
}
