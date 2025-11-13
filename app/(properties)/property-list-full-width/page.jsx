import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";

import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Properties1 from "@/components/properties/Properties1";
import React from "react";

export const metadata = {
  title: "Syria & Lattakia Properties – Full-Width List | Buy & Rent Homes",
  description:
    "Browse a wide selection of houses, apartments, and holiday homes for sale and rent in Lattakia and across Syria. Filter by price, bedrooms, and amenities.",
  keywords: [
    "syria properties for sale",
    "lattakia properties for rent",
    "holiday homes syria",
    "apartments for rent lattakia",
    "villas for sale syria",
    "real estate listings syria",
  ],
  openGraph: {
    title: "Syria & Lattakia Properties – Full-Width List | Buy & Rent Homes",
    description:
      "Browse houses, apartments, and holiday homes for sale and rent. Use filters to find the perfect property in Lattakia and Syria.",
    url: "https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/property-list-full-width",
    images: [
      { url: "/images/section/property-grid-bg.jpg", width: 1200, height: 630, alt: "Property Listings" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Listings – Buy & Rent in Syria and Lattakia",
    description:
      "Discover properties for sale and rent including holiday homes and apartments.",
    images: ["/images/section/property-grid-bg.jpg"],
  },
  alternates: {
    canonical: "https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/property-list-full-width",
  },
};
export default function page() {
  return (
    <>
      <div id="wrapper">
        <Header1 />
        <Breadcumb pageName="Property List Full Width" />
        <div className="main-content">
          <Properties1 />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
