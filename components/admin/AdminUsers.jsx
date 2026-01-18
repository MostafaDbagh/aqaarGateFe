"use client";
import React, { useState, useEffect } from "react";
import { adminAPI } from "@/apis";
import LocationLoader from "@/components/common/LocationLoader";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import styles from "./AdminUsers.module.css";
import { UserIcon, PhoneIcon, EmailIcon } from "@/components/icons";

export default function AdminUsers() {
  const { showSuccessModal, showWarningModal } = useGlobalModal();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    isBlocked: "",
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers(filters);
      setUsers(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleDeleteUser = async (userId) => {
    const user = users.find(u => u._id === userId);
    const userName = user?.username || user?.email || 'this user';
    
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingUserId(userId);
      await adminAPI.deleteUser(userId);
      showSuccessModal("Success", "User deleted successfully");
      fetchUsers();
    } catch (err) {
      showWarningModal("Error", err.message || "Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className={styles.loaderContainer}>
        <LocationLoader message="Loading users..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Users</h1>
      <p className={styles.subtitle}>View all registered users (read-only)</p>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <input
            type="text"
            placeholder="Search users..."
            className={styles.searchInput}
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <select
            className={styles.selectInput}
            value={filters.role}
            onChange={(e) => handleFilterChange("role", e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <select
            className={styles.selectInput}
            value={filters.isBlocked}
            onChange={(e) => handleFilterChange("isBlocked", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="false">Active</option>
            <option value="true">Blocked</option>
          </select>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Users Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User Details</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Status</th>
              <th>Company/Job</th>
              <th>Location</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.noData}>No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.userNameRow}>
                        <UserIcon width={18} height={18} stroke="currentColor" />
                        <strong>{user.username || user.email || 'N/A'}</strong>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.contactInfo}>
                      <div className={styles.contactRow}>
                        <EmailIcon width={16} height={16} stroke="currentColor" />
                        <span>{user.email || '-'}</span>
                      </div>
                      {user.phone && (
                        <div className={styles.contactRow}>
                          <PhoneIcon width={16} height={16} stroke="currentColor" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    {(() => {
                      const role = user.role || 'user';
                      const roleCapitalized = role.charAt(0).toUpperCase() + role.slice(1);
                      const badgeClass = styles[`badge${roleCapitalized}`] || styles.badgeUser;
                      return (
                        <span className={`${styles.badge} ${badgeClass}`}>
                          {role}
                        </span>
                      );
                    })()}
                  </td>
                  <td>
                    {user.isBlocked ? (
                      <span className={`${styles.badge} ${styles.badgeBlocked}`}>
                        Blocked
                      </span>
                    ) : (
                      <span className={`${styles.badge} ${styles.badgeActive}`}>
                        Active
                      </span>
                    )}
                  </td>
                  <td>
                    <div className={styles.companyInfo}>
                      {user.company && <span>{user.company}</span>}
                      {user.job && <span className={styles.jobText}>{user.job}</span>}
                      {!user.company && !user.job && <span>-</span>}
                    </div>
                  </td>
                  <td>{user.location || '-'}</td>
                  <td>
                    {user.createdAt ? (
                      <span className={styles.dateText}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {user.role !== 'admin' ? (
                      <button
                        className={`${styles.deleteBtn} ${deletingUserId === user._id ? styles.deleteBtnLoading : ''}`}
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={deletingUserId === user._id}
                      >
                        {deletingUserId === user._id ? 'Deleting...' : 'Delete'}
                      </button>
                    ) : (
                      <span className={styles.noAction}>-</span>
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
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
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

