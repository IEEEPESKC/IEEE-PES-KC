/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    localPatterns: [
      {
        pathname: '/api/admin/file*',
      },
      {
        pathname: '/images/**',
      },
      {
        pathname: '/pes-theme/**',
      },
      {
        pathname: '/uploads/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-c13015ac09ec4a868fff8c8caaa675fa.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '*.ieeepeskc.workers.dev',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
  turbopack: {
    resolveAlias: {
      '@': './src',
    },
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
    };
    return config;
  },
};

export default nextConfig;
