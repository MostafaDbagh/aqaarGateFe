"use client";
import React, { useState } from "react";
import { getStatusBadge } from "@/utlis/propertyHelpers";
import MoreAboutPropertyModal from "../modals/MoreAboutPropertyModal";
import ContactAgentModal from "../modals/ContactAgentModal";
import styles from "./PropertyOverview.module.css";
import { HeartOutlineIcon, CopyIcon, CheckIcon } from "@/components/icons";
import logger from "@/utlis/logger";
import FavoriteButton from "../common/FavoriteButton";

export default function PropertyOverview({ property }) {
  const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);
  const [isAskQuestionModalOpen, setIsAskQuestionModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  
  const statusBadge = getStatusBadge(property?.status);
  
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
          <span>{property?.propertyType || 'Property Title'}</span>
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
            return `${symbol}${property?.propertyPrice?.toLocaleString() || '0'}`;
          })()}{" "}
          <span className="h5 lh-30 fw-4 text-color-default">
            /{property?.rentType || 'month'}
          </span>
        </div>
      </div>
      <div className="info flex justify-between">
        <div className="feature">
          <p className="location text-1 flex items-center gap-10">
            <i className="icon-location" />
            {property?.address || 'Property Location'}
          </p>
          <ul className="meta-list flex">
            <li className="text-1 flex items-center gap-10">
              <i className="icon-Bed-2" />
              <span>{property?.bedrooms || '0'}</span>Bed
            </li>
            <li className="text-1 flex items-center gap-10">
              <i className="icon-Bathtub" />
              <span>{property?.bathrooms || '0'}</span>Bath
            </li>
            <li className="text-1 flex items-center gap-10">
              <i className="icon-Ruler" />
              <span>{property?.size || '0'}</span>Sqft
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
          </ul>
        </div>
      </div>
      <div className="info-detail">
        <div className="wrap-box">
          <div className="box-icon">
            <div className="icons">
              <i className="icon-HouseLine" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">ID:</div>
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
                    title={copiedId === property.propertyId ? 'Copied!' : 'Copy Property ID'}
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
          <div className="box-icon">
            <div className="icons">
              <i className="icon-Bathtub" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">Bathrooms:</div>
              <div className="text-1 text-color-heading">{property?.bathrooms || '0'} Rooms</div>
            </div>
          </div>
        </div>
        <div className="wrap-box">
          <div className="box-icon">
            <div className="icons">
              <i className="icon-SlidersHorizontal" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">Type:</div>
              <div className="text-1 text-color-heading">{property?.propertyType || 'House'}</div>
            </div>
          </div>
          <div className="box-icon">
            <div className="icons">
              <i className="icon-Crop" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">Land Size:</div>
              <div className="text-1 text-color-heading">{property?.landArea || '0'} SqFt</div>
            </div>
          </div>
        </div>
        <div className="wrap-box">
          <div className="box-icon">
            <div className="icons">
              <i className="icon-Garage-1" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">Garages</div>
              <div className="text-1 text-color-heading">{property?.garages ? 'Yes' : 'No'}</div>
            </div>
          </div>
          <div className="box-icon">
            <div className="icons">
              <i className="icon-Hammer" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">Year Built:</div>
              <div className="text-1 text-color-heading">{property?.yearBuilt || 'N/A'}</div>
            </div>
          </div>
        </div>
        <div className="wrap-box">
          <div className="box-icon">
            <div className="icons">
              <i className="icon-Bed-2" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">Bedrooms:</div>
              <div className="text-1 text-color-heading">{property?.bedrooms || '0'} Rooms</div>
            </div>
          </div>
          <div className="box-icon">
            <div className="icons">
              <i className="icon-Ruler" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">Size:</div>
              <div className="text-1 text-color-heading">{property?.size || '0'} SqFt</div>
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
                <div className="text-4 text-color-default">Notes:</div>
                <div className="text-1 text-color-heading" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {property.notes}
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
        Ask a question
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
