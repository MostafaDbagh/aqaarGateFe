// Root layout - minimal, locale-specific layout is in [locale]/layout.jsx
export const metadata = {
  title: {
    default: 'AqaarGate - Premium Real Estate Properties in Syria & Lattakia | AqaarGate.com',
    template: '%s | AqaarGate Real Estate'
  },
  description: 'AqaarGate - Premium Real Estate Properties in Syria & Lattakia. Discover luxury homes, apartments, holiday homes (بيوت عطلات), and commercial properties for sale and rent (بيع وتأجير). Perfect for expats from Germany, Netherlands, EU countries, and Arab Gulf (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman). Expert guidance for international property buyers. Visit AqaarGate.com for the best properties in Syria.',
  keywords: [
    // Brand keywords - CRITICAL for brand search
    'aqaargate',
    'aqaargate.com',
    'aqaargate real estate',
    'aqaargate syria',
    'aqaargate lattakia',
    'aqaargate properties',
    'aqaargate عقارات',
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com',
    siteName: 'AqaarGate',
    title: 'AqaarGate - Premium Real Estate Properties in Syria & Lattakia | AqaarGate.com',
    description: 'AqaarGate - Discover premium properties for sale and rent in Syria and Lattakia. Luxury homes, apartments, holiday homes (بيوت عطلات), and commercial properties. Perfect for expats from EU and Gulf countries.',
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
    title: 'AqaarGate - Premium Real Estate Properties in Syria & Lattakia | AqaarGate.com',
    description: 'AqaarGate - Discover premium properties for sale and rent in Syria and Lattakia. Luxury homes, apartments, holiday homes, and commercial properties.',
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

// Root layout - Next.js requires <html> and <body> in root layout
// With localePrefix: 'always', all routes go through [locale]/layout.jsx
// The nested layout will override the lang/dir attributes via its own <html> tag
// But Next.js still requires root layout to have <html>/<body>
import Providers from './Providers';
import IntlProvider from './IntlProvider';

export default function RootLayout({ children }) {
  // Root layout must have <html> and <body> for Next.js
  // The [locale]/layout.jsx will provide locale-specific <html> with lang/dir
  // Next.js will use the nested layout's <html> instead of this one
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <Providers>
          <IntlProvider>
            {children}
          </IntlProvider>
        </Providers>
      </body>
    </html>
  );
}
