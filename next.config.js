/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'your-backend-domain.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  },
  webpack: (config) => {
    config.cache = false; // ✅ Disable Webpack cache
    return config;
  },
};

module.exports = nextConfig;
