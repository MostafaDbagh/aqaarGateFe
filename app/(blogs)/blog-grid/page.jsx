import Blogs2 from "@/components/blogs/Blogs2";

import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import React from "react";

export const metadata = {
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
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/blog-grid`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/images/logo/new-logo.png`,
        width: 1200,
        height: 630,
        alt: 'AqaarGate - Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Syria Real Estate Blog - Property News & Tips in Lattakia",
    description: "Stay updated with the latest Syria and Lattakia real estate news, property investment tips, market trends, and buying guides.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/images/logo/new-logo.png`],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/blog-grid`,
  },
};
export default function page() {
  return (
    <>
      <div id="wrapper">
        <Header1 />
        <div className="main-content">
          <Breadcumb pageName="Blog Grid" />
          <Blogs2 />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
