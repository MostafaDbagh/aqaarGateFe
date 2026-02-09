import Cta from "@/components/common/Cta";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Benefits from "@/components/otherPages/career/Benefits";
import Jobs from "@/components/otherPages/career/Jobs";
import PageTitle from "@/components/otherPages/career/PageTitle";
import Reviews from "@/components/otherPages/career/Reviews";

import React from "react";

export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aqaargate.com";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const url = `${baseUrl}/${locale}/career`;
  return {
    title: "Careers at AqaarGate - Real Estate Jobs in Syria & Lattakia",
    description: "Join AqaarGate's team. Explore career opportunities in real estate in Syria and Lattakia. We're looking for talented individuals to help showcase Syria's property market.",
    keywords: [
      "careers aqaargate",
      "syria real estate jobs",
      "lattakia real estate careers",
      "property jobs syria",
      "real estate careers syria",
    ],
    openGraph: {
      title: "Careers at AqaarGate - Real Estate Jobs in Syria & Lattakia",
      description: "Join AqaarGate's team. Explore career opportunities in real estate in Syria and Lattakia.",
      url,
      images: [{ url: `${baseUrl}/images/logo/new-logo.png`, width: 1200, height: 630, alt: 'AqaarGate - Careers' }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Careers at AqaarGate - Real Estate Jobs in Syria & Lattakia",
      description: "Join AqaarGate's team. Explore career opportunities in real estate in Syria and Lattakia.",
      images: [`${baseUrl}/images/logo/new-logo.png`],
    },
    alternates: { canonical: url },
  };
}

async function fetchCareers() {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === "development" ? "http://localhost:5500/api" : "https://aqaargatebe2.onrender.com/api");
    const res = await fetch(`${apiUrl}/career?limit=50`, {
      next: { revalidate: 60 },
      headers: { "Cache-Control": "no-cache" },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

export default async function page() {
  const initialCareers = await fetchCareers();

  return (
    <>
      <div id="wrapper" className="counter-scroll">
        <Header1 />
        <PageTitle />
        <div className="main-content" style={{ paddingTop: "40px" }}>
          <Jobs initialCareers={initialCareers} />
          <Benefits />
          <Reviews />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
