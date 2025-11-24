import { keywordsArray } from '@/constants/keywords'

export const metadata = {
  title: 'Syria & Lattakia Real Estate - Premium Properties for Sale & Rent | Perfect for Expats from EU & Gulf | AqaarGate',
  description: 'Discover luxury homes, apartments, and holiday homes (بيوت عطلات) for sale and rent (بيع وتأجير) in Syria and Lattakia. Expert real estate guidance for expats from Germany, Netherlands, EU countries, and Arab Gulf (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman). Your trusted property partner in Syria. Browse 500+ verified properties with photos, virtual tours, and expert agent support.',
  keywords: keywordsArray,
  openGraph: {
    title: 'Syria & Lattakia Real Estate - Premium Properties for Sale & Rent | AqaarGate',
    description: 'Discover luxury homes, apartments, and holiday homes (بيوت عطلات) for sale and rent (بيع وتأجير) in Syria and Lattakia. Expert real estate guidance with AqaarGate Real Estate.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com',
    images: [
      {
        url: '/images/section/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Premium Real Estate Properties',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Real Estate Properties - Find Your Dream Home',
    description: 'Discover luxury homes, apartments, and commercial properties for sale and rent.',
    images: ['/images/section/hero-bg.jpg'],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com',
  },
}

import HomePageClient from './HomePageClient'

export default function Home() {
  return <HomePageClient />
}
