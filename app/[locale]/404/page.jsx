import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
  const isAr = locale === 'ar';
  const title = isAr ? 'الصفحة غير موجودة - عقار جيت' : 'Page Not Found - AqaarGate';
  const description = isAr
    ? 'الصفحة التي تبحث عنها غير موجودة. عد إلى الصفحة الرئيسية أو تصفح عقارات سوريا واللاذقية.'
    : 'The page you are looking for does not exist. Return to homepage or browse properties in Syria and Lattakia.';
  const url = `${baseUrl}/${locale}/404`;
  const ogImage = `${baseUrl}/images/logo/og.png`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: 'AqaarGate Real Estate', type: 'image/png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function NotFoundPage() {
  // Explicitly call notFound() to render the not-found.jsx file
  // This ensures that when users navigate to /en/404 or /ar/404,
  // they see the proper localized 404 page
  notFound();
}
