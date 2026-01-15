"use client";
import React, { useState } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { getStatusBadge } from "@/utlis/propertyHelpers";
import { translateKeywordsString } from "@/utils/translateKeywords";
import MoreAboutPropertyModal from "../modals/MoreAboutPropertyModal";
import ContactAgentModal from "../modals/ContactAgentModal";
import styles from "./PropertyOverview.module.css";
import { HeartOutlineIcon, CopyIcon, CheckIcon } from "@/components/icons";
import logger from "@/utlis/logger";
import FavoriteButton from "../common/FavoriteButton";
import ShareButton from "./ShareButton";

export default function PropertyOverview({ property }) {
  const t = useTranslations();
  const tCommon = useTranslations('common');
  const tDetail = useTranslations('propertyDetail');
  const locale = useLocale();
  const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);
  const [isAskQuestionModalOpen, setIsAskQuestionModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  
  const statusBadge = getStatusBadge(property?.status, t);
  
  // Helper function to get size unit label
  const getSizeUnitLabel = (sizeUnit) => {
    if (!sizeUnit) return locale === 'ar' ? tCommon('sqm') : 'SQM';
    const unit = sizeUnit.toLowerCase();
    // Map size units to translation keys
    const unitMap = {
      'sqm': 'sqm',
      'dunam': 'dunam',
      'feddan': 'feddan',
      'sqft': 'sqft',
      'sqyd': 'sqyd'
    };
    const translationKey = unitMap[unit] || 'sqm';
    return tCommon(translationKey);
  };
  
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
  
  // Get CSS class for badge based on status
  const getBadgeClass = () => {
    const status = property?.status?.toLowerCase();
    if (status === 'rent') return styles.forRent;
    if (status === 'sale') return styles.forSale;
    return styles.default;
  };

  return (
    <>
      <div className="heading flex justify-between">
        <div className={`title text-5 fw-6 text-color-heading ${styles.titleWrapper}`}>
          <span className={`${styles.statusBadge} ${getBadgeClass()}`}>
            {statusBadge.text}
          </span>
        </div>
        <div className="price text-5 fw-6 text-color-heading">
          {(() => {
            const currencySymbols = {
              'USD': '$',
              'SYP': 'SYP',
              'TRY': '₺',
              'EUR': '€'
            };
            const currency = property?.currency || 'USD';
            const symbol = currencySymbols[currency] || currency;
            // IMPORTANT: Display exact price as stored in database - no rounding or modification
            const exactPrice = property?.propertyPrice;
            if (exactPrice === null || exactPrice === undefined) {
              return `${symbol}0`;
            }
            // Use toLocaleString only for formatting, not for rounding
            return `${symbol}${exactPrice.toLocaleString('en-US', { maximumFractionDigits: 0, useGrouping: true })}`;
          })()}
          {property?.status?.toLowerCase() === 'for rent' && (
            <>
              {" "}
              <span className="h5 lh-30 fw-4 text-color-default">
                /{property?.rentType || 'monthly'}
              </span>
            </>
          )}
        </div>
      </div>
      
      {/* Property Location Section - Show for both Arabic and English */}
      {((locale === 'en' && (property?.propertyDesc || property?.description || property?.address || property?.neighborhood)) ||
        (locale === 'ar' && (property?.description_ar || property?.address_ar || property?.neighborhood_ar))) && (
        <div className="info-detail mt-30" style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h4 className="text-4 fw-6 text-color-heading mb-20" style={{ marginBottom: '20px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="icon-location" style={{ fontSize: '18px' }} />
            {locale === 'ar' ? 'موقع العقار' : tDetail('propertyLocation')}
          </h4>
          
          {locale === 'en' ? (
            <>
              {(property?.propertyDesc || property?.description) && (
                <div className="mb-20" style={{ marginBottom: '20px' }}>
                  <p className="text-4 text-color-default mb-10" style={{ marginBottom: '10px', fontWeight: '600' }}>{tDetail('description')}:</p>
                  <p className="text-1 text-color-heading" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', direction: 'ltr', textAlign: 'left' }}>
                    {property?.propertyDesc || property?.description}
                  </p>
                </div>
              )}
              
              {property?.address && (
                <div className="mb-20" style={{ marginBottom: '20px' }}>
                  <p className="text-4 text-color-default mb-10" style={{ marginBottom: '10px', fontWeight: '600' }}>{tDetail('fullAddress')}:</p>
                  <p className="text-1 text-color-heading" style={{ direction: 'ltr', textAlign: 'left' }}>
                    {property.address}
                  </p>
                </div>
              )}
              
              {property?.neighborhood && (
                <div className="mb-20" style={{ marginBottom: '20px' }}>
                  <p className="text-4 text-color-default mb-10" style={{ marginBottom: '10px', fontWeight: '600' }}>{tDetail('neighborhood')}:</p>
                  <p className="text-1 text-color-heading" style={{ direction: 'ltr', textAlign: 'left' }}>
                    {property.neighborhood}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              {property?.description_ar && (
                <div className="mb-20" style={{ marginBottom: '20px' }}>
                  <p className="text-4 text-color-default mb-10" style={{ marginBottom: '10px', fontWeight: '600' }}>{tDetail('description')}:</p>
                  <p className="text-1 text-color-heading" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', direction: 'rtl', textAlign: 'right' }}>
                    {property.description_ar}
                  </p>
                </div>
              )}
              
              {property?.address_ar && (
                <div className="mb-20" style={{ marginBottom: '20px' }}>
                  <p className="text-4 text-color-default mb-10" style={{ marginBottom: '10px', fontWeight: '600' }}>{tDetail('fullAddress')}:</p>
                  <p className="text-1 text-color-heading" style={{ direction: 'rtl', textAlign: 'right' }}>
                    {property.address_ar}
                  </p>
                </div>
              )}
              
              {property?.neighborhood_ar && (
                <div className="mb-20" style={{ marginBottom: '20px' }}>
                  <p className="text-4 text-color-default mb-10" style={{ marginBottom: '10px', fontWeight: '600' }}>{tDetail('neighborhood')}:</p>
                  <p className="text-1 text-color-heading" style={{ direction: 'rtl', textAlign: 'right' }}>
                    {property.neighborhood_ar}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {/* Property Keyword Tags */}
      {property?.propertyKeyword && (
        <div className={styles.keywordTagsContainer}>
          {translateKeywordsString(property.propertyKeyword, tCommon).map((translatedKeyword, index) => (
            <span key={index} className={styles.keywordTag}>
              {translatedKeyword}
            </span>
          ))}
        </div>
      )}
      <div className="info flex justify-between">
        <div className="feature">
          <p className="location text-1 flex items-center gap-10">
            <i className="icon-location" />
            {locale === 'ar' && property?.address_ar ? property.address_ar : (property?.address || 'Property Location')}
          </p>
          <ul className="feature-list flex flex-wrap gap-10 " style={{margin: '12px 0'}}>
            {property?.propertyType && property.propertyType.toLowerCase().trim() !== 'land' && property?.propertyType?.trim() !== 'أرض' && property?.bedrooms != null && Number(property.bedrooms) > 0 && (
              <li className="text-1 flex items-center gap-10">
                <i className="icon-Bed-2" style={{ margin: '0 2px' }} />
                <span>{property.bedrooms}</span>{tDetail('bed')}
              </li>
            )}
            {property?.bathrooms != null && Number(property.bathrooms) > 0 && (
              <li className="text-1 flex items-center gap-10">
                <i className="icon-Bathtub" style={{ margin: '0 2px' }} />
                <span>{property.bathrooms}</span>{tDetail('bath')}
              </li>
            )}
            <li className="text-1 flex items-center gap-10">
              <i className="icon-Ruler" style={{ margin: '0 2px' }} />
              <span>{property?.size || '0'}</span> {getSizeUnitLabel(property?.sizeUnit)}
            </li>
          </ul>
        </div>
        <div className="action">
          <ul className="list-action">
            <li>
              <FavoriteButton 
                propertyId={property?._id}
                showLabel={false}
                className="btn-icon save hover-tooltip"
                iconClassName="icon-heart-1"
              />
            </li>
            <li>
              <ShareButton property={property} />
            </li>
          </ul>
        </div>
      </div>
      <div className={`info-detail ${styles.infoDetailGrid}`}>
        <div className="wrap-box">
          <div className="box-icon">
            <div className="icons"> 
              <i className="icon-HouseLine" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">{tDetail('id')}:</div>
              <div className="text-1 text-color-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{property?.propertyId || 'N/A'}</span>
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
                    title={copiedId === property.propertyId ? tDetail('copied') : tDetail('copyPropertyId')}
                    aria-label="Copy property ID to clipboard"
                  >
                    {copiedId === property.propertyId ? (
                      <CheckIcon />
                    ) : (
                      <CopyIcon width={16} height={16} stroke={copiedId === property.propertyId ? '#28a745' : '#6c757d'} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          {property?.bathrooms != null && Number(property.bathrooms) > 0 && (
            <div className="box-icon">
              <div className="icons">
                <i className="icon-Bathtub" style={{ margin: '0 2px' }} />
              </div>
              <div className="content">
                <div className="text-4 text-color-default">{tDetail('bathrooms')}:</div>
                <div className="text-1 text-color-heading">{property.bathrooms} {tDetail('rooms')}</div>
              </div>
            </div>
          )}
          {property?.floor !== undefined && property?.floor !== null && (
            <div className="box-icon">
              <div className="icons">
                <i className="icon-HouseLine" />
              </div>
              <div className="content">
                <div className="text-4 text-color-default">{tDetail('floor')}:</div>
                <div className="text-1 text-color-heading">{property.floor}</div>
              </div>
            </div>
          )}
        </div>
        <div className="wrap-box">
          <div className="box-icon">
            <div className="icons">
              <i className="icon-SlidersHorizontal" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">{tDetail('type')}:</div>
              <div className="text-1 text-color-heading">{property?.propertyType || 'House'}</div>
            </div>
          </div>
          <div className="box-icon">
            <div className="icons">
              <i className="icon-Crop" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">{tDetail('landSize')}:</div>
              <div className="text-1 text-color-heading">{property?.landArea || '0'} {getSizeUnitLabel(property?.sizeUnit)}</div>
            </div>
          </div>

          {property?.propertyType && property.propertyType.toLowerCase().trim() !== 'land' && property?.propertyType?.trim() !== 'أرض' && property?.bedrooms != null && Number(property.bedrooms) > 0 && (
            <div className="box-icon">
              <div className="icons">
                <i className="icon-Bed-2" style={{ margin: '0 2px' }} />
              </div>
              <div className="content">
                <div className="text-4 text-color-default">{tDetail('bedrooms')}:</div>
                <div className="text-1 text-color-heading">{property.bedrooms} {tDetail('rooms')}</div>
              </div>
            </div>
          )}
          

        </div>
        <div className="wrap-box">
          {property?.propertyType && property.propertyType.toLowerCase().trim() !== 'land' && property?.propertyType?.trim() !== 'أرض' && (
            <div className="box-icon">
              <div className="icons">
                <i className="icon-Garage-1" />
              </div>
              <div className="content">
                <div className="text-4 text-color-default">{tDetail('garages')}</div>
                <div className="text-1 text-color-heading">{property?.garages ? tDetail('yes') : tDetail('no')}</div>
              </div>
            </div>
          )}
          {property?.propertyType && property.propertyType.toLowerCase().trim() !== 'land' && property?.propertyType?.trim() !== 'أرض' && property?.yearBuilt != null && property?.yearBuilt !== 0 && property?.yearBuilt !== '0' && property?.yearBuilt !== '' && property.yearBuilt.toString().trim() !== '' && (
            <div className="box-icon">
              <div className="icons">
                <i className="icon-Hammer" />
              </div>
              <div className="content">
                <div className="text-4 text-color-default">{tDetail('yearBuilt')}:</div>
                <div className="text-1 text-color-heading">{property?.yearBuilt || 'N/A'}</div>
              </div>
            </div>
          )}

          <div className="box-icon">
            <div className="icons">
              <i className="icon-Ruler" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">{tDetail('size')}:</div>
              <div className="text-1 text-color-heading">{property?.size || '0'} {getSizeUnitLabel(property?.sizeUnit)}</div>
            </div>
          </div>

        </div>
  
      </div>
      {property?.notes && (
        <div className="info-detail mt-30" style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <div className="wrap-box">
            <div className="box-icon">
              <div className="icons" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FEF3C7',
                color: '#F59E0B',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                !
              </div>
              <div className="content">
                <div className="text-4 text-color-default">{tDetail('notes')}:</div>
                <div className="text-1 text-color-heading" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', direction: locale === 'ar' ? 'rtl' : 'ltr', textAlign: locale === 'ar' ? 'right' : 'left' }}>
                  {locale === 'ar' && property?.notes_ar ? property.notes_ar : (property?.notes || '')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsAskQuestionModalOpen(true)}
        className="tf-btn bg-color-primary pd-21 fw-6"
        style={{ border: 'none', cursor: 'pointer', width: '100%' }}
      >
        {tDetail('askQuestion')}
      </button>

      <ContactAgentModal 
        isOpen={isAskQuestionModalOpen}
        onClose={() => setIsAskQuestionModalOpen(false)}
        property={property}
      />
      
      <MoreAboutPropertyModal 
        isOpen={isMoreInfoModalOpen}
        onClose={() => setIsMoreInfoModalOpen(false)}
        property={property}
      />
    </>
  );
}
