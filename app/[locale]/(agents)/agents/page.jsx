import Agents from "@/components/agents/Agents";
import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import { getTranslations } from 'next-intl/server';
import React from "react";

export const metadata = {
  title: "Syria & Lattakia Real Estate Agents - Expert Property Professionals",
  description: "Meet our team of experienced real estate agents and property professionals in Syria and Lattakia. Get personalized guidance for buying, selling, or renting properties with expert local market knowledge.",
  keywords: [
    'syria real estate agents',
    'lattakia real estate agents',
    'syria property professionals',
    'lattakia property professionals',
    'syria real estate team',
    'lattakia real estate team',
    'syria property experts',
    'lattakia property experts',
    'syria real estate consultants',
    'lattakia real estate consultants',
    'local syria real estate agents',
    'local lattakia real estate agents',
    'syria property advisors',
    'lattakia property advisors',
    'syria real estate specialists',
    'lattakia real estate specialists',
    'syria holiday homes agents',
    'lattakia holiday homes agents',
    'syria vacation rental specialists',
    'lattakia vacation rental specialists',
    'syria beach property experts',
    'lattakia beach property experts',
    'syria coastal property advisors',
    'lattakia coastal property advisors'
  ],
  openGraph: {
    title: "Syria & Lattakia Real Estate Agents - Expert Property Professionals",
    description: "Meet our team of experienced real estate agents and property professionals in Syria and Lattakia. Get personalized guidance for all your property needs.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/agents`,
    images: [
      {
        url: '/images/section/agents-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Real Estate Agents',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Real Estate Agents - Meet Our Expert Property Professionals",
    description: "Meet our team of experienced real estate agents and property professionals. Get personalized guidance for all your property needs.",
    images: ['/images/section/agents-bg.jpg'],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/agents`,
  },
};
export default async function page() {
  const t = await getTranslations('agents');
  
  return (
    <>
      <div id="wrapper">
        <Header1 />
        <div className="page-content">
          <Breadcumb pageName={t('pageName')} />
          
          {/* SEO Content - Visible to Google Crawler */}
          <section style={{ padding: '40px 0', backgroundColor: '#f8f9fa' }}>
            <div className="tf-container">
              <div className="row">
                <div className="col-12">
                  <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
                    Expert Real Estate Agents in Syria & Lattakia - AqaarGate
                  </h1>
                  <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#666', marginBottom: '30px' }}>
                    Meet our team of experienced <strong>real estate agents in Syria and Lattakia</strong>. 
                    Our <strong>property professionals</strong> provide expert guidance for buying, selling, or renting properties. 
                    Whether you're looking for <strong>syria real estate agents</strong>, <strong>lattakia real estate agents</strong>, 
                    or <strong>holiday home specialists</strong>, our team has the local market knowledge to help you find your perfect property.
                  </p>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px', color: '#333' }}>
                    Why Work with AqaarGate Real Estate Agents?
                  </h2>
                  <ul style={{ fontSize: '16px', lineHeight: '1.8', color: '#666', marginBottom: '30px', paddingLeft: '20px' }}>
                    <li><strong>Expert Local Knowledge</strong> - Deep understanding of Syria and Lattakia property markets</li>
                    <li><strong>Personalized Service</strong> - Tailored guidance for your property needs</li>
                    <li><strong>Verified Listings</strong> - All properties are verified and up-to-date</li>
                    <li><strong>Multilingual Support</strong> - English and Arabic speaking agents</li>
                    <li><strong>International Experience</strong> - Serving expats from EU and Gulf countries</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          <Agents />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
