"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import '@/components/properties/PropertyImageFix.css';
import SplitTextAnimation from "@/components/common/SplitTextAnimation";
import FavoriteButton from "@/components/common/FavoriteButton";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import LocationLoader from "@/components/common/LocationLoader";
import styles from "./Properties.module.css";

export default function Properties({ listings, isLoading, isError }) {
  const [showPhoneNumbers, setShowPhoneNumbers] = useState({});
  const { handleDetailsClick, handleQuickViewClick } = usePropertyActions();

  const togglePhoneNumber = (propertyId) => {
    setShowPhoneNumbers(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }));
  };

  const handleWhatsAppClick = (phoneNumber) => {
    const message = "Hello! I'm interested in this property. Could you please provide more information?";
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Function to get image source from listing
  const getImageSource = (listing) => {
    // Try to get first image from images array
    if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
      const firstImage = listing.images[0];
      return firstImage.url || firstImage || "/images/section/box-house-2.jpg";
    }
    // Fallback to imageNames
    if (listing.imageNames && Array.isArray(listing.imageNames) && listing.imageNames.length > 0) {
      return listing.imageNames[0];
    }
    // Default fallback image
    return "/images/section/box-house-2.jpg";
  };

  if (isLoading) return (
    <section className="section-listing tf-spacing-1">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section text-center">
              <h2 className="title split-text effect-right">
                <SplitTextAnimation text="Today's Luxury Listings" />
              </h2>
              <p className="text-1 split-text split-lines-transform">
                Thousands of luxury home enthusiasts just like you visit our
                website.
              </p>
            </div>
            <div className={styles.loadingContainer}>
              <LocationLoader 
                size="large" 
                message="Loading luxury properties..."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  
  if (isError) return (
    <section className="section-listing tf-spacing-1">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section text-center">
              <h2 className="title split-text effect-right">
                <SplitTextAnimation text="Today's Luxury Listings" />
              </h2>
              <p className="text-1 split-text split-lines-transform">
                Thousands of luxury home enthusiasts just like you visit our
                website.
              </p>
            </div>
            <div className={styles.loadingContainer}>
              <div className={styles.errorText}>
                Something went wrong while loading properties
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  
  // Handle cases where listings might be undefined or have different structure
  const listingsArray = listings?.data || listings || [];
  
  if (!listingsArray || listingsArray.length === 0) {
    return (
      <section className="section-listing tf-spacing-1">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="heading-section text-center">
                <h2 className="title split-text effect-right">
                  <SplitTextAnimation text="Today's  Listings" />
                </h2>
                <p className="text-1 split-text split-lines-transform">
                  Alot of  homes enthusiasts just like you visit our
                  website.
                </p>
              </div>
              <div className={styles.loadingContainer}>
                <div className={styles.emptyText}>
                  No properties available at the moment
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
            <div className="heading-section text-center ">
              <h2 className="title split-text effect-right">
                <SplitTextAnimation text="Today's  Listings" />
              </h2>
              <p className="text-1 split-text split-lines-transform">
                Alot of  homes enthusiasts just like you visit our
                website.
              </p>
            </div>
            
            <div className="tf-layout-mobile-md md-col-2 lg-col-3 gap-15">
              {listingsArray.map((listing, i) => (
                <div key={i}>
      <div className="box-house">
        <div className={`image-wrap ${styles.imageWrap}`}>
          <Link href={`/property-detail/${listing._id}`}>
            <Image
              className={`lazyload ${styles.image}`}
              alt={listing.propertyKeyword || listing.propertyType || 'Property'}
              src={getImageSource(listing)}
              width={600}
              height={280}
              onError={(e) => {
                e.target.src = "/images/section/box-house-2.jpg";
              }}
            />
          </Link>

          <ul className="box-tag flex gap-8">
            {listing.offer && (
              <li className="flat-tag text-4 bg-main fw-6 text_white">
                Featured
              </li>
            )}
            <li 
              className={`flat-tag text-4 fw-6 text_white ${styles.statusBadge} ${
                listing.status?.toLowerCase() === 'rent' ? styles.statusBadgeRent : styles.statusBadgeSale
              }`}
            >
              {listing.status?.toLowerCase() === 'rent' ? 'For Rent' : 'For Sale'}
            </li>
          </ul>

          <div className={styles.favoriteButtonContainer}>
            <FavoriteButton 
              propertyId={listing._id}
              showLabel={false}
            />
          </div>
        </div>

        <div className="content">
          <div className={styles.propertyTypeTitleContainer}>
            {listing.propertyType && (
              <h5 className={`title ${styles.propertyType}`}>
                {listing.propertyType}
              </h5>
            )}
            {listing.propertyKeyword && (
              <h5 className={`title ${styles.titleBadge}`}>
                <Link href={`/property-detail/${listing._id}`} className={styles.titleLink}>
                  {listing.propertyKeyword}
                </Link>
              </h5>
            )}
          </div>

          <p className={`location text-1 line-clamp-1 ${styles.locationText}`}>
            <i className="icon-location" /><span className={styles.locationState}>{listing.state}</span>-{listing.address}
          </p>

          <ul className={`meta-list flex ${styles.metaList}`}>
            <li className="text-1 flex items-center">
              <i className="icon-bed" />
              <span className={styles.metaItemSpan}>{listing.bedrooms}</span>
            </li>
            <li className="text-1 flex items-center">
              <i className="icon-bath" />
              <span className={styles.metaItemSpan}>{listing.bathrooms}</span>
            </li>
            <li className="text-1 flex items-center">
              <i className="icon-sqft" />
              <span className={styles.metaItemSpan}>{listing.size ?? "N/A"}</span> Sqft
            </li>
          </ul>

          {/* Contact Section */}
          <div className={`contact-section ${styles.contactSection}`}>
            <div className="wrap-btn flex">
              <div className={`call-button-container ${styles.callButtonContainer}`}>
                <button 
                  onClick={() => togglePhoneNumber(listing._id)}
                  className={`call flex gap-8 items-center text-1 ${styles.button} ${styles.callButton} ${
                    showPhoneNumbers[listing._id] ? styles.callButtonActive : ''
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06679 2.16708 8.43376 2.48353C8.80073 2.79999 9.04207 3.23945 9.11999 3.72C9.28562 4.68007 9.56648 5.62273 9.95999 6.53C10.0555 6.74431 10.1112 6.97355 10.1241 7.20668C10.137 7.43981 10.1069 7.67342 10.0353 7.896C9.96366 8.11858 9.85182 8.32642 9.70599 8.51L8.08999 10.12C9.51355 12.4885 11.5115 14.4864 13.88 15.91L15.49 14.3C15.6736 14.1542 15.8814 14.0423 16.104 13.9707C16.3266 13.8991 16.5602 13.869 16.7933 13.8819C17.0264 13.8948 17.2557 13.9505 17.47 14.046C18.3773 14.4395 19.3199 14.7204 20.28 14.886C20.7658 14.9656 21.2094 15.2132 21.5265 15.5866C21.8437 15.9601 22.0122 16.4348 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {showPhoneNumbers[listing._id] ? (listing.agentPhone || '+971549967817') : 'Call'}
                </button>
                
                {showPhoneNumbers[listing._id] && (
                  <div className={`phone-options ${styles.phoneOptions}`}>
                    <div className={styles.phoneOptionsContainer}>
                      <button
                        onClick={() => window.open(`tel:${listing.agentPhone || '+971549967817'}`)}
                        className={`${styles.phoneActionButton} ${styles.callActionButton}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06679 2.16708 8.43376 2.48353C8.80073 2.79999 9.04207 3.23945 9.11999 3.72C9.28562 4.68007 9.56648 5.62273 9.95999 6.53C10.0555 6.74431 10.1112 6.97355 10.1241 7.20668C10.137 7.43981 10.1069 7.67342 10.0353 7.896C9.96366 8.11858 9.85182 8.32642 9.70599 8.51L8.08999 10.12C9.51355 12.4885 11.5115 14.4864 13.88 15.91L15.49 14.3C15.6736 14.1542 15.8814 14.0423 16.104 13.9707C16.3266 13.8991 16.5602 13.869 16.7933 13.8819C17.0264 13.8948 17.2557 13.9505 17.47 14.046C18.3773 14.4395 19.3199 14.7204 20.28 14.886C20.7658 14.9656 21.2094 15.2132 21.5265 15.5866C21.8437 15.9601 22.0122 16.4348 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Call
                      </button>
                      <button
                        onClick={() => handleWhatsAppClick(listing.agentPhone || '+971549967817')}
                        className={`${styles.phoneActionButton} ${styles.whatsappActionButton}`}
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
                onClick={() => window.open(`mailto:${listing.agentEmail || 'info@example.com'}?subject=Inquiry about ${listing.propertyType || 'Property'}`)}
                className={`${styles.button} ${styles.emailButton}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Email
              </button>

              {/* Details Button */}
              <button
                onClick={() => handleDetailsClick(listing._id)}
                className={`${styles.button} ${styles.detailsButton}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Details
              </button>
            </div>
          </div>

          {/* Price Section - Full Width */}
          <div className={`price-section ${styles.priceSection}`}>
            <h5 className={`price ${styles.price}`}>
              {(() => {
                const currencySymbols = {
                  'USD': '$',
                  'SYP': 'SYP',
                  'TRY': '₺',
                  'EUR': '€'
                };
                const currency = listing?.currency || 'USD';
                const symbol = currencySymbols[currency] || currency;
                return `${symbol} ${listing?.propertyPrice?.toLocaleString() || '0'}`;
              })()}
            </h5>
            
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
          </div>
        </div>
      </div>
    </section>
  );
}
