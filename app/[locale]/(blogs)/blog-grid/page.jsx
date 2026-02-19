import Blogs2 from "@/components/blogs/Blogs2";
import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import { getDefaultOgImages, getDefaultOgImageUrls } from "@/lib/defaultOgImages";
import { getTranslations } from 'next-intl/server';
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const url = `${baseUrl}/${locale}/blog-grid`;
  return {
    title: "Syria Real Estate Blog - Property News & Tips in Lattakia",
    description: "Stay updated with the latest Syria and Lattakia real estate news, property investment tips, market trends, and buying guides. Expert insights for property buyers and sellers in Syria.",
    keywords: [
    'syria real estate blog',
    'lattakia real estate blog',
    'syria property news',
    'lattakia property news',
    'syria real estate tips',
    'lattakia real estate tips',
    'syria property market',
    'lattakia property market',
    'syria real estate trends',
    'lattakia real estate trends',
    'syria property investment',
    'lattakia property investment',
    'syria real estate guide',
    'lattakia real estate guide',
    'syria property buying',
    'lattakia property buying',
    'syria property selling',
    'lattakia property selling',
    'syria real estate advice',
    'lattakia real estate advice'
  ],
  openGraph: {
    title: "Syria Real Estate Blog - Property News & Tips in Lattakia",
    description: "Stay updated with the latest Syria and Lattakia real estate news, property investment tips, market trends, and buying guides.",
    url,
    images: getDefaultOgImages(baseUrl, locale),
  },
  twitter: {
    card: 'summary_large_image',
    title: "Syria Real Estate Blog - Property News & Tips in Lattakia",
    description: "Stay updated with the latest Syria and Lattakia real estate news, property investment tips, market trends, and buying guides.",
    images: getDefaultOgImageUrls(baseUrl, locale),
  },
  alternates: { canonical: url },
  };
}

export default async function page() {
  const t = await getTranslations('blog');
  
  return (
    <>
      <div id="wrapper">
        <Header1 />
        <div className="main-content">
          <Breadcumb pageName={t('pageName')} />
          <Blogs2 />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
