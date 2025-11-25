"use client";
import React, { useState, useEffect } from "react";
import Header1 from "@/components/headers/Header1";
import Sidebar from "@/components/dashboard/Sidebar";
import RouteGuard from "@/components/common/RouteGuard";
import { AdminTabContext, TABS } from "@/components/admin/AdminDashboardMain";
import styles from "./AdminLayout.module.css";

// Import CSS files for admin pages
import "../../public/main.scss";
import "../../public/css/components.css";
import "odometer/themes/odometer-theme-default.css";
import "photoswipe/style.css";
import "rc-slider/assets/index.css";

export default function AdminLayout({ children }) {
  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);

  // Initialize Bootstrap and other client-side scripts
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm").then(() => {});
    }
  }, []);

  return (
    <RouteGuard requiredRole="admin">
      <AdminTabContext.Provider value={{ activeTab, setActiveTab }}>
        <div className="bg-dashboard">
          <div id="wrapper" className="bg-4">
            <Header1 parentClass="header dashboard" />
            <div className="page-layout">
              <Sidebar />
              <main className={styles.mainContent}>
                {children}
              </main>
            </div>
          </div>
        </div>
      </AdminTabContext.Provider>
    </RouteGuard>
  );
}

