import Link from 'next/link';
import PageHero from '@/components/PageHero';
import styles from '@/app/seo-page.module.css';

export const metadata = {
  title: 'Senior Portrait Photographer — New Jersey | Zarcone Photography',
  description: 'Professional senior portrait photographer serving New Jersey — Bridgewater, Somerset County, and surrounding towns. Relaxed sessions, stunning locations, fast delivery.',
  openGraph: {
    title: 'Senior Portrait Photographer — New Jersey | Zarcone Photography',
    description: 'Professional senior portrait photographer serving New Jersey. Based in Bridgewater, NJ — Somerset County and beyond.',
    url: 'https://zarconephotography.com/senior-portrait-photographer-nj',
    type: 'website',
  },
  alternates: {
    canonical: 'https://zarconephotography.com/senior-portrait-photographer-nj',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Senior Portrait Photography',
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
  description: 'Senior portrait photography sessions for high school seniors in New Jersey. On-location and studio options, professional editing, private gallery delivery.',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'USD',
    price: '250',
    description: 'Senior portrait session starting at $250',
  },
};

const FEATURES = [
  {
    num: '01',
    title: 'Built Around You',
    body: 'Every senior session starts with a conversation. Your sport, your style, your personality — that\'s what drives the location choices, wardrobe direction, and how we spend our time together.',
  },
  {
    num: '02',
    title: 'Locations That Work',
    body: 'New Jersey offers extraordinary backdrops for senior portraits — from the open fields at Duke Island Park in Bridgewater to the gardens at Colonial Park in Somerset, the trails at Washington Valley Park, and the architecture of Downtown Somerville.',
  },
  {
    num: '03',
    title: 'Athlete-Ready',
    body: 'Photographing high school athletes is a specialty here. I know how to showcase what makes an athlete — the intensity, the gear, the position. And if you want a senior poster, that\'s a natural add-on.',
  },
  {
    num: '04',
    title: 'Fast, Private Delivery',
    body: 'Your edited gallery arrives in a private, password-protected online gallery within the agreed timeframe — ready to download, order prints, and share with family.',
  },
  {
    num: '05',
    title: '30 Years of Experience',
    body: 'Three decades of photographing people means knowing how to make anyone feel at ease in front of a camera. The seniors who look the most natural in their photos are the ones who forgot I was there.',
  },
  {
    num: '06',
    title: 'Design Add-Ons',
    body: 'Senior posters, locker decorations, and custom composites are available for athletes who want something that goes beyond a standard portrait package.',
  },
];

const FAQ = [
  {
    q: 'When should I book my senior portrait session?',
    a: 'Most families book in late spring or early summer to take advantage of warm weather and lush greenery at NJ\'s outdoor locations. That said, fall sessions are also incredibly popular — the colors at places like Duke Island Park and Washington Valley Park are stunning in October. The key is booking before your school\'s yearbook deadline.',
  },
  {
    q: 'Where do senior portrait sessions take place?',
    a: 'Most sessions are on-location across New Jersey. Popular choices include Duke Island Park in Bridgewater, Colonial Park in Somerset, Natirar in Peapack-Gladstone, Washington Valley Park, and Downtown Somerville. If you have a meaningful location in mind — a field where you play, a park you\'ve grown up near — bring it. Studio sessions are also available.',
  },
  {
    q: 'How many outfit changes can I bring?',
    a: 'Two to three outfits work well for most sessions. More than that starts to feel rushed. I\'d rather spend real time with two great looks than cycle through five changes.',
  },
  {
    q: 'Can I bring my sport or activity into the session?',
    a: 'Absolutely — and for athletes, it\'s strongly encouraged. Whether that\'s a lacrosse stick at the school athletic fields, a uniform and jersey, or dance shoes in a studio setting, bringing your activity into the session creates photos that feel genuinely yours.',
  },
  {
    q: 'What\'s included in a senior portrait package?',
    a: 'All sessions include professional editing and retouching, a private online gallery for downloading high-resolution files, and print ordering capability. Packages vary by session length and number of locations — reach out for a custom quote.',
  },
  {
    q: 'Do you serve the whole state, or just Somerset County?',
    a: 'Primarily serving Somerset County and the surrounding area — including Warren, Morris, Union, and Middlesex counties — and willing to travel throughout New Jersey for the right session.',
  },
];

const PREVIEWS = [
  '/photos/i-rvRX82g.jpg',
  '/photos/GiadaField.jpg',
  '/photos/PORTRAIT-Zarcone-Photography-0002.jpg',
  '/photos/PORTRAIT-Zarcone-Photography-45.jpg',
];

export default function SeniorPortraitPhotographerNJ() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Senior Portraits · New Jersey"
        title="Senior Portrait Photographer"
        description="Bridgewater, NJ — serving Somerset County and all of New Jersey. Relaxed sessions, real locations, photos worth keeping."
        imageSrc="/photos/Sniors.jpg"
        imagePosition="center 15%"
      />

      {/* Intro */}
      <section className={styles.intro}>
        <div className={styles.introLabel}>
          <h2 className={styles.introH2}>The year<br />worth <em>documenting.</em></h2>
        </div>
        <div className={styles.introBody}>
          <p>Senior year is one of the few times in a young person's life when slowing down to document who they are right now actually makes sense. Not who they'll become — who they are at this exact moment, before everything changes.</p>
          <p>I've been photographing New Jersey seniors for over two decades. What I've learned is that the best senior portraits don't come from following a script. They come from giving seniors enough space to forget they're being photographed.</p>
          <p><strong>The result is images that look like your senior — not a stock photo version of them.</strong> That's the standard I hold every session to.</p>
          <p>Sessions take place at some of New Jersey's best outdoor locations — or in the studio, or on the field, or wherever your senior actually belongs. Serving families throughout Somerset County, Morris County, Warren County, Union County, Middlesex County, and beyond.</p>
        </div>
      </section>

      {/* Why section */}
      <section className={styles.why}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionH2}>What makes a <em>great</em> senior session</h2>
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

      {/* Locations */}
      <div className={styles.locations}>
        <span className={styles.locationsLabel}>NJ Locations</span>
        <p className={styles.locationsList}>
          Duke Island Park, Bridgewater &nbsp;·&nbsp; Colonial Park, Somerset &nbsp;·&nbsp; Natirar, Peapack-Gladstone &nbsp;·&nbsp; Washington Valley Park, Warren &nbsp;·&nbsp; Downtown Somerville &nbsp;·&nbsp; South Mountain Reservation &nbsp;·&nbsp; Liberty State Park &nbsp;·&nbsp; Island Beach State Park &nbsp;·&nbsp; Your school athletic fields &nbsp;·&nbsp; Studio sessions available
        </p>
      </div>

      {/* Gallery Preview */}
      <section className={styles.preview}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionH2}>Recent <em>senior sessions</em></h2>
          <span className="section-rule" />
        </div>
        <div className={styles.previewGrid}>
          {PREVIEWS.map((src, i) => (
            <div key={i} className={styles.previewImg}>
              <img src={src} alt="Senior portrait — New Jersey" loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
        <Link href="/portraits" className={styles.previewLink}>View Full Portrait Gallery →</Link>
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
          <h2>Ready to book your <em>senior session?</em></h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '12px', maxWidth: '480px', lineHeight: '1.7' }}>
            Reach out with your preferred dates and I'll get back to you within 24 hours with availability and a custom quote.
          </p>
        </div>
        <Link href="/about#contact" className="btn btn-solid">Book a Session →</Link>
      </div>
    </>
  );
}
