"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Hero from "@/components/homes/home-1/Hero";
import LocationLoader from "@/components/common/LocationLoader";
import { useSearchListings } from "@/apis/hooks";
import { cleanParams } from "@/utlis/cleanedParams";
import { useLocale } from 'next-intl';

// Lazy load heavy components for better performance
// Add error handling to prevent webpack runtime errors
const Categories = lazy(() => import("@/components/common/Categories").catch(() => ({ default: () => null })));
const Properties = lazy(() => import("@/components/homes/home-1/Properties").catch(() => ({ default: () => null })));
const Cities = lazy(() => import("@/components/homes/home-1/Cities").catch(() => ({ default: () => null })));
const Properties2 = lazy(() => import("@/components/homes/home-1/Properties2").catch(() => ({ default: () => null })));
const SEOContent = lazy(() => import("@/components/homes/home-1/SEOContent").catch(() => ({ default: () => null })));

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
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [isMobile, setIsMobile] = useState(false);

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

  // Check if mobile on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Check for AI search results in sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedResults = sessionStorage.getItem('aiSearchResults');
      if (storedResults) {
        try {
          const parsed = JSON.parse(storedResults);
          if (parsed && parsed.listings && parsed.listings.length > 0) {
            // Defer state updates to avoid synchronous setState in effect (lint + perf)
            queueMicrotask(() => {
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
            });
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

  // CRITICAL: "Most Recent Listings" should ALWAYS use normal search, regardless of AI search
  // Create separate params for Most Recent Listings that are NEVER affected by AI search
  const [mostRecentParams, setMostRecentParams] = useState({ limit: 12, sort: 'newest' });

  useEffect(() => {
    // CRITICAL: "Most Recent Listings" is COMPLETELY independent of AI search
    // It should ONLY be affected by normal search filters, never by AI search
    // When AI search is active, always show default last 12 listings (no filters)
    
    // Normal search - apply filters but limit to 12 listings
    if (triggerSearch || category) {
      queueMicrotask(() => {
        setUseAISearch(false);
        setAiSearchResults(null);
      });
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('aiSearchResults');
      }
      const cleaned = cleanParams(searchParams);
      queueMicrotask(() => {
        setMostRecentParams({ ...cleaned, limit: 12, sort: cleaned.sort || 'newest' });
      });
    } else {
      queueMicrotask(() => {
        setMostRecentParams({ limit: 12, sort: 'newest' });
      });
    }
  }, [searchParams, triggerSearch, category]); // Removed useAISearch from dependencies

  // CRITICAL: Always fetch normal search listings for "Most Recent Listings" section
  // This hook runs independently of AI search - it's always enabled
  const {
    data: listings = [],
    isLoading,
    isError,
  } = useSearchListings(mostRecentParams, { enabled: true }); // Always enabled

  // CRITICAL: "Most Recent Listings" section should ALWAYS use normal search
  // It should NOT be affected by AI search - only show last 12 listings from normal search
  // Ensure we always limit to 12 listings for the home page
  const finalListings = Array.isArray(listings) 
    ? listings.slice(0, 12) // Always limit to 12 listings
    : (listings?.data ? listings.data.slice(0, 12) : []);
  
  // Always use normal search loading/error states (ignore AI search for this section)
  const finalIsLoading = isLoading;
  const finalIsError = isError;

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

  // Clear all search filters
  const handleClearAllSearch = () => {
    // Clear AI search
    setUseAISearch(false);
    setAiSearchResults(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('aiSearchResults');
    }
    
    // Clear normal search params
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
    
    // Reset params to default
    setParams({ limit: 12, sort: 'newest' });
    setMostRecentParams({ limit: 12, sort: 'newest' });
    setTriggerSearch(false);
    setCategory("");
    
    // Scroll to top
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Check if there's an active search (filters applied)
  const hasActiveSearch = Object.values(searchParams).some(value => 
    value !== "" && value !== null && (Array.isArray(value) ? value.length > 0 : true)
  ) || triggerSearch || category;

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
        <Suspense fallback={null}>
          <SEOContent />
        </Suspense>
      </main>
      <Footer1 />
      
      {/* Clear Search Button - Fixed Position (same as property-list page) */}
      {hasActiveSearch && (
        <button
          onClick={handleClearAllSearch}
          aria-label={isRTL ? "مسح البحث" : "Clear Search"}
          title={isRTL ? "مسح البحث" : "Clear Search"}
          style={{
            position: 'fixed',
            bottom: isMobile ? '20px' : '30px',
            [isRTL ? 'left' : 'right']: isMobile ? '20px' : '30px',
            zIndex: 1000,
            background: '#F1913D',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: isMobile ? '12px 20px' : '14px 24px',
            fontSize: isMobile ? '13px' : '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(241, 145, 61, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#EA580C';
            e.target.style.boxShadow = '0 6px 16px rgba(241, 145, 61, 0.5)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#F1913D';
            e.target.style.boxShadow = '0 4px 12px rgba(241, 145, 61, 0.4)';
            e.target.style.transform = 'translateY(0)';
          }}
          onMouseDown={(e) => {
            e.target.style.transform = 'translateY(0)';
          }}
          onMouseUp={(e) => {
            e.target.style.transform = 'translateY(-2px)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{isRTL ? "مسح البحث" : "Clear Search"}</span>
        </button>
      )}
    </>
  );
}
