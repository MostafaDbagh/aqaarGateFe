import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Page Not Found - AqaarGate",
  description: "The page you are looking for does not exist. Return to homepage or browse properties in Syria and Lattakia.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFoundPage() {
  return (
    <>
      <div id="wrapper">
        <Header1 />
        <div className="main-content">
          <Breadcumb pageName="Page Not Found" />
          <div className="page-content">
            <div className="tf-container tf-spacing-1 pt-0">
              <div className="error-404 text-center">
                <h1 className="mb-20 title" style={{ fontSize: '3rem', fontWeight: 700, color: '#f1913d' }}>
                  404
                </h1>
                <h2 className="mb-20 title" style={{ fontSize: '2rem', fontWeight: 600 }}>
                  Oh no... We lost this page
                </h2>
                <p className="mb-40" style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#666' }}>
                  We searched everywhere but couldn&apos;t find what you&apos;re looking for. Let&apos;s find a better place for you to go.
                </p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link
                    href="/en"
                    className="tf-btn bg-color-primary rounded-4 pd-3 fw-6"
                    style={{ minWidth: '200px' }}
                  >
                    Back to Home
                  </Link>
                  <Link
                    href="/en/property-list"
                    className="tf-btn style-2 rounded-4 pd-3 fw-6"
                    style={{ minWidth: '200px' }}
                  >
                    Browse Properties
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
