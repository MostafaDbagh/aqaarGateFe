"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Hero from "@/components/homes/home-1/Hero";
import { useSearchListings } from "@/apis/hooks";
import { cleanParams } from "@/utlis/cleanedParams";

// Lazy load heavy components for better performance
const Categories = lazy(() => import("@/components/common/Categories"));
const Properties = lazy(() => import("@/components/homes/home-1/Properties"));
const Cities = lazy(() => import("@/components/homes/home-1/Cities"));
const Properties2 = lazy(() => import("@/components/homes/home-1/Properties2"));

// Loading component for Suspense fallback
const ComponentLoader = ({ name }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '200px',
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'loading 1.5s infinite'
  }}>
    <style jsx>{`
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
    <div style={{ 
      padding: '20px', 
      borderRadius: '8px', 
      background: 'rgba(255,255,255,0.9)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      Loading {name}...
    </div>
  </div>
);

export default function HomePageClient() {
  const [searchParams, setSearchParams] = useState({
    status: "",
    keyword: "",
    priceMin: "",
    priceMax: "",
    sizeMin: "",
    sizeMax: "",
    state: "",
    bedrooms: "",
    bathrooms: "",
    amenities: [],
    propertyType: "",
    furnished: ""
  });

  const [triggerSearch, setTriggerSearch] = useState(false);
  const [category, setCategory] = useState("");
  const [params, setParams] = useState(null);

  useEffect(() => {
    if (triggerSearch || category) {
      const cleaned = cleanParams(searchParams);
      setParams(cleaned);
    }
  }, [searchParams, triggerSearch, category]);

  const {
    data: listings = [],
    isLoading,
    isError,
  } = useSearchListings(params);

  const handleSearchChange = (newParams) =>
    setSearchParams((prev) => ({ ...prev, ...newParams }));

  return (
    <>
      <Header1 />
      <Hero
        searchParams={searchParams}
        onSearchChange={handleSearchChange}
        setTriggerSearch={setTriggerSearch}
      />
      <main className="main-content">
        <Suspense fallback={<ComponentLoader name="Categories" />}>
          <Categories
            searchParams={searchParams}
            onSearchChange={handleSearchChange}
            setTriggerSearch={setTriggerSearch}
            setCategory={setCategory}
          />
        </Suspense>
        <Suspense fallback={<ComponentLoader name="Properties" />}>
          <Properties
            listings={listings}
            isLoading={isLoading}
            isError={isError}
          />
        </Suspense>
        <Suspense fallback={<ComponentLoader name="Cities" />}>
          <Cities />
        </Suspense>
        <Suspense fallback={<ComponentLoader name="Properties2" />}>
          <Properties2 />
        </Suspense>
      </main>
      <Footer1 />
    </>
  );
}
