"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { translateKeywordsString } from "@/utils/translateKeywords";
import FavoriteButton from "../common/FavoriteButton";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import "./PropertyImageFix.css";

export default function PropertyListItems({ listings = [] }) {
  const t = useTranslations();
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { handleDetailsClick, handleQuickViewClick } = usePropertyActions();
  const [activeImageIndex, setActiveImageIndex] = useState({});
  if (!listings || listings.length === 0) {
    return (
      <div className="empty-state-container">
        <p>No properties found matching your criteria.</p>
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

    if (uniqueUrls.length === 0) {
      uniqueUrls.push('/images/section/box-house-2.jpg');
    }

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
            <div className="image-slider">
              <Link href={`/property-detail/${property._id}`} className="image-link">
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
              <i className="icon-location" /> {property.state || property.location || 'Location not specified'}
            </p>
            <ul className="meta-list flex" style={{ gap: '24px' }}>
              <li className="text-1 flex items-center">
                <i className="icon-bed" />
                <span style={{ marginLeft: '4px' }}>{property.bedrooms || 0}</span>
              </li>
              <li className="text-1 flex items-center">
                <i className="icon-bath" />
                <span style={{ marginLeft: '4px' }}>{property.bathrooms || 0}</span>
              </li>
              <li className="text-1 flex items-center">
                <i className="icon-sqft" />
                <span style={{ marginLeft: '4px' }}>{property.size || 0}</span> Sqft
              </li>
            </ul>
            <div className="bot flex justify-between items-center">
              <div>
                <h5 className="price">
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
                      return `${symbol}0`;
                    }
                    // Use toLocaleString only for formatting, not for rounding
                    const basePrice = `${symbol}${exactPrice.toLocaleString('en-US', { maximumFractionDigits: 0, useGrouping: true })}`;
                    
                    // Add rent period for rental properties
                    const statusToCheck = property?.statusOriginal || property?.status || '';
                    const statusLower = statusToCheck.toLowerCase().trim();
                    const isRent = statusLower === 'rent' || statusLower === 'for rent' || statusLower.includes('rent') || statusToCheck.includes('إيجار') || statusToCheck.includes('للإيجار');
                    if (isRent && property?.rentType) {
                      const rentTypeMap = {
                        'monthly': t('common.monthly'),
                        'weekly': t('common.weekly'),
                        'yearly': t('common.yearly'),
                        'one-year': t('common.oneYear'),
                        'three-month': t('common.threeMonth'),
                        'six-month': t('common.sixMonth')
                      };
                      const rentPeriod = rentTypeMap[property.rentType] || t('common.monthly');
                      return `${basePrice} ${rentPeriod}`;
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
