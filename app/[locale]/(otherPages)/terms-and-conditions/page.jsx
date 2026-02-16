import TermsAndConditionsContent from "./TermsAndConditionsContent";
import { getDefaultOgImages, getDefaultOgImageUrls } from "@/lib/defaultOgImages";
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aqaargate.com";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const url = `${baseUrl}/${locale}/terms-and-conditions`;
  return {
    title: "Terms and Conditions - AqaarGate | Syria & Lattakia Real Estate",
    description:
      "AqaarGate terms and conditions. Rules and guidelines for using our real estate platform and services in Syria and Lattakia.",
    keywords: [
      "terms and conditions aqaargate",
      "syria real estate terms",
      "real estate platform terms",
    ],
    openGraph: {
      title: "Terms and Conditions - AqaarGate | Syria & Lattakia Real Estate",
      description:
        "AqaarGate terms and conditions. Rules and guidelines for using our real estate platform and services.",
      url,
      images: getDefaultOgImages(baseUrl, locale),
    },
    twitter: {
      card: "summary_large_image",
      title: "Terms and Conditions - AqaarGate",
      description: "Rules and guidelines for using AqaarGate real estate platform.",
      images: getDefaultOgImageUrls(baseUrl, locale),
    },
    alternates: { canonical: url },
  };
}

export default function page() {
  return <TermsAndConditionsContent />;
}
