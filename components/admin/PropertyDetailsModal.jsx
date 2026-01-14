"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { listingAPI } from "@/apis";
import LocationLoader from "@/components/common/LocationLoader";
import { useTranslations, useLocale } from 'next-intl';
import styles from "./PropertyDetailsModal.module.css";

export default function PropertyDetailsModal({ isOpen, onClose, propertyId, onApprove, onReject, onDelete }) {
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
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

  useEffect(() => {
    if (isOpen && propertyId) {
      setSelectedImageIndex(0); // Reset image index when opening new property
      fetchPropertyDetails();
    } else if (!isOpen) {
      // Reset state when modal closes
      setProperty(null);
      setError(null);
      setSelectedImageIndex(0);
    }
  }, [isOpen, propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const property = await listingAPI.getListingById(propertyId);
      setProperty(property);
    } catch (err) {
      setError(err.message || err.error?.message || "Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const resolveImageUrl = (value) => {
    if (!value) return null;

    const rawValue = typeof value === 'string' ? value.trim() : value;
    if (!rawValue) return null;

    if (typeof rawValue !== 'string') {
      const candidate = rawValue.url || rawValue.secure_url || rawValue.path || rawValue.src;
      return resolveImageUrl(candidate);
    }

    const raw = rawValue.trim();

    // Already a full URL
    if (/^https?:\/\//i.test(raw) || raw.startsWith('data:') || raw.startsWith('blob:')) {
      return raw;
    }

    // Protocol-relative URL
    if (raw.startsWith('//')) {
      return `https:${raw}`;
    }

    // Bare filename (not a valid path)
    const isBareFilename = /^[^\/]+\.(jpg|jpeg|png|webp|gif|avif|svg|heic)$/i.test(raw);
    if (isBareFilename) {
      return null;
    }

    // Absolute path
    if (raw.startsWith('/')) {
      return raw;
    }

    // No path separator
    if (!raw.includes('/')) {
      return null;
    }

    // Normalize path
    const normalized = raw.replace(/\\/g, '/');
    const trimmed = normalized.replace(/^(\.\/)+/, '').replace(/^\/+/, '');
    if (!trimmed) {
      return null;
    }

    return `/${trimmed}`;
  };

  const extractImageUrls = (property) => {
    if (!property) return [];
    
    const urls = [];

    const pushUrl = (value) => {
      const resolved = resolveImageUrl(value);
      if (resolved) {
        urls.push(resolved);
      }
    };

    // Check images array
    if (Array.isArray(property.images)) {
      property.images.forEach((item) => pushUrl(item));
    }

    // Check galleryImages array
    if (Array.isArray(property.galleryImages)) {
      property.galleryImages.forEach((item) => pushUrl(item));
    }

    // Check imageNames array
    if (Array.isArray(property.imageNames)) {
      property.imageNames.forEach((name) => pushUrl(name));
    }

    // Check single image fields
    pushUrl(property.coverImage);
    pushUrl(property.featuredImage);
    pushUrl(property.mainImage);
    pushUrl(property.image);
    pushUrl(property.thumbnail);

    // Remove duplicates and filter out invalid URLs
    const uniqueUrls = urls
      .filter(Boolean)
      .filter((url, index, arr) => arr.indexOf(url) === index);

    // Fallback to default image if no images found
    if (uniqueUrls.length === 0) {
      uniqueUrls.push('/images/section/property-1.jpg');
    }

    return uniqueUrls;
  };

  const images = extractImageUrls(property);
  const mainImage = images[selectedImageIndex] || images[0] || '/images/section/property-1.jpg';
  
  // Debug logging
  useEffect(() => {
  }, [property, images, mainImage]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Property Details</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={styles.modalBody}>
          {loading ? (
            <div className={styles.loaderContainer}>
              <LocationLoader message="Loading property details..." />
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>{error}</p>
              <button className={styles.retryButton} onClick={fetchPropertyDetails}>
                Retry
              </button>
            </div>
          ) : property ? (
            <>
              {/* Images Section */}
              <div className={styles.imagesSection}>
                {images.length > 0 ? (
                  <>
                    <div className={styles.mainImageContainer}>
                      <Image
                        src={mainImage}
                        alt={property.propertyKeyword || "Property image"}
                        width={800}
                        height={500}
                        className={styles.mainImage}
                        unoptimized
                        onError={(e) => {
                          e.target.src = '/images/section/property-1.jpg';
                        }}
                      />
                      {images.length > 1 && (
                        <>
                          <button
                            className={`${styles.navButton} ${styles.prevButton}`}
                            onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                            aria-label="Previous image"
                          >
                            ‹
                          </button>
                          <button
                            className={`${styles.navButton} ${styles.nextButton}`}
                            onClick={() => setSelectedImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                            aria-label="Next image"
                          >
                            ›
                          </button>
                          <div className={styles.imageCounter}>
                            {selectedImageIndex + 1} / {images.length}
                          </div>
                        </>
                      )}
                    </div>
                    {images.length > 1 && (
                      <div className={styles.thumbnailContainer}>
                        {images.map((img, index) => (
                          <div
                            key={index}
                            className={`${styles.thumbnail} ${selectedImageIndex === index ? styles.thumbnailActive : ''}`}
                            onClick={() => setSelectedImageIndex(index)}
                          >
                            <Image
                              src={img}
                              alt={`Thumbnail ${index + 1}`}
                              width={100}
                              height={75}
                              className={styles.thumbnailImage}
                              unoptimized
                              onError={(e) => {
                                e.target.src = '/images/section/property-1.jpg';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.noImagesContainer}>
                    <p className={styles.noImagesText}>No images available for this property</p>
                    <Image
                      src="/images/section/property-1.jpg"
                      alt="No image available"
                      width={800}
                      height={500}
                      className={styles.mainImage}
                      unoptimized
                    />
                  </div>
                )}
              </div>

              {/* Property Information */}
              <div className={styles.infoSection}>
                <div className={styles.infoGrid}>
                  {/* Basic Info */}
                  <div className={styles.infoGroup}>
                    <h3 className={styles.sectionTitle}>Basic Information</h3>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Property ID:</span>
                      <span className={styles.infoValue}>{property.propertyId || property._id}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Keyword:</span>
                      <span className={styles.infoValue}>{property.propertyKeyword || 'N/A'}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Type:</span>
                      <span className={styles.infoValue}>{property.propertyType || 'N/A'}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Status:</span>
                      <span className={`${styles.badge} ${styles[`badge${property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}`] || styles.badgeDefault}`}>
                        {property.status || 'N/A'}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Approval Status:</span>
                      <span className={`${styles.badge} ${styles[`badge${property.approvalStatus?.charAt(0).toUpperCase() + property.approvalStatus?.slice(1)}`] || styles.badgeDefault}`}>
                        {property.approvalStatus || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className={styles.infoGroup}>
                    <h3 className={styles.sectionTitle}>Pricing</h3>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Price:</span>
                      <span className={styles.infoValue}>
                        {property.propertyPrice ? `${property.propertyPrice} ${property.currency || 'USD'}` : 'N/A'}
                      </span>
                    </div>
                    {property.rentType && (
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Rent Type:</span>
                        <span className={styles.infoValue}>{property.rentType}</span>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div className={styles.infoGroup}>
                    <h3 className={styles.sectionTitle}>Location</h3>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Address:</span>
                      <span className={styles.infoValue}>{property.address || 'N/A'}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>City:</span>
                      <span className={styles.infoValue}>{property.city || 'N/A'}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>State:</span>
                      <span className={styles.infoValue}>{property.state || 'N/A'}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Country:</span>
                      <span className={styles.infoValue}>{property.country || 'N/A'}</span>
                    </div>
                    {property.neighborhood && (
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Neighborhood:</span>
                        <span className={styles.infoValue}>{property.neighborhood}</span>
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className={styles.infoGroup}>
                    <h3 className={styles.sectionTitle}>Property Details</h3>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Bedrooms:</span>
                      <span className={styles.infoValue}>{property.bedrooms || 'N/A'}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Bathrooms:</span>
                      <span className={styles.infoValue}>{property.bathrooms || 'N/A'}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Size:</span>
                      <span className={styles.infoValue}>
                        {property.size ? `${property.size} ${getSizeUnitLabel(property.sizeUnit)}` : 'N/A'}
                      </span>
                    </div>
                    {property?.propertyType && property.propertyType.toLowerCase().trim() !== 'land' && property?.propertyType?.trim() !== 'أرض' && property?.yearBuilt != null && property?.yearBuilt !== '' && property.yearBuilt.toString().trim() !== '' && (
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Year Built:</span>
                        <span className={styles.infoValue}>{property.yearBuilt}</span>
                      </div>
                    )}
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Furnished:</span>
                      <span className={styles.infoValue}>{property.furnished ? 'Yes' : 'No'}</span>
                    </div>
                    {property?.propertyType && property.propertyType.toLowerCase().trim() !== 'land' && property?.propertyType?.trim() !== 'أرض' && property.garages && (
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Garages:</span>
                        <span className={styles.infoValue}>
                          {property.garages ? 'Yes' : 'No'}
                          {property.garageSize && ` (${property.garageSize})`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Agent Information */}
                  {property.agentId && (
                    <div className={styles.infoGroup}>
                      <h3 className={styles.sectionTitle}>Agent Information</h3>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Name:</span>
                        <span className={styles.infoValue}>
                          {property.agentName || property.agentId?.username || property.agentId?.email || 'N/A'}
                        </span>
                      </div>
                      {property.agentId.email && (
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel}>Email:</span>
                          <span className={styles.infoValue}>{property.agentId.email}</span>
                        </div>
                      )}
                      {property.agentId.isBlocked && (
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel}>Status:</span>
                          <span className={`${styles.badge} ${styles.badgeBlocked}`}>Blocked</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Amenities */}
                  {property.amenities && property.amenities.length > 0 && (
                    <div className={styles.infoGroup}>
                      <h3 className={styles.sectionTitle}>Amenities</h3>
                      <div className={styles.amenitiesList}>
                        {property.amenities.map((amenity, index) => (
                          <span key={index} className={styles.amenityTag}>
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {property.propertyDesc && (
                  <div className={styles.descriptionSection}>
                    <h3 className={styles.sectionTitle}>Description</h3>
                    <p className={styles.descriptionText}>{property.propertyDesc}</p>
                  </div>
                )}

                {/* Notes */}
                {property.notes && (
                  <div className={styles.descriptionSection}>
                    <h3 className={styles.sectionTitle}>Additional Notes</h3>
                    <p className={styles.descriptionText}>{property.notes}</p>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Footer Actions */}
        {property && (
          <div className={styles.modalFooter}>
            {property.approvalStatus === "pending" && (
              <>
                <button
                  className={`${styles.actionButton} ${styles.approveButton}`}
                  onClick={() => {
                    if (onApprove) onApprove(property._id);
                    onClose();
                  }}
                >
                  Approve
                </button>
                <button
                  className={`${styles.actionButton} ${styles.rejectButton}`}
                  onClick={() => {
                    if (onReject) onReject(property._id);
                    onClose();
                  }}
                >
                  Reject
                </button>
              </>
            )}
            {property.approvalStatus === "approved" && (
              <button
                className={`${styles.actionButton} ${styles.pendingButton}`}
                onClick={() => {
                  if (onApprove) onApprove(property._id, "pending");
                  onClose();
                }}
              >
                Set to Pending
              </button>
            )}
            <button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={() => {
                if (confirm("Are you sure you want to delete this property?")) {
                  if (onDelete) onDelete(property._id);
                  onClose();
                }
              }}
            >
              Delete
            </button>
            <button
              className={`${styles.actionButton} ${styles.closeButton}`}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

