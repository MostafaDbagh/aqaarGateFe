import React from "react";
import PropertyDetailClient from "@/components/PropertyDetailClient";
import { fetchProperty } from "@/lib/fetchProperty";
import { formatPriceWithCurrency } from "@/utlis/propertyHelpers";

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
// Absolute URLs required for WhatsApp/Facebook link preview (same for en and ar)
const OG_IMAGE_URL = `${BASE_URL}/images/logo/og.png`;
const OG_IMAGES = [
  { url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'AqaarGate Real Estate' },
  { url: OG_IMAGE_URL, width: 400, height: 400, alt: 'AqaarGate' },
];


export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const url = `${BASE_URL}/${locale}/property-detail/${id}`;

  const property = await fetchProperty(id);

  const priceStr = property?.propertyPrice != null
    ? formatPriceWithCurrency(property.propertyPrice, property?.currency || 'USD')
    : '';
  const locationParts = [property?.neighborhood, property?.city, property?.state, property?.address].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : (property?.city || 'Syria');
  const statusStr = property?.status?.toLowerCase() === 'rent' ? 'Rent' : 'Sale';
  const typeStr = property?.propertyType || 'Property';
  const keywordStr = property?.propertyKeyword || typeStr;

  const title = property
    ? (() => {
        const t = `${keywordStr} for ${statusStr} in ${property.city || 'Syria'}${priceStr ? ` - ${priceStr}` : ''} | AqaarGate`;
        return t.length > 80 ? t.substring(0, 77) + '...' : t;
      })()
    : "Premium Property | Syria & Lattakia | AqaarGate";

  const description = property
    ? (() => {
        const parts = [
          keywordStr,
          statusStr.toLowerCase(),
          locationStr,
          priceStr && `${priceStr}`,
          property?.bedrooms && `${property.bedrooms} bed`,
          property?.bathrooms && `${property.bathrooms} bath`,
          property?.size && `${property.size} m²`
        ].filter(Boolean);
        const desc = parts.join(' • ');
        return desc.length > 80 ? desc.substring(0, 77) + '...' : desc;
      })()
    : "Premium properties in Syria & Lattakia. Buy, rent, holiday homes.";

  const enUrl = `${BASE_URL}/en/property-detail/${id}`;
  const arUrl = `${BASE_URL}/ar/property-detail/${id}`;

  return {
    metadataBase: new URL(BASE_URL),
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
        en: enUrl,
        ar: arUrl,
        'x-default': enUrl,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "AqaarGate Real Estate",
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      alternateLocale: locale === 'ar' ? 'en_US' : 'ar_SA',
      type: "website",
      images: OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_URL],
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
