"use client";
import SearchForm from "@/components/common/SearchForm";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from "next/navigation";
import { useAISearch } from "@/apis/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import styles from "./Hero.module.css";

export default function Hero({
  searchParams,
  onSearchChange,
  setTriggerSearch,
}) {
  const t = useTranslations('hero');
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === 'ar';
  const hasNavigatedRef = useRef(false);

  const [aiQuery, setAiQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [previewDismissed, setPreviewDismissed] = useState(false);
  const [searchFormOpen, setSearchFormOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const status = searchParams?.status ?? '';
  const debouncedAiQuery = useDebounce(aiQuery, 500);
  const searchQuery = submittedQuery || debouncedAiQuery;

  const {
    data: aiSearchResponse,
    isLoading: aiSearchLoading,
    isError: aiSearchError,
  } = useAISearch(searchQuery, {
    page: 1,
    limit: 12,
    enabled: searchQuery.trim().length > 0,
  });

  const listings = aiSearchResponse?.data || [];
  const extractedParams = aiSearchResponse?.extractedParams || {};
  const pagination = aiSearchResponse?.pagination || {};

  const hasMeaningfulParams = useCallback((params) => {
    if (!params) return false;
    const {
      propertyType, bedrooms, bathrooms, sizeMin, sizeMax,
      priceMin, priceMax, status, city, neighborhood,
      furnished, garages, viewType, rentType, amenities = [],
    } = params;
    return !!(
      propertyType || status || city || viewType || rentType ||
      (furnished !== null && furnished !== undefined) ||
      (garages !== null && garages !== undefined) ||
      (Array.isArray(amenities) && amenities.length > 0) ||
      (bedrooms !== null && bedrooms !== undefined) ||
      (bathrooms !== null && bathrooms !== undefined) ||
      (sizeMin !== null && sizeMin !== undefined) ||
      (sizeMax !== null && sizeMax !== undefined) ||
      (priceMin !== null && priceMin !== undefined) ||
      (priceMax !== null && priceMax !== undefined) ||
      (neighborhood && city)
    );
  }, []);

  const meaningful = hasMeaningfulParams(extractedParams) && !aiSearchError;
  const effectiveListings = meaningful ? listings : [];

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearchPreviewClick = useCallback(() => {
    const q = debouncedAiQuery.trim();
    const hasResults = q && !aiSearchLoading && (listings.length > 0 || (pagination?.total ?? 0) > 0);
    if (hasResults) {
      setIsNavigating(true);
      setTimeout(() => setSubmittedQuery(q), 320);
    } else {
      scrollToTop();
    }
  }, [debouncedAiQuery, aiSearchLoading, listings.length, pagination?.total, scrollToTop]);

  useEffect(() => {
    if (submittedQuery.trim().length > 0 && !aiSearchLoading && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      const q = submittedQuery.trim();
      setSubmittedQuery("");
      setAiQuery("");
      if (effectiveListings.length > 0) {
        const results = {
          listings: effectiveListings,
          data: effectiveListings,
          extractedParams,
          pagination: meaningful ? pagination : { total: effectiveListings.length, page: 1, limit: 12, totalPages: 1, hasNextPage: false, hasPrevPage: false },
          query: q,
        };
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('aiSearchResults', JSON.stringify(results));
        }
        router.push('/property-list');
      } else {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('aiSearchResults');
        }
        const params = new URLSearchParams({ keyword: q });
        if (status) params.set('status', status);
        router.push(`/property-list?${params.toString()}`);
      }
    }
  }, [submittedQuery, aiSearchLoading, effectiveListings, meaningful, extractedParams, pagination, router, status]);

  useEffect(() => {
    if (submittedQuery === "") hasNavigatedRef.current = false;
  }, [submittedQuery]);

  useEffect(() => {
    if (aiQuery.length === 0) setPreviewDismissed(false);
  }, [aiQuery]);

  const handleAISubmit = (e) => {
    e?.preventDefault();
    const q = aiQuery.trim();
    if (q) {
      setSubmittedQuery(q);
    }
  };

  const handleSearchClick = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('aiSearchResults');
    }
    setTriggerSearch(true);
  };

  const handleStatusChange = (value) => {
    onSearchChange?.({ status: value });
    setTriggerSearch?.(true);
  };

  const handleExampleClick = (example) => {
    setAiQuery(example);
  };

  const handleOpenSearchForm = () => {
    setAiQuery("");
    setPreviewDismissed(true);
    document.querySelector('.searchFormToggler')?.click();
  };

  const handleFilterClick = () => {
    setAiQuery("");
  };

  const exampleQueries = isRTL ? [


    "شقة غرفتين في اللاذقية",
    "فيلا للبيع في حمص",
    "ارض للبيع في دمشق",
    "  شقة  في حماة "
  ] : [
    "apartment with 2 bedrooms in latakia",
    "land for sale in damascus",
    "apartment in hama",
    "villa for sale in homs"
  ];

  return (
    <>
      <div className={`page-title home01 ${styles.heroBackground}`}>
      <div className="tf-container ">
        <div className={`row justify-center relative ${styles.heroRow}`}>
          <div className={`col-lg-8 ${styles.heroCol}`}>
            <div className="content-inner">
              <div className="heading-title">
                <h1 className="title">{t('title')}</h1>
                <p className="h6 fw-4">
                  {t('subtitle')}
                  <span className={styles.subtitleHighlight}>{t('subtitleHighlight')}</span>
                  .
                </p>
              </div>
              <div className="wg-filter">
                <div className={styles.statusButtons}>
                  <button
                    type="button"
                    className={`${styles.statusBtn} ${(!status || status === 'all') ? styles.statusBtnActive : ''}`}
                    onClick={() => handleStatusChange('')}
                  >
                    {t('forAll')}
                  </button>
                  <button
                    type="button"
                    className={`${styles.statusBtn} ${status === 'rent' ? styles.statusBtnActive : ''}`}
                    onClick={() => handleStatusChange('rent')}
                  >
                    {t('forRent')}
                  </button>
                  <button
                    type="button"
                    className={`${styles.statusBtn} ${status === 'sale' ? styles.statusBtnActive : ''}`}
                    onClick={() => handleStatusChange('sale')}
                  >
                    {t('forSale')}
                  </button>
                </div>
                <div className={styles.chatInputWrapper}>
                  <div className={styles.chatInputRow} dir={isRTL ? 'rtl' : 'ltr'}>
                  <form onSubmit={handleAISubmit} className={styles.chatInputForm}>
                    <input
                      type="text"
                      className={styles.chatInput}
                      placeholder={t('aiSearchPlaceholder') || t('searchPlaceholder')}
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      dir={isRTL ? 'rtl' : 'ltr'}
                      disabled={submittedQuery && aiSearchLoading}
                    />
                    <div className={`box-item wrap-btn ${styles.chatInputActions}`}>
                      <button
                        type="submit"
                        className={styles.sendBtn}
                        disabled={!aiQuery.trim() || (submittedQuery && aiSearchLoading)}
                        aria-label={isRTL ? "إرسال" : "Send"}
                      >
                        {(submittedQuery && aiSearchLoading) ? (
                          <span className={styles.spinner} />
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                      <div className="btn-filter show-form searchFormToggler" title={isRTL ? 'فلتر' : 'Filter'} onClick={handleFilterClick}>
                        <div className="icons">
                          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M21 4H14" stroke="#F1913D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 4H3" stroke="#F1913D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 12H12" stroke="#F1913D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 12H3" stroke="#F1913D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 20H16" stroke="#F1913D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 20H3" stroke="#F1913D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 2V6" stroke="#F1913D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 10V14" stroke="#F1913D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 18V22" stroke="#F1913D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                {debouncedAiQuery.length > 0 && !submittedQuery && !previewDismissed && (
                  <div className={styles.searchPreviewBox} dir={isRTL ? 'rtl' : 'ltr'}>
                    {aiSearchLoading ? (
                      <div className={styles.searchPreviewLoading}>
                        <span className={styles.spinner} />
                        <span>{isRTL ? 'جاري البحث...' : 'Searching...'}</span>
                      </div>
                    ) : !aiSearchError && (listings.length > 0 || (pagination?.total ?? 0) > 0) ? (
                      <div
                        className={`${styles.searchPreviewMatch} ${isNavigating ? styles.searchPreviewMatchNavigating : ''}`}
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSearchPreviewClick(); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSearchPreviewClick(); } }}
                        aria-label={isRTL ? 'عرض نتائج البحث' : 'View search results'}
                        aria-busy={isNavigating}
                      >
                        <span className={styles.searchPreviewQuery}>{debouncedAiQuery}</span>
                        <span className={styles.searchPreviewCountNum}>{pagination?.total ?? listings.length}</span>
                        <span className={styles.searchPreviewCountLabel}>{t('matchesFoundLabel')}</span>
                      </div>
                    ) : (
                      <div className={styles.searchPreviewNoMatch}>
                        <span className={styles.searchPreviewNoMatchText}>{t('noMatchesTryTraditional')}</span>
                        <button
                          type="button"
                          className={styles.searchPreviewOpenFormBtn}
                          onClick={handleOpenSearchForm}
                        >
                          {t('openSearchForm')}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                </div>
                {aiQuery.length === 0 && !searchFormOpen && (
                  <div className={styles.exampleQueries}>
                    <div className={styles.exampleQueriesTitle}>
                      {t('exampleQueriesTitle')}
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
                <SearchForm
                  searchParams={searchParams}
                  onSearchChange={onSearchChange}
                  onSearch={handleSearchClick}
                  onOpenChange={setSearchFormOpen}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
