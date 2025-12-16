import Breadcumb from "@/components/common/Breadcumb";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Cta from "@/components/common/Cta";
import Vision from "@/components/otherPages/vision/Vision";

import React from "react";

export const metadata = {
  title: "Our Vision - AqaarGate | Transforming Real Estate in Syria",
  description: "Discover AqaarGate's vision: displaying Syria properties to the world with modern European and Gulf standards. Simple, clear, and private property search experience.",
  keywords: [
    'syria real estate vision',
    'syria property platform',
    'modern syria real estate',
    'syria property search',
    'privacy property search',
    'syria real estate innovation'
  ],
  openGraph: {
    title: "Our Vision - AqaarGate | Transforming Real Estate in Syria",
    description: "Discover AqaarGate's vision: displaying Syria properties to the world with modern standards.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/vision`,
  },
  twitter: {
    card: 'summary_large_image',
    title: "Our Vision - AqaarGate | Transforming Real Estate in Syria",
    description: "Discover AqaarGate's vision: displaying Syria properties to the world with modern standards.",
  },
};

export default function page() {
  return (
    <>
      <div id="wrapper" className="counter-scroll">
        <Header1 />
        <Breadcumb pageName="Our Vision" />
        <div className="main-content">
          {/* SEO Content - Visible to Google Crawler (Server-Side Rendered) */}
          <section style={{ padding: '40px 0', backgroundColor: '#f8f9fa' }}>
            <div className="tf-container">
              <div className="row">
                <div className="col-12">
                  <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
                    Our Vision - AqaarGate | Transforming Real Estate in Syria
                  </h1>
                  <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#666', marginBottom: '30px' }}>
                    Discover <strong>AqaarGate's vision</strong>: displaying <strong>Syria properties to the world</strong> with 
                    <strong>modern European and Gulf standards</strong>. We provide a <strong>simple, clear, and private property search experience</strong>. 
                    Our mission is to transform <strong>real estate in Syria</strong> by connecting international buyers with the best 
                    <strong>property opportunities</strong>.
                  </p>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px', color: '#333' }}>
                    Modern Real Estate Platform for Syria
                  </h2>
                  <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#666', marginBottom: '20px' }}>
                    AqaarGate is revolutionizing <strong>syria real estate</strong> by offering a <strong>modern property platform</strong> 
                    that meets international standards. We combine <strong>cutting-edge technology</strong> with <strong>local expertise</strong> 
                    to provide the best <strong>property search experience</strong> in Syria.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <Vision />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}

