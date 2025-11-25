"use client";
import React from "react";
import { useTranslations } from 'next-intl';

export default function Location() {
  const t = useTranslations('propertyDetail');
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
            <div className="text text-variant-1">150 sqft</div>
          </li>
          <li>
            <span className="label fw-6">{t('city')}</span>
            <div className="text text-variant-1">#1234</div>
          </li>
          <li>
            <span className="label fw-6">{t('stateCounty')}</span>
            <div className="text text-variant-1">$7,500</div>
          </li>
        </ul>
        <ul className="box-right">
          <li>
            <span className="label fw-6">{t('postalCode')}</span>
            <div className="text text-variant-1">7.328</div>
          </li>
          <li>
            <span className="label fw-6">{t('area')}</span>
            <div className="text text-variant-1">7.328</div>
          </li>
          <li>
            <span className="label fw-6">{t('country')}</span>
            <div className="text text-variant-1">2024</div>
          </li>
        </ul>
      </div>
    </>
  );
}
