import Link from 'next/link';
import PageHero from '@/components/PageHero';
import styles from './page.module.css';

export const metadata = {
  title: 'Photography Pricing NJ | Zarcone Photography',
  description: 'Transparent photography pricing for portraits, sports, events, and graphic design. Based in Bridgewater, NJ — serving New Jersey, NYC, and Philadelphia.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Photography Pricing | Zarcone Photography',
    description: 'Transparent photography pricing for portraits, sports, events, and graphic design.',
    url: 'https://zarconephotography.com/pricing',
  },
};


const PROCESS = [
  { num: '01', title: 'Reach Out', body: "Tell me about your project — the what, when, and where. I'll respond within 24 hours with questions, availability, and a custom quote." },
  { num: '02', title: 'We Plan', body: 'We lock in the details together — location, timing, wardrobe, shot list. No surprises on the day.' },
  { num: '03', title: 'We Shoot', body: 'A relaxed, unhurried session built around real moments. I bring the direction; you bring yourself.' },
  { num: '04', title: 'You Receive', body: 'Professionally edited images delivered to your private gallery — typically within 5–7 business days for sports, 7–10 business days for portraits. Not the kind that sit in a folder. The kind that end up framed, gifted, and still on the wall twenty years from now.' },
];


const PACKAGES = [
  {
    num: '01',
    category: 'Portraits',
    eyebrow: 'Seniors · Individuals · Families · Headshots',
    starting: '600',
    pain: 'Most clients come to us after a session that felt rushed and delivered images that looked like everyone else\'s. Here\'s what\'s included instead:',
    includes: [
      'Unhurried on-location or studio session',
      'Professional editing delivered within 7–10 business days',
      'Private online gallery, yours to access anytime',
      'Full-resolution files — print at any size, forever',
      'Print ordering available through the gallery',
    ],
    note: 'Packages available for extended sessions and multi-subject shoots.',
  },
  {
    num: '02',
    category: 'Sports',
    eyebrow: 'Teams · Athletes · Events · Season Coverage',
    starting: '850',
    pain: 'Most game-day photos end up too dark, too blurry, or taken from the wrong angle. Here\'s how this works instead:',
    includes: [
      'Coverage from every angle, with equipment built for fast action in any light',
      'Action and portrait photography in one session',
      'Professionally edited and delivered within 5–7 business days',
      'Full-resolution files — download, print, share',
      'Custom graphic design add-on available (senior posters, sports graphics)',
    ],
    note: 'Season packages and recurring event rates available.',
  },
  {
    num: '03',
    category: 'Events',
    eyebrow: 'Celebrations · Music · Corporate · Charity',
    starting: '750',
    pain: 'Your event happens once. Here\'s what full coverage actually looks like:',
    includes: [
      'Full event coverage from arrival to final moments',
      'Professionally edited and delivered within 2 weeks',
      'Private online gallery, yours to access forever',
      'Full-resolution files — download, print, share at any size',
      'Videography add-on available',
    ],
    note: 'Multi-hour and full-day rates available.',
  },
  {
    num: '04',
    category: 'Design',
    eyebrow: 'Senior Posters · Sports Graphics · Composites',
    starting: '75',
    includes: [
      'Custom composite design built around your photos',
      'Print-ready files at exact print dimensions (poster, banner, card)',
      'Web and social-ready files included',
      'Revisions included until you love it',
      'Rush turnaround available',
    ],
    note: 'Team and bulk order pricing available.',
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Investment"
        description="A session lasts a few hours. The images last the rest of their life. Starting points are listed below — reach out and I'll build something specific to your project."
        imageSrc="/photos/tz-shoot-portrait.jpg"
      />

      <div className={styles.wrap}>
        <div className={styles.grid}>
          {PACKAGES.map(p => (
            <div key={p.num} className={styles.card}>
              <div className={styles.cardHead}>
                <span className={`eyebrow ${styles.eyebrow}`}>{p.eyebrow}</span>
                <h2 className={styles.category}>{p.category}</h2>
                <div className={styles.price}>
                  <span className={styles.from}>Starting at</span>
                  <span className={styles.amount}>${p.starting}</span>
                </div>
              </div>
              <div className={styles.rule} />
              {p.pain && <p className={styles.painNote}>{p.pain}</p>}
              <ul className={styles.includes}>
                {p.includes.map((item, i) => (
                  <li key={i} className={styles.includesItem}>
                    <span className={styles.dot} />
                    {item}
                  </li>
                ))}
              </ul>
              {p.note && <p className={styles.note}>{p.note}</p>}
            </div>
          ))}
        </div>

        <div className={styles.processSection}>
          <div className={styles.processSectionHeader}>
            <p className={`eyebrow ${styles.eyebrow}`}>The Process</p>
            <h2 className={styles.processSectionTitle}>How It Works</h2>
          </div>
          <div className={styles.processGrid}>
            {PROCESS.map(p => (
              <div key={p.num} className={styles.processStep}>
                <p className={styles.processNum}>{p.num}</p>
                <h3 className={styles.processTitle}>{p.title}</h3>
                <p className={styles.processBody}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Portrait Parties callout */}
        <div className={styles.partiesStrip}>
          <div className={styles.ctaText}>
            <p className={`eyebrow ${styles.eyebrow}`}>Something Different</p>
            <h2 className={styles.ctaTitle}>Portrait <em>Parties</em></h2>
            <p className={styles.ctaDesc}>
              Host a social photography experience for your friends, book club, or colleague group.
              Professional portraits woven into an evening worth having — starting at $99 per guest.
            </p>
          </div>
          <Link href="/portrait-parties" className="btn btn-outline">Learn More →</Link>
        </div>

        <div className={styles.ctaStrip}>
          <div className={styles.ctaText}>
            <p className={`eyebrow ${styles.eyebrow}`}>Custom Quotes</p>
            <h2 className={styles.ctaTitle}>Every project is <em>different.</em></h2>
            <p className={styles.ctaDesc}>
              Pricing varies based on location, duration, deliverables, and scope. Send me the details and I'll get back to you with a custom quote within 24 hours.
            </p>
          </div>
          <Link href="/about#contact" className="btn btn-solid">Get a Custom Quote →</Link>
        </div>
      </div>
    </>
  );
}
