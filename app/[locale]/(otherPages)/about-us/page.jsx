import Breadcumb from "@/components/common/Breadcumb";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Cta from "@/components/common/Cta";
import About from "@/components/otherPages/about/About";
import { getDefaultOgImages, getDefaultOgImageUrls } from "@/lib/defaultOgImages";
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const url = `${baseUrl}/${locale}/about-us`;
  const isAr = locale === 'ar';
  return {
    title: isAr ? 'من نحن - عقار جيت AqaarGate | عقارات في سورية' : "About Us - AqaarGate | Ambitious Young Syrians Showcasing Syria's Real Estate",
    description: isAr
      ? 'عقار جيت - مجموعة شابة طموحة تعرض عقارات سوريا. عقارات في سورية، عقارات دمشق واللاذقية وحلب. منصة عقارات في سوريا.'
      : "A group of ambitious young Syrians showcasing the beauty, diversity, and real estate potential of Syria. Highlighting Syria's vibrant cities — Damascus, Aleppo, Latakia, Homs, Tartous, and others — blending modern architecture with ancient heritage.",
    keywords: isAr
      ? ['عقارات في سورية', 'عقار جيت', 'من نحن', 'عقارات سوريا', 'منصة عقارات في سوريا']
      : ['about AqaarGate', 'syria real estate team', 'young syrians', 'syria property showcase', 'syria cities real estate', 'damascus aleppo latakia real estate', 'syria heritage architecture', 'syria real estate development'],
    openGraph: {
      title: isAr ? 'من نحن - عقار جيت | عقارات في سورية' : "About Us - AqaarGate | Ambitious Young Syrians Showcasing Syria's Real Estate",
      description: isAr ? 'عقار جيت - عقارات في سورية. منصة عقارات في سوريا.' : "A group of ambitious young Syrians showcasing the beauty, diversity, and real estate potential of Syria.",
      url,
      images: getDefaultOgImages(baseUrl, locale),
    },
    twitter: {
      card: 'summary_large_image',
      title: isAr ? 'من نحن - عقار جيت' : "About Us - AqaarGate | Ambitious Young Syrians Showcasing Syria's Real Estate",
      description: isAr ? 'عقار جيت - عقارات في سورية' : "A group of ambitious young Syrians showcasing the beauty, diversity, and real estate potential of Syria.",
      images: getDefaultOgImageUrls(baseUrl, locale),
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

