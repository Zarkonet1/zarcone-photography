// Default privacy/security posture for EVERY Prospect Trigger page —
// noindex, nofollow, by default, not something to remember per-page. Do NOT
// add these paths to public/robots.txt: a Disallow stops Google from crawling
// the page, so it never reads this noindex tag, and robots.txt is public. See
// lib/prospectTriggers/ for the reusable data-driven framework this wraps.
export const metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function HighSchoolLayout({ children }) {
  return children;
}
