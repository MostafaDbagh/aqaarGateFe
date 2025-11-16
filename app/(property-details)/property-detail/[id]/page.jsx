import React from "react";
import PropertyDetailClient from "@/components/PropertyDetailClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
  const url = `${baseUrl}/property-detail/${id}`;
  
  // Enhanced metadata with more keywords
  const title = `Premium Property for Sale & Rent in Syria & Lattakia | Holiday Homes | AqaarGate`;
  const description =
    "Explore detailed information, photos, amenities, and location for premium properties in Syria and Lattakia. Find houses, apartments, holiday homes (بيوت عطلات) for sale and rent (بيع وتأجير). Perfect for expats from Germany, Netherlands, EU countries, and Arab Gulf.";

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
      images: [
        { url: "/images/section/hero-bg.jpg", width: 1200, height: 630, alt: "Premium Property in Syria and Lattakia" },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/section/hero-bg.jpg"],
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

  return <PropertyDetailClient id={id} />;
}
