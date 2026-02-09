"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { useAISearch } from "@/apis/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import styles from "./AISearchButton.module.css";

/**
 * AI Search Button Component
 * Opens a modal with AI search input when clicked
 * Available for all users (no authentication required)
 */
export default function AISearchButton({ onSearchResults }) {
  const t = useTranslations('hero');
  const tPropertyList = useTranslations('propertyList');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isActive, setIsActive] = useState(false);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce query to avoid too many API calls
  const debouncedQuery = useDebounce(query, 800);

  // AI Search hook
  const {
    data: aiSearchResponse,
    isLoading,
    isError,
    error
  } = useAISearch(debouncedQuery, {
    page: 1,
    limit: 12,
    enabled: debouncedQuery.trim().length > 0 && isOpen
  });

  // Extract data from response
  // API returns: { success: true, data: [...], extractedParams: {...}, pagination: {...} }
  // useAISearch hook returns: response.data which is the entire response object
  // So aiSearchResponse = { success: true, data: [...], extractedParams: {...}, pagination: {...} }
  const listings = aiSearchResponse?.data || [];
  const extractedParams = aiSearchResponse?.extractedParams || {};
  const pagination = aiSearchResponse?.pagination || {};

  const hasMeaningfulParams = (params) => {
    if (!params) return false;
    const {
      propertyType, bedrooms, bathrooms, sizeMin, sizeMax,
      priceMin, priceMax, status, city, neighborhood,
      furnished, garages, viewType, rentType, amenities = [], keywords = []
    } = params;

    const hasNeighborhood = !!(neighborhood && neighborhood.trim().length > 0);
    const hasStrong =
      propertyType ||
      status ||
      city ||
      viewType ||
      rentType ||
      (furnished !== null && furnished !== undefined) ||
      (garages !== null && garages !== undefined) ||
      (Array.isArray(amenities) && amenities.length > 0) ||
      (bedrooms !== null && bedrooms !== undefined) ||
      (bathrooms !== null && bathrooms !== undefined) ||
      (sizeMin !== null && sizeMin !== undefined) ||
      (sizeMax !== null && sizeMax !== undefined) ||
      (priceMin !== null && priceMin !== undefined) ||
      (priceMax !== null && priceMax !== undefined);

    // keywords alone are not enough; neighborhood alone is weak (needs city)
    if (hasStrong) return true;
    if (hasNeighborhood && city) return true;
    return false;
  };

  const meaningful = hasMeaningfulParams(extractedParams) && !isError;
  const effectiveListings = meaningful ? listings : [];
  const effectivePagination = meaningful && pagination ? pagination : {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  };
  
  // Auto-close modal and navigate when results are ready (after submit)
  useEffect(() => {
    if (isOpen && effectiveListings.length > 0 && debouncedQuery.trim().length > 0 && !isLoading) {
      // Check if this was triggered by a submit
      const wasSubmitted = typeof window !== 'undefined' && sessionStorage.getItem('aiSearchSubmitted') === 'true';
      
      if (wasSubmitted) {
        // Normalize the response structure - API returns { data: [...], pagination: {...} }
        // We store it as { listings: [...], pagination: {...} } for consistency
        const results = {
          listings: Array.isArray(effectiveListings) ? effectiveListings : [],
          data: Array.isArray(effectiveListings) ? effectiveListings : [],
          extractedParams: extractedParams || {},
          pagination: effectivePagination,
          query: debouncedQuery || query
        };
        
        // Store in sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('aiSearchResults', JSON.stringify(results));
          sessionStorage.removeItem('aiSearchSubmitted');
        }
        
        // Call callback if provided
        if (onSearchResults) {
          onSearchResults(results);
        }
        
        // Close modal
        setIsOpen(false);
        setQuery("");
        
        // Navigate to property list page
        router.push('/property-list');
      }
    }
  }, [listings, extractedParams, pagination, debouncedQuery, isLoading, isOpen, onSearchResults, router, query]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Close modal on outside click (only on modal content, not overlay since there's no overlay)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery("");
      }
    };

    if (isOpen) {
      // Only add listener if modal is open, but don't prevent body scroll since there's no overlay
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setIsActive(e.target.value.length > 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      // Mark that submit was clicked
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('aiSearchSubmitted', 'true');
      }
      
      // If we already have results, process immediately
      if (!isLoading && effectiveListings.length > 0) {
        // Normalize the response structure - API returns { data: [...], pagination: {...} }
        // We store it as { listings: [...], pagination: {...} } for consistency
        const results = {
          listings: Array.isArray(effectiveListings) ? effectiveListings : [],
          data: Array.isArray(effectiveListings) ? effectiveListings : [],
          extractedParams: extractedParams || {},
          pagination: effectivePagination,
          query: debouncedQuery || query
        };
        
        // Store in sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('aiSearchResults', JSON.stringify(results));
          sessionStorage.removeItem('aiSearchSubmitted');
        }
        
        // Call callback if provided
        if (onSearchResults) {
          onSearchResults(results);
        }
        
        // Close modal
        setIsOpen(false);
        setQuery("");
        
        // Navigate to property list page
        router.push('/property-list');
      }
      // If still loading, the useEffect will handle it when results arrive
    }
  };

  const handleExampleClick = (example) => {
    setQuery(example);
    setIsActive(true);
  };

  // Handle results box click - same behavior as submit button
  const handleResultsClick = () => {
    if (meaningful && effectiveListings.length > 0 && !isLoading) {
      // Normalize the response structure
      const results = {
        listings: Array.isArray(effectiveListings) ? effectiveListings : [],
        data: Array.isArray(effectiveListings) ? effectiveListings : [],
        extractedParams: extractedParams || {},
        pagination: effectivePagination || {
          total: effectiveListings.length,
          page: 1,
          limit: 12,
          totalPages: Math.ceil(effectiveListings.length / 12),
          hasNextPage: false,
          hasPrevPage: false
        },
        query: debouncedQuery || query
      };
      
      // Store in sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('aiSearchResults', JSON.stringify(results));
        sessionStorage.removeItem('aiSearchSubmitted');
      }
      
      // Call callback if provided
      if (onSearchResults) {
        onSearchResults(results);
      }
      
      // Close modal
      setIsOpen(false);
      setQuery("");
      
      // Navigate to property list page
      router.push('/property-list');
    }
  };

  const exampleQueries = isRTL ? [
    "شقة غرفتين في اللاذقية",
    "فيلا للبيع في حمص",
  ] : [
    "apartment with 2 bedrooms in latakia",
    "villa for sale in homs",
  ];

  if (!isOpen) {
    return (
      <button
        type="button"
        className={styles.aiSearchButton}
        onClick={handleOpen}
        aria-label={isRTL ? "بحث بالذكاء الاصطناعي" : "AI Search"}
      >
        <span className={styles.aiSearchIcon}>🤖</span>
        <span>{isRTL ? "بحث ذكي" : "AI Search"}</span>
      </button>
    );
  }

  return (
    <>
      <div className={styles.aiSearchModal}>
        <div ref={modalRef} className={styles.aiSearchModalContent}>
          <div className={styles.aiSearchModalHeader}>
            <div className={styles.aiSearchModalTitle}>
              <span>🤖</span>
              <span>{isRTL ? "البحث بالذكاء الاصطناعي" : "AI Search"}</span>
            </div>
            <button
              type="button"
              className={styles.aiSearchModalClose}
              onClick={handleClose}
              aria-label={isRTL ? "إغلاق" : "Close"}
            >
              ×
            </button>
          </div>

          <div className={styles.aiSearchModalBody}>
            <form onSubmit={handleSubmit}>
              <div className={`${styles.aiSearchInputWrapper} ${isActive ? styles.active : ''}`}>
                <input
                  ref={inputRef}
                  type="text"
                  className={`${styles.aiSearchInput} ${isRTL ? styles.rtl : styles.ltr}`}
                  placeholder={isRTL ? "اكتب ما تبحث عنه... (مثال: شقة غرفتين في حلب)" : "Describe what you're looking for... (e.g., apartment with 2 bedrooms in Aleppo)"}
                  value={query}
                  onChange={handleQueryChange}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />

                {isLoading && (
                  <div className={styles.loadingIndicator}>
                    <div className={styles.spinner}></div>
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.aiSearchSubmitButton}
              disabled={
                !query.trim() ||
                isLoading ||
                (!isLoading && !isError && effectiveListings.length === 0 && debouncedQuery.trim().length > 0) ||
                !meaningful
              }
                  aria-label={isRTL ? "بحث" : "Search"}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </form>

            {/* AI Parser Warning */}
            <div className={`${styles.aiParserWarning} ${isRTL ? styles.rtl : styles.ltr}`}>
              <div className={styles.warningIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.warningText}>
                {tPropertyList('aiParserWarning')}
              </div>
            </div>

            {/* Example Queries */}
            {query.length === 0 && (
              <div className={styles.exampleQueries}>
                <div className={styles.exampleQueriesTitle}>
                  {isRTL ? "أمثلة على الاستعلامات:" : "Example Queries:"}
                </div>
                <div className={styles.exampleQueriesList}>
                  {exampleQueries.map((example, index) => (
                    <div
                      key={index}
                      className={styles.exampleQuery}
                      onClick={() => handleExampleClick(example)}
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {isError && (
              <div className={styles.errorMessage}>
                {isRTL 
                  ? "حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى."
                  : "An error occurred while searching. Please try again."}
                {error?.message && ` (${error.message})`}
              </div>
            )}

            {/* Results Preview */}
            {effectiveListings.length > 0 && !isLoading && meaningful && (
              <div 
                className={styles.resultsPreview}
                onClick={handleResultsClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleResultsClick();
                  }
                }}
                aria-label={isRTL ? "عرض النتائج في صفحة قائمة العقارات" : "View results in property list page"}
              >
                <div className={styles.resultsPreviewTitle}>
                  {isRTL ? "النتائج:" : "Results:"}
                </div>
                <div className={styles.resultsCount}>
                  {isRTL 
                    ? `تم العثور على ${effectivePagination.total || effectiveListings.length} عقار`
                    : `Found ${effectivePagination.total || effectiveListings.length} propert${(effectivePagination.total || effectiveListings.length) > 1 ? 'ies' : 'y'}`}
                </div>
              </div>
            )}

            {/* No Results Message */}
            {!isLoading && debouncedQuery.trim().length > 0 && (!meaningful || effectiveListings.length === 0 || isError) && (
              <div className={styles.noResultsBox}>
                <div className={styles.noResultsIcon}>🔍</div>
                <div className={styles.noResultsTitle}>
                  {isRTL ? "لا توجد نتائج للبحث" : "No search results found"}
                </div>
                <div className={styles.noResultsMessage}>
                  <div className={styles.noResultsMessageText}>
                    {isRTL 
                      ? "لا يوجد أي إعلان يطابق هذه المعايير" 
                      : "No any listing found match this criteria"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

