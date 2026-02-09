import React from "react";
import PropertyDetailClient from "@/components/PropertyDetailClient";
import { fetchProperty } from "@/lib/fetchProperty";
import { formatPriceWithCurrency } from "@/utlis/propertyHelpers";

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

const OG_LOGO = '/en/opengraph-image';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
  const url = `${baseUrl}/property-detail/${id}`;

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

  const ogImage = `${baseUrl}${OG_LOGO}`;
  const ogImageAlt = property?.propertyKeyword || `${typeStr} in ${property?.city || 'Syria'} - AqaarGate`;

  return {
    metadataBase: new URL(baseUrl),
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
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "AqaarGate Real Estate",
      locale: "en_US",
      type: "website",
      images: [
        { url: ogImage, width: 1200, height: 630, alt: ogImageAlt },
      ],
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
  return <PropertyDetailClient id={id} />;
}
