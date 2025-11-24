"use client";

import React, { useMemo, useCallback } from "react";
import { useTranslations } from 'next-intl';
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import SplitTextAnimation from "./SplitTextAnimation";
import LocationLoader from "./LocationLoader";
import { categoryAPI } from "@/apis/category";

export default function Categories({
  parentClass = "tf-spacing-1 section-categories pb-0",
  searchParams,
  onSearchChange,
  setCategory
}) {
  const t = useTranslations('homeSections');
  
  // Use new category API - much more efficient than fetching all listings
  const { data: categoryStatsResponse, isLoading, isError, error } = useQuery({
    queryKey: ['categories', 'stats'],
    queryFn: () => categoryAPI.getCategoryStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  
  // Extract categories data from API response
  const categoriesData = useMemo(() => {
    if (!categoryStatsResponse?.data?.categories) {
      // Log for debugging
      return [];
    }
    return categoryStatsResponse.data.categories;
  }, [categoryStatsResponse]);
  

  // Memoize categories with icons and formatting
  const categories = useMemo(() => {
    const icons = ['icon-apartment1', 'icon-villa', 'icon-office1', 'icon-commercial', 'icon-land', 'icon-studio'];
    
    return categoriesData.map((category, index) => ({
      name: category.name,
      displayName: category.displayName || category.name,
      count: category.count || 0,
      slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-'),
      icon: icons[index] || 'icon-apartment1'
    }));
  }, [categoriesData]);

  // Memoize category click handler to prevent recreation on every render
  const handleCategoryClick = useCallback((category) => {
    setCategory(category.name);
    // Use the actual property type name from API
    onSearchChange({ propertyType: category.name });
  }, [setCategory, onSearchChange]);

  // Memoize swiper breakpoints to prevent recreation
  const swiperBreakpoints = useMemo(() => ({
    0: { slidesPerView: 2, spaceBetween: 20 },
    576: { slidesPerView: 3, spaceBetween: 30 },
    768: { slidesPerView: 4, spaceBetween: 40 },
    1200: { slidesPerView: 6, spaceBetween: 10 },
  }), []);

  // Show loading state with spinner
  if (isLoading) {
    return (
      <section className={parentClass}>
        <div className="tf-container">
          <div className="heading-section text-center mb-48">
            <h2 className="title split-text effect-right">
              <SplitTextAnimation text={t('trySearchingFor')} />
            </h2>
            <p className="text-1 split-text split-lines-transform">
              {t('trySearchingForSubtitle')}
            </p>
          </div>
          <div style={{ padding: '40px 20px' }}>
            <LocationLoader size="medium" message="Loading categories..." />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={parentClass}>
      <div className="tf-container">
        <div className="heading-section text-center mb-48">
          <h2 className="title split-text effect-right">
            {t('trySearchingFor')}
          </h2>
          <p className="text-1 split-text split-lines-transform">
            {t('trySearchingForSubtitle')}
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
            {categories.length === 0 ? (
              <SwiperSlide className="swiper-slide">
                <div className="text-center p-4">No categories available</div>
              </SwiperSlide>
            ) : (
              categories.map((category, index) => (
                <SwiperSlide className="swiper-slide" key={index}>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(category)}
                    disabled={isLoading}
                    className={`categories-item ${
                      (searchParams.propertyType === category.name || 
                       (category.displayName === 'Land/Plot' && searchParams.propertyType === 'Land')) ? "active" : ""
                    }`}
                  >
                    <div className="icon-box">
                      <i className={`icon ${category.icon}`}></i>
                    </div>
                    <div className="content text-center">
                      <h5 className="category-title-h5">{category.displayName}</h5>
                      <p className="mt-4 text-1">{category.count} Property{category.count !== 1 ? 's' : ''}</p>
                    </div>
                  </button>
                </SwiperSlide>
              ))
            )}
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
