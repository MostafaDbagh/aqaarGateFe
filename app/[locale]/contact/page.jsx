import Cta from "@/components/common/Cta";
import About from "@/components/contact/About";
import Contact from "@/components/contact/Contact";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const url = `${baseUrl}/${locale}/contact`;
  return {
    title: "Contact AqaarGate Real Estate - Syria & Lattakia Property Experts",
    description: "Contact AqaarGate Real Estate for expert guidance on buying, selling, or renting properties in Syria and Lattakia. Our experienced agents are here to help you find your dream home or investment property.",
    keywords: [
    'contact syria real estate agent',
    'contact lattakia real estate agent',
    'syria real estate consultation',
    'lattakia real estate consultation',
    'syria property inquiry',
    'lattakia property inquiry',
    'syria real estate services',
    'lattakia real estate services',
    'syria property advice',
    'lattakia property advice',
    'syria real estate support',
    'lattakia real estate support',
    'syria home buying help',
    'lattakia home buying help',
    'syria property selling assistance',
    'lattakia property selling assistance',
    'syria holiday homes consultation',
    'lattakia holiday homes consultation',
    'syria vacation rental advice',
    'lattakia vacation rental advice',
    'syria beach property consultation',
    'lattakia beach property consultation',
    'syria coastal property advice',
    'lattakia coastal property advice'
  ],
  openGraph: {
    title: "Contact AqaarGate Real Estate - Syria & Lattakia Property Experts",
    description: "Contact AqaarGate Real Estate for expert guidance on buying, selling, or renting properties in Syria and Lattakia. Our experienced agents are here to help you.",
    url,
    images: [
      {
        url: `${baseUrl}/images/logo/new-logo.png`,
        width: 1200,
        height: 630,
        alt: 'AqaarGate - Contact',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Contact Us - Get in Touch with AqaarGate Real Estate",
    description: "Contact AqaarGate Real Estate for expert guidance on buying, selling, or renting properties.",
    images: [`${baseUrl}/images/logo/new-logo.png`],
  },
  alternates: { canonical: url },
  };
}

export default function page() {
  return (
    <>
      <div id="wrapper">
        <Header1 />
        <div className="main-content">
          <Contact />
          <About />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
