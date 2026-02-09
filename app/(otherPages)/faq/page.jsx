import Breadcumb from "@/components/common/Breadcumb";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Cta from "@/components/otherPages/faq/Cta";
import Faqs from "@/components/otherPages/faq/Faqs";

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
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/images/logo/new-logo.png`,
        width: 1200,
        height: 630,
        alt: 'AqaarGate - FAQ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Syria Real Estate FAQ - Common Questions About Property in Lattakia",
    description: "Find answers to frequently asked questions about buying, selling, and renting properties in Syria and Lattakia.",
      images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/images/logo/new-logo.png`],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/faq`,
  },
};

export default function page() {
  return (
    <>
      <div id="wrapper" className="counter-scroll">
        <Header1 />
        <Breadcumb pageName="FAQS" />
        <div className="main-content tf-spacing-6 header-fixed">
          <Faqs />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
