"use client";
import React, { useState, useEffect } from "react";
import { adminAPI } from "@/apis";
import { listingAPI } from "@/apis/listing";
import LocationLoader from "@/components/common/LocationLoader";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import PropertyDetailsModal from "./PropertyDetailsModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import EditPropertyModal from "../modals/EditPropertyModal";
import styles from "./AdminProperties.module.css";
import { formatPriceWithCurrency } from "@/utlis/propertyHelpers";
import { UserIcon } from "@/components/icons";
import { useQueryClient } from '@tanstack/react-query';

export default function AdminProperties() {
  const { showSuccessModal, showWarningModal } = useGlobalModal();
  const queryClient = useQueryClient();
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [featuredLoadingId, setFeaturedLoadingId] = useState(null);
  const [vipLoadingId, setVipLoadingId] = useState(null);

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
      // Invalidate all listing-related queries to ensure fresh data everywhere
      queryClient.invalidateQueries(['my-listings']);
      queryClient.invalidateQueries(['listings']);
      queryClient.invalidateQueries(['listing']);
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

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    setSelectedProperty(null);
    fetchProperties();
    queryClient.invalidateQueries(['my-listings']);
    queryClient.invalidateQueries(['listings']);
    queryClient.invalidateQueries(['listing']);
  };

  const handleToggleFeatured = async (property) => {
    const id = property._id;
    const nextFeatured = !property.isFeatured;
    setFeaturedLoadingId(id);
    try {
      await listingAPI.setListingFeatured(id, nextFeatured);
      setProperties((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isFeatured: nextFeatured } : p))
      );
      showSuccessModal("Success", nextFeatured ? "Listing featured in Fresh Listings" : "Listing unfeatured");
    } catch (err) {
      showWarningModal("Error", err?.message || "Failed to update featured");
    } finally {
      setFeaturedLoadingId(null);
    }
  };

  const handleToggleVip = async (property) => {
    const id = property._id;
    const nextVip = !property.isVip;
    setVipLoadingId(id);
    try {
      await listingAPI.setListingVip(id, nextVip);
      setProperties((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isVip: nextVip } : p))
      );
      showSuccessModal("Success", nextVip ? "Listing marked as VIP" : "Listing removed from VIP");
    } catch (err) {
      showWarningModal("Error", err?.message || "Failed to update VIP");
    } finally {
      setVipLoadingId(null);
    }
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
                    {formatPriceWithCurrency(property.propertyPrice, property.currency)}
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
                      <button
                        className={`${styles.btn} ${styles.btnEdit}`}
                        onClick={() => handleEditProperty(property)}
                        title="Edit property"
                      >
                        Edit
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnFeatured} ${property.isFeatured ? styles.btnFeaturedActive : ''}`}
                        onClick={() => handleToggleFeatured(property)}
                        disabled={featuredLoadingId === property._id}
                        title={property.isFeatured ? "Featured in Fresh Listings (click to remove)" : "Feature for Fresh Listings"}
                      >
                        {featuredLoadingId === property._id ? "..." : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={property.isFeatured ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        )}
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnVip} ${property.isVip ? styles.btnVipActive : ''}`}
                        onClick={() => handleToggleVip(property)}
                        disabled={vipLoadingId === property._id}
                        title={property.isVip ? "Remove from VIP listing" : "Mark as VIP listing"}
                      >
                        {vipLoadingId === property._id ? "..." : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M4 8L6 20H18L20 8M4 8L5.71624 9.37299C6.83218 10.2657 7.39014 10.7121 7.95256 10.7814C8.4453 10.8421 8.94299 10.7173 9.34885 10.4314C9.81211 10.1051 10.0936 9.4483 10.6565 8.13476L12 5M4 8C4.55228 8 5 7.55228 5 7C5 6.44772 4.55228 6 4 6C3.44772 6 3 6.44772 3 7C3 7.55228 3.44772 8 4 8ZM20 8L18.2838 9.373C17.1678 10.2657 16.6099 10.7121 16.0474 10.7814C15.5547 10.8421 15.057 10.7173 14.6511 10.4314C14.1879 10.1051 13.9064 9.4483 13.3435 8.13476L12 5M20 8C20.5523 8 21 7.55228 21 7C21 6.44772 20.5523 6 20 6C19.4477 6 19 6.44772 19 7C19 7.55228 19.4477 8 20 8ZM12 5C12.5523 5 13 4.55228 13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4C11 4.55228 11.4477 5 12 5ZM12 4H12.01M20 7H20.01M4 7H4.01" />
                          </svg>
                        )}
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

      {/* Edit Property Modal */}
      {editModalOpen && selectedProperty && (
        <EditPropertyModal
          isOpen={editModalOpen}
          onClose={() => { setEditModalOpen(false); setSelectedProperty(null); }}
          property={selectedProperty}
          onSuccess={handleEditSuccess}
        />
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

