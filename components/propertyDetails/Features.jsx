"use client";
import React, { useMemo } from "react";
import { useTranslations, useLocale } from 'next-intl';

export default function Features({ property }) {
  const t = useTranslations('propertyDetail');
  const tAmenities = useTranslations(); // Use root namespace for amenities
  const locale = useLocale();
  // Get amenities from property data or use empty array as fallback
  const amenities = property?.amenities || [];

  // Create translation map - convert amenity names to camelCase keys
  // This map is rebuilt when locale changes
  const translationMap = useMemo(() => {
    const map = {};
    const amenityList = [
      'Solar energy system',
      'Star link internet',
      'Fiber internet',
      'Basic internet',
      'Parking',
      'Lift',
      'A/C',
      'Gym',
      'Security cameras',
      'Reception (nator)',
      'Balcony',
      'Swimming pool',
      'Fire alarms'
    ];

    amenityList.forEach(amenity => {
      // Convert to camelCase
      const camelCaseKey = amenity
        .toLowerCase()
        .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
        .replace(/\s/g, '')
        .replace(/[()]/g, '')
        .replace(/nator/g, 'Nator')
        .replace(/a\/c/gi, 'ac');
      
      // Use root namespace - amenities are at root level, not under propertyDetail
      const key = `amenities.${camelCaseKey}`;
      let translation;
      
      try {
        translation = tAmenities(key);
      } catch (e) {
        // Skip if translation fails
        return;
      }
      
      // Store translation ONLY if it's valid (not the key itself and not a key pattern)
      // next-intl returns the key if translation not found
      if (translation && 
          typeof translation === 'string' &&
          translation !== key &&
          translation !== `amenities.${camelCaseKey}` &&
          !translation.startsWith('amenities.') &&
          translation.length > 0) {
        map[amenity] = translation;
      }
    });

    return map;
  }, [tAmenities, locale]);

  // Function to translate amenity name
  // Works for both English and Arabic
  const translateAmenity = (amenity) => {
    if (!amenity) return amenity;
    
    // First, check the translation map (fastest)
    if (translationMap[amenity]) {
      return translationMap[amenity];
    }
    
    // Fallback: try direct translation on-the-fly
    const camelCaseKey = amenity
      .toLowerCase()
      .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
      .replace(/\s/g, '')
      .replace(/[()]/g, '')
      .replace(/nator/g, 'Nator')
      .replace(/a\/c/gi, 'ac');
    
    // Use root namespace - amenities are at root level
    const key = `amenities.${camelCaseKey}`;
    let translation;
    
    try {
      translation = tAmenities(key);
    } catch (e) {
      return amenity;
    }
    
    // Check if valid translation (not the key itself)
    if (translation && 
        typeof translation === 'string' &&
        translation !== key &&
        !translation.startsWith('amenities.')) {
      return translation;
    }
    
    // Final fallback
    return amenity;
  };

  // Split amenities into 3 columns for better layout
  const itemsPerColumn = Math.ceil(amenities.length / 3);
  const column1 = amenities.slice(0, itemsPerColumn);
  const column2 = amenities.slice(itemsPerColumn, itemsPerColumn * 2);
  const column3 = amenities.slice(itemsPerColumn * 2);

  // Show message if no amenities available
  if (amenities.length === 0) {
    return (
      <>
        <div className="wg-title text-11 fw-6 text-color-heading">
          {t('amenitiesAndFeatures')}
        </div>
        <div className="wrap-feature">
          <p className="text-color-2">{t('noAmenities')}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="wg-title text-11 fw-6 text-color-heading">
        {t('amenitiesAndFeatures')}
      </div>
      <div className="wrap-feature">
        {column1.length > 0 && (
          <div className="box-feature">
            <ul>
              {column1.map((amenity, index) => (
                <li key={`col1-${index}`} className="feature-item">
                  {translateAmenity(amenity)}
                </li>
              ))}
            </ul>
          </div>
        )}
        {column2.length > 0 && (
          <div className="box-feature">
            <ul>
              {column2.map((amenity, index) => (
                <li key={`col2-${index}`} className="feature-item">
                  {translateAmenity(amenity)}
                </li>
              ))}
            </ul>
          </div>
        )}
        {column3.length > 0 && (
          <div className="box-feature">
            <ul>
              {column3.map((amenity, index) => (
                <li key={`col3-${index}`} className="feature-item">
                  {translateAmenity(amenity)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
