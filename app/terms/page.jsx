import styles from '../legal.module.css';

export const metadata = {
  title: 'Terms & Conditions — Zarcone Photography',
  description: 'Terms and conditions for photography services provided by Zarcone Photography, LLC.',
};

export default function Terms() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>Legal</span>
        <h1 className={styles.title}>Terms &amp; Conditions</h1>
        <p className={styles.updated}>Last updated: June 10, 2026</p>
      </div>

      <div className={styles.body}>
        <h2>Agreement</h2>
        <p>
          These Terms & Conditions govern your use of zarconephotography.com and any photography, videography, or design services provided by Zarcone Photography, LLC ("Photographer," "we," or "us") based in Bridgewater, New Jersey. By using this website or engaging our services, you agree to these terms in full.
        </p>

        <h2>Services</h2>
        <p>
          Zarcone Photography provides portrait photography, sports photography, event photography and videography, and graphic design services. The specific scope, deliverables, timeline, and pricing for each engagement are outlined in a separate written agreement or contract provided at the time of booking.
        </p>

        <h2>Booking & Deposits</h2>
        <p>
          A non-refundable retainer (deposit) is required to secure your session date. The amount will be specified in your booking agreement. Your date is not confirmed until the signed agreement and retainer have been received. The remaining balance is due on or before the date of the session unless otherwise agreed in writing.
        </p>

        <h2>Cancellation & Rescheduling</h2>
        <ul>
          <li><strong>Client cancellation:</strong> Retainers are non-refundable. If you cancel with less than 72 hours' notice, you may forfeit any payments made.</li>
          <li><strong>Rescheduling:</strong> Sessions may be rescheduled once at no charge with at least 72 hours' notice, subject to availability. Additional rescheduling may incur a fee.</li>
          <li><strong>Weather:</strong> Outdoor sessions affected by severe weather will be rescheduled at no charge.</li>
          <li><strong>Photographer cancellation:</strong> In the rare event we must cancel (illness, emergency), we will provide a full refund or reschedule at your preference.</li>
        </ul>

        <h2>Copyright & Image Ownership</h2>
        <p>
          Zarcone Photography retains full copyright ownership of all photographs and videos created during any engagement. All images and videos are the intellectual property of Zarcone Photography, LLC, regardless of who commissioned the work.
        </p>
        <p>
          Clients receive a personal use license as described in our Acceptable Use Policy. Commercial use, editorial licensing, or any use beyond the granted personal license requires written permission and may require a separate licensing fee.
        </p>

        <h2>Image Delivery</h2>
        <p>
          Edited images will be delivered within the timeframe specified in your booking agreement, typically 2–4 weeks for portrait sessions and 3–6 weeks for events. Delivery is via online gallery. Raw (unedited) files are not included and are not available for purchase.
        </p>

        <h2>Model Release</h2>
        <p>
          By booking a session, you grant Zarcone Photography permission to use the resulting images for portfolio display, website, social media, and promotional materials unless you specifically request otherwise in writing prior to the session. Images of minors will not be used for marketing purposes without explicit written consent from a parent or guardian.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          In the event of equipment failure, unforeseen circumstances, or any other failure to deliver agreed-upon work, Photographer's liability is limited to a refund of monies paid. Photographer is not responsible for failure to capture specific moments, guests, or details not specifically requested in writing. We are not liable for indirect, consequential, or incidental damages of any kind.
        </p>

        <h2>Website Disclaimer</h2>
        <p>
          The content on zarconephotography.com is provided for general informational purposes only. Pricing, availability, and service offerings are subject to change without notice. Nothing on this site constitutes a binding offer or contract until confirmed in a signed written agreement.
        </p>

        <h2>Governing Law</h2>
        <p>
          These terms are governed by and construed in accordance with the laws of the State of New Jersey. Any disputes arising from these terms or from services provided shall be subject to the jurisdiction of the courts of Somerset County, New Jersey.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Updated terms will be posted on this page with a revised date. Continued use of this site after changes constitutes acceptance of the revised terms.
        </p>

        <div className={styles.contactBox}>
          <p>
            <strong>Questions about these terms?</strong><br />
            Zarcone Photography, LLC &nbsp;·&nbsp; Bridgewater, NJ<br />
            Email: <a href="mailto:info@zarconephotography.com">info@zarconephotography.com</a> &nbsp;·&nbsp;
            Phone: <a href="tel:9087770631">(908) 777-0631</a>
          </p>
        </div>
      </div>
    </div>
  );
}
