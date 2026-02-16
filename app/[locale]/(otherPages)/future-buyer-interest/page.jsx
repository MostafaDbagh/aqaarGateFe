import FutureBuyerInterestClient from "./FutureBuyerInterestClient";
import { getDefaultOgImages, getDefaultOgImageUrls } from "@/lib/defaultOgImages";
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aqaargate.com";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const url = `${baseUrl}/${locale}/future-buyer-interest`;
  return {
    title: "Future Buyer Interest - AqaarGate | Syria & Lattakia Real Estate",
    description:
      "Register your interest in Syria and Lattakia properties. Get notified when properties matching your criteria become available. AqaarGate real estate.",
    keywords: [
      "future buyer syria",
      "property interest syria",
      "lattakia property alerts",
      "syria real estate interest",
      "property notification syria",
    ],
    openGraph: {
      title: "Future Buyer Interest - AqaarGate | Syria & Lattakia Real Estate",
      description:
        "Register your interest in Syria and Lattakia properties. Get notified when matching properties become available.",
      url,
      images: getDefaultOgImages(baseUrl, locale),
    },
    twitter: {
      card: "summary_large_image",
      title: "Future Buyer Interest - AqaarGate",
      description: "Register your interest in Syria and Lattakia properties. Get notified for new listings.",
      images: getDefaultOgImageUrls(baseUrl, locale),
    },
    alternates: { canonical: url },
  };
}

export default function page() {
  return <FutureBuyerInterestClient />;
}
