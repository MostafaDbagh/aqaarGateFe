import PropertyRentalServiceClient from "./PropertyRentalServiceClient";
import { getDefaultOgImages, getDefaultOgImageUrls } from "@/lib/defaultOgImages";
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aqaargate.com";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const url = `${baseUrl}/${locale}/property-rental-service`;
  return {
    title: "Property Rental Service - AqaarGate | Syria & Lattakia Real Estate",
    description:
      "AqaarGate property rental services in Syria and Lattakia. Professional management, holiday homes, and vacation rentals. Trusted real estate services.",
    keywords: [
      "syria property rental",
      "lattakia rental service",
      "syria holiday home management",
      "property management syria",
      "vacation rental syria",
    ],
    openGraph: {
      title: "Property Rental Service - AqaarGate | Syria & Lattakia Real Estate",
      description:
        "AqaarGate property rental services in Syria and Lattakia. Professional management, holiday homes, and vacation rentals.",
      url,
      images: getDefaultOgImages(baseUrl, locale),
    },
    twitter: {
      card: "summary_large_image",
      title: "Property Rental Service - AqaarGate",
      description: "Property rental services in Syria and Lattakia. Holiday homes and vacation rentals.",
      images: getDefaultOgImageUrls(baseUrl, locale),
    },
    alternates: { canonical: url },
  };
}

export default function page() {
  return <PropertyRentalServiceClient />;
}
