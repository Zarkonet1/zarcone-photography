// Landing page for HoneyBook contact-form submissions (set as the form's
// "Send leads to a URL of your choice" redirect). Exists so GA4 can count
// real inquiries. Not for search: noindex, not in the sitemap.
export const metadata = {
  title: 'Thank You | Zarcone Photography',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function ThankYouLayout({ children }) {
  return children;
}
