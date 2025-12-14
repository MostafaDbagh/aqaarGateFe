"use client";
import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import DropdownSelect from "../common/DropdownSelect";
import PropertyGridItems from "./PropertyGridItems";
import PropertyListItems from "./PropertyListItems";
import LayoutHandler from "./LayoutHandler";
import FilterModal from "./FilterModal";
import { useSearchListings, useAISearch as useAISearchHook } from "@/apis/hooks";
import { cleanParams } from "@/utlis/cleanedParams";
import LocationLoader from "../common/LocationLoader";

function Properties1Content({ defaultGrid = false }) {
  const t = useTranslations('propertyList');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const searchParamsFromUrl = useSearchParams();
  
  // Initialize AI search state from sessionStorage immediately (client-side only)
  // This prevents the race condition where normal search runs before AI search is detected
  const [aiSearchInitialized, setAiSearchInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Initialize both useAISearch and aiSearchResults synchronously from sessionStorage
  // Use useMemo to prevent multiple calls during render
  const { initialUseAISearch, initialAiSearchResults } = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedResults = sessionStorage.getItem('aiSearchResults');
        if (storedResults) {
          const parsed = JSON.parse(storedResults);
          const listings = parsed?.listings || parsed?.data || [];
          if (Array.isArray(listings) && listings.length > 0) {
            // Normalize the results object
            const normalizedResults = {
              ...parsed,
              listings: listings,
              data: listings,
              query: parsed.query || "",
              pagination: parsed.pagination || {
                total: listings.length,
                page: 1,
                limit: 12,
                totalPages: Math.ceil(listings.length / 12),
                hasNextPage: listings.length > 12,
                hasPrevPage: false
              }
            };
            console.log('🚀 Synchronously initializing AI search from sessionStorage:', {
              listingsCount: listings.length,
              query: normalizedResults.query,
              pagination: normalizedResults.pagination,
              firstListing: listings[0] ? { id: listings[0]._id || listings[0].propertyId, type: listings[0].propertyType } : null
            });
            return {
              initialUseAISearch: true,
              initialAiSearchResults: normalizedResults
            };
          }
        }
      } catch (e) {
        console.error('Error initializing AI search from sessionStorage:', e);
      }
    }
    return {
      initialUseAISearch: false,
      initialAiSearchResults: null
    };
  }, []); // Empty deps - only run once
  
  const [aiSearchResults, setAiSearchResults] = useState(initialAiSearchResults);
  const [useAISearch, setUseAISearch] = useState(initialUseAISearch);
  const [isMobile, setIsMobile] = useState(false);
  
  // Initialize search params from URL if available
  const [searchParams, setSearchParams] = useState(() => {
    // If we have AI search in sessionStorage, clear all params
    if (typeof window !== 'undefined') {
      try {
        const storedResults = sessionStorage.getItem('aiSearchResults');
        if (storedResults) {
          const parsed = JSON.parse(storedResults);
          const listings = parsed?.listings || parsed?.data || [];
          if (Array.isArray(listings) && listings.length > 0) {
            // Clear all params when AI search is active
            return {
              status: "",
              keyword: "",
              priceMin: "",
              priceMax: "",
              sizeMin: "",
              sizeMax: "",
              state: "",
              cities: "",
              bedrooms: "",
              bathrooms: "",
              amenities: [],
              propertyType: "",
              furnished: "",
              propertyId: "",
              sort: "newest"
            };
          }
        }
      } catch (e) {
        // Ignore errors
      }
    }
    // Otherwise use URL params
    return {
      status: searchParamsFromUrl.get('status') || "",
      keyword: searchParamsFromUrl.get('keyword') || "",
      priceMin: searchParamsFromUrl.get('priceMin') || "",
      priceMax: searchParamsFromUrl.get('priceMax') || "",
      sizeMin: searchParamsFromUrl.get('sizeMin') || "",
      sizeMax: searchParamsFromUrl.get('sizeMax') || "",
      state: searchParamsFromUrl.get('state') || "",
      cities: searchParamsFromUrl.get('cities') || "",
      bedrooms: searchParamsFromUrl.get('bedrooms') || "",
      bathrooms: searchParamsFromUrl.get('bathrooms') || "",
      amenities: [],
      propertyType: searchParamsFromUrl.get('propertyType') || "",
      furnished: searchParamsFromUrl.get('furnished') || "",
      propertyId: searchParamsFromUrl.get('propertyId') || "",
      sort: searchParamsFromUrl.get('sort') || "newest"
    };
  });

  // Load AI search results from sessionStorage on mount (client-side only)
  // This runs after initial render to refresh/update the data if needed
  useEffect(() => {
    if (typeof window !== 'undefined' && !aiSearchInitialized) {
      // If we already initialized synchronously, just mark as initialized
      if (initialAiSearchResults) {
        console.log('✅ AI search already initialized synchronously, marking as initialized');
        setAiSearchInitialized(true);
        return;
      }
      
      // Otherwise, try to load from sessionStorage (fallback)
      const storedResults = sessionStorage.getItem('aiSearchResults');
      console.log('🔍 Checking sessionStorage for AI search results (useEffect fallback)...', {
        hasStoredResults: !!storedResults
      });
      
      if (storedResults) {
        try {
          const parsed = JSON.parse(storedResults);
          const listings = parsed?.listings || parsed?.data || [];
          
          if (Array.isArray(listings) && listings.length > 0) {
            const normalizedResults = {
              ...parsed,
              listings: listings,
              data: listings,
              query: parsed.query || ""
            };
            
            console.log('✅ Loading AI search results from sessionStorage (useEffect):', {
              listingsCount: listings.length,
              query: normalizedResults.query
            });
            
            setAiSearchResults(normalizedResults);
            setUseAISearch(true);
            setCurrentPage(1);
            setAiSearchInitialized(true);
          } else {
            sessionStorage.removeItem('aiSearchResults');
            setUseAISearch(false);
            setAiSearchInitialized(true);
          }
        } catch (e) {
          console.error('❌ Error parsing AI search results:', e);
          sessionStorage.removeItem('aiSearchResults');
          setUseAISearch(false);
          setAiSearchInitialized(true);
        }
      } else {
        console.log('ℹ️ No AI search results in sessionStorage');
        setAiSearchInitialized(true);
      }
    }
  }, [aiSearchInitialized, initialAiSearchResults]);
  
  // Check if mobile on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth <= 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Prepare API params with pagination - only use if NOT using AI search
  const apiParams = {
    ...cleanParams(searchParams),
    page: currentPage,
    limit: 12
  };

  const {
    data: searchResponse,
    isLoading,
    isError,
    error
  } = useSearchListings(apiParams, { 
    enabled: !useAISearch && aiSearchInitialized // Only run normal search if AI search is not active AND we've checked sessionStorage
  }); // Disable normal search when AI search is active

  // Fetch AI search results when page changes (if using AI search)
  const aiSearchQuery = useAISearch && aiSearchResults?.query ? aiSearchResults.query : '';
  const {
    data: aiSearchPageResponse,
    isLoading: isAISearchPageLoading,
    isError: isAISearchPageError
  } = useAISearchHook(aiSearchQuery, {
    page: currentPage,
    limit: 12,
    enabled: useAISearch && !!aiSearchQuery && aiSearchInitialized && currentPage > 1 // Only fetch if page > 1 (page 1 is from sessionStorage)
  });

  // Handle AI Search results - memoized to prevent infinite loops
  const handleAISearchResults = useCallback((results) => {
    if (results && results.query && results.query.trim().length > 0) {
      // Clear normal search params when AI search is applied
      setSearchParams({
        status: "",
        keyword: "",
        priceMin: "",
        priceMax: "",
        sizeMin: "",
        sizeMax: "",
        state: "",
        cities: "",
        bedrooms: "",
        bathrooms: "",
        amenities: [],
        propertyType: "",
        furnished: "",
        propertyId: "",
        sort: "newest"
      });
      
      setAiSearchResults(results);
      setUseAISearch(true);
      setCurrentPage(1);
      // Store in sessionStorage for persistence
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('aiSearchResults', JSON.stringify(results));
      }
    } else {
      setAiSearchResults(null);
      setUseAISearch(false);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('aiSearchResults');
      }
    }
  }, []);

  // Initialize clientListings immediately from sessionStorage (before hydration)
  // This prevents showing "no listings" message before data loads
  const [clientListings, setClientListings] = useState(() => {
    // Try to get initial data immediately (client-side only)
    if (typeof window !== 'undefined') {
      // Check for AI search in sessionStorage
      try {
        const storedResults = sessionStorage.getItem('aiSearchResults');
        if (storedResults) {
          const parsed = JSON.parse(storedResults);
          const listings = parsed?.listings || parsed?.data || [];
          if (Array.isArray(listings) && listings.length > 0) {
            return listings;
          }
        }
      } catch (e) {
        // Ignore errors
      }
    }
    return [];
  });
  
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Mark as hydrated after mount to prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // Update client listings when search results change (only on client)
  useEffect(() => {
    if (!isHydrated) return; // Don't update until after hydration
    
    let newListings = [];
    
    if (useAISearch) {
      // AI search is active - use page response if available (for page > 1), otherwise use sessionStorage results
      if (currentPage > 1 && aiSearchPageResponse?.data && Array.isArray(aiSearchPageResponse.data) && aiSearchPageResponse.data.length > 0) {
        // Use API response for pages > 1
        newListings = aiSearchPageResponse.data;
      } else if (currentPage === 1) {
        // Use sessionStorage results for page 1
        if (aiSearchResults?.listings && Array.isArray(aiSearchResults.listings)) {
          newListings = aiSearchResults.listings;
        } else if (aiSearchResults?.data && Array.isArray(aiSearchResults.data)) {
          newListings = aiSearchResults.data;
        }
      }
    } else {
      // Normal search - ONLY use searchResponse
      if (searchResponse) {
        if (Array.isArray(searchResponse)) {
          newListings = searchResponse;
        } else if (searchResponse?.data && Array.isArray(searchResponse.data)) {
          newListings = searchResponse.data;
        }
      }
    }
    
    // Only update if listings actually changed to prevent infinite loops
    const currentIds = clientListings.map(l => l._id || l.propertyId).sort().join(',');
    const newIds = newListings.map(l => l._id || l.propertyId).sort().join(',');
    
    if (currentIds !== newIds) {
      setClientListings(newListings);
    }
  }, [useAISearch, aiSearchPageResponse?.data, searchResponse, isHydrated, currentPage]); // Removed aiSearchResults and clientListings from deps to prevent loops
  
  // Use client listings - show data immediately if available, even before hydration
  // This prevents the "no listings" flash
  const listings = clientListings;
  
  // Use AI search pagination if available, otherwise use API pagination or calculate from listings
  const limit = 12;
  let total, totalPages, pagination;
  
  if (useAISearch && aiSearchResults?.pagination) {
    // AI search pagination - use pagination from sessionStorage (has total: 35)
    pagination = aiSearchResults.pagination;
    total = pagination.total || 35; // Use total from pagination (35), not listings.length (12)
    totalPages = pagination.totalPages || Math.ceil(total / limit);
    // Ensure pagination object has all required fields
    // Use currentPage directly (not pagination.page) because pagination.page from sessionStorage is always 1
    pagination = {
      ...pagination,
      page: currentPage, // Always use currentPage, not pagination.page from sessionStorage
      limit: pagination.limit || limit,
      total: total, // Keep original total (35)
      totalPages: totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    };
  } else if (searchResponse?.pagination) {
    // Normal search with API pagination
    pagination = searchResponse.pagination;
    total = pagination.total || listings.length;
    totalPages = pagination.totalPages || Math.ceil(total / limit);
    pagination = {
      ...pagination,
      page: pagination.page || currentPage,
      limit: pagination.limit || limit,
      total: total,
      totalPages: totalPages,
      hasNextPage: pagination.hasNextPage !== undefined ? pagination.hasNextPage : (currentPage < totalPages),
      hasPrevPage: pagination.hasPrevPage !== undefined ? pagination.hasPrevPage : (currentPage > 1)
    };
  } else {
    // Fallback: calculate from listings (should not happen if API returns pagination)
    total = listings.length;
    totalPages = Math.ceil(total / limit);
    pagination = {
      total: total,
      page: currentPage,
      limit: limit,
      totalPages: totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    };
  }
  
  // For AI search, use listings directly (already paginated from API for page > 1, or from sessionStorage for page 1)
  // For normal search, listings are already paginated from API, so use them directly
  const paginatedListings = useMemo(() => {
    // For AI search, listings are already the correct page (either from API for page > 1, or from sessionStorage for page 1)
    // No need for client-side pagination - just use listings directly
    return listings;
  }, [listings]);
  
  // Debug logging - CRITICAL for troubleshooting (only log once per state change)
  useEffect(() => {
    if (!isHydrated) return;
    
    // Only log when key values change, not on every render
    const debugInfo = {
      useAISearch,
      currentPage,
      listingsCount: listings.length,
      paginatedCount: paginatedListings.length,
      hasAiSearchResults: !!aiSearchResults,
      hasAiSearchPageResponse: !!aiSearchPageResponse?.data,
      totalFromPagination: pagination?.total
    };
    
    console.log('🔍 Search State:', debugInfo);
  }, [useAISearch, currentPage, listings.length, paginatedListings.length, isHydrated, pagination?.total]);
  
  // Combine loading states
  // Show loading if: normal search is loading, OR AI search page > 1 is loading, OR not hydrated yet and no initial data
  const isSearchLoading = useAISearch 
    ? (currentPage > 1 ? isAISearchPageLoading : false) || (!isHydrated && clientListings.length === 0) // Show loading for pages > 1 or during initial hydration
    : isLoading || (!isHydrated && clientListings.length === 0); // Show loading during initial hydration if no data
  const isSearchError = useAISearch 
    ? (currentPage > 1 ? isAISearchPageError : false) // Only check error for pages > 1
    : isError;
  
  // Track if AI search was initialized from sessionStorage to prevent clearing it
  const aiSearchFromStorageRef = useRef(!!initialAiSearchResults);
  
  // Reset to normal search when filters change or normal search is triggered
  // BUT: Don't reset if we just initialized from sessionStorage (to prevent race condition)
  useEffect(() => {
    // Skip this check if we just initialized (give it time to settle)
    if (!aiSearchInitialized) {
      return;
    }
    
    // CRITICAL: If AI search was initialized from sessionStorage, DISABLE this check completely
    // The user navigated here with AI search results, so we should NOT clear them
    if (aiSearchFromStorageRef.current && useAISearch) {
      // Don't clear AI search if it was loaded from sessionStorage
      // Only clear if user explicitly triggers handleSearchChange or handleClearAllSearch
      console.log('🔒 AI search from sessionStorage is protected - not checking for filter changes');
      return;
    }
    
    // Only check for manual filter changes if AI search was NOT from storage
    if (useAISearch && !aiSearchFromStorageRef.current) {
      // If AI search was NOT from storage (user initiated), check for any filter changes
      const hasManualFilters = Object.entries(searchParams).some(([key, value]) => {
        if (value === "" || value === null) return false;
        if (Array.isArray(value)) return value.length > 0;
        return !!value;
      });
      
      if (hasManualFilters) {
        console.log('🔄 Manual filters detected, switching from AI search to normal search');
        setUseAISearch(false);
        setAiSearchResults(null);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('aiSearchResults');
        }
      }
    }
  }, [searchParams, useAISearch, aiSearchInitialized]);

  // Clear AI search when normal search is explicitly triggered
  const handleSearchChange = (newParams) => {
    // If we're using AI search and user changes search params, switch to normal search
    if (useAISearch) {
      setUseAISearch(false);
      setAiSearchResults(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('aiSearchResults');
      }
    }
    setSearchParams((prev) => ({ ...prev, ...newParams }));
    setCurrentPage(1); // Reset to first page when search changes
  };
  

  // Clear all search (both AI and normal)
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
      cities: "",
      bedrooms: "",
      bathrooms: "",
      amenities: [],
      propertyType: "",
      furnished: "",
      propertyId: "",
      sort: "newest"
    });
    
    setCurrentPage(1);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if there's an active search (AI or normal)
  // Only show Clear Search button when there are actual filters applied (not default values)
  const hasActiveSearch = useAISearch || Object.entries(searchParams).some(([key, value]) => {
    // Ignore sort if it's the default value
    if (key === 'sort' && (value === 'newest' || value === '')) {
      return false;
    }
    // Check if value is not empty
    if (value === "" || value === null || value === undefined) {
      return false;
    }
    // Check if array has items
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    // For other values, check if they're not empty strings
    return value !== "";
  });

  // Debug: Log the API response

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    // Note: useAISearch hook will automatically fetch new page data via aiSearchPageResponse
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePaginationItems = () => {
    const items = [];
    const { page, totalPages } = pagination;
    
    
    // Previous button
    items.push(
      <li key="prev" className={`arrow ${!pagination.hasPrevPage ? 'disabled' : ''}`}>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (pagination.hasPrevPage) {
              handlePageChange(page - 1);
            }
          }}
        >
          <i className="icon-arrow-left" />
        </a>
      </li>
    );

    // Calculate total pages manually if API doesn't provide it correctly
    const actualTotalPages = Math.ceil(pagination.total / pagination.limit);
    const effectiveTotalPages = actualTotalPages > 0 ? actualTotalPages : 1;

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(effectiveTotalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      items.push(
        <li key={1}>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
          >
            1
          </a>
        </li>
      );
      if (startPage > 2) {
        items.push(
          <li key="ellipsis1">
            <a href="#">...</a>
          </li>
        );
      }
    }

    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <li key={i} className={i === page ? 'active' : ''}>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i}
          </a>
        </li>
      );
    }

    // Last page
    if (endPage < effectiveTotalPages) {
      if (endPage < effectiveTotalPages - 1) {
        items.push(
          <li key="ellipsis2">
            <a href="#">...</a>
          </li>
        );
      }
      items.push(
        <li key={effectiveTotalPages}>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(effectiveTotalPages);
            }}
          >
            {effectiveTotalPages}
          </a>
        </li>
      );
    }

    // Next button
    items.push(
      <li key="next" className={`arrow ${!pagination.hasNextPage ? 'disabled' : ''}`}>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (pagination.hasNextPage) {
              handlePageChange(page + 1);
            }
          }}
        >
          <i className="icon-arrow-right" />
        </a>
      </li>
    );

    return items;
  };
  
  return (
    <>
      <style jsx>{`
        .loading-container {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          min-height: 60vh !important;
          width: 100% !important;
          grid-column: 1 / -1 !important;
          position: relative !important;
          left: 0 !important;
          right: 0 !important;
          margin: 0 auto !important;
          padding: 40px 0 !important;
          text-align: center !important;
        }
        
        .tf-grid-layout .loading-container {
          grid-column: 1 / -1 !important;
          width: 100% !important;
          max-width: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          min-height: 60vh !important;
          padding: 40px 0 !important;
        }
        
        .error-container {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          min-height: 200px !important;
          width: 100% !important;
          grid-column: 1 / -1 !important;
          color: #dc3545 !important;
          position: relative !important;
          left: 0 !important;
          right: 0 !important;
          margin: 0 auto !important;
          padding: 0 !important;
          text-align: center !important;
        }
        
        .tf-grid-layout .error-container {
          grid-column: 1 / -1 !important;
          width: 100% !important;
          max-width: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        
        /* Fix dropdown to show downward in RTL */
        [dir="rtl"] .nice-select > .list,
        html[dir="rtl"] .nice-select > .list {
          top: 100% !important;
          bottom: auto !important;
          transform-origin: 50% 0 !important;
          -webkit-transform-origin: 50% 0 !important;
          -ms-transform-origin: 50% 0 !important;
        }
        
        [dir="rtl"] .nice-select.open > .list,
        html[dir="rtl"] .nice-select.open > .list {
          transform: scale(1) translateY(0) !important;
          -webkit-transform: scale(1) translateY(0) !important;
          -ms-transform: scale(1) translateY(0) !important;
        }
        
      `}</style>
      
      <section className="section-property-layout">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="box-title mb-64">
                <h2>{t('title')}</h2>
                <div className="right" style={{ display: 'flex', gap: '12px', alignItems: 'center', ...(isRTL ? { flexDirection: 'row-reverse' } : {}) }}>
                      <div
                        className="filter-popup"
                        data-bs-toggle="modal"
                        href="#modalFilter"
                        role="button"
                        style={{
                          opacity: (!isLoading && !isError && paginatedListings.length === 0) ? 0.5 : 1,
                          cursor: (!isLoading && !isError && paginatedListings.length === 0) ? 'not-allowed' : 'pointer',
                          pointerEvents: (!isLoading && !isError && paginatedListings.length === 0) ? 'none' : 'auto'
                        }}
                        title={(!isLoading && !isError && paginatedListings.length === 0) 
                          ? (isRTL ? 'لا توجد نتائج - تم تعطيل الفلترة' : 'No results - Filtering disabled')
                          : ''}
                      >
                        {t('filter')}
                        <div className="icons">
                          <svg width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                           aria-hidden="true">
                            <path
                              d="M21 4H14"
                              stroke="#F1913D"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M10 4H3"
                              stroke="#F1913D"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M21 12H12"
                              stroke="#F1913D"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8 12H3"
                              stroke="#F1913D"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M21 20H16"
                              stroke="#F1913D"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 20H3"
                              stroke="#F1913D"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14 2V6"
                              stroke="#F1913D"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8 10V14"
                              stroke="#F1913D"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M16 18V22"
                              stroke="#F1913D"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <ul className="nav-tab-filter group-layout" role="tablist">
                        <LayoutHandler defaultGrid={defaultGrid} />
                      </ul>
                      <DropdownSelect
                        addtionalParentClass="select-filter list-sort"
                        options={[t('newest'), t('oldest')]}
                        value={searchParams.sort === "newest" ? t('newest') : t('oldest')}
                        onChange={(value) => {
                          const sortValue = value === t('newest') ? "newest" : "oldest";
                          handleSearchChange({ sort: sortValue });
                        }}
                      />
                    </div>
              </div>
              <div className="flat-animate-tab">
                <div className="tab-content">
                  <div
                    className={`tab-pane ${defaultGrid ? " active show" : ""}`}
                    id="gridLayout"
                    role="tabpanel"
                  >
                    <div className="tf-grid-layout lg-col-3 md-col-2">
                      {isLoading ? (
                        <div className="loading-container">
                          <LocationLoader 
                            size="large" 
                            message="Finding amazing properties for you..."
                          />
                        </div>
                      ) : isError ? (
                        <div className="error-container">
                          <p>Error loading properties: {error?.message || 'Unknown error'}</p>
                        </div>
                      ) : (
                        <PropertyGridItems 
                          listings={paginatedListings} 
                          isAISearch={useAISearch} 
                          hasActiveSearch={hasActiveSearch}
                        />
                      )}
                    </div>
                  </div>
                  <div
                    className={`tab-pane ${!defaultGrid ? " active show" : ""}`}
                    id="listLayout"
                    role="tabpanel"
                  >
                    <div className="tf-grid-layout lg-col-2">
                      {isLoading ? (
                        <div className="loading-container">
                          <LocationLoader 
                            size="large" 
                            message="Finding amazing properties for you..."
                          />
                        </div>
                      ) : isError ? (
                        <div className="error-container">
                          <p>Error loading properties: {error?.message || 'Unknown error'}</p>
                        </div>
                      ) : (
                        <PropertyListItems 
                          listings={paginatedListings} 
                          isAISearch={useAISearch} 
                          hasActiveSearch={hasActiveSearch}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="wrap-pagination">
                <p className="text-1">
                  {t('showingResults', {
                    start: ((pagination.page - 1) * pagination.limit) + 1,
                    end: Math.min(pagination.page * pagination.limit, pagination.total),
                    total: pagination.total
                  })}
                </p>
                <ul className="wg-pagination">
                  {Math.ceil(pagination.total / pagination.limit) > 1 ? generatePaginationItems() : (
                    // Show single page if only one page
                    <>
                      <li className="arrow disabled">
                        <a href="#">
                          <i className="icon-arrow-left" />
                        </a>
                      </li>
                      <li className="active">
                        <a href="#">1</a>
                      </li>
                      <li className="arrow disabled">
                        <a href="#">
                          <i className="icon-arrow-right" />
                        </a>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Clear Search Button - Fixed Position */}
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
      
      <FilterModal 
        onSearchChange={handleSearchChange} 
        searchParams={searchParams}
        disabled={!isLoading && !isError && paginatedListings.length === 0}
      />
    </>
  );
}

export default function Properties1({ defaultGrid = false }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Properties1Content defaultGrid={defaultGrid} />
    </Suspense>
  );
}
