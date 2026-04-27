/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable PWA features
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP']
  },
  // Optimize for mobile performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  // Enable service worker for PWA
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;