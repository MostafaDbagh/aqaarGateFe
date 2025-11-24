"use client";
import { usePathname } from 'next/navigation';

export default function EnhancedSEO() {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
  
  // Comprehensive Organization Schema with more details
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${baseUrl}/#organization`,
    "name": "AqaarGate Real Estate",
    "alternateName": "AqaarGate",
    "description": "Leading real estate platform in Syria and Lattakia. Premium properties for sale and rent. Expert guidance for expats from Germany, Netherlands, EU countries, and Arab Gulf (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman).",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/images/logo/logo-2@2x.png`,
      "width": 272,
      "height": 84
    },
    "image": `${baseUrl}/images/logo/logo-2@2x.png`,
    "telephone": "+971549967817",
    "email": "info@aqaargate.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Lattakia",
      "addressLocality": "Lattakia",
      "addressRegion": "Lattakia Governorate",
      "addressCountry": "SY"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 35.5167,
      "longitude": 35.7833
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+971549967817",
        "contactType": "customer service",
        "availableLanguage": ["English", "Arabic"],
        "areaServed": ["SY", "DE", "NL", "AE", "SA", "QA", "KW", "BH", "OM"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+971549967817",
        "contactType": "sales",
        "availableLanguage": ["English", "Arabic"]
      }
    ],
    "sameAs": [
      "https://www.facebook.com/aqaargate",
      "https://www.twitter.com/aqaargate",
      "https://www.instagram.com/aqaargate",
      "https://www.linkedin.com/company/aqaargate"
    ],
    "areaServed": [
      {
        "@type": "Country",
        "name": "Syria"
      },
      {
        "@type": "City",
        "name": "Lattakia"
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
            "name": "Property Sales in Syria",
            "description": "Expert assistance with buying and selling properties in Syria and Lattakia"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Rentals in Syria",
            "description": "Professional property rental services in Syria and Lattakia"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Holiday Homes & Vacation Rentals",
            "description": "Premium holiday homes (بيوت عطلات) and vacation rental properties in Syria and Lattakia"
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
            "name": "Real Estate Investment Consultation",
            "description": "Expert advice on property investment in Syria for international buyers"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  // Enhanced WebSite Schema with SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "name": "AqaarGate Real Estate",
    "url": baseUrl,
    "description": "Find your dream property in Syria and Lattakia. Premium real estate platform for buying, selling, and renting properties. Perfect for expats from EU and Gulf countries.",
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "inLanguage": ["en", "ar"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/property-list?keyword={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // ItemList Schema for property listings
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Syria & Lattakia Property Listings",
    "description": "Comprehensive list of properties for sale and rent in Syria and Lattakia",
    "url": `${baseUrl}/property-list`,
    "numberOfItems": "500+",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Properties for Sale",
        "url": `${baseUrl}/property-list?status=sale`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Properties for Rent",
        "url": `${baseUrl}/property-list?status=rent`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Holiday Homes",
        "url": `${baseUrl}/property-list?propertyType=Holiday Home`
      }
    ]
  };

  // Breadcrumb Schema (dynamic based on pathname)
  const getBreadcrumbSchema = () => {
    const breadcrumbs = [
      { name: "Home", url: baseUrl }
    ];

    if (pathname === '/') {
      return {
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
    }

    const pathSegments = pathname.split('/').filter(Boolean);
    pathSegments.forEach((segment, index) => {
      const url = `${baseUrl}/${pathSegments.slice(0, index + 1).join('/')}`;
      const name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      breadcrumbs.push({ name, url });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
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
      {pathname === '/property-list' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListSchema),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBreadcrumbSchema()),
        }}
      />
    </>
  );
}

