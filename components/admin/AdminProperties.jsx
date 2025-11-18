"use client";
import React, { useState, useEffect } from "react";
import { adminAPI } from "@/apis";
import LocationLoader from "@/components/common/LocationLoader";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
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

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    
    try {
      await adminAPI.deleteProperty(id);
      showSuccessModal("Success", "Property deleted successfully");
      fetchProperties();
    } catch (err) {
      showWarningModal("Error", err.message || "Failed to delete property");
    }
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
              <th>Agent</th>
              <th>Price</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.length === 0 ? (
              <tr>
                <td colSpan="9" className={styles.noData}>No properties found</td>
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
                    {property.agentId ? (
                      <div className={styles.agentInfo}>
                        <div className={styles.agentNameRow}>
                          <UserIcon width={14} height={14} stroke="currentColor" />
                          <span className={styles.agentName}>
                            {property.agentId.username || property.agentId.email || "Unknown"}
                          </span>
                          {property.agentId.isBlocked && (
                            <span className={`${styles.badge} ${styles.badgeBlockedAgent}`}>
                              Blocked
                            </span>
                          )}
                        </div>
                        {property.agentId.email && (
                          <span className={styles.agentEmail}>{property.agentId.email}</span>
                        )}
                      </div>
                    ) : (
                      <span className={styles.noAgent}>No Agent</span>
                    )}
                  </td>
                  <td>
                    {property.propertyPrice} {property.currency || "USD"}
                  </td>
                  <td>{property.city}, {property.country}</td>
                  <td>
                    <div className={styles.actions}>
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
                        onClick={() => handleDelete(property._id)}
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
    </div>
  );
}

