import { setRequestLocale } from 'next-intl/server';
import HomePageClient from '../HomePageClient';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (locale === 'ar') {
    return {
      title: 'موقع عقاري - عقارات في سورية | عقار جيت AqaarGate - افضل موقع عقارات في سوريا',
      description: 'موقع عقاري وموقع عقارات - عقار جيت. عقارات في سورية، منازل للبيع في سوريا، شقق للبيع في دمشق، عقارات اللاذقية. سوق العقارات الإلكتروني في سورية - أكثر من 1000 عقار للبيع والإيجار.',
      keywords: [
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
        title: 'موقع عقاري - عقارات في سورية | عقار جيت - افضل موقع عقارات في سوريا',
        description: 'موقع عقاري وموقع عقارات - عقار جيت. عقارات في سورية، منازل للبيع في سوريا، شقق للبيع في دمشق، عقارات اللاذقية. سوق العقارات الإلكتروني في سورية - أكثر من 1000 عقار.',
        url: `${baseUrl}/ar`,
        locale: 'ar_SA',
        images: [
          { url: `${baseUrl}/images/logo/og.png`, width: 180, height: 180, alt: 'AqaarGate' },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'موقع عقاري - عقارات في سورية | عقار جيت',
        description: 'موقع عقاري وموقع عقارات. عقارات في سورية، شقق للبيع في دمشق، عقارات اللاذقية. أكثر من 1000 عقار للبيع والإيجار.',
        images: [`${baseUrl}/images/logo/og.png`],
      },
      alternates: {
        canonical: `${baseUrl}/ar`,
        languages: { en: `${baseUrl}/en`, ar: `${baseUrl}/ar`, 'x-default': `${baseUrl}/en` },
      },
    };
  }
  return {
    title: 'AqaarGate - Homes for Sale in Syria | Buy Property | Apartments for Sale in Damascus',
    description: 'Homes for sale in Syria, buy property in Syria, apartments for sale in Damascus. Syrian property market - land for sale Syria, property investment Syria, expat property Syria. Houses for rent Syria, real estate opportunities in Syria, affordable properties in Syria. 1000+ verified properties.',
    keywords: [
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
      title: 'AqaarGate - Homes for Sale in Syria | Buy Property | Apartments for Sale in Damascus',
      description: 'Homes for sale in Syria, buy property in Syria, apartments for sale in Damascus. Syrian property market, land for sale Syria, expat property Syria. Houses for rent Syria, affordable properties in Syria.',
      url: `${baseUrl}/en`,
      locale: 'en_US',
      images: [
        { url: `${baseUrl}/images/logo/og.png`, width: 180, height: 180, alt: 'AqaarGate' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AqaarGate - Homes for Sale in Syria | Buy Property in Syria',
      description: 'Homes for sale in Syria, apartments for sale in Damascus. Syrian property market, property investment Syria, expat property Syria. Houses for rent Syria, affordable properties in Syria.',
      images: [`${baseUrl}/images/logo/og.png`],
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
      {/* SEO Content - Visible at bottom for indexing (display:none can hurt Arabic/SEO) */}
    
    </>
  );
}

