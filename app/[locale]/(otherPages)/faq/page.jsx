import Breadcumb from "@/components/common/Breadcumb";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Cta from "@/components/otherPages/faq/Cta";
import Faqs from "@/components/otherPages/faq/Faqs";
import { getTranslations } from 'next-intl/server';
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const url = `${baseUrl}/${locale}/faq`;
  return {
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
      url,
      images: [
        { url: `${baseUrl}/images/logo/new-logo.png`, width: 1200, height: 630, alt: 'AqaarGate - FAQ' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: "Syria Real Estate FAQ - Common Questions About Property in Lattakia",
      description: "Find answers to frequently asked questions about buying, selling, and renting properties in Syria and Lattakia.",
      images: [`${baseUrl}/images/logo/new-logo.png`],
    },
    alternates: { canonical: url },
  };
}

export default async function page() {
  const t = await getTranslations('faq');
  
  return (
    <>
      <div id="wrapper" className="counter-scroll">
        <Header1 />
        <Breadcumb pageName={t('pageName')} />
        <div className="main-content tf-spacing-6 header-fixed">
          <Faqs />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
