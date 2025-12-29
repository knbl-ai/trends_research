/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v3b.fal.media',
        port: '',
        pathname: '/files/**',
      },
      {
        protocol: 'https',
        hostname: 'v3.fal.media',
        port: '',
        pathname: '/files/**',
      },
      {
        protocol: 'https',
        hostname: 'fal.media',
        port: '',
        pathname: '/files/**',
      },
    ],
  },
    webpack: (config, { isServer }) => {
    // Suppress warnings for optional MongoDB dependencies
    if (isServer) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
        'kerberos': 'commonjs kerberos',
        '@mongodb-js/zstd': 'commonjs @mongodb-js/zstd',
        '@aws-sdk/credential-providers': 'commonjs @aws-sdk/credential-providers',
        'gcp-metadata': 'commonjs gcp-metadata',
        'snappy': 'commonjs snappy',
        'socks': 'commonjs socks',
        'aws4': 'commonjs aws4',
        'mongodb-client-encryption': 'commonjs mongodb-client-encryption',
      });
    }
    return config;
  },
};

module.exports = nextConfig;