import Link from 'next/link';
import PageHero from '@/components/PageHero';
import styles from './page.module.css';

const PROCESS = [
  { num: '01', title: 'Reach Out', body: "Tell me about your project — the what, when, and where. I'll respond within 24 hours with questions, availability, and a custom quote." },
  { num: '02', title: 'We Plan', body: 'We lock in the details together — location, timing, wardrobe, shot list. No surprises on the day.' },
  { num: '03', title: 'We Shoot', body: 'A relaxed, unhurried session built around real moments. I bring the direction; you bring yourself.' },
  { num: '04', title: 'You Receive', body: 'Professionally edited images delivered to a private gallery within the agreed timeframe — ready to download, share, and print.' },
];

export const metadata = {
  title: 'Pricing — Zarcone Photography',
  description: 'Photography and videography pricing for portraits, sports, events, and design — Bridgewater, NJ.',
};

const PACKAGES = [
  {
    num: '01',
    category: 'Portraits',
    eyebrow: 'Seniors · Individuals · Families · Headshots',
    starting: '250',
    includes: [
      'On-location or studio session',
      'Professional editing & retouching',
      'Private online gallery delivery',
      'High-resolution digital files',
      'Print ordering available',
    ],
    note: 'Packages available for extended sessions and multi-subject shoots.',
  },
  {
    num: '02',
    category: 'Sports',
    eyebrow: 'Teams · Athletes · Events · Season Coverage',
    starting: '550',
    includes: [
      'On-site event or game coverage',
      'Action & portrait photography',
      'Professional editing & delivery',
      'High-resolution digital files',
      'Individual & team graphic design available',
    ],
    note: 'Season packages and recurring event rates available.',
  },
  {
    num: '03',
    category: 'Events',
    eyebrow: 'Celebrations · Music · Corporate · Charity',
    starting: '750',
    includes: [
      'Full event coverage',
      'Professional editing & delivery',
      'Private online gallery',
      'High-resolution digital files',
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
      'Custom graphic design',
      'High-resolution print-ready files',
      'Digital-use files included',
      'Revisions included',
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
        description="Every project is different. These starting points give you a sense of what to expect — reach out and I'll put together something specific to your needs."
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
