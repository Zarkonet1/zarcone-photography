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
      // Legacy blog posts → About page (caseSensitive: true so /blog is not affected)
      { source: '/Blog',                                                          destination: '/about',        permanent: true, caseSensitive: true },
      { source: '/Blog/:slug*',                                                   destination: '/about',        permanent: true, caseSensitive: true },

      // Legacy Sports-Photos gallery URLs → client area
      { source: '/Sports-Photos/:slug*',                                          destination: '/client-area',  permanent: true, caseSensitive: true },

      // Legacy event gallery pages → client area
      { source: '/John-F-Carty-Scholarship-Fund-Golf-Outing-12JUL21',            destination: '/client-area',  permanent: true, caseSensitive: true },
      { source: '/John-F-Carty-Scholarship-Fund-Golf-Outing-12JUL21/:slug*',     destination: '/client-area',  permanent: true, caseSensitive: true },

      // Legacy contact page → about
      { source: '/Contact-Us',                                                    destination: '/about',        permanent: true, caseSensitive: true },
    ];
  },
};

export default nextConfig;
