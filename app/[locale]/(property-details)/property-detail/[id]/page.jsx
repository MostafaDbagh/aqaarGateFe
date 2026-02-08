import React from "react";
import PropertyDetailClient from "@/components/PropertyDetailClient";
import { fetchProperty } from "@/lib/fetchProperty";

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
  const url = `${baseUrl}/${locale}/property-detail/${id}`;

  const property = await fetchProperty(id);

  const title = property
    ? `${property.propertyKeyword || 'Premium Property'} for ${property.status === 'rent' ? 'Rent' : 'Sale'} in ${property.city || 'Syria'} | AqaarGate`
    : `Premium Property for Sale & Rent in Syria & Lattakia | Holiday Homes | AqaarGate`;

  const description = property
    ? `Explore ${property.propertyKeyword || 'this premium property'} in ${property.city || 'Syria'}. ${property.propertyType || 'Property'} for ${property.status === 'rent' ? 'rent' : 'sale'}. ${property.description ? property.description.substring(0, 120) + '...' : 'Find your dream property with AqaarGate Real Estate.'}`
    : "Explore detailed information, photos, amenities, and location for premium properties in Syria and Lattakia. Find houses, apartments, holiday homes (بيوت عطلات) for sale and rent (بيع وتأجير). Perfect for expats from Germany, Netherlands, EU countries, and Arab Gulf.";

  const firstImage = property?.images?.[0];
  const imageUrl = typeof firstImage === 'string'
    ? firstImage
    : firstImage?.url || firstImage?.src || '';
  const ogImage = imageUrl
    ? (imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`)
    : `${baseUrl}/images/section/hero-bg.jpg`;

  const ogImageAlt = property?.propertyKeyword || "Premium Property in Syria and Lattakia";

  return {
    title,
    description,
    keywords: [
      'syria real estate',
      'lattakia real estate',
      'property for sale syria',
      'property for rent syria',
      'syria holiday homes',
      'lattakia holiday homes',
      'بيوت عطلات',
      'بيع وتأجير بيوت',
      'عقارات سوريا',
      'property details',
      'syria property listings',
      'lattakia property listings'
    ],
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/property-detail/${id}`,
        ar: `${baseUrl}/ar/property-detail/${id}`,
        'x-default': `${baseUrl}/en/property-detail/${id}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "AqaarGate Real Estate",
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      images: [
        { url: ogImage, width: 1200, height: 630, alt: ogImageAlt },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function page({ params }) {
  const { id } = await params;

  // Always render - let PropertyDetailClient fetch and handle 404 client-side
  // Server fetch may fail (API unreachable, CORS, etc.) but client fetch works
  return <PropertyDetailClient id={id} />;
}
