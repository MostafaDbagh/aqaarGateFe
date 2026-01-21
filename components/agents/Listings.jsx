"use client";
import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { translateKeywordsString } from "@/utils/translateKeywords";
import Link from "next/link";
import Image from "next/image";
import FavoriteButton from "@/components/common/FavoriteButton";
import { useListingsByAgent } from "@/apis/hooks";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import LocationLoader from "../common/LocationLoader";
import logger from "@/utlis/logger";
import styles from "./Listings.module.css";

const extractListings = (payload) => {
  if (!payload) return [];

  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload.data)) return payload.data;

  if (payload.data && Array.isArray(payload.data.listings)) {
    return payload.data.listings;
  }

  if (Array.isArray(payload.listings)) return payload.listings;

  if (Array.isArray(payload.results)) return payload.results;

  if (payload.data && Array.isArray(payload.data.results)) {
    return payload.data.results;
  }

  return [];
};

const extractPagination = (payload) => {
  if (!payload) return null;

  if (
    payload.pagination &&
    typeof payload.pagination === "object"
  ) {
    return payload.pagination;
  }

  if (
    payload.data &&
    payload.data.pagination &&
    typeof payload.data.pagination === "object"
  ) {
    return payload.data.pagination;
  }

  return null;
};

export default function Listings({ agentId }) {
  const t = useTranslations('agentDetails');
  const tCommon = useTranslations('common');
  const tAgent = useTranslations('agent.addProperty');
  const locale = useLocale();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'rent', 'sale'
  const [showPhoneNumbers, setShowPhoneNumbers] = useState({});
  const [isPageChanging, setIsPageChanging] = useState(false);
  const { handleDetailsClick, handleQuickViewClick } = usePropertyActions();
  const itemsPerPage = 6;

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

  const togglePhoneNumber = (propertyId) => {
    setShowPhoneNumbers(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }));
  };

  // Format phone number for RTL (Arabic) - move + to the right
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    if (locale === 'ar' && phoneNumber.startsWith('+')) {
      return phoneNumber.substring(1) + '+';
    }
    return phoneNumber;
  };

  const handleWhatsAppClick = (phoneNumber) => {
    if (!phoneNumber) return;
    const message = "Hello! I'm interested in this property. Could you please provide more information?";
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  // Get contact info from property with fallbacks
  const getPropertyContactInfo = (property) => {
    return {
      phone: property.agentNumber || property.agent?.phone || property.agentId?.phone || '+971586057772',
      whatsapp: property.agentWhatsapp || property.agentNumber || property.agent?.phone || property.agentId?.phone || '+971586057772',
      email: property.agentEmail || property.agent?.email || property.agentId?.email || 'info@example.com',
      facebook: property.agentFacebook || null
    };
  };

  // Fetch listings for the agent with pagination and filtering
  // For public agent listing page, only show approved properties
  const { data: listingsData, isLoading, isError, error } = useListingsByAgent(
    agentId,
    {
      page: currentPage,
      limit: itemsPerPage,
      status: statusFilter,
      public: true, // This is a public page, only show approved
    }
  );

  const serverListings = extractListings(listingsData);
  const rawPagination = extractPagination(listingsData);
  const hasServerPagination = !!rawPagination;

  const paginationLimit = hasServerPagination
    ? rawPagination?.limit ?? itemsPerPage
    : itemsPerPage;

  const totalListings = hasServerPagination
    ? (rawPagination?.totalListings 
      ?? rawPagination?.totalItems 
      ?? rawPagination?.total 
      ?? serverListings.length)
    : serverListings.length;

  const computedTotalPages = Math.max(
    1,
    Math.ceil(totalListings / (paginationLimit || itemsPerPage))
  );

  const totalPages = hasServerPagination
    ? rawPagination?.totalPages ?? computedTotalPages
    : computedTotalPages;

  // Use currentPage as the source of truth for activePage
  // When server pagination is available, use currentPage (which we control)
  // When client-side pagination, ensure currentPage doesn't exceed totalPages
  const activePage = hasServerPagination
    ? currentPage
    : Math.min(currentPage, totalPages);

  const listings = hasServerPagination
    ? serverListings
    : serverListings.slice(
        (activePage - 1) * paginationLimit,
        activePage * paginationLimit
      );

  const pagination = {
    currentPage: activePage,
    totalPages,
    limit: paginationLimit,
    totalListings,
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle page change
  const handlePageChange = (page) => {
    // Use totalPages from pagination object which is already computed
    const maxPages = totalPages;
    
    // Validate page number
    if (page < 1 || page > maxPages) {
      console.warn(`Invalid page number: ${page}. Valid range: 1-${maxPages}`);
      return;
    }
    
    // Don't do anything if already on this page
    if (page === currentPage) {
      return;
    }
    
    // Set loading state and update page
    setIsPageChanging(true);
    setCurrentPage(page);
    
    // Scroll to listings section smoothly after a short delay
    setTimeout(() => {
      const listingsSection = document.querySelector(`.${styles.wgListing}`);
      if (listingsSection) {
        const offsetTop = listingsSection.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };
  
  // Reset page changing state when data loads
  useEffect(() => {
    if (!isLoading && isPageChanging) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsPageChanging(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isPageChanging]);

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const { currentPage: page, totalPages } = pagination;
    
    // Previous button
    items.push(
      <li key="prev" className={page <= 1 ? "arrow disabled" : "arrow"}>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (page > 1) handlePageChange(page - 1);
          }}
        >
          <i className="icon-arrow-left" />
        </a>
      </li>
    );

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <li key={1}>
          <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }}>1</a>
        </li>
      );
      if (startPage > 2) {
        items.push(<li key="ellipsis1">...</li>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <li key={i} className={i === page ? "active" : ""}>
          <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i); }}>{i}</a>
        </li>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<li key="ellipsis2">...</li>);
      }
      items.push(
        <li key={totalPages}>
          <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }}>{totalPages}</a>
        </li>
      );
    }

    // Next button
    items.push(
      <li key="next" className={page >= totalPages ? "arrow disabled" : "arrow"}>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (page < totalPages) handlePageChange(page + 1);
          }}
        >
          <i className="icon-arrow-right" />
        </a>
      </li>
    );

    return items;
  };

  // Function to resolve image URL from various formats
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

    const isBareFilename = /^[^\/]+\.(jpg|jpeg|png|webp|gif|avif|svg|heic)$/i.test(raw);
    if (isBareFilename) {
      return null;
    }

    if (raw.startsWith('/')) {
      return raw;
    }

    if (!raw.includes('/')) {
      return null;
    }

    const normalized = raw.replace(/\\/g, '/');
    const trimmed = normalized.replace(/^(\.\/)+/, '').replace(/^\/+/, '');
    if (!trimmed) {
      return null;
    }

    return `/${trimmed}`;
  };

  // Function to extract all image URLs from property (same as PropertyGridItems)
  const extractImageUrls = (property) => {
    if (!property) {
      return [];
    }

    const urls = [];

    const pushUrl = (value) => {
      const resolved = resolveImageUrl(value);
      if (resolved) {
        urls.push(resolved);
      }
    };

    // Check images array first
    if (Array.isArray(property.images)) {
      property.images.forEach((item) => pushUrl(item));
    }

    // Check galleryImages array
    if (Array.isArray(property.galleryImages)) {
      property.galleryImages.forEach((item) => pushUrl(item));
    }

    // Check imageNames array
    if (Array.isArray(property.imageNames)) {
      property.imageNames.forEach((name) => pushUrl(name));
    }

    // Check individual image fields
    pushUrl(property.coverImage);
    pushUrl(property.featuredImage);
    pushUrl(property.mainImage);

    // Get unique URLs
    const uniqueUrls = urls
      .filter(Boolean)
      .filter((url, index, arr) => arr.indexOf(url) === index);

    // Return empty array if no images found

    return uniqueUrls;
  };

  // Function to get single image source for property
  const getImageSource = (property) => {
    const imageUrls = extractImageUrls(property);
    // Return first image or null
    return imageUrls.length > 0 ? imageUrls[0] : null;
  };

  if (isLoading) {
    return (
      <div className={`wg-listing ${styles.wgListing}`}>
        <div className="heading">
          <div className="text-7 fw-6 text-color-heading">{t('listing')}</div>
          <div className="tf-houese-filter">
            <div className="tf-btns-filter text-1 tf-tab-link_all is--active">
              <span>{t('all')}</span>
            </div>
            <div className="tf-btns-filter text-1 fw-3">
              <span>{t('forRent')}</span>
            </div>
            <div className="tf-btns-filter text-1 fw-3">
              <span>{t('forSale')}</span>
            </div>
          </div>
        </div>
        <div className={styles.rootGrid} style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LocationLoader 
            size="medium" 
            message={t('loadingProperties')}
          />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`wg-listing ${styles.wgListing}`}>
        <div className="heading">
          <div className="text-7 fw-6 text-color-heading">{t('listing')}</div>
        </div>
        <div className={styles.rootGrid} style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="alert alert-danger">
            <h4>{t('errorLoadingListings')}</h4>
            <p>{error?.message || t('failedToFetchListings')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`wg-listing ${styles.wgListing}`}>
      <div className="heading">
        <div className="text-7 fw-6 text-color-heading">{t('listing')}</div>
        <div className="tf-houese-filter">
          <div
            className={`tf-btns-filter text-1 ${statusFilter === 'all' ? 'tf-tab-link_all is--active' : 'fw-3'}`}
            onClick={() => handleFilterChange('all')}
            style={{ cursor: 'pointer' }}
          >
            <span>{t('all')}</span>
          </div>
          <div 
            className={`tf-btns-filter text-1 ${statusFilter === 'rent' ? 'tf-tab-link_all is--active' : 'fw-3'}`}
            onClick={() => handleFilterChange('rent')}
            style={{ cursor: 'pointer' }}
          >
            <span>{t('forRent')}</span>
          </div>
          <div 
            className={`tf-btns-filter text-1 ${statusFilter === 'sale' ? 'tf-tab-link_all is--active' : 'fw-3'}`}
            onClick={() => handleFilterChange('sale')}
            style={{ cursor: 'pointer' }}
          >
            <span>{t('forSale')}</span>
          </div>
        </div>
      </div>
      
      {(isPageChanging || isLoading) && listings.length > 0 ? (
        <div className={styles.rootGrid} style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <LocationLoader 
            size="medium" 
            message={t('loadingProperties')}
          />
        </div>
      ) : listings.length === 0 ? (
        <div className={styles.rootGrid} style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="text-center">
            <p className="text-1">{t('noPropertiesFound')}</p>
            <p className="text-1">{t('tryAdjustingFilters')}</p>
          </div>
        </div>
      ) : (
        <>
          <div id="parent" className={styles.rootGrid}>
            {listings.map((property, i) => {
              // Debug: Log property data to see image structure (only in development)
              if (i === 0) {
                logger.debug('First property data:', property);
                logger.debug('Property images:', property?.images);
                logger.debug('Property imageNames:', property?.imageNames);
                logger.debug('Property coverImage:', property?.coverImage);
                logger.debug('Property featuredImage:', property?.featuredImage);
                logger.debug('Property mainImage:', property?.mainImage);
              }
              
              const imageSrc = getImageSource(property);
              const hasImage = imageSrc && imageSrc !== null;
              
              return (
              <div key={property._id || i} className={`${styles.listingCard} tf_filter_rent tf-filter-item tf-tab-content`}>
                <div className="box-house hover-img">
                  <div className={`${styles.imageWrap} image-wrap`}>
                    {hasImage ? (
                      <Link href={`/property-detail/${property._id}`}>
                        <Image
                          className={styles.propertyImage + " lazyload"}
                          alt={property.propertyKeyword || property.propertyTitle || tCommon('property')}
                          src={imageSrc}
                          width={600}
                          height={401}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            logger.error('Image failed to load:', e.target.src);
                            // Hide image and show no image message
                            e.target.style.display = 'none';
                            const noImageDiv = e.target.nextElementSibling;
                            if (noImageDiv && noImageDiv.classList.contains('no-image-placeholder')) {
                              noImageDiv.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="no-image-placeholder" style={{ display: 'none', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', minHeight: '401px', backgroundColor: '#f3f4f6', border: '2px dashed #d1d5db', borderRadius: '8px', padding: '20px', textAlign: 'center', position: 'absolute', top: 0, left: 0 }}>
                          <i className="icon-image" style={{ fontSize: '48px', color: '#9ca3af', marginBottom: '16px' }}></i>
                          <p style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>{t('noImageAvailable')}</p>
                          <p style={{ fontSize: '14px', color: '#6b7280' }}>{t('noImageDescription')}</p>
                        </div>
                      </Link>
                    ) : (
                      <div className="no-image-placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', minHeight: '401px', backgroundColor: '#f3f4f6', border: '2px dashed #d1d5db', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                        <i className="icon-image" style={{ fontSize: '48px', color: '#9ca3af', marginBottom: '16px' }}></i>
                        <p style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>{t('noImageAvailable')}</p>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>{t('noImageDescription')}</p>
                      </div>
                    )}
                    <ul className="box-tag flex gap-8">
                      <li className="flat-tag text-4 bg-main fw-6 text_white">
                        {t('featured')}
                      </li>
                      <li className={`flat-tag text-4 fw-6 text_white ${property.status === 'rent' ? 'bg-2' : 'bg-3'}`}>
                        {property.status === 'rent' ? tCommon('forRent') : tCommon('forSale')}
                      </li>
                    </ul>
                    <div className="list-btn flex gap-8">
                      <FavoriteButton 
                        propertyId={property._id}
                        showLabel={true}
                      />
                    </div>
                  </div>
                  <div className="content">
                    {/* Property Type */}
                    {property.propertyType && (
                      <p className="text-1" style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                        {property.propertyType}
                      </p>
                    )}
              
                    {/* Property Keyword Tags */}
                    {property.propertyKeyword && (
                      <div style={{ marginTop: '16px', marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {translateKeywordsString(property.propertyKeyword, tCommon).map((translatedKeyword, index) => (
                          <span 
                            key={index} 
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '4px 10px',
                              backgroundColor: '#f0f0f0',
                              border: '1px solid #e0e0e0',
                              borderRadius: '20px',
                              fontSize: '12px',
                              color: '#333',
                              fontWeight: '500'
                            }}
                          >
                            {translatedKeyword}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="location text-1 flex items-center gap-6">
                      <i className="icon-location" /> 
                      <span style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
                        {locale === 'ar' && property?.address_ar ? property.address_ar : (property.address || property.state || t('locationNotSpecified'))}
                      </span>
                    </p>
                    <ul className="meta-list flex">
                      {property.bedrooms != null && Number(property.bedrooms) > 0 && (
                        <li className="text-1 flex">
                          <span>{property.bedrooms}</span>{tCommon('beds')}
                        </li>
                      )}
                      {property.bathrooms != null && Number(property.bathrooms) > 0 && (
                        <li className="text-1 flex">
                          <span>{property.bathrooms}</span>{tCommon('baths')}
                        </li>
                      )}
                      <li className="text-1 flex">
                        <span>{property.size || property.landArea || 0}</span> {getSizeUnitLabel(property.sizeUnit)}
                      </li>
                    </ul>
                    {/* Contact Section */}
                    <div className={styles.contactSection + " contact-section"}>
                      <div className={styles.callButtonContainer + " call-button-container"}>
                        <button 
                          onClick={() => togglePhoneNumber(property._id)}
                          className={styles.callButton + " call flex gap-8 items-center text-1"}
                          style={{
                            background: 'white',
                            border: '1px solid #F97316',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#F97316',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease',
                            width: '100%',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => {
                            if (!showPhoneNumbers[property._id]) {
                              e.target.style.backgroundColor = '#F97316';
                              e.target.style.color = 'white';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!showPhoneNumbers[property._id]) {
                              e.target.style.backgroundColor = 'white';
                              e.target.style.color = '#F97316';
                            }
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06679 2.16708 8.43376 2.48353C8.80073 2.79999 9.04207 3.23945 9.11999 3.72C9.28562 4.68007 9.56648 5.62273 9.95999 6.53C10.0555 6.74431 10.1112 6.97355 10.1241 7.20668C10.137 7.43981 10.1069 7.67342 10.0353 7.896C9.96366 8.11858 9.85182 8.32642 9.70599 8.51L8.08999 10.12C9.51355 12.4885 11.5115 14.4864 13.88 15.91L15.49 14.3C15.6736 14.1542 15.8814 14.0423 16.104 13.9707C16.3266 13.8991 16.5602 13.869 16.7933 13.8819C17.0264 13.8948 17.2557 13.9505 17.47 14.046C18.3773 14.4395 19.3199 14.7204 20.28 14.886C20.7658 14.9656 21.2094 15.2132 21.5265 15.5866C21.8437 15.9601 22.0122 16.4348 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {showPhoneNumbers[property._id] ? formatPhoneNumber(getPropertyContactInfo(property).phone) : tCommon('call')}
                        </button>
                        
                        {showPhoneNumbers[property._id] && (
                          <div className={styles.phoneOptions + " phone-options"}>
                            <div className={styles.phoneOptionsRow}>
                              <button
                                onClick={() => window.open(`tel:${getPropertyContactInfo(property).phone}`)}
                                className={styles.phoneBtn}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06679 2.16708 8.43376 2.48353C8.80073 2.79999 9.04207 3.23945 9.11999 3.72C9.28562 4.68007 9.56648 5.62273 9.95999 6.53C10.0555 6.74431 10.1112 6.97355 10.1241 7.20668C10.137 7.43981 10.1069 7.67342 10.0353 7.896C9.96366 8.11858 9.85182 8.32642 9.70599 8.51L8.08999 10.12C9.51355 12.4885 11.5115 14.4864 13.88 15.91L15.49 14.3C15.6736 14.1542 15.8814 14.0423 16.104 13.9707C16.3266 13.8991 16.5602 13.869 16.7933 13.8819C17.0264 13.8948 17.2557 13.9505 17.47 14.046C18.3773 14.4395 19.3199 14.7204 20.28 14.886C20.7658 14.9656 21.2094 15.2132 21.5265 15.5866C21.8437 15.9601 22.0122 16.4348 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {tCommon('call')}
                              </button>
                              <button
                                onClick={() => handleWhatsAppClick(getPropertyContactInfo(property).whatsapp)}
                                className={styles.whatsappBtn}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" fill="currentColor"/>
                                </svg>
                                WhatsApp
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Email Button - Only show if email exists */}
                      {(property.agentEmail || property.agent?.email || property.agentId?.email) && (
                        <button
                          onClick={() => window.open(`mailto:${getPropertyContactInfo(property).email}?subject=Inquiry about ${property.propertyTitle || tCommon('property')}`)}
                          className={styles.emailBtn}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {tCommon('email')}
                        </button>
                      )}

                      {/* Details Button */}
                      <button
                        onClick={() => handleDetailsClick(property._id)}
                        className={styles.detailsBtn}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {tCommon('details')}
                      </button>
                    </div>
                  </div>

                  {/* Follow Section - Separate row below main buttons */}
                  {getPropertyContactInfo(property).facebook && (
                    <div className={styles.followSection}>
                      <div className={styles.followSectionContent}>
                        <button
                          onClick={() => window.open(getPropertyContactInfo(property).facebook, '_blank', 'noopener,noreferrer')}
                          className={styles.facebookButton}
                        >
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.625 4.6875C15.9375 4.6875 17.2969 4.92188 17.2969 4.92188V7.875H15.8325C14.37 7.875 13.875 8.93333 13.875 10.02V12H17.1562L16.6719 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z" fill="#1877F2"/>
                          </svg>
                          <span className={styles.facebookButtonText}>Facebook</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Price Section - Full Width */}
                  <div className={styles.priceSection + " price-section"}>
                    <h5 className={styles.priceText + " price"}>
                      {(() => {
                        const currencySymbols = {
                          'USD': '$',
                          'SYP': 'SYP',
                          'EUR': '€'
                        };
                        const currency = property?.currency || 'USD';
                        const symbol = currencySymbols[currency] || currency;
                        const exactPrice = property.propertyPrice || 0;
                        const basePrice = `${symbol} ${exactPrice.toLocaleString('en-US', { maximumFractionDigits: 0, useGrouping: true })}`;
                        
                        // Add rent period for rental properties
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
                    </h5>
                    
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className={styles.wrapPagination + " wrap-pagination"}>
              <p className="text-1">
                {t('showingResults', {
                  start: ((pagination.currentPage - 1) * pagination.limit) + 1,
                  end: Math.min(pagination.currentPage * pagination.limit, pagination.totalListings),
                  total: pagination.totalListings
                })}
              </p>
              <ul className="wg-pagination">
                {generatePaginationItems()}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

