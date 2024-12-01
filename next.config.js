/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { 
    unoptimized: true,
    domains: ['images.unsplash.com']
  },
  // Remove static export to support middleware
  experimental: {
    serverActions: true
  }
};

module.exports = nextConfig;