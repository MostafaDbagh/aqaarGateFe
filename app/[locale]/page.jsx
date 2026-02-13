import { setRequestLocale } from 'next-intl/server';
import HomePageClient from '../HomePageClient';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
const OG_IMAGE_URL = `${baseUrl}/images/logo/og.png`;
const OG_IMAGES = [
  { url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'AqaarGate Real Estate' },
  { url: OG_IMAGE_URL, width: 400, height: 400, alt: 'AqaarGate' },
];

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (locale === 'ar') {
    return {
      metadataBase: new URL(baseUrl),
      title: 'عقارات للبيع في سوريا | موقع عقاري - عقار جيت AqaarGate | افضل موقع عقارات في سوريا',
      description: 'عقارات للبيع في سوريا - موقع عقاري وموقع عقارات عقار جيت. عقارات في سورية، منازل للبيع في سوريا، شقق للبيع في دمشق، عقارات اللاذقية. سوق العقارات الإلكتروني في سورية - أكثر من 1000 عقار للبيع والإيجار.',
      keywords: [
        'عقارات للبيع في سوريا',
        'عقارات للبيع',
        'موقع عقاري',
        'موقع عقارات',
        'عقارات في سورية',
        'عقارات في سوريا',
        'منصة عقارات في سورية',
        'منصة عقارات في سوريا',
        'شقة للكراء',
        'بيت للكراء',
        'شقة مفروشة للكراء',
        'شقة للبيع',
        'شقة للايجار',
        'عقارات للبيع في دمشق',
        'عقارات للبيع في اللاذقية',
        'عقارات للبيع في حلب',
        'عقارات للبيع في حمص',
        'شاليه للبيع',
        'استراحة للبيع',
        'أراضي للبيع',
        'فلل للبيع',
        'شراء عقار من برا',
        'عقارات للمغتربين',
        'منازل للبيع في سوريا',
        'شراء عقار في سوريا',
        'شقق للبيع في دمشق',
        'سوق العقارات السورية',
        'أراضي للبيع في سوريا',
        'ريف دمشق عقارات',
        'عقار جيت',
        'aqaargate',
        'عقارات للبيع والايجار في سوريا',
        'سوق العقارات الإلكتروني في سورية',
        'عقارات دمشق',
        'عقارات اللاذقية',
        'عقارات حلب',
        'عقارات للبيع في سوريا دمشق',
        'أسعار الشقق في سوريا بالدولار',
        'بيوت رخيصة للبيع في دمشق وريفها',
        'شقق للبيع في سوريا بالتقسيط',
        'عقارات سوريا حمص',
        'عقارات دمشق بدون وسيط',
        'مستقبل العقارات في سوريا',
      ],
      openGraph: {
        title: 'عقارات للبيع في سوريا | موقع عقاري - عقار جيت - افضل موقع عقارات في سوريا',
        description: 'عقارات للبيع في سوريا - موقع عقاري عقار جيت. عقارات في سورية، منازل للبيع في سوريا، شقق للبيع في دمشق، عقارات اللاذقية. سوق العقارات الإلكتروني في سورية - أكثر من 1000 عقار.',
        url: `${baseUrl}/ar`,
        siteName: 'AqaarGate',
        locale: 'ar_SA',
        alternateLocale: 'en_US',
        type: 'website',
        images: OG_IMAGES,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'موقع عقاري - عقارات في سورية | عقار جيت',
        description: 'موقع عقاري وموقع عقارات. عقارات في سورية، شقق للبيع في دمشق، عقارات اللاذقية. أكثر من 1000 عقار للبيع والإيجار.',
        images: [OG_IMAGE_URL],
      },
      alternates: {
        canonical: `${baseUrl}/ar`,
        languages: { en: `${baseUrl}/en`, ar: `${baseUrl}/ar`, 'x-default': `${baseUrl}/en` },
      },
    };
  }
  return {
    metadataBase: new URL(baseUrl),
    title: 'Properties for Sale in Syria | AqaarGate - Homes for Sale | Buy Property | Apartments for Sale in Damascus',
    description: 'Properties for sale in Syria - AqaarGate. Homes for sale in Syria, buy property in Syria, apartments for sale in Damascus. Syrian property market - land for sale Syria, property investment Syria, expat property Syria. Houses for rent Syria. 1000+ verified properties.',
    keywords: [
      'properties for sale in syria',
      'properties for sale in Syria',
      'Homes for sale in Syria',
      'Buy property in Syria',
      'Apartments for sale in Damascus',
      'Apartments for rent Damascus',
      'Syrian property market',
      'Land for sale Syria',
      'Property investment Syria',
      'Expat property Syria',
      'Houses for rent Syria',
      'Chalet for sale Syria',
      'Chalet Tartous',
      'Damascus countryside',
      'Rif Dimashq',
      'Syria real estate',
      'Syrian property platform',
      'aqaargate',
    ],
    openGraph: {
      title: 'Properties for Sale in Syria | AqaarGate - Homes for Sale | Buy Property | Apartments for Sale in Damascus',
      description: 'Properties for sale in Syria - AqaarGate. Homes for sale in Syria, buy property in Syria, apartments for sale in Damascus. Syrian property market, land for sale Syria, expat property Syria. Houses for rent Syria.',
      url: `${baseUrl}/en`,
      siteName: 'AqaarGate',
      locale: 'en_US',
      alternateLocale: 'ar_SA',
      type: 'website',
      images: OG_IMAGES,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AqaarGate - Homes for Sale in Syria | Buy Property in Syria',
      description: 'Homes for sale in Syria, apartments for sale in Damascus. Syrian property market, property investment Syria, expat property Syria. Houses for rent Syria, affordable properties in Syria.',
      images: [OG_IMAGE_URL],
    },
    alternates: {
      canonical: `${baseUrl}/en`,
      languages: { en: `${baseUrl}/en`, ar: `${baseUrl}/ar`, 'x-default': `${baseUrl}/en` },
    },
  };
}

export default async function Home({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <HomePageClient />
    </>
  );
}

