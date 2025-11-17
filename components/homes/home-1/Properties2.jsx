"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import SplitTextAnimation from "@/components/common/SplitTextAnimation";
import LocationLoader from "@/components/common/LocationLoader";
import { useSearchListings } from "@/apis/hooks";
import FavoriteButton from "@/components/common/FavoriteButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import styles from "./Properties2.module.css";

export default function Properties2() {
  // Use search endpoint to get ONLY Holiday Home properties
  const { data: searchResponse, isLoading, isError, error } = useSearchListings({ 
    propertyType: 'Holiday Home', // ONLY show Holiday Homes
    limit: 12, // Only get 12 properties for home page
    sort: 'newest' // Get newest properties
  });
  // API returns array directly, not wrapped in data property
  const listings = (() => {
    // Handle both array response and wrapped response
    if (Array.isArray(searchResponse)) {
      return searchResponse;
    }
    return searchResponse?.data || [];
  })();

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
    
    // Return default image
    return "/images/section/box-house-2.jpg";
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
                  Holiday Homes Listings
                </h2>
                <p className="text-1 split-text split-lines-transform">
                  Discover your perfect holiday retreat from our curated collection of vacation homes and rental properties.
                </p>
              </div>
              <div style={{ padding: '40px 20px' }}>
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
                  Holiday Homes Listings
                </h2>
                <p className="text-1 split-text split-lines-transform">
                  Discover your perfect holiday retreat from our curated collection of vacation homes and rental properties.
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
                  Holiday Homes Listings
                </h2>
                <p className="text-1 split-text split-lines-transform">
                  Discover your perfect holiday retreat from our curated collection of vacation homes and rental properties.
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
                Holiday Homes Listings
              </h2>
              <p className="text-1 split-text split-lines-transform">
                Discover your perfect holiday retreat from our curated collection of vacation homes and rental properties.
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
                  return (
                  <SwiperSlide key={property._id}>
                    <div className={`${styles.propertyCard}`}>
                      {/* Left Image Section - 300px x 220px */}
                      <div className={styles.leftSection}>
                        <div className={styles.imageSection}>
                          <Link href={`/property-detail/${property._id}`}>
                            <Image
                              className="lazyload property-image-cover"
                              alt={property.propertyKeyword || property.propertyType || "Property"}
                              src={imageSrc || "/images/section/box-house-2.jpg"}
                              fill
                              sizes="(max-width: 768px) 100vw, 370px"
                              onError={(e) => {
                                e.currentTarget.src = "/images/section/box-house-2.jpg";
                              }}
                              style={{ objectFit: "cover" }}
                            />
                          </Link>
                          
                          {/* Badges */}
                          <div className={styles.badges}>
                            <span className={styles.badgeRent}>
                              For Rent
                            </span>
                            <span className={styles.badgeHoliday}>
                              🏖️ Holiday Home
                            </span>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className={styles.actionButtons}>
                            <FavoriteButton propertyId={property._id} showLabel={false} />
                          </div>
                        </div>
                        
                        {/* Title and Location below image */}
                        <div className={styles.titleSection}>
                          <h6 className={styles.propertyTitle}>
                            {property.propertyKeyword || property.propertyType || 'Property'}
                          </h6>
                          <p className={styles.propertyLocation}>
                            <i className="icon-location" />
                            {property.address}, {property.state}
                          </p>
                        </div>
                        
                        {/* Price and Details below text */}
                        <div className={styles.priceDetailsSection}>
                          <div className={styles.price}>
                            ${property.propertyPrice?.toLocaleString() || '0'}
                          </div>
                          <Link href={`/property-detail/${property._id}`} className={styles.detailsBtn}>
                            Details
                          </Link>
                        </div>
                      </div>
                      
                      {/* Right Content Section */}
                      <div className={styles.contentSection}>
                        
                        {/* Details Grid */}
                        <div className={styles.detailsSection}>
                          <div className={styles.detailsGrid}>
                            <div className={styles.detailItem}>
                              <i className="icon-bed" />
                              <span>Beds <strong>{property.bedrooms}</strong></span>
                            </div>
                            <div className={styles.detailItem}>
                              <i className="icon-bath" />
                              <span>Baths <strong>{property.bathrooms}</strong></span>
                            </div>
                            <div className={styles.detailItem}>
                              <i className="icon-sqft" />
                              <span>Sqft <strong>{property.size}</strong></span>
                            </div>
                            <div className={styles.detailItem}>
                              <i className="icon-garage" />
                              <span>Garage <strong>{property.garages ? 'Yes' : 'No'}</strong></span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons - Tab Style */}
                        <div className={styles.actionButtonsSection}>
                          <p className="contact-agent-title" style={{fontWeight:'bold',fontStyle:'oblique',fontSize:'12px'}}>Contact Agent</p>
                          <div className={styles.actionButtonsVertical} style={{ marginTop: '4px',fontWeight: '600' }}>
                            <button 
                              className={`${styles.actionTab} ${styles.callTab}`}
                              onClick={() => {
                                if (property.agentNumber) {
                                  window.open(`tel:${property.agentNumber}`, '_self');
                                } else {
                                  alert('Phone number not available');
                                }
                              }}
                            >
                              <i className="icon-phone-1" />
                              <span className="phone-number-text"><strong>+963949112178</strong></span>
                            </button>
                            <button 
                              className={`${styles.actionTab} ${styles.emailTab}`}
                              onClick={() => {
                                if (property.agentEmail) {
                                  window.open(`mailto:${property.agentEmail}`, '_self');
                                } else {
                                  alert('Email not available');
                                }
                              }}
                            >
                              <i className="icon-mail" />
                              <span><strong>Agent</strong></span>
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
