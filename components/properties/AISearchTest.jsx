"use client";
import React, { useState } from "react";
import { useTranslations, useLocale } from 'next-intl';
import AISearchBox from "./AISearchBox";
import PropertyGridItems from "./PropertyGridItems";
import PropertyListItems from "./PropertyListItems";
import LayoutHandler from "./LayoutHandler";
import styles from "./AISearchTest.module.css";

/**
 * Test Component for AI Search
 * Tests the integration between Frontend and Backend
 */
export default function AISearchTest() {
  const t = useTranslations('propertyList');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const [aiResults, setAiResults] = useState(null);
  const [layout, setLayout] = useState('grid');

  const handleAISearchResults = (results) => {
    console.log('AI Search Results:', results);
    setAiResults(results);
  };

  return (
    <div className={styles.aiSearchTestContainer}>

      <div className={styles.testHeader}>
        <h1>{isRTL ? "اختبار البحث بالذكاء الاصطناعي" : "AI Search Test"}</h1>
        <p>{isRTL ? "اختبر البحث باللغة الطبيعية (عربي/إنجليزي)" : "Test natural language search (Arabic/English)"}</p>
      </div>

      {/* AI Search Box */}
      <AISearchBox onResults={handleAISearchResults} />

      {/* Results */}
      {aiResults && (
        <div className={styles.testResults}>
          <div className={styles.resultsHeader}>
            <div className={styles.resultsCount}>
              {isRTL 
                ? `تم العثور على ${aiResults.listings?.length || 0} عقار`
                : `Found ${aiResults.listings?.length || 0} propert${(aiResults.listings?.length || 0) !== 1 ? 'ies' : 'y'}`}
            </div>
            <LayoutHandler layout={layout} setLayout={setLayout} />
          </div>

          {aiResults.listings && aiResults.listings.length > 0 ? (
            <>
              {layout === 'grid' ? (
                <PropertyGridItems listings={aiResults.listings} />
              ) : (
                <PropertyListItems listings={aiResults.listings} />
              )}
            </>
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <p>{isRTL ? "لم يتم العثور على نتائج" : "No results found"}</p>
              <p className={styles.tryDifferent}>
                {isRTL 
                  ? "جرب استعلام مختلف"
                  : "Try a different query"}
              </p>
            </div>
          )}

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className={styles.debugInfo}>
              <strong>Debug Info:</strong>
              <pre>{JSON.stringify(aiResults, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      {!aiResults && (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>💡</div>
          <p>{isRTL ? "اكتب استعلامك في المربع أعلاه" : "Type your query in the box above"}</p>
        </div>
      )}
    </div>
  );
}

