"use client";
import React, { useState, useEffect } from "react";
import { adminAPI } from "@/apis";
import LocationLoader from "@/components/common/LocationLoader";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import PropertyDetailsModal from "./PropertyDetailsModal";
import styles from "./AdminDeletedProperties.module.css";
import { formatPriceWithCurrency } from "@/utlis/propertyHelpers";

export default function AdminDeletedProperties() {
  const { showSuccessModal, showWarningModal } = useGlobalModal();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    propertyType: "",
    city: "",
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDeletedProperties(filters);
      setProperties(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load deleted properties");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleViewDetails = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedPropertyId(null);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && properties.length === 0) {
    return (
      <div className={styles.loaderContainer}>
        <LocationLoader message="Loading deleted properties..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Deleted Properties</h1>
      <p className={styles.subtitle}>
        View all deleted properties with deletion reasons and dates.
      </p>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <input
            type="text"
            placeholder="Search properties or deletion reason..."
            className={styles.searchInput}
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <select
            className={styles.selectInput}
            value={filters.propertyType}
            onChange={(e) => handleFilterChange("propertyType", e.target.value)}
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="house">House</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <input
            type="text"
            placeholder="City"
            className={styles.searchInput}
            value={filters.city}
            onChange={(e) => handleFilterChange("city", e.target.value)}
          />
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Properties Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Property</th>
              <th>Type</th>
              <th>Deleted Date</th>
              <th>Deletion Reason</th>
              <th>Price</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.noData}>No deleted properties found</td>
              </tr>
            ) : (
              properties.map((property) => (
                <tr key={property._id}>
                  <td>{property.propertyId || property._id.slice(-6)}</td>
                  <td>
                    <div className={styles.propertyInfo}>
                      <strong>{property.propertyKeyword}</strong>
                      <span className={styles.propertyDesc}>
                        {property.propertyDesc?.substring(0, 50)}...
                      </span>
                    </div>
                  </td>
                  <td>{property.propertyType}</td>
                  <td>
                    <div className={styles.deletedDateContainer}>
                      <i className="icon-calendar" />
                      <span className={styles.deletedDate}>{formatDate(property.deletedAt)}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.reasonContainer}>
                      <span className={styles.reasonText}>
                        {property.deletedReason || "No reason provided"}
                      </span>
                    </div>
                  </td>
                  <td>
                    {formatPriceWithCurrency(property.propertyPrice, property.currency)}
                  </td>
                  <td>{property.city}, {property.country}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.btn} ${styles.btnView}`}
                        onClick={() => handleViewDetails(property._id)}
                        title="View full property details"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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

      {/* Property Details Modal */}
      <PropertyDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        propertyId={selectedPropertyId}
      />
    </div>
  );
}


