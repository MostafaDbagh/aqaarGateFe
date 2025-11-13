export default function AdvancedSEO() {
  // Advanced SEO Schema for Real Estate
  const realEstateSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Proty Real Estate",
    "description": "Premium real estate services in Syria and Lattakia",
    "url": "https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com",
    "logo": "https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/images/logo/logo-2@2x.png",
    "image": "https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/images/logo/logo-2@2x.png",
    "telephone": "+1-555-0123",
    "email": "info@protyrealestate.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Real Estate Street",
      "addressLocality": "Lattakia",
      "addressRegion": "Lattakia Governorate",
      "addressCountry": "SY",
      "postalCode": "12345"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 35.5167,
      "longitude": 35.7833
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Lattakia",
        "containedInPlace": {
          "@type": "Country",
          "name": "Syria"
        }
      },
      {
        "@type": "Country",
        "name": "Syria"
      }
    ],
    "serviceType": [
      "Real Estate Sales",
      "Property Rentals",
      "Holiday Home Rentals",
      "Property Management",
      "Real Estate Investment Consultation"
    ],
    "priceRange": "$$",
    "currenciesAccepted": "SYP, USD, EUR",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "openingHours": "Mo-Fr 09:00-18:00, Sa 09:00-16:00",
    "sameAs": [
      "https://www.facebook.com/protyrealestate",
      "https://www.twitter.com/protyrealestate",
      "https://www.instagram.com/protyrealestate",
      "https://www.linkedin.com/company/protyrealestate"
    ]
  };

  // Local Business Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/#localbusiness",
    "name": "Proty Real Estate",
    "description": "Leading real estate agency in Syria and Lattakia",
    "url": "https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com",
    "telephone": "+1-555-0123",
    "email": "info@protyrealestate.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Real Estate Street",
      "addressLocality": "Lattakia",
      "addressRegion": "Lattakia Governorate",
      "addressCountry": "SY"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 35.5167,
      "longitude": 35.7833
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "16:00"
      }
    ],
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Ahmed Al-Mahmoud"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Excellent service! Found my dream home in Lattakia through Proty Real Estate."
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sarah Johnson"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Professional and knowledgeable team. Great experience buying property in Syria."
      }
    ]
  };

  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Syria Real Estate Services",
    "description": "Comprehensive real estate services in Syria and Lattakia",
    "provider": {
      "@type": "RealEstateAgent",
      "name": "Proty Real Estate",
      "url": "https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "Syria"
      },
      {
        "@type": "City",
        "name": "Lattakia"
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
            "description": "Expert assistance with buying and selling properties in Syria"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Rentals",
            "description": "Professional property rental services in Syria and Lattakia"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Holiday Home Rentals",
            "description": "Premium holiday homes and vacation rentals in Syria"
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
            "description": "Expert advice on property investment in Syria"
          }
        }
      ]
    }
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to buy property in Syria?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Buying property in Syria requires proper documentation, legal verification, and understanding of local regulations. Our expert team guides you through the entire process."
        }
      },
      {
        "@type": "Question",
        "name": "What are the best areas for property investment in Lattakia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lattakia offers excellent investment opportunities in beachfront properties, city center apartments, and coastal developments. Our agents provide detailed market analysis."
        }
      },
      {
        "@type": "Question",
        "name": "How to rent holiday homes in Syria?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer a wide selection of holiday homes and vacation rentals in Syria and Lattakia. Contact our team for available properties and rental terms."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(realEstateSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </>
  );
}
