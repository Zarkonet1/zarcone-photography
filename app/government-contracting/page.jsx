import { COMPANY_DATA, FAQ_GROUPS } from '@/lib/govconData';
import styles from '@/components/govcon/govcon.module.css';

import GovHero from '@/components/govcon/GovHero';
import GovCapabilityDownload from '@/components/govcon/GovCapabilityDownload';
import GovResourceCenter from '@/components/govcon/GovResourceCenter';
import GovWhyUs from '@/components/govcon/GovWhyUs';
import GovExecutiveBio from '@/components/govcon/GovExecutiveBio';
import GovCoreCompetencies from '@/components/govcon/GovCoreCompetencies';
import GovServices from '@/components/govcon/GovServices';
import GovHowWeWork from '@/components/govcon/GovHowWeWork';
import GovDeliveryStandards from '@/components/govcon/GovDeliveryStandards';
import GovCertifications from '@/components/govcon/GovCertifications';
import GovInstitutionalPartnerships from '@/components/govcon/GovInstitutionalPartnerships';
import GovDifference from '@/components/govcon/GovDifference';
import GovWhyBuyersChooseUs from '@/components/govcon/GovWhyBuyersChooseUs';
import GovFAQ from '@/components/govcon/GovFAQ';
import GovReadyToSupport from '@/components/govcon/GovReadyToSupport';
import GovContact from '@/components/govcon/GovContact';
import GovFooter from '@/components/govcon/GovFooter';
import GovScrollDepthTracker from '@/components/govcon/GovScrollDepthTracker';

export const metadata = {
  title: 'SDVOSB Government Photography & Visual Documentation | Zarcone Photography',
  description:
    'Service-Disabled Veteran-Owned Small Business providing institutional visual documentation for federal agencies. SAM.gov registered, SDVOSB certified. Download our capability statement.',
  openGraph: {
    title: 'SDVOSB Government Photography & Visual Documentation | Zarcone Photography',
    description:
      'Service-Disabled Veteran-Owned Small Business providing institutional visual documentation for federal agencies. SAM.gov registered, SDVOSB certified.',
    url: 'https://zarconephotography.com/government-contracting',
    type: 'website',
    images: [
      {
        url: 'https://zarconephotography.com/photos/tz-headshot.jpg',
        width: 1200,
        height: 800,
        alt: 'Zarcone Photography — Government Practice',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://zarconephotography.com/photos/tz-headshot.jpg'],
  },
  alternates: {
    canonical: 'https://zarconephotography.com/government-contracting',
  },
};

const professionalServiceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://zarconephotography.com/government-contracting#service',
  name: 'Zarcone Photography — Government Practice',
  description:
    'Institutional visual documentation for federal agencies: official event and ceremony documentation, executive portraiture, public affairs photography, and multimedia services.',
  url: 'https://zarconephotography.com/government-contracting',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Zarcone Photography',
    url: 'https://zarconephotography.com',
    telephone: COMPANY_DATA.phone,
    email: COMPANY_DATA.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bridgewater',
      addressRegion: 'NJ',
      addressCountry: 'US',
    },
  },
  areaServed: [
    { '@type': 'State', name: 'New Jersey' },
    { '@type': 'State', name: 'New York' },
    { '@type': 'State', name: 'Pennsylvania' },
  ],
  identifier: [
    { '@type': 'PropertyValue', propertyID: 'UEI', value: COMPANY_DATA.uei },
    { '@type': 'PropertyValue', propertyID: 'CAGE', value: COMPANY_DATA.cage },
    { '@type': 'PropertyValue', propertyID: 'NAICS', value: COMPANY_DATA.naicsPrimary.code },
  ],
  slogan: 'Certified. Prepared. Disciplined. Ready to support agency missions.',
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_GROUPS.flatMap((group) =>
    group.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    }))
  ),
};

export default function GovernmentContractingPage() {
  return (
    <div className={styles.govPage}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <GovScrollDepthTracker />

      <GovHero />
      <GovCapabilityDownload />
      <GovResourceCenter />
      <GovWhyUs />
      <GovExecutiveBio />
      <GovCoreCompetencies />
      <GovServices />
      <GovHowWeWork />
      <GovDeliveryStandards />
      <GovCertifications />
      <GovInstitutionalPartnerships />
      <GovDifference />
      <GovWhyBuyersChooseUs />
      <GovFAQ />
      <GovReadyToSupport />
      <GovContact />
      <GovFooter />
    </div>
  );
}
