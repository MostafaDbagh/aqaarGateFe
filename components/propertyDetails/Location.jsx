"use client";
import React from "react";
import { useTranslations, useLocale } from 'next-intl';

export default function Location({ property }) {
  const t = useTranslations('propertyDetail');
  const locale = useLocale();
  
  // Use Arabic fields if available and locale is Arabic
  const address = locale === 'ar' && property?.address_ar ? property.address_ar : (property?.address || '');
  const neighborhood = locale === 'ar' && property?.neighborhood_ar ? property.neighborhood_ar : (property?.neighborhood || '');
  
  return (
    <>
      <div className="wg-title text-11 fw-6 text-color-heading">
        {t('location')}
      </div>
      <iframe
        className="map"
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d135905.11693909427!2d-73.95165795400088!3d41.17584829642291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1727094281524!5m2!1sen!2s"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="info-map">
        <ul className="box-left">
          <li>
            <span className="label fw-6">{t('address')}</span>
            <div className="text text-variant-1" style={{ direction: locale === 'ar' ? 'rtl' : 'ltr', textAlign: locale === 'ar' ? 'right' : 'left' }}>
              {address || t('notSpecified')}
            </div>
          </li>
          <li>
            <span className="label fw-6">{t('city')}</span>
            <div className="text text-variant-1">{property?.city || property?.state || 'N/A'}</div>
          </li>
          <li>
            <span className="label fw-6">{t('stateCounty')}</span>
            <div className="text text-variant-1">{property?.state || 'N/A'}</div>
          </li>
        </ul>
        <ul className="box-right">
          <li>
            <span className="label fw-6">{t('area')}</span>
            <div className="text text-variant-1" style={{ direction: locale === 'ar' ? 'rtl' : 'ltr', textAlign: locale === 'ar' ? 'right' : 'left' }}>
              {neighborhood || t('notSpecified')}
            </div>
          </li>
          <li>
            <span className="label fw-6">{t('country')}</span>
            <div className="text text-variant-1">{property?.country || 'Syria'}</div>
          </li>
        </ul>
      </div>
    </>
  );
}
