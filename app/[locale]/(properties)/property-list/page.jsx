import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";

import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Properties1 from "@/components/properties/Properties1";
import React from "react";

export const metadata = {
  title: "#1 Property Listings in Syria & Lattakia - 1000+ Properties for Sale & Rent | AqaarGate",
  description: "Browse 1000+ verified properties for sale and rent in Syria and Lattakia. Find your perfect home, apartment, holiday home (بيوت عطلات), villa, or commercial property. Advanced search filters. Trusted by expats worldwide. Start your property search today!",
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
    title: "#1 Property Listings in Syria & Lattakia - 1000+ Properties for Sale & Rent",
    description: "Browse 1000+ verified properties for sale and rent in Syria and Lattakia. Find your perfect home, apartment, holiday home (بيوت عطلات), villa. Advanced search filters. Trusted by expats worldwide.",
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
    title: "#1 Property Listings in Syria - 1000+ Properties for Sale & Rent",
    description: "Browse 1000+ verified properties for sale and rent in Syria and Lattakia. Holiday homes (بيوت عطلات), villas, apartments. Advanced search filters.",
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
        <Breadcumb pageName="Properties Listings" />
        <div className="main-content">
          {/* SEO Content - Visible to Google Crawler */}
          <section style={{ padding: '40px 0', backgroundColor: '#f8f9fa' }}>
            <div className="tf-container">
              <div className="row">
                <div className="col-12">
                  <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
                    Property Listings in Syria & Lattakia - Find Your Dream Home
                  </h1>
                  <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#666', marginBottom: '30px' }}>
                    Browse our comprehensive collection of <strong>properties for sale and rent in Syria and Lattakia</strong>. 
                    Discover luxury homes, apartments, <strong>holiday homes (بيوت عطلات)</strong>, villas, and commercial properties. 
                    Whether you're looking for <strong>syria apartments</strong>, <strong>syria houses</strong>, <strong>syria villas</strong>, 
                    or <strong>syria holiday homes</strong>, we have the perfect property for you. 
                    Use our advanced search filters to find properties by location, price, size, amenities, and more.
                  </p>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px', color: '#333' }}>
                    Why Choose AqaarGate for Property Search?
                  </h2>
                  <ul style={{ fontSize: '16px', lineHeight: '1.8', color: '#666', marginBottom: '30px', paddingLeft: '20px' }}>
                    <li><strong>1000+ Verified Properties</strong> - All listings are verified and up-to-date</li>
                    <li><strong>Advanced Search Filters</strong> - Find exactly what you're looking for</li>
                    <li><strong>Expert Real Estate Agents</strong> - Get personalized guidance</li>
                    <li><strong>Multiple Property Types</strong> - Apartments, Villas, Holiday Homes, Commercial Properties</li>
                    <li><strong>Syria & Lattakia Focus</strong> - Specialized in properties across Syria</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          <Properties1 defaultGrid />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
