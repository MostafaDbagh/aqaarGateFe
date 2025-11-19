"use client";
import React, { useState, useEffect } from "react";
import { adminAPI } from "@/apis";
import LocationLoader from "@/components/common/LocationLoader";
import styles from "../../app/admin/overview/AdminDashboard.module.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getDashboardStats();
        setStats(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <LocationLoader message="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className="icon-home" />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats?.properties?.total || 0}</h3>
            <p className={styles.statLabel}>Total Properties</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPending}`}>
            <i className="icon-clock" />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats?.properties?.pending || 0}</h3>
            <p className={styles.statLabel}>Pending Approval</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconApproved}`}>
            <i className="icon-check" />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats?.properties?.approved || 0}</h3>
            <p className={styles.statLabel}>Approved Properties</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconRejected}`}>
            <i className="icon-close" />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats?.properties?.rejected || 0}</h3>
            <p className={styles.statLabel}>Rejected Properties</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconContact}`}>
            <i className="icon-mail" />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats?.contacts?.total || 0}</h3>
            <p className={styles.statLabel}>Contact Requests</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconRental}`}>
            <i className="icon-home" />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats?.rentalServices?.total || 0}</h3>
            <p className={styles.statLabel}>Rental Services</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPending}`}>
            <i className="icon-clock" />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats?.rentalServices?.pending || 0}</h3>
            <p className={styles.statLabel}>Pending Rental Requests</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconAgent}`}>
            <i className="icon-user" />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats?.agents?.total || 0}</h3>
            <p className={styles.statLabel}>Total Agents</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconBlocked}`}>
            <i className="icon-close" />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats?.agents?.blocked || 0}</h3>
            <p className={styles.statLabel}>Blocked Agents</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconSold}`}>
            <i className="icon-sale" />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats?.properties?.sold || 0}</h3>
            <p className={styles.statLabel}>Sold Properties</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconDeleted}`}>
            <i className="icon-trashcan" />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats?.properties?.deleted || 0}</h3>
            <p className={styles.statLabel}>Deleted Properties</p>
          </div>
        </div>
      </div>
    </div>
  );
}

