"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Hero from "@/components/homes/home-1/Hero";
import LocationLoader from "@/components/common/LocationLoader";
import { useSearchListings } from "@/apis/hooks";
import { cleanParams } from "@/utlis/cleanedParams";

// Lazy load heavy components for better performance
const Categories = lazy(() => import("@/components/common/Categories").catch(() => ({ default: () => <div>Categories unavailable</div> })));
const Properties = lazy(() => import("@/components/homes/home-1/Properties").catch(() => ({ default: () => <div>Properties unavailable</div> })));
const Cities = lazy(() => import("@/components/homes/home-1/Cities").catch(() => ({ default: () => <div>Cities unavailable</div> })));
const Properties2 = lazy(() => import("@/components/homes/home-1/Properties2").catch(() => ({ default: () => <div>Properties2 unavailable</div> })));

// Loading component for Suspense fallback
const ComponentLoader = ({ name }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '200px',
    padding: '40px 20px'
  }}>
    <LocationLoader size="medium" message={`Loading ${name}...`} />
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
  // Initialize with default limit: 12 for home page performance
  const [params, setParams] = useState({ limit: 12, sort: 'newest' });

  useEffect(() => {
    if (triggerSearch || category) {
      const cleaned = cleanParams(searchParams);
      // Add limit: 12 for home page to improve loading performance
      setParams({ ...cleaned, limit: 12, sort: cleaned.sort || 'newest' });
    } else {
      // Default: show only 12 properties on home page when no search
      setParams({ limit: 12, sort: 'newest' });
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
