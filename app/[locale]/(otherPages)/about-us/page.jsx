import Breadcumb from "@/components/common/Breadcumb";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Cta from "@/components/common/Cta";
import About from "@/components/otherPages/about/About";

import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const url = `${baseUrl}/${locale}/about-us`;
  return {
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
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title: "About Us - AqaarGate | Ambitious Young Syrians Showcasing Syria's Real Estate",
      description: "A group of ambitious young Syrians showcasing the beauty, diversity, and real estate potential of Syria.",
    },
    alternates: { canonical: url },
  };
}

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

