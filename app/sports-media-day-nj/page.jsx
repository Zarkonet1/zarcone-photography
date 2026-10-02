import Link from 'next/link';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import styles from '@/app/seo-page.module.css';

const URL = 'https://www.zarconephotography.com/sports-media-day-nj';

export const metadata = {
  title: 'Sports Media Day Photography in Central NJ | Zarcone Photography',
  description: 'Team and individual Media Day photography for New Jersey high school sports. Custom team packages, private online galleries. Based in Bridgewater, NJ.',
  openGraph: {
    title: 'Sports Media Day Photography in Central NJ | Zarcone Photography',
    description: 'Team and individual Media Day photography for NJ high school sports, built around your roster and shot list. Bridgewater, NJ.',
    url: URL,
    type: 'website',
    images: [
      {
        url: 'https://www.zarconephotography.com/photos/media-day-freshman-team.jpg',
        width: 1600,
        height: 1280,
        alt: 'BRHS Panther football Media Day team photo, Bridgewater NJ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://www.zarconephotography.com/photos/media-day-freshman-team.jpg'],
  },
  alternates: {
    canonical: URL,
  },
};

const FAQ = [
  {
    q: 'What is sports Media Day photography?',
    a: 'Media Day is a pre-season session where each athlete gets an individual portrait and the team is photographed together, along with coaches and any group or specialty shots the program wants. The images are used for rosters, banners, posters, social media, game programs and Senior Night.',
  },
  {
    q: 'How much does a Media Day cost?',
    a: 'Media Days are quoted as custom team packages. The price depends on roster size, the number of setups and looks, the deliverables you want and the production involved. Contact me with your team, roster size and goals and I will send a quote. Parent and individual purchasing can also be built into the plan when it makes sense for your program.',
  },
  {
    q: 'How long does a team Media Day take?',
    a: 'Most team Media Days run about one to four hours. A smaller team or a senior-focused session may take about an hour. A full production with 20 to 30 or more athletes and multiple setups can take several hours. I build the schedule around your roster and shot list rather than rushing athletes through a fixed time slot.',
  },
  {
    q: 'How do athletes and families get their photos?',
    a: 'Images are culled and edited, then delivered digitally through a private online gallery and the program Media Hub, so athletes, families, coaches and the program can view, download and share them. Turnaround depends on the size and complexity of the assignment.',
  },
  {
    q: 'Is there a minimum roster size?',
    a: 'There is no standard minimum. Each Media Day is customized and quoted for the program.',
  },
  {
    q: 'When should we book?',
    a: 'As early as you can before the season, especially for preseason Media Days. Availability gets tighter as the athletic calendar fills.',
  },
  {
    q: 'Which sports and schools have you worked with?',
    a: 'I have produced Media Days and team photography for Bridgewater-Raritan High School athletic programs, with football and girls volleyball as the strongest current examples. I have also worked with wrestling, gymnastics, field hockey and other school sports programs.',
  },
  {
    q: 'What areas do you serve?',
    a: 'I am based in Bridgewater and regularly work with programs in Somerset, Middlesex, Union, Morris, Hunterdon and Warren counties, and I will travel for the right program.',
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Sports Media Day Photography',
    serviceType: 'Team and individual sports photography',
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
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Somerset County, NJ' },
      { '@type': 'AdministrativeArea', name: 'Middlesex County, NJ' },
      { '@type': 'AdministrativeArea', name: 'Union County, NJ' },
      { '@type': 'AdministrativeArea', name: 'Morris County, NJ' },
      { '@type': 'AdministrativeArea', name: 'Hunterdon County, NJ' },
      { '@type': 'AdministrativeArea', name: 'Warren County, NJ' },
    ],
    description: 'Team and individual Media Day photography for New Jersey high school sports programs, quoted as custom team packages and delivered through a private online gallery.',
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

const INCLUDED = [
  {
    num: '01',
    title: 'Individual Portraits',
    body: 'Every athlete gets a proper portrait for rosters, banners, posters and social media. The kind of image a family keeps and a program reuses all season.',
  },
  {
    num: '02',
    title: 'Team & Group Photos',
    body: 'Full-team, position-group, senior and coach photos, planned with your coaching staff so the shots you need are on the list before the day starts.',
  },
  {
    num: '03',
    title: 'Creative & Specialty Looks',
    body: 'Additional setups beyond the standard portrait, built around what the program wants to use the images for. The scope is set before the day, not improvised on it.',
  },
  {
    num: '04',
    title: 'Private Gallery & Media Hub',
    body: 'Edited images go to a private online gallery and the program Media Hub, where athletes, families and coaches can view, download and share.',
  },
  {
    num: '05',
    title: 'Parent & Individual Ordering',
    body: 'Where it fits the program, families can order prints and files directly, so the team package and parent purchasing work together.',
  },
  {
    num: '06',
    title: 'Part of a Season Partnership',
    body: 'Media Day pairs with game coverage and Senior Night in a full season partnership, or it can be booked on its own.',
  },
];

const STEPS = [
  { num: '1', title: 'Tell me about the team', body: 'Sport, roster size, preferred dates and what you want to use the images for.' },
  { num: '2', title: 'Get a custom quote', body: 'A flat-fee team package based on roster, setups, deliverables and production needs.' },
  { num: '3', title: 'Plan the shot list', body: 'We build the schedule and shot list with your coaches around your roster, not a preset time slot.' },
  { num: '4', title: 'Shoot and deliver', body: 'Photos are culled, edited and delivered through a private gallery and the Media Hub.' },
];

const PREVIEWS = [
  { src: '/photos/media-day-freshman-team.jpg', alt: 'BRHS Panther football team Media Day photo, Bridgewater NJ' },
  { src: '/photos/media-day-seniors.jpg', alt: 'BRHS Panther football seniors Media Day photo, Bridgewater NJ' },
  { src: '/photos/media-day-varsity-coaches.jpg', alt: 'BRHS Panther football varsity coaches Media Day photo, Bridgewater NJ' },
];

export default function SportsMediaDayNJ() {
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
        eyebrow="Sports Media Day · New Jersey"
        title="Sports Media Day Photography — Central NJ"
        description="Team and individual Media Day photography for high school sports programs. Custom team packages, built around your roster and shot list. Based in Bridgewater, NJ."
        imageSrc="/photos/media-day-freshman-team.jpg"
      />

      <section className={styles.intro}>
        <div className={styles.introLabel}>
          <h2 className={styles.introH2}>The season starts<br />with a <em>photograph.</em></h2>
        </div>
        <div className={styles.introBody}>
          <p>Media Day is the one session where every athlete gets a real portrait and the team gets a real team photo before the schedule takes over. Done well, it gives a program a full set of images for rosters, banners, posters, social media, game programs and Senior Night.</p>
          <p>I photograph Media Days for New Jersey high school programs and run them as official media partner of <Link href="/brhs-panther-football">Bridgewater-Raritan Panther football</Link> and <Link href="/brhs-panther-volleyball">Panther volleyball</Link>. Here is what the football day looked like: <Link href="/blog/brhs-panther-football-2026-media-day-recap">the 2026 Panther football Media Day recap</Link>.</p>
          <p><strong>Every Media Day is built around your program.</strong> Roster size, shot list, setups and deliverables decide the plan and the price, not a fixed template.</p>
          <p>I work with programs throughout Somerset County and Central New Jersey, including Middlesex, Union, Morris, Hunterdon and Warren counties.</p>
        </div>
      </section>

      <section className={styles.why}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionH2}>What a Media Day <em>includes</em></h2>
          <span className="section-rule" />
        </div>
        <div className={styles.grid3}>
          {INCLUDED.map((f) => (
            <div key={f.num} className={styles.feature}>
              <p className={styles.featureNum}>{f.num}</p>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureBody}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.intro}>
        <div className={styles.introLabel}>
          <h2 className={styles.introH2}>Pricing &amp;<br /><em>timing.</em></h2>
        </div>
        <div className={styles.introBody}>
          <p><strong>Custom team packages.</strong> Media Days are quoted as a flat-fee team package based on roster size, the number of setups and looks, the deliverables you want and the production involved. Parent and individual purchasing can be built in when it suits the program. <Link href="/about#contact">Contact me for a Media Day quote.</Link></p>
          <p><strong>Most team Media Days run about one to four hours.</strong> A smaller team or a senior-focused session may take about an hour. A full production with 20 to 30 or more athletes and several setups can take several hours. The schedule follows your roster and shot list, so athletes are not rushed through a fixed time slot.</p>
          <p><strong>Book early.</strong> There is no minimum roster to meet, but preseason availability gets tighter as the athletic calendar fills. Reach out as soon as you know your dates.</p>
        </div>
      </section>

      <section className={styles.why}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionH2}>How it <em>works</em></h2>
          <span className="section-rule" />
        </div>
        <div className={styles.grid3}>
          {STEPS.map((s) => (
            <div key={s.num} className={styles.feature}>
              <p className={styles.featureNum}>{s.num}</p>
              <h3 className={styles.featureTitle}>{s.title}</h3>
              <p className={styles.featureBody}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.preview}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionH2}>From <em>Media Day</em></h2>
          <span className="section-rule" />
        </div>
        <div className={styles.previewGrid}>
          {PREVIEWS.map((p) => (
            <div key={p.src} className={styles.previewImg}>
              <Image src={p.src} alt={p.alt} fill sizes="(max-width: 640px) 50vw, 33vw" />
            </div>
          ))}
        </div>
        <Link href="/brhs-panther-football" className={styles.previewLink}>See the Panther football hub →</Link>
      </section>

      <section className={styles.intro}>
        <div className={styles.introLabel}>
          <h2 className={styles.introH2}>Beyond<br /><em>Media Day.</em></h2>
        </div>
        <div className={styles.introBody}>
          <p>Media Day is one piece of a full season. See how <Link href="/schools-athletic-programs-nj">season media partnerships for NJ schools</Link> add game-day coverage, Senior Night and a program Media Hub, or browse <Link href="/sports-photographer-nj">sports photography across Central NJ</Link>. Pricing for other sports work is on the <Link href="/pricing">pricing page</Link>.</p>
        </div>
      </section>

      <section className={styles.faq}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionH2}>Media Day <em>questions</em></h2>
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

      <div className="cta-strip">
        <div>
          <h2>Planning a Media Day for <em>your team?</em></h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '12px', maxWidth: '480px', lineHeight: '1.7' }}>
            Tell me your sport, roster size and preferred dates and I'll respond within 24 hours with availability and a custom quote.
          </p>
        </div>
        <Link href="/about#contact" className="btn btn-solid">Request a Media Day Quote →</Link>
      </div>
    </>
  );
}
