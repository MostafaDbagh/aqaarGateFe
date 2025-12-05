"use client";
import SearchForm from "@/components/common/SearchForm";
import React, { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from 'next-intl';
import styles from "./Hero.module.css";

export default function Hero({
  searchParams,
  onSearchChange,
  setTriggerSearch,
}) {
  const t = useTranslations('hero');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [activeItem, setActiveItem] = useState(t('forSale'));
  const [showKeywordDropdown, setShowKeywordDropdown] = useState(false);
  const [filteredKeywords, setFilteredKeywords] = useState([]);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const isRTL = locale === 'ar';

  // Get all property keywords - comprehensive list from translations
  const getAllKeywords = () => {
    // Get unique keywords (avoid duplicates with different cases)
    const keywordsSet = new Set([
      // From AddProperty.jsx - Core keywords
      "South-facing house",
      "East-facing",
      "West-facing",
      "Well-ventilated",
      "Bright",
      "Modern building",
      "Old building",
      "Spacious",
      "View",
      "Open view",
      "Sea view",
      "Mountain view",
      "luxury",
      "doublex finishing",
      "super doublex finishing",
      "standard finishing",
      "stone finishing",
      "2,400 shares",
      "Green Title Deed",    

  
    ]);
    
    return Array.from(keywordsSet);
  };

  // Translate keyword
  const translateKeyword = (keyword) => {
    try {
      const key = keyword.toLowerCase().replace(/[\s-]/g, '_');
      const translated = tCommon(`propertyKeywords.${key}`);
      if (translated && !translated.startsWith('propertyKeywords.')) {
        return translated;
      }
    } catch (e) {
      // Fallback to original
    }
    return keyword;
  };

  // Filter keywords based on search value and exclude already added keywords
  useEffect(() => {
    const searchValue = searchParams?.keyword || '';
    const allKeywords = getAllKeywords();
    
    // Get already added keywords
    const addedKeywords = searchValue
      .split(',')
      .map(k => k.trim())
      .filter(k => k)
      .map(k => k.toLowerCase());
    
    // Filter out already added keywords - this is the main filter
    let filtered = allKeywords.filter(keyword => 
      !addedKeywords.some(added => added === keyword.toLowerCase())
    );
    
    // Don't filter by search value - we want to show all available keywords
    // The searchValue here contains selected keywords, not a search query
    
    setFilteredKeywords(filtered);
  }, [searchParams?.keyword, tCommon]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is inside the keywords container or dropdown
      const isClickInContainer = searchInputRef.current?.contains(event.target);
      const isClickInDropdown = dropdownRef.current?.contains(event.target);
      const isClickInTag = event.target.closest(`.${styles.keywordTag}`);
      const isClickInRemoveButton = event.target.closest(`.${styles.removeTag}`);
      const isClickInKeywordItem = event.target.closest(`.${styles.keywordItem}`);
      
      // Close if click is outside both container and dropdown
      if (!isClickInContainer && !isClickInDropdown && !isClickInTag && !isClickInRemoveButton && !isClickInKeywordItem) {
        setShowKeywordDropdown(false);
      }
    };

    if (showKeywordDropdown) {
      // Use a small delay to allow onClick handlers to run first
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside, false);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('click', handleClickOutside, false);
      };
    }
  }, [showKeywordDropdown]);

  // Handle keyword selection
  const handleKeywordSelect = (keyword, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (!keyword || !keyword.trim()) return;
    
    const currentKeyword = searchParams?.keyword || '';
    const keywords = currentKeyword
      .split(',')
      .map(k => k.trim())
      .filter(k => k);
    
    // Check if keyword already exists (case-insensitive)
    const keywordExists = keywords.some(k => 
      k.toLowerCase().trim() === keyword.toLowerCase().trim()
    );
    
    if (!keywordExists) {
      // Add new keyword to the list
      const newKeywords = keywords.length > 0 
        ? [...keywords, keyword.trim()].join(', ')
        : keyword.trim();
      
      // Update search params with new keywords
      if (onSearchChange) {
        onSearchChange({ keyword: newKeywords });
      }
      
      // Close dropdown after selecting a keyword
      setShowKeywordDropdown(false);
    } else {
      // If keyword already exists, close dropdown
      setShowKeywordDropdown(false);
    }
  };

  const statusOptions = [
    { label: t('forSale'), value: "sale" },
    { label: t('forRent'), value: "rent" },
  ];
  const handleChange = (key, value) => {
    if (onSearchChange) {
      onSearchChange({ [key]: value });
    }
  };

  return (
    <>
      <div className={`page-title home01 ${styles.heroBackground}`}>
      <div className="tf-container ">
        <div className="row justify-center relative">
          <div className="col-lg-8 ">
            <div className="content-inner">
              <div className="heading-title">
                <h1 className="title">{t('title')}</h1>
                <p className="h6 fw-4">
                  {t('subtitle')}
                </p>
              </div>
              <div className="wg-filter">
                <div className="form-title">
                  <div className="tf-dropdown-sort " data-bs-toggle="dropdown">
                    <div className="btn-select">
                      <span className="text-sort-value">{activeItem}</span>
                      <i className="icon-CaretDown" />
                    </div>
                    <div className="dropdown-menu">
                      {statusOptions.map((item) => (
                        <div
                          key={item.value}
                          className={`select-item ${
                            activeItem === item.value ? "active" : ""
                          }`}
                          onClick={() => {
                            setActiveItem(item.label);
                            handleChange("status", item.value);
                          }}
                        >
                          <span className="text-value-item">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ position: 'relative', width: '100%', flex: 1 }}>
                    <form onSubmit={(e) => e.preventDefault()} style={{ width: '100%' }}>
                      <fieldset style={{ width: '100%', margin: 0, padding: 0, border: 'none' }}>
                        {/* Keywords Input Container - Only displays selected tags */}
                        <div 
                          ref={searchInputRef}
                          className={styles.keywordsInputContainer}
                          onClick={(e) => {
                            // Don't close if clicking on tags or remove buttons
                            if (e.target.closest(`.${styles.keywordTag}`) || 
                                e.target.closest(`.${styles.removeTag}`)) {
                              return;
                            }
                            
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // Always open dropdown when clicking on container
                            setShowKeywordDropdown(true);
                          }}
                        >
                          {/* Display selected keywords as tags */}
                          {(() => {
                            const keywordString = searchParams?.keyword || '';
                            const keywords = keywordString
                              .split(',')
                              .map(k => k.trim())
                              .filter(k => k);
                            
                            return keywords.map((keyword, index) => (
                              <span key={`selected-${keyword}-${index}`} className={styles.keywordTag}>
                                {translateKeyword(keyword)}
                                <button
                                  type="button"
                                  className={styles.removeTag}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const updatedKeywords = keywords
                                      .filter(k => k !== keyword);
                                    onSearchChange({ keyword: updatedKeywords.join(', ') });
                                  }}
                                  aria-label={locale === 'ar' ? 'إزالة' : 'Remove'}
                                >
                                  ×
                                </button>
                              </span>
                            ));
                          })()}
                          
                          {/* Placeholder when no keywords selected */}
                          {(() => {
                            const keywordString = searchParams?.keyword || '';
                            const hasKeywords = keywordString
                              .split(',')
                              .map(k => k.trim())
                              .filter(k => k).length > 0;
                            
                            if (!hasKeywords) {
                              return (
                                <span className={styles.placeholderText}>
                                  {t('searchPlaceholder')}
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </fieldset>
                    </form>
                    
                    {/* Keywords Dropdown - Separate from input container */}
                    {showKeywordDropdown && filteredKeywords.length > 0 && (
                      <div 
                        ref={dropdownRef}
                        className={styles.keywordsDropdown}
                        style={{ 
                          direction: isRTL ? 'rtl' : 'ltr',
                          textAlign: isRTL ? 'right' : 'left'
                        }}
                      >
                        <div className={styles.keywordsList}>
                          {filteredKeywords.map((keyword, index) => {
                            const keywordString = searchParams?.keyword || '';
                            const selectedKeywords = keywordString
                              .split(',')
                              .map(k => k.trim())
                              .filter(k => k)
                              .map(k => k.toLowerCase());
                            const isSelected = selectedKeywords.includes(keyword.toLowerCase());
                            
                            return (
                              <button
                                key={`available-${keyword}-${index}`}
                                type="button"
                                className={`${styles.keywordItem} ${isSelected ? styles.selected : ''}`}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleKeywordSelect(keyword, e);
                                }}
                              >
                                {translateKeyword(keyword)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="box-item wrap-btn">
                    <div className="btn-filter show-form searchFormToggler">
                      <div className="icons">
                        <svg width={24}
                          height={24}
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
                      <a
                        href="#"
                        className="tf-btn bg-color-primary pd-3"
                        onClick={() => setTriggerSearch(true)}
                      >
                        {t('searchButton')} <i className="icon-MagnifyingGlass fw-6" />
                      </a>
                  </div>
                </div>
                <SearchForm
                  searchParams={searchParams}
                  onSearchChange={onSearchChange}
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
