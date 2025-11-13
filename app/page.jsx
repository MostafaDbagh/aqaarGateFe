export const metadata = {
  title: 'Syria & Lattakia Real Estate - Premium Properties for Sale & Rent',
  description: 'Discover luxury homes, apartments, and holiday homes for sale and rent in Syria and Lattakia. Expert real estate guidance with Proty Real Estate - your trusted property partner in Syria.',
  keywords: [
    'syria real estate',
    'lattakia real estate',
    'syria properties for sale',
    'syria properties for rent',
    'lattakia properties for sale',
    'lattakia properties for rent',
    'syria holiday homes',
    'lattakia holiday homes',
    'syria vacation rentals',
    'lattakia vacation rentals',
    'syria luxury homes',
    'lattakia luxury homes',
    'syria apartments',
    'lattakia apartments',
    'syria houses',
    'lattakia houses',
    'syria commercial properties',
    'lattakia commercial properties',
    'syria property listings',
    'lattakia property listings',
    'syria real estate agent',
    'lattakia real estate agent',
    'syria property search',
    'lattakia property search',
    'syria beach properties',
    'lattakia beach properties',
    'syria coastal properties',
    'lattakia coastal properties',
    'syria villas',
    'lattakia villas',
    'syria property investment',
    'lattakia property investment',
    'syria land for sale',
    'lattakia land for sale'
  ],
  openGraph: {
    title: 'Syria & Lattakia Real Estate - Premium Properties for Sale & Rent',
    description: 'Discover luxury homes, apartments, and holiday homes for sale and rent in Syria and Lattakia. Expert real estate guidance with Proty Real Estate.',
    url: 'https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com',
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
    canonical: 'https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com',
  },
}

import HomePageClient from './HomePageClient'

export default function Home() {
  return <HomePageClient />
}
