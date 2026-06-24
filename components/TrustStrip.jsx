import styles from './TrustStrip.module.css';

const LOGOS = [
  { src: '/photos/TRUST - large_Panther_athletics.PNG',             alt: 'BR Panthers Athletics' },
  { src: '/photos/TRUST - njsiaa-logo2-reformatted_0.jpg',          alt: 'NJSIAA' },
  { src: '/photos/TRUST - employerLogo.png',                        alt: 'Bridgewater-Raritan Regional School District' },
  { src: '/photos/TRUST - employerLogo-2.png',                      alt: 'Parsippany-Troy Hills Township Schools' },
  { src: '/photos/TRUST - i-3kndGtr-S.png',                         alt: 'SBA Service-Disabled Veteran-Owned Small Business Certified' },
  { src: '/photos/TRUST - i-45WhwbV-S.png',                         alt: 'SDVOSB Veteran Owned Business Verified Member' },
  { src: '/photos/TRUST - images.jpeg',                             alt: 'BR Panther Athletic Club' },
  { src: '/photos/TRUST - images.png',                              alt: "Barkley's Marketplace" },
  { src: '/photos/TRUST - PPA_logo1_COLOR_RGB_Meta.png',            alt: 'Professional Photographers of America' },
  { src: '/photos/TRUST - WPAOGlogoTransBG200.png',                 alt: 'WPAO' },
  { src: '/photos/TRUST - BayLogo_square_LightBkgrnd_400x400.jpg',  alt: 'Bay Photo Lab' },
  { src: '/photos/TRUST - breeze-logo.png',                         alt: 'The BReeze' },
];

// Duplicate for seamless loop
const TRACK = [...LOGOS, ...LOGOS];

export default function TrustStrip() {
  return (
    <section className={styles.wrap}>
      <p className={styles.label}>Trusted by schools, programs &amp; organizations across New Jersey</p>
      <div className={styles.marqueeOuter}>
        <div className={styles.track}>
          {TRACK.map((logo, i) => (
            <div key={i} className={styles.logo}>
              <img src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
