import ClientLayout from './ClientLayout'
import StructuredData from '@/components/seo/StructuredData'
import KeywordOptimization from '@/components/seo/KeywordOptimization'
import AdvancedSEO from '@/components/seo/AdvancedSEO'
import PerformanceOptimization from '@/components/seo/PerformanceOptimization'

export const metadata = {
  title: {
    default: 'AqaarGate Real Estate - Find Your Dream Property',
    template: '%s | AqaarGate Real Estate'
  },
  description: 'Discover premium properties for sale and rent in Syria and Lattakia. AqaarGate Real Estate offers luxury homes, apartments, holiday homes, and commercial properties with expert guidance and personalized service throughout Syria.',
  keywords: [
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
    'lattakia rental properties'
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
    google: 'your-google-verification-code', // Replace with actual verification code
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
        
        {/* Advanced SEO Meta Tags */}
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        <meta name="yandex-verification" content="your-yandex-verification-code" />
        
        {/* Geographic Meta Tags */}
        <meta name="geo.region" content="SY-LA" />
        <meta name="geo.placename" content="Lattakia, Syria" />
        <meta name="geo.position" content="35.5167;35.7833" />
        <meta name="ICBM" content="35.5167, 35.7833" />
        
        {/* Language and Locale */}
        <meta name="language" content="en-US" />
        <meta name="locale" content="en_US" />
        
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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
