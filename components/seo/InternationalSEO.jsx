export default function InternationalSEO() {
  // Use the production domain - update this to match your actual domain
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';

  return (
    <>
      {/* International SEO - Hreflang: only /en and /ar exist; regional variants point to them */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
      <link rel="alternate" hrefLang="ar" href={`${baseUrl}/ar`} />
      <link rel="alternate" hrefLang="en-SY" href={`${baseUrl}/en`} />
      <link rel="alternate" hrefLang="ar-SY" href={`${baseUrl}/ar`} />
      <link rel="alternate" hrefLang="en-DE" href={`${baseUrl}/en`} />
      <link rel="alternate" hrefLang="en-NL" href={`${baseUrl}/en`} />
      <link rel="alternate" hrefLang="en-AE" href={`${baseUrl}/en`} />
      <link rel="alternate" hrefLang="ar-AE" href={`${baseUrl}/ar`} />
      <link rel="alternate" hrefLang="en-SA" href={`${baseUrl}/en`} />
      <link rel="alternate" hrefLang="ar-SA" href={`${baseUrl}/ar`} />
      <link rel="alternate" hrefLang="en-QA" href={`${baseUrl}/en`} />
      <link rel="alternate" hrefLang="ar-QA" href={`${baseUrl}/ar`} />
      <link rel="alternate" hrefLang="en-KW" href={`${baseUrl}/en`} />
      <link rel="alternate" hrefLang="ar-KW" href={`${baseUrl}/ar`} />
      <link rel="alternate" hrefLang="en-BH" href={`${baseUrl}/en`} />
      <link rel="alternate" hrefLang="ar-BH" href={`${baseUrl}/ar`} />
      <link rel="alternate" hrefLang="en-OM" href={`${baseUrl}/en`} />
      <link rel="alternate" hrefLang="ar-OM" href={`${baseUrl}/ar`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en`} />

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

