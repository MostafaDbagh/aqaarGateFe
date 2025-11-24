import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";

import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Properties1 from "@/components/properties/Properties1";
import React from "react";

export const metadata = {
  title: "Syria & Lattakia Property Listings - Browse Properties for Sale & Rent",
  description: "Browse our comprehensive collection of properties for sale and rent in Syria and Lattakia. Find your perfect home, apartment, holiday home, or commercial property with advanced search filters.",
  keywords: [
    'syria property listings',
    'lattakia property listings',
    'syria properties for sale',
    'syria properties for rent',
    'lattakia properties for sale',
    'lattakia properties for rent',
    'syria homes for sale',
    'lattakia homes for sale',
    'syria apartments for rent',
    'lattakia apartments for rent',
    'syria holiday homes',
    'lattakia holiday homes',
    'syria vacation rentals',
    'lattakia vacation rentals',
    'syria commercial properties',
    'lattakia commercial properties',
    'syria real estate search',
    'lattakia real estate search',
    'syria property filters',
    'lattakia property filters',
    'syria real estate listings',
    'lattakia real estate listings',
    'syria property search',
    'lattakia property search',
    'syria beach properties',
    'lattakia beach properties',
    'syria coastal properties',
    'lattakia coastal properties',
    'syria villas',
    'lattakia villas',
    'syria land for sale',
    'lattakia land for sale'
  ],
  openGraph: {
    title: "Syria & Lattakia Property Listings - Browse Properties for Sale & Rent",
    description: "Browse our comprehensive collection of properties for sale and rent in Syria and Lattakia. Find your perfect home, apartment, or holiday home with advanced search filters.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/property-list`,
    images: [
      {
        url: '/images/section/property-grid-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Property Listings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Property Listings - Browse All Properties for Sale and Rent",
    description: "Browse our comprehensive collection of properties for sale and rent. Find your perfect home with advanced search filters.",
    images: ['/images/section/property-grid-bg.jpg'],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/property-list`,
  },
};
export default function page() {
  return (
    <>
      <div id="wrapper">
        <Header1 />
        <Breadcumb pageName="Property Grid Full Width" />
        <div className="main-content">
          <Properties1 defaultGrid />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
