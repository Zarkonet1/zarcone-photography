import { notFound } from 'next/navigation';
import { getProspectTrigger } from '@/lib/prospectTriggers/registry';
import ProspectTrigger from '@/components/ProspectTrigger/ProspectTrigger';

// One route file for every Prospect Trigger. Adding Prospect #2 means adding
// a data file + one registry.js line — never touching this file or
// components/ProspectTrigger. See app/high_school/layout.jsx for the
// noindex/nofollow default every page under this route inherits.

export async function generateMetadata({ params }) {
  const data = getProspectTrigger(params.school, params.sport);
  if (!data) return {};

  return {
    title: data.meta.title,
    description: data.meta.description,
    openGraph: {
      title: data.meta.title,
      description: data.meta.description,
      type: 'website',
      images: data.meta.ogImage ? [{ url: data.meta.ogImage, width: 1200, height: 800 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.meta.title,
      images: data.meta.ogImage ? [data.meta.ogImage] : undefined,
    },
  };
}

export default function ProspectTriggerPage({ params }) {
  const data = getProspectTrigger(params.school, params.sport);
  if (!data) notFound();

  return <ProspectTrigger data={data} />;
}
