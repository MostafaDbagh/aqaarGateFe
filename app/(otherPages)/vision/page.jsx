import Breadcumb from "@/components/common/Breadcumb";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Cta from "@/components/common/Cta";
import Vision from "@/components/otherPages/vision/Vision";

import React from "react";

export const metadata = {
  title: "Our Vision - SyProperty | Transforming Real Estate in Syria",
  description: "Discover SyProperty's vision: displaying Syria properties to the world with modern European and Gulf standards. Simple, clear, and private property search experience.",
  keywords: [
    'syria real estate vision',
    'syria property platform',
    'modern syria real estate',
    'syria property search',
    'privacy property search',
    'syria real estate innovation'
  ],
  openGraph: {
    title: "Our Vision - SyProperty | Transforming Real Estate in Syria",
    description: "Discover SyProperty's vision: displaying Syria properties to the world with modern standards.",
    url: 'https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/vision',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Our Vision - SyProperty | Transforming Real Estate in Syria",
    description: "Discover SyProperty's vision: displaying Syria properties to the world with modern standards.",
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

