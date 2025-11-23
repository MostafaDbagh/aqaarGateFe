import ClientLayout from './ClientLayout'
import StructuredData from '@/components/seo/StructuredData'
import KeywordOptimization from '@/components/seo/KeywordOptimization'
import AdvancedSEO from '@/components/seo/AdvancedSEO'
import PerformanceOptimization from '@/components/seo/PerformanceOptimization'
import InternationalSEO from '@/components/seo/InternationalSEO'
import KeywordsMetaTag from '@/components/seo/KeywordsMetaTag'
import EnhancedSEO from '@/components/seo/EnhancedSEO'
import { keywordsArray } from '@/constants/keywords'

export const metadata = {
  title: {
    default: 'AqaarGate Real Estate - Find Your Dream Property',
    template: '%s | AqaarGate Real Estate'
  },
  description: 'Discover premium properties for sale and rent in Syria and Lattakia. AqaarGate Real Estate offers luxury homes, apartments, holiday homes (بيوت عطلات), and commercial properties for sale and rent (بيع وتأجير). Perfect for expats from Germany, Netherlands, EU countries, and Arab Gulf (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman). Expert guidance for international property buyers. Browse 500+ verified properties with photos, virtual tours, and expert agent support.',
  keywords: keywordsArray,
  authors: [{ name: 'AqaarGate Real Estate Team' }],
  creator: 'AqaarGate Real Estate',
  publisher: 'AqaarGate Real Estate',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com',
    siteName: 'AqaarGate Real Estate',
    title: 'AqaarGate Real Estate - Premium Properties in Syria & Lattakia',
    description: 'Discover premium properties for sale and rent in Syria and Lattakia. Luxury homes, apartments, holiday homes (بيوت عطلات), and commercial properties. Perfect for expats from EU and Gulf countries.',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'AqaarGate Real Estate - Premium Properties in Syria',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AqaarGate Real Estate - Premium Properties in Syria & Lattakia',
    description: 'Discover premium properties for sale and rent in Syria and Lattakia. Luxury homes, apartments, holiday homes, and commercial properties.',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/images/og-image.png`],
    creator: '@AqaarGate',
    site: '@AqaarGate',
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
        
        {/* Enhanced Open Graph Meta Tags for Better Social Media Sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'} />
        <meta property="og:title" content="AqaarGate Real Estate - Premium Properties in Syria & Lattakia" />
        <meta property="og:description" content="Discover premium properties for sale and rent in Syria and Lattakia. Luxury homes, apartments, holiday homes (بيوت عطلات), and commercial properties. Perfect for expats from EU and Gulf countries." />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/images/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="AqaarGate Real Estate - Premium Properties in Syria" />
        <meta property="og:site_name" content="AqaarGate Real Estate" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="ar_SY" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'} />
        <meta name="twitter:title" content="AqaarGate Real Estate - Premium Properties in Syria & Lattakia" />
        <meta name="twitter:description" content="Discover premium properties for sale and rent in Syria and Lattakia. Luxury homes, apartments, holiday homes, and commercial properties." />
        <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'}/images/og-image.png`} />
        <meta name="twitter:image:alt" content="AqaarGate Real Estate - Premium Properties in Syria" />
        <meta name="twitter:creator" content="@AqaarGate" />
        <meta name="twitter:site" content="@AqaarGate" />
        
        {/* Additional Meta Tags for Better Social Sharing */}
        <meta name="application-name" content="AqaarGate Real Estate" />
        <meta name="apple-mobile-web-app-title" content="AqaarGate" />
        <meta name="msapplication-TileColor" content="#f1913d" />
        <meta name="msapplication-TileImage" content="/images/logo/logo@2x.png" />
        
        {/* Advanced SEO Meta Tags - IMPORTANT: Add verification codes from Google Search Console, Bing Webmaster, Yandex Webmaster */}
        {/* Note: Google verification is also in metadata.verification.google, but manual meta tag ensures it's visible */}
        <meta name="google-site-verification" content={process.env.GOOGLE_SITE_VERIFICATION || "tKhN1veJe2nKYfDKpyWVldjh3KLbfXbEFRMigQMIZ28"} />
        <meta name="msvalidate.01" content={process.env.BING_VERIFICATION || "your-bing-verification-code"} />
        <meta name="yandex-verification" content={process.env.YANDEX_VERIFICATION || "your-yandex-verification-code"} />
        
        {/* Keywords Meta Tag - Added via KeywordsMetaTag component for better compatibility */}
        
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
        
        {/* Security Headers - Additional layer */}
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      </head>
      <body className="popup-loader">
        <KeywordsMetaTag />
        <EnhancedSEO />
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
