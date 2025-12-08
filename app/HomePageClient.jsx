"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Hero from "@/components/homes/home-1/Hero";
import LocationLoader from "@/components/common/LocationLoader";
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
  // State to track if we're using AI search results
  const [aiSearchResults, setAiSearchResults] = useState(null);
  const [useAISearch, setUseAISearch] = useState(false);
  // Initialize with default limit: 12 for home page performance
  const [params, setParams] = useState({ limit: 12, sort: 'newest' });

  // Check for AI search results in sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedResults = sessionStorage.getItem('aiSearchResults');
      if (storedResults) {
        try {
          const parsed = JSON.parse(storedResults);
          if (parsed && parsed.listings && parsed.listings.length > 0) {
            // Clear normal search params when AI search is applied
            setSearchParams({
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
            
            setAiSearchResults(parsed);
            setUseAISearch(true);
            // Clear from sessionStorage after reading (optional - you may want to keep it)
            // sessionStorage.removeItem('aiSearchResults');
          }
        } catch (e) {
          console.error('Error parsing AI search results:', e);
          sessionStorage.removeItem('aiSearchResults');
        }
      }
    }
  }, []);

  useEffect(() => {
    // If using AI search, don't update params
    if (useAISearch) {
      return;
    }

    // Clear AI search when normal search is triggered
    if (triggerSearch || category) {
      setUseAISearch(false);
      setAiSearchResults(null);
      sessionStorage.removeItem('aiSearchResults');
      const cleaned = cleanParams(searchParams);
      // Add limit: 12 for home page to improve loading performance
      setParams({ ...cleaned, limit: 12, sort: cleaned.sort || 'newest' });
    } else {
      // Default: show only 12 properties on home page when no search
      setParams({ limit: 12, sort: 'newest' });
    }
  }, [searchParams, triggerSearch, category, useAISearch]);

  const {
    data: listings = [],
    isLoading,
    isError,
  } = useSearchListings(params);

  // Determine which listings to use: AI search results or normal search
  const finalListings = useAISearch && aiSearchResults?.listings
    ? aiSearchResults.listings
    : listings;
  
  const finalIsLoading = useAISearch ? false : isLoading;
  const finalIsError = useAISearch ? false : isError;

  const handleSearchChange = (newParams) => {
    // If we're using AI search and user changes search params, clear AI search
    if (useAISearch) {
      setUseAISearch(false);
      setAiSearchResults(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('aiSearchResults');
      }
    }
    setSearchParams((prev) => ({ ...prev, ...newParams }));
  };

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
            listings={finalListings}
            isLoading={finalIsLoading}
            isError={finalIsError}
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
