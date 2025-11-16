import ClientLayout from './ClientLayout'
import StructuredData from '@/components/seo/StructuredData'
import KeywordOptimization from '@/components/seo/KeywordOptimization'
import AdvancedSEO from '@/components/seo/AdvancedSEO'
import PerformanceOptimization from '@/components/seo/PerformanceOptimization'
import InternationalSEO from '@/components/seo/InternationalSEO'

export const metadata = {
  title: {
    default: 'AqaarGate Real Estate - Find Your Dream Property',
    template: '%s | AqaarGate Real Estate'
  },
  description: 'Discover premium properties for sale and rent in Syria and Lattakia. AqaarGate Real Estate offers luxury homes, apartments, holiday homes (بيوت عطلات), and commercial properties for sale and rent (بيع وتأجير). Perfect for expats from Germany, Netherlands, EU countries, and Arab Gulf (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman). Expert guidance for international property buyers.',
  keywords: [
    // Syria and Lattakia keywords
    'real estate syria',
    'properties syria',
    'syria real estate',
    'lattakia properties',
    'lattakia real estate',
    'properties for sale syria',
    'properties for rent syria',
    'syria apartments',
    'syria houses',
    'lattakia apartments',
    'lattakia houses',
    'syria holiday homes',
    'syria vacation rentals',
    'lattakia holiday homes',
    'lattakia vacation rentals',
    'syria property listings',
    'lattakia property listings',
    'real estate lattakia',
    'property management syria',
    'syria real estate agent',
    'lattakia real estate agent',
    'syria home buying',
    'syria home selling',
    'lattakia home buying',
    'lattakia home selling',
    'syria commercial properties',
    'lattakia commercial properties',
    'syria luxury homes',
    'lattakia luxury homes',
    'syria property search',
    'lattakia property search',
    'syria real estate listings',
    'lattakia real estate listings',
    'syria property investment',
    'lattakia property investment',
    'syria beach properties',
    'lattakia beach properties',
    'syria coastal properties',
    'lattakia coastal properties',
    'syria villas',
    'lattakia villas',
    'syria condos',
    'lattakia condos',
    'syria land for sale',
    'lattakia land for sale',
    'syria rental properties',
    'lattakia rental properties',
    // International keywords - EU countries searching for Syria properties
    'syria real estate from germany',
    'syria properties germany',
    'syria real estate deutschland',
    'syria properties netherlands',
    'syria real estate netherlands',
    'syria properties from netherlands',
    'syria real estate from europe',
    'syria properties eu',
    'syria real estate europe',
    'buy property syria from germany',
    'buy property syria from netherlands',
    'buy property syria from europe',
    'syria real estate for expats',
    'syria properties expats',
    'syria real estate expatriates',
    'syria property investment germany',
    'syria property investment netherlands',
    'syria property investment europe',
    'syria holiday homes expats',
    'syria vacation rentals expats',
    'syria real estate for germans',
    'syria real estate for dutch',
    // International keywords - Arab Gulf countries searching for Syria properties
    'syria real estate from uae',
    'syria properties uae',
    'syria real estate dubai',
    'syria properties dubai',
    'syria real estate from saudi arabia',
    'syria properties saudi arabia',
    'syria real estate riyadh',
    'syria properties riyadh',
    'syria real estate from qatar',
    'syria properties qatar',
    'syria real estate doha',
    'syria properties doha',
    'syria real estate from kuwait',
    'syria properties kuwait',
    'syria real estate kuwait city',
    'syria properties kuwait city',
    'syria real estate from bahrain',
    'syria properties bahrain',
    'syria real estate manama',
    'syria properties manama',
    'syria real estate from oman',
    'syria properties oman',
    'syria real estate muscat',
    'syria properties muscat',
    'syria real estate gulf',
    'syria properties gulf countries',
    'buy property syria from uae',
    'buy property syria from saudi arabia',
    'buy property syria from qatar',
    'buy property syria from kuwait',
    'buy property syria from bahrain',
    'buy property syria from oman',
    'invest syria from gulf',
    'syria property investment uae',
    'syria property investment saudi arabia',
    'syria property investment qatar',
    'syria property investment kuwait',
    'syria property investment bahrain',
    'syria property investment oman',
    'syria real estate for emirates',
    'syria real estate for saudis',
    'syria real estate for qataris',
    'syria real estate for kuwaitis',
    // Local search variations - Arabic keywords
    'عقارات سوريا',
    'عقارات اللاذقية',
    'شراء عقار في سوريا',
    'استثمار عقاري في سوريا',
    'عقارات سوريا من الإمارات',
    'عقارات سوريا من السعودية',
    'عقارات سوريا من قطر',
    'عقارات سوريا من الكويت',
    // Holiday homes in Arabic
    'بيوت عطلات',
    'بيوت عطلات سوريا',
    'بيوت عطلات اللاذقية',
    'بيوت عطلات للبيع',
    'بيوت عطلات للإيجار',
    'بيع بيوت عطلات',
    'تأجير بيوت عطلات',
    'بيوت عطلات للبيع في سوريا',
    'بيوت عطلات للإيجار في سوريا',
    'بيع وتأجير بيوت',
    'بيع وتأجير بيوت عطلات',
    'بيع وتأجير بيوت في سوريا',
    'بيع وتأجير بيوت عطلات في سوريا',
    'بيوت عطلات على الشاطئ',
    'بيوت عطلات ساحلية',
    // Vacation rentals in Arabic
    'إيجار منازل عطلات',
    'منازل عطلات للايجار',
    'استئجار بيت عطلة',
    'بيوت عطلات للعائلات',
    // Holiday homes for expats in Arabic
    'بيوت عطلات للعرب',
    'بيوت عطلات للخليجيين',
    'بيوت عطلات في سوريا للعرب',
    'بيوت عطلات في سوريا للخليجيين'
  ],
  authors: [{ name: 'AqaarGate Real Estate Team' }],
  creator: 'AqaarGate Real Estate',
  publisher: 'AqaarGate Real Estate',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://AqaarGate-frontend-mostafa-4a0069a6dba8.herokuapp.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://AqaarGate-frontend-mostafa-4a0069a6dba8.herokuapp.com',
    siteName: 'AqaarGate Real Estate',
    title: 'AqaarGate Real Estate - Find Your Dream Property',
    description: 'Discover premium properties for sale and rent. Expert guidance and personalized service for all your real estate needs.',
    images: [
      {
        url: '/images/logo/logo-2@2x.png',
        width: 1200,
        height: 630,
        alt: 'AqaarGate Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AqaarGate Real Estate - Find Your Dream Property',
    description: 'Discover premium properties for sale and rent. Expert guidance and personalized service.',
    images: ['/images/logo/logo-2@2x.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || 'tKhN1veJe2nKYfDKpyWVldjh3KLbfXbEFRMigQMIZ28',
    // Note: The verification code should match the one in Google Search Console
    // If using HTML tag method, this should be the code from the meta tag content attribute
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#f1913d" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Advanced SEO Meta Tags - IMPORTANT: Add verification codes from Google Search Console, Bing Webmaster, Yandex Webmaster */}
        {/* Note: Google verification is also in metadata.verification.google, but manual meta tag ensures it's visible */}
        <meta name="google-site-verification" content={process.env.GOOGLE_SITE_VERIFICATION || "tKhN1veJe2nKYfDKpyWVldjh3KLbfXbEFRMigQMIZ28"} />
        <meta name="msvalidate.01" content={process.env.BING_VERIFICATION || "your-bing-verification-code"} />
        <meta name="yandex-verification" content={process.env.YANDEX_VERIFICATION || "your-yandex-verification-code"} />
        
        {/* Geographic Meta Tags - Target Syria and International Markets */}
        <meta name="geo.region" content="SY" />
        <meta name="geo.placename" content="Syria" />
        <meta name="geo.position" content="35.5167;35.7833" />
        <meta name="ICBM" content="35.5167, 35.7833" />
        
        {/* Target countries for international SEO */}
        <meta name="target-audience" content="Syria, Germany, Netherlands, Europe, United Arab Emirates, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman" />
        <meta name="target-market" content="Syria real estate for expats, Syria properties from EU, Syria real estate from Gulf" />
        
        {/* Language and Locale - Support multiple languages */}
        <meta name="language" content="en, ar" />
        <meta name="locale" content="en_US, ar_SY" />
        <meta httpEquiv="Content-Language" content="en, ar" />
        
        {/* Mobile Optimization */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AqaarGate Real Estate" />
        
        {/* Performance Optimization */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Cache Control */}
        <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
        <meta httpEquiv="Expires" content="31536000" />
      </head>
      <body className="popup-loader">
        <StructuredData />
        <KeywordOptimization />
        <AdvancedSEO />
        <PerformanceOptimization />
        <InternationalSEO />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
