import Cta from "@/components/common/Cta";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Benefits from "@/components/otherPages/career/Benefits";
import Jobs from "@/components/otherPages/career/Jobs";
import PageTitle from "@/components/otherPages/career/PageTitle";
import Reviews from "@/components/otherPages/career/Reviews";

import React from "react";

export default function page() {
  return (
    <>
      <div id="wrapper" className="counter-scroll">
        <Header1 />
        <PageTitle />
        <div className="main-content">
          {/* SEO Content - Visible to Google Crawler (Server-Side Rendered) */}
          <section style={{ padding: '40px 0', backgroundColor: '#f8f9fa' }}>
            <div className="tf-container">
              <div className="row">
                <div className="col-12">
                  <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
                    Careers at AqaarGate - Join Our Real Estate Team in Syria
                  </h1>
                  <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#666', marginBottom: '30px' }}>
                    Join <strong>AqaarGate Real Estate</strong> and be part of a team that's transforming <strong>real estate in Syria</strong>. 
                    We're looking for talented individuals to help us showcase <strong>Syria's property potential</strong> to the world. 
                    Explore career opportunities in <strong>real estate</strong>, <strong>property management</strong>, and 
                    <strong>customer service</strong>.
                  </p>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px', color: '#333' }}>
                    Build Your Career in Real Estate
                  </h2>
                  <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#666', marginBottom: '20px' }}>
                    AqaarGate offers exciting career opportunities for professionals passionate about <strong>syria real estate</strong>. 
                    Join us in connecting international buyers with the best <strong>property opportunities in Syria and Lattakia</strong>.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <Jobs />
          <Benefits />
          <Reviews />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
