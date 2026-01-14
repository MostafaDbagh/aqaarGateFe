"use client";
import React, { useMemo, useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import LocationLoader from "@/components/common/LocationLoader";
import { useSearchListings } from "@/apis/hooks";
import { getPropertyTitle } from "@/utlis/propertyHelpers";
import { translateKeywordsString } from "@/utils/translateKeywords";
import styles from "./RelatedProperties.module.css";

export default function RelatedProperties({ currentProperty }) {
  const t = useTranslations('similarListings');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef(null);
  
  // Helper function to get size unit label
  const getSizeUnitLabel = (sizeUnit) => {
    if (!sizeUnit) return locale === 'ar' ? tCommon('sqm') : 'SQM';
    const unit = sizeUnit.toLowerCase();
    // Map size units to translation keys
    const unitMap = {
      'sqm': 'sqm',
      'dunam': 'dunam',
      'feddan': 'feddan',
      'sqft': 'sqft',
      'sqyd': 'sqyd'
    };
    const translationKey = unitMap[unit] || 'sqm';
    return tCommon(translationKey);
  };
  
  // Resolve image URL helper function
  const resolveImageUrl = (value) => {
    if (!value) return null;

    const rawValue = typeof value === 'string' ? value.trim() : value;
    if (!rawValue) return null;

    if (typeof rawValue !== 'string') {
      const candidate = rawValue.url || rawValue.secure_url || rawValue.path || rawValue.src;
      return resolveImageUrl(candidate);
    }

    const raw = rawValue.trim();

    if (/^https?:\/\//i.test(raw) || raw.startsWith('data:') || raw.startsWith('blob:')) {
      return raw;
    }

    if (raw.startsWith('//')) {
      return `https:${raw}`;
    }

    if (raw.startsWith('/')) {
      return raw;
    }

    const normalized = raw.replace(/\\/g, '/');
    const trimmed = normalized.replace(/^(\.\/)+/, '').replace(/^\/+/, '');
    if (!trimmed) {
      return null;
    }

    return `/${trimmed}`;
  };

  // Extract first image from property
  const getFirstImage = (property) => {
    if (!property) return null;

    // Try images array first
    if (Array.isArray(property.images) && property.images.length > 0) {
      const resolved = resolveImageUrl(property.images[0]);
      if (resolved) return resolved;
    }

    // Try galleryImages
    if (Array.isArray(property.galleryImages) && property.galleryImages.length > 0) {
      const resolved = resolveImageUrl(property.galleryImages[0]);
      if (resolved) return resolved;
    }

    // Try imageNames
    if (Array.isArray(property.imageNames) && property.imageNames.length > 0) {
      const resolved = resolveImageUrl(property.imageNames[0]);
      if (resolved) return resolved;
    }

    // Try single image fields
    const singleImageFields = ['coverImage', 'featuredImage', 'mainImage', 'image'];
    for (const field of singleImageFields) {
      if (property[field]) {
        const resolved = resolveImageUrl(property[field]);
        if (resolved) return resolved;
      }
    }

    // No fallback - return null
    return null;
  };
  
  // Calculate search parameters - same city and same property type
  const searchParams = useMemo(() => {
    if (!currentProperty) return {};

    const params = {
      limit: 50,
      sort: 'newest',
    };

    // Match same city (required)
    if (currentProperty.city) {
      params.city = currentProperty.city;
    } else if (currentProperty.state) {
      params.city = currentProperty.state;
    }

    // Match same property type (required)
    if (currentProperty.propertyType) {
      params.propertyType = currentProperty.propertyType;
    }

    return params;
  }, [currentProperty]);

  // Fetch similar properties - same city and same property type
  const { data: listingsData, isLoading, isError, error } = useSearchListings(searchParams);

  // Fallback search params - same city only (if main search returns no results)
  const fallbackSearchParams = useMemo(() => {
    if (!currentProperty) return null;
    
    const params = {
      limit: 50,
      sort: 'newest',
    };

    // Only city (no property type filter)
    if (currentProperty.city) {
      params.city = currentProperty.city;
    } else if (currentProperty.state) {
      params.city = currentProperty.state;
    }

    return params;
  }, [currentProperty]);

  // Fallback search - only if main search has no results
  const shouldUseFallback = useMemo(() => {
    if (isLoading) return false;
    if (!listingsData) return true;
    const listings = Array.isArray(listingsData) ? listingsData : (listingsData?.data || []);
    return listings.length === 0;
  }, [isLoading, listingsData]);

  const { data: fallbackData } = useSearchListings(
    fallbackSearchParams || {},
    { enabled: shouldUseFallback && !!fallbackSearchParams }
  );

  // Filter out the current property - simple filter
  const similarProperties = useMemo(() => {
    // Try main search results first
    let listings = [];
    if (listingsData?.data || Array.isArray(listingsData)) {
      listings = Array.isArray(listingsData) ? listingsData : (listingsData?.data || []);
    }
    
    // If no results, try fallback (same city only)
    if (listings.length === 0 && (fallbackData?.data || Array.isArray(fallbackData))) {
      listings = Array.isArray(fallbackData) ? fallbackData : (fallbackData?.data || []);
    }
    
    if (!Array.isArray(listings) || listings.length === 0) return [];
    
    // Filter out current property, not deleted, and approved
    const filteredListings = listings
      .filter(property => 
        property._id !== currentProperty?._id &&
        property.isDeleted !== true &&
        property.approvalStatus === 'approved'
      )
      .slice(0, 6); // Get first 6 results
    
    return filteredListings;
  }, [listingsData, fallbackData, currentProperty]);

  // Check if content is scrollable and show scroll hint
  useEffect(() => {
    const checkScrollable = () => {
      if (scrollContainerRef.current) {
        const element = scrollContainerRef.current;
        const isScrollable = element.scrollWidth > element.clientWidth;
        setShowScrollHint(isScrollable);
        
        // Check if scrolled
        const handleScroll = () => {
          setIsScrolled(element.scrollLeft > 0);
        };
        
        element.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        
        return () => {
          element.removeEventListener('scroll', handleScroll);
        };
      }
    };
    
    const cleanup = checkScrollable();
    window.addEventListener('resize', checkScrollable);
    
    return () => {
      window.removeEventListener('resize', checkScrollable);
      if (cleanup) cleanup();
    };
  }, [similarProperties]);

  // Show loading state
  if (isLoading) {
    return (
      <section className="section-similar-properties tf-spacing-3">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="heading-section mb-32">
                <h2 className="title">{t('title')}</h2>
              </div>
              <div style={{ padding: '40px 20px' }}>
                <LocationLoader size="medium" message={t('loading')} />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Always show section, even if empty or error
  const propertiesToShow = similarProperties.length > 0 ? similarProperties : [];

  return (
    <section className="section-similar-properties tf-spacing-3">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section mb-32">
              <h2 className="title">{t('title')}</h2>
            </div>
            {propertiesToShow.length > 0 ? (
              <div 
                ref={scrollContainerRef}
                className={styles.propertiesGrid}
                style={{ position: 'relative' }}
              >
                {showScrollHint && !isScrolled && (
                  <div className={styles.scrollHintRight}>
                    <i className="icon-arrow-right" />
                  </div>
                )}
                {propertiesToShow.map((property) => {
                const getBadgeStyle = () => {
                  const status = property.status?.toLowerCase();
                  if (status === 'rent' || status === 'for rent') {
                    return { backgroundColor: '#3b82f6' };
                  }
                  if (status === 'sale' || status === 'for sale') {
                    return { backgroundColor: '#10B981' };
                  }
                  return { backgroundColor: '#10B981' }; // Default to forSale
                };

                const imageUrl = getFirstImage(property);
                
                return (
                  <div key={property._id} className={styles.propertyCard}>
                    <div className={styles.imageWrapper}>
                      {imageUrl ? (
                        <Link href={`/property-detail/${property._id}`}>
                          <Image
                            src={imageUrl}
                            alt={getPropertyTitle(property)}
                            width={400}
                            height={300}
                            className={styles.propertyImage}
                            unoptimized={true}
                            priority={false}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                            />
                          </Link>
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', color: '#999', fontSize: '14px' }}>
                          No Image
                        </div>
                      )}
                       
                        {property.offer && (
                          <span className={styles.offerBadge}>{t('specialOffer')}</span>
                        )}
                      
                      {property.status && (
                        <span className={styles.statusBadge} style={getBadgeStyle()}>
                          {property.status === 'sale' ? t('forSale') : t('forRent')}
                        </span>
                      )}
                    </div>

                    <div className={styles.cardContent}>
                      <h3 className={styles.propertyTitle}>
                        <Link href={`/property-detail/${property._id}`}>
                          {getPropertyTitle(property)}
                        </Link>
                      </h3>

                      {/* Property Keyword Tags */}
                      {(() => {
                        const keywords = property.propertyKeyword 
                          ? translateKeywordsString(property.propertyKeyword, tCommon)
                          : [];
                        return keywords.length > 0 ? (
                          <div className={styles.keywordTags}>
                            {keywords.map((translatedKeyword, index) => (
                              <span key={index} className={styles.keywordTag}>
                                {translatedKeyword}
                              </span>
                            ))}
                          </div>
                        ) : null;
                      })()}

                        <div className={styles.location}>
                          <i className="icon-location" />
                          <span style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
                            {locale === 'ar' && property?.address_ar ? property.address_ar : (property.address || '')}
                            {property.state && `, ${property.state}`}
                          </span>
                        </div>

                      <div className={styles.metaInfo}>
                        {property.bedrooms != null && Number(property.bedrooms) > 0 && (
                          <div className={styles.metaItem}>
                            {t('beds')} <span>{property.bedrooms}</span>
                          </div>
                        )}
                        {property.bathrooms != null && Number(property.bathrooms) > 0 && (
                          <div className={styles.metaItem}>
                            {t('baths')} <span>{property.bathrooms}</span>
                          </div>
                        )}
                        <div className={styles.metaItem}>
                          <span>{property.size || 0}</span> {getSizeUnitLabel(property.sizeUnit)}
                        </div>
                        {property.floor !== undefined && property.floor !== null && (
                          <div className={styles.metaItem}>
                            {t('floor')} <span>{property.floor}</span>
                          </div>
                        )}
                        {property.propertyType && property.propertyType.toLowerCase().trim() !== 'land' && property?.propertyType?.trim() !== 'أرض' && (
                          <div className={styles.metaItem}>
                            {t('garage')} <span>{property.garage || t('no')}</span>
                          </div>
                        )}
                      </div>

                      <div className={styles.cardFooter}>
                        <h4 className={styles.price}>
                          ${property.propertyPrice?.toLocaleString()}
                        </h4>
                        <Link href={`/property-detail/${property._id}`} className={styles.detailsBtn}>
                          {t('details')}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            ) : (
              <div className={styles.noListingsMessage}>
                <p>{t('noRelatedListings')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
