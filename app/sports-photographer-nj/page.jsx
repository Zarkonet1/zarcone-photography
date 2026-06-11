import Link from 'next/link';
import PageHero from '@/components/PageHero';
import styles from '@/app/seo-page.module.css';

export const metadata = {
  title: 'Sports Photographer — New Jersey | Zarcone Photography',
  description: 'Professional sports photographer serving high schools, leagues, and athletes across New Jersey. Action photography, team coverage, athlete portraits — based in Bridgewater, NJ.',
  openGraph: {
    title: 'Sports Photographer — New Jersey | Zarcone Photography',
    description: 'Sports photographer based in Bridgewater, NJ. High school sports, youth leagues, and athlete portraits throughout New Jersey.',
    url: 'https://zarconephotography.com/sports-photographer-nj',
    type: 'website',
  },
  alternates: {
    canonical: 'https://zarconephotography.com/sports-photographer-nj',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Sports Photography',
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
  description: 'Sports photography for high schools, youth leagues, and individual athletes across New Jersey. Action coverage, team portraits, athlete composites, and season packages.',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'USD',
    price: '300',
    description: 'Sports photography coverage starting at $300',
  },
};

const SPORTS = [
  'Football', 'Wrestling', 'Lacrosse', 'Softball', 'Baseball',
  'Basketball', 'Soccer', 'Track & Field', 'Gymnastics', 'Swimming',
];

const FEATURES = [
  {
    num: '01',
    title: 'Speed That Keeps Up',
    body: 'Shooting with the Nikon Z9 at up to 20 frames per second means the decisive moment doesn\'t get away. Every burst, every cut, every takedown — captured at professional resolution.',
  },
  {
    num: '02',
    title: 'Game-Day Coverage',
    body: 'I work events the way a photojournalist works a scene: moving continuously, anticipating action, staying out of the way. Athletes and coaches don\'t need another distraction — they need documentation.',
  },
  {
    num: '03',
    title: 'Athlete Portraits',
    body: 'Beyond the game, I offer individual athlete portraits — studio and on-location. The kind of shot that goes in a frame at home and on the senior poster.',
  },
  {
    num: '04',
    title: 'Season & Team Packages',
    body: 'Recurring coverage across a full season, multi-sport packages for schools, and team-wide ordering galleries for parents. Custom rates available for ongoing relationships.',
  },
  {
    num: '05',
    title: 'Graphic Design Ready',
    body: 'Sports photography and graphic design work together here. Player photos become senior posters, team composites, locker decorations, and program covers — all in-house.',
  },
  {
    num: '06',
    title: 'NJSIAA Experience',
    body: 'Years of covering New Jersey high school athletics means understanding the rhythms of each sport, the rules around sideline access, and how to capture the moments that matter most.',
  },
];

const FAQ = [
  {
    q: 'What sports do you photograph?',
    a: 'Football, wrestling, lacrosse, softball, baseball, basketball, soccer, track and field, gymnastics, and swimming are the most common. If your sport isn\'t on that list, reach out — covering new sports is always welcome.',
  },
  {
    q: 'Do you work with individual athletes or only teams?',
    a: 'Both. Individual athlete sessions — portrait-style shoots with gear and uniforms — are a specialty. Team-wide coverage with individual ordering galleries for parents is also available. Packages can be tailored to what your program needs.',
  },
  {
    q: 'How do athletes and families receive their photos?',
    a: 'All images are delivered to a private online gallery. For individual sessions, that\'s a personal gallery for download and print ordering. For team coverage, parents receive individual access codes to order their athlete\'s images.',
  },
  {
    q: 'Can you cover multiple games or events in a season?',
    a: 'Yes — season packages are available for schools and leagues that want consistent coverage across the year. These are a great fit for varsity programs, booster clubs, or athletic departments with an ongoing photography need.',
  },
  {
    q: 'Do you photograph youth sports, or only high school?',
    a: 'Both. High school athletics is a core specialty, but travel teams, club sports, and recreational leagues are all covered. Somerset County and surrounding areas have excellent youth athletic programs — many of which already trust Zarcone Photography for their photography needs.',
  },
  {
    q: 'What areas of New Jersey do you serve?',
    a: 'Based in Bridgewater, regularly covering Somerset, Morris, Union, Warren, Middlesex, and Hunterdon counties. Willing to travel statewide for the right event or program.',
  },
];

const PREVIEWS = [
  '/photos/i-s7zBdzk.jpg',
  '/photos/i-Lv2PXKm.jpg',
  '/photos/SPORTS-Zarcone-Photography-0085.jpg',
  '/photos/SPORTS-Zarcone-Photography-0136-2.jpg',
];

export default function SportsPhotographerNJ() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Sports Photography · New Jersey"
        title="Sports Photographer — New Jersey"
        description="High school athletics, youth leagues, and individual athlete coverage. Based in Bridgewater, NJ — serving teams and programs across the state."
        imageSrc="/photos/i-s7zBdzk.jpg"
      />

      {/* Intro */}
      <section className={styles.intro}>
        <div className={styles.introLabel}>
          <h2 className={styles.introH2}>The effort<br />deserves to be <em>documented.</em></h2>
        </div>
        <div className={styles.introBody}>
          <p>High school athletes put in years of work before they ever step onto a varsity field. A single season contains hundreds of moments that disappear the second they happen — a first-period takedown, a game-winning goal, a senior's last home game.</p>
          <p>I've been covering New Jersey athletics for over two decades. The gear is fast — the Nikon Z9 shoots 20 frames per second — but the more important skill is knowing which moment is worth the burst before it happens.</p>
          <p><strong>Athletes deserve photographs that match the intensity they bring to their sport.</strong> That's what I show up to make.</p>
          <p>Serving high schools, travel teams, youth leagues, and booster clubs throughout Somerset County and across New Jersey — including programs in Warren, Morris, Union, Middlesex, and Hunterdon counties.</p>
        </div>
      </section>

      {/* Sports covered */}
      <div className={styles.locations}>
        <span className={styles.locationsLabel}>Sports Covered</span>
        <p className={styles.locationsList}>
          {SPORTS.join('  ·  ')} &nbsp;·&nbsp; and more
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
          <h2 className={styles.sectionH2}>From the <em>field</em></h2>
          <span className="section-rule" />
        </div>
        <div className={styles.previewGrid}>
          {PREVIEWS.map((src, i) => (
            <div key={i} className={styles.previewImg}>
              <img src={src} alt="Sports photography — New Jersey" loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
        <Link href="/sports" className={styles.previewLink}>View Full Sports Gallery →</Link>
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
          <h2>Ready to cover your <em>program?</em></h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '12px', maxWidth: '480px', lineHeight: '1.7' }}>
            Tell me about your team, your season schedule, and what you need — I'll respond within 24 hours with availability and pricing.
          </p>
        </div>
        <Link href="/about#contact" className="btn btn-solid">Get Coverage →</Link>
      </div>
    </>
  );
}
