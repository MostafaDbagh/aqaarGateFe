import { getDefaultOgImages, getDefaultOgImageUrls } from "@/lib/defaultOgImages";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const url = `${baseUrl}/${locale}/privacy-policy`;
  const isAr = locale === 'ar';
  return {
    title: isAr
      ? 'سياسة الخصوصية - AqaarGate'
      : "Privacy Policy - AqaarGate | Syria Real Estate",
    description: isAr
      ? 'اكتشف كيف تحمي AqaarGate معلوماتك الشخصية عند استخدام منصتنا العقارية في سوريا.'
      : "Learn how AqaarGate protects your personal information when you use our real estate platform in Syria.",
    keywords: [
      'privacy policy',
      'aqaargate privacy',
      'syria real estate privacy',
      'data protection',
      'personal information',
    ],
    openGraph: {
      title: isAr ? 'سياسة الخصوصية - AqaarGate' : 'Privacy Policy - AqaarGate',
      description: isAr
        ? 'سياسة الخصوصية و حماية البيانات'
        : 'Learn how we protect your data.',
      url,
      images: getDefaultOgImages(baseUrl, locale),
    },
    twitter: {
      card: 'summary_large_image',
      title: isAr ? 'سياسة الخصوصية - AqaarGate' : 'Privacy Policy - AqaarGate',
      description: isAr ? 'سياسة الخصوصية و حماية البيانات' : 'Learn how we protect your data.',
      images: getDefaultOgImageUrls(baseUrl, locale),
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default function PrivacyPolicyLayout({ children }) {
  return children;
}
