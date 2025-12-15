import React from "react";
import { notFound } from "next/navigation";
import PropertyDetailClient from "@/components/PropertyDetailClient";

// Disable static generation for dynamic routes to avoid build errors
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// Helper function to validate ID format
// Accepts MongoDB ObjectId (24 hex) or other valid string IDs
function isValidId(id) {
  // Must be a non-empty string
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return false;
  }
  // Accept any non-empty string (MongoDB ObjectId, UUID, or other formats)
  // The API will validate the actual format
  return id.trim().length > 0;
}

// Helper function to fetch property from API
async function fetchProperty(id) {
  // Validate ID format first
  if (!id || !isValidId(id)) {
    return null; // Invalid ID format, return null to trigger 404
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aqaargatebe2.onrender.com/api';
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(`${apiUrl}/listing/${id}`, {
        next: { revalidate: 60 }, // Revalidate every minute
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      // If response is not ok (400, 404, 500, etc.), return null to trigger 404
      if (!response.ok) {
        return null; // Any error = property not found = 404
      }

      // Try to parse response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If response is not valid JSON, return null
        return null;
      }

      const property = data?.data || data;
      
      // Check if property exists and is not deleted/sold
      if (!property || property.isDeleted === true || property.isSold === true) {
        return null;
      }

      // Check if property has required fields (valid property)
      if (!property._id && !property.id) {
        return null;
      }

      return property;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      // If fetch fails (network error, timeout, abort, etc.), return null
      return null;
    }
  } catch (error) {
    // If anything else fails, return null to trigger 404
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
  const url = `${baseUrl}/property-detail/${id}`;
  
  // Try to fetch property for better metadata
  const property = await fetchProperty(id);
  
  // Enhanced metadata with more keywords
  const title = property 
    ? `${property.propertyKeyword || 'Premium Property'} for ${property.status === 'rent' ? 'Rent' : 'Sale'} in ${property.city || 'Syria'} | AqaarGate`
    : `Premium Property for Sale & Rent in Syria & Lattakia | Holiday Homes | AqaarGate`;
  
  const description = property
    ? `Explore ${property.propertyKeyword || 'this premium property'} in ${property.city || 'Syria'}. ${property.propertyType || 'Property'} for ${property.status === 'rent' ? 'rent' : 'sale'}. ${property.description ? property.description.substring(0, 120) + '...' : 'Find your dream property with AqaarGate Real Estate.'}`
    : "Explore detailed information, photos, amenities, and location for premium properties in Syria and Lattakia. Find houses, apartments, holiday homes (بيوت عطلات) for sale and rent (بيع وتأجير). Perfect for expats from Germany, Netherlands, EU countries, and Arab Gulf.";

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
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "AqaarGate Real Estate",
      locale: "en_US",
      images: property?.images?.[0] 
        ? [{ url: property.images[0], width: 1200, height: 630, alt: property.propertyKeyword || "Property" }]
        : [{ url: "/images/section/hero-bg.jpg", width: 1200, height: 630, alt: "Premium Property in Syria and Lattakia" }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: property?.images?.[0] ? [property.images[0]] : ["/images/section/hero-bg.jpg"],
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

  // Fetch property server-side to check if it exists
  const property = await fetchProperty(id);

  // If property doesn't exist, return 404
  if (!property) {
    notFound();
  }

  return <PropertyDetailClient id={id} />;
}
