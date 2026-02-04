// Robots.txt for AqaarGate - Google Search Console friendly
// With localePrefix: 'always', private paths are under /en/... and /ar/...
// Sitemap URL must be absolute. No crawlDelay for Google (it ignores it).

function getBaseUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
  return url.replace(/\/+$/, '');
}

export default function robots() {
  const baseUrl = getBaseUrl();

  // Only disallow real private paths. Do NOT disallow legacy/non-existent paths
  // (e.g. agency-grid, agency-list, property-filter-popup) or GSC shows "Blocked by robots" for URLs that then 404.
  const disallowPaths = [
    '/dashboard/',
    '/add-property/',
    '/my-profile/',
    '/my-property/',
    '/messages/',
    '/my-favorites/',
    '/my-package/',
    '/my-save-search/',
    '/review/',
    '/admin/',
    '/api/',
    '/dev-tools/',
    '/private/',
    // Locale-prefixed private paths (actual URLs with localePrefix: 'always')
    '/en/dashboard/',
    '/ar/dashboard/',
    '/en/add-property/',
    '/ar/add-property/',
    '/en/my-profile/',
    '/ar/my-profile/',
    '/en/my-property/',
    '/ar/my-property/',
    '/en/messages/',
    '/ar/messages/',
    '/en/my-favorites/',
    '/ar/my-favorites/',
    '/en/my-package/',
    '/ar/my-package/',
    '/en/review/',
    '/ar/review/',
    '/en/admin/',
    '/ar/admin/',
    '/en/notifications/',
    '/ar/notifications/',
  ];

  // Explicit Allow for key public paths (prevents accidental blocking; most specific rule wins)
  const allowPaths = ['/en/', '/ar/', '/en', '/ar', '/'];
  return {
    rules: [
      {
        userAgent: '*',
        allow: allowPaths,
        disallow: disallowPaths,
      },
      {
        userAgent: 'Googlebot',
        allow: allowPaths,
        disallow: disallowPaths,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: allowPaths,
        disallow: disallowPaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
