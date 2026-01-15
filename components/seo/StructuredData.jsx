export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "AqaarGate Real Estate",
    "alternateName": "AqaarGate",
    "legalName": "AqaarGate Real Estate",
    "description": "AqaarGate - Premium real estate services for buying, selling, and renting properties in Syria and Lattakia. Expert guidance for international property buyers.",
    "url": baseUrl,
    "sameAs": [
      `${baseUrl}`,
      "https://www.facebook.com/profile.php?id=61585950591929",
      "https://www.twitter.com/aqaargate",
      "https://www.instagram.com/aqaargate",
      "https://www.linkedin.com/company/aqaargate"
    ],
    "logo": `${baseUrl}/images/logo/logo@2x.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-0123",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Baghdad Street",
      "addressLocality": "Lattakia",
      "addressRegion": "Lattakia Governorate",
      "addressCountry": "SY",
      "postalCode": "12345"
    },
    "serviceArea": [
      {
        "@type": "Country",
        "name": "Syria"
      },
      {
        "@type": "Country",
        "name": "Germany"
      },
      {
        "@type": "Country",
        "name": "Netherlands"
      },
      {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 35.5167,
          "longitude": 35.7833
        },
        "geoRadius": {
          "@type": "Distance",
          "name": "Syria and International Markets"
        }
      }
    ],
    "areaServed": [
      {
        "@type": "Country",
        "name": "Syria"
      },
      {
        "@type": "Country",
        "name": "Germany"
      },
      {
        "@type": "Country",
        "name": "Netherlands"
      },
      {
        "@type": "Country",
        "name": "United Arab Emirates"
      },
      {
        "@type": "Country",
        "name": "Saudi Arabia"
      },
      {
        "@type": "Country",
        "name": "Qatar"
      },
      {
        "@type": "Country",
        "name": "Kuwait"
      },
      {
        "@type": "Country",
        "name": "Bahrain"
      },
      {
        "@type": "Country",
        "name": "Oman"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Real Estate Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Sales",
            "description": "Expert assistance with buying and selling properties"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Rentals",
            "description": "Professional property rental services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Management",
            "description": "Comprehensive property management services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Holiday Homes & Vacation Rentals",
            "description": "Premium holiday homes and vacation rental properties in Syria and Lattakia"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Beach & Coastal Properties",
            "description": "Exclusive beach and coastal properties for sale and rent"
          }
        }
      ]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AqaarGate Real Estate",
    "alternateName": "AqaarGate",
    "url": baseUrl,
    "description": "AqaarGate - The #1 Real Estate Platform in Syria & Lattakia. Find 1000+ verified properties for sale and rent. Buy, sell, and rent properties in Syria. Holiday homes (بيوت عطلات), villas, apartments.",
    "keywords": "aqaargate, aqaargate.com, #1 real estate syria, real estate syria, properties syria, lattakia properties, syria holiday homes, بيوت عطلات سوريا, aqaargate real estate",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/property-list?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}
