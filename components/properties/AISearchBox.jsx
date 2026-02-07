"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { useAISearch } from "@/apis/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import styles from "./AISearchBox.module.css";

/**
 * AI Search Box Component
 * Allows users to search properties using natural language (Arabic/English)
 * 
 * Available for ALL users:
 * - Anonymous users (not logged in)
 * - Regular users
 * - Agents
 * - Admins
 * 
 * No authentication required - public endpoint
 */
export default function AISearchBox({ onResults, className = "" }) {
  const t = useTranslations('propertyList');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const [query, setQuery] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [showExtractedParams, setShowExtractedParams] = useState(false);
  
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
    enabled: debouncedQuery.trim().length > 0
  });

  // Extract data from response
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

  // Notify parent component when results change
  // Use ref to track previous values and avoid unnecessary updates
  const prevResultsRef = useRef(null);
  
  useEffect(() => {
    if (!onResults) return;
    
    // Only call onResults if query exists and results actually changed
    if (debouncedQuery.trim().length > 0) {
      const meaningful = hasMeaningfulParams(extractedParams);
      const currentResults = {
        listings: meaningful && !isError ? effectiveListings : [],
        extractedParams,
        pagination: meaningful && !isError ? effectivePagination : {},
        query: debouncedQuery,
        isLoading,
        isError: isError || !meaningful // treat non-meaningful parse as error-ish state
      };
      
      // Compare with previous results to avoid unnecessary updates
      const prevResults = prevResultsRef.current;
      const resultsChanged = !prevResults || 
        JSON.stringify(prevResults.listings) !== JSON.stringify(currentResults.listings) ||
        prevResults.query !== currentResults.query ||
        prevResults.isLoading !== currentResults.isLoading ||
        prevResults.isError !== currentResults.isError;
      
      if (resultsChanged) {
        prevResultsRef.current = currentResults;
        onResults(currentResults);
      }
    } else {
      // Clear results when query is empty
      if (prevResultsRef.current?.query) {
        prevResultsRef.current = null;
        onResults({ listings: [], extractedParams: {}, pagination: {}, query: "", isLoading: false, isError: false });
      }
    }
  }, [listings, extractedParams, pagination, debouncedQuery, isLoading, isError, onResults]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setIsActive(e.target.value.length > 0);
  };

  const handleClear = () => {
    setQuery("");
    setIsActive(false);
    setShowExtractedParams(false);
    if (onResults) {
      onResults({ listings: [], extractedParams: {}, pagination: {}, query: "", isLoading: false, isError: false });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      // Query is already debounced, results will update automatically
    }
  };

  // Format extracted parameters for display
  const formatExtractedParams = () => {
    const params = [];
    if (extractedParams.propertyType) {
      params.push(`${isRTL ? 'نوع' : 'Type'}: ${extractedParams.propertyType}`);
    }
    if (extractedParams.bedrooms !== null) {
      params.push(`${isRTL ? 'غرف' : 'Bedrooms'}: ${extractedParams.bedrooms}`);
    }
    if (extractedParams.bathrooms !== null) {
      params.push(`${isRTL ? 'حمامات' : 'Bathrooms'}: ${extractedParams.bathrooms}`);
    }
    if (extractedParams.city) {
      params.push(`${isRTL ? 'مدينة' : 'City'}: ${extractedParams.city}`);
    }
    if (extractedParams.status) {
      params.push(`${isRTL ? 'حالة' : 'Status'}: ${extractedParams.status}`);
    }
    if (extractedParams.priceMax) {
      params.push(`${isRTL ? 'السعر' : 'Price'}: $${extractedParams.priceMax}`);
    }
    if (extractedParams.amenities?.length > 0) {
      params.push(`${isRTL ? 'المرافق' : 'Amenities'}: ${extractedParams.amenities.join(', ')}`);
    }
    return params;
  };

  const exampleQueries = isRTL ? [
    "شقة غرفتين في اللاذقية",
    "فيلا للبيع في حمص",

  ] : [
    "apartment with 2 bedrooms in latakia",
    "villa for sale in homs",
  ];

  return (
    <div className={`${styles.aiSearchBox} ${className}`}>

      <form onSubmit={handleSubmit} className={styles.aiSearchForm}>
        <div className={`${styles.aiSearchInputWrapper} ${isActive ? styles.active : ''}`}>
          <div className={styles.aiIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
            </svg>
          </div>
          
          <input
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

          <div className={styles.aiSearchActions}>
            {query.length > 0 && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClear}
                aria-label={isRTL ? "مسح" : "Clear"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                </svg>
              </button>
            )}
            
            <button
              type="submit"
              className={styles.aiSearchButton}
              disabled={!query.trim() || isLoading}
            >
              {isRTL ? "بحث" : "Search"}
            </button>
          </div>
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
          {t('aiParserWarning')}
        </div>
      </div>

      {/* Extracted Parameters */}
      {showExtractedParams && Object.keys(extractedParams).length > 0 && (
        <div className={styles.extractedParams}>
          <div className={styles.extractedParamsHeader}>
            <span className={styles.extractedParamsTitle}>
              {isRTL ? "المعاملات المستخرجة" : "Extracted Parameters"}
            </span>
            <button
              className={styles.extractedParamsToggle}
              onClick={() => setShowExtractedParams(false)}
            >
              {isRTL ? "إخفاء" : "Hide"}
            </button>
          </div>
          <div className={styles.extractedParamsList}>
            {formatExtractedParams().map((param, index) => (
              <span key={index} className={styles.extractedParamTag}>
                {param}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Show extracted params button if results exist */}
      {effectiveListings.length > 0 && meaningful && !showExtractedParams && Object.keys(extractedParams).length > 0 && (
        <button
          className={styles.extractedParamsToggleButton}
          onClick={() => setShowExtractedParams(true)}
        >
          {isRTL ? "عرض المعاملات المستخرجة" : "Show Extracted Parameters"}
        </button>
      )}

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
                onClick={() => setQuery(example)}
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

      {/* Results Count */}
      {effectiveListings.length > 0 && meaningful && !isLoading && (
        <div className={`${styles.resultsCount} ${isRTL ? styles.rtl : styles.ltr}`}>
          {isRTL 
            ? `تم العثور على ${effectivePagination.total || effectiveListings.length} عقار`
            : `Found ${effectivePagination.total || effectiveListings.length} propert${(effectivePagination.total || effectiveListings.length) > 1 ? 'ies' : 'y'}`}
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
                : "We couldn’t find any listing that matches these criteria."}
            </div>
            <button 
              className={styles.clearButtonSecondary}
              onClick={handleClear}
            >
              {isRTL ? "مسح البحث" : "Clear search"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

