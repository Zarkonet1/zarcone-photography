// Default privacy/security posture for EVERY Prospect Trigger page —
// noindex, nofollow, by default, not something to remember per-page. See
// public/robots.txt for the matching Disallow, and lib/prospectTriggers/ for
// the reusable data-driven framework this wraps.
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
