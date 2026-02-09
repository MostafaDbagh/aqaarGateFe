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
    webpack: (config, { isServer, dev }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
        };
      }
      // Disable source maps in dev to avoid "Failed to get source map" for webpack.js (Next.js 15 chunk naming)
      if (dev) {
        config.devtool = false;
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
      // Use /en/ prefix for final destinations to avoid redirect chains (next-intl adds locale)
      const to = (path) => (path.startsWith('/') ? path : `/${path}`);
      return [
        // Legacy/non-existent paths (fix 404s) - redirect to relevant pages
        { source: '/agency-grid', destination: to('en/agents'), permanent: true },
        { source: '/agency-list', destination: to('en/agents'), permanent: true },
        { source: '/property-filter-popup', destination: to('en/property-list'), permanent: true },
        { source: '/property-details', destination: to('en/property-list'), permanent: true },
        { source: '/blog-detail', destination: to('en/blog-grid'), permanent: true },
        { source: '/contacts', destination: to('en/contact'), permanent: true },
        { source: '/rental-services', destination: to('en/property-rental-service'), permanent: true },

        // Blog redirects (direct to locale to avoid chains)
        { source: '/blog-list', destination: to('en/blog-grid'), permanent: true },
        { source: '/blog', destination: to('en/blog-grid'), permanent: true },
        { source: '/blogs', destination: to('en/blog-grid'), permanent: true },

        // Property listing redirects
        { source: '/properties', destination: to('en/property-list'), permanent: true },
        { source: '/listings', destination: to('en/property-list'), permanent: true },
        { source: '/listing', destination: to('en/property-list'), permanent: true },

        // Property detail redirects (direct to locale)
        { source: '/property/:id', destination: to('en/property-detail/:id'), permanent: true },
        { source: '/properties/:id', destination: to('en/property-detail/:id'), permanent: true },
        { source: '/listing/:id', destination: to('en/property-detail/:id'), permanent: true },

        // Agent redirects
        { source: '/agent/:id', destination: to('en/agents-details/:id'), permanent: true },
        { source: '/agent-details/:id', destination: to('en/agents-details/:id'), permanent: true },

        // About redirects
        { source: '/about', destination: to('en/about-us'), permanent: true },

        // Contact redirects
        { source: '/contact-us', destination: to('en/contact'), permanent: true },

        // Terms redirects
        { source: '/terms', destination: to('en/terms-and-conditions'), permanent: true },
        { source: '/terms-of-use', destination: to('en/terms-and-conditions'), permanent: true },

        // Privacy redirects
        { source: '/privacy', destination: to('en/privacy-policy'), permanent: true },

        // FAQ redirects
        { source: '/faqs', destination: to('en/faq'), permanent: true },
        { source: '/frequently-asked-questions', destination: to('en/faq'), permanent: true },

        // Career redirects
        { source: '/careers', destination: to('en/career'), permanent: true },
        { source: '/jobs', destination: to('en/career'), permanent: true },

        // Rental service redirects
        { source: '/rental-service', destination: to('en/property-rental-service'), permanent: true },
        { source: '/rentals', destination: to('en/property-rental-service'), permanent: true },

        // Dashboard redirects (private - keep as-is for auth flow)
        { source: '/dashboard/my-properties', destination: to('en/my-property'), permanent: true },
        { source: '/dashboard/favorites', destination: to('en/my-favorites'), permanent: true },
        { source: '/dashboard/messages', destination: to('en/messages'), permanent: true },
        { source: '/dashboard/profile', destination: to('en/my-profile'), permanent: true },
        { source: '/dashboard/reviews', destination: to('en/review'), permanent: true },
        { source: '/dashboard/package', destination: to('en/my-package'), permanent: true },
        { source: '/dashboard/add-property', destination: to('en/add-property'), permanent: true },

        // Admin redirects
        { source: '/admin/dashboard', destination: to('en/admin/overview'), permanent: true },
        { source: '/admin', destination: to('en/admin/overview'), permanent: true },

        // Invalid locale codes - redirect to Arabic locale
        { source: '/ar-bh', destination: to('ar'), permanent: true },
        { source: '/ar-ae', destination: to('ar'), permanent: true },
        { source: '/ar-kw', destination: to('ar'), permanent: true },

        // Non-existent pages - redirect to home
        { source: '/compare', destination: to('en'), permanent: true },
        { source: '/home-loan-process', destination: to('en'), permanent: true },
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
  
