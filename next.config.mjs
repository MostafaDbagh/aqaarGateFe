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
                "frame-src 'self' https://maps.googleapis.com",
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
  
  export default nextConfig;
  
