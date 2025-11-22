"use client";
import React, { useState, useEffect } from "react";
import { adminAPI } from "@/apis";
import LocationLoader from "@/components/common/LocationLoader";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import styles from "./AdminAgents.module.css";
import { UserIcon, PhoneIcon, EmailIcon } from "@/components/icons";

export default function AdminAgents() {
  const { showSuccessModal, showWarningModal } = useGlobalModal();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    isBlocked: "", // Show all agents by default
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchAgents();
  }, [filters]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllAgents(filters);
      setAgents(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleBlock = async (id) => {
    const agent = agents.find(a => a._id === id);
    setSelectedAgent(agent);
    setShowBlockModal(true);
  };

  const confirmBlock = async () => {
    if (!blockReason || !blockReason.trim()) {
      showWarningModal("Error", "Please provide a reason for blocking");
      return;
    }

    try {
      await adminAPI.blockAgent(selectedAgent._id, blockReason);
      showSuccessModal(
        "Success",
        "Agent blocked successfully. All their listings have been set to pending."
      );
      setShowBlockModal(false);
      setBlockReason("");
      setSelectedAgent(null);
      fetchAgents();
    } catch (err) {
      showWarningModal("Error", err.message || "Failed to block agent");
    }
  };

  const handleUnblock = async (id) => {
    if (!confirm("Are you sure you want to unblock this agent?")) return;

    try {
      await adminAPI.unblockAgent(id);
      showSuccessModal("Success", "Agent unblocked successfully");
      fetchAgents();
    } catch (err) {
      showWarningModal("Error", err.message || "Failed to unblock agent");
    }
  };

  if (loading && agents.length === 0) {
    return (
      <div className={styles.loaderContainer}>
        <LocationLoader message="Loading agents..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Agents Management</h1>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <input
            type="text"
            placeholder="Search agents..."
            className={styles.searchInput}
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <select
            className={styles.selectInput}
            value={filters.isBlocked}
            onChange={(e) => handleFilterChange("isBlocked", e.target.value)}
          >
            <option value="">All Agents</option>
            <option value="false">Active</option>
            <option value="true">Blocked</option>
          </select>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Agents Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Agent Details</th>
              <th>Contact</th>
              <th>Company</th>
              <th>Listings</th>
              <th>Status</th>
              <th>Blocked Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.length === 0 ? (
              <tr>
                <td colSpan="7" className={styles.noData}>No agents found</td>
              </tr>
            ) : (
              agents.map((agent) => (
                <tr key={agent._id}>
                  <td>
                    <div className={styles.agentInfo}>
                      <div className={styles.agentNameRow}>
                        <UserIcon width={18} height={18} stroke="currentColor" />
                        <strong>{agent.username || agent.email}</strong>
                      </div>
                      {agent.location && (
                        <span className={styles.agentLocation}>{agent.location}</span>
                      )}
                      {agent.createdAt && (
                        <span className={styles.agentDate}>
                          Joined: {new Date(agent.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.contactInfo}>
                      <div className={styles.contactRow}>
                        <EmailIcon width={16} height={16} stroke="currentColor" />
                        <span>{agent.email}</span>
                      </div>
                      {agent.phone && (
                        <div className={styles.contactRow}>
                          <PhoneIcon width={16} height={16} stroke="currentColor" />
                          <span>{agent.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{agent.company || "-"}</td>
                  <td>
                    <span className={styles.listingCount}>{agent.listingCount || 0}</span>
                  </td>
                  <td>
                    {agent.isBlocked ? (
                      <span className={`${styles.badge} ${styles.badgeBlocked}`}>
                        {agent.blockedReason?.includes('New agent') ? 'Pending Verification' : 'Blocked'}
                      </span>
                    ) : (
                      <span className={`${styles.badge} ${styles.badgeActive}`}>
                        Active
                      </span>
                    )}
                  </td>
                  <td className={styles.reasonCell}>
                    {agent.blockedReason || "-"}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {agent.isBlocked ? (
                        <button
                          className={`${styles.btn} ${styles.btnUnblock}`}
                          onClick={() => handleUnblock(agent._id)}
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          className={`${styles.btn} ${styles.btnBlock}`}
                          onClick={() => handleBlock(agent._id)}
                        >
                          Block
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Block Modal */}
      {showBlockModal && (
        <div className={styles.modalOverlay} onClick={() => setShowBlockModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Block Agent</h3>
            <p className={styles.modalSubtitle}>
              Are you sure you want to block <strong>{selectedAgent?.username || selectedAgent?.email}</strong>?
            </p>
            <div className={styles.modalForm}>
              <label className={styles.modalLabel}>
                Reason for blocking:
              </label>
              <textarea
                className={styles.modalTextarea}
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Enter the reason for blocking this agent..."
                rows={4}
              />
            </div>
            <div className={styles.modalActions}>
              <button
                className={`${styles.btn} ${styles.btnCancel}`}
                onClick={() => {
                  setShowBlockModal(false);
                  setBlockReason("");
                  setSelectedAgent(null);
                }}
              >
                Cancel
              </button>
              <button
                className={`${styles.btn} ${styles.btnBlock}`}
                onClick={confirmBlock}
              >
                Confirm Block
              </button>
            </div>
          </div>
        </div>
      )}

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

