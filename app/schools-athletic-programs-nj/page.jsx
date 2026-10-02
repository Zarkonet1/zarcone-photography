import Link from 'next/link';
import PageHero from '@/components/PageHero';
import styles from '@/app/seo-page.module.css';

const URL = 'https://www.zarconephotography.com/schools-athletic-programs-nj';
const TITLE = 'School Sports Media Partner in NJ | Zarcone Photography';

export const metadata = {
  title: TITLE,
  description: 'Season-long photography and media partnerships for NJ high school athletic programs: game coverage, Media Day, Senior Night and licensing. Bridgewater, NJ.',
  openGraph: {
    title: TITLE,
    description: 'Season-long media partnerships for NJ athletic programs. Game coverage, Media Day, Senior Night, a program Media Hub and organizational licensing.',
    url: URL,
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
    canonical: URL,
  },
};

const FAQ = [
  {
    q: 'What does a season media partnership include?',
    a: "Media Day with team and individual portraits, home-game coverage across the regular season, Senior Night coverage with a custom poster for every senior, postseason coverage if the team advances, and a program Media Hub. Scope is built around your program's schedule and needs.",
  },
  {
    q: 'How is a partnership different from booking single games?',
    a: 'Booking a single game solves one event. A partnership gives you consistent coverage, one point of contact, an organizational license, and a visual record that builds across the whole season instead of a collection of one-offs. It also typically costs less per game than booking games one at a time.',
  },
  {
    q: 'What is the Program Media Hub?',
    a: 'A program-owned website for your team that holds the schedule, scores, stats, photo and video galleries and social content in one place. It is built and maintained alongside the photography, so families, coaches and the community know where to look and the athletic department is not fielding requests all season.',
  },
  {
    q: 'How is a partnership priced?',
    a: 'Every school and athletic program engagement is a custom proposal based on program size, coverage schedule, deliverables and season scope. There is no fixed package, so the price reflects what your program actually needs. Portrait and individual session pricing is listed on the pricing page.',
  },
  {
    q: 'Can our booster club or athletic department use the photos for promotional purposes?',
    a: "Yes. That is what the organizational license is for. It covers your website, social media, printed programs, banners and recruiting materials, scoped to how your program plans to use the images.",
  },
  {
    q: 'Do you carry insurance and provide certificates of insurance?',
    a: 'Yes. Zarcone Photography maintains business insurance, including liability and equipment coverage, and can provide a certificate of insurance when a school, district or venue requires one.',
  },
  {
    q: 'Are you a certified veteran-owned business?',
    a: 'Yes. Zarcone Photography is a Service-Disabled Veteran-Owned Small Business (SDVOSB) and a New Jersey Disabled Veteran-Owned Business.',
  },
  {
    q: 'How do parents and families get their photos?',
    a: "Every family receives access to a private online gallery for their athlete, with download and print ordering built in. The athletic department is not the point of contact for individual photo requests.",
  },
  {
    q: 'Can this cover multiple sports or just one team?',
    a: 'Both. Some partnerships cover a single program for a season, others cover multiple sports across a school year. Multi-sport and multi-year arrangements are available.',
  },
  {
    q: 'How far in advance should our program reach out?',
    a: 'As early as you can before the season, especially for preseason Media Days, because availability gets tighter as the athletic calendar fills. Mid-season partnerships and single-event bookings are also possible.',
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Athletic Program Media Partnerships',
    serviceType: 'School athletics media partnership',
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
    description: 'Season-long media partnerships for high school and youth athletic programs: game coverage, Media Day portraits, Senior Night, a program Media Hub and organizational licensing for promotional use, quoted as custom proposals.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  },
];

const FEATURES = [
  {
    num: '01',
    title: 'Season-Long Game Coverage',
    body: 'Every home game covered the way a photojournalist works a sideline: moving continuously, staying out of the way, following the story of the game. Coverage is planned around your schedule.',
  },
  {
    num: '02',
    title: 'Media Day & Team Portraits',
    body: (
      <>
        Individual and team portraits before the season starts, the images that end up on banners, in programs, on weight room walls and in recruiting profiles. See{' '}
        <Link href="/sports-media-day-nj">how Media Day works</Link>.
      </>
    ),
  },
  {
    num: '03',
    title: 'Senior Night, Done Right',
    body: 'A dedicated shoot and a custom commemorative poster design for every graduating senior, coordinated directly with the program with no extra lift on your end.',
  },
  {
    num: '04',
    title: 'Program Media Hub',
    body: (
      <>
        A program-owned hub for schedules, scores, stats, photo and video galleries and social content, built and maintained alongside the photography. Families and coaches know where to look. See one in action: the{' '}
        <Link href="/brhs-panther-football">Panther Football hub</Link>.
      </>
    ),
  },
  {
    num: '05',
    title: 'Organizational Licensing',
    body: 'Schools, athletic departments and booster clubs get a license built for promotional use across website, social, print and recruiting materials, without per-image negotiation.',
  },
  {
    num: '06',
    title: 'Parent Ordering, Handled',
    body: "Every family gets a private gallery with individual ordering for prints, downloads and products, so the athletic department isn't fielding photo requests all season.",
  },
];

const PREVIEWS = [
  { src: '/photos/i-s7zBdzk.jpg', alt: 'High school athletic program photography, New Jersey' },
  { src: '/photos/DESIGN-PanthersElite18U-Team-Poster.jpg', alt: 'Team poster design by Zarcone Photography' },
  { src: '/photos/i-Lv2PXKm.jpg', alt: 'Game-day sports photography, New Jersey' },
  { src: '/photos/i-HkmJPk8.jpg', alt: 'School athletics photography, New Jersey' },
];

export default function SchoolsAthleticProgramsNJ() {
  return (
    <>
      {jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}

      <PageHero
        eyebrow="For Athletic Directors, Coaches & Booster Clubs"
        title="Media Partner for NJ School Athletic Programs"
        description="One media partner for the whole season: game coverage, Media Day, Senior Night and a program Media Hub, with one point of contact and one organizational license. Based in Bridgewater, NJ."
        imageSrc="/photos/i-s7zBdzk.jpg"
      />

      {/* Proof */}
      <div className={styles.caseStudy}>
        <span className={styles.caseStudyLabel}>Proof</span>
        <p className={styles.caseStudyText}>
          Official media partner and Gold Level Sponsor of <Link href="/brhs-panther-football">BRHS Panther Football</Link> (2026), official photography and social media graphics partner of <Link href="/brhs-panther-wrestling">BRHS Panther Wrestling</Link> (2026-27, coming off the program's first-ever back-to-back sectional championship), and official media partner of <Link href="/brhs-panther-volleyball">BRHS Panther Girls Volleyball</Link>. Each program has its own season hub.
        </p>
      </div>

      {/* Intro */}
      <section className={styles.intro}>
        <div className={styles.introLabel}>
          <h2 className={styles.introH2}>A media partner,<br />not a photographer<br /><em>booked by the game.</em></h2>
        </div>
        <div className={styles.introBody}>
          <p>I build season-long media partnerships for New Jersey athletic departments, coaches and booster clubs. Photography is the core of it. What you are really getting is a consistent visual identity for your program, organized delivery for coaches and families, and a partner who shows up all season.</p>
          <p>Each partnership is scoped around your season: game coverage, Media Day, Senior Night and a program Media Hub that keeps schedules, scores, stats, galleries and social content in one place. One point of contact. One organizational license.</p>
          <p><strong>Most programs cover a season with a parent and a phone, or a photographer booked one game at a time.</strong> Neither builds a consistent record of your athletes, their season and their story. A partnership does.</p>
        </div>
      </section>

      {/* What's included */}
      <section className={styles.why}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionH2}>What a partnership <em>includes</em></h2>
          <span className="section-rule" />
        </div>
        <div className={styles.grid3}>
          {FEATURES.map((f) => (
            <div key={f.num} className={styles.feature}>
              <p className={styles.featureNum}>{f.num}</p>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureBody}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Procurement */}
      <section className={styles.intro}>
        <div className={styles.introLabel}>
          <h2 className={styles.introH2}>Built for school<br /><em>procurement.</em></h2>
        </div>
        <div className={styles.introBody}>
          <p>Zarcone Photography is set up to work with schools, districts, athletic departments and booster organizations the way institutions expect to work with a vendor.</p>
          <p><strong>Certified veteran-owned.</strong> Service-Disabled Veteran-Owned Small Business (SDVOSB) and New Jersey Disabled Veteran-Owned Business.</p>
          <p><strong>Insured.</strong> We maintain business insurance, including liability and equipment coverage, and provide certificates of insurance when a school, district or venue requires one.</p>
          <p><strong>Organizational licensing.</strong> One license built for how institutions use images: website, social, print and recruiting materials.</p>
          <p><strong>Defined scope and one accountable contact.</strong> Every partnership is a custom proposal built around your program size, coverage schedule and deliverables, with the same point of contact from the first conversation to the end of the season.</p>
          <p><strong>Current institutional partner.</strong> Active partnerships with three Bridgewater-Raritan athletic programs, each with its own Media Hub.</p>
        </div>
      </section>

      {/* Proposals */}
      <div className={styles.locations}>
        <span className={styles.locationsLabel}>Proposals</span>
        <p className={styles.locationsList}>
          Every school and athletic program engagement is a <strong style={{ color: 'var(--text)' }}>custom proposal</strong> based on program size, coverage schedule, deliverables and season scope. Tell me about your program and I will send a proposal. Portrait and individual session pricing is on the <Link href="/pricing" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>pricing page</Link>.
        </p>
      </div>

      {/* Gallery Preview */}
      <section className={styles.preview}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionH2}>From the <em>sidelines</em></h2>
          <span className="section-rule" />
        </div>
        <div className={styles.previewGrid}>
          {PREVIEWS.map((p) => (
            <div key={p.src} className={styles.previewImg}>
              <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
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
            Tell me about your program, sport and season schedule, and I'll respond within 24 hours with a custom partnership proposal.
          </p>
        </div>
        <Link href="/about#contact" className="btn btn-solid">Start the Conversation →</Link>
      </div>
    </>
  );
}
