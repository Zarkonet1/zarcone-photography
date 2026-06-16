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
