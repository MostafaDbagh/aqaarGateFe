import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
  
  return {
    title: locale === 'ar' 
      ? 'الصفحة غير موجودة - عقار جيت'
      : 'Page Not Found - AqaarGate',
    description: locale === 'ar'
      ? 'الصفحة التي تبحث عنها غير موجودة. عد إلى الصفحة الرئيسية أو تصفح عقارات سوريا واللاذقية.'
      : 'The page you are looking for does not exist. Return to homepage or browse properties in Syria and Lattakia.',
    alternates: {
      canonical: `${baseUrl}/${locale}/404`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function NotFoundPage({ params }) {
  const { locale } = await params;
  
  // Explicitly call notFound() to render the not-found.jsx file
  // This ensures that when users navigate to /en/404 or /ar/404,
  // they see the proper localized 404 page
  notFound();
}
