import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Properties1 from "@/components/properties/Properties1";
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
const OG_IMAGE = { url: `${baseUrl}/images/logo/og.png`, width: 180, height: 180, alt: 'AqaarGate Real Estate', type: 'image/png' };
const OG_IMAGE_URL = `${baseUrl}/images/logo/og.png`;

const keywordsEn = [
  'properties for sale in syria',
  'properties for sale in Syria',
  'syria property listings',
  'lattakia property listings',
  'syria properties for sale',
  'syria properties for rent',
  'lattakia properties for sale',
  'lattakia properties for rent',
  'syria homes for sale',
  'lattakia homes for sale',
  'syria apartments for rent',
  'lattakia apartments for rent',
  'syria holiday homes',
  'lattakia holiday homes',
  'syria vacation rentals',
  'lattakia vacation rentals',
  'syria commercial properties',
  'lattakia commercial properties',
  'syria real estate search',
  'lattakia real estate search',
  'syria property filters',
  'lattakia property filters',
  'syria real estate listings',
  'lattakia real estate listings',
  'syria property search',
  'lattakia property search',
  'syria beach properties',
  'lattakia beach properties',
  'syria coastal properties',
  'lattakia coastal properties',
  'syria villas',
  'lattakia villas',
  'syria land for sale',
  'lattakia land for sale'
];

const keywordsAr = [
  'موقع عقاري',
  'موقع عقارات',
  'عقارات في سورية',
  'عقارات في سوريا',
  'عقارات للبيع في سوريا',
  'عقارات للايجار في سوريا',
  'شقق للبيع في دمشق',
  'عقارات اللاذقية',
  'عقارات دمشق',
  'عقارات حلب',
  'شاليه طرطوس',
  'عقارات للبيع والايجار',
  'منصة عقارات في سوريا',
  'عقار جيت',
  'عقارات للبيع في سوريا دمشق',
  'أسعار الشقق في سوريا بالدولار',
  'بيوت رخيصة للبيع في دمشق وريفها',
  'شقق للبيع في سوريا بالتقسيط',
  'عقارات سوريا حمص',
  'عقارات دمشق بدون وسيط',
];

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const url = `${baseUrl}/${locale}/property-list`;
  const isAr = locale === 'ar';
  return {
    title: isAr
      ? 'موقع عقاري - عقارات في سورية | تصفح 1000+ عقار للبيع والإيجار - عقار جيت'
      : '#1 Property Listings in Syria & Lattakia - 1000+ Properties for Sale & Rent | AqaarGate',
    description: isAr
      ? 'عقارات في سورية - عقار جيت. تصفح أكثر من 1000 عقار للبيع والإيجار في سوريا واللاذقية. شقق، فلل، بيوت عطلات، عقارات تجارية. فلتر بحث متقدم. موثوق عالمياً.'
      : 'Browse 1000+ verified properties for sale and rent in Syria and Lattakia. Find your perfect home, apartment, holiday home (بيوت عطلات), villa, or commercial property. Advanced search filters. Trusted by expats worldwide. Start your property search today!',
    keywords: isAr ? keywordsAr : keywordsEn,
    openGraph: {
      title: isAr ? 'عقارات في سورية - عقار جيت | 1000+ عقار للبيع والإيجار' : '#1 Property Listings in Syria & Lattakia - 1000+ Properties for Sale & Rent',
      description: isAr ? 'عقارات في سورية - تصفح عقارات سوريا واللاذقية. شقق، فلل، بيوت عطلات للبيع والإيجار.' : 'Browse 1000+ verified properties for sale and rent in Syria and Lattakia. Find your perfect home, apartment, holiday home (بيوت عطلات), villa. Advanced search filters. Trusted by expats worldwide.',
      url,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: isAr ? 'عقارات في سورية - عقار جيت' : '#1 Property Listings in Syria - 1000+ Properties for Sale & Rent',
      description: isAr ? 'عقارات في سورية - عقارات سوريا واللاذقية للبيع والإيجار.' : 'Browse 1000+ verified properties for sale and rent in Syria and Lattakia. Holiday homes (بيوت عطلات), villas, apartments. Advanced search filters.',
      images: [OG_IMAGE_URL],
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/property-list`,
        ar: `${baseUrl}/ar/property-list`,
        'x-default': `${baseUrl}/en/property-list`,
      },
    },
  };
}

export default function page() {
  return (
    <>
      <div id="wrapper">
        <Header1 />
        <Breadcumb pageName="Properties Listings" />
        <div className="main-content">
          <Properties1 defaultGrid />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
