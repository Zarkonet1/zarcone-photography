import { GOV_FOOTER, COMPANY_DATA } from '@/lib/govconData';
import styles from './govcon.module.css';

// A page-specific closing band for the Government Practice content,
// distinct from the site's global <Footer /> (components/Footer.jsx),
// which still renders below this on every page via app/layout.jsx. This
// band carries government-specific trust/verification links; the global
// footer continues to carry sitewide navigation and legal links.
export default function GovFooter() {
  return (
    <div className={styles.govFooter}>
      <div className={styles.container}>
        <div className={styles.govFooterInner}>
          <span className={styles.govFooterTagline}>{GOV_FOOTER.tagline}</span>
          <nav className={styles.govFooterLinks} aria-label="Government verification links">
            {GOV_FOOTER.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <p className={styles.govFooterCopy}>
          © {new Date().getFullYear()} {GOV_FOOTER.copyrightName}. All rights reserved. · SDVOSB · SAM.gov Registered · {COMPANY_DATA.location}
        </p>
      </div>
    </div>
  );
}
