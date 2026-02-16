import React from "react";
import PropertyDetailClient from "@/components/PropertyDetailClient";
import { fetchProperty } from "@/lib/fetchProperty";
import { formatPriceWithCurrency } from "@/utlis/propertyHelpers";
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://aqaargatebe2.onrender.com/api';
const OG_LOGO_URL = `${BASE_URL}/images/logo/og.png`;

function getAbsoluteImageUrl(value) {
  if (!value) return null;
  const raw = typeof value === 'string' ? value : (value?.url || value?.secure_url || value?.path || value?.src);
  if (!raw || typeof raw !== 'string') return null;
  const s = raw.trim();
  if (/^https?:\/\//i.test(s) || s.startsWith('//')) return s.startsWith('//') ? `https:${s}` : s;
  if (s.startsWith('/')) return `${API_BASE.replace(/\/api\/?$/, '')}${s}`;
  return null;
}

function getFirstPropertyImageUrl(property) {
  if (Array.isArray(property?.images) && property.images.length > 0) {
    const u = getAbsoluteImageUrl(property.images[0]);
    if (u) return u;
  }
  for (const key of ['coverImage', 'featuredImage', 'mainImage']) {
    const u = getAbsoluteImageUrl(property?.[key]);
    if (u) return u;
  }
  if (Array.isArray(property?.galleryImages) && property.galleryImages.length > 0) {
    const u = getAbsoluteImageUrl(property.galleryImages[0]);
    if (u) return u;
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const url = `${BASE_URL}/property-detail/${id}`;

  let property = null;
  try {
    property = await fetchProperty(id);
  } catch {
    property = null;
  }

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

  const propertyImageUrl = property ? getFirstPropertyImageUrl(property) : null;
  const ogImages = [];
  if (propertyImageUrl) {
    ogImages.push({ url: propertyImageUrl, width: 1200, height: 630, alt: title });
  }
  ogImages.push({ url: OG_LOGO_URL, width: 1200, height: 630, alt: 'AqaarGate Real Estate' });
  ogImages.push({ url: OG_LOGO_URL, width: 400, height: 400, alt: 'AqaarGate' });

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
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "AqaarGate Real Estate",
      locale: "en_US",
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [propertyImageUrl || OG_LOGO_URL],
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
