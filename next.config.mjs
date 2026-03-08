/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',       // Generates a static `out/` folder — each route gets its own index.html
  trailingSlash: true,    // /upcoming-events → /upcoming-events/index.html (Netlify-friendly)
  images: {
    unoptimized: true,    // Required for static export (no Next.js image server)
  },
};

export default nextConfig;
