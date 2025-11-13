import React from "react";
import PropertyDetailClient from "@/components/PropertyDetailClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const title = `Property Details in Syria & Lattakia – Sale & Rent | Holiday Homes`;
  const description =
    "Explore detailed information, photos, amenities, and location for premium properties in Syria and Lattakia. Find houses, apartments, and holiday homes for sale and rent.";
  const url = `https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/property-detail/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [
        { url: "/images/section/hero-bg.jpg", width: 1200, height: 630, alt: "Property Details" },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/section/hero-bg.jpg"],
    },
  };
}

export default async function page({ params }) {
  const { id } = await params;

  return <PropertyDetailClient id={id} />;
}
