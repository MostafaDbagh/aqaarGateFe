"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { translateKeywordsString } from "@/utils/translateKeywords";
import FavoriteButton from "../common/FavoriteButton";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import "./PropertyImageFix.css";
import styles from "./PropertyGridItems.module.css";
import logger from "@/utlis/logger";

export default function PropertyGridItems({ listings = [], isAISearch = false, hasActiveSearch = false }) {
  const t = useTranslations();
  const tAgent = useTranslations('agent.addProperty');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  
  // Helper function to get size unit label
  const getSizeUnitLabel = (sizeUnit) => {
    if (!sizeUnit) return 'Sqft'; // Default fallback
    return tAgent(`sizeUnits.${sizeUnit}`) || sizeUnit.toUpperCase();
  };
  const [showPhoneNumbers, setShowPhoneNumbers] = useState({});
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const { handleDetailsClick, handleQuickViewClick } = usePropertyActions();

  const togglePhoneNumber = (propertyId) => {
    setShowPhoneNumbers((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
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

  const handlePrevImage = (propertyId, totalImages) => {
    if (totalImages <= 1) return;

    setActiveImageIndex((prev) => {
      const current = prev[propertyId] ?? 0;
      const next = (current - 1 + totalImages) % totalImages;
      return { ...prev, [propertyId]: next };
    });
  };

  const handleNextImage = (propertyId, totalImages) => {
    if (totalImages <= 1) return;

    setActiveImageIndex((prev) => {
      const current = prev[propertyId] ?? 0;
      const next = (current + 1) % totalImages;
      return { ...prev, [propertyId]: next };
    });
  };

  const handleSelectImage = (propertyId, index) => {
    setActiveImageIndex((prev) => ({
      ...prev,
      [propertyId]: index,
    }));
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
      email: property.agentEmail || property.agent?.email || property.agentId?.email || 'info@example.com'
    };
  };

  if (!listings || listings.length === 0) {
    // Case 1: No active search/filters - show "no listings to show" message
    if (!hasActiveSearch) {
      return (
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyIcon}>🏠</div>
          <h3 className={styles.emptyTitle}>
            {locale === 'ar' 
              ? 'لا توجد عقارات متاحة للعرض' 
              : 'There are no listings to show'}
          </h3>
          <div className={styles.emptyMessageBox}>
            <p className={styles.emptyMessageText}>
              {locale === 'ar' 
                ? 'لا توجد عقارات متاحة حالياً. يرجى المحاولة لاحقاً.' 
                : 'There are no listings available at the moment. Please try again later.'}
            </p>
          </div>
        </div>
      );
    }
    
    // Case 2: Active search/filters but no results - show search-specific message
    return (
      <div className={styles.emptyStateContainer}>
        {isAISearch ? (
          <>
            <div className={styles.emptyIcon}>🔍</div>
            <h3 className={styles.emptyTitle}>
              {locale === 'ar' 
                ? 'لا توجد نتائج للبحث' 
                : 'No search results found'}
            </h3>
            <div className={styles.emptyMessageBox}>
              <p className={styles.emptyMessageText}>
                {locale === 'ar' 
                  ? 'لا يوجد أي إعلان يطابق هذه المعايير' 
                  : 'No any listing found match this criteria'}
              </p>
            </div>
            <div className={styles.emptyTipBox}>
              <p className={styles.emptyTipText}>
                {locale === 'ar' 
                  ? '💡 نصيحة: استخدم الفلاتر العادية (المدينة، نوع العقار، السعر، الحجم) للحصول على نتائج أكثر دقة.' 
                  : '💡 Tip: Use normal filters (city, property type, price, size) to get more accurate results.'}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className={styles.emptyIcon}>🔍</div>
            <h3 className={styles.emptyTitle}>
              {locale === 'ar' 
                ? 'لا توجد نتائج' 
                : 'No results found'}
            </h3>
            <div className={styles.emptyMessageBox}>
              <p className={styles.emptyMessageText}>
                {locale === 'ar' 
                  ? 'لا يوجد أي إعلان يطابق هذه المعايير' 
                  : 'No any listing found match this criteria'}
              </p>
            </div>
            <p className={styles.emptyMessageWithMargin}>
              {locale === 'ar' 
                ? 'لم يتم العثور على عقارات تتطابق مع معايير البحث الخاصة بك. يرجى محاولة تعديل الفلاتر.' 
                : 'No properties found matching your search criteria. Please try adjusting your filters.'}
            </p>
          </>
        )}
      </div>
    );
  }


  const extractImageUrls = (property) => {
    const urls = [];

    const pushUrl = (value) => {
      const resolved = resolveImageUrl(value);
      if (resolved) {
        urls.push(resolved);
      }
    };

    if (Array.isArray(property.images)) {
      property.images.forEach((item) => pushUrl(item));
    }

    if (Array.isArray(property.galleryImages)) {
      property.galleryImages.forEach((item) => pushUrl(item));
    }

    if (Array.isArray(property.imageNames)) {
      property.imageNames.forEach((name) => pushUrl(name));
    }

    pushUrl(property.coverImage);
    pushUrl(property.featuredImage);
    pushUrl(property.mainImage);

    const uniqueUrls = urls
      .filter(Boolean)
      .filter((url, index, arr) => arr.indexOf(url) === index);

    // No fallback image - return empty array if no images found

    return uniqueUrls;
  };

  return (
    <>
      {listings.map((property) => {
        const imageUrls = extractImageUrls(property);
        const totalImages = imageUrls.length;
        const currentIndex = activeImageIndex[property._id] ?? 0;
        const safeIndex = Math.min(currentIndex, totalImages - 1);
        const activeImage = imageUrls[safeIndex] || imageUrls[0];

        return (
          <div className="box-house hover-img property-image-fix" key={property._id}>
          <div className={styles.imageWrap}>
            <div className={styles.imageSlider}>
              <Link href={`/property-detail/${property._id}`} className={styles.imageLink}>
              <Image
                className={`lazyload ${styles.propertyImg}`}
                alt={ property.propertyTitle || t('common.property')}
                src={activeImage}
                width={339}
                height={245}
                onError={(e) => {
                  logger.warn('Image failed to load:', e.target.src);
                  e.target.classList.add(styles.imageHidden);
                  if (e.target.nextSibling) {
                    e.target.nextSibling.classList.add(styles.imageFallbackVisible);
                  }
                }}
              />
              <div className={`${styles.imageFallback}`}>
                No Image
              </div>
            </Link>
            {totalImages > 1 && (
              <>
                <button
                  type="button"
                  className={`${styles.sliderControl} ${styles.sliderControlPrev}`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handlePrevImage(property._id, totalImages);
                  }}
                  aria-label="View previous image"
                >
                  <span className={styles.srOnly}>Previous image</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`${styles.sliderControl} ${styles.sliderControlNext}`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleNextImage(property._id, totalImages);
                  }}
                  aria-label="View next image"
                >
                  <span className={styles.srOnly}>Next image</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </button>
                <div className={styles.sliderDots}>
                  {imageUrls.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      type="button"
                      className={`${styles.sliderDot}${dotIndex === safeIndex ? ` ${styles.sliderDotActive}` : ''}`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleSelectImage(property._id, dotIndex);
                      }}
                      aria-label={`View image ${dotIndex + 1} of ${totalImages}`}
                    />
                  ))}
                </div>
              </>
            )}
            </div>
            <ul className="box-tag flex gap-8">
              {property.propertyType === 'Holiday Homes' && (
                <li className={`flat-tag text-4 fw-6 text_white ${styles.holidayBadge}`}>
                  🏖️ {t('common.holidayHome')}
                </li>
              )}
              {property.offer && (
                <li className="flat-tag text-4 bg-main fw-6 text_white">
                  Special Offer
                </li>
              )}
                <li 
                  className={`flat-tag text-4 fw-6 text_white ${styles.statusBadge} ${
                    (() => {
                      const statusToCheck = property.statusOriginal || property.status || '';
                      const statusLower = statusToCheck.toLowerCase().trim();
                      return statusLower === 'rent' || statusLower === 'for rent' || statusLower.includes('rent') || statusToCheck.includes('إيجار') || statusToCheck.includes('للإيجار');
                    })() ? styles.statusBadgeRent : styles.statusBadgeSale
                  }`}
                >
                  {(() => {
                    const statusToCheck = property.statusOriginal || property.status || '';
                    const statusLower = statusToCheck.toLowerCase().trim();
                    const isRent = statusLower === 'rent' || statusLower === 'for rent' || statusLower.includes('rent') || statusToCheck.includes('إيجار') || statusToCheck.includes('للإيجار');
                    return isRent ? t('common.forRent') : t('common.forSale');
                  })()}
                </li>
                {property.isAgentBlocked && (
                  <li className={`flat-tag text-4 fw-6 text_white ${styles.blockedAgentBadge}`}>
                    Blocked Agent
                  </li>
                )}
            </ul>
            <div className={styles.favoriteFloating}>
              <FavoriteButton
                propertyId={property._id}
                showLabel={false}
                iconClassName="icon-heart-1"
              />
            </div>
          </div>
          <div className="content">
            <div >
              {property.propertyType && (
                <p className={`property-type text-1 ${styles.propertyType}`}>
                  {property.propertyType}
                </p>
              )}
              {/* Property Keyword Tags */}
              {property.propertyKeyword ? (
                <div className={styles.keywordTagsContainer}>
                  {translateKeywordsString(property.propertyKeyword, tCommon).map((translatedKeyword, index) => (
                    <span key={index} className={styles.keywordTag}>
                      {translatedKeyword}
                    </span>
                  ))}
                </div>
              ) : (
                <p className={`title ${styles.propertyTitleFallback}`}>
                  {property.propertyTitle || t('common.property')}
                </p>
              )}
            </div>
  
            <p className={`location text-1 flex items-center gap-6 ${styles.locationText}`}>
              <i className="icon-location" /> <span className={`${styles.locationContent} ${locale === 'ar' ? styles.locationContentRtl : styles.locationContentLtr}`}>
                <span className={styles.locationState}>{property.state}</span>-
                {locale === 'ar' && property?.address_ar ? property.address_ar : (property.address || 'Location not specified')}
              </span>
            </p>
            <ul className={`meta-list flex ${styles.metaList}`}>
              {property.bedrooms != null && Number(property.bedrooms) > 0 && (
                <li className="text-1 flex items-center">
                  <i className="icon-bed" style={{ margin: '0 2px' }} />
                  <span className={styles.metaItemSpan}>{property.bedrooms}</span>
                </li>
              )}
              {property.bathrooms != null && Number(property.bathrooms) > 0 && (
                <li className="text-1 flex items-center">
                  <i className="icon-bath" style={{ margin: '0 2px' }} />
                  <span className={styles.metaItemSpan}>{property.bathrooms}</span>
                </li>
              )}
              <li className="text-1 flex items-center">
                <i className="icon-sqft" style={{ margin: '0 2px' }} />
                <span className={styles.metaItemSpan}>{property.size || 0}</span> {getSizeUnitLabel(property.sizeUnit)}
              </li>
            </ul>
            {/* Contact Section */}
            <div className={styles.contactSection}>
              <div className="wrap-btn flex">
                <div className={styles.callButtonContainer}>
                  <button 
                    onClick={() => togglePhoneNumber(property._id)}
                    className={`call flex gap-8 items-center text-1 ${styles.actionButton}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06679 2.16708 8.43376 2.48353C8.80073 2.79999 9.04207 3.23945 9.11999 3.72C9.28562 4.68007 9.56648 5.62273 9.95999 6.53C10.0555 6.74431 10.1112 6.97355 10.1241 7.20668C10.137 7.43981 10.1069 7.67342 10.0353 7.896C9.96366 8.11858 9.85182 8.32642 9.70599 8.51L8.08999 10.12C9.51355 12.4885 11.5115 14.4864 13.88 15.91L15.49 14.3C15.6736 14.1542 15.8814 14.0423 16.104 13.9707C16.3266 13.8991 16.5602 13.869 16.7933 13.8819C17.0264 13.8948 17.2557 13.9505 17.47 14.046C18.3773 14.4395 19.3199 14.7204 20.28 14.886C20.7658 14.9656 21.2094 15.2132 21.5265 15.5866C21.8437 15.9601 22.0122 16.4348 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {showPhoneNumbers[property._id] ? formatPhoneNumber(getPropertyContactInfo(property).phone) : t('common.call')}
                  </button>
                  
                  {showPhoneNumbers[property._id] && (
                    <div className={styles.phoneOptions}>
                      <div className={styles.phoneOptionsRow}>
                        <button
                          className={styles.phoneActionBtn}
                          onClick={() => window.open(`tel:${getPropertyContactInfo(property).phone}`)}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06679 2.16708 8.43376 2.48353C8.80073 2.79999 9.04207 3.23945 9.11999 3.72C9.28562 4.68007 9.56648 5.62273 9.95999 6.53C10.0555 6.74431 10.1112 6.97355 10.1241 7.20668C10.137 7.43981 10.1069 7.67342 10.0353 7.896C9.96366 8.11858 9.85182 8.32642 9.70599 8.51L8.08999 10.12C9.51355 12.4885 11.5115 14.4864 13.88 15.91L15.49 14.3C15.6736 14.1542 15.8814 14.0423 16.104 13.9707C16.3266 13.8991 16.5602 13.869 16.7933 13.8819C17.0264 13.8948 17.2557 13.9505 17.47 14.046C18.3773 14.4395 19.3199 14.7204 20.28 14.886C20.7658 14.9656 21.2094 15.2132 21.5265 15.5866C21.8437 15.9601 22.0122 16.4348 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {t('common.call')}
                        </button>
                        <button
                          className={`${styles.phoneActionBtn} ${styles.whatsappBtn}`}
                          onClick={() => handleWhatsAppClick(getPropertyContactInfo(property).whatsapp)}
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
                
                {/* Email Button */}
                <button
                  className={styles.actionButton}
                  onClick={() => window.open(`mailto:${getPropertyContactInfo(property).email}?subject=Inquiry about ${property.propertyTitle || t('common.property')}`)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t('common.email')}
                </button>

                {/* Details Button */}
                <button
                  className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
                  onClick={() => handleDetailsClick(property._id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t('common.details')}
                </button>
              </div>
            </div>

            {/* Price Section - Full Width */}
            <div className={styles.priceSection}>
              <h5 className={styles.price}>
                {(() => {
                  const currencySymbols = {
                    'USD': '$',
                    'SYP': 'SYP',
                    'TRY': '₺',
                    'EUR': '€'
                  };
                  const currency = property?.currency || 'USD';
                  const symbol = currencySymbols[currency] || currency;
                  // IMPORTANT: Display exact price as stored in database - no rounding or modification
                  const exactPrice = property.propertyPrice;
                  if (exactPrice === null || exactPrice === undefined) {
                    return `${symbol} 0`;
                  }
                  // Use toLocaleString only for formatting, not for rounding
                  const basePrice = `${symbol} ${exactPrice.toLocaleString('en-US', { maximumFractionDigits: 0, useGrouping: true })}`;
                  
                  // Add rent period for rental properties
                  const statusToCheck = property?.statusOriginal || property?.status || '';
                  const statusLower = statusToCheck.toLowerCase().trim();
                  const isRent = statusLower === 'rent' || statusLower === 'for rent' || statusLower.includes('rent') || statusToCheck.includes('إيجار') || statusToCheck.includes('للإيجار');
                  if (isRent) {
                    // Get rentType from property - check multiple possible field names
                    const rentTypeValue = property?.rentType || property?.rent_type || null;
                    
                    // Use rentType from property, or default to 'monthly' if not specified
                    const rentType = (rentTypeValue && rentTypeValue !== null && rentTypeValue !== undefined && rentTypeValue !== '') 
                      ? String(rentTypeValue).toLowerCase().trim()
                      : 'monthly'; // Default to monthly if rentType is not specified
                    
                    const rentTypeMap = {
                      'monthly': t('common.monthly'),
                      'weekly': t('common.weekly'),
                      'yearly': t('common.yearly'),
                      'daily': t('common.daily')
                    };
                    const rentPeriod = rentTypeMap[rentType] || t('common.monthly');
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
    </>
  );
}
