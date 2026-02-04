import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Fix vendor-chunks resolution (prevents MODULE_NOT_FOUND for bundled server deps)
    // Note: next-intl must NOT be externalized - it needs to be bundled so webpack
    // can resolve its "next/navigation" import correctly (Node ESM fails on that)
    serverExternalPackages: [
      '@formatjs/intl-messageformat',
      '@formatjs/intl-localematcher',
      'mime-db',
      'mime-types',
      'form-data',
      'axios',
      'photoswipe',
    ],
    // Transpile next-intl so its imports (e.g. next/navigation) resolve correctly
    transpilePackages: ['next-intl'],
    eslint: {
        // Disable ESLint during builds to avoid circular structure warnings
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Disable TypeScript errors during builds (if needed)
        ignoreBuildErrors: false,
    },
    // Fix for webpack bundling issues
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
        };
      }
      return config;
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
        },
        {
          protocol: 'https',
          hostname: '**.cloudinary.com',
        },
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
        {
          protocol: 'https',
          hostname: 'cdn.pixabay.com',
        },
        {
          protocol: 'https',
          hostname: 'i.pravatar.cc',
        },
        {
          protocol: 'https',
          hostname: '**.amazonaws.com',
        },
        {
          protocol: 'https',
          hostname: '**.s3.amazonaws.com',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
        },
        {
          protocol: 'https',
          hostname: '**.onrender.com',
        },
        {
          protocol: 'https',
          hostname: '**.herokuapp.com',
        },
      ],
      // Legacy domains support (for older Next.js versions)
      domains: ['res.cloudinary.com', 'picsum.photos', 'cdn.pixabay.com', 'i.pravatar.cc', 'example.com'],
      formats: ['image/avif', 'image/webp'],
      deviceSizes: [360, 420, 640, 768, 1024, 1280, 1536, 1920],
      imageSizes: [16, 32, 48, 64, 96, 128, 256],
      unoptimized: false, // Enable optimization by default
    },
    compress: true,
    poweredByHeader: false,
    output: 'standalone',
    async redirects() {
      return [
        // Blog redirects
        { source: '/blog-list', destination: '/blog-grid', permanent: true },
        { source: '/blog', destination: '/blog-grid', permanent: true },
        { source: '/blogs', destination: '/blog-grid', permanent: true },
        
        // Property listing redirects
        { source: '/properties', destination: '/property-list', permanent: true },
        { source: '/listings', destination: '/property-list', permanent: true },
        { source: '/listing', destination: '/property-list', permanent: true },
        
        // Property detail redirects
        { source: '/property/:id', destination: '/property-detail/:id', permanent: true },
        { source: '/properties/:id', destination: '/property-detail/:id', permanent: true },
        { source: '/listing/:id', destination: '/property-detail/:id', permanent: true },
        
        // Agent redirects
        { source: '/agent/:id', destination: '/agents-details/:id', permanent: true },
        { source: '/agent-details/:id', destination: '/agents-details/:id', permanent: true },
        
        // About redirects
        { source: '/about', destination: '/about-us', permanent: true },
        
        // Contact redirects
        { source: '/contact-us', destination: '/contact', permanent: true },
        { source: '/contacts', destination: '/contact', permanent: true },
        
        // Terms redirects
        { source: '/terms', destination: '/terms-and-conditions', permanent: true },
        { source: '/terms-of-use', destination: '/terms-and-conditions', permanent: true },
        
        // Privacy redirects
        { source: '/privacy', destination: '/privacy-policy', permanent: true },
        
        // FAQ redirects
        { source: '/faqs', destination: '/faq', permanent: true },
        { source: '/frequently-asked-questions', destination: '/faq', permanent: true },
        
        // Career redirects
        { source: '/careers', destination: '/career', permanent: true },
        { source: '/jobs', destination: '/career', permanent: true },
        
        // Rental service redirects
        { source: '/rental-service', destination: '/property-rental-service', permanent: true },
        { source: '/rental-services', destination: '/property-rental-service', permanent: true },
        { source: '/rentals', destination: '/property-rental-service', permanent: true },
        
        // Dashboard redirects
        { source: '/dashboard/my-properties', destination: '/my-property', permanent: true },
        { source: '/dashboard/favorites', destination: '/my-favorites', permanent: true },
        { source: '/dashboard/messages', destination: '/messages', permanent: true },
        { source: '/dashboard/profile', destination: '/my-profile', permanent: true },
        { source: '/dashboard/reviews', destination: '/review', permanent: true },
        { source: '/dashboard/package', destination: '/my-package', permanent: true },
        { source: '/dashboard/add-property', destination: '/add-property', permanent: true },
        
        // Admin redirects
        { source: '/admin/dashboard', destination: '/admin/overview', permanent: true },
        { source: '/admin', destination: '/admin/overview', permanent: true },
        
        // Invalid locale codes - redirect to Arabic locale
        { source: '/ar-bh', destination: '/ar', permanent: true },
        { source: '/ar-ae', destination: '/ar', permanent: true },
        { source: '/ar-kw', destination: '/ar', permanent: true },
        
        // Non-existent pages - redirect to home
        { source: '/compare', destination: '/', permanent: true },
        { source: '/home-loan-process', destination: '/', permanent: true },
        
        // 404 page redirect - removed to allow 404 page to work properly
        // { source: '/404', destination: '/', permanent: false },
      ];
    },
    async headers() {
      return [
        {
          // Apply security headers to all routes
          source: '/:path*',
          headers: [
            // XSS Protection
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block'
            },
            // Prevent MIME type sniffing
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            // Prevent clickjacking
            {
              key: 'X-Frame-Options',
              value: 'DENY'
            },
            // Referrer Policy
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin'
            },
            // Permissions Policy
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=()'
            },
            // Content Security Policy (CSP) - Balanced security and functionality
            {
              key: 'Content-Security-Policy',
              value: [
                "default-src 'self'",
                "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com",
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                "img-src 'self' data: https: blob:",
                "font-src 'self' data: https://fonts.gstatic.com",
                // Allow API connections - includes all HTTPS and localhost for development
                "connect-src 'self' https: http://localhost:* ws: wss:",
                "frame-src 'self' https://maps.googleapis.com https://maps.google.com https://www.google.com",
                "object-src 'none'",
                "base-uri 'self'",
                "form-action 'self'",
                "frame-ancestors 'none'"
              ].join('; ')
            },
            // Strict Transport Security (HSTS) - Only if using HTTPS
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains; preload'
            }
          ],
        },
      ];
    },
  };
  
  export default withNextIntl(nextConfig);
  
