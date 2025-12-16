import Breadcumb from "@/components/common/Breadcumb";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Cta from "@/components/common/Cta";
import About from "@/components/otherPages/about/About";

import React from "react";

export const metadata = {
  title: "About Us - AqaarGate | Ambitious Young Syrians Showcasing Syria's Real Estate",
  description: "A group of ambitious young Syrians showcasing the beauty, diversity, and real estate potential of Syria. Highlighting Syria's vibrant cities — Damascus, Aleppo, Latakia, Homs, Tartous, and others — blending modern architecture with ancient heritage.",
  keywords: [
    'about AqaarGate',
    'syria real estate team',
    'young syrians',
    'syria property showcase',
    'syria cities real estate',
    'damascus aleppo latakia real estate',
    'syria heritage architecture',
    'syria real estate development'
  ],
  openGraph: {
    title: "About Us - AqaarGate | Ambitious Young Syrians Showcasing Syria's Real Estate",
    description: "A group of ambitious young Syrians showcasing the beauty, diversity, and real estate potential of Syria.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/about-us`,
  },
  twitter: {
    card: 'summary_large_image',
    title: "About Us - AqaarGate | Ambitious Young Syrians Showcasing Syria's Real Estate",
    description: "A group of ambitious young Syrians showcasing the beauty, diversity, and real estate potential of Syria.",
  },
};

export default function page() {
  return (
    <>
      <div id="wrapper" className="counter-scroll">
        <Header1 />
        <Breadcumb pageName="About Us" />
        <div className="main-content">
          {/* SEO Content - Visible to Google Crawler (Server-Side Rendered) */}
          <section style={{ padding: '40px 0', backgroundColor: '#f8f9fa' }}>
            <div className="tf-container">
              <div className="row">
                <div className="col-12">
                  <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
                    About AqaarGate - Ambitious Young Syrians Showcasing Syria's Real Estate
                  </h1>
                  <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#666', marginBottom: '30px' }}>
                    AqaarGate is a group of <strong>ambitious young Syrians</strong> showcasing the beauty, diversity, and 
                    <strong>real estate potential of Syria</strong>. We highlight Syria's vibrant cities — <strong>Damascus, Aleppo, Latakia, Homs, Tartous</strong>, 
                    and others — blending modern architecture with ancient heritage. Our mission is to connect international buyers 
                    with the best <strong>real estate opportunities in Syria</strong>.
                  </p>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px', color: '#333' }}>
                    Our Mission
                  </h2>
                  <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#666', marginBottom: '20px' }}>
                    We are dedicated to showcasing <strong>Syria's real estate potential</strong> to the world. From historic 
                    <strong>Damascus properties</strong> to coastal <strong>Latakia real estate</strong>, we help buyers discover 
                    the perfect property in Syria's most beautiful cities.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <About />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}

