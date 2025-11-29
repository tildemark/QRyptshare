/** @type {import('next').NextConfig} */
const nextConfig = {
  // If running 'npm run build:mobile', use 'export' to create static HTML for the app
  // If running standard 'npm run build', use 'standalone' for Docker
  output: process.env.BUILD_MODE === 'mobile' ? 'export' : 'standalone',
  
  // optimizing images for static export (since Next.js Image Optimization API doesn't work in static export)
  images: {
    unoptimized: process.env.BUILD_MODE === 'mobile',
  },
};

module.exports = nextConfig;