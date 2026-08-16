import Link from 'next/link';
import PageHero from '@/components/PageHero';
import styles from '@/app/seo-page.module.css';

export const metadata = {
  title: 'Schools & Athletic Programs NJ | Zarcone Photography',
  description: 'Dedicated media partnerships for NJ high schools and athletic departments — season-long coverage, Media Day, and licensing.',
  openGraph: {
    title: 'Schools & Athletic Programs — Zarcone Photography',
    description: 'Season-long media partnerships for NJ athletic programs. Game coverage, team portraits, Senior Night, and recruiting-ready imagery.',
    url: 'https://www.zarconephotography.com/schools-athletic-programs-nj',
    type: 'website',
    images: [
      {
        url: 'https://www.zarconephotography.com/photos/i-s7zBdzk.jpg',
        width: 1200,
        height: 800,
        alt: 'Athletic program photography — Zarcone Photography, New Jersey',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://www.zarconephotography.com/photos/i-s7zBdzk.jpg'],
  },
  alternates: {
    canonical: 'https://www.zarconephotography.com/schools-athletic-programs-nj',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Athletic Program Media Partnerships',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Zarcone Photography',
    url: 'https://www.zarconephotography.com',
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
  audience: {
    '@type': 'Audience',
    audienceType: 'Athletic Directors, Coaches, Booster Clubs, School Administrators',
  },
  description: 'Season-long photography and media partnerships for high school and youth athletic programs — game coverage, Media Day portraits, Senior Night, and organizational licensing for promotional use.',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'USD',
    priceSpecification: {
      '@type': 'PriceSpecification',
      minPrice: '2500',
      maxPrice: '10000',
      priceCurrency: 'USD',
    },
    description: 'Season media partnerships typically range from $2,500 to $10,000, depending on scope, sport, and deliverables.',
  },
};

const FEATURES = [
  {
    num: '01',
    title: 'Season-Long Game Coverage',
    body: 'Every home game, shot the way a photojournalist works a sideline — moving continuously, staying out of the way, never missing the play that mattered. Delivered within days, not weeks.',
  },
  {
    num: '02',
    title: 'Media Day & Team Portraits',
    body: 'Clean, professional individual and team portraits before the season starts — the kind that end up on banners, in programs, on weight room walls, and in recruiting profiles.',
  },
  {
    num: '03',
    title: 'Senior Night, Done Right',
    body: 'A dedicated shoot and a custom commemorative poster design for every graduating senior — coordinated directly with the program, no extra lift on your end.',
  },
  {
    num: '04',
    title: 'Organizational Licensing',
    body: 'Schools, athletic departments, and booster clubs get a license built for promotional use — website, social, print, and recruiting materials — without per-image negotiation.',
  },
  {
    num: '05',
    title: 'Recruiting-Ready Imagery',
    body: 'Recruiting starts earlier than it used to. Athletes and coaches get images built to represent the program well — to colleges, to the community, and to future recruits.',
  },
  {
    num: '06',
    title: 'Parent Ordering, Handled',
    body: 'Every family gets access to a private gallery with individual ordering — prints, downloads, and products — so the athletic department isn\'t fielding photo requests all season.',
  },
];

const FAQ = [
  {
    q: 'What does a season media partnership include?',
    a: 'Media Day and team/individual portraits, full home-game coverage across the regular season, Senior Night coverage with a custom poster design for every senior, and postseason coverage if the team advances. Scope is built around your program\'s schedule and needs.',
  },
  {
    q: 'How is this different from booking single-game coverage?',
    a: 'A season partnership means consistent coverage, a single point of contact, and an organizational license — rather than negotiating usage rights and scheduling one event at a time. It also typically costs less per game than one-off bookings.',
  },
  {
    q: 'Can our booster club or athletic department use the photos for promotional purposes?',
    a: 'Yes — that\'s exactly what the organizational license is for. It covers website use, social media, printed programs, banners, and recruiting materials. Rates are reasonable and scoped to how your program plans to use the images.',
  },
  {
    q: 'Do you carry insurance for sideline and venue access?',
    a: 'Yes. Zarcone Photography carries professional liability and equipment insurance, and certificates of insurance are available on request for venues and school districts that require them.',
  },
  {
    q: 'How do parents and families get their photos?',
    a: 'Every family receives access to a private online gallery for their athlete, with download and print ordering built in. The athletic department isn\'t the point of contact for individual photo requests.',
  },
  {
    q: 'Can this cover multiple sports or just one team?',
    a: 'Both. Some partnerships cover a single program for a season, others cover multiple sports across a school year. Multi-sport and multi-year rates are available.',
  },
  {
    q: 'How far in advance should our program reach out?',
    a: 'Ideally before the season starts, so Media Day and portrait scheduling can be locked in early. That said, mid-season partnerships and single-event bookings are also possible — reach out and we\'ll work with your timeline.',
  },
];

const PREVIEWS = [
  '/photos/i-s7zBdzk.jpg',
  '/photos/DESIGN-PanthersElite18U-Team-Poster.jpg',
  '/photos/i-Lv2PXKm.jpg',
  '/photos/i-HkmJPk8.jpg',
];

export default function SchoolsAthleticProgramsNJ() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="For Athletic Directors, Coaches & Booster Clubs"
        title="Schools & Athletic Programs"
        description="A dedicated media partner for your program's season — game coverage, team portraits, Senior Night, and imagery built to represent your athletes well. Based in Bridgewater, NJ, serving programs across the state."
        imageSrc="/photos/i-s7zBdzk.jpg"
      />

      {/* Case Study */}
      <div className={styles.caseStudy}>
        <span className={styles.caseStudyLabel}>Case Study</span>
        <p className={styles.caseStudyText}>
          See how this works: Zarcone Photography is the official media partner and a Gold Level Sponsor of <Link href="/brhs-panther-football">BRHS Panther Football</Link> for the 2026 season — full season coverage, Media Day portraits, and Senior Night posters. <Link href="/brhs-panther-football">View the partnership hub →</Link>
        </p>
      </div>

      {/* Intro */}
      <section className={styles.intro}>
        <div className={styles.introLabel}>
          <h2 className={styles.introH2}>A program that documents<br />itself <em>takes itself seriously.</em></h2>
        </div>
        <div className={styles.introBody}>
          <p>Most athletic programs handle photography the same way: a parent volunteer with a phone, or a photographer booked one game at a time. Neither produces the consistent, professional imagery a program needs for recruiting, promotion, and the record of the season itself.</p>
          <p><strong>Recruiting starts earlier than it ever has.</strong> The images a player sends a college program — or that your program uses to represent itself to the community — carry real weight. Game day photography done right isn't a nice-to-have. It's part of how a program communicates its identity.</p>
          <p>Zarcone Photography works directly with athletic directors, coaches, and booster clubs to build season-long partnerships: one point of contact, consistent coverage, and a licensing structure built for how schools actually use images.</p>
          <p>Two examples of what this looks like in practice: Zarcone Photography is currently the official media partner and a Gold Level Sponsor of BRHS Panther Football for the 2026 season — full season coverage, Media Day portraits, and Senior Night posters. Details in the <Link href="/blog/brhs-panther-football-2026-media-partnership">partnership announcement</Link>, or visit the <Link href="/brhs-panther-football">Panther Football season hub</Link> for galleries and ordering. Zarcone Photography is also the official photography and social media graphics partner of <Link href="/brhs-panther-wrestling">BRHS Panther Wrestling</Link> for 2026-27, coming off the program's first-ever back-to-back sectional championship. Every program's needs are different, and a partnership with your team would be scoped around your season, not a copy of someone else's.</p>
        </div>
      </section>

      {/* What's included */}
      <section className={styles.why}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionH2}>What a partnership <em>includes</em></h2>
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

      {/* Investment */}
      <div className={styles.locations}>
        <span className={styles.locationsLabel}>Investment</span>
        <p className={styles.locationsList}>
          Season media partnerships typically range from <strong style={{ color: 'var(--text)' }}>$2,500 to $10,000</strong>, depending on sport, season length, and deliverables. Reach out with your program's details for a custom quote.
        </p>
      </div>

      {/* Gallery Preview */}
      <section className={styles.preview}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionH2}>From the <em>sidelines</em></h2>
          <span className="section-rule" />
        </div>
        <div className={styles.previewGrid}>
          {PREVIEWS.map((src, i) => (
            <div key={i} className={styles.previewImg}>
              <img src={src} alt="Athletic program photography — New Jersey" loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
        <Link href="/sports" className={styles.previewLink}>View Full Sports Gallery →</Link>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionH2}>Questions from <em>programs</em></h2>
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
          <h2>Ready to talk about your <em>program?</em></h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '12px', maxWidth: '480px', lineHeight: '1.7' }}>
            Tell me about your program, sport, and season schedule — I'll respond within 24 hours with a custom partnership quote.
          </p>
        </div>
        <Link href="/about#contact" className="btn btn-solid">Start the Conversation →</Link>
      </div>
    </>
  );
}
