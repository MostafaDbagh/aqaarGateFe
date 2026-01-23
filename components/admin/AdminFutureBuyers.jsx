"use client";
import React, { useState, useEffect } from "react";
import { futureBuyerAPI } from "@/apis";
import LocationLoader from "@/components/common/LocationLoader";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import { useRouter } from "next/navigation";
import styles from "./AdminFutureBuyers.module.css";

export default function AdminFutureBuyers() {
  const { showSuccessModal, showWarningModal } = useGlobalModal();
  const router = useRouter();
  const [futureBuyers, setFutureBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBuyer, setExpandedBuyer] = useState(null);
  const [recalculatingId, setRecalculatingId] = useState(null);
  const [filters, setFilters] = useState({
    propertyType: "",
    city: "",
    status: "",
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchFutureBuyers();
  }, [filters]);

  const fetchFutureBuyers = async () => {
    try {
      setLoading(true);
      const response = await futureBuyerAPI.getFutureBuyers(filters);
      setFutureBuyers(response.data || []);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load future buyers");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this future buyer interest?")) return;
    
    try {
      await futureBuyerAPI.deleteFutureBuyer(id);
      showSuccessModal("Success", "Future buyer interest deleted successfully");
      fetchFutureBuyers();
    } catch (err) {
      showWarningModal("Error", err.message || "Failed to delete future buyer");
    }
  };

  const handleRecalculateMatches = async (id) => {
    if (recalculatingId === id) return; // Prevent double-click
    
    try {
      setRecalculatingId(id);
      const response = await futureBuyerAPI.recalculateMatches(id);
      showSuccessModal(
        "Success", 
        `Matches recalculated successfully. Found ${response.matchedPropertiesCount || 0} matching properties.`
      );
      fetchFutureBuyers();
    } catch (err) {
      showWarningModal("Error", err.message || "Failed to recalculate matches");
    } finally {
      setRecalculatingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedBuyer(expandedBuyer === id ? null : id);
  };

  const propertyTypes = ['Apartment', 'Villa', 'Land', 'Holiday Home', 'Office', 'Commercial'];
  const statusOptions = ['both', 'sale', 'rent'];

  if (loading && futureBuyers.length === 0) {
    return (
      <div className={styles.loaderContainer}>
        <LocationLoader message="Loading future buyers..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Interesting Future Buyers</h1>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <select
            className={styles.selectInput}
            value={filters.propertyType}
            onChange={(e) => handleFilterChange("propertyType", e.target.value)}
          >
            <option value="">All Property Types</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <input
            type="text"
            placeholder="Filter by city..."
            className={styles.searchInput}
            value={filters.city}
            onChange={(e) => handleFilterChange("city", e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <select
            className={styles.selectInput}
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">All Status</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Future Buyers List */}
      <div className={styles.listContainer}>
        {futureBuyers.length === 0 ? (
          <div className={styles.noData}>No future buyer interests found</div>
        ) : (
          futureBuyers.map((buyer) => (
            <div key={buyer._id} className={styles.buyerCard}>
              <div className={styles.buyerHeader} onClick={() => toggleExpand(buyer._id)}>
                <div className={styles.buyerInfo}>
                  <h3 className={styles.buyerName}>{buyer.name}</h3>
                  <div className={styles.buyerDetails}>
                    <span>{buyer.email}</span>
                    <span>•</span>
                    <span>{buyer.phone}</span>
                    <span>•</span>
                    <span className={styles.badge}>{buyer.propertyType}</span>
                    <span>•</span>
                    <span className={styles.badge}>{buyer.status}</span>
                    {buyer.city && (
                      <>
                        <span>•</span>
                        <span>{buyer.city}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.buyerActions}>
                  <span className={styles.matchCount}>
                    {buyer.matchedProperties?.length || 0} Matches
                  </span>
                  <button
                    className={`${styles.expandBtn} ${expandedBuyer === buyer._id ? styles.expanded : ''}`}
                  >
                    {expandedBuyer === buyer._id ? '▼' : '▶'}
                  </button>
                </div>
              </div>

              {expandedBuyer === buyer._id && (
                <div className={styles.buyerExpanded}>
                  {/* Requirements */}
                  <div className={styles.requirementsSection}>
                    <h4>Requirements:</h4>
                    <div className={styles.requirementsGrid}>
                      {buyer.minPrice && buyer.maxPrice && (
                        <div>
                          <strong>Price:</strong> {buyer.minPrice} - {buyer.maxPrice} {buyer.currency}
                        </div>
                      )}
                      {buyer.minSize && buyer.maxSize && (
                        <div>
                          <strong>Size:</strong> {buyer.minSize} - {buyer.maxSize} {buyer.sizeUnit}
                        </div>
                      )}
                      {buyer.minBedrooms !== undefined && buyer.maxBedrooms !== undefined && (
                        <div>
                          <strong>Bedrooms:</strong> {buyer.minBedrooms} - {buyer.maxBedrooms}
                        </div>
                      )}
                      {buyer.minBathrooms !== undefined && buyer.maxBathrooms !== undefined && (
                        <div>
                          <strong>Bathrooms:</strong> {buyer.minBathrooms} - {buyer.maxBathrooms}
                        </div>
                      )}
                      {buyer.state && (
                        <div>
                          <strong>Province:</strong> {buyer.state}
                        </div>
                      )}
                      {buyer.neighborhood && (
                        <div>
                          <strong>Neighborhood:</strong> {buyer.neighborhood}
                        </div>
                      )}
                      {buyer.amenities && buyer.amenities.length > 0 && (
                        <div>
                          <strong>Amenities:</strong> {buyer.amenities.join(', ')}
                        </div>
                      )}
                      {buyer.notes && (
                        <div>
                          <strong>Notes:</strong> {buyer.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Matched Properties */}
                  <div className={styles.matchedPropertiesSection}>
                    <h4>Matched Properties ({buyer.matchedProperties?.length || 0}):</h4>
                    {buyer.matchedProperties && buyer.matchedProperties.length > 0 ? (
                      <div className={styles.propertiesList}>
                        {buyer.matchedProperties.map((match, index) => (
                          <div key={index} className={styles.propertyMatch}>
                            {match.listing ? (
                              <div className={styles.propertyInfo}>
                                <div className={styles.propertyHeader}>
                                  <span className={styles.propertyId}>
                                    Property ID: {match.propertyId}
                                  </span>
                                  <span className={styles.matchScore}>
                                    Match: {match.matchScore}%
                                  </span>
                                </div>
                                <div className={styles.propertyDetails}>
                                  <div>
                                    <strong>Type:</strong> {match.listing.propertyType}
                                  </div>
                                  <div>
                                    <strong>Price:</strong> {match.listing.propertyPrice} {match.listing.currency}
                                  </div>
                                  <div>
                                    <strong>Size:</strong> {match.listing.size} {match.listing.sizeUnit || 'sqm'}
                                  </div>
                                  <div>
                                    <strong>Bedrooms:</strong> {match.listing.bedrooms}
                                  </div>
                                  <div>
                                    <strong>Bathrooms:</strong> {match.listing.bathrooms}
                                  </div>
                                  <div>
                                    <strong>Location:</strong> {match.listing.city}, {match.listing.neighborhood}
                                  </div>
                                </div>
                                <button
                                  className={styles.viewPropertyBtn}
                                  onClick={() => router.push(`/property-detail/${match.listing._id}`)}
                                >
                                  View Property
                                </button>
                              </div>
                            ) : (
                              <div className={styles.propertyNotFound}>
                                Property {match.propertyId} not found (may have been deleted)
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.noMatches}>No matching properties found</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className={styles.actionsSection}>
                    <button
                      className={`${styles.btn} ${styles.btnRecalculate}`}
                      onClick={() => handleRecalculateMatches(buyer._id)}
                      disabled={recalculatingId === buyer._id}
                    >
                      {recalculatingId === buyer._id ? 'Recalculating...' : 'Recalculate Matches'}
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnDelete}`}
                      onClick={() => handleDelete(buyer._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={filters.page === 1}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            className={styles.pageBtn}
            disabled={filters.page >= pagination.pages}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

