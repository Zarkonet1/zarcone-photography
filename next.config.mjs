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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.honeybook.com https://*.elfsight.com https://vercel.live",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.honeybook.com https://*.hbportal.co https://*.elfsight.com https://formspree.io https://vercel.live https://vitals.vercel-insights.com",
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
    ];
  },
};

export default nextConfig;
