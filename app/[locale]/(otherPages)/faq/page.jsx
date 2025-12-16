import Breadcumb from "@/components/common/Breadcumb";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Cta from "@/components/otherPages/faq/Cta";
import Faqs from "@/components/otherPages/faq/Faqs";
import { getTranslations } from 'next-intl/server';
import React from "react";

export const metadata = {
  title: "Syria Real Estate FAQ - Common Questions About Property in Lattakia",
  description: "Find answers to frequently asked questions about buying, selling, and renting properties in Syria and Lattakia. Expert guidance on real estate transactions, property investment, and legal requirements.",
  keywords: [
    'syria real estate faq',
    'lattakia real estate faq',
    'syria property questions',
    'lattakia property questions',
    'syria real estate help',
    'lattakia real estate help',
    'syria property buying guide',
    'lattakia property buying guide',
    'syria property selling guide',
    'lattakia property selling guide',
    'syria property renting guide',
    'lattakia property renting guide',
    'syria real estate legal',
    'lattakia real estate legal',
    'syria property investment advice',
    'lattakia property investment advice',
    'syria real estate process',
    'lattakia real estate process'
  ],
  openGraph: {
    title: "Syria Real Estate FAQ - Common Questions About Property in Lattakia",
    description: "Find answers to frequently asked questions about buying, selling, and renting properties in Syria and Lattakia. Expert guidance on real estate transactions.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/faq`,
    images: [
      {
        url: '/images/section/faq-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Syria Real Estate FAQ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Syria Real Estate FAQ - Common Questions About Property in Lattakia",
    description: "Find answers to frequently asked questions about buying, selling, and renting properties in Syria and Lattakia.",
    images: ['/images/section/faq-bg.jpg'],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/faq`,
  },
};

export default async function page() {
  const t = await getTranslations('faq');
  
  return (
    <>
      <div id="wrapper" className="counter-scroll">
        <Header1 />
        <Breadcumb pageName={t('pageName')} />
        <div className="main-content tf-spacing-6 header-fixed">
          {/* SEO Content - Visible to Google Crawler (Server-Side Rendered) */}
          <section style={{ padding: '40px 0', backgroundColor: '#f8f9fa' }}>
            <div className="tf-container">
              <div className="row">
                <div className="col-12">
                  <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
                    Syria Real Estate FAQ - Common Questions About Property in Lattakia
                  </h1>
                  <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#666', marginBottom: '30px' }}>
                    Find answers to frequently asked questions about <strong>buying, selling, and renting properties in Syria and Lattakia</strong>. 
                    Get expert guidance on <strong>real estate transactions</strong>, <strong>property investment</strong>, and 
                    <strong>legal requirements</strong>. Whether you're looking for <strong>syria real estate help</strong> or 
                    <strong>lattakia property advice</strong>, we have the answers you need.
                  </p>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px', color: '#333' }}>
                    Common Questions About Real Estate in Syria
                  </h2>
                  <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#666', marginBottom: '20px' }}>
                    Our FAQ section covers everything from <strong>syria property buying guides</strong> to 
                    <strong>lattakia property investment advice</strong>. Learn about the <strong>real estate process in Syria</strong> 
                    and get expert answers to your property questions.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <Faqs />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
