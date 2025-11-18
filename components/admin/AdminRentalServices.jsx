"use client";
import React, { useState, useEffect } from "react";
import { adminAPI } from "@/apis";
import LocationLoader from "@/components/common/LocationLoader";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import styles from "./AdminRentalServices.module.css";

export default function AdminRentalServices() {
  const { showSuccessModal, showWarningModal } = useGlobalModal();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    propertyType: "",
    ownerEmail: "",
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchRentals();
  }, [filters]);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllRentalServices(filters);
      setRentals(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load rental services");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleEdit = (rental) => {
    setEditingId(rental._id);
    setEditForm({
      status: rental.status,
      notes: rental.notes || "",
      inspectionDate: rental.inspectionDate ? new Date(rental.inspectionDate).toISOString().split('T')[0] : ""
    });
  };

  const handleSave = async (id) => {
    try {
      await adminAPI.updateRentalService(id, editForm);
      showSuccessModal("Success", "Rental service updated successfully");
      setEditingId(null);
      setEditForm({});
      fetchRentals();
    } catch (err) {
      showWarningModal("Error", err.message || "Failed to update rental service");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this rental service request?")) return;
    
    try {
      await adminAPI.deleteRentalService(id);
      showSuccessModal("Success", "Rental service deleted successfully");
      fetchRentals();
    } catch (err) {
      showWarningModal("Error", err.message || "Failed to delete rental service");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending": return styles.badgePending;
      case "under_review": return styles.badgeReview;
      case "inspected": return styles.badgeInspected;
      case "agreement_sent": return styles.badgeAgreement;
      case "agreed": return styles.badgeAgreed;
      case "rejected": return styles.badgeRejected;
      default: return styles.badgeDefault;
    }
  };

  if (loading && rentals.length === 0) {
    return (
      <div className={styles.loaderContainer}>
        <LocationLoader message="Loading rental services..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Rental Services Management</h1>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <select
            className={styles.selectInput}
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="inspected">Inspected</option>
            <option value="agreement_sent">Agreement Sent</option>
            <option value="agreed">Agreed</option>
            <option value="rejected">Rejected</option>
          </select>
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
            placeholder="Owner Email"
            className={styles.searchInput}
            value={filters.ownerEmail}
            onChange={(e) => handleFilterChange("ownerEmail", e.target.value)}
          />
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Rentals Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Owner</th>
              <th>Property</th>
              <th>Location</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rentals.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.noData}>No rental services found</td>
              </tr>
            ) : (
              rentals.map((rental) => (
                <tr key={rental._id}>
                  <td>
                    <div className={styles.ownerInfo}>
                      <strong>{rental.ownerName}</strong>
                      <span>{rental.ownerEmail}</span>
                      <span>{rental.ownerPhone}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.propertyInfo}>
                      <strong>{rental.propertyType}</strong>
                      <span>{rental.propertySize} sqm</span>
                      <span>{rental.bedrooms} bed, {rental.bathrooms} bath</span>
                    </div>
                  </td>
                  <td>{rental.location}</td>
                  <td>
                    {editingId === rental._id ? (
                      <select
                        className={styles.statusSelect}
                        value={editForm.status}
                        onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                      >
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="inspected">Inspected</option>
                        <option value="agreement_sent">Agreement Sent</option>
                        <option value="agreed">Agreed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    ) : (
                      <span className={`${styles.badge} ${getStatusBadgeClass(rental.status)}`}>
                        {rental.status.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingId === rental._id ? (
                      <input
                        type="date"
                        className={styles.dateInput}
                        value={editForm.inspectionDate}
                        onChange={(e) => setEditForm(prev => ({ ...prev, inspectionDate: e.target.value }))}
                      />
                    ) : (
                      rental.inspectionDate 
                        ? new Date(rental.inspectionDate).toLocaleDateString()
                        : "-"
                    )}
                  </td>
                  <td>
                    {editingId === rental._id ? (
                      <div className={styles.actions}>
                        <button
                          className={`${styles.btn} ${styles.btnSave}`}
                          onClick={() => handleSave(rental._id)}
                        >
                          Save
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnCancel}`}
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className={styles.actions}>
                        <button
                          className={`${styles.btn} ${styles.btnEdit}`}
                          onClick={() => handleEdit(rental)}
                        >
                          Edit
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnDelete}`}
                          onClick={() => handleDelete(rental._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
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
    </div>
  );
}

