import Cta from "@/components/common/Cta";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Benefits from "@/components/otherPages/career/Benefits";
import Jobs from "@/components/otherPages/career/Jobs";
import PageTitle from "@/components/otherPages/career/PageTitle";
import Reviews from "@/components/otherPages/career/Reviews";

import React from "react";

export const dynamic = "force-dynamic";

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
