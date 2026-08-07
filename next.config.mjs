/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // Cache optimized images for 24 hours on CDN (reduces origin transfer)
    deviceSizes: [640, 750, 828, 1080, 1200], // Only generate necessary breakpoints
    imageSizes: [16, 32, 64, 96, 128, 256],   // Avoid generating too many sizes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
