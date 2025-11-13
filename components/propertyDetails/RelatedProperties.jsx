"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchListings } from "@/apis/hooks";
import { getPropertyImage, getPropertyTitle } from "@/utlis/propertyHelpers";
import styles from "./RelatedProperties.module.css";

export default function RelatedProperties({ currentProperty }) {
  // Calculate search parameters for similar properties
  const searchParams = useMemo(() => {
    if (!currentProperty) return {};

    const params = {
      limit: 6, // Get 6 similar properties
    };

    // Match same property type
    if (currentProperty.propertyType) {
      params.propertyType = currentProperty.propertyType;
    }

    // Match same status (rent/sale)
    if (currentProperty.status) {
      params.status = currentProperty.status;
    }

    // Match similar price range (±30%)
    if (currentProperty.propertyPrice) {
      const priceMargin = currentProperty.propertyPrice * 0.3;
      params.minPrice = Math.floor(currentProperty.propertyPrice - priceMargin);
      params.maxPrice = Math.ceil(currentProperty.propertyPrice + priceMargin);
    }

    // Match same country
    if (currentProperty.country) {
      params.country = currentProperty.country;
    }

    return params;
  }, [currentProperty]);

  // Fetch similar properties
  const { data: listingsData, isLoading, isError } = useSearchListings(searchParams);

  // Filter out the current property and limit results
  const similarProperties = useMemo(() => {
    if (!listingsData?.data) return [];
    
    return listingsData.data
      .filter(property => property._id !== currentProperty?._id)
      .slice(0, 6);
  }, [listingsData, currentProperty]);

  // Don't render if no similar properties or still loading
  if (isLoading) {
    return (
      <section className="section-similar-properties tf-spacing-3">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="heading-section mb-32">
                <h2 className="title">Similar Properties</h2>
              </div>
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading similar properties...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || similarProperties.length === 0) {
    return null; // Don't show the section if no similar properties
  }

  return (
    <section className="section-similar-properties tf-spacing-3">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section mb-32">
              <h2 className="title">Similar Properties</h2>
            </div>
            <div className={styles.propertiesGrid}>
              {similarProperties.map((property) => {
                const getBadgeClass = () => {
                  const status = property.status?.toLowerCase();
                  if (status === 'rent') return styles.forRent;
                  if (status === 'sale') return styles.forSale;
                  return '';
                };

                return (
                  <div key={property._id} className={styles.propertyCard}>
                    <div className={styles.imageWrapper}>
                      <Link href={`/property-detail/${property._id}`}>
                        <Image
                          src={getPropertyImage(property)}
                          alt={getPropertyTitle(property)}
                          width={400}
                          height={300}
                          className={styles.propertyImage}
                          />
                        </Link>
                       
                        {property.offer && (
                          <span className={styles.offerBadge}>Special Offer</span>
                        )}
                      
                      {property.status && (
                        <span className={`${styles.statusBadge} ${getBadgeClass()}`}>
                          {property.status === 'sale' ? 'For Sale' : 'For Rent'}
                        </span>
                      )}
                    </div>

                    <div className={styles.cardContent}>
                      <h3 className={styles.propertyTitle}>
                        <Link href={`/property-detail/${property._id}`}>
                          {getPropertyTitle(property)}
                        </Link>
                      </h3>

                      <div className={styles.location}>
                        <i className="icon-location" />
                        <span>{property.address}, {property.state}</span>
                      </div>

                      <div className={styles.metaInfo}>
                        <div className={styles.metaItem}>
                          Beds <span>{property.bedrooms || 0}</span>
                        </div>
                        <div className={styles.metaItem}>
                          Baths <span>{property.bathrooms || 0}</span>
                        </div>
                        <div className={styles.metaItem}>
                          Sqft <span>{property.size || 0}</span>
                        </div>
                        <div className={styles.metaItem}>
                          Garage <span>{property.garage || 'No'}</span>
                        </div>
                      </div>

                      <div className={styles.cardFooter}>
                        <h4 className={styles.price}>
                          ${property.propertyPrice?.toLocaleString()}
                        </h4>
                        <Link href={`/property-detail/${property._id}`} className={styles.detailsBtn}>
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
