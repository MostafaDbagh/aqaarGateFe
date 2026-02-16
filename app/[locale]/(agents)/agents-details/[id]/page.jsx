import AgentDetails from "@/components/agents/AgentDetails";
import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import { getDefaultOgImages, getDefaultOgImageUrls } from "@/lib/defaultOgImages";
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aqaargate.com";

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const url = `${baseUrl}/${locale}/agents-details/${id}`;
  return {
    title: "Agent Details | AqaarGate - Syria & Lattakia Real Estate",
    description:
      "View AqaarGate real estate agent profile. Expert agents for properties in Syria and Lattakia. Contact for buying, selling, or renting.",
    keywords: [
      "syria real estate agent",
      "lattakia real estate agent",
      "aqaargate agents",
      "property agent syria",
    ],
    openGraph: {
      title: "Agent Details | AqaarGate - Syria & Lattakia Real Estate",
      description:
        "View AqaarGate real estate agent profile. Expert agents for properties in Syria and Lattakia.",
      url,
      images: getDefaultOgImages(baseUrl, locale),
    },
    twitter: {
      card: "summary_large_image",
      title: "Agent Details | AqaarGate",
      description: "View AqaarGate real estate agent profile. Syria and Lattakia properties.",
      images: getDefaultOgImageUrls(baseUrl, locale),
    },
    alternates: { canonical: url },
  };
}

export default async function page({ params }) {
  const { id } = await params;

  return (
    <>
      <div id="wrapper">
        <Header1 />
        <div className="page-content">
          <Breadcumb pageName="Agents Details" />
          <AgentDetails agentId={id} />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
