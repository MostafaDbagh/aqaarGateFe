"use client";
import React from "react";
import { useTranslations } from 'next-intl';

export default function Features({ property }) {
  const t = useTranslations('propertyDetail');
  // Get amenities from property data or use empty array as fallback
  const amenities = property?.amenities || [];

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
                  {amenity}
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
                  {amenity}
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
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
