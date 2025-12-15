"use client";

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

/**
 * BrandSEO Component
 * 
 * This component adds critical SEO elements for brand recognition:
 * - Additional meta tags for brand keywords
 * - Canonical URLs
 * - Hreflang tags for multi-language support
 * - Brand-specific structured data
 */
export default function BrandSEO() {
  const pathname = usePathname();
  const locale = useLocale();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
  
  // Get clean pathname (remove locale prefix)
  const cleanPathname = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/') || '/';
  
  // Generate canonical URL
  const canonicalUrl = `${baseUrl}${cleanPathname === '/' ? '' : cleanPathname}`;
  
  // Generate alternate language URLs
  const alternateUrls = {
    en: `${baseUrl}${cleanPathname === '/' ? '/en' : `/en${cleanPathname}`}`,
    ar: `${baseUrl}${cleanPathname === '/' ? '/ar' : `/ar${cleanPathname}`}`,
  };

  return (
    <>
      {/* Brand-specific meta tags */}
      <meta name="application-name" content="AqaarGate" />
      <meta name="apple-mobile-web-app-title" content="AqaarGate" />
      <meta name="brand" content="AqaarGate" />
      <meta name="company" content="AqaarGate Real Estate" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang tags for multi-language support */}
      <link rel="alternate" hrefLang="en" href={alternateUrls.en} />
      <link rel="alternate" hrefLang="ar" href={alternateUrls.ar} />
      <link rel="alternate" hrefLang="x-default" href={alternateUrls.en} />
      
      {/* Additional brand keywords in meta description */}
      <meta name="subject" content="AqaarGate Real Estate - Properties in Syria" />
      <meta name="topic" content="AqaarGate, Real Estate, Syria, Lattakia, Properties" />
      <meta name="summary" content="AqaarGate - Premium Real Estate Properties in Syria & Lattakia" />
      <meta name="classification" content="Real Estate, Property Sales, Property Rentals" />
      <meta name="category" content="Real Estate" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      
      {/* Geo tags */}
      <meta name="geo.region" content="SY-LA" />
      <meta name="geo.placename" content="Lattakia, Syria" />
      <meta name="geo.position" content="35.5167;35.7833" />
      <meta name="ICBM" content="35.5167, 35.7833" />
      
      {/* Additional structured data for brand */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Brand",
            "name": "AqaarGate",
            "alternateName": "AqaarGate Real Estate",
            "url": baseUrl,
            "logo": `${baseUrl}/images/logo/logo@2x.png`,
            "description": "AqaarGate - Premium Real Estate Brand specializing in properties in Syria and Lattakia",
            "slogan": "Find Your Dream Property with AqaarGate",
            "sameAs": [
              `${baseUrl}`,
              "https://www.facebook.com/aqaargate",
              "https://www.twitter.com/aqaargate",
              "https://www.instagram.com/aqaargate",
              "https://www.linkedin.com/company/aqaargate"
            ]
          }),
        }}
      />
    </>
  );
}

