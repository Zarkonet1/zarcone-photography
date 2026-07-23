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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.honeybook.com https://*.elfsight.com https://vercel.live https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.honeybook.com https://*.hbportal.co https://*.elfsight.com https://formspree.io https://vercel.live https://vitals.vercel-insights.com https://www.google-analytics.com https://region1.google-analytics.com",
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

// Dead blog posts from the pre-redesign site — content no longer
      // exists under any slug; send to the blog index instead of 404ing
      { source: '/blog/the-benefits-of-professional-senior-photographs', destination: '/blog', permanent: true },
      { source: '/blog/toms-photo-safari',                               destination: '/blog', permanent: true },
      { source: '/blog/posing-your-family-photos',                       destination: '/blog', permanent: true },
      { source: '/blog/tips-for-your-couples-photoshoot',                destination: '/blog', permanent: true },
      { source: '/blog/2024-seniors',                                    destination: '/blog', permanent: true },
    ];
  },
};

export default nextConfig;
