import Link from 'next/link';
import PageHero from '@/components/PageHero';
import TrackedCta from '@/components/TrackedCta';
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
    a: 'Yes. We maintain business insurance, including liability and equipment coverage, and can provide a certificate of insurance when a school, district or venue requires one.',
  },
  {
    q: 'Are you a certified veteran-owned business?',
    a: 'Yes. We are a Service-Disabled Veteran-Owned Small Business (SDVOSB) and a New Jersey Disabled Veteran-Owned Business.',
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
];

const HUB_POINTS = [
  'Families and fans know where to find results and photos, without emailing the athletic office.',
  'Coaches and the athletic department get game content and graphics ready for social and recruiting.',
  "Every family gets a private gallery with print and download ordering, so the department isn't fielding photo requests.",
];

const CREDENTIALS = [
  {
    title: 'Certified veteran-owned',
    body: 'Service-Disabled Veteran-Owned Small Business (SDVOSB) and New Jersey Disabled Veteran-Owned Business.',
  },
  {
    title: 'Insured',
    body: 'Business insurance including liability and equipment coverage. Certificates of insurance provided when your school, district or venue requires one.',
  },
  {
    title: 'One organizational license',
    body: 'Website, social, print and recruiting use, without per-image negotiation.',
  },
  {
    title: 'One accountable partner',
    body: 'A custom proposal and one point of contact from first conversation to the end of the season.',
  },
];

const PROOF_PHOTOS = [
  { src: '/photos/SPORTS-FB100.jpg', alt: 'BRHS Panther football player leaping to make a catch, Bridgewater NJ', position: 'center 40%' },
  { src: '/photos/BRHS-Volleyball-2026-MSM-Kill.jpg', alt: 'BRHS Panther girls volleyball hitter attacking at the net, Bridgewater NJ', position: 'center 35%' },
  { src: '/photos/wrestling-throw-hero.jpg', alt: 'BRHS Panther wrestling match action, Bridgewater NJ', position: 'center' },
  { src: '/photos/media-day-varsity-team.jpg', alt: 'BRHS Panther varsity football team portrait at Media Day, Bridgewater NJ', position: 'center' },
];

const STEPS = [
  {
    title: 'Tell us about your program',
    body: 'Share your sport, your season schedule and what your program needs.',
  },
  {
    title: 'We prepare a custom proposal',
    body: 'Scoped around your schedule, deliverables and season, not a fixed package.',
  },
  {
    title: 'We coordinate with your program',
    body: 'Once engaged, we work with the appropriate school and program contacts to plan Media Day and season coverage.',
  },
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
        description="Season-long photography and media for your athletic program: game coverage, Media Day, Senior Night and a program-owned Media Hub, with one accountable partner and one organizational license."
        imageSrc="/photos/i-s7zBdzk.jpg"
        strongDesc
      >
        <div className={styles.heroActions}>
          <TrackedCta href="/about#contact" location="hero" label="Let's Talk About Your Program" className="btn btn-solid">
            Let&rsquo;s Talk About Your Program →
          </TrackedCta>
          <TrackedCta href="tel:+19087770631" location="hero_phone" label="Call (908) 777-0631" className={styles.heroPhone}>
            or call (908) 777-0631
          </TrackedCta>
        </div>
      </PageHero>

      {/* Proof */}
      <div className={styles.caseStudy}>
        <span className={styles.caseStudyLabel}>Proof</span>
        <p className={styles.caseStudyText}>
          Official media partner and Gold Level Sponsor of <Link href="/brhs-panther-football">BRHS Panther Football</Link> (2026), official photography and social media graphics partner of <Link href="/brhs-panther-wrestling">BRHS Panther Wrestling</Link> (2026-27, coming off the program's first-ever back-to-back sectional championship), and official media partner of <Link href="/brhs-panther-volleyball">BRHS Panther Girls Volleyball</Link>. Each program has its own season hub.
        </p>
      </div>

      {/* Problem → solution */}
      <section className={styles.intro}>
        <div className={styles.introLabel}>
          <h2 className={styles.introH2}>A media partner,<br />not a photographer<br /><em>booked by the game.</em></h2>
        </div>
        <div className={styles.introBody}>
          <p>Athletic programs need more than photos after the fact. They need a consistent visual identity, galleries families can actually find, content ready for social and recruiting, and a partner who already knows the season. We build season-long media partnerships for New Jersey athletic departments, coaches and booster clubs.</p>
          <p>Programs often piece this together from dedicated volunteers, one-off bookings and whatever time allows. That commitment matters, and it is hard to sustain across a full season. A partnership puts coverage, delivery and content under one plan, so no one on your staff or booster board has to coordinate it.</p>
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

      {/* Media Hub */}
      <section className={styles.hub}>
        <div>
          <p className={styles.hubKicker}>What sets a partnership apart</p>
          <h2 className={styles.hubH2}>A program-owned <em>Media Hub.</em></h2>
          <p className={styles.hubLead}>
            Photography alone leaves you with a gallery link. A partnership gives your program a home base: one place for the schedule, scores, stats, photo and video galleries and social content, built and maintained by us alongside the photography.
          </p>
          <ul className={styles.hubPoints}>
            {HUB_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <figure className={styles.hubFigure}>
          <img
            className={styles.hubImg}
            src="/photos/hub-football-media-center.jpg"
            width="1600"
            height="815"
            alt="BRHS Panther Football Media Hub showing the Media Center navigation and the Season Gallery with game-by-game galleries and a sign-up for new gallery alerts"
            loading="lazy"
            decoding="async"
          />
          <figcaption className={styles.hubCaption}>
            <span>BRHS Panther Football Media Hub</span>
            <Link href="/brhs-panther-football">See the live hub →</Link>
          </figcaption>
        </figure>
      </section>

      {/* Procurement */}
      <section className={styles.proc}>
        <div className={styles.procHead}>
          <h2 className={styles.procH2}>Built for school <em>procurement.</em></h2>
          <p className={styles.procSub}>What your administration and business office will ask about.</p>
        </div>
        <div className={styles.procGrid}>
          {CREDENTIALS.map((c) => (
            <div key={c.title} className={styles.procTile}>
              <h3 className={styles.procTileTitle}>{c.title}</h3>
              <p className={styles.procTileBody}>{c.body}</p>
            </div>
          ))}
        </div>
        <div className={styles.procFooter}>
          <p className={styles.procFooterText}>
            Need something specific for your business office? Tell us what your school or district requires.
          </p>
          <TrackedCta href="/about#contact" location="procurement" label="Start the Conversation" className="btn btn-solid">
            Start the Conversation →
          </TrackedCta>
        </div>
      </section>

      {/* Photo proof */}
      <section className={styles.preview}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionH2}>From the <em>sidelines</em></h2>
          <span className="section-rule" />
        </div>
        <div className={styles.proofGrid}>
          {PROOF_PHOTOS.map((p) => (
            <div key={p.src} className={styles.proofImg}>
              <img src={p.src} alt={p.alt} style={{ objectPosition: p.position }} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
        <Link href="/sports" className={styles.previewLink}>View Full Sports Gallery →</Link>
      </section>

      {/* How a partnership starts */}
      <section className={styles.steps}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionH2}>How a partnership <em>starts</em></h2>
          <span className="section-rule" />
        </div>
        <div className={styles.stepsGrid}>
          {STEPS.map((step, i) => (
            <div key={step.title} className={styles.step}>
              <p className={styles.stepNum}>{i + 1}</p>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </div>
          ))}
        </div>
        <p className={styles.stepsNote}>
          Every engagement is a custom proposal based on program size, coverage schedule, deliverables and season scope. Portrait and individual session pricing is on the <Link href="/pricing">pricing page</Link>.
        </p>
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
            Tell us about your program, sport and season schedule, and we&rsquo;ll follow up with a custom partnership proposal.
          </p>
        </div>
        <TrackedCta href="/about#contact" location="final" label="Start the Conversation" className="btn btn-solid">
          Start the Conversation →
        </TrackedCta>
      </div>
    </>
  );
}
