"use client";
import React from "react";
import { useTranslations, useLocale } from 'next-intl';
import Link from "next/link";
import SplitTextAnimation from "@/components/common/SplitTextAnimation";
import LocationLoader from "@/components/common/LocationLoader";
import { useSearchListings } from "@/apis/hooks";
import FavoriteButton from "@/components/common/FavoriteButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { translateKeywordsString } from "@/utils/translateKeywords";
import styles from "./Properties2.module.css";

export default function Properties2() {
  const t = useTranslations('homeSections');
  const tAgent = useTranslations('agent.addProperty');
  const tCommon = useTranslations('common');
  const tRoot = useTranslations();
  const locale = useLocale();
  
  // Helper function to get size unit label
  const getSizeUnitLabel = (sizeUnit) => {
    if (!sizeUnit) return tCommon('sqft'); // Default fallback
    return tAgent(`sizeUnits.${sizeUnit}`) || sizeUnit.toUpperCase();
  };
  // Use search endpoint to get ONLY Holiday Home properties
  const { data: searchResponse, isLoading, isError, error } = useSearchListings({ 
    propertyType: 'Holiday Home', // ONLY show Holiday Homes
    limit: 12, // Only get 12 properties for home page
    sort: 'newest' // Get newest properties
  });
  // API returns array directly, not wrapped in data property
  // Format phone number for RTL (Arabic) - move + to the right
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    if (locale === 'ar' && phoneNumber.startsWith('+')) {
      return phoneNumber.substring(1) + '+';
    }
    return phoneNumber;
  };

  const listings = (() => {
    // Handle both array response and wrapped response
    if (Array.isArray(searchResponse)) {
      return searchResponse;
    }
    return searchResponse?.data || [];
  })();

  // Hide section if listings array is empty
  if (!isLoading && !isError && (!listings || listings.length === 0)) {
    return null;
  }

  // Function to get image source
  const getImageSource = (property) => {
    // Try different possible image sources
    if (property.images && property.images.length > 0) {
      const firstImage = property.images[0];
      
      if (typeof firstImage === 'string') {
        return firstImage;
      } else if (firstImage && firstImage.url) {
        return firstImage.url;
      }
    }
    
    // Try imageNames as fallback
    if (property.imageNames && property.imageNames.length > 0) {
      return property.imageNames[0];
    }
    
    // No default image - return null
    return null;
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <section className="section-listing tf-spacing-1">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="heading-section text-center mb-48">
                <h2 className="title split-text effect-right">
                  {t('holidayHomesListings')}
                </h2>
                <p className="text-1 split-text split-lines-transform">
                  {t('holidayHomesListingsSubtitle')}
                </p>
              </div>
              <div className={styles.loaderContainer}>
                <LocationLoader size="medium" message="Loading properties..." />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (isError) {
    return (
      <section className="section-listing tf-spacing-1">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="heading-section text-center mb-48">
                <h2 className="title">
                  {t('holidayHomesListings')}
                </h2>
                <p className="text-1 split-text split-lines-transform">
                  {t('holidayHomesListingsSubtitle')}
                </p>
              </div>
              <div className="text-center">
                <div className="alert alert-danger">
                  <h4>Error Loading Properties</h4>
                  <p>Failed to load properties. Please try again later.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (!listings || listings.length === 0) {
    return (
      <section className="section-listing tf-spacing-1">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="heading-section text-center mb-48">
                <h2 className="title split-text effect-right">
                  {t('holidayHomesListings')}
                </h2>
                <p className="text-1 split-text split-lines-transform">
                  {t('holidayHomesListingsSubtitle')}
                </p>
              </div>
              <div className="text-center">
                <div className="alert alert-info">
                  <h4>No Properties Available</h4>
                  <p>There are currently no properties available. Check back later!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-listing tf-spacing-1">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section text-center mb-48">
              <h2 className="title split-text effect-right">
                {t('holidayHomesListings')}
              </h2>
              <p className="text-1 split-text split-lines-transform">
                {t('holidayHomesListingsSubtitle')}
              </p>
            </div>
            
            <div className="wrap-properties-sw">
              <Swiper
                dir="ltr"
                className=" style-pagination sw-properties"
                slidesPerView={2}
                spaceBetween={30}
                loop={true}
                autoplay={{
                  delay:5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                modules={[Pagination, Autoplay]}
                pagination={{ 
                  el: ".spd-properties", 
                  clickable: true,
                  dynamicBullets: true,
                  type: 'bullets',
                  
                }}
                breakpoints={{
                  0: { slidesPerView: 1, spaceBetween: 30 },
                  576: { slidesPerView: 1, spaceBetween: 40 },
                  768: { slidesPerView: 2, spaceBetween: 50 },
                  992: { slidesPerView: 2, spaceBetween: 60 },
                  1200: { slidesPerView: 2, spaceBetween: 60 },
                }}
              >
                {listings.map((property) => {
                  const imageSrc = getImageSource(property);
                  const statusToCheck = property.statusOriginal || property.status || '';
                  const status = statusToCheck.toLowerCase().trim();
                  const isRent = status === 'rent' || status === 'for rent' || status?.includes('rent') || statusToCheck.includes('إيجار') || statusToCheck.includes('للإيجار');
                  const isSale = status === 'sale' || status === 'for sale' || status?.includes('sale') || statusToCheck.includes('بيع') || statusToCheck.includes('للبيع');
                  const displayStatus = isRent ? tCommon('forRent') : isSale ? tCommon('forSale') : tCommon('forRent');
                  
                  return (
                  <SwiperSlide key={property._id}>
                    <div className={`${styles.propertyCard}`}>
                      {/* Left Image Section - 300px x 220px */}
                      <div className={styles.leftSection}>
                        <div className={styles.imageSection}>
                          <Link href={`/property-detail/${property._id}`}>
                            <img
                              className={`lazyload property-image-cover ${styles.propertyImage}`}
                              alt={property.propertyKeyword || property.propertyType || "Property"}
                              src={imageSrc}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </Link>
                          
                          {/* Badges */}
                          <div className={styles.badges}>
                            <span 
                              className={`${isRent ? styles.badgeRent : styles.badgeSale} ${styles.statusBadge}`}
                            >
                              {displayStatus}
                            </span>
                            <span className={styles.badgeHoliday}>
                              🏖️ {tCommon('holidayHome')}
                            </span>
                            {property.isAgentBlocked && (
                              <span className={styles.badgeBlockedAgent}>
                                Blocked Agent
                              </span>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className={styles.actionButtons}>
                            <FavoriteButton propertyId={property._id} showLabel={false} />
                          </div>
                        </div>
                        
                        {/* Title and Location below image */}
                        <div className={styles.titleSection}>
                          <h6 className={styles.propertyTitle}>
                            {property.propertyType || 'Property'}
                          </h6>
                          {/* Property Keyword Tags */}
                          {property.propertyKeyword && (
                            <div className={styles.keywordTagsContainer}>
                              {translateKeywordsString(property.propertyKeyword, tCommon).map((translatedKeyword, index) => (
                                <span key={index} className={styles.keywordTag}>
                                  {translatedKeyword}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className={styles.propertyLocation}>
                            <i className="icon-location" />
                            {locale === 'ar' && property?.address_ar ? property.address_ar : (property.address || '')}
                            {property.state && `, ${property.state}`}
                          </p>
                        </div>
                        
                        {/* Price and Details below text */}
                        <div className={styles.priceDetailsSection}>
                          <div className={styles.price}>
                            {(() => {
                              const currencySymbols = {
                                'USD': '$',
                                'SYP': 'SYP',
                                'EUR': '€'
                              };
                              const currency = property?.currency || 'USD';
                              const symbol = currencySymbols[currency] || currency;
                              const price = property?.propertyPrice?.toLocaleString() || '0';
                              const basePrice = `${symbol}${price}`;
                              
                              // Add rent period for rental properties (especially holiday homes)
                              const statusToCheck = property?.statusOriginal || property?.status || '';
                              const statusLower = statusToCheck.toLowerCase().trim();
                              const isRent = statusLower === 'rent' || statusLower === 'for rent' || statusLower.includes('rent') || statusToCheck.includes('إيجار') || statusToCheck.includes('للإيجار');
                              
                              if (isRent) {
                                const rentTypeValue = property?.rentType || property?.rent_type || null;
                                const rentType = (rentTypeValue && rentTypeValue !== null && rentTypeValue !== undefined && rentTypeValue !== '') 
                                  ? String(rentTypeValue).toLowerCase().trim()
                                  : 'monthly';
                                
                                const rentTypeMap = {
                                  'monthly': tCommon('monthly'),
                                  'weekly': tCommon('weekly'),
                                  'yearly': tCommon('yearly'),
                                  'daily': tCommon('daily'),
                                  'one-year': tCommon('oneYear')
                                };
                                const rentPeriod = rentTypeMap[rentType] || tCommon('monthly');
                                // Only apply black color and 18px for Holiday Homes
                                const isHolidayHome = property?.propertyType === 'Holiday Home' || property?.propertyType === 'Holiday Homes';
                                return (
                                  <>
                                    {basePrice}
                                    <span style={{ color: isHolidayHome ? '#000000' : 'inherit', fontSize: isHolidayHome ? '16px' : 'inherit' }}>{rentPeriod}</span>
                                  </>
                                );
                              }
                              
                              return basePrice;
                            })()}
                          </div>
                          <Link href={`/property-detail/${property._id}`} className={styles.detailsBtn}>
                            {tCommon('details')}
                          </Link>
                        </div>
                      </div>
                      
                      {/* Right Content Section */}
                      <div className={styles.contentSection}>
                        
                        {/* Details Grid */}
                        <div className={styles.detailsSection}>
                          <div className={styles.detailsGrid}>
                            {property.bedrooms != null && Number(property.bedrooms) > 0 && (
                              <div className={styles.detailItem}>
                                <i className="icon-bed" style={{ margin: '0 2px' }} />
                                <span>{tCommon('beds')} <strong>{property.bedrooms}</strong></span>
                              </div>
                            )}
                            {property.bathrooms != null && Number(property.bathrooms) > 0 && (
                              <div className={styles.detailItem}>
                                <i className="icon-bath" style={{ margin: '0 2px' }} />
                                <span>{tCommon('baths')} <strong>{property.bathrooms}</strong></span>
                              </div>
                            )}
                            <div className={styles.detailItem}>
                              <i className="icon-sqft" style={{ margin: '0 2px' }} />
                              <span><strong>{property.size}</strong> {getSizeUnitLabel(property.sizeUnit)}</span>
                            </div>
                            <div className={styles.detailItem}>
                              <i className="icon-garage" />
                              <span>{tCommon('garage')} <strong>{property.garages ? tCommon('yes') : tCommon('no')}</strong></span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons - Tab Style */}
                        <div className={styles.actionButtonsSection}>
                          <p className={`${styles.contactAgentTitle} contact-agent-title`}>{tCommon('contactAgent')}</p>
                          <div className={styles.actionButtonsVertical}>
                            <button 
                              className={`${styles.actionTab} ${styles.callTab}`}
                              onClick={() => {
                                const phoneNumber = property.agentNumber || property.agent?.phoneNumber || property.agent?.phone;
                                if (phoneNumber) {
                                  window.open(`tel:${phoneNumber}`, '_self');
                                } else {
                                  alert('Phone number not available');
                                }
                              }}
                            >
                              <i className="icon-phone-1" />
                              <span className="phone-number-text" style={{fontSize: '12px'}}>
                                
                                  {formatPhoneNumber(property.agentNumber || property.agent?.phoneNumber || property.agent?.phone) || tCommon('callAgent')}
                                
                              </span>
                            </button>
                            <button 
                              className={`${styles.actionTab} ${styles.emailTab}`}
                              onClick={() => {
                                const email = property.agentEmail || property.agent?.email;
                                if (email) {
                                  window.open(`mailto:${email}`, '_self');
                                } else {
                                  alert('Email not available');
                                }
                              }}
                            >
                              <i className="icon-mail" />
                              <span>
                                
                                  {property.agentEmail || property.agent?.email || tCommon('emailAgent')}
                                
                              </span>
                            </button>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </SwiperSlide>
                  );
                })}
              </Swiper>
              
              {/* Pagination dots */}
              <div className="sw-pagination sw-pagination-mb text-center mt-20 spd-properties" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
