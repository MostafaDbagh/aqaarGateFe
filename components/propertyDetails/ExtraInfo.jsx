"use client";
import React, { useState } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { formatPrice, formatStatus } from "@/utlis/propertyHelpers";
import { CopyIcon, CheckIcon } from "@/components/icons";
import logger from "@/utlis/logger";

export default function ExtraInfo({ property }) {
  const t = useTranslations('propertyDetail');
  const locale = useLocale();
  const [copiedId, setCopiedId] = useState(null);
  
  // Get description or show default - use Arabic if available and locale is Arabic
  const description = locale === 'ar' && property?.description_ar 
    ? property.description_ar 
    : (property?.propertyDesc || t('noDescription'));
  
  // Handle copy property ID
  const handleCopyPropertyId = async (propertyId) => {
    try {
      await navigator.clipboard.writeText(propertyId);
      setCopiedId(propertyId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      logger.error('Failed to copy property ID:', error);
    }
  };

  return (
    <>
      <div className="wg-title text-11 fw-6 text-color-heading">
        {t('propertyDetails')}
      </div>
      <div className="content">
        <p className="description text-1">
          {description}
        </p>
      </div>
      <div className="box">
        <ul>
          <li className="flex">
            <p className="fw-6">{t('id')}</p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>#{property?.propertyId || 'N/A'}</span>
              {property?.propertyId && (
                <button
                  onClick={() => handleCopyPropertyId(property.propertyId)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    color: copiedId === property.propertyId ? '#28a745' : '#6c757d',
                    transition: 'color 0.2s'
                  }}
                  title={copiedId === property.propertyId ? t('copied') : t('copyPropertyId')}
                  aria-label="Copy property ID to clipboard"
                >
                  {copiedId === property.propertyId ? (
                    <CheckIcon />
                  ) : (
                    <CopyIcon width={16} height={16} stroke={copiedId === property.propertyId ? '#28a745' : '#6c757d'} />
                  )}
                </button>
              )}
            </p>
          </li>
          <li className="flex">
            <p className="fw-6">{t('price')}</p>
            <p>{formatPrice(property?.propertyPrice)}</p>
          </li>
          <li className="flex">
            <p className="fw-6">{t('size')}</p>
            <p>{property?.size || '0'} {t('sqft')}</p>
          </li>
          <li className="flex">
            <p className="fw-6">{t('bedrooms')}</p>
            <p>{property?.bedrooms || '0'}</p>
          </li>
          <li className="flex">
            <p className="fw-6">{t('bathrooms')}</p>
            <p>{property?.bathrooms || '0'}</p>
          </li>
        </ul>
        <ul>
          <li className="flex">
            <p className="fw-6">{t('landArea')}</p>
            <p>{property?.landArea ? `${property.landArea} ${t('sqft')}` : 'N/A'}</p>
          </li>
          <li className="flex">
            <p className="fw-6">{t('yearBuilt')}</p>
            <p>{property?.yearBuilt || 'N/A'}</p>
          </li>
          {property?.floor !== undefined && property?.floor !== null && (
            <li className="flex">
              <p className="fw-6">{t('floor')}</p>
              <p>{property.floor}</p>
            </li>
          )}
          <li className="flex">
            <p className="fw-6">{t('type')}</p>
            <p>{property?.propertyType || 'N/A'}</p>
          </li>
          <li className="flex">
            <p className="fw-6">{t('status')}</p>
            <p>{formatStatus(property?.status)}</p>
          </li>
          {property?.status?.toLowerCase() === 'rent' && property?.rentType && (
            <li className="flex">
              <p className="fw-6">{t('rentType')}</p>
              <p>
                {(() => {
                  const rentTypeMap = {
                    'monthly': t('rentTypeMonthly'),
                    'weekly': t('rentTypeWeekly'),
                    'yearly': t('rentTypeYearly'),
                    'daily': t('rentTypeDaily'),
                    'one-year': t('rentTypeOneYear')
                  };
                  return rentTypeMap[property.rentType] || property.rentType;
                })()}
              </p>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
