"use client";
import React, { useState, useEffect } from "react";
import { adminAPI } from "@/apis";
import LocationLoader from "@/components/common/LocationLoader";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import PropertyDetailsModal from "./PropertyDetailsModal";
import styles from "./AdminSoldProperties.module.css";
import { formatPriceWithCurrency } from "@/utlis/propertyHelpers";

export default function AdminSoldProperties() {
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
  const [editingChargesId, setEditingChargesId] = useState(null);
  const [chargesValue, setChargesValue] = useState("");

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSoldProperties(filters);
      setProperties(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load sold properties");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleEditCharges = (property) => {
    setEditingChargesId(property._id);
    setChargesValue(property.soldCharges?.toString() || "0");
  };

  const handleSaveCharges = async (id) => {
    const charges = parseFloat(chargesValue);
    if (isNaN(charges) || charges < 0) {
      showWarningModal("Error", "Charges must be a positive number");
      return;
    }

    try {
      await adminAPI.updateSoldPropertyCharges(id, charges);
      showSuccessModal("Success", "Charges updated successfully");
      setEditingChargesId(null);
      setChargesValue("");
      fetchProperties();
    } catch (err) {
      showWarningModal("Error", err.message || "Failed to update charges");
    }
  };

  const handleCancelEdit = () => {
    setEditingChargesId(null);
    setChargesValue("");
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
      day: 'numeric' 
    });
  };

  if (loading && properties.length === 0) {
    return (
      <div className={styles.loaderContainer}>
        <LocationLoader message="Loading sold properties..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sold Properties Management</h1>
      <p className={styles.subtitle}>
        Manage sold properties and their charges. Sold properties are not visible on public pages.
      </p>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <input
            type="text"
            placeholder="Search properties..."
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
              <th>Sold Date</th>
              <th>Price</th>
              <th>Charges</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.noData}>No sold properties found</td>
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
                    <div className={styles.soldDateContainer}>
                      {property.soldDate ? (
                        <>
                          <i className="icon-calendar" />
                          <span className={styles.soldDate}>{formatDate(property.soldDate)}</span>
                        </>
                      ) : (
                        <span className={styles.noSoldDate}>Not set</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {formatPriceWithCurrency(property.propertyPrice, property.currency)}
                  </td>
                  <td>
                    {editingChargesId === property._id ? (
                      <div className={styles.chargesEdit}>
                        <input
                          type="number"
                          className={styles.chargesInput}
                          value={chargesValue}
                          onChange={(e) => setChargesValue(e.target.value)}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                        <div className={styles.chargesActions}>
                          <button
                            className={`${styles.btn} ${styles.btnSave}`}
                            onClick={() => handleSaveCharges(property._id)}
                          >
                            Save
                          </button>
                          <button
                            className={`${styles.btn} ${styles.btnCancel}`}
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.chargesDisplay}>
                        <span className={styles.chargesAmount}>
                          {formatPriceWithCurrency(property.soldCharges ?? 0, property.currency)}
                        </span>
                        <button
                          className={`${styles.btn} ${styles.btnEdit}`}
                          onClick={() => handleEditCharges(property)}
                          title="Edit charges"
                        >
                          Edit
                        </button>
                      </div>
                    )}
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

