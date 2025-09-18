/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['v3b.fal.media'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v3b.fal.media',
        port: '',
        pathname: '/files/**',
      },
    ],
  },
};

module.exports = nextConfig;