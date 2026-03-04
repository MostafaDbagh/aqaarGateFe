import VipPageClient from "./VipPageClient";
import { getDefaultOgImages, getDefaultOgImageUrls } from "@/lib/defaultOgImages";
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aqaargate.com";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const url = `${baseUrl}/${locale}/vip`;
  const isAr = locale === "ar";
  const title = isAr
    ? "عقارات VIP | عقار غيت - نقدّر وقتك | عقارات سوريا واللاذقية المميزة"
    : "VIP Properties | AqaarGate - Curated Listings for Busy Professionals | Syria & Lattakia";
  const description = isAr
    ? "عقارات VIP مختارة لصنّاع القرار. نقدّر وقتك—خيارات ذات جودة جاهزة لك دون إضاعة الوقت. عقارات للبيع والإيجار في سوريا واللاذقية."
    : "Curated VIP property listings for busy professionals. We value your time—quality options, ready for you. Syria & Lattakia real estate. Hand-picked listings for decision-makers.";
  return {
    title,
    description,
    keywords: isAr
      ? ["عقارات VIP", "عقار غيت", "عقارات سوريا مميزة", "عقارات للبيع والايجار", "عقارات اللاذقية"]
      : ["VIP properties Syria", "VIP listings Lattakia", "curated real estate Syria", "AqaarGate VIP", "premium properties Syria"],
    openGraph: {
      title: isAr ? "عقارات VIP - عقار غيت | نقدّر وقتك" : "VIP Properties - AqaarGate | We Value Your Time",
      description,
      url,
      images: getDefaultOgImages(baseUrl, locale),
      type: "website",
      locale: isAr ? "ar" : "en",
      alternateLocale: isAr ? "en" : "ar",
    },
    twitter: {
      card: "summary_large_image",
      title: isAr ? "عقارات VIP - عقار غيت" : "VIP Properties - AqaarGate",
      description,
      images: getDefaultOgImageUrls(baseUrl, locale),
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/vip`,
        ar: `${baseUrl}/ar/vip`,
        "x-default": `${baseUrl}/en/vip`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default function VipPage() {
  return <VipPageClient />;
}
