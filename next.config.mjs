/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['res.cloudinary.com', 'picsum.photos', 'cdn.pixabay.com', 'i.pravatar.cc', 'example.com'],
      formats: ['image/avif', 'image/webp'],
      deviceSizes: [360, 420, 640, 768, 1024, 1280, 1536, 1920],
      imageSizes: [16, 32, 48, 64, 96, 128, 256],
    },
    compress: true,
    poweredByHeader: false,
    output: 'standalone',
  };
  
  export default nextConfig;
  
