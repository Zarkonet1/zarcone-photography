/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  async headers() {
    return [
      {
        // Apply security headers site-wide
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.honeybook.com https://*.elfsight.com https://vercel.live https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms https://c.clarity.ms",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.honeybook.com https://*.hbportal.co https://*.elfsight.com https://formspree.io https://vercel.live https://vitals.vercel-insights.com https://www.google-analytics.com https://region1.google-analytics.com https://www.clarity.ms https://scripts.clarity.ms https://c.clarity.ms",
              "frame-src 'self' https://*.honeybook.com https://*.hbportal.co https://*.elfsight.com https://player.vimeo.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
      {
        source: '/blog',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ];
  },

  async redirects() {
    return [
      // Legacy Sports-Photos gallery URLs → client area
      { source: '/sports-photos/:slug*',   destination: '/client-area', permanent: true },

      // Legacy event gallery pages → client area
      { source: '/john-f-carty-scholarship-fund-golf-outing-12jul21',          destination: '/client-area', permanent: true },
      { source: '/john-f-carty-scholarship-fund-golf-outing-12jul21/:slug*',   destination: '/client-area', permanent: true },

      // Legacy contact page → about
      { source: '/contact-us',             destination: '/about',       permanent: true },
{ source: '/about-us', destination: '/about', permanent: true },

      // Old pricing page slug → current pricing page
      { source: '/pricing-info',           destination: '/pricing',     permanent: true },

      // Old proofing/browse links → client area
      { source: '/browse',                 destination: '/client-area', permanent: true },
      { source: '/browse/:slug*',          destination: '/client-area', permanent: true },

      // Legacy SmugMug gallery links (found 404ing in GA4, 2026-07-27) → client area
      { source: '/2025-2026-brhs-wrestling/:slug*',      destination: '/client-area', permanent: true },
      { source: '/20251031-brhs-fb-v-linden/:slug*',     destination: '/client-area', permanent: true },
      { source: '/21may22-rinas-40th-birthday-party/:slug*', destination: '/client-area', permanent: true },

      // Typo'd football link (underscore instead of hyphen) — found 404ing in GA4, 2026-07-27
      { source: '/brhs_football',          destination: '/brhs-panther-football', permanent: true },

// Dead blog posts from the pre-redesign site — content no longer
      // exists under any slug; send to the blog index instead of 404ing
      { source: '/blog/the-benefits-of-professional-senior-photographs', destination: '/blog', permanent: true },
      { source: '/blog/toms-photo-safari',                               destination: '/blog', permanent: true },
      { source: '/blog/posing-your-family-photos',                       destination: '/blog', permanent: true },
      { source: '/blog/tips-for-your-couples-photoshoot',                destination: '/blog', permanent: true },
      { source: '/blog/2024-seniors',                                    destination: '/blog', permanent: true },
      { source: '/blog/how-to-pick-the-perfect-professional-photographer-', destination: '/blog', permanent: true },

      // Legacy event gallery page — no current equivalent; send to /events
      // (found still 404ing after middleware lowercasing, 2026-08-25)
      { source: '/bpoe-1388-holiday-family-photos', destination: '/events', permanent: true },

      // Legacy combined legal page (pre-redesign site had one page for all
      // three); split into /terms, /privacy, /acceptable-use since. No
      // redirect existed for the old combined URL — found 404ing, 2026-08-25.
      { source: '/terms-conditions-privacy', destination: '/terms', permanent: true },

      // Orphaned SmugMug API image-transform URLs (not real pages — old
      // gallery widget's internal API surface, e.g. /api/v2/image/X-0!regions).
      // Some already 404, some still serve with noindex; catch the whole
      // prefix so all variants land somewhere real instead of splitting
      // between 404 and stale-noindex in GSC. Found 2026-08-25.
      { source: '/api/v2/:path*', destination: '/client-area', permanent: true },

      // Isolated malformed/truncated inbound link (likely a cut-off share
      // link) — not part of the /2025-2026-brhs-wrestling gallery rule
      // above since it has no slug at all. Found 404ing, 2026-08-25.
      { source: '/2025-2026-', destination: '/client-area', permanent: true },
    ];
  },
};

export default nextConfig;
