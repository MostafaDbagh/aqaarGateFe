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
    images: [{ url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/images/logo/og.png`, width: 1200, height: 630, alt: 'AqaarGate Real Estate', type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Our Vision - AqaarGate | Transforming Real Estate in Syria",
    description: "Discover AqaarGate's vision: displaying Syria properties to the world with modern standards.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/images/logo/og.png`],
  },
};

export default function page() {
  return (
    <>
      <div id="wrapper" className="counter-scroll">
        <Header1 />
        <Breadcumb pageName="Our Vision" />
        <div className="main-content">
          <Vision />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}

