/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'your-worker-url.workers.dev',
      'cdn.yourdomain.com',
      'localhost'
    ],
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
    // For Cloudflare R2 images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.workers.dev',
      },
      {
        protocol: 'https',
        hostname: 'cdn.yourdomain.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-c13015ac09ec4a868fff8c8caaa675fa.r2.dev',
      },
    ],
  },
  // Turbopack configuration for Next.js 16
  turbopack: {
    resolveAlias: {
      '@': './src',
    },
  },
  // Webpack fallback (for compatibility)
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
    };
    return config;
  },
};

export default nextConfig;