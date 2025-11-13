"use client";

import React, { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import SplitTextAnimation from "./SplitTextAnimation";
import { listingAPI } from "@/apis/listing";

export default function Categories({
  parentClass = "tf-spacing-1 section-categories pb-0",
  searchParams,
  onSearchChange,
  setCategory
}) {
  // Get all properties for accurate counting (no pagination)
  const { data: allListingsResponse } = useQuery({
    queryKey: ['listings', 'all-count'],
    queryFn: () => listingAPI.searchListings({ limit: 1000 }), // Get all listings for accurate counts
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: false, // Prevent refetch on component mount if data exists
  });
  
  // Memoize listings data to prevent unnecessary re-renders
  // API returns array directly, not wrapped in data property
  const allListings = useMemo(() => {
    // Handle both array response and wrapped response
    if (Array.isArray(allListingsResponse)) {
      return allListingsResponse;
    }
    return allListingsResponse?.data || [];
  }, [allListingsResponse]);

  // Memoize categories calculation to prevent recalculation on every render
  const categories = useMemo(() => {
    const propertyTypes = ['Apartment', 'Villa/farms', 'Office', 'Commercial', 'Land', 'Holiday Home'];
    const icons = ['icon-apartment1', 'icon-villa', 'icon-office1', 'icon-commercial', 'icon-land', 'icon-studio'];
    
    // Debug: Log all property types found in listings
    if (allListings.length > 0) {
      const uniqueTypes = [...new Set(allListings.map(p => p.propertyType))];
      console.log('Categories - Found property types:', uniqueTypes);
      console.log('Categories - Total listings:', allListings.length);
    }
    
    return propertyTypes.map((type, index) => {
      const displayName = type === 'Land' ? 'Land/Plot' : type;
      // Count listings that match the type (case-insensitive and flexible matching)
      const count = allListings.filter(p => {
        if (!p.propertyType) return false;
        const listingType = p.propertyType.trim();
        const searchType = type.trim();
        
        // Exact match
        if (listingType === searchType) return true;
        
        // Case-insensitive match
        if (listingType.toLowerCase() === searchType.toLowerCase()) return true;
        
        // Special handling for Land/Plot
        if (type === 'Land' && (listingType === 'Land' || listingType === 'Land/Plot' || listingType.toLowerCase() === 'land')) {
          return true;
        }
        
        // Special handling for Villa/farms
        if (type === 'Villa/farms' && (listingType.includes('Villa') || listingType.includes('villa') || listingType.includes('Farm') || listingType.includes('farm'))) {
          return true;
        }
        
        // Special handling for Holiday Home
        if (type === 'Holiday Home' && (listingType === 'Holiday Home' || listingType === 'Holiday Homes' || listingType.toLowerCase().includes('holiday'))) {
          return true;
        }
        
        return false;
      }).length;
      
      return {
        name: displayName,
        icon: icons[index],
        count
      };
    });
  }, [allListings]);

  // Memoize category click handler to prevent recreation on every render
  const handleCategoryClick = useCallback((categoryName) => {
    setCategory(categoryName);
    // Map display name to actual property type for API
    const apiPropertyType = categoryName === 'Land/Plot' ? 'Land' : categoryName;
    onSearchChange({ propertyType: apiPropertyType });
  }, [setCategory, onSearchChange]);

  // Memoize swiper breakpoints to prevent recreation
  const swiperBreakpoints = useMemo(() => ({
    0: { slidesPerView: 2, spaceBetween: 20 },
    576: { slidesPerView: 3, spaceBetween: 30 },
    768: { slidesPerView: 4, spaceBetween: 40 },
    1200: { slidesPerView: 6, spaceBetween: 10 },
  }), []);

  return (
    <section className={parentClass}>
      <div className="tf-container">
        <div className="heading-section text-center mb-48">
          <h2 className="title split-text effect-right">
            <SplitTextAnimation text="Try Searching For" />
          </h2>
          <p className="text-1 split-text split-lines-transform">
            Alot of Featured homes enthusiasts just like you have found their
            dream home
          </p>
        </div>

        <div className="wrap-categories-sw">
          <Swiper
            dir="ltr"
            className="swiper sw-layout style-pagination"
            spaceBetween={5}
            slidesPerView="auto"
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={swiperBreakpoints}
            modules={[Autoplay, Pagination]}
            pagination={{ 
              el: ".spd2", 
              clickable: true,
              dynamicBullets: false,
            }}
          >
            {categories.map((category, index) => (
              <SwiperSlide className="swiper-slide" key={index}>
                <button
                  type="button"
                  onClick={() => handleCategoryClick(category.name)}
                  className={`categories-item ${
                    (searchParams.propertyType === category.name || 
                     (category.name === 'Land/Plot' && searchParams.propertyType === 'Land')) ? "active" : ""
                  }`}
                >
                  <div className="icon-box">
                    <i className={`icon ${category.icon}`}></i>
                  </div>
                  <div className="content text-center">
                    <h5 className="category-title-h5">{category.name}</h5>
                    <p className="mt-4 text-1">{category.count} Property</p>
                  </div>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Pagination dots for mobile and tablet */}
          <div 
            className="spd2 pagination-container" 
          />
          
          <style jsx>{`
            .category-title-h5 {
              font-size: 18px !important;
            }
            
            .pagination-container {
              margin-top: 20px !important;
              text-align: center !important;
              display: flex !important;
              justify-content: center !important;
              gap: 8px !important;
            }
            
            .categories-item {
              width: 180px !important;
              min-width: 180px !important;
              max-width: 180px !important;
            }
            
            /* Orange pagination styling */
            .spd2 .swiper-pagination-bullet {
              width: 12px !important;
              height: 12px !important;
              background: #e5e7eb !important;
              opacity: 1 !important;
              margin: 0 4px !important;
              transition: all 0.3s ease !important;
              border-radius: 50% !important;
            }
            
            .spd2 .swiper-pagination-bullet-active {
              background: #f1913d !important;
              transform: scale(1.2) !important;
            }
            
            .spd2 .swiper-pagination-bullet-active-main {
              background: #f1913d !important;
              transform: scale(1.2) !important;
            }
            
            /* Additional overrides for all possible Swiper pagination classes */
            .spd2 .swiper-pagination-bullet-active-main,
            .spd2 .swiper-pagination-bullet-active,
            .spd2 .swiper-pagination-bullet-active-prev,
            .spd2 .swiper-pagination-bullet-active-next {
              background: #f1913d !important;
              background-color: #f1913d !important;
              transform: scale(1.2) !important;
            }
            
            /* Global Swiper pagination override */
            .swiper-pagination-bullet-active {
              background: #f1913d !important;
              background-color: #f1913d !important;
            }
            
            .swiper-pagination-bullet-active-main {
              background: #f1913d !important;
              background-color: #f1913d !important;
            }
            
            .spd2 .swiper-pagination-bullet:hover {
              background: #f1913d !important;
              opacity: 0.7 !important;
            }
            
            @media (min-width: 992px) {
              .spd2 {
                display: none !important;
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
