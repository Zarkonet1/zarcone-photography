// Same noindex/nofollow/nocache posture as every Prospect Trigger page
// (see app/high_school/layout.jsx) — this is a concept build for one
// specific audience (Roger Pelletier, Mahwah's AD, and the football
// coaching staff), not a public marketing page, and makes no partnership
// claim that structured indexing should surface. See public/robots.txt for
// the matching Disallow entry.
export const metadata = {
  title: 'Mahwah Thunderbirds Football — Media Hub Concept | Zarcone Photography',
  description: 'A concept prepared for Mahwah Thunderbirds Football by Zarcone Photography — not an official Mahwah Athletics page.',
  alternates: {
    canonical: '/mahwah-thunderbirds-football',
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: 'Mahwah Thunderbirds Football — Media Hub Concept',
    description: 'A concept prepared for Mahwah Thunderbirds Football by Zarcone Photography.',
    type: 'website',
  },
};

export default function MahwahThunderbirdsFootballLayout({ children }) {
  return children;
}
