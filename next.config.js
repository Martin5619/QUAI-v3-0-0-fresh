const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', 'localhost:3002'],
      bodySizeLimit: '2mb'
    }
  },
  webpack: (config) => {
    config.externals = [...config.externals, 'canvas', 'jsdom']
    return config
  },
  images: {
    domains: ['images.unsplash.com'],
  },
  poweredByHeader: false,
  generateEtags: false,
  distDir: '.next',
  crossOrigin: 'anonymous'
}

module.exports = withNextIntl(nextConfig)
