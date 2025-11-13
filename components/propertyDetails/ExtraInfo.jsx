"use client";
import React, { useState } from "react";
import { formatPrice, formatStatus } from "@/utlis/propertyHelpers";
import { CopyIcon, CheckIcon } from "@/components/icons";
import logger from "@/utlis/logger";

export default function ExtraInfo({ property }) {
  const [copiedId, setCopiedId] = useState(null);
  
  // Get description or show default
  const description = property?.propertyDesc || 'No description available for this property.';
  
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
        Property Details
      </div>
      <div className="content">
        <p className="description text-1">
          {description}
        </p>
      </div>
      <div className="box">
        <ul>
          <li className="flex">
            <p className="fw-6">ID</p>
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
            </p>
          </li>
          <li className="flex">
            <p className="fw-6">Price</p>
            <p>{formatPrice(property?.propertyPrice)}</p>
          </li>
          <li className="flex">
            <p className="fw-6">Size</p>
            <p>{property?.size || '0'} sqft</p>
          </li>
          <li className="flex">
            <p className="fw-6">Bedrooms</p>
            <p>{property?.bedrooms || '0'}</p>
          </li>
          <li className="flex">
            <p className="fw-6">Bathrooms</p>
            <p>{property?.bathrooms || '0'}</p>
          </li>
        </ul>
        <ul>
          <li className="flex">
            <p className="fw-6">Land Area</p>
            <p>{property?.landArea ? `${property.landArea} sqft` : 'N/A'}</p>
          </li>
          <li className="flex">
            <p className="fw-6">Year Built</p>
            <p>{property?.yearBuilt || 'N/A'}</p>
          </li>
          <li className="flex">
            <p className="fw-6">Type</p>
            <p>{property?.propertyType || 'N/A'}</p>
          </li>
          <li className="flex">
            <p className="fw-6">Status</p>
            <p>{formatStatus(property?.status)}</p>
          </li>
          <li className="flex">
            <p className="fw-6">Garage</p>
            <p>{property?.garages ? `Yes (${property?.garageSize || '0'} sqft)` : 'No'}</p>
          </li>
        </ul>
      </div>
    </>
  );
}
