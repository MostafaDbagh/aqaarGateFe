import HomePageClient from '../HomePageClient';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (locale === 'ar') {
    return {
      title: 'عقار جيت AqaarGate - افضل المواقع العقارية في سوريا | سوق العقارات الإلكتروني في سورية',
      description: 'افضل المواقع العقارية في سوريا - عقار جيت. سوق العقارات الإلكتروني في سورية، منصة عقارات في سوريا - عدد العروض أكثر من 1000 عقار. شقق للبيع في سوريا، شقة للبيع في دمشق، عقارات في اللاذقية، شاليه في طرطوس، عقارات في حلب ودمشق وحمص. بيع وإيجار عقارات سوريا. ابدأ البحث اليوم.',
      keywords: ['افضل المواقع العقارية في سوريا', 'أفضل المواقع العقارية في سوريا', 'افضل موقع عقاري في سوريا', 'سوق العقارات الإلكتروني في سورية', 'عقارات في سوريا', 'شقق للبيع في سوريا', 'شقة للبيع في دمشق', 'شقة للاجار في دمشق', 'عقارات في دمشق', 'عقارات في اللاذقية', 'شقة للاجار في اللاذقية', 'عقارات في حلب', 'شاليه في طرطوس', 'عقارات في حمص', 'منصة عقارات في سورية', 'عقار جيت', 'aqaargate'],
      openGraph: {
        title: 'عقار جيت - افضل المواقع العقارية في سوريا | سوق العقارات الإلكتروني في سورية',
        description: 'افضل المواقع العقارية في سوريا - عقار جيت. سوق العقارات الإلكتروني في سورية، عقارات في سوريا، شقق للبيع في دمشق واللاذقية. أكثر من 1000 عقار.',
        url: `${baseUrl}/ar`,
        locale: 'ar_SA',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'عقار جيت - افضل المواقع العقارية في سوريا',
        description: 'افضل المواقع العقارية في سوريا - عقار جيت. سوق العقارات الإلكتروني في سورية، عقارات في سوريا. أكثر من 1000 عقار.',
      },
      alternates: { canonical: `${baseUrl}/ar` },
    };
  }
  return {
    title: 'AqaarGate - Best Real Estate Sites in Syria | #1 Platform | Buy, Rent & Sell',
    description: 'AqaarGate is one of the best real estate sites in Syria. The #1 real estate platform in Syria & Lattakia. 1000+ verified properties for sale and rent. Luxury homes, apartments, holiday homes, villas. Trusted worldwide. Start your search today!',
    keywords: ['best real estate sites in Syria', 'best real estate sites in syria', 'real estate Syria', 'properties Syria', 'aqaargate'],
    openGraph: {
      title: 'AqaarGate - Best Real Estate Sites in Syria | #1 Platform',
      description: 'One of the best real estate sites in Syria. AqaarGate - #1 platform in Syria & Lattakia. 1000+ properties for sale and rent. Holiday homes, villas, apartments.',
      url: `${baseUrl}/en`,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AqaarGate - Best Real Estate Sites in Syria',
      description: 'One of the best real estate sites in Syria. #1 platform in Syria & Lattakia. 1000+ properties for sale and rent.',
    },
    alternates: { canonical: `${baseUrl}/en` },
  };
}

export default async function Home({ params }) {
  const { locale } = await params;
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
            <p>عقارات في دمشق، عقارات في حلب، عقارات في اللاذقية، عقارات في حمص. شقة للبيع في دمشق، شقة للاجار في دمشق، شقة للاجار في اللاذقية، شاليه في طرطوس. عقارات للبيع في حمص، عقارات للاجار في دمشق. مكتب للاجار، عيادة للاجار. عقار جيت يربطك بأفضل العروض في سوريا.</p>
            <h2>شقق للبيع في سوريا</h2>
            <p>تبحث عن شقق للبيع في سوريا أو شقة للبيع في دمشق؟ عقار جيت يعرض عقارات في سوريا ودمشق واللاذقية. شقق للبيع في سوريا، شقق للإيجار، فلل ومنازل.</p>
            <h2>عقارات في دمشق واللاذقية وطرطوس</h2>
            <p>عقارات في دمشق، عقارات في اللاذقية، عقارات في حلب، شاليه في طرطوس. عقارات في حمص، عقارات للبيع في حمص. منصة عقارات في سورية - عقار جيت.</p>
            <h2>منصة عقارات في سورية</h2>
            <p>منصة عقارات في سورية رقم ١. بيع وشراء بيوت في سورية، تأجير بيوت في سورية. عقارات سوريا واللاذقية ودمشق. مستقبل العقارات في دمشق وسوريا.</p>
          </>
        ) : (
          <>
            <h1>AqaarGate - Best Real Estate Sites in Syria | #1 Platform | Buy, Rent & Sell</h1>
            <p>
              AqaarGate is one of the best real estate sites in Syria. The #1 real estate platform in Syria and Lattakia. Find 1000+ verified properties for sale and rent. 
              Discover luxury homes, apartments, holiday homes (بيوت عطلات سوريا), villas, and commercial properties. 
              Trusted by expats from Germany, Netherlands, EU, UAE, Saudi Arabia, Qatar, Kuwait. Start your property search today!
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
          </>
        )}
      </div>
      <HomePageClient />
    </>
  );
}

