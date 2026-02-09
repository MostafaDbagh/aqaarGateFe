import { setRequestLocale } from 'next-intl/server';
import HomePageClient from '../HomePageClient';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (locale === 'ar') {
    return {
      title: 'منصة عقارات في سورية - عقار جيت AqaarGate | افضل المواقع العقارية في سوريا',
      description: 'منصة عقارات في سورية - عقار جيت. منازل للبيع في سوريا، شراء عقار في سوريا، شقق للبيع في دمشق. سوق العقارات السورية - أراضي للبيع في سوريا، استثمار عقاري في سوريا، عقارات للمغتربين. منازل للإيجار في سوريا، فرص عقارية في سوريا.',
      keywords: [
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
      ],
      openGraph: {
        title: 'عقار جيت - منازل للبيع في سوريا | شراء عقار | شقق للبيع في دمشق',
        description: 'منازل للبيع في سوريا، شراء عقار في سوريا، شقق للبيع في دمشق. سوق العقارات السورية، أراضي للبيع في سوريا، عقارات للمغتربين. منازل للإيجار في سوريا، عقارات بأسعار معقولة في سوريا.',
        url: `${baseUrl}/ar`,
        locale: 'ar_SA',
        images: [{ url: `${baseUrl}/ar/opengraph-image`, width: 1200, height: 630, alt: 'AqaarGate' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'عقار جيت - منازل للبيع في سوريا | شراء عقار في سوريا',
        description: 'منازل للبيع في سوريا، شقق للبيع في دمشق. سوق العقارات السورية، عقارات للمغتربين، منازل للإيجار في سوريا، عقارات بأسعار معقولة في سوريا.',
        images: [`${baseUrl}/ar/opengraph-image`],
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
      images: [{ url: `${baseUrl}/en/opengraph-image`, width: 1200, height: 630, alt: 'AqaarGate' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AqaarGate - Homes for Sale in Syria | Buy Property in Syria',
      description: 'Homes for sale in Syria, apartments for sale in Damascus. Syrian property market, property investment Syria, expat property Syria. Houses for rent Syria, affordable properties in Syria.',
      images: [`${baseUrl}/en/opengraph-image`],
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
      {/* SEO Content - Visible to Google Crawler (Server-Side Rendered) */}
      <div style={{ display: 'none' }} aria-hidden="true">
        {locale === 'ar' ? (
          <>
            <h1>عقار جيت AqaarGate - افضل المواقع العقارية في سوريا | سوق العقارات الإلكتروني في سورية</h1>
            <p>افضل المواقع العقارية في سوريا - عقار جيت. سوق العقارات الإلكتروني في سورية، منصة عقارات في سوريا - عدد العروض أكثر من 1000 عقار. شقق للبيع في سوريا، شقة للبيع في دمشق، عقارات في اللاذقية، شاليه في طرطوس، عقارات في حلب ودمشق وحمص. بيع وإيجار عقارات سوريا.</p>
            <h2>افضل المواقع العقارية في سوريا</h2>
            <p>عقار جيت من افضل المواقع العقارية في سوريا. أفضل موقع عقاري في سوريا للبيع والإيجار. سوق العقارات الإلكتروني في سورية - عدد العروض أكثر من 1000 عقار. عقارات في دمشق، عقارات في حلب، عقارات في اللاذقية، عقارات في حمص وطرطوس.</p>
            <h2>سوق العقارات الإلكتروني في سورية</h2>
            <p>عقار جيت سوق العقارات الإلكتروني في سورية. منصة عقارات في سورية للبيع والإيجار. افضل المواقع العقارية في سوريا - عقار جيت.</p>
            <h2>عقارات في سوريا - البحث الشعبي</h2>
            <p>عقارات في دمشق، عقارات في حلب، عقارات في اللاذقية، عقارات في حمص. شقة للبيع في دمشق، شقة للاجار في دمشق، شقة للكراء، بيت للكراء، شقة للاجار في اللاذقية، شاليه في طرطوس. عقارات للبيع في حمص، عقارات للاجار في دمشق. مكتب للاجار، عيادة للاجار، دكان للاجار، محلات للاجار. عقار جيت يربطك بأفضل العروض في سوريا.</p>
            <h2>شقق للبيع في سوريا</h2>
            <p>تبحث عن شقق للبيع في سوريا أو شقة للبيع في دمشق؟ عقار جيت يعرض عقارات في سوريا ودمشق واللاذقية. شقق للبيع في سوريا، شقق للإيجار، فلل ومنازل.</p>
            <h2>عقارات في دمشق واللاذقية وطرطوس</h2>
            <p>عقارات في دمشق، عقارات في اللاذقية، عقارات في حلب، شاليه في طرطوس. عقارات في حمص، عقارات للبيع في حمص. منصة عقارات في سورية - عقار جيت.</p>
            <h2>منصة عقارات في سورية</h2>
            <p>منصة عقارات في سورية رقم ١. بيع وشراء بيوت في سورية، تأجير بيوت في سورية. عقارات سوريا واللاذقية ودمشق. مستقبل العقارات في دمشق وسوريا.</p>
            <h2>عقارات سوريا - عقارات موثوقة للمغتربين</h2>
            <p>عقارات سوريا موثوقة على عقار جيت. منصة عقارية سوريا للبيع والإيجار. شقق للبيع في دمشق، شراء عقار في سوريا، عقارات للمغتربين. عقارات موثوقة في دمشق واللاذقية وحلب وحمص.</p>
            <h2>شقق للبيع في دمشق وشراء عقار في سوريا</h2>
            <p>تبحث عن شقق للبيع في دمشق أو شراء عقار في سوريا؟ عقار جيت منصة عقارية سوريا - عقارات موثوقة للمغتربين. عقارات سوريا للبيع والإيجار.</p>
            <h2>منازل للبيع في سوريا - سوق العقارات السورية</h2>
            <p>منازل للبيع في سوريا، شراء عقار في سوريا، شقق للبيع في دمشق. سوق العقارات السورية على عقار جيت - أراضي للبيع في سوريا، استثمار عقاري في سوريا، عقارات للمغتربين. منازل للإيجار في سوريا، فرص عقارية في سوريا، عقارات بأسعار معقولة في سوريا.</p>
            <h2>أراضي للبيع في سوريا - عقارات للمغتربين</h2>
            <p>أراضي للبيع في سوريا، منازل للبيع في سوريا، منازل للإيجار في سوريا. عقارات للمغتربين - فرص عقارية في سوريا وعقارات بأسعار معقولة في سوريا. شقق للبيع في دمشق، استثمار عقاري في سوريا. سوق العقارات السورية - عقار جيت.</p>
            <h2>فرص عقارية في سوريا - عقارات بأسعار معقولة</h2>
            <p>فرص عقارية في سوريا على عقار جيت. عقارات بأسعار معقولة في سوريا - منازل للبيع في سوريا، شقق للبيع في دمشق، منازل للإيجار في سوريا. سوق العقارات السورية، أراضي للبيع في سوريا، استثمار عقاري في سوريا. عقارات للمغتربين موثوقة من المغتربين worldwide.</p>
            <h2>عقارات للكراء وللبيع - لهجة سورية</h2>
            <p>شقة للكراء، بيت للكراء، شقة مفروشة للكراء، عمارة للبيع، استراحة للبيع، شاليه للبيع في طرطوس. عقارات ريف دمشق، شراء عقار من برا للمغتربين. فلل للبيع في اللاذقية، أراضي للبيع في ريف دمشق.</p>
          </>
        ) : (
          <>
            <h1>AqaarGate - Homes for Sale in Syria | Buy Property in Syria | Apartments for Sale in Damascus</h1>
            <p>
              Homes for sale in Syria, buy property in Syria, apartments for sale in Damascus. Syrian property market on AqaarGate - land for sale Syria, property investment Syria, expat property Syria. Houses for rent Syria, real estate opportunities in Syria, affordable properties in Syria. 1000+ verified properties in Syria and Lattakia.
            </p>
            <h2>Best Real Estate Sites in Syria</h2>
            <p>
              Looking for the best real estate sites in Syria? AqaarGate is ranked among the top real estate sites in Syria. We offer a wide selection of properties for sale and rent in Syria and Lattakia, 
              including luxury homes, apartments, holiday homes, and commercial properties. Whether you need syria apartments, 
              syria houses, or syria villas, AqaarGate is one of the best real estate sites in Syria for your search.
            </p>
            <h2>Real Estate Properties in Syria</h2>
            <p>
              Discover the best real estate properties in Syria with AqaarGate. We offer a wide selection of properties for sale and rent in Syria, 
              including luxury homes, apartments, holiday homes, and commercial properties. One of the best real estate sites in Syria for expats and international buyers.
            </p>
            <h2>Lattakia Real Estate & Properties</h2>
            <p>
              Explore Lattakia properties and Lattakia real estate with AqaarGate. Our collection includes Lattakia apartments, 
              Lattakia houses, Lattakia villas, and Lattakia beach properties. Find your dream home in one of Syria's most beautiful coastal cities.
            </p>
            <h2>Holiday Homes & Vacation Rentals in Syria</h2>
            <p>
              Looking for holiday homes in Syria or vacation rentals? AqaarGate offers premium syria holiday homes and 
              lattakia holiday homes for rent. Perfect for families and expats looking for syria vacation rentals or 
              lattakia vacation rentals. Experience the beauty of Syria with our carefully selected holiday homes.
            </p>
            <h2>Syria Real Estate - Buy Property in Syria</h2>
            <p>
              Syria real estate on AqaarGate - Syrian property platform. Buy property in Syria, apartments for sale Damascus. 
              Trusted real estate for expats. 1000+ verified properties for sale and rent in Syria and Lattakia.
            </p>
            <h2>Apartments for Sale in Damascus - Syrian Property Platform</h2>
            <p>
              Apartments for sale in Damascus and buy property in Syria. AqaarGate is a Syrian property platform for Syria real estate. 
              Trusted by expats worldwide. Find your property today.
            </p>
            <h2>Homes for Sale in Syria - Land for Sale Syria</h2>
            <p>
              Homes for sale in Syria, land for sale Syria. Syrian property market - property investment Syria, real estate opportunities in Syria. 
              Buy property in Syria or find houses for rent Syria. Affordable properties in Syria for expats. Expat property Syria - AqaarGate.
            </p>
            <h2>Expat Property Syria - Houses for Rent Syria</h2>
            <p>
              Expat property Syria - homes for sale in Syria, houses for rent Syria. Real estate opportunities in Syria and affordable properties in Syria. 
              Apartments for sale in Damascus, land for sale Syria. Property investment Syria for international buyers.
            </p>
            <h2>Real Estate Opportunities in Syria - Affordable Properties</h2>
            <p>
              Real estate opportunities in Syria on AqaarGate. Affordable properties in Syria - homes for sale in Syria, apartments for sale in Damascus, 
              houses for rent Syria. Syrian property market, land for sale Syria, property investment Syria. Expat property Syria trusted by expats worldwide.
            </p>
            <h2>Apartment Rentals & Chalets - Syria Property Types</h2>
            <p>
              Apartments for rent Damascus, chalet for sale Syria, chalet for rent Tartous. Damascus countryside (Rif Dimashq) properties, farm for sale Syria. 
              Commercial property Syria, studio apartment Damascus. Buy property Syria online - AqaarGate Syria property portal.
            </p>
          </>
        )}
      </div>
      <HomePageClient />
    </>
  );
}

