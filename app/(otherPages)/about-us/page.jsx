import Breadcumb from "@/components/common/Breadcumb";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Cta from "@/components/common/Cta";
import About from "@/components/otherPages/about/About";

import React from "react";

export const metadata = {
  title: "About Us - SyProperty | Ambitious Young Syrians Showcasing Syria's Real Estate",
  description: "A group of ambitious young Syrians showcasing the beauty, diversity, and real estate potential of Syria. Highlighting Syria's vibrant cities — Damascus, Aleppo, Latakia, Homs, Tartous, and others — blending modern architecture with ancient heritage.",
  keywords: [
    'about syproperty',
    'syria real estate team',
    'young syrians',
    'syria property showcase',
    'syria cities real estate',
    'damascus aleppo latakia real estate',
    'syria heritage architecture',
    'syria real estate development'
  ],
  openGraph: {
    title: "About Us - SyProperty | Ambitious Young Syrians Showcasing Syria's Real Estate",
    description: "A group of ambitious young Syrians showcasing the beauty, diversity, and real estate potential of Syria.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/about-us`,
  },
  twitter: {
    card: 'summary_large_image',
    title: "About Us - SyProperty | Ambitious Young Syrians Showcasing Syria's Real Estate",
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
          <About />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}

