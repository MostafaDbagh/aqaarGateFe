"use client";
import React, { useState, useEffect } from "react";
import { adminAPI } from "@/apis";
import LocationLoader from "@/components/common/LocationLoader";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import PropertyDetailsModal from "./PropertyDetailsModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import styles from "./AdminProperties.module.css";
import { UserIcon } from "@/components/icons";

export default function AdminProperties() {
  const { showSuccessModal, showWarningModal } = useGlobalModal();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    approvalStatus: "",
    propertyType: "",
    city: "",
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    propertyId: null,
    loading: false
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllProperties(filters);
      setProperties(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleApproval = async (id, approvalStatus) => {
    // Check if trying to approve and agent is blocked
    if (approvalStatus === "approved") {
      const property = properties.find(p => p._id === id);
      if (property && property.agentId) {
        const agent = property.agentId;
        if (agent && agent.isBlocked) {
          showWarningModal(
            "Cannot Approve Property",
            `The agent (${agent.username || agent.email}) is blocked. You cannot approve properties from blocked agents. Please unblock the agent first.`
          );
          return;
        }
      }
    }

    try {
      await adminAPI.updatePropertyApproval(id, approvalStatus);
      showSuccessModal(
        "Success",
        `Property ${approvalStatus} successfully`
      );
      fetchProperties();
    } catch (err) {
      const errorMessage = err.message || err.error?.message || "Failed to update property approval";
      showWarningModal(
        "Error",
        errorMessage
      );
    }
  };

  const handleDelete = async (id, deletedReason) => {
    if (!deletedReason || !deletedReason.trim()) {
      showWarningModal("Error", "Please provide a reason for deletion");
      return;
    }
    
    try {
      setDeleteModal(prev => ({ ...prev, loading: true }));
      await adminAPI.deleteProperty(id, deletedReason);
      showSuccessModal("Success", "Property deleted successfully");
      setDeleteModal({ isOpen: false, propertyId: null, loading: false });
      // Force page reload after successful deletion
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setDeleteModal(prev => ({ ...prev, loading: false }));
      showWarningModal("Error", err.message || "Failed to delete property");
    }
  };

  const handleDeleteClick = (property) => {
    setDeleteModal({
      isOpen: true,
      propertyId: property._id,
      loading: false
    });
  };

  const handleViewDetails = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedPropertyId(null);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved": return styles.badgeApproved;
      case "pending": return styles.badgePending;
      case "rejected": return styles.badgeRejected;
      case "closed": return styles.badgeClosed;
      default: return styles.badgeDefault;
    }
  };

  if (loading && properties.length === 0) {
    return (
      <div className={styles.loaderContainer}>
        <LocationLoader message="Loading properties..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Properties Management</h1>

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
            value={filters.approvalStatus}
            onChange={(e) => handleFilterChange("approvalStatus", e.target.value)}
          >
            <option value="">All Approval Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <select
            className={styles.selectInput}
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
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
              <th>Status</th>
              <th>Approval</th>
              <th>Price</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.noData}>No properties found</td>
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
                    <span className={`${styles.badge} ${styles.badgeStatus}`}>
                      {property.status}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${getStatusBadgeClass(property.approvalStatus)}`}>
                      {property.approvalStatus}
                    </span>
                  </td>
                  <td>
                    {property.propertyPrice} {property.currency || "USD"}
                  </td>
                  <td>{property.city}, {property.country}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.btn} ${styles.btnView}`}
                        onClick={() => handleViewDetails(property._id)}
                        title="View full property details with images"
                      >
                        View Details
                      </button>
                      {property.approvalStatus === "pending" && (
                        <>
                          <button
                            className={`${styles.btn} ${styles.btnApprove}`}
                            onClick={() => handleApproval(property._id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            className={`${styles.btn} ${styles.btnReject}`}
                            onClick={() => handleApproval(property._id, "rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {property.approvalStatus === "approved" && (
                        <button
                          className={`${styles.btn} ${styles.btnPending}`}
                          onClick={() => handleApproval(property._id, "pending")}
                        >
                          Pending
                        </button>
                      )}
                      <button
                        className={`${styles.btn} ${styles.btnDelete}`}
                        onClick={() => handleDeleteClick(property)}
                      >
                        Delete
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
        onApprove={handleApproval}
        onReject={(id) => handleApproval(id, "rejected")}
        onDelete={handleDeleteClick}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, propertyId: null, loading: false })}
        onConfirm={(deletedReason) => {
          if (deleteModal.propertyId) {
            handleDelete(deleteModal.propertyId, deletedReason);
          }
        }}
        title="Delete Property"
        message="Please provide a reason for deleting this property. This property will be marked as deleted."
        confirmText="Delete Property"
        confirmColor="#dc3545"
        loading={deleteModal.loading}
        showInput={true}
        inputLabel="Reason for deletion"
        inputPlaceholder="Enter the reason for deleting this property..."
        inputRequired={true}
      />
    </div>
  );
}

