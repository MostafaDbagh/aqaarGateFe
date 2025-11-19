"use client";
import React, { useEffect } from "react";
import AddProperty from "../dashboard/AddProperty";
import styles from "./AdminAddProperty.module.css";

/**
 * AdminAddProperty Component
 * 
 * This component wraps the AddProperty component for admin use.
 * It reuses the same form and functionality as the agent add property page,
 * but is accessible from the admin dashboard.
 * Properties added by admin are auto-approved and use admin@aqaargate.com as agent.
 */
export default function AdminAddProperty() {
  useEffect(() => {
    // Add class to main-content and main-content-inner to target styling
    const mainContent = document.querySelector('.page-layout .main-content');
    const mainContentInner = document.querySelector('.page-layout .main-content-inner');
    
    if (mainContent) {
      mainContent.classList.add('admin-add-property-page');
    }
    if (mainContentInner) {
      mainContentInner.classList.add('admin-add-property-page-inner');
    }
    
    return () => {
      // Cleanup on unmount
      if (mainContent) {
        mainContent.classList.remove('admin-add-property-page');
      }
      if (mainContentInner) {
        mainContentInner.classList.remove('admin-add-property-page-inner');
      }
    };
  }, []);

  return (
    <div className={styles.adminAddPropertyContainer} data-page="add-property">
      <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>
        Add New Property
      </h1>
      <AddProperty isAdminMode={true} />
    </div>
  );
}

