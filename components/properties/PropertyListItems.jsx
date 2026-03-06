"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { translateKeywordsString } from "@/utils/translateKeywords";
import FavoriteButton from "../common/FavoriteButton";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import "./PropertyImageFix.css";
import styles from "./PropertyListItems.module.css";
import { translateCity } from "@/constants/cityTranslations";
import LocationTooltip from "../common/LocationTooltip";
import { formatPriceWithCurrency } from "@/utlis/propertyHelpers";

export default function PropertyListItems({ listings = [], isAISearch = false, hasActiveSearch = false }) {
  const t = useTranslations();
  const tAgent = useTranslations('agent.addProperty');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  
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
  const { handleDetailsClick, handleQuickViewClick } = usePropertyActions();
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const didSwipeRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  if (!listings || listings.length === 0) {
    // Case 1: No active search/filters - show "no listings to show" message
    if (!hasActiveSearch) {
      return (
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyIcon}>🏠</div>
          <h3 className={styles.emptyTitle}>
            {locale === 'ar' 
              ? 'لا توجد إعلانات للعرض' 
              : 'There are no listings to show'}
          </h3>
          <div className={styles.emptyMessageBox}>
            <p className={styles.emptyMessageText}>
              {locale === 'ar' 
                ? 'لا توجد إعلانات متاحة حالياً. يرجى المحاولة لاحقاً.' 
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

  const handleImageTouchStart = (e) => {
    if (!isMobile) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleImageTouchEnd = (e, propertyId, totalImages, onPrev, onNext) => {
    if (!isMobile || totalImages <= 1) return;
    const endX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - endX;
    const threshold = 50;
    if (deltaX > threshold) {
      didSwipeRef.current = true;
      e.preventDefault();
      e.stopPropagation();
      onNext();
    } else if (deltaX < -threshold) {
      didSwipeRef.current = true;
      e.preventDefault();
      e.stopPropagation();
      onPrev();
    }
  };

  const handleImageAreaClick = (e) => {
    if (didSwipeRef.current) {
      e.preventDefault();
      didSwipeRef.current = false;
    }
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
      <style jsx>{`
        .empty-state-container {
          grid-column: 1 / -1 !important;
          text-align: center !important;
          padding: 40px !important;
          color: #666 !important;
        }
        
        .property-img {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          display: block !important;
        }
        
        .image-wrap {
          position: relative !important;
          width: 100% !important;
          aspect-ratio: 3 / 2 !important;
          overflow: hidden !important;
          background: #f3f4f6 !important;
          border-radius: 12px !important;
        }

        .image-slider {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
        }

        .image-link {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          position: relative !important;
        }

        .slider-control {
          position: absolute !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          width: 38px !important;
          height: 38px !important;
          border-radius: 9999px !important;
          border: 1px solid rgba(148, 163, 184, 0.4) !important;
          background: rgba(255, 255, 255, 0.95) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          z-index: 5 !important;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15) !important;
          color: #1f2937 !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        .image-wrap:hover .slider-control,
        .image-slider:focus-within .slider-control {
          opacity: 1 !important;
          pointer-events: auto !important;
        }

        .slider-control:hover {
          transform: translateY(-50%) scale(1.03) !important;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.18) !important;
        }

        .slider-control:focus-visible {
          outline: 2px solid #0ea5e9 !important;
          outline-offset: 2px !important;
        }

        @media (max-width: 768px) {
          .show-arrows-mobile .slider-control {
            opacity: 1 !important;
            pointer-events: auto !important;
          }
        }

        .slider-control.prev {
          left: 12px !important;
          width: 26px !important;
          height: 26px !important;
        }

        .slider-control.next {
          right: 12px !important;
          width: 26px !important;
          height: 26px !important;
        }

        .slider-control svg {
          width: 18px !important;
          height: 18px !important;
        }

        .favorite-floating {
          position: absolute !important;
          right: 16px !important;
          bottom: 16px !important;
          z-index: 6 !important;
        }

        .favorite-floating :global(.favorite-button) {
          width: 44px !important;
          height: 44px !important;
          border-radius: 9999px !important;
          background: transparent !important;
          border: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: none !important;
          transition: transform 0.2s ease !important;
        }
        
        .favorite-floating :global(.favorite-button:hover) {
          transform: translateY(-2px) !important;
        }

        .favorite-floating :global(.favorite-button:active) {
          transform: translateY(0) !important;
        }

        .favorite-floating :global(.favorite-icon) {
          width: 32px !important;
          height: 32px !important;
          color: #f1913d !important;
        }

        .favorite-floating :global(.favorite-icon::before) {
          color: #f1913d !important;
          transition: color 0.2s ease !important;
        }

        .favorite-floating :global(.favorite-icon.favorite-icon-favorited),
        .favorite-floating :global(.favorite-icon.favorite-icon-favorited::before) {
          color: #f1913d !important;
        }

        .slider-dots {
          position: absolute !important;
          left: 50% !important;
          bottom: 14px !important;
          transform: translateX(-50%) !important;
          display: flex !important;
          gap: 6px !important;
          padding: 6px 12px !important;
          border-radius: 9999px !important;
          background: rgba(15, 23, 42, 0.45) !important;
          backdrop-filter: blur(6px) !important;
          z-index: 4 !important;
        }

        .slider-dot {
          width: 8px !important;
          height: 8px !important;
          border-radius: 9999px !important;
          border: none !important;
          background: rgba(255, 255, 255, 0.6) !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        .slider-dot.active {
          width: 20px !important;
          background: #f1913d !important;
        }

        .slider-dot:focus-visible {
          outline: 2px solid #0ea5e9 !important;
          outline-offset: 2px !important;
        }

        .image-fallback {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background-color: #f5f5f5 !important;
          display: none !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 12px !important;
          color: #999 !important;
          font-size: 14px !important;
        }
        
        .sr-only {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }

        .holiday-badge {
          background: linear-gradient(135deg, #3b82f6, #60a5fa) !important;
          border: 2px solid #2563eb !important;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3) !important;
        }
        
        .details-btn-bordered {
          background: none !important;
          border: 1px solid #F97316 !important;
          color: #F97316 !important;
          cursor: pointer !important;
        }
      `}</style>
      {listings.map((property) => {
        const imageUrls = extractImageUrls(property);
        const totalImages = imageUrls.length;
        const currentIndex = activeImageIndex[property._id] ?? 0;
        const safeIndex = Math.min(currentIndex, totalImages - 1);
        const activeImage = imageUrls[safeIndex] || imageUrls[0];

        return (
          <div key={property._id} className="box-house style-list hover-img property-list-image-fix">
          <div className="image-wrap">
            {(property.isVip || property.isFeatured) && (
              <span
                style={{
                  position: 'absolute',
                  top: '10px',
                  ...(locale === 'ar' ? { left: '10px', right: 'auto' } : { right: '10px', left: 'auto' }),
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  ...(property.isVip ? { padding: '6px 12px', width: 'auto', minHeight: '32px', borderRadius: '9999px' } : { width: '32px', height: '32px', borderRadius: '50%' }),
                  backgroundColor: 'rgba(0,0,0,0.35)',
                  color: property.isVip ? '#f97316' : '#f0b429',
                  fontSize: property.isVip ? '13px' : undefined,
                  fontWeight: property.isVip ? 700 : undefined,
                }}
                title={property.isVip ? 'VIP' : (locale === 'ar' ? 'مميز' : 'Featured')}
                aria-hidden="true"
              >
                {property.isVip ? (
                  <>
                    <span>VIP</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 8L6 20H18L20 8M4 8L5.71624 9.37299C6.83218 10.2657 7.39014 10.7121 7.95256 10.7814C8.4453 10.8421 8.94299 10.7173 9.34885 10.4314C9.81211 10.1051 10.0936 9.4483 10.6565 8.13476L12 5M4 8C4.55228 8 5 7.55228 5 7C5 6.44772 4.55228 6 4 6C3.44772 6 3 6.44772 3 7C3 7.55228 3.44772 8 4 8ZM20 8L18.2838 9.373C17.1678 10.2657 16.6099 10.7121 16.0474 10.7814C15.5547 10.8421 15.057 10.7173 14.6511 10.4314C14.1879 10.1051 13.9064 9.4483 13.3435 8.13476L12 5M20 8C20.5523 8 21 7.55228 21 7C21 6.44772 20.5523 6 20 6C19.4477 6 19 6.44772 19 7C19 7.55228 19.4477 8 20 8ZM12 5C12.5523 5 13 4.55228 13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4C11 4.55228 11.4477 5 12 5ZM12 4H12.01M20 7H20.01M4 7H4.01" />
                    </svg>
                  </>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                )}
              </span>
            )}
            <div
              className={`image-slider${isMobile && totalImages > 1 ? ' show-arrows-mobile' : ''}`}
              onTouchStart={handleImageTouchStart}
              onTouchEnd={(e) => handleImageTouchEnd(e, property._id, totalImages, () => handlePrevImage(property._id, totalImages), () => handleNextImage(property._id, totalImages))}
            >
              <Link
                href={`/property-detail/${property._id}`}
                className="image-link"
                onClick={handleImageAreaClick}
              >
              <Image
                className="lazyload property-img"
                alt={property.propertyKeyword || property.propertyTitle || t('common.property')}
                src={activeImage}
                width={600}
                height={401}
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'flex';
                  }
                }}
              />
              <div className="image-fallback">
                No Image
              </div>
            </Link>
            {totalImages > 1 && (
              <>
                <button
                  type="button"
                  className="slider-control prev"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handlePrevImage(property._id, totalImages);
                  }}
                  aria-label="View previous image"
                >
                  <span className="sr-only">Previous image</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="slider-control next"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleNextImage(property._id, totalImages);
                  }}
                  aria-label="View next image"
                >
                  <span className="sr-only">Next image</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </button>
                <div className="slider-dots">
                  {imageUrls.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      type="button"
                      className={`slider-dot${dotIndex === safeIndex ? ' active' : ''}`}
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
            <span
              className="watermark-logo"
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                zIndex: 10,
                pointerEvents: 'none',
                opacity: 0.85,
                display: 'block',
              }}
              aria-hidden="true"
            >
              <img className="watermark-logo-img" src="/images/logo/Logo-32x32.png" alt="Aqaar Gate" width={140} height={140} style={{ display: 'block', maxHeight: '140px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
            </span>
            <ul className="box-tag flex gap-8">
              {property.propertyType === 'Holiday Homes' && (
                <li className="flat-tag text-4 fw-6 text_white holiday-badge">
                  🏖️ {t('common.holidayHome')}
                </li>
              )}
              {property.offer && (
                <li className="flat-tag text-4 bg-main fw-6 text_white">
                  Special Offer
                </li>
              )}
              <li 
                className="flat-tag text-4 fw-6 text_white"
                style={{
                  backgroundColor: (() => {
                    const statusToCheck = property.statusOriginal || property.status || '';
                    const statusLower = statusToCheck.toLowerCase().trim();
                    return statusLower === 'rent' || statusLower === 'for rent' || statusLower.includes('rent') || statusToCheck.includes('إيجار') || statusToCheck.includes('للإيجار');
                  })() ? '#3b82f6' : '#10b981',
                  color: 'white'
                }}
              >
                {(() => {
                  const statusToCheck = property.statusOriginal || property.status || '';
                  const statusLower = statusToCheck.toLowerCase().trim();
                  const isRent = statusLower === 'rent' || statusLower === 'for rent' || statusLower.includes('rent') || statusToCheck.includes('إيجار') || statusToCheck.includes('للإيجار');
                  return isRent ? t('common.forRent') : t('common.forSale');
                })()}
              </li>
              {property.isAgentBlocked && (
                <li className="flat-tag text-4 fw-6 text_white" style={{ backgroundColor: '#dc2626', color: 'white' }}>
                  Blocked Agent
                </li>
              )}
            </ul>
            <div className="favorite-floating">
              <FavoriteButton
                propertyId={property._id}
                showLabel={false}
                iconClassName="icon-heart-1"
              />
            </div>
          </div>
          <div className="content">
            <h5 className="title">
              <Link href={`/property-detail/${property._id}`}>
                {property.propertyTitle || 'Property'}
              </Link>
            </h5>
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
              <LocationTooltip location={translateCity(property.city || property.state || property.location || 'Location not specified', locale)}>
                {translateCity(property.city || property.state || property.location || 'Location not specified', locale)}
              </LocationTooltip>
            </p>
            <ul className="meta-list flex" style={{ gap: '24px' }}>
              {property.bedrooms != null && Number(property.bedrooms) > 0 && (
                <li className="text-1 flex items-center">
                  <i className="icon-bed" style={{ margin: '0 2px' }} />
                  <span>{property.bedrooms}</span>
                </li>
              )}
              {property.bathrooms != null && Number(property.bathrooms) > 0 && (
                <li className="text-1 flex items-center">
                  <i className="icon-bath" style={{ margin: '0 2px' }} />
                  <span>{property.bathrooms}</span>
                </li>
              )}
              <li className="text-1 flex items-center">
                <i className="icon-sqft" style={{ margin: '0 2px' }} />
                <span>{property.size || 0}</span> {getSizeUnitLabel(property.sizeUnit)}
              </li>
            </ul>
            <div className="bot flex justify-between items-center">
              <div>
                <h5 className="price">
                  {(() => {
                    const basePrice = formatPriceWithCurrency(property.propertyPrice, property?.currency);
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
              <div className="wrap-btn flex">
                <button
                  onClick={() => handleDetailsClick(property._id)}
                  className="tf-btn style-border pd-4 details-btn-bordered"
                >
                  {t('common.details')}
                </button>
              </div>
            </div>
          </div>
        </div>
        );
      })}
    </>
  );
}
