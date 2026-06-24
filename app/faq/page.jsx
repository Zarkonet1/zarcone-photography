'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import styles from './page.module.css';

const FAQS = [
  {
    category: 'Booking & Pricing',
    items: [
      {
        q: 'How do I book a session?',
        a: 'Start by sending an inquiry through the contact form or calling (908) 777-0631. We\'ll discuss your needs, confirm availability, and send over a booking agreement. A signed contract and retainer reserve your date.',
      },
      {
        q: 'How far in advance should I book?',
        a: 'For portrait sessions, 2–4 weeks is usually enough. Sports events and multi-hour events should be booked 4–8 weeks out. Graduation season (April–June) fills up fast — the earlier the better.',
      },
      {
        q: 'Do you require a deposit?',
        a: 'Yes — a non-refundable retainer is required to hold your date. The amount is outlined in your booking agreement. The remaining balance is due before or on the day of the session.',
      },
      {
        q: 'What is your cancellation policy?',
        a: 'Retainers are non-refundable. Sessions may be rescheduled once at no charge with at least 72 hours\' notice, subject to availability. Outdoor sessions affected by severe weather will always be rescheduled at no charge.',
      },
      {
        q: 'Do you offer packages or à la carte pricing?',
        a: 'Both. See the Pricing page for current session rates and package options. Custom quotes are available for events, sports programs, and corporate work.',
      },
    ],
  },
  {
    category: 'The Session',
    items: [
      {
        q: 'How long does a portrait session take?',
        a: 'Most portrait sessions run 1–2 hours depending on the package. Senior portrait sessions often run longer to allow for multiple looks and locations.',
      },
      {
        q: 'Where do portrait sessions take place?',
        a: 'Sessions can be held on location at a spot meaningful to you — a local park, your home, a school campus — or at a selected outdoor setting. Studio-style setups can also be arranged. We\'ll discuss location during the booking process.',
      },
      {
        q: 'What should I wear?',
        a: 'Wear something you feel comfortable and confident in. Solid colors and simple patterns tend to photograph better than busy prints. Avoid logos. For seniors, many clients bring 2–3 outfit changes — that\'s encouraged.',
      },
      {
        q: 'What if the weather is bad?',
        a: 'For outdoor sessions, we monitor the forecast closely and will reach out if conditions look problematic. Light overcast is actually ideal for portraits. Heavy rain or severe weather means we reschedule — no penalty, no stress.',
      },
      {
        q: 'How far do you travel?',
        a: 'Based in Bridgewater, NJ — we regularly cover all of New Jersey, New York City, and the Philadelphia area. Travel outside that range is possible for events and sports; contact us to discuss.',
      },
      {
        q: 'Do you photograph video as well?',
        a: 'Yes. Videography is available for events and select other sessions. Mention it during the booking inquiry and we\'ll include it in your quote.',
      },
    ],
  },
  {
    category: 'Your Photos',
    items: [
      {
        q: 'How many photos will I receive?',
        a: 'It depends on the session type. Portrait sessions typically deliver 30–75 edited images. Event coverage delivers more. The exact range is outlined in your booking agreement.',
      },
      {
        q: 'How long until I receive my photos?',
        a: 'Portrait sessions: 2–4 weeks. Events: 3–6 weeks. Rush delivery may be available for an additional fee — ask when booking if timing is a concern.',
      },
      {
        q: 'How are photos delivered?',
        a: 'Photos are delivered through an online gallery via Pic-Time. You\'ll receive a private link to view, download, and order prints directly from your gallery.',
      },
      {
        q: 'Can I order prints through you?',
        a: 'Yes — your Pic-Time gallery is connected to professional print fulfillment. You can order prints, canvases, albums, and other products directly from your gallery at professional quality.',
      },
      {
        q: 'Can I get the raw, unedited files?',
        a: 'Raw files are not included and are not available for purchase. Every delivered image goes through a professional editing process — that\'s part of what you\'re hiring us for.',
      },
      {
        q: 'Who owns the photos?',
        a: 'Zarcone Photography retains copyright of all images. Clients receive a personal use license — you can print them, share them, and use them for personal purposes. Commercial use requires a separate license. See the Acceptable Use Policy for details.',
      },
      {
        q: 'Can I share my photos on social media?',
        a: 'Absolutely. We love seeing clients share their images. A tag or credit to @zarconephotography is always appreciated but never required.',
      },
    ],
  },
  {
    category: 'Sports Photography',
    items: [
      {
        q: 'What sports do you cover?',
        a: 'Football, wrestling, lacrosse, softball, basketball, gymnastics, baseball, soccer, track and field, and more. If it\'s a sport, we\'ve probably shot it.',
      },
      {
        q: 'Do you cover youth and high school sports?',
        a: 'Yes — the majority of our sports work is high school athletics across New Jersey. We also cover youth travel teams, club sports, and college events.',
      },
      {
        q: 'Can you cover a full season?',
        a: 'Yes. Season-long coverage packages are available for teams and programs. Contact us early — season packages book out well in advance.',
      },
      {
        q: 'Can schools and booster clubs use the photos?',
        a: 'Schools, athletic programs, and booster clubs need an organizational license for promotional use. Rates are reasonable and we actively support local programs — reach out to discuss.',
      },
      {
        q: 'Do you create sports posters and design work?',
        a: 'Yes — Design is one of our core services. Senior composite posters, team graphics, and branded imagery are all available. See the Design page for examples.',
      },
    ],
  },
  {
    category: 'General',
    items: [
      {
        q: 'Are you insured?',
        a: 'Yes. Zarcone Photography carries professional liability and equipment insurance. Certificates of insurance are available upon request for venues and events that require them.',
      },
      {
        q: 'Do you photograph both individuals and groups?',
        a: 'Yes — individuals, couples, families, teams, and large events. No group is too small or too large.',
      },
      {
        q: 'I\'m not photogenic. Can you still help me?',
        a: 'Everyone says that — and almost no one means it once they see the results. A big part of this job is making people feel at ease in front of the camera. Give us 10 minutes and you\'ll forget the camera is there.',
      },
      {
        q: 'How do I access my gallery after the session?',
        a: 'You\'ll receive a private link to your Pic-Time gallery by email. Galleries remain available after delivery — download your images at any time.',
      },
      {
        q: 'I have a question that isn\'t answered here.',
        a: 'Just reach out. Call (908) 777-0631 or use the contact form and we\'ll get back to you within 24 hours.',
      },
    ],
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState({});

  function toggle(catIdx, itemIdx) {
    const key = `${catIdx}-${itemIdx}`;
    setOpen(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Frequently Asked Questions"
        description="Everything you need to know before booking. Don't see your question? Just ask."
        imageSrc="/photos/tz-headshot.jpg"
      />

      <div className={styles.page}>
        {FAQS.map((section, catIdx) => (
          <div key={catIdx} className={styles.section}>
            <h2 className={styles.category}>{section.category}</h2>
            <div className={styles.items}>
              {section.items.map((item, itemIdx) => {
                const key = `${catIdx}-${itemIdx}`;
                const isOpen = !!open[key];
                return (
                  <div key={itemIdx} className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
                    <button
                      className={styles.question}
                      onClick={() => toggle(catIdx, itemIdx)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.q}</span>
                      <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className={styles.answer}>
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className={styles.cta}>
          <p className="eyebrow">Still have questions?</p>
          <h2 className={styles.ctaH}>Let's talk.</h2>
          <p className={styles.ctaP}>
            Call <a href="tel:9087770631">(908) 777-0631</a> or send a message — we'll get back to you within 24 hours.
          </p>
          <Link href="/about#contact" className="btn btn-solid">Send a Message</Link>
        </div>
      </div>
    </>
  );
}
