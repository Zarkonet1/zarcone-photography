import styles from '../legal.module.css';

export const metadata = {
  title: 'Privacy Policy — Zarcone Photography',
  description: 'How Zarcone Photography collects, uses, and protects your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>Legal</span>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: June 10, 2026</p>
      </div>

      <div className={styles.body}>
        <h2>Overview</h2>
        <p>
          Zarcone Photography, LLC ("we," "us," or "our") operates zarconephotography.com. This Privacy Policy explains what personal information we collect, how we use it, who we share it with, and the choices you have. By using this site or submitting your information through any form, you agree to the practices described here.
        </p>

        <h2>Information We Collect</h2>
        <p>We collect information you provide directly, including:</p>
        <ul>
          <li><strong>Contact inquiries</strong> — name, email address, phone number, and the message you submit through our contact form.</li>
          <li><strong>Newsletter signups</strong> — your email address when you subscribe to session announcements and updates.</li>
          <li><strong>Booking information</strong> — names, dates, location, and other details you provide when booking a session or event.</li>
        </ul>
        <p>
          We also collect limited technical data automatically when you visit the site, including IP address, browser type, referring URL, and pages visited. This is collected through Vercel (our hosting provider) and is used solely for security and performance monitoring.
        </p>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To respond to your inquiries and quotes</li>
          <li>To communicate about scheduled sessions, deliverables, and follow-ups</li>
          <li>To send newsletters and session announcements (only if you opted in — you can unsubscribe at any time)</li>
          <li>To improve site performance and user experience</li>
          <li>To comply with legal obligations</li>
        </ul>
        <p>We will never sell, rent, or trade your personal information to third parties for marketing purposes.</p>

        <h2>Third-Party Services</h2>
        <p>We use the following third-party services that may process your data on our behalf:</p>
        <ul>
          <li><strong>Formspree</strong> — processes contact form and inquiry submissions. See <a href="https://formspree.io/legal/privacy-policy" target="_blank" rel="noreferrer">Formspree's Privacy Policy</a>.</li>
          <li><strong>Mailchimp</strong> — manages newsletter subscriptions. See <a href="https://mailchimp.com/legal/privacy/" target="_blank" rel="noreferrer">Mailchimp's Privacy Policy</a>.</li>
          <li><strong>Vercel</strong> — hosts this website. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Vercel's Privacy Policy</a>.</li>
          <li><strong>Elfsight</strong> — powers the Instagram feed widget. See <a href="https://elfsight.com/privacy-policy/" target="_blank" rel="noreferrer">Elfsight's Privacy Policy</a>.</li>
          <li><strong>HoneyBook</strong> — manages client contracts, invoices, and project communications. See <a href="https://www.honeybook.com/privacy" target="_blank" rel="noreferrer">HoneyBook's Privacy Policy</a>.</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          This site may use essential cookies required for basic functionality. We do not use tracking cookies or advertising cookies. Third-party services embedded on this site (such as Elfsight) may set their own cookies subject to their own privacy policies.
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain contact inquiry data for as long as is reasonably necessary to respond to your request and maintain business records. Newsletter subscribers are retained until they unsubscribe. You may request deletion of your data at any time by contacting us.
        </p>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Request access to the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt out of newsletter communications at any time via the unsubscribe link in any email</li>
        </ul>
        <p>To exercise any of these rights, contact us at the address below.</p>

        <h2>Children's Privacy</h2>
        <p>
          This site is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has submitted personal information through this site, please contact us and we will promptly delete it.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page. Your continued use of the site after any changes constitutes your acceptance of the updated policy.
        </p>

        <div className={styles.contactBox}>
          <p>
            <strong>Questions about this policy?</strong><br />
            Zarcone Photography, LLC &nbsp;·&nbsp; Bridgewater, NJ<br />
            Email: <a href="mailto:info@zarconephotography.com">info@zarconephotography.com</a> &nbsp;·&nbsp;
            Phone: <a href="tel:9087770631">(908) 777-0631</a>
          </p>
        </div>
      </div>
    </div>
  );
}
