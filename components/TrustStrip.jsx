import styles from './TrustStrip.module.css';

const LOGOS = [
  { src: '/photos/TRUST - large_Panther_athletics.PNG',                alt: 'BR Panthers Athletics' },
  { src: '/photos/TRUST - njsiaa-logo2-reformatted_0.jpg',             alt: 'NJSIAA' },
  { src: '/photos/TRUST - employerLogo.png',                           alt: 'Partner' },
  { src: '/photos/TRUST - employerLogo-2.png',                         alt: 'Partner' },
  { src: '/photos/TRUST - i-3kndGtr-S.png',                            alt: 'Partner' },
  { src: '/photos/TRUST - i-45WhwbV-S.png',                            alt: 'Partner' },
  { src: '/photos/TRUST - images.jpeg',                                alt: 'Partner' },
  { src: '/photos/TRUST - images-2.jpeg',                              alt: 'Partner' },
  { src: '/photos/TRUST - images.png',                                 alt: 'Partner' },
  { src: '/photos/TRUST - images-2.png',                               alt: 'Partner' },
  { src: '/photos/TRUST - PPA_logo1_COLOR_RGB_Meta.png',               alt: 'Professional Photographers of America' },
  { src: '/photos/TRUST - WPAOGlogoTransBG200.png',                    alt: 'WPAO' },
  { src: '/photos/TRUST - BayLogo_square_LightBkgrnd_400x400.jpg',     alt: 'Bay Photo Lab' },
  { src: '/photos/TRUST - unnamed.gif',                                alt: 'Partner' },
];

export default function TrustStrip() {
  return (
    <section className={styles.wrap}>
      <p className={styles.label}>Trusted by schools, programs &amp; organizations across New Jersey</p>
      <div className={styles.track}>
        {LOGOS.map((logo, i) => (
          <div key={i} className={styles.logo}>
            <img src={logo.src} alt={logo.alt} />
          </div>
        ))}
      </div>
    </section>
  );
}
