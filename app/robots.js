export default function robots() {
  const baseUrl = 'https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/property-list',
          '/property-gird-left-sidebar',
          '/property-gird-right-sidebar',
          '/property-list-left-sidebar',
          '/property-list-right-sidebar',
          '/property-gird-top-search',
          '/property-list-top-search',
          '/property-half-map-grid',
          '/property-half-map-list',
          '/property-half-top-map',
          '/property-list-full-width',
          '/property-filter-popup',
          '/property-filter-popup-left',
          '/property-filter-popup-right',
          '/agents',
          '/agency-grid',
          '/blog-grid',
          '/contact',
          '/faq',
          '/career',
          '/compare',
          '/home-loan-process'
        ],
        disallow: [
          '/dashboard/',
          '/add-property/',
          '/my-profile/',
          '/my-property/',
          '/messages/',
          '/my-favorites/',
          '/my-package/',
          '/my-save-search/',
          '/review/',
          '/dev-tools/',
          '/api/',
          '/admin/',
          '/private/'
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/add-property/',
          '/my-profile/',
          '/my-property/',
          '/messages/',
          '/my-favorites/',
          '/my-package/',
          '/my-save-search/',
          '/review/',
          '/dev-tools/',
          '/api/',
          '/admin/',
          '/private/'
        ],
        crawlDelay: 0,
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}
