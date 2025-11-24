export default function InternationalSEO() {
  // Use the production domain - update this to match your actual domain
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';

  return (
    <>
      {/* International SEO - Hreflang tags for different regions */}
      <link rel="alternate" hreflang="en" href={`${baseUrl}/en`} />
      <link rel="alternate" hreflang="ar" href={`${baseUrl}/ar`} />
      <link rel="alternate" hreflang="de" href={`${baseUrl}/de`} />
      <link rel="alternate" hreflang="nl" href={`${baseUrl}/nl`} />
      <link rel="alternate" hreflang="en-SY" href={`${baseUrl}/en-sy`} />
      <link rel="alternate" hreflang="ar-SY" href={`${baseUrl}/ar-sy`} />
      <link rel="alternate" hreflang="en-DE" href={`${baseUrl}/en-de`} />
      <link rel="alternate" hreflang="en-NL" href={`${baseUrl}/en-nl`} />
      <link rel="alternate" hreflang="en-AE" href={`${baseUrl}/en-ae`} />
      <link rel="alternate" hreflang="ar-AE" href={`${baseUrl}/ar-ae`} />
      <link rel="alternate" hreflang="en-SA" href={`${baseUrl}/en-sa`} />
      <link rel="alternate" hreflang="ar-SA" href={`${baseUrl}/ar-sa`} />
      <link rel="alternate" hreflang="en-QA" href={`${baseUrl}/en-qa`} />
      <link rel="alternate" hreflang="ar-QA" href={`${baseUrl}/ar-qa`} />
      <link rel="alternate" hreflang="en-KW" href={`${baseUrl}/en-kw`} />
      <link rel="alternate" hreflang="ar-KW" href={`${baseUrl}/ar-kw`} />
      <link rel="alternate" hreflang="en-BH" href={`${baseUrl}/en-bh`} />
      <link rel="alternate" hreflang="ar-BH" href={`${baseUrl}/ar-bh`} />
      <link rel="alternate" hreflang="en-OM" href={`${baseUrl}/en-om`} />
      <link rel="alternate" hreflang="ar-OM" href={`${baseUrl}/ar-om`} />
      <link rel="alternate" hreflang="x-default" href={`${baseUrl}`} />

      {/* Geographic targeting meta tags for Syria */}
      <meta name="geo.region" content="SY" />
      <meta name="geo.placename" content="Syria" />
      <meta name="geo.position" content="35.5167;35.7833" />
      <meta name="ICBM" content="35.5167, 35.7833" />
      
      {/* Target audience from EU and Gulf countries */}
      <meta name="target" content="Syria, Germany, Netherlands, Europe, United Arab Emirates, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman" />
      
      {/* International keywords for search engines */}
      <meta name="keywords" content="syria real estate from germany, syria properties netherlands, syria real estate expats, syria properties eu, syria real estate uae, syria properties saudi arabia, syria real estate qatar, syria properties kuwait, syria real estate bahrain, syria properties oman, buy property syria from europe, invest syria from gulf, syria holiday homes expats, syria vacation rentals eu" />
    </>
  );
}

