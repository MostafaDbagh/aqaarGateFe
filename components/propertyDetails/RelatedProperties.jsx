"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LocationLoader from "@/components/common/LocationLoader";
import { useSearchListings } from "@/apis/hooks";
import { getPropertyImage, getPropertyTitle } from "@/utlis/propertyHelpers";
import styles from "./RelatedProperties.module.css";

export default function RelatedProperties({ currentProperty }) {
  const t = useTranslations('similarListings');
  
  // Calculate search parameters - remove price filter to get more results
  const searchParams = useMemo(() => {
    if (!currentProperty) return {};

    const params = {
      limit: 50, // Get more results
      sort: 'newest', // Sort by newest first
    };

    // Match same property type (most important filter)
    if (currentProperty.propertyType) {
      params.propertyType = currentProperty.propertyType;
    }

    // Match same status (rent/sale)
    if (currentProperty.status) {
      params.status = currentProperty.status;
    }

    // DON'T filter by price - we'll score by price similarity instead
    // This ensures we get more results even if price range is narrow

    return params;
  }, [currentProperty]);

  // Fetch similar properties
  const { data: listingsData, isLoading, isError, error } = useSearchListings(searchParams);

  // Filter out the current property and prioritize best matches
  const similarProperties = useMemo(() => {
    if (!listingsData?.data && !Array.isArray(listingsData)) return [];
    
    // Handle both array response and wrapped response
    const listings = Array.isArray(listingsData) ? listingsData : (listingsData?.data || []);
    
    if (!Array.isArray(listings) || listings.length === 0) return [];
    
    // Filter out current property, not deleted, and approved
    const filteredListings = listings.filter(property => 
      property._id !== currentProperty?._id &&
      property.isDeleted !== true &&
      property.approvalStatus === 'approved'
    );
    
    if (filteredListings.length === 0) {
      return [];
    }
    
    // Calculate similarity score for each property
    const scoredProperties = filteredListings.map(property => {
      let score = 0;
      
      // Exact match on property type (+20 points) - most important
      if (property.propertyType === currentProperty?.propertyType) {
        score += 20;
      }
      
      // Exact match on bedrooms (+12 points)
      if (property.bedrooms === currentProperty?.bedrooms) {
        score += 12;
      } else if (currentProperty?.bedrooms !== undefined && currentProperty?.bedrooms !== null) {
        const bedDiff = Math.abs((property.bedrooms || 0) - currentProperty.bedrooms);
        if (bedDiff === 1) score += 6; // ±1 bedroom (+6 points)
        else if (bedDiff === 2) score += 3; // ±2 bedrooms (+3 points)
      }
      
      // Exact match on bathrooms (+12 points)
      if (property.bathrooms === currentProperty?.bathrooms) {
        score += 12;
      } else if (currentProperty?.bathrooms !== undefined && currentProperty?.bathrooms !== null) {
        const bathDiff = Math.abs((property.bathrooms || 0) - currentProperty.bathrooms);
        if (bathDiff === 1) score += 6; // ±1 bathroom (+6 points)
        else if (bathDiff === 2) score += 3; // ±2 bathrooms (+3 points)
      }
      
      // Price similarity (closer price = higher score)
      if (currentProperty?.propertyPrice && property.propertyPrice) {
        const priceDiff = Math.abs(property.propertyPrice - currentProperty.propertyPrice);
        const pricePercent = (priceDiff / currentProperty.propertyPrice) * 100;
        if (pricePercent <= 10) score += 15; // Within 10% (+15 points)
        else if (pricePercent <= 20) score += 10; // Within 20% (+10 points)
        else if (pricePercent <= 30) score += 7; // Within 30% (+7 points)
        else if (pricePercent <= 50) score += 4; // Within 50% (+4 points)
        else if (pricePercent <= 100) score += 2; // Within 100% (+2 points)
      }
      
      // Same status (+8 points)
      if (property.status === currentProperty?.status) {
        score += 8;
      }
      
      return { ...property, similarityScore: score };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore) // Sort by similarity score (highest first)
    .slice(0, 6); // Get top 6 most similar properties
    
    // Return all scored properties (even with score 0) if we have any
    return scoredProperties.length > 0 ? scoredProperties : [];
  }, [listingsData, currentProperty]);

  // Don't render if no similar properties or still loading
  if (isLoading) {
    return (
      <section className="section-similar-properties tf-spacing-3">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="heading-section mb-32">
                <h2 className="title">{t('similarProperties')}</h2>
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

  if (isError) {
    // Show "No related listings" message on error
    return (
      <section className="section-similar-properties tf-spacing-3">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="heading-section mb-32">
                <h2 className="title">{t('title')}</h2>
              </div>
              <div className={styles.noListingsMessage}>
                <p>{t('noRelatedListings')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show section even if no similar properties - display message
  if (similarProperties.length === 0) {
    // Try to show any approved properties of same type as fallback
    if (listingsData) {
      const listings = Array.isArray(listingsData) ? listingsData : (listingsData?.data || []);
      const fallbackListings = listings
        .filter(p => 
          p._id !== currentProperty?._id && 
          p.isDeleted !== true && 
          p.approvalStatus === 'approved' &&
          p.propertyType === currentProperty?.propertyType
        )
        .slice(0, 6);
      
      if (fallbackListings.length > 0) {
        // Show fallback listings
        return (
          <section className="section-similar-properties tf-spacing-3">
            <div className="tf-container">
              <div className="row">
                <div className="col-12">
                  <div className="heading-section mb-32">
                    <h2 className="title">{t('title')}</h2>
                    <p className="subtitle" style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
                      {t('otherProperties', { type: currentProperty?.propertyType || 'properties' })}
                    </p>
                  </div>
                  <div className={styles.propertiesGrid}>
                    {fallbackListings.map((property) => {
                      const getBadgeClass = () => {
                        const status = property.status?.toLowerCase();
                        if (status === 'rent') return styles.forRent;
                        if (status === 'sale') return styles.forSale;
                        return '';
                      };

                      return (
                        <div key={property._id} className={styles.propertyCard}>
                          <div className={styles.imageWrapper}>
                            <Link href={`/property-detail/${property._id}`}>
                              <Image
                                src={getPropertyImage(property)}
                                alt={getPropertyTitle(property)}
                                width={400}
                                height={300}
                                className={styles.propertyImage}
                              />
                            </Link>
                            {property.offer && (
                              <span className={styles.offerBadge}>{t('specialOffer')}</span>
                            )}
                            {property.status && (
                              <span className={`${styles.statusBadge} ${getBadgeClass()}`}>
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
                            <div className={styles.location}>
                              <i className="icon-location" />
                              <span>{property.address}, {property.state}</span>
                            </div>
                            <div className={styles.metaInfo}>
                              <div className={styles.metaItem}>
                                {t('beds')} <span>{property.bedrooms || 0}</span>
                              </div>
                              <div className={styles.metaItem}>
                                {t('baths')} <span>{property.bathrooms || 0}</span>
                              </div>
                              <div className={styles.metaItem}>
                                {t('sqft')} <span>{property.size || 0}</span>
                              </div>
                              <div className={styles.metaItem}>
                                {t('garage')} <span>{property.garage || t('no')}</span>
                              </div>
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
                </div>
              </div>
            </div>
          </section>
        );
      }
    }
    
    // Show "No related listings" message
    return (
      <section className="section-similar-properties tf-spacing-3">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="heading-section mb-32">
                <h2 className="title">{t('title')}</h2>
              </div>
              <div className={styles.noListingsMessage}>
                <p>{t('noRelatedListings')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-similar-properties tf-spacing-3">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section mb-32">
              <h2 className="title">{t('title')}</h2>
              <p className="subtitle" style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
                {t('subtitle')}
              </p>
            </div>
            <div className={styles.propertiesGrid}>
              {similarProperties.map((property) => {
                const getBadgeClass = () => {
                  const status = property.status?.toLowerCase();
                  if (status === 'rent') return styles.forRent;
                  if (status === 'sale') return styles.forSale;
                  return '';
                };

                return (
                  <div key={property._id} className={styles.propertyCard}>
                    <div className={styles.imageWrapper}>
                      <Link href={`/property-detail/${property._id}`}>
                        <Image
                          src={getPropertyImage(property)}
                          alt={getPropertyTitle(property)}
                          width={400}
                          height={300}
                          className={styles.propertyImage}
                          />
                        </Link>
                       
                        {property.offer && (
                          <span className={styles.offerBadge}>{t('specialOffer')}</span>
                        )}
                      
                      {property.status && (
                        <span className={`${styles.statusBadge} ${getBadgeClass()}`}>
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

                      <div className={styles.location}>
                        <i className="icon-location" />
                        <span>{property.address}, {property.state}</span>
                      </div>

                      <div className={styles.metaInfo}>
                        <div className={styles.metaItem}>
                          {t('beds')} <span>{property.bedrooms || 0}</span>
                        </div>
                        <div className={styles.metaItem}>
                          {t('baths')} <span>{property.bathrooms || 0}</span>
                        </div>
                        <div className={styles.metaItem}>
                          {t('sqft')} <span>{property.size || 0}</span>
                        </div>
                        <div className={styles.metaItem}>
                          {t('garage')} <span>{property.garage || t('no')}</span>
                        </div>
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
          </div>
        </div>
      </div>
    </section>
  );
}
