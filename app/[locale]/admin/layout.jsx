"use client";
import React, { useState, useEffect } from "react";
import Header1 from "@/components/headers/Header1";
import Sidebar from "@/components/dashboard/Sidebar";
import RouteGuard from "@/components/common/RouteGuard";
import { AdminTabContext, TABS } from "@/components/admin/AdminDashboardMain";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import styles from "./AdminLayout.module.css";

// Import CSS files for admin pages
import "../../../public/main.scss";
import "../../../public/css/components.css";
import "odometer/themes/odometer-theme-default.css";
import "photoswipe/style.css";
import "rc-slider/assets/index.css";

export default function AdminLayout({ children }) {
  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Force English locale for admin pages - check both locale and pathname
    if (typeof window === 'undefined') return;
    
    const currentPath = window.location.pathname;
    const isArabicPath = currentPath.startsWith('/ar/') || currentPath === '/ar';
    const needsRedirect = locale !== 'en' || isArabicPath;
    
    if (needsRedirect) {
      setIsRedirecting(true);
      
      // Remove current locale from pathname
      let pathWithoutLocale = currentPath.replace(/^\/(en|ar)/, '') || '';
      if (!pathWithoutLocale.startsWith('/')) {
        pathWithoutLocale = '/' + pathWithoutLocale;
      }
      
      // Redirect to /en version
      const newPath = `/en${pathWithoutLocale}`;
      
      // Use window.location.href for immediate redirect
      if (currentPath !== newPath) {
        window.location.href = newPath;
      }
    }
  }, [locale, pathname]);

  // Initialize Bootstrap and other client-side scripts
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm").then(() => {});
    }
  }, []);

  // Show loading state while redirecting
  if (isRedirecting) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Redirecting to English...
      </div>
    );
  }

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

