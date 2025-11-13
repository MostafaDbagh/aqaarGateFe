export default function PerformanceOptimization() {
  // Performance optimization meta tags
  const performanceMetaTags = `
    <!-- Performance Optimization -->
    <meta name="format-detection" content="telephone=no" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="AqaarGate Real Estate" />
    
    <!-- DNS Prefetch -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com" />
    <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
    
    <!-- Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    
    <!-- Resource Hints -->
    <link rel="preload" href="/fonts/icomoon.woff" as="font" type="font/woff" crossorigin />
    <link rel="preload" href="/css/bootstrap.css" as="style" />
    <link rel="preload" href="/css/style.css" as="style" />
    
    <!-- Critical CSS -->
    <style>
      /* Critical CSS for above-the-fold content */
      body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
      .header { background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 0; }
      .property-card { background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    </style>
  `;

  // Structured data for performance
  const performanceSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AqaarGate Real Estate",
    "url": "https://AqaarGate-frontend-mostafa-4a0069a6dba8.herokuapp.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://AqaarGate-frontend-mostafa-4a0069a6dba8.herokuapp.com/property-list?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://www.facebook.com/protyrealestate",
      "https://www.twitter.com/protyrealestate",
      "https://www.instagram.com/protyrealestate"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(performanceSchema),
        }}
      />
      <div dangerouslySetInnerHTML={{ __html: performanceMetaTags }} />
    </>
  );
}
