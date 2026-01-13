
export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
        
          '/',
          '/property-list',                  
          '/property-detail',                  
          '/agents',                           
          '/agents-details',                   
          '/blog-grid',                       
          '/contact',                        
          '/faq',                            
          '/about-us',                       
          '/vision',                          
          '/career',                          
          '/terms-and-conditions',            
          '/privacy-policy',                   
          '/property-rental-service',          
        ],
        disallow: [
          '/dashboard/',                      // Main dashboard (requires authentication)
          '/add-property/',                   // Add new property page (agent only)
          '/my-profile/',                     // User profile management
          '/my-property/',                    // User's property listings
          '/messages/',                       // Private messages
          '/my-favorites/',                   // User's favorite properties
          '/my-package/',                     // User's package/subscription
          '/my-save-search/',                 // Saved search queries
          '/review/',                         // Review management
          
          // Admin pages - Administrative area, should never be indexed
          '/admin/',                          // Admin dashboard and all admin pages
          // API endpoints - Should never be crawled
          '/api/',                            // All API endpoints
          // Development and private areas
          '/dev-tools/',                      // Development tools
          '/private/',                        // Private/internal pages
          
          // Non-existent pages discovered by Google - prevent indexing
          '/property-filter-popup',           // Internal component/page, not a real route
          '/property-filter-popup-left',      // Internal component/page, not a real route
          '/property-half-top-map',           // Internal component/page, not a real route
          '/agency-grid',                     // Internal component/page, not a real route
          '/agency-list',                     // Internal component/page, not a real route
          
          // Static files - prevent indexing
          '/favicon.ico',                     // Site icon file, not a web page
        ],
        crawlDelay: 1,                        //
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
          '/private/',
          // Non-existent pages discovered by Google - prevent indexing
          '/property-filter-popup',
          '/property-filter-popup-left',
          '/property-half-top-map',
          '/agency-grid',
          '/agency-list',
          
          // Static files - prevent indexing
          '/favicon.ico'
        ],
        crawlDelay: 0,                       
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}
