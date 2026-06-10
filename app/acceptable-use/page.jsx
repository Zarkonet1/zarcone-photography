import styles from '../legal.module.css';

export const metadata = {
  title: 'Acceptable Use Policy — Zarcone Photography',
  description: 'Guidelines for how clients and the public may use images and content created by Zarcone Photography.',
};

export default function AcceptableUse() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>Legal</span>
        <h1 className={styles.title}>Acceptable Use Policy</h1>
        <p className={styles.updated}>Last updated: June 10, 2026</p>
      </div>

      <div className={styles.body}>
        <h2>Purpose</h2>
        <p>
          This Acceptable Use Policy describes how clients and members of the public may use photographs, videos, and graphic design work created by Zarcone Photography, LLC. All work produced by Zarcone Photography is protected by U.S. copyright law. Retaining copyright in no way diminishes our gratitude — we're proud when clients share their images. This policy simply protects our work and your investment in it.
        </p>

        <h2>Personal Use License</h2>
        <p>
          Upon final payment for a session, clients receive a <strong>non-exclusive personal use license</strong> to use their delivered images. Permitted personal uses include:
        </p>
        <ul>
          <li>Printing for personal display (framed prints, albums, gifts)</li>
          <li>Sharing on personal social media accounts (Facebook, Instagram, etc.)</li>
          <li>Use as personal profile or cover photos</li>
          <li>Sharing with friends and family</li>
          <li>Including in personal scrapbooks, school projects, or memory books</li>
        </ul>

        <h2>Credit & Attribution</h2>
        <p>
          When sharing images on social media or online, we appreciate (though do not require) a credit to <strong>@zarconephotography</strong> or "Photo: Zarcone Photography." This helps other families and athletes find us — and we genuinely appreciate the support.
        </p>

        <h2>Prohibited Uses</h2>
        <p>The following uses are <strong>not permitted</strong> under the personal use license:</p>
        <ul>
          <li>Use in advertising, marketing, or any commercial context without a separate commercial license</li>
          <li>Sale or resale of images in any form (prints, digital files, NFTs, etc.)</li>
          <li>Use by businesses, organizations, schools, or sports programs for promotional or commercial purposes without written permission</li>
          <li>Submitting images to stock photo libraries or third-party image services</li>
          <li>Removing, cropping out, or obscuring any embedded watermark or copyright notice</li>
          <li>Altering or manipulating images in a way that misrepresents the original work, distorts the subject, or reflects negatively on Zarcone Photography</li>
          <li>Claiming authorship or ownership of the images</li>
        </ul>

        <h2>School & Sports Organization Use</h2>
        <p>
          Schools, athletic programs, booster clubs, and similar organizations wishing to use images in programs, yearbooks, websites, social media, or printed materials must obtain a separate organizational license. Contact us for pricing — rates are reasonable and we actively support local programs.
        </p>

        <h2>Commercial Licensing</h2>
        <p>
          Businesses, brands, and organizations wishing to use images for advertising, editorial, product promotion, or any commercial purpose must obtain a written commercial license prior to use. Licensing fees vary based on intended use, circulation, and duration. Please contact us to discuss your needs.
        </p>

        <h2>Images of Minors</h2>
        <p>
          Images of individuals under the age of 18 require written parental consent before Zarcone Photography may use them for any promotional or marketing purpose. If you are a parent or guardian and have concerns about images of your child, please contact us and we will address your request promptly.
        </p>

        <h2>Website & Social Media Use by Zarcone Photography</h2>
        <p>
          As described in our Terms & Conditions, clients grant Zarcone Photography permission to display session images on our website, portfolio, and social media for promotional purposes. If you prefer your images not be used in this way, please notify us in writing before your session. We will honor all such requests without question.
        </p>

        <h2>Reporting Unauthorized Use</h2>
        <p>
          If you believe images produced by Zarcone Photography are being used in an unauthorized manner — whether by a third party or in violation of this policy — please contact us so we can address it.
        </p>

        <div className={styles.contactBox}>
          <p>
            <strong>Licensing inquiries or questions about this policy:</strong><br />
            Zarcone Photography, LLC &nbsp;·&nbsp; Bridgewater, NJ<br />
            Email: <a href="mailto:tom.zarcone@mac.com">tom.zarcone@mac.com</a> &nbsp;·&nbsp;
            Phone: <a href="tel:9087770631">(908) 777-0631</a>
          </p>
        </div>
      </div>
    </div>
  );
}
