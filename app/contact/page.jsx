import Brands from "@/components/common/Brands";
import Cta from "@/components/common/Cta";
import About from "@/components/contact/About";
import Contact from "@/components/contact/Contact";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import React from "react";

export const metadata = {
  title: "Contact Proty Real Estate - Syria & Lattakia Property Experts",
  description: "Contact Proty Real Estate for expert guidance on buying, selling, or renting properties in Syria and Lattakia. Our experienced agents are here to help you find your dream home or investment property.",
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
    title: "Contact Proty Real Estate - Syria & Lattakia Property Experts",
    description: "Contact Proty Real Estate for expert guidance on buying, selling, or renting properties in Syria and Lattakia. Our experienced agents are here to help you.",
    url: 'https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/contact',
    images: [
      {
        url: '/images/section/contact-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Proty Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Contact Us - Get in Touch with Proty Real Estate",
    description: "Contact Proty Real Estate for expert guidance on buying, selling, or renting properties.",
    images: ['/images/section/contact-bg.jpg'],
  },
  alternates: {
    canonical: 'https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/contact',
  },
};
export default function page() {
  return (
    <>
      <div id="wrapper">
        <Header1 />
        <div className="main-content">
          <Contact />
          <About />
          <Brands />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
