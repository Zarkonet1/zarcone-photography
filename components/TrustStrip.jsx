import Link from 'next/link';
import styles from './TrustStrip.module.css';

// Partnership logos carry an `href` to their dedicated partnership page —
// that's what makes them clickable in the strip below. Vendor/certification
// logos (PPA, Bay Photo, SBA/SDVOSB, etc.) have no href and stay static.
// To add the next partnership (Parsippany-Troy Hills is next in line), just
// add its href here — no markup or CSS changes needed. Set `external: true`
// for hrefs that point off-site (e.g. a sister brand) so it renders as a
// plain new-tab link instead of an internal next/link route.
const LOGOS = [
  { src: '/photos/TRUST - large_Panther_athletics.PNG',             alt: 'BR Panthers Athletics', href: '/brhs-panther-football' },
  { src: '/photos/TRUST - njsiaa-logo2-reformatted_0.jpg',          alt: 'NJSIAA' },
  { src: '/photos/TRUST - employerLogo.png',                        alt: 'Bridgewater-Raritan Regional School District', href: '/brhs-panther-football' },
  { src: '/photos/TRUST - employerLogo-2.png',                      alt: 'Parsippany-Troy Hills Township Schools' },
  { src: '/photos/TRUST - i-3kndGtr-S.png',                         alt: 'SBA Service-Disabled Veteran-Owned Small Business Certified' },
  { src: '/photos/TRUST - i-45WhwbV-S.png',                         alt: 'SDVOSB Veteran Owned Business Verified Member' },
  { src: '/photos/TRUST - images.jpeg',                             alt: 'BR Panther Athletic Club' },
  { src: '/photos/TRUST - images.png',                              alt: "Barkley's Marketplace", href: 'https://barkleysmarketplace.com', external: true },
  { src: '/photos/TRUST - TKCFarms.png',                            alt: 'TKC Farms', href: 'https://www.tkcfarms.com', external: true },
  { src: '/photos/TRUST - BPOE1388.png',                            alt: 'Bound Brook Elks Lodge #1388', href: 'https://www.elks.org/lodges/contactus.cfm?lodge=1388', external: true },
  { src: '/photos/TRUST - PPA_logo1_COLOR_RGB_Meta.png',            alt: 'Professional Photographers of America' },
  { src: '/photos/TRUST - WPAOGlogoTransBG200.png',                 alt: 'WPAO' },
  { src: '/photos/TRUST - BayLogo_square_LightBkgrnd_400x400.jpg',  alt: 'Bay Photo Lab' },
  { src: '/photos/TRUST - breeze-logo.png',                         alt: 'The BReeze' },
  { src: '/photos/TRUST - YourBestShot.png',                        alt: 'Your Best Shot — Sports Media', href: 'https://www.yourbestshot.photos', external: true },
];

// Duplicate for seamless loop
const TRACK = [...LOGOS, ...LOGOS];

export default function TrustStrip() {
  return (
    <section className={styles.wrap}>
      <div className={styles.labelWrap}>
        <span className={styles.eyebrow}>Featured Partnerships</span>
        <p className={styles.label}>Trusted by schools, programs &amp; organizations across New Jersey</p>
      </div>
      <div className={styles.marqueeOuter}>
        <div className={styles.track}>
          {TRACK.map((logo, i) => (
            <div key={i} className={styles.logo}>
              {logo.href && logo.external ? (
                <a
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.logoLink}
                  aria-label={`${logo.alt} — visit site`}
                >
                  <img src={logo.src} alt={logo.alt} />
                </a>
              ) : logo.href ? (
                <Link href={logo.href} className={styles.logoLink} aria-label={`${logo.alt} — see the partnership`}>
                  <img src={logo.src} alt={logo.alt} />
                </Link>
              ) : (
                <img src={logo.src} alt={logo.alt} />
              )}
            </div>
          ))}
        </div>
      </div>
      <Link href="/schools-athletic-programs-nj" className={styles.cta}>
        Run an athletic program? See how a season partnership works →
      </Link>
    </section>
  );
}
