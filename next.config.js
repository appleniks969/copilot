/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  async rewrites() {
    return [
      // If you need to proxy API requests
      // {
      //   source: '/api/metrics/:path*',
      //   destination: 'https://your-external-api.com/:path*',
      // },
    ];
  },
};

module.exports = nextConfig;
