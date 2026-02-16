import PrivacyPolicyContent from "./PrivacyPolicyContent";
import { getDefaultOgImages, getDefaultOgImageUrls } from "@/lib/defaultOgImages";
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aqaargate.com";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const url = `${baseUrl}/${locale}/privacy-policy`;
  return {
    title: "Privacy Policy - AqaarGate | Syria & Lattakia Real Estate",
    description:
      "AqaarGate privacy policy. How we collect, use, and protect your data when you use our real estate platform in Syria and Lattakia.",
    keywords: [
      "privacy policy aqaargate",
      "syria real estate privacy",
      "data protection real estate",
    ],
    openGraph: {
      title: "Privacy Policy - AqaarGate | Syria & Lattakia Real Estate",
      description:
        "AqaarGate privacy policy. How we collect, use, and protect your data when you use our real estate platform.",
      url,
      images: getDefaultOgImages(baseUrl, locale),
    },
    twitter: {
      card: "summary_large_image",
      title: "Privacy Policy - AqaarGate",
      description: "How we collect, use, and protect your data. AqaarGate real estate platform.",
      images: getDefaultOgImageUrls(baseUrl, locale),
    },
    alternates: { canonical: url },
  };
}

export default function page() {
  return <PrivacyPolicyContent />;
}
