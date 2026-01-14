"use client";
import React, { useMemo } from "react";
import { useTranslations, useLocale } from 'next-intl';
import Image from "next/image";
import SplitTextAnimation from "@/components/common/SplitTextAnimation";
import LocationLoader from "@/components/common/LocationLoader";
import { useQuery } from "@tanstack/react-query";
import { cityAPI } from "@/apis/city";
import { useRouter } from "next/navigation";
import styles from "./Cities.module.css";
import { translateCity, getCityTranslationMap } from "@/constants/cityTranslations";

export default function Cities() {
  const router = useRouter();
  const t = useTranslations('homeSections');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  
  // Use new city API - much more efficient than fetching all listings
  const { data: cityStatsResponse, isLoading, isError, error } = useQuery({
    queryKey: ['cities', 'stats', locale],
    queryFn: () => cityAPI.getCityStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  
  // Extract cities data from API response
  const citiesData = useMemo(() => {
    if (!cityStatsResponse?.data?.cities) {
      return [];
      }
      return cityStatsResponse.data.cities;
  }, [cityStatsResponse]);

  // City translation mapping
  const cityTranslationMap = useMemo(() => {
    return getCityTranslationMap(locale);
  }, [locale]);

  // Memoize locations array to prevent recreation on every render
  const locations = useMemo(() => {
    return citiesData
      .sort((a, b) => b.count - a.count) // Sort by count descending
      .slice(0, 9) // Show only top 9 cities
      .map((city, index) => {
        const cityName = city.city || city.displayName;
        return {
          id: index + 1,
          city: translateCity(cityName, locale),
          cityOriginal: cityName, // Keep original for API calls
          properties: `${city.count} ${city.count !== 1 ? tCommon('properties') : tCommon('property')}`,
          imageSrc: city.imageSrc || '/images/cities/Deir ez-zur.jpg',
          alt: translateCity(cityName, locale),
          width: 400,
          height: 350
        };
      });
  }, [citiesData, tCommon, cityTranslationMap, locale]);

  // Handle city button click - scroll to properties and trigger search
  const handleCityClick = (e, cityName, cityOriginal) => {
    e.preventDefault();
    
    // Navigate to property list page with city filter
    // Use original English name for API
    const searchParams = new URLSearchParams();
    searchParams.set('cities', cityOriginal || cityName);
    
    // Route to property list page with city filter
    router.push(`/property-list?${searchParams.toString()}`);
  };

  // Hide section completely if no data or error
  if (isError || locations.length === 0 || !citiesData || citiesData.length === 0) {
    return null;
  }

  // Show loading state only if we're loading and might have data
  if (isLoading) {
    return null; // Hide during loading to avoid showing empty section
  }

  return (
    <>
      <section className={`section-neighborhoods ${styles.heroCitiesSection}`}>
        <div className="tf-container">
          <div className="col-12">
          <div className="heading-section text-center mb-48">
            <h2 className={`title ${styles.headingTitle}`}>
              {t('exploreSyriaCities')}
            </h2>
            <p className={`text-1 split-text split-lines-transform ${styles.headingText}`}>
              {t('exploreSyriaCitiesSubtitle')}
            </p>
          </div>
          <div className="row g-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            {locations.slice(0, 9).map((location) => (
              <div key={location.id} className="col-lg-4 col-md-6 col-sm-6">
                <div 
                  className={`box-location ${styles.cityCard}`}
                  onClick={(e) => handleCityClick(e, location.city, location.cityOriginal)}
                >
                  <div className={`image-wrap position-relative overflow-hidden rounded-3 ${styles.imageWrap}`}>
                    <Image
                      className={styles.cityImage}
                      alt={location.alt}
                      src={location.imageSrc}
                      width={location.width}
                      height={location.height}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className={styles.cityOverlay}></div>
                  </div>
                  <div className={`city-content position-absolute bottom-0 start-0 end-0 p-4 ${styles.cityContent}`}>
                    <h4 className={`text-white mb-3 fw-bold ${styles.cityTitle} ${locale === 'ar' ? styles.cityTitleRtl : styles.cityTitleLtr}`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>{location.city}</h4>
                    <div className="d-flex align-items-center justify-content-between" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                      <span 
                        className={styles.cityCount}
                        onClick={(e) => handleCityClick(e, location.city, location.cityOriginal)}
                      >
                        {location.properties}
                      </span>
               
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
