"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useTranslations } from 'next-intl';
import { translateKeywordsString } from "@/utils/translateKeywords";
import FavoriteButton from "../common/FavoriteButton";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import "./PropertyImageFix.css";
import styles from "./PropertyGridItems.module.css";
import logger from "@/utlis/logger";

export default function PropertyGridItems({ listings = [] }) {
  const t = useTranslations();
  const tCommon = useTranslations('common');
  const [showPhoneNumbers, setShowPhoneNumbers] = useState({});
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const { handleDetailsClick, handleQuickViewClick } = usePropertyActions();

  const togglePhoneNumber = (propertyId) => {
    setShowPhoneNumbers((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
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
    const message = "Hello! I'm interested in this property. Could you please provide more information?";
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!listings || listings.length === 0) {
    return (
      <div className="empty-state-container">
        <p>{t('common.noPropertiesFound')}</p>
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
          bottom: 12px !important;
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
        
        .holiday-badge {
          background: linear-gradient(135deg, #3b82f6, #60a5fa) !important;
          border: 2px solid #2563eb !important;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3) !important;
        }
        
        .contact-section {
          margin-bottom: 16px !important;
        }
        
        .call-button-container {
          position: relative !important;
        }
        
        .action-button {
          background: white !important;
          border: 1px solid #F97316 !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          color: #F97316 !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          transition: all 0.2s ease !important;
          min-width: 120px !important;
          justify-content: center !important;
        }
        
        .action-button:hover {
          background: #F97316 !important;
          color: white !important;
        }
        
        .action-button-primary {
          background: #F97316 !important;
          color: white !important;
          border: none !important;
        }
        
        .action-button-primary:hover {
          background: #EA580C !important;
        }
        
        .phone-options {
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          right: 0 !important;
          background-color: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          padding: 8px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          z-index: 10 !important;
          margin-top: 4px !important;
        }
        
        .phone-options-row {
          display: flex !important;
          gap: 6px !important;
        }
        
        .phone-action-btn {
          flex: 1 !important;
          background: #10b981 !important;
          color: white !important;
          border: none !important;
          border-radius: 6px !important;
          padding: 6px 10px !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 4px !important;
        }
        
        .whatsapp-btn {
          background: #25D366 !important;
        }
        
        .price-section {
          width: 100% !important;
          text-align: center !important;
          padding: 12px 0 !important;
          border-top: 1px solid #e5e7eb !important;
        }
        
        .price-section .price {
          font-size: 18px !important;
          font-weight: 600 !important;
          color: #374151 !important;
          margin: 0 !important;
        }
      `}</style>
      {listings.map((property) => {
        const imageUrls = extractImageUrls(property);
        const totalImages = imageUrls.length;
        const currentIndex = activeImageIndex[property._id] ?? 0;
        const safeIndex = Math.min(currentIndex, totalImages - 1);
        const activeImage = imageUrls[safeIndex] || imageUrls[0];

        return (
          <div className="box-house hover-img property-image-fix" key={property._id}>
          <div className="image-wrap">
            <div className="image-slider">
              <Link href={`/property-detail/${property._id}`} className="image-link">
              <Image
                className="lazyload property-img"
                alt={ property.propertyTitle || t('common.property')}
                src={activeImage}
                width={339}
                height={245}
                onError={(e) => {
                  logger.warn('Image failed to load:', e.target.src);
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
                  className={`flat-tag text-4 fw-6 text_white ${styles.statusBadge} ${
                    property.status?.toLowerCase() === 'rent' ? styles.statusBadgeRent : styles.statusBadgeSale
                  }`}
                >
                  {property.status?.toLowerCase() === 'rent' ? t('common.forRent') : t('common.forSale')}
                </li>
                {property.isAgentBlocked && (
                  <li className={`flat-tag text-4 fw-6 text_white ${styles.blockedAgentBadge}`}>
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
                <p className={`title`} style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280',margin:'16px auto' }}>
                  {property.propertyTitle || t('common.property')}
                </p>
              )}
            </div>
  
            <p className={`location text-1 flex items-center gap-6 ${styles.locationText}`}>
              <i className="icon-location" /> <span className={styles.locationContent}><span className={styles.locationState}>{property.state}</span>-{property.address || 'Location not specified'}</span>
            </p>
            <ul className={`meta-list flex ${styles.metaList}`}>
              <li className="text-1 flex items-center">
                <i className="icon-bed" />
                <span className={styles.metaItemSpan}>{property.bedrooms || 0}</span>
              </li>
              <li className="text-1 flex items-center">
                <i className="icon-bath" />
                <span className={styles.metaItemSpan}>{property.bathrooms || 0}</span>
              </li>
              <li className="text-1 flex items-center">
                <i className="icon-sqft" />
                <span className={styles.metaItemSpan}>{property.size || 0}</span> Sqft
              </li>
            </ul>
            {/* Contact Section */}
            <div className="contact-section">
              <div className="wrap-btn flex">
                <div className="call-button-container">
                  <button 
                    onClick={() => togglePhoneNumber(property._id)}
                    className="call flex gap-8 items-center text-1 action-button"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06679 2.16708 8.43376 2.48353C8.80073 2.79999 9.04207 3.23945 9.11999 3.72C9.28562 4.68007 9.56648 5.62273 9.95999 6.53C10.0555 6.74431 10.1112 6.97355 10.1241 7.20668C10.137 7.43981 10.1069 7.67342 10.0353 7.896C9.96366 8.11858 9.85182 8.32642 9.70599 8.51L8.08999 10.12C9.51355 12.4885 11.5115 14.4864 13.88 15.91L15.49 14.3C15.6736 14.1542 15.8814 14.0423 16.104 13.9707C16.3266 13.8991 16.5602 13.869 16.7933 13.8819C17.0264 13.8948 17.2557 13.9505 17.47 14.046C18.3773 14.4395 19.3199 14.7204 20.28 14.886C20.7658 14.9656 21.2094 15.2132 21.5265 15.5866C21.8437 15.9601 22.0122 16.4348 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {showPhoneNumbers[property._id] ? (property.agentPhone || '+971549967817') : t('common.call')}
                  </button>
                  
                  {showPhoneNumbers[property._id] && (
                    <div className="phone-options">
                      <div className="phone-options-row">
                        <button
                          className="phone-action-btn"
                          onClick={() => window.open(`tel:${property.agentPhone || '+971549967817'}`)}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06679 2.16708 8.43376 2.48353C8.80073 2.79999 9.04207 3.23945 9.11999 3.72C9.28562 4.68007 9.56648 5.62273 9.95999 6.53C10.0555 6.74431 10.1112 6.97355 10.1241 7.20668C10.137 7.43981 10.1069 7.67342 10.0353 7.896C9.96366 8.11858 9.85182 8.32642 9.70599 8.51L8.08999 10.12C9.51355 12.4885 11.5115 14.4864 13.88 15.91L15.49 14.3C15.6736 14.1542 15.8814 14.0423 16.104 13.9707C16.3266 13.8991 16.5602 13.869 16.7933 13.8819C17.0264 13.8948 17.2557 13.9505 17.47 14.046C18.3773 14.4395 19.3199 14.7204 20.28 14.886C20.7658 14.9656 21.2094 15.2132 21.5265 15.5866C21.8437 15.9601 22.0122 16.4348 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {t('common.call')}
                        </button>
                        <button
                          className="phone-action-btn whatsapp-btn"
                          onClick={() => handleWhatsAppClick(property.agentPhone || '+971549967817')}
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
                  className="action-button"
                  onClick={() => window.open(`mailto:${property.agentEmail || 'info@example.com'}?subject=Inquiry about ${property.propertyTitle || t('common.property')}`)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t('common.email')}
                </button>

                {/* Details Button */}
                <button
                  className="action-button action-button-primary"
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
            <div className="price-section">
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
                  return `${symbol} ${property.propertyPrice?.toLocaleString() || '0'}`;
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
